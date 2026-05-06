import { prisma } from '@/lib/prisma';
import { notify } from '@/lib/notify';

const MATCHING_SERVICE_URL     = process.env.MATCHING_SERVICE_URL     ?? 'http://localhost:5001';
const MATCHING_SERVICE_SECRET  = process.env.MATCHING_SERVICE_SECRET  ?? 'dev-secret';
const MATCH_NOTIFY_THRESHOLD   = Number(process.env.MATCH_NOTIFY_THRESHOLD ?? '65');

// ── Result interface ──

export interface MatchingRunResult {
    success:          boolean;
    bountyId:         string;
    totalTalents:     number;   // how many talent profiles were evaluated
    matchesComputed:  number;   // how many results saved to DB
    topMatch: {
        talentProfileId: string;
        matchScore:      number;
    } | null;
    notificationsSent: number;  // how many talents were notified
    duration:          number;  // ms
    error?:            string;
}

// ── Helper ──

function failureResult(
    bountyId:  string,
    error:     string,
    startTime: number,
): MatchingRunResult {
    return {
        success:           false,
        bountyId,
        totalTalents:      0,
        matchesComputed:   0,
        topMatch:          null,
        notificationsSent: 0,
        duration:          Date.now() - startTime,
        error,
    };
}

/**
 * Semantic Matching Engine — Step 3.
 *
 * Runs the full AI matching pipeline for a single bounty and persists
 * scored talent-bounty pairs to the database.
 *
 * Pipeline summary:
 *   A  Fetch bounty + its required skills from the DB
 *   B  Fetch all available TalentProfiles (skills + work experience)
 *   C  POST both to the Python matching microservice (/match)
 *   D  Upsert every scored result into talent_bounty_matches in parallel
 *   E  Notify talents whose matchScore >= MATCH_NOTIFY_THRESHOLD
 *   F  Return MatchingRunResult
 *
 * External services called:
 *   Python Flask matching service — POST /match
 *     (sentence-transformers all-MiniLM-L6-v2 + skill overlap + bonus scoring)
 *
 * Required env vars:
 *   MATCHING_SERVICE_URL      — base URL of the Flask service  (default: http://localhost:5001)
 *   MATCHING_SERVICE_SECRET   — shared secret for X-Internal-Secret header (default: dev-secret)
 *   MATCH_NOTIFY_THRESHOLD    — minimum matchScore to trigger a notification (default: 65)
 *
 * Never throws — all failures return success: false with an error string.
 *
 * @param bountyId  Bounty.id (CUID) to run matching for
 */
