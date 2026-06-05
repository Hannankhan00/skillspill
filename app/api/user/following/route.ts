import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/user/following?userId=xxx — returns a user's following list
export async function GET(req: Request) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const targetId = searchParams.get("userId") || session.userId;

        const follows = await prisma.follow.findMany({
            where: { followerId: targetId },
            include: {
                following: {
                    select: {
                        id: true,
                        fullName: true,
                        username: true,
                        avatarUrl: true,
                        role: true,
                        talentProfile: { select: { experienceLevel: true } },
                        recruiterProfile: { select: { companyName: true } },
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        const following = follows.map((f) => f.following);
        return NextResponse.json({ following });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
