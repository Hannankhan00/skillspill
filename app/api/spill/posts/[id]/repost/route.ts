import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// ─── POST /api/spill/posts/[id]/repost — Toggle repost ───
// Uses an interactive transaction to prevent race conditions.
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { id } = await params;

        const result = await prisma.$transaction(async (tx) => {
            const post = await tx.spillPost.findUnique({ where: { id } });
            if (!post) throw new Error("NOT_FOUND");

            const existing = await tx.spillRepost.findUnique({
                where: { originalId_userId: { originalId: id, userId: session.userId } },
            });

            if (existing) {
                await tx.spillRepost.delete({ where: { id: existing.id } });
                const updated = await tx.spillPost.update({
                    where: { id },
                    data: { repostsCount: { decrement: 1 } },
                    select: { repostsCount: true },
                });
                if (updated.repostsCount < 0) {
                    const corrected = await tx.spillPost.update({
                        where: { id },
                        data: { repostsCount: 0 },
                        select: { repostsCount: true },
                    });
                    return { reposted: false, repostsCount: corrected.repostsCount };
                }
                return { reposted: false, repostsCount: updated.repostsCount };
            } else {
                await tx.spillRepost.create({
                    data: { originalId: id, userId: session.userId },
                });
                const updated = await tx.spillPost.update({
                    where: { id },
                    data: { repostsCount: { increment: 1 } },
                    select: { repostsCount: true },
                });
                return { reposted: true, repostsCount: updated.repostsCount };
            }
        });

        return NextResponse.json(result);
    } catch (error: any) {
        if (error?.message === "NOT_FOUND") {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }
        console.error("Repost error:", error);
        return NextResponse.json({ error: "Failed to toggle repost" }, { status: 500 });
    }
}
