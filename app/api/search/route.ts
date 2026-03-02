import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// GET /api/search?q=&role=
export async function GET(req: Request) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const url = new URL(req.url);
        const q = url.searchParams.get("q")?.toLowerCase().trim() ?? "";
        const roleFilter = url.searchParams.get("role"); // "TALENT" | "RECRUITER" | null (all)

        const roles = roleFilter === "TALENT"
            ? ["TALENT"]
            : roleFilter === "RECRUITER"
                ? ["RECRUITER"]
                : ["TALENT", "RECRUITER"];

        const users = await prisma.user.findMany({
            where: {
                isActive: true,
                role: { in: roles as ("TALENT" | "RECRUITER")[] },
                id: { not: session.userId }, // exclude self
            },
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
                        location: true,
                        skills: { select: { skillName: true } },
                    },
                },
                recruiterProfile: {
                    select: {
                        companyName: true,
                        companyWebsite: true,
                        jobTitle: true,
                        location: true,
                        bio: true,
                    },
                },
            },
            take: 100,
        });

        // Filter by search query (name, username, skills, company, role)
        const filtered = users.filter(u => {
            if (!q) return true;
            const name = u.fullName?.toLowerCase() ?? "";
            const username = u.username?.toLowerCase() ?? "";
            const company = u.recruiterProfile?.companyName?.toLowerCase() ?? "";
            const jobTitle = u.recruiterProfile?.jobTitle?.toLowerCase() ?? "";
            const bio = (u.talentProfile?.bio ?? u.recruiterProfile?.bio ?? "").toLowerCase();
            const skills = u.talentProfile?.skills?.map(s => s.skillName.toLowerCase()) ?? [];
            const expLevel = u.talentProfile?.experienceLevel?.toLowerCase() ?? "";

            return (
                name.includes(q) ||
                username.includes(q) ||
                company.includes(q) ||
                jobTitle.includes(q) ||
                bio.includes(q) ||
                skills.some(s => s.includes(q)) ||
                expLevel.includes(q)
            );
        });

        return NextResponse.json({ users: filtered });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
