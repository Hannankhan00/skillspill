import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { runMatching } from "@/lib/runMatching";

export const dynamic = "force-dynamic";

const ONE_HOUR_MS = 60 * 60 * 1000;

/**
 * POST /api/matching/run
 *
 * Triggers the AI matching pipeline for a specific bounty.
 * Scores all available talent profiles against the bounty via the
 * Python matching microservice and persists results to talent_bounty_matches.
 *
 * Auth:    RECRUITER (own bounties only) or ADMIN (any bounty)
 * Body:    { bountyId: string }
 *
 * Returns 200: { success, bountyId, totalTalents, matchesComputed,
 *               topMatch, notificationsSent, duration }
 * Returns 429: { error, message, nextRunAt } — matching ran < 1 hour ago
 * Returns 400: missing bountyId or bounty not OPEN
 * Returns 403: recruiter does not own this bounty
 * Returns 404: bounty not found
 * Returns 500: runMatching pipeline failure or unexpected throw
 */
export async function POST(req: Request) {
    try {
        const session = await getSession();
        if (!session || !session.userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (session.role !== "RECRUITER" && session.role !== "ADMIN") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const body = await req.json().catch(() => ({}));
        const { bountyId } = body as { bountyId?: string };

        if (!bountyId?.trim()) {
            return NextResponse.json({ error: "bountyId is required" }, { status: 400 });
        }

        // ── Fetch bounty ──
        const bounty = await prisma.bounty.findUnique({
            where:  { id: bountyId },
            select: { id: true, status: true, recruiterProfileId: true },
        });

        if (!bounty) {
            return NextResponse.json({ error: "Bounty not found" }, { status: 404 });
        }

        // ── Ownership check (RECRUITER only — ADMIN bypasses) ──
        if (session.role === "RECRUITER") {
            const recruiterProfile = await prisma.recruiterProfile.findUnique({
                where:  { userId: session.userId },
                select: { id: true },
            });
            if (!recruiterProfile || bounty.recruiterProfileId !== recruiterProfile.id) {
                return NextResponse.json(
                    { error: "You can only run matching for your own bounties" },
                    { status: 403 },
                );
            }
        }

        // ── Status check ──
        if (bounty.status !== "OPEN") {
            return NextResponse.json(
                { error: "Matching only runs on OPEN bounties" },
                { status: 400 },
            );
        }

        // ── Rate limit: 1 run per hour per bounty ──
        const mostRecentMatch = await prisma.talentBountyMatch.findFirst({
            where:   { bountyId },
            orderBy: { updatedAt: "desc" },
            select:  { updatedAt: true },
        });

        if (mostRecentMatch) {
            const elapsed = Date.now() - mostRecentMatch.updatedAt.getTime();
            if (elapsed < ONE_HOUR_MS) {
                const elapsedMins   = Math.floor(elapsed / 60_000);
                const remainingMins = Math.ceil((ONE_HOUR_MS - elapsed) / 60_000);
                const nextRunAt     = new Date(
                    mostRecentMatch.updatedAt.getTime() + ONE_HOUR_MS,
                ).toISOString();
                return NextResponse.json(
                    {
                        error:    "Matching was run recently",
                        message:  `Matching for this bounty was last run ${elapsedMins} minute${elapsedMins !== 1 ? "s" : ""} ago. You can re-run in ${remainingMins} minute${remainingMins !== 1 ? "s" : ""}.`,
                        nextRunAt,
                    },
                    { status: 429 },
                );
            }
        }

        // ── Run matching pipeline ──
        const result = await runMatching(bountyId);

        console.log(
            "[POST /api/matching/run] bountyId:", bountyId,
            "recruiterId:", session.userId,
            "duration:", result.duration + "ms",
        );

        if (!result.success) {
            return NextResponse.json(
                { success: false, error: result.error },
                { status: 500 },
            );
        }

        return NextResponse.json({
            success:           true,
            bountyId:          result.bountyId,
            totalTalents:      result.totalTalents,
            matchesComputed:   result.matchesComputed,
            topMatch:          result.topMatch,
            notificationsSent: result.notificationsSent,
            duration:          result.duration,
        });

    } catch (error) {
        console.error("[POST /api/matching/run] Unexpected error:", error);
        return NextResponse.json(
            { error: "Matching failed unexpectedly" },
            { status: 500 },
        );
    }
}
