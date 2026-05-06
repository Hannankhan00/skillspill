import { prisma }          from '@/lib/prisma';
import { filterRepos }      from '@/lib/github-filter';
import { detectRepoType }   from '@/lib/detectRepoType';
import { scoreMetadata }    from '@/lib/scoreMetadata';
import { selectTopRepo, ScoredRepo } from '@/lib/selectTopRepo';
import { scoreStructure, StructureScoreResult } from '@/lib/scoreStructure';
import { scoreWithAI, AIScoreResult }            from '@/lib/scoreWithAI';

const GITHUB_API = 'https://api.github.com';

// ── Weight table — redistributed for fewer than 5 repos ──
// Rows indexed by (repoCount - 1), cols by rank position
const REPO_WEIGHTS: number[][] = [
    [1.00],                        // 1 repo
    [0.60, 0.40],                  // 2 repos
    [0.50, 0.30, 0.20],            // 3 repos
    [0.45, 0.25, 0.18, 0.12],      // 4 repos
    [0.40, 0.20, 0.15, 0.13, 0.12], // 5 repos
];

// ── Result interfaces ──

export interface ScoringRunResult {
    success:        boolean;
    compositeScore: number;    // 0-100 final github score
    reposAnalysed:  number;    // how many passed filter
    topRepoName:    string;    // which repo got deep analysis
    scoreBreakdown: {
        topRepo: {
            name:           string;
            type:           string;
            metadataScore:  number;
            structureScore: number;
            aiScore:        number;
            finalScore:     number;
            aiFeedback:     string;
        };
        otherRepos: {
            name:       string;
            type:       string;
            finalScore: number;
        }[];
    };
    duration: number;   // total ms the scoring run took
    error?:   string;   // set when success is false
}

// ── Helpers ──

function ghHeaders(token: string): Record<string, string> {
    return {
        'Authorization': `Bearer ${token}`,
        'Accept':        'application/vnd.github+json',
        'User-Agent':    'SkillSpill-App',
    };
}

function failureResult(error: string, startTime: number): ScoringRunResult {
    return {
        success:        false,
        compositeScore: 0,
        reposAnalysed:  0,
        topRepoName:    '',
        scoreBreakdown: {
            topRepo:    { name: '', type: '', metadataScore: 0, structureScore: 0, aiScore: 0, finalScore: 0, aiFeedback: '' },
            otherRepos: [],
        },
        duration: Date.now() - startTime,
        error,
    };
}

function computeComposite(
    rankedList:        ScoredRepo[],
    topRepo:           ScoredRepo,
    topRepoFinalScore: number,
): number {
    const weights = REPO_WEIGHTS[Math.min(rankedList.length, 5) - 1];
    let raw = 0;
    for (let i = 0; i < rankedList.length; i++) {
        const finalScore = rankedList[i] === topRepo
            ? topRepoFinalScore
            : rankedList[i].metadataScore.score;
        raw += finalScore * weights[i];
    }
    // Round to 1 decimal place, clamped to 100
    return Math.round(Math.min(raw, 100) * 10) / 10;
}

/**
 * Step 8 of the GitHub Scoring Engine — Composite Score Calculator & DB Writer.
 *
 * Chains all previous steps (A → J) into a single orchestrator call
 * and persists the results to the database.
 *
 * Pipeline summary:
 *   A  Fetch raw repos from GitHub API (users/{username}/repos)
 *   B  Filter with filterRepos() — removes forks, tiny, throwaway, stale, etc.
 *   C  Detect type + score metadata for every filtered repo (no file-tree fetches)
 *   D  Select the single best repo with selectTopRepo()
 *   E  Deep-fetch file tree + key files, run scoreStructure() on top repo only
 *   F  Fetch 2-3 source files, run scoreWithAI() on top repo only  ← calls Groq API
 *   G  Compute per-repo final scores (weighted blend of metadata/structure/AI)
 *   H  Compute composite GitHub score (rank-weighted average across up to 5 repos)
 *   I  Write all repo rows + talent_profiles.githubScore in a DB transaction
 *   J  Return ScoringRunResult
 *
 * External APIs called:
 *   GitHub REST  — Step A (repo list) + Step E (file tree/contents) + Step F (source files)
 *   Groq API     — Step F (llama-3.1-70b-versatile for AI code quality score)
 *
 * Never throws — all failures degrade gracefully. If the pipeline errors after
 * filtering, a partial save of metadata-only scores is attempted before returning
 * success: false.
 *
 * @param userId          User.id from the DB (CUID)
 * @param githubUsername  GitHub login (talentProfile.githubUsername)
 * @param githubToken     OAuth access token (talentProfile.githubAccessToken)
 */
