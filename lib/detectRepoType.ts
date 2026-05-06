export type RepoType =
    | 'android'
    | 'ios'
    | 'chrome_extension'
    | 'vscode_extension'
    | 'data_science'
    | 'cli_tool'
    | 'desktop_app'
    | 'flutter'
    | 'backend_api'
    | 'web_app'
    | 'library_package'
    | 'other';

export interface DetectionResult {
    type:       RepoType;
    confidence: 'high' | 'medium' | 'low';
    signals:    string[];
}

export function detectRepoType(repo: any, fileTree: string[]): DetectionResult {
    const language    = (repo.language    ?? '').toLowerCase();
    const topics      = (repo.topics      ?? []).map((t: string) => t.toLowerCase());
    const description = (repo.description ?? '').toLowerCase();

    const hasFile      = (name: string)   => fileTree.some(f => f === name || f.endsWith('/' + name));
    const hasFolder    = (prefix: string) => fileTree.some(f => f.startsWith(prefix));
    const hasExtension = (ext: string)    => fileTree.some(f => f.endsWith(ext));
    const hasTopic     = (t: string)      => topics.includes(t);

    // Derives high/medium from signal count — low is only returned by the OTHER fallback
    const conf = (s: string[]): 'high' | 'medium' => s.length >= 2 ? 'high' : 'medium';

    // ── 1. Android ──
    {
        const signals: string[] = [];
        if (language === 'kotlin' || language === 'java') signals.push(`language: ${language}`);
        if (hasFile('AndroidManifest.xml'))               signals.push('has AndroidManifest.xml');
        if (hasFile('build.gradle'))                      signals.push('has build.gradle');
        if (signals.length > 0) return { type: 'android', confidence: conf(signals), signals };
    }

    // ── 2. iOS ──
    {
        const signals: string[] = [];
        if (language === 'swift' || language === 'objective-c') signals.push(`language: ${language}`);
        if (hasFile('Info.plist'))                               signals.push('has Info.plist');
        if (hasExtension('.xcodeproj'))                          signals.push('has .xcodeproj');
        if (signals.length > 0) return { type: 'ios', confidence: conf(signals), signals };
    }

    // ── 3. Chrome Extension ──
    // manifest.json guard prevents misclassifying Vite/Next.js apps that also ship a web manifest
    {
        const signals: string[] = [];
        const notWebBundler = !hasFile('vite.config.ts') && !hasFile('next.config.js');
        if (hasFile('manifest.json') && notWebBundler) signals.push('has manifest.json');
        if (hasTopic('chrome-extension'))               signals.push('topic: chrome-extension');
        if (signals.length > 0) return { type: 'chrome_extension', confidence: conf(signals), signals };
    }

    // ── 4. VSCode Extension ──
    {
        const signals: string[] = [];
        if (hasFile('.vscodeignore'))                  signals.push('has .vscodeignore');
        if (hasTopic('vscode-extension'))              signals.push('topic: vscode-extension');
        if (description.includes('vscode extension')) signals.push('description: vscode extension');
        if (signals.length > 0) return { type: 'vscode_extension', confidence: conf(signals), signals };
    }

    // ── 5. Data Science ──
    // Requires language signal + at least one secondary signal to avoid catching plain Python web backends
    {
        if (language === 'python' || language === 'jupyter notebook') {
            const signals: string[] = [`language: ${language}`];
            if (hasExtension('.ipynb'))       signals.push('has .ipynb notebooks');
            if (hasFile('requirements.txt')) signals.push('has requirements.txt');
            if (hasTopic('machine-learning')) signals.push('topic: machine-learning');
            if (hasTopic('data-science'))     signals.push('topic: data-science');
            if (hasTopic('deep-learning'))    signals.push('topic: deep-learning');
            if (signals.length >= 2) return { type: 'data_science', confidence: conf(signals), signals };
        }
    }

    // ── 6. Flutter ──
    {
        const signals: string[] = [];
        if (language === 'dart')     signals.push('language: dart');
        if (hasFile('pubspec.yaml')) signals.push('has pubspec.yaml');
        if (signals.length > 0) return { type: 'flutter', confidence: conf(signals), signals };
    }

    // ── 7. CLI Tool ──
    {
        const signals: string[] = [];
        if (hasFolder('bin/'))          signals.push('has bin/ folder');
        if (hasTopic('cli'))            signals.push('topic: cli');
        if (hasTopic('command-line'))   signals.push('topic: command-line');
        if (hasTopic('commandline'))    signals.push('topic: commandline');
        if (signals.length > 0) return { type: 'cli_tool', confidence: conf(signals), signals };
    }

    // ── 8. Desktop App ──
    {
        const signals: string[] = [];
        if (hasTopic('electron'))        signals.push('topic: electron');
        if (hasTopic('tauri'))           signals.push('topic: tauri');
        if (hasFile('electron.js'))      signals.push('has electron.js');
        if (hasFile('tauri.conf.json'))  signals.push('has tauri.conf.json');
        if (signals.length > 0) return { type: 'desktop_app', confidence: conf(signals), signals };
    }

    // ── 9. Library / Package ──
    {
        const signals: string[] = [];
        if (hasTopic('npm-package'))             signals.push('topic: npm-package');
        if (hasTopic('library'))                 signals.push('topic: library');
        if (hasTopic('sdk'))                     signals.push('topic: sdk');
        if (description.includes('library'))     signals.push('description: library');
        if (description.includes('npm package')) signals.push('description: npm package');
        if (signals.length > 0) return { type: 'library_package', confidence: conf(signals), signals };
    }

    // ── 10. Backend API ──
    // Root-level index.html is a strong indicator of a web app — skip backend classification if present
    {
        const signals: string[] = [];
        const BACKEND_LANGS = ['go', 'rust', 'php', 'ruby', 'java', 'python'];
        if (BACKEND_LANGS.includes(language)) signals.push(`language: ${language}`);
        if (hasFile('Dockerfile'))            signals.push('has Dockerfile');
        if (hasFile('docker-compose.yml'))    signals.push('has docker-compose.yml');
        if (hasTopic('api'))                  signals.push('topic: api');
        if (hasTopic('rest'))                 signals.push('topic: rest');
        if (hasTopic('graphql'))              signals.push('topic: graphql');
        const hasRootHtml = fileTree.includes('index.html');
        if (signals.length > 0 && !hasRootHtml) return { type: 'backend_api', confidence: conf(signals), signals };
    }

    // ── 11. Web App ──
    {
        const signals: string[] = [];
        if (language === 'typescript' || language === 'javascript') signals.push(`language: ${language}`);
        if (hasFile('package.json')) signals.push('has package.json');
        if (hasFile('index.html'))   signals.push('has index.html');
        if (signals.length > 0) return { type: 'web_app', confidence: conf(signals), signals };
    }

    // ── 12. Other (fallback) ──
    return { type: 'other', confidence: 'low', signals: ['no specific signals matched'] };
}

