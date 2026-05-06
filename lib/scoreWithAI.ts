import { DetectionResult } from './detectRepoType';
import { StructureScoreResult } from './scoreStructure';

const GROQ_API_URL     = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL       = 'llama-3.1-70b-versatile';
const GITHUB_API       = 'https://api.github.com';
const MAX_FILE_CHARS   = 2000;
const MAX_README_CHARS = 800;

export interface AIScoreResult {
    score: number;
    breakdown: {
        readability:   number;  // 0-25
        bestPractices: number;  // 0-25
        structure:     number;  // 0-25
        security:      number;  // 0-25
    };
    feedback:    string;   // 2-3 sentence human-readable summary
    model:       string;   // which model was used
    skipped:     boolean;  // true if AI call was skipped for any reason
    skipReason?: string;   // why it was skipped
}

// ── Entry file candidates (priority order) ──
const ENTRY_FILE_CANDIDATES = [
    'src/index.ts', 'src/index.js', 'src/main.ts', 'src/app.ts',
    'index.ts', 'index.js', 'main.py', 'app.py', 'Main.kt',
    'lib/main.dart', 'src/extension.ts',
];

// ── Config file candidates (priority order) ──
const CONFIG_FILE_CANDIDATES = [
    'tsconfig.json', '.eslintrc.json', '.eslintrc.js',
    'jest.config.ts', 'vite.config.ts', 'next.config.js',
];

// ── Component / route file patterns ──
const COMPONENT_PATTERNS: RegExp[] = [
    /^src\/components\/[^/]+\.tsx$/,
    /^src\/components\/[^/]+\.jsx$/,
    /^src\/routes\/[^/]+\.ts$/,
    /^src\/controllers\/[^/]+\.ts$/,
    /^app\/components\/[^/]+\.tsx$/,
    /^pages\/[^/]+\.tsx$/,
];

// ── Skip / error result helpers ──

function neutralResult(skipReason: string): AIScoreResult {
    return {
        score:     50,
        breakdown: { readability: 12, bestPractices: 12, structure: 13, security: 13 },
        feedback:  'AI analysis was skipped — insufficient content to evaluate.',
        model:     'none',
        skipped:   true,
        skipReason,
    };
}

function errorResult(skipReason: string): AIScoreResult {
    return {
        score:     50,
        breakdown: { readability: 12, bestPractices: 12, structure: 13, security: 13 },
        feedback:  'AI analysis unavailable at this time.',
        model:     GROQ_MODEL,
        skipped:   true,
        skipReason,
    };
}

// ── Utility helpers ──

function clamp(v: any, min: number, max: number): number {
    return Math.min(Math.max(Number(v) || 0, min), max);
}

function ghHeaders(token: string): Record<string, string> {
    return {
        'Authorization': `Bearer ${token}`,
        'Accept':        'application/vnd.github+json',
        'User-Agent':    'SkillSpill-App',
    };
}

// ── File selection ──

function selectCodeFiles(fileTree: string[]): string[] {
    const selected: string[] = [];

    // 1. Main entry file
    const entryFile = ENTRY_FILE_CANDIDATES.find(f => fileTree.includes(f));
    if (entryFile) selected.push(entryFile);

    // 2. One component or route file
    const componentFile = fileTree.find(f =>
        COMPONENT_PATTERNS.some(pattern => pattern.test(f)),
    );
    if (componentFile) selected.push(componentFile);

    // 3. One config or setup file
    const configFile = CONFIG_FILE_CANDIDATES.find(f => fileTree.includes(f));
    if (configFile) selected.push(configFile);

    return selected;
}

// ── GitHub file fetcher ──

async function fetchFileContent(
    owner:    string,
    repoName: string,
    path:     string,
    token:    string,
): Promise<string | null> {
    try {
        const res = await fetch(
            `${GITHUB_API}/repos/${owner}/${repoName}/contents/${path}`,
            { headers: ghHeaders(token) },
        );
        if (!res.ok) return null;
        const data    = await res.json();
        const decoded = Buffer.from(
            (data.content as string).replace(/\n/g, ''),
            'base64',
        ).toString('utf-8');
        return decoded.slice(0, MAX_FILE_CHARS);
    } catch {
        return null;
    }
}

// ── Prompt builder ──

