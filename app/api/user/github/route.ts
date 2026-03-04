import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await getSession();
        if (!session || !session.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const user = await prisma.user.findUnique({
            where: { id: session.userId },
            include: { talentProfile: true }
        });

        if (!user || user.role !== "TALENT" || !user.talentProfile) {
            return NextResponse.json({ error: "Talent profile not found" }, { status: 404 });
        }

        const tp = user.talentProfile;
        if (!tp.githubConnected || !tp.githubAccessToken || !tp.githubUsername) {
            return NextResponse.json({ error: "GitHub not connected" }, { status: 400 });
        }

        const headers = {
            "Authorization": `Bearer ${tp.githubAccessToken}`,
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "SkillSpill-App"
        };

        // 1. Fetch the authenticated user's GitHub profile for real-time stats
        const profileRes = await fetch("https://api.github.com/user", { headers });
        let githubProfile: any = null;
        if (profileRes.ok) {
            githubProfile = await profileRes.json();
        }

        // 2. Fetch repos
        const visibility = tp.sharePrivateRepos ? "all" : "public";
        const reposRes = await fetch(
            `https://api.github.com/user/repos?affiliation=owner&sort=updated&per_page=30&visibility=${visibility}`,
            { headers }
        );

        if (!reposRes.ok) {
            return NextResponse.json({ error: "Failed to fetch from GitHub" }, { status: reposRes.status });
        }

        const repos = await reposRes.json();

        // 3. Calculate language stats from fetched repos
        const languageStats: Record<string, number> = {};
        let totalStars = 0;
        for (const r of repos) {
            if (r.language) {
                languageStats[r.language] = (languageStats[r.language] || 0) + 1;
            }
            totalStars += r.stargazers_count || 0;
        }

        // 4. Update the stored stats in DB to keep them fresh
        const realRepoCount = githubProfile?.public_repos ?? repos.length;
        await prisma.talentProfile.update({
            where: { userId: session.userId },
            data: {
                githubRepos: realRepoCount,
                githubStars: totalStars,
            }
        });

        // 5. Fetch contribution/event data for activity insights
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

        // 6. Fetch real contribution graph via GitHub GraphQL API
        let contributionData: any = null;
        try {
            const graphqlRes = await fetch("https://api.github.com/graphql", {
                method: "POST",
                headers: {
                    ...headers,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query: `query {
                        user(login: "${tp.githubUsername}") {
                            contributionsCollection {
                                totalCommitContributions
                                totalPullRequestContributions
                                totalIssueContributions
                                totalRepositoryContributions
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
                    }`
                }),
            });
            if (graphqlRes.ok) {
                const gql = await graphqlRes.json();
                const collection = gql?.data?.user?.contributionsCollection;
                if (collection) {
                    const calendar = collection.contributionCalendar;
                    contributionData = {
                        totalContributions: calendar.totalContributions,
                        totalCommits: collection.totalCommitContributions,
                        totalPRs: collection.totalPullRequestContributions,
                        totalIssues: collection.totalIssueContributions,
                        totalReposContributed: collection.totalRepositoryContributions,
                        weeks: calendar.weeks.map((w: any) => ({
                            days: w.contributionDays.map((d: any) => ({
                                count: d.contributionCount,
                                date: d.date,
                                color: d.color,
                            }))
                        })),
                    };
                }
            }
        } catch { /* non-critical */ }

        return NextResponse.json({
            repos,
            languageStats,
            sharePrivateRepos: tp.sharePrivateRepos,
            totalStars,
            totalRepos: realRepoCount,
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
    } catch (e: any) {
        console.error("GitHub Fetch Error:", e);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