/*
──────────────────────────────────────────────────────────────────────────────
MANUAL TEST — run with: node _test-detect.js  (see comment block in filterRepos for pattern)

// ── Case 1: Android, high ──
detectRepoType(
    { language: 'Kotlin', topics: [], description: '' },
    ['app/src/main/AndroidManifest.xml', 'build.gradle', 'app/src/main/java/Main.kt']
)
// → { type: 'android', confidence: 'high', signals: ['language: kotlin', 'has AndroidManifest.xml', 'has build.gradle'] }

// ── Case 2: Chrome Extension, medium (single signal) ──
detectRepoType(
    { language: 'JavaScript', topics: [], description: '' },
    ['manifest.json', 'background.js', 'popup.html']
)
// → { type: 'chrome_extension', confidence: 'medium', signals: ['has manifest.json'] }

// ── Case 3: Data Science, high ──
detectRepoType(
    { language: 'Python', topics: [], description: '' },
    ['analysis.ipynb', 'data/dataset.csv', 'requirements.txt']
)
// → { type: 'data_science', confidence: 'high', signals: ['language: python', 'has .ipynb notebooks', 'has requirements.txt'] }

// ── Case 4: Web App, high ──
detectRepoType(
    { language: 'TypeScript', topics: [], description: '' },
    ['src/index.ts', 'package.json', 'tsconfig.json', 'src/components/App.tsx']
)
// → { type: 'web_app', confidence: 'high', signals: ['language: typescript', 'has package.json'] }

// ── Case 5: Backend API, high ──
detectRepoType(
    { language: 'Go', topics: [], description: '' },
    ['main.go', 'Dockerfile', 'docker-compose.yml', 'go.mod']
)
// → { type: 'backend_api', confidence: 'high', signals: ['language: go', 'has Dockerfile', 'has docker-compose.yml'] }

// ── Case 6: Other, low ──
detectRepoType(
    { language: null, topics: [], description: '' },
    []
)
// → { type: 'other', confidence: 'low', signals: ['no specific signals matched'] }
──────────────────────────────────────────────────────────────────────────────
*/
