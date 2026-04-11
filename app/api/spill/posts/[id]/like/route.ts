import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// ─── POST /api/spill/posts/[id]/like — Toggle like ───
// Always recomputes likesCount from the actual SpillLike row count
// so the counter can never drift, regardless of prior inconsistencies.
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { id } = await params;

        const result = await prisma.$transaction(async (tx) => {
            // Verify post exists
            const post = await tx.spillPost.findUnique({ where: { id }, select: { id: true } });
            if (!post) throw new Error("NOT_FOUND");

            const existing = await tx.spillLike.findUnique({
                where: { postId_userId: { postId: id, userId: session.userId } },
            });

            if (existing) {
                // Unlike — remove the row
                await tx.spillLike.delete({ where: { id: existing.id } });
            } else {
                // Like — add the row
                await tx.spillLike.create({
                    data: { postId: id, userId: session.userId },
                });
            }

            // Always recount from actual rows — self-heals any prior drift
            const realCount = await tx.spillLike.count({ where: { postId: id } });

            // Sync the denormalized counter to the real count
            await tx.spillPost.update({
                where: { id },
                data: { likesCount: realCount },
            });

            return { liked: !existing, likesCount: realCount };
        });

        return NextResponse.json(result);
    } catch (error: any) {
        if (error?.message === "NOT_FOUND") {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }
        console.error("Like error:", error);
        return NextResponse.json({ error: "Failed to toggle like" }, { status: 500 });
    }
}
