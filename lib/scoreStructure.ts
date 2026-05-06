import { DetectionResult, RepoType } from './detectRepoType';

const GITHUB_API = 'https://api.github.com';

export interface StructureScoreResult {
    score:     number;
    breakdown: {
        sharedScore: number;  // 0-40 — signals that apply to ALL repo types
        typeScore:   number;  // 0-60 — signals specific to detected repo type
    };
    fileTree:      string[];  // raw file paths fetched (stored for later steps)
    signals:       string[];  // what scored positively
    penalties:     string[];  // what lost points
    readmeContent: string;    // raw README text (passed to AI scorer in step 7)
    packageJson:   any;       // parsed package.json if exists, or null
}

// ── Private result shapes ──

interface SharedResult {
    score:     number;
    signals:   string[];
    penalties: string[];
}

interface RubricResult {
    score:   number;
    signals: string[];
}

// ── File tree helpers ──

function hasFile(ft: string[], name: string): boolean {
    return ft.some(f => f === name || f.endsWith('/' + name));
}

function hasFolder(ft: string[], prefix: string): boolean {
    return ft.some(f => f.startsWith(prefix));
}

function hasExtension(ft: string[], ext: string): boolean {
    return ft.some(f => f.endsWith(ext));
}

// Checks for test files anywhere in the tree (root or nested test folders + .test/.spec files)
function hasAnyTestFile(ft: string[]): boolean {
    return ft.some(f =>
        f.endsWith('.test.ts') || f.endsWith('.test.js') ||
        f.endsWith('.spec.ts') || f.endsWith('.spec.js') ||
        f.split('/').some(p => p === '__tests__' || p === 'tests' || p === 'test'),
    );
}

function ghHeaders(token: string): Record<string, string> {
    return {
        'Authorization': `Bearer ${token}`,
        'Accept':        'application/vnd.github+json',
        'User-Agent':    'SkillSpill-App',
    };
}

// ── Shared scoring (max 40 — applies to ALL repo types) ──

function scoreShared(
    fileTree:      string[],
    readmeContent: string,
    hasEslint:     boolean,
): SharedResult {
    const signals:   string[] = [];
    const penalties: string[] = [];
    let score = 0;

    // ── README quality (max 15) ──
    if (readmeContent.length > 500) {
        score += 15; signals.push('thorough README (> 500 chars)');
    } else if (readmeContent.length > 100) {
        score += 8;  signals.push('basic README (> 100 chars)');
    } else if (readmeContent.length > 0) {
        score += 3;  signals.push('README exists but sparse');
    } else {
        penalties.push('No README found');
    }

    // ── Testing (max 10) ──
    let testScore = 0;
    if (fileTree.some(f => f.split('/').some(p => p === '__tests__' || p === 'tests' || p === 'test'))) {
        testScore += 4; signals.push('has test folder');
    }
    if (fileTree.some(f => f.endsWith('.test.ts') || f.endsWith('.test.js'))) {
        testScore += 4; signals.push('has .test.ts / .test.js files');
    }
    if (fileTree.some(f => f.endsWith('.spec.ts') || f.endsWith('.spec.js'))) {
        testScore += 4; signals.push('has .spec.ts / .spec.js files');
    }
    if (fileTree.some(f => f.startsWith('jest.config.') || f.startsWith('vitest.config.'))) {
        testScore += 2; signals.push('has jest / vitest config');
    }
    const cappedTest = Math.min(testScore, 10);
    score += cappedTest;
    if (cappedTest === 0) penalties.push('No tests found');

    // ── CI/CD (max 8) ──
    let ciScore = 0;
    if (hasFolder(fileTree, '.github/workflows/')) { ciScore = Math.max(ciScore, 8); signals.push('GitHub Actions configured');  }
    if (hasFile(fileTree, '.travis.yml'))           { ciScore = Math.max(ciScore, 5); signals.push('Travis CI configured');        }
    if (hasFolder(fileTree, '.circleci/'))           { ciScore = Math.max(ciScore, 5); signals.push('CircleCI configured');          }
    score += ciScore;

    // ── Code standards (max 7) ──
    let standardsScore = 0;
    if (hasEslint)                                                                      { standardsScore += 3; signals.push('ESLint configured');     }
    if (fileTree.some(f => f === '.prettierrc' || f.startsWith('prettier.config.')))   { standardsScore += 2; signals.push('Prettier configured');   }
    if (hasFile(fileTree, 'tsconfig.json'))                                             { standardsScore += 2; signals.push('TypeScript configured'); }
    score += Math.min(standardsScore, 7);

    return { score: Math.min(score, 40), signals, penalties };
}