function buildPrompt(
    repo:         any,
    detection:    DetectionResult,
    readmeContent: string,
    codeFiles:    Array<{ path: string; content: string }>,
): string {
    const codeSections = codeFiles
        .map(f => `--- ${f.path} ---\n${f.content}`)
        .join('\n\n');

    return [
        'You are a senior software engineer reviewing a GitHub repository.',
        'Evaluate the code quality and respond ONLY with a valid JSON object.',
        'Do not include any explanation, markdown, or text outside the JSON.',
        '',
        'Repository context:',
        `- Name: ${repo.name}`,
        `- Type: ${detection.type}`,
        `- Primary language: ${repo.language ?? 'Unknown'}`,
        `- Description: ${repo.description ?? 'None provided'}`,
        `- Stars: ${repo.stargazers_count ?? 0}, Forks: ${repo.forks_count ?? 0}`,
        '',
        'README (first 800 chars):',
        readmeContent.slice(0, MAX_README_CHARS),
        '',
        'Code samples:',
        codeSections,
        '',
        'Rate this codebase on these 4 dimensions (0-25 each):',
        '1. readability — naming, comments, clarity, formatting',
        '2. bestPractices — patterns, error handling, separation of concerns',
        '3. structure — folder organisation, modularity, file naming',
        '4. security — no hardcoded secrets, input validation, safe patterns',
        '',
        'Also write a 2-3 sentence feedback string for the developer.',
        'Be specific and constructive. Mention the repo type and language.',
        '',
        'Respond ONLY with this exact JSON shape:',
        '{',
        '  "readability": <number 0-25>,',
        '  "bestPractices": <number 0-25>,',
        '  "structure": <number 0-25>,',
        '  "security": <number 0-25>,',
        '  "feedback": "<string>"',
        '}',
    ].join('\n');
}

/**
 * Step 7 of the GitHub Scoring Engine.
 *
 * Uses Groq's API (llama-3.1-70b-versatile) to perform intelligent code
 * quality analysis on the single top repo selected in Step 5.
 *
 * Inputs:
 *   - repo             Raw GitHub API repo object
 *   - detection        Repo type classification from detectRepoType()
 *   - structureResult  Output of scoreStructure() — fileTree, readmeContent,
 *                      and packageJson are reused directly (nothing re-fetched)
 *   - githubToken      OAuth token used to fetch 2-3 source files for analysis
 *
 * Outputs:
 *   AIScoreResult — score 0-100, per-dimension breakdown (0-25 each),
 *   and a 2-3 sentence developer feedback string.
 *   Never throws — all failures degrade gracefully to score 50 (neutral).
 *
 * API endpoint: POST https://api.groq.com/openai/v1/chat/completions
 * Expected latency: ~2-5 seconds
 */
