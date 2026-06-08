import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(req: Request) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const currentUser = await prisma.user.findUnique({
            where: { id: session.userId },
            select: { role: true, recruiterProfile: { select: { id: true } } }
        });

        let suggestedUsers: any[] = [];

        if (currentUser?.role === "RECRUITER" && currentUser.recruiterProfile) {
            // Get all bounties posted by this recruiter
            const recruiterBountyIds = await prisma.bounty.findMany({
                where: { recruiterProfileId: currentUser.recruiterProfile.id },
                select: { id: true },
            });
            const bountyIds = recruiterBountyIds.map(b => b.id);

            if (bountyIds.length > 0) {
                // Pull pre-computed matches for this recruiter's jobs, best score per talent
                const matches = await prisma.talentBountyMatch.findMany({
                    where: { bountyId: { in: bountyIds } },
                    orderBy: { matchScore: "desc" },
                    include: {
                        talentProfile: {
                            include: {
                                user: { select: { id: true, fullName: true, username: true, avatarUrl: true } }
                            }
                        }
                    },
                    take: 20, // over-fetch to deduplicate
                });

                // Deduplicate by talentProfileId — keep highest score
                const seen = new Set<string>();
                const top: typeof matches = [];
                for (const m of matches) {
                    if (!seen.has(m.talentProfileId)) {
                        seen.add(m.talentProfileId);
                        top.push(m);
                        if (top.length === 5) break;
                    }
                }

                suggestedUsers = top.map(m => {
                    const u = m.talentProfile.user;
                    const score = Math.round(m.matchScore);
                    return {
                        id: u.id,
                        name: u.fullName || u.username || "User",
                        role: m.talentProfile.experienceLevel
                            ? `${m.talentProfile.experienceLevel} Developer`
                            : "Developer",
                        type: "TALENT",
                        initials: (u.fullName || "??").split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2),
                        avatarUrl: u.avatarUrl,
                        grad: "from-violet-500 to-purple-600",
                        score,
                    };
                });
            }

            // If no matches yet (no bounties or no computed matches), fall back to recent talent
            if (suggestedUsers.length === 0) {
                const alreadyFollowing = await prisma.follow.findMany({
                    where: { followerId: session.userId },
                    select: { followingId: true },
                });
                const followingIds = alreadyFollowing.map(f => f.followingId);

                const raw = await prisma.user.findMany({
                    where: {
                        isActive: true,
                        role: "TALENT",
                        id: { notIn: [session.userId, ...followingIds] },
                    },
                    select: {
                        id: true,
                        fullName: true,
                        username: true,
                        avatarUrl: true,
                        talentProfile: { select: { experienceLevel: true } },
                    },
                    orderBy: { createdAt: "desc" },
                    take: 5,
                });

                suggestedUsers = raw.map(u => ({
                    id: u.id,
                    name: u.fullName || u.username || "User",
                    role: u.talentProfile?.experienceLevel
                        ? `${u.talentProfile.experienceLevel} Developer`
                        : "Developer",
                    type: "TALENT",
                    initials: (u.fullName || "??").split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2),
                    avatarUrl: u.avatarUrl,
                    grad: "from-violet-500 to-purple-600",
                    score: null, // no real score available
                }));
            }
        } else {
            // TALENT user: suggest other talent/recruiters to follow (exclude self & already-following)
            const alreadyFollowing = await prisma.follow.findMany({
                where: { followerId: session.userId },
                select: { followingId: true },
            });
            const followingIds = alreadyFollowing.map(f => f.followingId);

            const raw = await prisma.user.findMany({
                where: {
                    isActive: true,
                    role: { not: "ADMIN" },
                    id: { notIn: [session.userId, ...followingIds] },
                },
                select: {
                    id: true,
                    fullName: true,
                    username: true,
                    role: true,
                    avatarUrl: true,
                    talentProfile: { select: { experienceLevel: true } },
                    recruiterProfile: { select: { jobTitle: true, companyName: true } },
                },
                orderBy: { createdAt: "desc" },
                take: 5,
            });

            suggestedUsers = raw.map(u => {
                const roleStr = u.role === "TALENT"
                    ? `${u.talentProfile?.experienceLevel || ""} Developer`.trim()
                    : `${u.recruiterProfile?.jobTitle || "Recruiter"} @ ${u.recruiterProfile?.companyName || "Company"}`;
                return {
                    id: u.id,
                    name: u.fullName || u.username || "User",
                    role: roleStr,
                    type: u.role,
                    initials: (u.fullName || "??").split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2),
                    avatarUrl: u.avatarUrl,
                    grad: "from-violet-500 to-purple-600",
                    score: null,
                };
            });
        }

        // Job suggestions — exclude past-deadline jobs
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        const jobsRaw = await prisma.bounty.findMany({
            where: {
                status: "OPEN",
                OR: [{ deadline: null }, { deadline: { gte: startOfToday } }],
            },
            include: {
                recruiterProfile: { include: { user: true } },
                applications: true,
            },
            orderBy: { createdAt: "desc" },
            take: 5,
        });

        const jobSuggestions = jobsRaw.map(j => {
            const daysLeft = j.deadline
                ? Math.ceil((new Date(j.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                : 30;
            return {
                id: j.id,
                title: j.title || "Job Open",
                company: j.recruiterProfile?.companyName || "Unknown Company",
                budget: j.reward ? `$${j.reward}` : "Competitive",
                match: Math.floor(Math.random() * 20) + 80 + "%",
                type: j.isRemote ? "Remote" : "On-site",
                apps: j.applications.length,
                days: daysLeft > 0 ? daysLeft : 0,
                hot: j.applications.length > 5,
            };
        });

        return NextResponse.json({ suggestedUsers, jobSuggestions });
    } catch (err) {
        console.error("Sidebar API error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