// ── Type-specific rubrics (max 60 each) ──

function rubricWebApp(ft: string[], pkg: any, readme: string): RubricResult {
    const signals:    string[] = [];
    const readmeLower = readme.toLowerCase();
    let score = 0;

    if (hasFile(ft, 'package.json'))                          { score += 10; signals.push('has package.json');             }

    if (pkg?.dependencies) {
        const deps = pkg.dependencies as Record<string, string>;
        const hit  = ['react', 'vue', 'svelte', 'next', 'nuxt', '@angular/core'].find(f => f in deps);
        if (hit) { score += 15; signals.push(`uses ${hit} framework`); }
    }

    if (hasFolder(ft, 'src/'))                                                      { score += 8; signals.push('has src/ folder');            }
    if (hasFolder(ft, 'components/') || hasFolder(ft, 'src/components/'))           { score += 8; signals.push('has components/ folder');    }
    if (hasFile(ft, '.env.example'))                                                { score += 7; signals.push('has .env.example');           }
    if (hasFile(ft, 'Dockerfile'))                                                  { score += 6; signals.push('has Dockerfile');             }
    if (readmeLower.includes('installation') || readmeLower.includes('getting started')) {
        score += 6; signals.push('README has setup instructions');
    }

    return { score: Math.min(score, 60), signals };
}

function rubricBackendApi(ft: string[], _pkg: any, readme: string): RubricResult {
    const signals:    string[] = [];
    const readmeLower = readme.toLowerCase();
    let score = 0;

    if (hasFile(ft, 'Dockerfile'))                                                                          { score += 15; signals.push('has Dockerfile');                    }
    if (hasFile(ft, 'docker-compose.yml'))                                                                  { score += 10; signals.push('has docker-compose.yml');           }
    if (hasFolder(ft, 'routes/') || hasFolder(ft, 'controllers/') || hasFolder(ft, 'handlers/'))            { score += 10; signals.push('has routes / controllers folder');  }
    if (hasFolder(ft, 'middleware/'))                                                                        { score += 8;  signals.push('has middleware/ folder');            }
    if (hasFile(ft, '.env.example'))                                                                        { score += 7;  signals.push('has .env.example');                  }

    const hasSwagger = ft.some(f => f.toLowerCase().includes('swagger') || f.toLowerCase().includes('openapi'))
        || readmeLower.includes('swagger') || readmeLower.includes('openapi');
    if (hasSwagger) { score += 10; signals.push('has Swagger / OpenAPI docs'); }

    return { score: Math.min(score, 60), signals };
}

function rubricAndroid(ft: string[]): RubricResult {
    const signals: string[] = [];
    let score = 0;

    if (hasFile(ft, 'AndroidManifest.xml'))                                { score += 15; signals.push('has AndroidManifest.xml');              }
    if (hasFile(ft, 'build.gradle'))                                       { score += 10; signals.push('has build.gradle');                     }
    if (hasFolder(ft, 'res/'))                                             { score += 10; signals.push('has res/ folder');                      }
    if (ft.some(f => f.includes('ViewModel') || f.includes('Repository'))) { score += 10; signals.push('uses ViewModel / Repository pattern'); }
    if (hasFolder(ft, 'androidTest/'))                                     { score += 8;  signals.push('has androidTest/ folder');              }
    if (hasFile(ft, 'proguard-rules.pro'))                                 { score += 7;  signals.push('has ProGuard rules');                   }

    return { score: Math.min(score, 60), signals };
}

function rubricIos(ft: string[], readme: string): RubricResult {
    const signals: string[] = [];
    let score = 0;

    if (hasFile(ft, 'Info.plist'))                                  { score += 15; signals.push('has Info.plist');                  }
    if (hasExtension(ft, '.xcodeproj'))                             { score += 10; signals.push('has .xcodeproj file');             }
    if (hasFile(ft, 'Podfile') || hasFile(ft, 'Package.swift'))    { score += 10; signals.push('has Podfile / Package.swift');     }
    if (ft.some(f => f.endsWith('View.swift')))                    { score += 10; signals.push('has SwiftUI View files');          }
    if (ft.some(f => f.endsWith('Tests.swift')))                   { score += 8;  signals.push('has XCTest files');                }
    if (readme.length > 100)                                        { score += 7;  signals.push('README has setup instructions');   }

    return { score: Math.min(score, 60), signals };
}

