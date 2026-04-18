import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(req: Request) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        // Get suggested users (excluding self)
        const suggestedUsersRaw = await prisma.user.findMany({
            where: {
                isActive: true,
                id: { not: session.userId },
            },
            select: {
                id: true,
                fullName: true,
                username: true,
                role: true,
                avatarUrl: true,
                talentProfile: {
                    select: { experienceLevel: true }
                },
                recruiterProfile: {
                    select: { jobTitle: true, companyName: true }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: 5,
        });

        const suggestedUsers = suggestedUsersRaw.map(u => {
            const roleStr = u.role === "TALENT" 
                ? `${u.talentProfile?.experienceLevel || ''} Developer`.trim() 
                : u.role === "RECRUITER"
                    ? `${u.recruiterProfile?.jobTitle || 'Recruiter'} @ ${u.recruiterProfile?.companyName || 'Company'}`
                    : "Admin";
            
            return {
                id: u.id,
                name: u.fullName || u.username || "User",
                role: roleStr,
                initials: (u.fullName || "??").split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2),
                avatarUrl: u.avatarUrl,
                grad: "from-violet-500 to-purple-600", // We can apply this dynamically on frontend too
                score: Math.floor(Math.random() * 20) + 80 // Mock score for recruiters
            };
        });

        // Get suggested jobs (bounties)
        const jobsRaw = await prisma.bounty.findMany({
            where: { status: "OPEN" },
            include: {
                recruiterProfile: {
                    include: { user: true }
                },
                applications: true
            },
            orderBy: { createdAt: 'desc' },
            take: 5,
        });

        const jobSuggestions = jobsRaw.map(j => {
            const daysLeft = j.deadline ? Math.ceil((new Date(j.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : 30;
            return {
                id: j.id,
                title: j.title || "Job Open",
                company: j.recruiterProfile?.companyName || "Unknown Company",
                budget: j.reward ? `$${j.reward}` : "Competitive",
                match: Math.floor(Math.random() * 20) + 80 + "%",
                type: j.isRemote ? "Remote" : "On-site",
                apps: j.applications.length,
                days: daysLeft > 0 ? daysLeft : 0,
                hot: j.applications.length > 5
            };
        });

        return NextResponse.json({ suggestedUsers, jobSuggestions });
    } catch (err) {
        console.error("Sidebar API error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
