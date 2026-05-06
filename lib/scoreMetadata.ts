import { DetectionResult } from './detectRepoType';

// Job-market demand tiers — spec cut off at "Java, Dart"; tiers below that are inferred
const LANGUAGE_SCORES: Record<string, number> = {
    'typescript':   15,
    // ── Tier 13 ──
    'python':       13,
    'rust':         13,
    'go':           13,
    'kotlin':       13,
    // ── Tier 11 ──
    'javascript':   11,
    'swift':        11,
    'c++':          11,
    'c#':           11,
    // ── Tier 9 (inferred — spec ended here) ──
    'java':          9,
    'dart':          9,
    'scala':         9,
    'objective-c':   9,
    // ── Tier 7 ──
    'php':           7,
    'ruby':          7,
    'elixir':        7,
    'haskell':       7,
    // ── Tier 5 ──
    'r':             5,
    'shell':         5,
    'c':             5,
    'lua':           5,
    'matlab':        5,
};

const MONTH_MS = 30 * 24 * 60 * 60 * 1000;

export interface MetadataScoreResult {
    score: number;
    breakdown: {
        sizeScore:       number;  // 0-25
        popularityScore: number;  // 0-20
        recencyScore:    number;  // 0-20
        qualityScore:    number;  // 0-20
        languageScore:   number;  // 0-15
    };
    signals:   string[];  // what contributed positively
    penalties: string[];  // what reduced the score
}

// detection is accepted here and will be used in later scoring steps
// (e.g. type-specific structure checks in scoreStructure)
export function scoreMetadata(repo: any, _detection: DetectionResult): MetadataScoreResult {
    const signals:   string[] = [];
    const penalties: string[] = [];

    // ── Size Score (max 25) ──
    const size = repo.size ?? 0;
    let sizeScore: number;
    if      (size >= 10000) { sizeScore = 25; signals.push('large project (≥ 10 MB)');      }
    else if (size >= 3000)  { sizeScore = 20; signals.push('substantial project (≥ 3 MB)'); }
    else if (size >= 500)   { sizeScore = 14; signals.push('medium project (≥ 500 KB)');    }
    else if (size >= 100)   { sizeScore = 8;  signals.push('small project (≥ 100 KB)');     }
    else if (size >= 10)    { sizeScore = 4;  signals.push('minimal project (≥ 10 KB)');    }
    else                    { sizeScore = 1;                                                  }

    // ── Popularity Score (max 20) ──
    const stars = repo.stargazers_count ?? 0;
    const forks = repo.forks_count      ?? 0;

    let starsPoints: number;
    if      (stars >= 50) { starsPoints = 12; signals.push(`highly starred (${stars} ★)`);  }
    else if (stars >= 20) { starsPoints = 9;  signals.push(`well starred (${stars} ★)`);    }
    else if (stars >= 10) { starsPoints = 7;  signals.push(`${stars} stars`);               }
    else if (stars >= 5)  { starsPoints = 5;  signals.push(`${stars} stars`);               }
    else if (stars >= 1)  { starsPoints = 2;                                                 }
    else                  { starsPoints = 0;                                                 }

    let forksPoints: number;
    if      (forks >= 10) { forksPoints = 8; signals.push(`widely forked (${forks} forks)`); }
    else if (forks >= 5)  { forksPoints = 6; signals.push(`${forks} forks`);                 }
    else if (forks >= 2)  { forksPoints = 4; signals.push(`${forks} forks`);                 }
    else if (forks >= 1)  { forksPoints = 2;                                                  }
    else                  { forksPoints = 0;                                                  }

    const popularityScore = Math.min(starsPoints + forksPoints, 20);

    // ── Recency Score (max 20) ──
    let recencyScore = 0;
    if (repo.pushed_at) {
        const ageMs = Date.now() - new Date(repo.pushed_at).getTime();
        if      (ageMs < MONTH_MS)        { recencyScore = 20; signals.push('actively maintained (pushed < 1 month ago)');  }
        else if (ageMs < 3  * MONTH_MS)   { recencyScore = 16; signals.push('recently maintained (pushed < 3 months ago)'); }
        else if (ageMs < 6  * MONTH_MS)   { recencyScore = 11; }
        else if (ageMs < 12 * MONTH_MS)   { recencyScore = 6;  }
        else if (ageMs < 24 * MONTH_MS)   { recencyScore = 2;  }
        else                              { recencyScore = 0;  }
    }

    // ── Quality Signals Score (max 20, min 0) ──
    let qualityRaw = 0;

    if (repo.description)            { qualityRaw += 5; signals.push('has description');               }
    if ((repo.topics?.length ?? 0) > 0) { qualityRaw += 4; signals.push('has topics/tags');           }
    if (repo.has_pages === true)      { qualityRaw += 4; signals.push('has live demo (GitHub Pages)'); }
    if (repo.homepage)               { qualityRaw += 4; signals.push('has homepage URL');              }
    if (repo.fork === false)          { qualityRaw += 3; signals.push('original work (not a fork)');   }

    if (repo.fork === true) {
        qualityRaw -= 5;
        penalties.push('is a fork (-5)');
    }
    if (/^[a-z0-9]{20,}$/.test(repo.name ?? '')) {
        qualityRaw -= 3;
        penalties.push('lazy naming — no separators, > 20 chars (-3)');
    }

    const qualityScore = Math.max(0, Math.min(qualityRaw, 20));

    // ── Language Score (max 15) ──
    const lang         = (repo.language ?? '').toLowerCase();
    const languageScore = LANGUAGE_SCORES[lang] ?? (lang ? 3 : 0);
    if (languageScore >= 13) signals.push(`top-tier language (${repo.language})`);
    else if (languageScore >= 9) signals.push(`in-demand language (${repo.language})`);

    // ── Final Score (naturally bounded 0–100) ──
    const score = sizeScore + popularityScore + recencyScore + qualityScore + languageScore;

    return {
        score,
        breakdown: {
            sizeScore,
            popularityScore,
            recencyScore,
            qualityScore,
            languageScore,
        },
        signals,
        penalties,
    };
}