function rubricDataScience(ft: string[], readme: string): RubricResult {
    const signals: string[] = [];
    let score = 0;

    if (hasExtension(ft, '.ipynb'))                                              { score += 15; signals.push('has Jupyter notebooks');                   }
    if (hasFile(ft, 'requirements.txt') || hasFile(ft, 'environment.yml'))       { score += 12; signals.push('has requirements.txt / environment.yml'); }
    if (hasFolder(ft, 'data/') || hasFolder(ft, 'datasets/'))                    { score += 10; signals.push('has data/ folder');                        }
    if (hasFolder(ft, 'models/') || hasFolder(ft, 'saved_models/'))              { score += 8;  signals.push('has models/ folder');                      }
    if (readme.length > 300)                                                     { score += 8;  signals.push('README explains problem / results');        }
    if (ft.some(f => f.startsWith('outputs/') && f.endsWith('.png')))           { score += 7;  signals.push('has output visualizations');               }

    return { score: Math.min(score, 60), signals };
}

function rubricChromeExtension(ft: string[], readme: string): RubricResult {
    const signals:    string[] = [];
    const readmeLower = readme.toLowerCase();
    let score = 0;

    if (hasFile(ft, 'manifest.json'))                                                                        { score += 20; signals.push('has manifest.json');              }
    if (readmeLower.includes('manifest v3') || readmeLower.includes('manifest version 3'))                   { score += 10; signals.push('uses Manifest V3');               }
    if (hasFile(ft, 'background.js') || hasFile(ft, 'service_worker.js'))                                   { score += 10; signals.push('has background / service worker'); }
    if (hasFolder(ft, 'content_scripts/') || hasFile(ft, 'content.js'))                                     { score += 10; signals.push('has content scripts');             }
    if (hasFolder(ft, 'icons/'))                                                                             { score += 5;  signals.push('has icons/ folder');               }
    if (hasFile(ft, 'popup.html'))                                                                           { score += 5;  signals.push('has popup.html');                  }

    return { score: Math.min(score, 60), signals };
}

function rubricFlutter(ft: string[]): RubricResult {
    const signals: string[] = [];
    let score = 0;

    if (hasFile(ft, 'pubspec.yaml'))                                { score += 15; signals.push('has pubspec.yaml');               }
    if (hasFolder(ft, 'lib/'))                                      { score += 12; signals.push('has lib/ folder');                }
    if (ft.includes('lib/main.dart'))                               { score += 12; signals.push('has lib/main.dart');              }
    if (hasFolder(ft, 'test/'))                                     { score += 10; signals.push('has test/ folder');               }
    if (hasFolder(ft, 'android/') && hasFolder(ft, 'ios/'))         { score += 11; signals.push('cross-platform (android + ios)'); }

    return { score: Math.min(score, 60), signals };
}

function rubricCliTool(ft: string[], pkg: any, readme: string): RubricResult {
    const signals:    string[] = [];
    const readmeLower = readme.toLowerCase();
    let score = 0;

    if (hasFolder(ft, 'bin/'))                                                                                { score += 20; signals.push('has bin/ folder');              }
    if (readmeLower.includes('--') || readmeLower.includes('usage') || readmeLower.includes('options'))       { score += 15; signals.push('README has usage examples');    }
    if (pkg?.bin)                                                                                             { score += 10; signals.push('package.json has "bin" field'); }
    if (hasAnyTestFile(ft))                                                                                   { score += 10; signals.push('has test files');               }
    if (pkg?.name && readmeLower.includes('npm'))                                                             { score += 5;  signals.push('published to npm');             }

    return { score: Math.min(score, 60), signals };
}

