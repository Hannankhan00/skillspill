import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// ─── POST /api/spill/posts/[id]/save — Toggle save (bookmark) ───
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

        const existing = await prisma.spillSave.findUnique({
            where: { postId_userId: { postId: id, userId: session.userId } },
        });

        if (existing) {
            await prisma.spillSave.delete({ where: { id: existing.id } });
            return NextResponse.json({ saved: false });
        } else {
            await prisma.spillSave.create({
                data: { postId: id, userId: session.userId },
            });
            return NextResponse.json({ saved: true });
        }
    } catch (error) {
        console.error("Save error:", error);
        return NextResponse.json({ error: "Failed to toggle save" }, { status: 500 });
    }
}
