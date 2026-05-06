import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

/**
 * GET /api/github/scorecard
 * GET /api/github/scorecard?userId=<id>  (Recruiter only)
 *
 * Returns the saved GitHub scorecard for a Talent user.
 *
 * Auth:
 *   Talent  — always sees their own scorecard; ?userId= is ignored
 *   Recruiter — must pass ?userId= to specify which Talent to view
 *
 * Returns 200: {
 *   githubScore, scoreLastUpdated, githubUsername, totalRepos,
 *   topRepo: { name, url, type, language, scores, scoreBreakdown, feedback } | null,
 *   otherRepos: [{ name, url, type, language, finalScore }],
 *   canRefresh, nextRefreshAt
 * }
 * Returns 200 (no data yet): { githubScore: 0, totalRepos: 0, topRepo: null, ... }
 * Returns 400: { error: "userId query param required for recruiters" }
 * Returns 500: { error: "Failed to fetch scorecard" }
 */
export async function GET(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session || !session.userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // ── Resolve target user ──
        let targetUserId: string;

        if (session.role === "TALENT") {
            targetUserId = session.userId;
        } else if (session.role === "RECRUITER") {
            const qUserId = req.nextUrl.searchParams.get("userId");
            if (!qUserId) {
                return NextResponse.json(
                    { error: "userId query param required for recruiters" },
                    { status: 400 },
                );
            }
            targetUserId = qUserId;
        } else {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // ── Fetch profile + repos in parallel ──
        const [tp, repos] = await Promise.all([
            prisma.talentProfile.findUnique({
                where: { userId: targetUserId },
                select: {
                    githubScore:      true,
                    scoreLastUpdated: true,
                    githubUsername:   true,
                },
            }),
            prisma.githubRepository.findMany({
                where:   { userId: targetUserId },
                orderBy: { finalScore: "desc" },
                select: {
                    repoName:        true,
                    repoUrl:         true,
                    repoType:        true,
                    primaryLanguage: true,
                    metadataScore:   true,
                    structureScore:  true,
                    aiScore:         true,
                    finalScore:      true,
                    isTopRepo:       true,
                    scoreBreakdown:  true,
                    pushedAt:        true,
                    scoredAt:        true,
                },
            }),
        ]);

        // ── No scorecard exists yet ──
        if (!tp || repos.length === 0) {
            return NextResponse.json({
                githubScore:      0,
                scoreLastUpdated: null,
                githubUsername:   tp?.githubUsername ?? null,
                totalRepos:       0,
                topRepo:          null,
                otherRepos:       [],
                canRefresh:       true,
                nextRefreshAt:    null,
            });
        }

        // ── canRefresh / nextRefreshAt ──
        const canRefresh = !tp.scoreLastUpdated
            || (Date.now() - tp.scoreLastUpdated.getTime() >= TWENTY_FOUR_HOURS);

        const nextRefreshAt = tp.scoreLastUpdated
            ? new Date(tp.scoreLastUpdated.getTime() + TWENTY_FOUR_HOURS).toISOString()
            : null;

        // ── Shape top repo ──
        const topRepoRow    = repos.find(r => r.isTopRepo) ?? null;
        const otherRepoRows = repos.filter(r => !r.isTopRepo);

        const topRepo = topRepoRow
            ? (() => {
                const bd = topRepoRow.scoreBreakdown as Record<string, any> | null;
                return {
                    name:     topRepoRow.repoName,
                    url:      topRepoRow.repoUrl,
                    type:     topRepoRow.repoType     ?? "other",
                    language: topRepoRow.primaryLanguage ?? "Unknown",
                    scores: {
                        metadata:  topRepoRow.metadataScore,
                        structure: topRepoRow.structureScore,
                        ai:        topRepoRow.aiScore,
                        final:     topRepoRow.finalScore,
                    },
                    scoreBreakdown: topRepoRow.scoreBreakdown,
                    feedback:       bd?.aiFeedback ?? null,
                };
            })()
            : null;

        const otherRepos = otherRepoRows.map(r => ({
            name:       r.repoName,
            url:        r.repoUrl,
            type:       r.repoType        ?? "other",
            language:   r.primaryLanguage ?? "Unknown",
            finalScore: r.finalScore,
        }));

        return NextResponse.json({
            githubScore:      tp.githubScore,
            scoreLastUpdated: tp.scoreLastUpdated?.toISOString() ?? null,
            githubUsername:   tp.githubUsername ?? null,
            totalRepos:       repos.length,
            topRepo,
            otherRepos,
            canRefresh,
            nextRefreshAt,
        });

    } catch (error) {
        console.error("Scorecard Error:", error);
        return NextResponse.json(
            { error: "Failed to fetch scorecard" },
            { status: 500 },
        );
    }
}
