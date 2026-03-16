import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// ─── POST /api/spill/posts/[id]/like — Toggle like ───
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

        const existing = await prisma.spillLike.findUnique({
            where: { postId_userId: { postId: id, userId: session.userId } },
        });

        if (existing) {
            await prisma.spillLike.delete({ where: { id: existing.id } });
            await prisma.spillPost.update({
                where: { id },
                data: { likesCount: { decrement: 1 } },
            });
            return NextResponse.json({ liked: false, likesCount: post.likesCount - 1 });
        } else {
            await prisma.spillLike.create({
                data: { postId: id, userId: session.userId },
            });
            await prisma.spillPost.update({
                where: { id },
                data: { likesCount: { increment: 1 } },
            });
            return NextResponse.json({ liked: true, likesCount: post.likesCount + 1 });
        }
    } catch (error) {
        console.error("Like error:", error);
        return NextResponse.json({ error: "Failed to toggle like" }, { status: 500 });
    }
}
