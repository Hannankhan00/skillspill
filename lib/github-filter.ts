const THROWAWAY_KEYWORDS = [
    'test', 'demo', 'tutorial', 'practice',
    'homework', 'assignment', 'course', 'learn', 'exercise',
    'clone', 'copy', 'sandbox', 'playground',
    'kata', 'leetcode', 'hackerrank',
];

const TWO_YEARS_MS  = 2 * 365 * 24 * 60 * 60 * 1000;
const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
const MAX_REPOS     = 5;

export interface RemovalReason {
    repoName: string;
    reason: string;
}

export interface FilterResult {
    filtered: any[];
    totalFound: number;
    totalRemoved: number;
    removalReasons: RemovalReason[];
}

export function filterRepos(repos: any[]): FilterResult {
    const now = Date.now();
    const removalReasons: RemovalReason[] = [];

    // ── Pass 1: apply disqualification rules ──
    const passed = repos.filter((repo) => {
        const nameLower = String(repo.name).toLowerCase();

        if (repo.fork) {
            removalReasons.push({ repoName: repo.name, reason: "fork" });
            return false;
        }

        if ((repo.size ?? 0) < 10) {
            removalReasons.push({ repoName: repo.name, reason: "too small (< 10 KB)" });
            return false;
        }

        // Split on hyphens/underscores/dots so "contest" is not caught by "test"
        const words = nameLower.split(/[^a-z0-9]+/);
        const hit = THROWAWAY_KEYWORDS.find((kw) => words.includes(kw));
        if (hit) {
            removalReasons.push({ repoName: repo.name, reason: `throwaway keyword: "${hit}"` });
            return false;
        }

        if (repo.pushed_at) {
            const pushedAge = now - new Date(repo.pushed_at).getTime();
            if (pushedAge > TWO_YEARS_MS) {
                removalReasons.push({ repoName: repo.name, reason: "abandoned (last push > 2 years ago)" });
                return false;
            }
        }

        if (repo.created_at) {
            const createdAge = now - new Date(repo.created_at).getTime();
            if (createdAge < THREE_DAYS_MS) {
                removalReasons.push({ repoName: repo.name, reason: "too new (created < 3 days ago)" });
                return false;
            }
        }

        // Profile README repo — GitHub creates a special repo whose name equals the username
        if (repo.owner?.login && nameLower === String(repo.owner.login).toLowerCase()) {
            removalReasons.push({ repoName: repo.name, reason: "profile README repo" });
            return false;
        }

        return true;
    });

    // ── Pass 2: sort by most recently pushed, cap at MAX_REPOS ──
    const sorted = passed.sort((a, b) => {
        const aTime = a.pushed_at ? new Date(a.pushed_at).getTime() : 0;
        const bTime = b.pushed_at ? new Date(b.pushed_at).getTime() : 0;
        return bTime - aTime;
    });

    const kept    = sorted.slice(0, MAX_REPOS);
    const dropped = sorted.slice(MAX_REPOS);

    for (const repo of dropped) {
        removalReasons.push({ repoName: repo.name, reason: "outside top 5 most recently pushed" });
    }

    return {
        filtered:      kept,
        totalFound:    repos.length,
        totalRemoved:  repos.length - kept.length,
        removalReasons,
    };
}

/*
──────────────────────────────────────────────────────────────────────────────
MANUAL TEST — paste into a scratch file or Node REPL to verify

import { filterRepos } from "@/lib/github-filter";

const TWO_YEARS_AGO   = new Date(Date.now() - 2 * 365 * 24 * 60 * 60 * 1000 - 1).toISOString();
const TWO_DAYS_AGO    = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();
const SIX_MONTHS_AGO  = new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000).toISOString();
const ONE_MONTH_AGO   = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

const mockRepos = [
    // ✗ fork
    { name: "forked-lib",      fork: true,  size: 500, pushed_at: ONE_MONTH_AGO,  created_at: SIX_MONTHS_AGO, owner: { login: "alice" } },
    // ✗ too small
    { name: "tiny-config",     fork: false, size: 4,   pushed_at: ONE_MONTH_AGO,  created_at: SIX_MONTHS_AGO, owner: { login: "alice" } },
    // ✗ throwaway keyword
    { name: "react-tutorial",  fork: false, size: 200, pushed_at: ONE_MONTH_AGO,  created_at: SIX_MONTHS_AGO, owner: { login: "alice" } },
    // ✗ abandoned
    { name: "old-project",     fork: false, size: 800, pushed_at: TWO_YEARS_AGO,  created_at: TWO_YEARS_AGO,  owner: { login: "alice" } },
    // ✗ too new
    { name: "brand-new-app",   fork: false, size: 150, pushed_at: TWO_DAYS_AGO,   created_at: TWO_DAYS_AGO,   owner: { login: "alice" } },
    // ✗ profile README
    { name: "alice",           fork: false, size: 12,  pushed_at: ONE_MONTH_AGO,  created_at: SIX_MONTHS_AGO, owner: { login: "alice" } },
    // ✓ kept
    { name: "ecommerce-app",   fork: false, size: 3200, pushed_at: ONE_MONTH_AGO, created_at: SIX_MONTHS_AGO, owner: { login: "alice" } },
    { name: "portfolio-site",  fork: false, size: 900,  pushed_at: ONE_MONTH_AGO, created_at: SIX_MONTHS_AGO, owner: { login: "alice" } },
];

const result = filterRepos(mockRepos);

console.log("totalFound:  ", result.totalFound);     // 8
console.log("totalRemoved:", result.totalRemoved);    // 6
console.log("filtered:    ", result.filtered.map(r => r.name)); // ["ecommerce-app", "portfolio-site"]
console.log("reasons:");
result.removalReasons.forEach(r => console.log(`  ${r.repoName}: ${r.reason}`));

// Expected removalReasons:
//   forked-lib:     fork
//   tiny-config:    too small (< 10 KB)
//   react-tutorial: throwaway keyword: "tutorial"
//   old-project:    abandoned (last push > 2 years ago)
//   brand-new-app:  too new (created < 3 days ago)
//   alice:          profile README repo
──────────────────────────────────────────────────────────────────────────────
*/
