import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { id: talentId } = await params;

        const tp = await prisma.talentProfile.findUnique({
            where: { userId: talentId },
            select: {
                githubUsername: true,
                githubAccessToken: true,
                githubConnected: true,
                githubRepos: true,
                githubStars: true,
                sharePrivateRepos: true,
            },
        });

        if (!tp || !tp.githubConnected || !tp.githubAccessToken || !tp.githubUsername) {
            return NextResponse.json({ error: "GitHub not connected" }, { status: 400 });
        }

        const headers = {
            Authorization: `Bearer ${tp.githubAccessToken}`,
            Accept: "application/vnd.github.v3+json",
            "User-Agent": "SkillSpill-App",
        };

        // Profile
        const profileRes = await fetch("https://api.github.com/user", { headers });
        let githubProfile: any = null;
        if (profileRes.ok) githubProfile = await profileRes.json();

        // Repos (public only for recruiter view)
        const reposRes = await fetch(
            `https://api.github.com/users/${tp.githubUsername}/repos?sort=updated&per_page=30&type=public`,
            { headers }
        );
        const repos = reposRes.ok ? await reposRes.json() : [];

        // Language stats
        const languageStats: Record<string, number> = {};
        let totalStars = 0;
        for (const r of repos) {
            if (r.language) languageStats[r.language] = (languageStats[r.language] || 0) + 1;
            totalStars += r.stargazers_count || 0;
        }

        // Recent activity
        let recentActivity: any[] = [];
        try {
            const eventsRes = await fetch(
                `https://api.github.com/users/${tp.githubUsername}/events/public?per_page=30`,
                { headers }
            );
            if (eventsRes.ok) {
                const events = await eventsRes.json();
                recentActivity = events.map((e: any) => ({
                    type: e.type,
                    repo: e.repo?.name,
                    createdAt: e.created_at,
                }));
            }
        } catch { /* non-critical */ }

        // Contribution graph
        let contributionData: any = null;
        try {
            const gqlRes = await fetch("https://api.github.com/graphql", {
                method: "POST",
                headers: { ...headers, "Content-Type": "application/json" },
                body: JSON.stringify({
                    query: `query {
                        user(login: "${tp.githubUsername}") {
                            contributionsCollection {
                                totalCommitContributions
                                totalPullRequestContributions
                                totalIssueContributions
                                contributionCalendar {
                                    totalContributions
                                    weeks {
                                        contributionDays {
                                            contributionCount
                                            date
                                            color
                                        }
                                    }
                                }
                            }
                        }
                    }`,
                }),
            });
            if (gqlRes.ok) {
                const gql = await gqlRes.json();
                const col = gql?.data?.user?.contributionsCollection;
                if (col) {
                    const cal = col.contributionCalendar;
                    contributionData = {
                        totalContributions: cal.totalContributions,
                        totalCommits: col.totalCommitContributions,
                        totalPRs: col.totalPullRequestContributions,
                        totalIssues: col.totalIssueContributions,
                        weeks: cal.weeks.map((w: any) => ({
                            days: w.contributionDays.map((d: any) => ({
                                count: d.contributionCount,
                                date: d.date,
                                color: d.color,
                            })),
                        })),
                    };
                }
            }
        } catch { /* non-critical */ }

        return NextResponse.json({
            repos,
            languageStats,
            totalStars,
            totalRepos: githubProfile?.public_repos ?? repos.length,
            githubUsername: tp.githubUsername,
            githubProfile: githubProfile ? {
                avatarUrl: githubProfile.avatar_url,
                bio: githubProfile.bio,
                followers: githubProfile.followers,
                following: githubProfile.following,
                publicRepos: githubProfile.public_repos,
                createdAt: githubProfile.created_at,
                htmlUrl: githubProfile.html_url,
            } : null,
            recentActivity,
            contributionData,
        });
    } catch (e) {
        console.error("Talent GitHub fetch error:", e);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