/*
──────────────────────────────────────────────────────────────────────────────
MANUAL TEST — run with: node _test-metadata.js

// ── Case 1: Strong TypeScript project → high score ──
scoreMetadata(
    {
        name: 'ecommerce-platform', language: 'TypeScript', size: 5000,
        stargazers_count: 45, forks_count: 8,
        pushed_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'A full-stack e-commerce platform', topics: ['typescript','react','nextjs'],
        has_pages: false, homepage: 'https://myapp.com', fork: false,
    },
    { type: 'web_app', confidence: 'high', signals: [] }
)
// Expected:
//   sizeScore:       20   (≥ 3000 KB)
//   popularityScore: 15   (9 stars + 6 forks)
//   recencyScore:    20   (< 1 month)
//   qualityScore:    16   (desc +5, topics +4, homepage +4, not-fork +3)
//   languageScore:   15
//   score:           86

// ── Case 2: Minimal bare repo → low score ──
scoreMetadata(
    {
        name: 'my-project', language: null, size: 50,
        stargazers_count: 0, forks_count: 0,
        pushed_at: new Date(Date.now() - 8 * 30 * 24 * 60 * 60 * 1000).toISOString(),
        description: '', topics: [], has_pages: false, homepage: '', fork: false,
    },
    { type: 'other', confidence: 'low', signals: [] }
)
// Expected:
//   sizeScore:       4    (50 KB → minimal project ≥ 10 KB tier)
//   popularityScore: 0
//   recencyScore:    6    (< 12 months)
//   qualityScore:    3    (not-fork +3 only)
//   languageScore:   0    (null language)
//   score:           13

// ── Case 3: Fork with penalties ──
scoreMetadata(
    {
        name: 'awesome-lib', language: 'JavaScript', size: 200,
        stargazers_count: 2, forks_count: 0,
        pushed_at: new Date(Date.now() - 10 * 30 * 24 * 60 * 60 * 1000).toISOString(),
        description: '', topics: [], has_pages: false, homepage: '', fork: true,
    },
    { type: 'web_app', confidence: 'medium', signals: [] }
)
// Expected:
//   sizeScore:       8    (200 KB → small project ≥ 100 KB tier)
//   popularityScore: 2    (2 stars → sub-5 tier = 2 pts; 0 forks)
//   recencyScore:    6    (< 12 months)
//   qualityScore:    0    (fork -5, raw = -5, clamped to 0)
//   languageScore:   11
//   score:           27
//   penalties:       ['is a fork (-5)']

// ── Case 4: Active Python data science repo ──
scoreMetadata(
    {
        name: 'ml-pipeline', language: 'Python', size: 1200,
        stargazers_count: 120, forks_count: 25,
        pushed_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'End-to-end ML pipeline', topics: ['machine-learning','python'],
        has_pages: false, homepage: '', fork: false,
    },
    { type: 'data_science', confidence: 'high', signals: [] }
)
// Expected:
//   sizeScore:       20   (≥ 3000? No — 1200, so ≥ 500 → 14)
//   popularityScore: 20   (12 stars + 8 forks = 20, capped)
//   recencyScore:    16   (< 3 months)
//   qualityScore:    12   (desc +5, topics +4, not-fork +3)
//   languageScore:   13
//   score:           75
──────────────────────────────────────────────────────────────────────────────
*/