export async function scoreWithAI(
    repo:            any,
    detection:       DetectionResult,
    structureResult: StructureScoreResult,
    githubToken:     string,
): Promise<AIScoreResult> {
    console.log('[AI Scorer] Starting analysis for:', repo.name);

    // ── Step 1: Decide whether to call AI ──

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
        const result = neutralResult('GROQ_API_KEY not configured');
        console.log('[AI Scorer] Skipped. Reason:', result.skipReason);
        return result;
    }

    if ((repo.size ?? 0) < 50) {
        const result = neutralResult('Repo too small for meaningful AI analysis');
        console.log('[AI Scorer] Skipped. Reason:', result.skipReason);
        return result;
    }

    const { readmeContent, fileTree } = structureResult;

    if (readmeContent === '' && fileTree.length < 5) {
        const result = neutralResult('Insufficient content to evaluate');
        console.log('[AI Scorer] Skipped. Reason:', result.skipReason);
        return result;
    }

    try {
        const owner    = String(repo.owner?.login ?? '');
        const repoName = String(repo.name         ?? '');

        // ── Step 2: Fetch code samples ──

        const selectedPaths = selectCodeFiles(fileTree);

        const fetchResults = await Promise.allSettled(
            selectedPaths.map(path => fetchFileContent(owner, repoName, path, githubToken)),
        );

        const codeFiles = selectedPaths
            .map((path, i) => {
                const r       = fetchResults[i];
                const content = r.status === 'fulfilled' ? (r.value ?? '') : '';
                return { path, content };
            })
            .filter(f => f.content.length > 0);

        // ── Step 3: Build prompt ──

        const prompt = buildPrompt(repo, detection, readmeContent, codeFiles);

        // ── Step 4: Call Groq API ──

        const groqRes = await fetch(GROQ_API_URL, {
            method:  'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type':  'application/json',
            },
            body: JSON.stringify({
                model:           GROQ_MODEL,
                messages:        [{ role: 'user', content: prompt }],
                temperature:     0.1,
                max_tokens:      400,
                response_format: { type: 'json_object' },
            }),
        });

        if (!groqRes.ok) {
            const text = await groqRes.text().catch(() => groqRes.statusText);
            return errorResult(`Groq API error: ${groqRes.status} ${text}`);
        }

        // ── Step 5: Parse and validate response ──

        const groqData = await groqRes.json();
        const content  = groqData?.choices?.[0]?.message?.content ?? '';
        const parsed   = JSON.parse(content);

        const readability   = clamp(parsed.readability,   0, 25);
        const bestPractices = clamp(parsed.bestPractices, 0, 25);
        const structure     = clamp(parsed.structure,     0, 25);
        const security      = clamp(parsed.security,      0, 25);
        const feedback      = typeof parsed.feedback === 'string'
            ? parsed.feedback.slice(0, 500)
            : 'No feedback provided.';

        const score = readability + bestPractices + structure + security;

        // ── Step 7: Return full result ──

        const result: AIScoreResult = {
            score,
            breakdown: { readability, bestPractices, structure, security },
            feedback,
            model:   GROQ_MODEL,
            skipped: false,
        };

        console.log('[AI Scorer] Complete. Score:', result.score);
        return result;

    } catch (err: any) {
        const result = errorResult(`Groq API error: ${err?.message ?? 'Unknown error'}`);
        console.log('[AI Scorer] Error:', result.skipReason);
        return result;
    }
}

/*
──────────────────────────────────────────────────────────────────────────────
MANUAL TEST — paste into a scratch file to verify skip conditions

import { scoreWithAI } from "@/lib/scoreWithAI";

// ── Case 1: Missing API key → neutral skip ──
// Temporarily unset process.env.GROQ_API_KEY before running
// Expected: { score: 50, skipped: true, skipReason: 'GROQ_API_KEY not configured' }

// ── Case 2: Repo too small → neutral skip ──
const tinyRepo = {
    name: 'hello-world', owner: { login: 'alice' },
    language: 'JavaScript', size: 10,
    description: '', stargazers_count: 0, forks_count: 0,
};
// Expected: { score: 50, skipped: true, skipReason: 'Repo too small for meaningful AI analysis' }

// ── Case 3: No README + tiny file tree → neutral skip ──
const emptyStructure = {
    score: 0, breakdown: { sharedScore: 0, typeScore: 0 },
    fileTree: ['README.md'],   // only 1 file
    readmeContent: '',         // and no README content
    signals: [], penalties: [], packageJson: null,
};
// Expected: { score: 50, skipped: true, skipReason: 'Insufficient content to evaluate' }

// ── Case 4: Full run (requires valid GROQ_API_KEY in .env) ──
const repo = {
    name: 'ecommerce-platform', owner: { login: 'alice' },
    language: 'TypeScript', size: 5000, description: 'A full-stack e-commerce platform',
    stargazers_count: 15, forks_count: 3, default_branch: 'main',
};
const detection = { type: 'web_app' as const, confidence: 'high' as const, signals: [] };
const structureResult = {
    score: 72, breakdown: { sharedScore: 35, typeScore: 37 },
    fileTree: ['src/index.ts', 'src/components/Header.tsx', 'tsconfig.json', 'package.json'],
    readmeContent: '# E-Commerce Platform\n\nA full-stack app built with Next.js and TypeScript...',
    signals: ['thorough README', 'has test folder'], penalties: [], packageJson: {},
};
// const result = await scoreWithAI(repo, detection, structureResult, process.env.GITHUB_TEST_TOKEN!);
// Expected: { score: 60-90, skipped: false, feedback: '<meaningful string>', model: 'llama-3.1-70b-versatile' }
──────────────────────────────────────────────────────────────────────────────
*/