export async function scoreGithubProfile(
    userId:         string,
    githubUsername: string,
    githubToken:    string,
): Promise<ScoringRunResult> {
    const startTime = Date.now();
    console.log('[Scoring] Starting for user:', userId);

    // ── Step A: Fetch repos from GitHub API ──

    let rawRepos: any[];
    try {
        const res = await fetch(
            `${GITHUB_API}/users/${githubUsername}/repos?per_page=100&sort=pushed&direction=desc`,
            { headers: ghHeaders(githubToken) },
        );
        if (!res.ok) {
            return failureResult(
                `GitHub API error: ${res.status} ${res.statusText}`,
                startTime,
            );
        }
        rawRepos = await res.json();
    } catch (err: any) {
        return failureResult(
            `Failed to fetch GitHub repos: ${err?.message ?? 'Network error'}`,
            startTime,
        );
    }

    // ── Step B: Filter repos ──

    const filterResult = filterRepos(rawRepos);
    if (filterResult.filtered.length === 0) {
        return failureResult(
            'No qualifying repositories found after filtering',
            startTime,
        );
    }
    console.log('[Scoring] Repos after filter:', filterResult.filtered.length);

    // ── scoredRepos is declared here so the catch block can attempt a partial save ──
    let scoredRepos: ScoredRepo[] = [];

    try {
        // ── Step C: Detect type + score metadata for each filtered repo ──
        // Pass empty fileTree — detection uses language + topics + description only.
        // We only fetch file trees for the single top repo (Step E).
        scoredRepos = filterResult.filtered.map(repo => {
            const detection     = detectRepoType(repo, []);
            const metadataScore = scoreMetadata(repo, detection);
            return { repo, detection, metadataScore };
        });

        // ── Step D: Select top repo ──

        const topRepoResult = selectTopRepo(scoredRepos);
        const { topRepo, rankedList } = topRepoResult;
        console.log('[Scoring] Top repo selected:', topRepo.repo.name);

        // ── Step E: Structure score — top repo only ──

        const structureResult: StructureScoreResult = await scoreStructure(
            topRepo.repo,
            topRepo.detection,
            githubToken,
        );
        console.log('[Scoring] Structure score:', structureResult.score);

        // ── Step F: AI score — top repo only ──

        const aiResult: AIScoreResult = await scoreWithAI(
            topRepo.repo,
            topRepo.detection,
            structureResult,
            githubToken,
        );
        console.log('[Scoring] AI score:', aiResult.score);

        // ── Step G: Per-repo final scores ──
        // Top repo: weighted blend of all three scoring layers.
        // All other repos: metadata score only (no deep analysis was run).

        const topRepoFinalScore = Math.min(
            topRepo.metadataScore.score * 0.25 +
            structureResult.score       * 0.35 +
            aiResult.score              * 0.40,
            100,
        );

        // ── Step H: Composite GitHub score ──

        const compositeScore = computeComposite(rankedList, topRepo, topRepoFinalScore);
        console.log('[Scoring] Composite score:', compositeScore);

        // ── Step I: Save to database ──
        // GithubRepository has no @@unique([userId, repoName]), so we delete-then-recreate
        // in one transaction instead of upserting row-by-row.

        const now = new Date();

        const repoRows = rankedList.map(sr => {
            const isTopRepo    = sr === topRepo;
            const finalScore   = isTopRepo ? topRepoFinalScore : sr.metadataScore.score;

            const scoreBreakdown = isTopRepo
                ? {
                    metadata:  sr.metadataScore.breakdown,
                    structure: structureResult.breakdown,
                    ai:        aiResult.breakdown,
                    signals:   structureResult.signals,
                    penalties: structureResult.penalties,
                    aiFeedback: aiResult.feedback,
                    aiSkipped:  aiResult.skipped,
                }
                : {
                    metadata: sr.metadataScore.breakdown,
                };

            return {
                userId,
                repoName:        sr.repo.name                  as string,
                repoUrl:         (sr.repo.html_url ?? '')      as string,
                repoType:        sr.detection.type             as string,
                primaryLanguage: (sr.repo.language ?? 'Unknown') as string,
                metadataScore:   sr.metadataScore.score,
                structureScore:  isTopRepo ? structureResult.score : 0,
                aiScore:         isTopRepo ? aiResult.score        : 0,
                finalScore,
                isTopRepo,
                scoreBreakdown,
                pushedAt:  sr.repo.pushed_at ? new Date(sr.repo.pushed_at) : null,
                scoredAt:  now,
            };
        });

        await prisma.$transaction([
            prisma.githubRepository.deleteMany({ where: { userId } }),
            prisma.githubRepository.createMany({ data: repoRows }),
            prisma.talentProfile.update({
                where: { userId },
                data: {
                    githubScore:       compositeScore,
                    scoreLastUpdated:  now,
                },
            }),
        ]);
        console.log('[Scoring] Saved to DB successfully');

        // ── Step J: Return full result ──

        const duration = Date.now() - startTime;
        console.log('[Scoring] Total duration:', duration + 'ms');

        return {
            success:        true,
            compositeScore,
            reposAnalysed:  rankedList.length,
            topRepoName:    topRepo.repo.name,
            scoreBreakdown: {
                topRepo: {
                    name:           topRepo.repo.name,
                    type:           topRepo.detection.type,
                    metadataScore:  topRepo.metadataScore.score,
                    structureScore: structureResult.score,
                    aiScore:        aiResult.score,
                    finalScore:     topRepoFinalScore,
                    aiFeedback:     aiResult.feedback,
                },
                otherRepos: rankedList.slice(1).map(sr => ({
                    name:       sr.repo.name as string,
                    type:       sr.detection.type,
                    finalScore: sr.metadataScore.score,
                })),
            },
            duration,
        };

    } catch (err: any) {
        const errMsg = `Scoring failed: ${err?.message ?? 'Unknown error'}`;
        console.error('[Scoring] Error:', errMsg);

        // ── Partial save — persist whatever metadata scores we computed ──
        // This prevents a network blip on one scoring layer from wiping previously good data.
        if (scoredRepos.length > 0) {
            try {
                const now = new Date();
                await prisma.$transaction([
                    prisma.githubRepository.deleteMany({ where: { userId } }),
                    prisma.githubRepository.createMany({
                        data: scoredRepos.map(sr => ({
                            userId,
                            repoName:        sr.repo.name                  as string,
                            repoUrl:         (sr.repo.html_url ?? '')      as string,
                            repoType:        sr.detection.type             as string,
                            primaryLanguage: (sr.repo.language ?? 'Unknown') as string,
                            metadataScore:   sr.metadataScore.score,
                            structureScore:  0,
                            aiScore:         0,
                            finalScore:      sr.metadataScore.score,
                            isTopRepo:       false,
                            scoreBreakdown:  { metadata: sr.metadataScore.breakdown },
                            pushedAt:  sr.repo.pushed_at ? new Date(sr.repo.pushed_at) : null,
                            scoredAt:  now,
                        })),
                    }),
                ]);
            } catch { /* partial save also failed — ignore, don't mask original error */ }
        }

        return {
            success:        false,
            compositeScore: 0,
            reposAnalysed:  scoredRepos.length,
            topRepoName:    '',
            scoreBreakdown: {
                topRepo:    { name: '', type: '', metadataScore: 0, structureScore: 0, aiScore: 0, finalScore: 0, aiFeedback: '' },
                otherRepos: scoredRepos.slice(1).map(sr => ({
                    name:       sr.repo.name as string,
                    type:       sr.detection.type,
                    finalScore: sr.metadataScore.score,
                })),
            },
            duration: Date.now() - startTime,
            error:    errMsg,
        };
    }
}

