import { DetectionResult } from './detectRepoType';
import { MetadataScoreResult } from './scoreMetadata';

const MONTH_MS = 30 * 24 * 60 * 60 * 1000;

export interface ScoredRepo {
    repo:          any;                  // raw GitHub API repo object
    detection:     DetectionResult;      // from detectRepoType
    metadataScore: MetadataScoreResult;  // from scoreMetadata
}

export interface TopRepoResult {
    topRepo:           ScoredRepo;
    rankedList:        ScoredRepo[];  // all repos sorted best → worst
    selectionReason:   string;        // human-readable — why this one was picked
    wasManuallyPinned: boolean;       // true if user overrode with pinnedRepoName
}

function recencyBonus(pushedAt: string | null | undefined): number {
    if (!pushedAt) return 0;
    const ageMs = Date.now() - new Date(pushedAt).getTime();
    if      (ageMs < MONTH_MS)        return 100;
    else if (ageMs < 3  * MONTH_MS)   return  75;
    else if (ageMs < 6  * MONTH_MS)   return  50;
    else if (ageMs < 12 * MONTH_MS)   return  25;
    else                              return   0;
}

function popularityBonus(repo: any): number {
    return Math.min(
        (repo.stargazers_count ?? 0) * 2 +
        (repo.forks_count      ?? 0) * 3,
        100,
    );
}

// Separate sort key so a large stale repo cannot outscore a smaller active one
// on metadata alone — recency and popularity get an independent weight here.
function compositeSortKey(sr: ScoredRepo): number {
    return (sr.metadataScore.score           * 0.60) +
           (recencyBonus(sr.repo.pushed_at)  * 0.25) +
           (popularityBonus(sr.repo)         * 0.15);
}

function buildSelectionReason(sr: ScoredRepo): string {
    const score   = sr.metadataScore.score;
    const lang    = sr.repo.language ?? null;
    const signals = sr.metadataScore.signals;

    const parts: string[] = [`Highest overall score (${score}/100)`];
    if (lang) parts.push(lang);

    // Pick up to 2 of the most reader-friendly signals
    const notable = signals
        .filter(s => s.includes('maintained') || s.includes('starred') || s.includes('forked'))
        .slice(0, 2);
    parts.push(...notable);

    return parts.join(' — ');
}

export function selectTopRepo(
    scoredRepos:     ScoredRepo[],
    pinnedRepoName?: string,
): TopRepoResult {
    if (scoredRepos.length === 0) {
        throw new Error('No repos available to select from');
    }

    // ── Fast path: only one repo qualifies ──
    if (scoredRepos.length === 1) {
        return {
            topRepo:           scoredRepos[0],
            rankedList:        [...scoredRepos],
            selectionReason:   'Only qualifying repo after filtering',
            wasManuallyPinned: false,
        };
    }

    // ── Build ranked list — used by both paths below ──
    const rankedList = [...scoredRepos].sort(
        (a, b) => compositeSortKey(b) - compositeSortKey(a),
    );

    // ── Pinned repo (user override) ──
    if (pinnedRepoName !== undefined) {
        const pinned = scoredRepos.find(sr => sr.repo.name === pinnedRepoName);
        if (pinned) {
            return {
                topRepo:           pinned,
                rankedList,
                selectionReason:   'Manually pinned by user',
                wasManuallyPinned: true,
            };
        }
        // Pin target was filtered out or renamed — fall through with a note
    }

    // ── Algorithmic selection ──
    const topRepo = rankedList[0];

    const pinIgnoredSuffix = pinnedRepoName !== undefined
        ? ` (pinned repo "${pinnedRepoName}" not found — pin ignored)`
        : '';

    return {
        topRepo,
        rankedList,
        selectionReason:   buildSelectionReason(topRepo) + pinIgnoredSuffix,
        wasManuallyPinned: false,
    };
}