function rubricVscodeExtension(ft: string[], pkg: any): RubricResult {
    const signals: string[] = [];
    let score = 0;

    if (hasFile(ft, '.vscodeignore'))                                                    { score += 15; signals.push('has .vscodeignore');                  }
    if (pkg?.contributes)                                                                { score += 15; signals.push('package.json has "contributes" key'); }
    if (hasFile(ft, 'src/extension.ts') || hasFile(ft, 'src/extension.js'))             { score += 12; signals.push('has src/extension.ts / .js');         }
    if (hasAnyTestFile(ft))                                                              { score += 10; signals.push('has test files');                      }
    if (hasFile(ft, 'CHANGELOG.md'))                                                     { score += 8;  signals.push('has CHANGELOG.md');                    }

    return { score: Math.min(score, 60), signals };
}

function rubricDesktopApp(ft: string[], pkg: any): RubricResult {
    const signals: string[] = [];
    let score = 0;

    if (pkg?.dependencies?.electron)                                                   { score += 15; signals.push('uses Electron');               }
    if (ft.includes('main.js') || ft.includes('electron.js'))                          { score += 12; signals.push('has main.js / electron.js');   }
    if (hasFile(ft, 'preload.js'))                                                     { score += 10; signals.push('has preload.js');               }
    if (hasFolder(ft, 'src/'))                                                         { score += 10; signals.push('has src/ folder');              }
    if (hasAnyTestFile(ft))                                                            { score += 8;  signals.push('has test files');               }
    if (ft.some(f => f === 'electron-builder.yml' || f === 'electron-builder.json' || f === 'forge.config.js')) {
        score += 5; signals.push('has build config');
    }

    return { score: Math.min(score, 60), signals };
}

function rubricLibraryPackage(ft: string[], pkg: any): RubricResult {
    const signals: string[] = [];
    let score = 0;

    if (ft.includes('index.ts') || ft.includes('index.js'))            { score += 15; signals.push('has root index.ts / index.js');         }
    if (pkg?.main || pkg?.exports)                                      { score += 12; signals.push('package.json has "main" / "exports"'); }
    if (hasFolder(ft, 'types/') || hasExtension(ft, '.d.ts'))          { score += 10; signals.push('has type definitions');                }
    if (hasFile(ft, 'CHANGELOG.md'))                                    { score += 8;  signals.push('has CHANGELOG.md');                    }
    if (hasFolder(ft, 'examples/') || hasFolder(ft, 'example/'))        { score += 8;  signals.push('has examples/ folder');               }
    if (hasAnyTestFile(ft))                                             { score += 7;  signals.push('has test files');                      }

    return { score: Math.min(score, 60), signals };
}

function rubricOther(ft: string[], readme: string): RubricResult {
    const signals: string[] = [];
    let score = 0;

    if (readme.length > 0)  { score += 20; signals.push('has README'); }
    if (hasAnyTestFile(ft)) { score += 15; signals.push('has test files'); }

    if (hasFolder(ft, '.github/workflows/') || hasFile(ft, '.travis.yml') || hasFolder(ft, '.circleci/')) {
        score += 15; signals.push('has CI/CD');
    }

    const topFolders = new Set(ft.filter(f => f.includes('/')).map(f => f.split('/')[0]));
    if (topFolders.size > 5) {
        score += 10; signals.push(`well-structured (${topFolders.size} top-level folders)`);
    }

    return { score: Math.min(score, 60), signals };
}

// ── Type dispatch ──

function scoreByType(
    type:   RepoType,
    ft:     string[],
    pkg:    any,
    readme: string,
): RubricResult {
    switch (type) {
        case 'web_app':          return rubricWebApp(ft, pkg, readme);
        case 'backend_api':      return rubricBackendApi(ft, pkg, readme);
        case 'android':          return rubricAndroid(ft);
        case 'ios':              return rubricIos(ft, readme);
        case 'data_science':     return rubricDataScience(ft, readme);
        case 'chrome_extension': return rubricChromeExtension(ft, readme);
        case 'flutter':          return rubricFlutter(ft);
        case 'cli_tool':         return rubricCliTool(ft, pkg, readme);
        case 'vscode_extension': return rubricVscodeExtension(ft, pkg);
        case 'desktop_app':      return rubricDesktopApp(ft, pkg);
        case 'library_package':  return rubricLibraryPackage(ft, pkg);
        case 'other':
        default:                 return rubricOther(ft, readme);
    }
}