export async function runMatching(bountyId: string): Promise<MatchingRunResult> {
    const startTime = Date.now();
    console.log('[Matching] Starting for bountyId:', bountyId);

    try {
        // ── Step A: Fetch bounty data ──

        const bounty = await prisma.bounty.findUnique({
            where:   { id: bountyId },
            include: { skills: true },
        });

        if (!bounty) {
            return failureResult(bountyId, `Bounty ${bountyId} not found`, startTime);
        }
        if (bounty.status !== 'OPEN') {
            return failureResult(bountyId, 'Matching only runs on OPEN bounties', startTime);
        }

        const bountyPayload = {
            id:           bounty.id,
            title:        bounty.title,
            description:  bounty.description  ?? '',
            requirements: bounty.requirements ?? '',
            skills:       bounty.skills.map(s => s.skillName),
        };

        // ── Step B: Fetch all available talent profiles ──

        const talents = await prisma.talentProfile.findMany({
            where:   { isAvailable: true },
            include: {
                skills:        true,   // TalentSkill[]
                workExperience: true,  // TalentWorkExperience[]
            },
        });

        console.log('[Matching] Talents fetched:', talents.length);

        if (!talents.length) {
            return failureResult(bountyId, 'No available talent profiles to match against', startTime);
        }

        const talentsPayload = talents.map(t => ({
            id:              t.id,
            bio:             t.bio             ?? '',
            skills:          t.skills.map(s => s.skillName),
            experienceLevel: t.experienceLevel ?? null,
            githubScore:     t.githubScore     ?? 0,
            isAvailable:     t.isAvailable,
            experience:      t.workExperience.map(w => ({
                role:        w.role        ?? '',
                description: w.description ?? '',
            })),
        }));

        // ── Step C: Call Flask matching service ──

        let results: Array<{
            talentProfileId:  string;
            matchScore:       number;
            skillOverlapScore: number;
            semanticScore:    number;
            bonusScore:       number;
        }>;

        try {
            const response = await fetch(`${MATCHING_SERVICE_URL}/match`, {
                method:  'POST',
                headers: {
                    'Content-Type':     'application/json',
                    'X-Internal-Secret': MATCHING_SERVICE_SECRET,
                },
                body: JSON.stringify({ bounty: bountyPayload, talents: talentsPayload }),
            });

            if (!response.ok) {
                const text = await response.text().catch(() => '');
                return failureResult(
                    bountyId,
                    `Matching service responded ${response.status}: ${text}`,
                    startTime,
                );
            }

            const data = await response.json();
            results = data.results ?? [];
        } catch {
            return failureResult(bountyId, 'Matching service unavailable', startTime);
        }

        console.log('[Matching] Flask response received, results:', results.length);

        // ── Step D: Save results to database ──
        // Parallel upserts — individual failures must not roll back the rest.

        await Promise.all(
            results.map(r =>
                prisma.talentBountyMatch.upsert({
                    where: {
                        bountyId_talentProfileId: {
                            bountyId,
                            talentProfileId: r.talentProfileId,
                        },
                    },
                    create: {
                        bountyId,
                        talentProfileId:   r.talentProfileId,
                        matchScore:        r.matchScore,
                        skillOverlapScore: r.skillOverlapScore,
                        semanticScore:     r.semanticScore,
                        bonusScore:        r.bonusScore,
                    },
                    update: {
                        matchScore:        r.matchScore,
                        skillOverlapScore: r.skillOverlapScore,
                        semanticScore:     r.semanticScore,
                        bonusScore:        r.bonusScore,
                        updatedAt:         new Date(),
                    },
                })
            )
        );

        console.log('[Matching] Saved to DB:', results.length);

        // ── Step E: Send notifications to top-matched talents ──

        const aboveThreshold = results.filter(r => r.matchScore >= MATCH_NOTIFY_THRESHOLD);

        const notificationOutcomes = await Promise.allSettled(
            aboveThreshold.map(async r => {
                const talentProfile = await prisma.talentProfile.findUnique({
                    where:  { id: r.talentProfileId },
                    select: { userId: true },
                });
                if (!talentProfile) return;

                await notify({
                    userId:  talentProfile.userId,
                    type:    'match',
                    title:   'New Job Match Found',
                    message: `You matched ${r.matchScore.toFixed(0)}% with "${bounty.title}" — check it out!`,
                    link:    `/talent/jobs/${bountyId}`,
                });
            })
        );

        const notificationsSent = notificationOutcomes.filter(
            o => o.status === 'fulfilled'
        ).length;

        console.log('[Matching] Notifications sent:', notificationsSent);

        // ── Step F: Return result ──

        const duration = Date.now() - startTime;
        console.log('[Matching] Done in:', duration + 'ms');

        return {
            success:           true,
            bountyId,
            totalTalents:      talents.length,
            matchesComputed:   results.length,
            topMatch: results[0]
                ? { talentProfileId: results[0].talentProfileId, matchScore: results[0].matchScore }
                : null,
            notificationsSent,
            duration,
        };

    } catch (err: any) {
        const error = `Unexpected error: ${err?.message ?? 'Unknown error'}`;
        console.error('[Matching] Error:', error);
        return failureResult(bountyId, error, startTime);
    }
}
