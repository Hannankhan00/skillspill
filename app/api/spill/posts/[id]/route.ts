import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// ─── PATCH /api/spill/posts/[id] — Edit caption ───
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { id } = await params;
        const { caption } = await req.json();

        if (caption && caption.length > 500) {
            return NextResponse.json({ error: "Caption max 500 characters" }, { status: 400 });
        }

        const post = await prisma.spillPost.findUnique({ where: { id } });
        if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });
        if (post.userId !== session.userId) {
            return NextResponse.json({ error: "Not authorized" }, { status: 403 });
        }

        const updated = await prisma.spillPost.update({
            where: { id },
            data: { caption },
        });

        return NextResponse.json({ post: updated });
    } catch (error) {
        console.error("Update post error:", error);
        return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
    }
}

// ─── DELETE /api/spill/posts/[id] — Delete post ───
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { id } = await params;

        const post = await prisma.spillPost.findUnique({ where: { id } });
        if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });
        if (post.userId !== session.userId) {
            return NextResponse.json({ error: "Not authorized" }, { status: 403 });
        }

        await prisma.spillPost.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete post error:", error);
        return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
    }
}
