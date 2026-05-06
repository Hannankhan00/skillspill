import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { scoreGithubProfile } from "@/lib/scoreGithubProfile";

export const dynamic = "force-dynamic";

const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

function hoursStr(ms: number): string {
    const h = ms / (60 * 60 * 1000);
    if (h < 1) return "less than 1 hour";
    const rounded = Math.floor(h);
    return `${rounded} hour${rounded !== 1 ? "s" : ""}`;
}

/**
 * POST /api/github/score
 *
 * Triggers a full GitHub scoring run for the authenticated Talent user.
 * Chains filterRepos → detectRepoType → scoreMetadata → selectTopRepo →
 * scoreStructure → scoreWithAI → composite weighting → DB write.
 *
 * Auth:        Talent only (must have GitHub connected)
 * Rate limit:  One refresh per 24 hours — returns 429 if too soon
 * Duration:    ~5-30 seconds depending on repo size and Groq availability
 *
 * Returns 200: { success, compositeScore, reposAnalysed, topRepoName,
 *               duration, scoreBreakdown }
 * Returns 429: { error, message, nextRefreshAt, currentScore }
 * Returns 400: { error: "GitHub account not connected" }
 * Returns 500: { success: false, error }
 */
export async function POST() {
    try {
        const session = await getSession();
        if (!session || !session.userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (session.role !== "TALENT") {
            return NextResponse.json(
                { error: "Only Talent accounts can run GitHub scoring" },
                { status: 403 },
            );
        }

        const userId = session.userId;

        // Fetch GitHub credentials + rate-limit fields in one query
        const tp = await prisma.talentProfile.findUnique({
            where: { userId },
            select: {
                githubUsername:    true,
                githubAccessToken: true,
                githubScore:       true,
                scoreLastUpdated:  true,
            },
        });

        if (!tp) {
            return NextResponse.json({ error: "Talent profile not found" }, { status: 404 });
        }

        if (!tp.githubUsername || !tp.githubAccessToken) {
            return NextResponse.json({ error: "GitHub account not connected" }, { status: 400 });
        }

        // ── Rate limit: one refresh per 24 hours ──
        if (tp.scoreLastUpdated) {
            const diff = Date.now() - tp.scoreLastUpdated.getTime();
            if (diff < TWENTY_FOUR_HOURS) {
                const nextRefreshAt = new Date(
                    tp.scoreLastUpdated.getTime() + TWENTY_FOUR_HOURS,
                ).toISOString();
                return NextResponse.json(
                    {
                        error:        "Score already up to date",
                        message:      `Your GitHub score was last updated ${hoursStr(diff)} ago. You can refresh again in ${hoursStr(TWENTY_FOUR_HOURS - diff)}.`,
                        nextRefreshAt,
                        currentScore: tp.githubScore,
                    },
                    { status: 429 },
                );
            }
        }

        // ── Run full scoring pipeline ──
        const result = await scoreGithubProfile(
            userId,
            tp.githubUsername,
            tp.githubAccessToken,
        );

        console.log(
            "[POST /api/github/score] userId:", userId,
            "duration:", result.duration + "ms",
        );

        if (!result.success) {
            return NextResponse.json(
                { success: false, error: result.error },
                { status: 500 },
            );
        }

        return NextResponse.json({
            success:        true,
            compositeScore: result.compositeScore,
            reposAnalysed:  result.reposAnalysed,
            topRepoName:    result.topRepoName,
            duration:       result.duration,
            scoreBreakdown: result.scoreBreakdown,
        });

    } catch (error) {
        console.error("Scoring Error:", error);
        return NextResponse.json(
            { error: "Scoring failed unexpectedly" },
            { status: 500 },
        );
    }
}
