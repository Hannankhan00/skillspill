import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// ─── GET /api/spill/posts/saved — User's bookmarked posts ───
export async function GET(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const cursor = searchParams.get("cursor");
        const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 20);

        const where: any = { userId: session.userId };
        if (cursor) {
            where.createdAt = { lt: new Date(cursor) };
        }

        const saves = await prisma.spillSave.findMany({
            where,
            orderBy: { createdAt: "desc" },
            take: limit,
            include: {
                post: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                fullName: true,
                                username: true,
                                avatarUrl: true,
                                role: true,
                                recruiterProfile: { select: { companyName: true } },
                                talentProfile: { select: { githubConnected: true, githubStars: true } },
                            },
                        },
                        media: { orderBy: { sortOrder: "asc" } },
                        likes: {
                            where: { userId: session.userId },
                            select: { id: true },
                        },
                        saves: {
                            where: { userId: session.userId },
                            select: { id: true },
                        },
                        reposts: {
                            where: { userId: session.userId },
                            select: { id: true },
                        },
                    },
                },
            },
        });

        const posts = saves.map((save) => ({
            ...save.post,
            hashtags: save.post.hashtags ? JSON.parse(save.post.hashtags) : [],
            hiringSkills: save.post.hiringSkills ? JSON.parse(save.post.hiringSkills) : [],
            isLiked: save.post.likes.length > 0,
            isSaved: true,
            isReposted: save.post.reposts.length > 0,
            likes: undefined,
            saves: undefined,
            reposts: undefined,
        }));

        const nextCursor = saves.length === limit
            ? saves[saves.length - 1].createdAt.toISOString()
            : null;

        return NextResponse.json({ posts, nextCursor, hasMore: saves.length === limit });
    } catch (error) {
        console.error("Saved posts error:", error);
        return NextResponse.json({ error: "Failed to fetch saved posts" }, { status: 500 });
    }
}
