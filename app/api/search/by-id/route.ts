import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// GET /api/search/by-id?id=<userId>
// Returns basic user info (id, fullName, username, role) for a given user ID.
// Used by the search page to support direct-ID lookup (like Instagram's @username paste).
export async function GET(req: Request) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const url = new URL(req.url);
        const id = url.searchParams.get("id")?.trim();

        if (!id) {
            return NextResponse.json({ error: "Missing id parameter" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { id, isActive: true },
            select: {
                id: true,
                fullName: true,
                username: true,
                role: true,
                talentProfile: {
                    select: {
                        bio: true,
                        experienceLevel: true,
                        isAvailable: true,
                        skills: { select: { skillName: true } },
                    },
                },
                recruiterProfile: {
                    select: {
                        companyName: true,
                        jobTitle: true,
                        bio: true,
                    },
                },
            },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ user });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