/*
──────────────────────────────────────────────────────────────────────────────
MANUAL TEST — paste into a scratch file or Node REPL to verify

import { selectTopRepo } from "@/lib/selectTopRepo";

const TWO_WEEKS_AGO        = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();
const THREE_WEEKS_AGO      = new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString();
const YESTERDAY            = new Date(Date.now() -  1 * 24 * 60 * 60 * 1000).toISOString();
const EIGHTEEN_MONTHS_AGO  = new Date(Date.now() - 18 * 30 * 24 * 60 * 60 * 1000).toISOString();

// ── Repo A: TypeScript, 15 stars, large, pushed 2 weeks ago ──
// metadataScore.score = 78
//   sizeScore 20 (≥ 3 MB) + popularityScore 11 (7+4) + recencyScore 20 + qualityScore 12 + languageScore 15
// sortKey = (78 × 0.60) + (100 × 0.25) + (39 × 0.15) = 46.8 + 25.0 + 5.85 = 77.65
const repoA = {
    repo: {
        name: 'ecommerce-platform', language: 'TypeScript', size: 5000,
        stargazers_count: 15, forks_count: 3,
        pushed_at: TWO_WEEKS_AGO,
        description: 'A full-stack e-commerce platform',
        topics: ['typescript', 'nextjs', 'react'],
        fork: false, owner: { login: 'alice' },
    },
    detection:     { type: 'web_app', confidence: 'high', signals: [] },
    metadataScore: {
        score: 78,
        breakdown: { sizeScore: 20, popularityScore: 11, recencyScore: 20, qualityScore: 12, languageScore: 15 },
        signals:   ['substantial project (≥ 3 MB)', '15 stars', '3 forks',
                    'actively maintained (pushed < 1 month ago)',
                    'has description', 'has topics/tags', 'original work (not a fork)',
                    'top-tier language (TypeScript)'],
        penalties: [],
    },
};

// ── Repo B: Python, 50 stars, very large, but 18 months stale ──
// metadataScore.score = 72
//   sizeScore 25 (≥ 10 MB) + popularityScore 20 + recencyScore 2 + qualityScore 12 + languageScore 13
// sortKey = (72 × 0.60) + (0 × 0.25) + (100 × 0.15) = 43.2 + 0.0 + 15.0 = 58.20
//   recencyBonus = 0 because pushed > 12 months ago — this is what drops it below Repo C
const repoB = {
    repo: {
        name: 'ml-research-lab', language: 'Python', size: 20000,
        stargazers_count: 50, forks_count: 20,
        pushed_at: EIGHTEEN_MONTHS_AGO,
        description: 'Machine learning experiments',
        topics: ['machine-learning', 'python'],
        fork: false, owner: { login: 'alice' },
    },
    detection:     { type: 'data_science', confidence: 'high', signals: [] },
    metadataScore: {
        score: 72,
        breakdown: { sizeScore: 25, popularityScore: 20, recencyScore: 2, qualityScore: 12, languageScore: 13 },
        signals:   ['large project (≥ 10 MB)', 'highly starred (50 ★)', 'widely forked (20 forks)',
                    'has description', 'has topics/tags', 'original work (not a fork)',
                    'top-tier language (Python)'],
        penalties: [],
    },
};

// ── Repo C: JavaScript, 2 stars, medium, pushed 3 weeks ago ──
// metadataScore.score = 55
//   sizeScore 14 (≥ 500 KB) + popularityScore 2 + recencyScore 20 + qualityScore 8 + languageScore 11
// sortKey = (55 × 0.60) + (100 × 0.25) + (4 × 0.15) = 33.0 + 25.0 + 0.6 = 58.60
//   Edges out Repo B (58.20) because recencyBonus rescues a medium active repo over a stale popular one
const repoC = {
    repo: {
        name: 'blog-starter', language: 'JavaScript', size: 1200,
        stargazers_count: 2, forks_count: 0,
        pushed_at: THREE_WEEKS_AGO,
        description: 'A minimal blog starter kit',
        topics: [],
        fork: false, owner: { login: 'alice' },
    },
    detection:     { type: 'web_app', confidence: 'medium', signals: [] },
    metadataScore: {
        score: 55,
        breakdown: { sizeScore: 14, popularityScore: 2, recencyScore: 20, qualityScore: 8, languageScore: 11 },
        signals:   ['medium project (≥ 500 KB)', 'actively maintained (pushed < 1 month ago)',
                    'has description', 'original work (not a fork)', 'in-demand language (JavaScript)'],
        penalties: [],
    },
};

// ── Repo D: no language, tiny, 0 stars, pushed yesterday ──
// metadataScore.score = 27
//   sizeScore 4 (≥ 10 KB) + popularityScore 0 + recencyScore 20 + qualityScore 3 + languageScore 0
// sortKey = (27 × 0.60) + (100 × 0.25) + (0 × 0.15) = 16.2 + 25.0 + 0.0 = 41.20
const repoD = {
    repo: {
        name: 'config-dotfiles', language: null, size: 30,
        stargazers_count: 0, forks_count: 0,
        pushed_at: YESTERDAY,
        description: '',
        topics: [],
        fork: false, owner: { login: 'alice' },
    },
    detection:     { type: 'other', confidence: 'low', signals: [] },
    metadataScore: {
        score: 27,
        breakdown: { sizeScore: 4, popularityScore: 0, recencyScore: 20, qualityScore: 3, languageScore: 0 },
        signals:   ['minimal project (≥ 10 KB)', 'actively maintained (pushed < 1 month ago)',
                    'original work (not a fork)'],
        penalties: [],
    },
};

// ── Test 1: algorithmic selection ──
const result1 = selectTopRepo([repoA, repoB, repoC, repoD]);

console.log("topRepo:", result1.topRepo.repo.name);
// → "ecommerce-platform"   (sortKey 77.65 — clear winner)

console.log("rankedList:", result1.rankedList.map(s => s.repo.name));
// → ["ecommerce-platform", "blog-starter", "ml-research-lab", "config-dotfiles"]
//   Note: blog-starter (58.60) ranks above ml-research-lab (58.20) despite lower metadataScore
//         — recencyBonus 100 vs 0 is the deciding factor

console.log("wasManuallyPinned:", result1.wasManuallyPinned);  // false
console.log("selectionReason:", result1.selectionReason);
// → "Highest overall score (78/100) — TypeScript — actively maintained (pushed < 1 month ago)"

// ── Test 2: pinned repo override — user pins repo D (last in algo ranking) ──
const result2 = selectTopRepo([repoA, repoB, repoC, repoD], 'config-dotfiles');

console.log("topRepo:", result2.topRepo.repo.name);
// → "config-dotfiles"   (user pinned it — algo rank is irrelevant)

console.log("rankedList:", result2.rankedList.map(s => s.repo.name));
// → ["ecommerce-platform", "blog-starter", "ml-research-lab", "config-dotfiles"]
//   rankedList is still sorted algorithmically — pin only affects topRepo

console.log("wasManuallyPinned:", result2.wasManuallyPinned);  // true
console.log("selectionReason:", result2.selectionReason);
// → "Manually pinned by user"

// ── Test 3: pin target not found — silently falls back to algorithmic ──
const result3 = selectTopRepo([repoA, repoB, repoC, repoD], 'old-deleted-repo');

console.log("topRepo:", result3.topRepo.repo.name);
// → "ecommerce-platform"   (algo selection — pin was ignored)

console.log("wasManuallyPinned:", result3.wasManuallyPinned);  // false
console.log("selectionReason:", result3.selectionReason);
// → 'Highest overall score (78/100) — TypeScript — actively maintained (pushed < 1 month ago)
//    (pinned repo "old-deleted-repo" not found — pin ignored)'
──────────────────────────────────────────────────────────────────────────────
*/
