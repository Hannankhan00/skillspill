import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// ─── DELETE /api/spill/comments/[id] — Delete own comment ───
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { id } = await params;

        const comment = await prisma.spillComment.findUnique({ where: { id } });
        if (!comment) return NextResponse.json({ error: "Comment not found" }, { status: 404 });
        if (comment.userId !== session.userId) {
            return NextResponse.json({ error: "Not authorized" }, { status: 403 });
        }

        await prisma.spillComment.delete({ where: { id } });
        await prisma.spillPost.update({
            where: { id: comment.postId },
            data: { commentsCount: { decrement: 1 } },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete comment error:", error);
        return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 });
    }
}