/**
 * Fetches the file tree and key files for a single GitHub repo, then
 * scores its structural quality based on code quality signals.
 *
 * GitHub API endpoints called:
 *   GET /repos/{owner}/{repo}/git/trees/{branch}?recursive=1   — full file tree
 *   GET /repos/{owner}/{repo}/contents/{path}                  — README, package.json, .eslintrc
 *
 * @param repo        Raw GitHub API repo object (from the /user/repos list response)
 * @param detection   Repo type classification returned by detectRepoType()
 * @param githubToken OAuth token from talentProfile.githubAccessToken
 *
 * @returns Score 0-100 with a shared/type breakdown, the raw fileTree and readmeContent
 *          for downstream use in the AI scorer (Step 7), and the parsed packageJson.
 *          The function never throws — all failures degrade gracefully to score 0.
 */
export async function scoreStructure(
    repo:        any,
    detection:   DetectionResult,
    githubToken: string,
): Promise<StructureScoreResult> {

    const zeroResult = (penalties: string[]): StructureScoreResult => ({
        score:         0,
        breakdown:     { sharedScore: 0, typeScore: 0 },
        fileTree:      [],
        signals:       [],
        penalties,
        readmeContent: '',
        packageJson:   null,
    });

    try {
        const owner  = String(repo.owner?.login  ?? '');
        const name   = String(repo.name          ?? '');
        const branch = String(repo.default_branch ?? 'main');

        // ── Step 1: Fetch file tree ──
        const treeRes = await fetch(
            `${GITHUB_API}/repos/${owner}/${name}/git/trees/${branch}?recursive=1`,
            { headers: ghHeaders(githubToken) },
        );

        if (!treeRes.ok) return zeroResult(['File tree unavailable']);

        const treeData = await treeRes.json();
        const fileTree: string[] = (treeData.tree ?? [])
            .filter((item: any) => item.type === 'blob')
            .map   ((item: any) => item.path as string);

        const treeSignals: string[] = [];
        if (treeData.truncated) treeSignals.push('Large repo — tree truncated');

        // ── Step 2: Fetch key files in parallel ──
        const fetchContent = async (path: string): Promise<string | null> => {
            try {
                const res = await fetch(
                    `${GITHUB_API}/repos/${owner}/${name}/contents/${path}`,
                    { headers: ghHeaders(githubToken) },
                );
                if (!res.ok) return null;
                const data = await res.json();
                return Buffer.from(
                    (data.content as string).replace(/\n/g, ''),
                    'base64',
                ).toString('utf-8');
            } catch {
                return null;
            }
        };

        const readmePath = ['README.md', 'readme.md', 'README'].find(p => fileTree.includes(p));
        const eslintPath = ['.eslintrc', '.eslintrc.js', '.eslintrc.json', '.eslintrc.yml']
            .find(p => fileTree.includes(p));

        const [readmeResult, pkgResult, eslintResult] = await Promise.allSettled([
            readmePath                        ? fetchContent(readmePath)      : Promise.resolve<string | null>(null),
            fileTree.includes('package.json') ? fetchContent('package.json') : Promise.resolve<string | null>(null),
            eslintPath                        ? fetchContent(eslintPath)      : Promise.resolve<string | null>(null),
        ]);

        const readmeContent = readmeResult.status === 'fulfilled' ? (readmeResult.value ?? '') : '';

        let packageJson: any = null;
        if (pkgResult.status === 'fulfilled' && pkgResult.value) {
            try { packageJson = JSON.parse(pkgResult.value); } catch { /* invalid JSON — leave null */ }
        }

        const hasEslint = eslintPath !== undefined
            && eslintResult.status === 'fulfilled'
            && eslintResult.value !== null;

        // ── Step 3: Shared scoring (max 40) ──
        const shared = scoreShared(fileTree, readmeContent, hasEslint);

        // ── Step 4: Type-specific scoring (max 60) ──
        const typed  = scoreByType(detection.type, fileTree, packageJson, readmeContent);

        // ── Step 5: Combine ──
        return {
            score:     Math.min(shared.score + typed.score, 100),
            breakdown: { sharedScore: shared.score, typeScore: typed.score },
            fileTree,
            signals:       [...treeSignals, ...shared.signals,  ...typed.signals],
            penalties:     [...shared.penalties],
            readmeContent,
            packageJson,
        };

    } catch (err: any) {
        return zeroResult([`Scoring failed: ${err?.message ?? 'Unknown error'}`]);
    }
}
