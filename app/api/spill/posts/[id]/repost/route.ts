import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// ─── POST /api/spill/posts/[id]/repost — Toggle repost ───
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { id } = await params;

        const post = await prisma.spillPost.findUnique({ where: { id } });
        if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

        const existing = await prisma.spillRepost.findUnique({
            where: { originalId_userId: { originalId: id, userId: session.userId } },
        });

        if (existing) {
            await prisma.spillRepost.delete({ where: { id: existing.id } });
            await prisma.spillPost.update({
                where: { id },
                data: { repostsCount: { decrement: 1 } },
            });
            return NextResponse.json({ reposted: false, repostsCount: post.repostsCount - 1 });
        } else {
            await prisma.spillRepost.create({
                data: { originalId: id, userId: session.userId },
            });
            await prisma.spillPost.update({
                where: { id },
                data: { repostsCount: { increment: 1 } },
            });
            return NextResponse.json({ reposted: true, repostsCount: post.repostsCount + 1 });
        }
    } catch (error) {
        console.error("Repost error:", error);
        return NextResponse.json({ error: "Failed to toggle repost" }, { status: 500 });
    }
}
