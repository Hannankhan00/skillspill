import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// ─── GET /api/spill/posts — Feed with cursor pagination ───
export async function GET(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const cursor = searchParams.get("cursor"); // ISO date string
        const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 20);
        const filter = searchParams.get("filter") || "all"; // all, following, trending
        const hashtag = searchParams.get("hashtag");

        const where: any = {
            status: "published",
            visibility: "public",
        };

        if (cursor) {
            where.createdAt = { lt: new Date(cursor) };
        }

        if (hashtag) {
            where.hashtags = { contains: hashtag.toLowerCase() };
        }

        let orderBy: any = { createdAt: "desc" as const };

        if (filter === "trending") {
            orderBy = [
                { likesCount: "desc" as const },
                { createdAt: "desc" as const },
            ];
        }

        const posts = await prisma.spillPost.findMany({
            where,
            orderBy,
            take: limit,
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        username: true,
                        avatarUrl: true,
                        role: true,
                        recruiterProfile: {
                            select: { companyName: true },
                        },
                        talentProfile: {
                            select: { githubConnected: true, githubStars: true },
                        },
                        followers: {
                            where: { followerId: session.userId },
                            select: { id: true }
                        }
                    },
                },
                media: {
                    orderBy: { sortOrder: "asc" },
                },
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
        });

        const formatted = posts.map((post) => ({
            ...post,
            hashtags: post.hashtags ? JSON.parse(post.hashtags) : [],
            hiringSkills: post.hiringSkills ? JSON.parse(post.hiringSkills) : [],
            isLiked: post.likes.length > 0,
            isSaved: post.saves.length > 0,
            isReposted: post.reposts.length > 0,
            isFollowing: post.user.followers?.length > 0,
            user: { ...post.user, followers: undefined },
            likes: undefined,
            saves: undefined,
            reposts: undefined,
        }));

        const nextCursor = posts.length === limit
            ? posts[posts.length - 1].createdAt.toISOString()
            : null;

        return NextResponse.json({
            posts: formatted,
            nextCursor,
            hasMore: posts.length === limit,
        });
    } catch (error) {
        console.error("Feed error:", error);
        return NextResponse.json({ error: "Failed to fetch feed" }, { status: 500 });
    }
}

// ─── POST /api/spill/posts — Create a new post ───
export async function POST(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        const {
            postType = "text",
            caption,
            hashtags = [],
            visibility = "public",
            code,
            codeLang,
            videoUrl,
            thumbnailUrl,
            githubRepoName,
            githubRepoDesc,
            githubRepoLang,
            githubRepoStars,
            githubRepoForks,
            githubRepoUrl,
            hiringTitle,
            hiringSkills = [],
            hiringLocationType,
            hiringCompType,
            hiringDeadline,
            mediaUrls = [],
        } = body;

        // ── Validation ──
        if (caption && caption.length > 500) {
            return NextResponse.json({ error: "Caption max 500 characters" }, { status: 400 });
        }

        if (postType === "text" && (!caption || caption.trim() === "")) {
            return NextResponse.json({ error: "Caption required for text posts" }, { status: 400 });
        }

        if (hashtags.length > 5) {
            return NextResponse.json({ error: "Maximum 5 hashtags" }, { status: 400 });
        }

        for (const tag of hashtags) {
            if (tag.length > 30 || !/^[a-zA-Z0-9_]+$/.test(tag)) {
                return NextResponse.json({ error: `Invalid hashtag: ${tag}` }, { status: 400 });
            }
        }

        // Role-based restrictions
        if (postType === "hiring" && session.role !== "RECRUITER") {
            return NextResponse.json({ error: "Only recruiters can create hiring posts" }, { status: 403 });
        }

        if (postType === "github" && session.role !== "TALENT") {
            return NextResponse.json({ error: "Only talent can create GitHub posts" }, { status: 403 });
        }

        if (postType === "hiring") {
            if (!hiringTitle || hiringTitle.length > 100) {
                return NextResponse.json({ error: "Hiring title required (max 100 chars)" }, { status: 400 });
            }
            if (hiringSkills.length > 10) {
                return NextResponse.json({ error: "Maximum 10 skills" }, { status: 400 });
            }
        }

        if (postType === "code" && code && code.length > 5000) {
            return NextResponse.json({ error: "Code max 5000 characters" }, { status: 400 });
        }

        if (postType === "image" && mediaUrls.length > 10) {
            return NextResponse.json({ error: "Maximum 10 images" }, { status: 400 });
        }

        // ── Create Post ──
        const post = await prisma.spillPost.create({
            data: {
                userId: session.userId,
                postType,
                caption: caption || null,
                hashtags: hashtags.length > 0 ? JSON.stringify(hashtags.map((t: string) => t.toLowerCase())) : null,
                visibility,
                code: code || null,
                codeLang: codeLang || null,
                videoUrl: videoUrl || null,
                thumbnailUrl: thumbnailUrl || null,
                githubRepoName: githubRepoName || null,
                githubRepoDesc: githubRepoDesc || null,
                githubRepoLang: githubRepoLang || null,
                githubRepoStars: githubRepoStars ?? null,
                githubRepoForks: githubRepoForks ?? null,
                githubRepoUrl: githubRepoUrl || null,
                hiringTitle: hiringTitle || null,
                hiringSkills: hiringSkills.length > 0 ? JSON.stringify(hiringSkills) : null,
                hiringLocationType: hiringLocationType || null,
                hiringCompType: hiringCompType || null,
                hiringDeadline: hiringDeadline ? new Date(hiringDeadline) : null,
                media: {
                    create: mediaUrls.map((url: string, index: number) => ({
                        url,
                        mediaType: "image",
                        sortOrder: index,
                    })),
                },
            },
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
            },
        });

        // ── Update hashtag counts ──
        if (hashtags.length > 0) {
            for (const tag of hashtags) {
                const lowerTag = tag.toLowerCase();
                await prisma.spillHashtag.upsert({
                    where: { tag: lowerTag },
                    create: { tag: lowerTag, useCount: 1 },
                    update: { useCount: { increment: 1 } },
                });
            }
        }

        return NextResponse.json({
            post: {
                ...post,
                hashtags: post.hashtags ? JSON.parse(post.hashtags) : [],
                hiringSkills: post.hiringSkills ? JSON.parse(post.hiringSkills) : [],
                isLiked: false,
                isSaved: false,
                isReposted: false,
            },
        }, { status: 201 });
    } catch (error) {
        console.error("Create post error:", error);
        return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
    }
}
