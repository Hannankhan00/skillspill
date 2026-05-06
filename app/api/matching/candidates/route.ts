import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * GET /api/matching/candidates?bountyId=&limit=&minScore=
 *
 * Returns ranked talent candidates for a bounty, ordered by descending match score.
 * Each candidate includes scores, talent profile snapshot, and skill list.
 *
 * Auth:    RECRUITER (own bounties only) or ADMIN (any bounty)
 * Params:
 *   bountyId  — required
 *   limit     — optional, default 20, max 50
 *   minScore  — optional, default 0 (filter by minimum matchScore)
 *
 * Returns 200: { bountyId, bountyTitle, totalCandidates, candidates[], lastComputedAt }
 * Returns 200 (no matches yet): { totalCandidates: 0, candidates: [], lastComputedAt: null }
 * Returns 400: missing bountyId
 * Returns 403: recruiter accessing another recruiter's bounty
 * Returns 404: bounty not found
 * Returns 500: unexpected error
 */
export async function GET(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session || !session.userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        if (session.role !== "RECRUITER" && session.role !== "ADMIN") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { searchParams } = req.nextUrl;
        const bountyId = searchParams.get("bountyId");
        const limit    = Math.min(Number(searchParams.get("limit")    || "20"), 50);
        const minScore = Number(searchParams.get("minScore") || "0");

        if (!bountyId?.trim()) {
            return NextResponse.json({ error: "bountyId is required" }, { status: 400 });
        }

        // ── Fetch bounty ──
        const bounty = await prisma.bounty.findUnique({
            where:  { id: bountyId },
            select: { id: true, title: true, recruiterProfileId: true },
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
                return NextResponse.json({ error: "Forbidden" }, { status: 403 });
            }
        }

        // ── Fetch candidates, total count, and lastComputedAt in parallel ──
        const [matches, totalCandidates, lastMatch] = await Promise.all([
            prisma.talentBountyMatch.findMany({
                where: {
                    bountyId,
                    matchScore: { gte: minScore },
                },
                orderBy: { matchScore: "desc" },
                take:    limit,
                include: {
                    talentProfile: {
                        include: {
                            user: {
                                select: {
                                    fullName:  true,
                                    email:     true,
                                    avatarUrl: true,
                                },
                            },
                            skills: {
                                select: { skillName: true, isVerified: true },
                            },
                        },
                    },
                },
            }),
            prisma.talentBountyMatch.count({ where: { bountyId } }),
            prisma.talentBountyMatch.findFirst({
                where:   { bountyId },
                orderBy: { computedAt: "desc" },
                select:  { computedAt: true },
            }),
        ]);

        if (!matches.length) {
            return NextResponse.json({
                bountyId,
                bountyTitle:     bounty.title,
                totalCandidates: 0,
                candidates:      [],
                lastComputedAt:  null,
            });
        }

        const candidates = matches.map((m, index) => ({
            rank:              index + 1,
            talentProfileId:   m.talentProfileId,
            matchScore:        m.matchScore,
            skillOverlapScore: m.skillOverlapScore,
            semanticScore:     m.semanticScore,
            bonusScore:        m.bonusScore,
            computedAt:        m.computedAt.toISOString(),
            talent: {
                name:            m.talentProfile.user.fullName,
                email:           m.talentProfile.user.email,
                avatar:          m.talentProfile.user.avatarUrl ?? null,
                experienceLevel: m.talentProfile.experienceLevel ?? null,
                githubScore:     m.talentProfile.githubScore,
                isAvailable:     m.talentProfile.isAvailable,
                skills:          m.talentProfile.skills.map(s => ({
                    name:       s.skillName,
                    isVerified: s.isVerified,
                })),
            },
        }));

        return NextResponse.json({
            bountyId,
            bountyTitle:     bounty.title,
            totalCandidates,
            candidates,
            lastComputedAt:  lastMatch?.computedAt.toISOString() ?? null,
        });

    } catch (error) {
        console.error("[GET /api/matching/candidates] Error:", error);
        return NextResponse.json(
            { error: "Failed to fetch candidates" },
            { status: 500 },
        );
    }
}
