import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/user/followers — returns the logged-in user's followers
export async function GET() {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const follows = await prisma.follow.findMany({
            where: { followingId: session.userId },
            include: {
                follower: {
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

        const followers = follows.map((f) => f.follower);
        return NextResponse.json({ followers });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
