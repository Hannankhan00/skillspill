import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const userSelect = {
    id: true,
    fullName: true,
    username: true,
    avatarUrl: true,
    role: true,
};

// ─── GET /api/spill/posts/[id]/comments — List comments with nested replies ───
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { id } = await params;
        const { searchParams } = new URL(req.url);
        const take = Math.min(parseInt(searchParams.get("limit") || "50"), 100);

        // Fetch top-level comments (parentId is null) with up to 2 levels of replies
        const comments = await prisma.spillComment.findMany({
            where: { postId: id, parentId: null },
            orderBy: { createdAt: "asc" },
            take,
            include: {
                user: { select: userSelect },
                replies: {
                    orderBy: { createdAt: "asc" },
                    include: {
                        user: { select: userSelect },
                        replies: {
                            orderBy: { createdAt: "asc" },
                            include: {
                                user: { select: userSelect },
                            },
                        },
                    },
                },
            },
        });

        return NextResponse.json({ comments });
    } catch (error) {
        console.error("Comments error:", error);
        return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
    }
}

// ─── POST /api/spill/posts/[id]/comments — Create comment or reply ───
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { id } = await params;
        const { content, parentId } = await req.json();

        if (!content || content.trim() === "" || content.length > 500) {
            return NextResponse.json({ error: "Comment must be 1-500 characters" }, { status: 400 });
        }

        const post = await prisma.spillPost.findUnique({ where: { id } });
        if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

        // If replying, verify parent comment exists and belongs to same post
        if (parentId) {
            const parentComment = await prisma.spillComment.findUnique({ where: { id: parentId } });
            if (!parentComment || parentComment.postId !== id) {
                return NextResponse.json({ error: "Parent comment not found" }, { status: 404 });
            }
        }

        const comment = await prisma.spillComment.create({
            data: {
                postId: id,
                userId: session.userId,
                content: content.trim(),
                parentId: parentId || null,
            },
            include: {
                user: { select: userSelect },
                replies: {
                    include: {
                        user: { select: userSelect },
                    },
                },
            },
        });

        await prisma.spillPost.update({
            where: { id },
            data: { commentsCount: { increment: 1 } },
        });

        return NextResponse.json({ comment }, { status: 201 });
    } catch (error) {
        console.error("Create comment error:", error);
        return NextResponse.json({ error: "Failed to create comment" }, { status: 500 });
    }
}