/*
──────────────────────────────────────────────────────────────────────────────
MANUAL TEST — requires real tokens; run as a one-off script

import { scoreGithubProfile } from "@/lib/scoreGithubProfile";

// Pull from DB or use test values:
const userId         = "cm...";          // real User.id
const githubUsername = "torvalds";       // any public GitHub username
const githubToken    = process.env.GITHUB_TEST_TOKEN!;  // personal access token

const result = await scoreGithubProfile(userId, githubUsername, githubToken);

console.log("success:",        result.success);
console.log("compositeScore:", result.compositeScore);
console.log("topRepo:",        result.scoreBreakdown.topRepo);
console.log("otherRepos:",     result.scoreBreakdown.otherRepos);
console.log("duration:",       result.duration + "ms");

// ── Expected shape (success path) ──
// {
//   success: true,
//   compositeScore: 72.4,     // weighted blend
//   reposAnalysed: 4,
//   topRepoName: "linux",
//   scoreBreakdown: {
//     topRepo: { name, type, metadataScore, structureScore, aiScore, finalScore, aiFeedback },
//     otherRepos: [{ name, type, finalScore }, ...]
//   },
//   duration: 4820             // ~5s when Groq is called
// }

// ── Expected shape (no qualifying repos) ──
// { success: false, error: "No qualifying repositories found after filtering", ... }

// ── Expected shape (GitHub API down) ──
// { success: false, error: "GitHub API error: 503 Service Unavailable", ... }
──────────────────────────────────────────────────────────────────────────────
*/
