"use client";

import React, { useState, useCallback } from "react";

/* ═══════════════════════════════════════════════
   S K I L L S P I L L  —  G I T H U B  S Y N C
   Connect, sync, and showcase your GitHub activity
   ═══════════════════════════════════════════════ */

const accent = "#3CF91A";

/* -- Mock Data -- */
const mockRepos = [
    { id: 1, name: "CRDTSync-Engine", description: "Real-time collaborative editing engine with conflict resolution", language: "TypeScript", langColor: "#3178C6", stars: 342, forks: 67, updated: "2 hours ago", synced: true, isPrivate: false },
    { id: 2, name: "RustSearch", description: "High-performance search library with zero-cost abstractions", language: "Rust", langColor: "#DEA584", stars: 189, forks: 28, updated: "1 day ago", synced: true, isPrivate: false },
    { id: 3, name: "ReactFlow-Pro", description: "Advanced node-based editor for visual programming", language: "TypeScript", langColor: "#3178C6", stars: 256, forks: 45, updated: "3 days ago", synced: true, isPrivate: false },
    { id: 4, name: "neural-net-playground", description: "Interactive neural network visualization and experimentation", language: "Python", langColor: "#3572A5", stars: 128, forks: 22, updated: "5 days ago", synced: false, isPrivate: false },
    { id: 5, name: "cloud-infra-templates", description: "Terraform modules for production-grade cloud infrastructure", language: "HCL", langColor: "#844FBA", stars: 94, forks: 31, updated: "1 week ago", synced: false, isPrivate: true },
    { id: 6, name: "go-microservice-kit", description: "Production-ready microservice boilerplate with observability", language: "Go", langColor: "#00ADD8", stars: 176, forks: 38, updated: "2 weeks ago", synced: true, isPrivate: false },
    { id: 7, name: "dotfiles", description: "My personal development environment configuration", language: "Shell", langColor: "#89e051", stars: 12, forks: 3, updated: "3 weeks ago", synced: false, isPrivate: false },
    { id: 8, name: "leetcode-solutions", description: "Solutions to 400+ LeetCode problems with explanations", language: "Python", langColor: "#3572A5", stars: 67, forks: 14, updated: "1 month ago", synced: false, isPrivate: false },
];

const mockActivity = [
    { id: 1, type: "push", repo: "CRDTSync-Engine", branch: "main", message: "fix: resolve merge conflict in vector clock sync", time: "2h ago", commits: 3 },
    { id: 2, type: "pr_merged", repo: "RustSearch", branch: "feat/parallel-indexing", message: "feat: add parallel indexing support", time: "5h ago", commits: 8 },
    { id: 3, type: "pr_opened", repo: "ReactFlow-Pro", branch: "fix/edge-rendering", message: "fix: correct edge path calculation for curved edges", time: "1d ago", commits: 2 },
    { id: 4, type: "push", repo: "go-microservice-kit", branch: "main", message: "chore: upgrade dependencies to latest", time: "2d ago", commits: 1 },
    { id: 5, type: "issue_closed", repo: "CRDTSync-Engine", branch: "", message: "Memory leak in long-running sessions #142", time: "3d ago", commits: 0 },
    { id: 6, type: "release", repo: "RustSearch", branch: "v2.1.0", message: "Release v2.1.0 — parallel indexing & bug fixes", time: "4d ago", commits: 0 },
];

const mockLanguageStats = [
    { name: "TypeScript", pct: 38, color: "#3178C6" },
    { name: "Rust", pct: 22, color: "#DEA584" },
    { name: "Python", pct: 18, color: "#3572A5" },
    { name: "Go", pct: 12, color: "#00ADD8" },
    { name: "Other", pct: 10, color: "#737373" },
];

const mockContributions = {
    totalThisYear: 2847,
    currentStreak: 34,
    longestStreak: 72,
    thisWeek: 47,
    lastWeek: 39,
};

/* ═══════════════════════════════════════════════ */

function GitHubSVG() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
        </svg>
    );
}

function SyncIcon({ spinning }: { spinning?: boolean }) {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={spinning ? { animation: "spin 1s linear infinite" } : {}}>
            <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
        </svg>
    );
}

function ActivityIcon({ type }: { type: string }) {
    switch (type) {
        case "push":
            return <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${accent}15`, color: accent }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 3 21 3 21 8" /><line x1="4" y1="20" x2="21" y2="3" /></svg>
            </div>;
        case "pr_merged":
            return <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(168,85,247,0.12)", color: "#A855F7" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="18" r="3" /><circle cx="6" cy="6" r="3" /><path d="M6 21V9a9 9 0 0 0 9 9" /></svg>
            </div>;
        case "pr_opened":
            return <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(34,197,94,0.12)", color: "#22C55E" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="18" r="3" /><circle cx="6" cy="6" r="3" /><path d="M13 6h3a2 2 0 0 1 2 2v7" /><line x1="6" y1="9" x2="6" y2="21" /></svg>
            </div>;
        case "issue_closed":
            return <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(239,68,68,0.12)", color: "#EF4444" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
            </div>;
        case "release":
            return <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(59,130,246,0.12)", color: "#3B82F6" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
            </div>;
        default:
            return <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--theme-input-bg)", color: "var(--theme-text-muted)" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /></svg>
            </div>;
    }
}

function activityLabel(type: string) {
    switch (type) {
        case "push": return "Pushed to";
        case "pr_merged": return "PR Merged in";
        case "pr_opened": return "PR Opened in";
        case "issue_closed": return "Issue Closed in";
        case "release": return "Released in";
        default: return "Activity in";
    }
}

export default function GitHubSyncPage() {
    const [isSyncing, setIsSyncing] = useState(false);
    const [lastSynced, setLastSynced] = useState("2 minutes ago");
    const [repos, setRepos] = useState(mockRepos);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<"all" | "synced" | "unsynced">("all");
    const [showContribMap, setShowContribMap] = useState(true);
    const [syncSettings, setSyncSettings] = useState({ autoSync: true, privateRepos: false, showContribs: true });

    // Generate stable contribution data once
    const [contribData] = useState(() =>
        Array.from({ length: 52 * 7 }).map(() => Math.random())
    );

    const handleSync = useCallback(() => {
        setIsSyncing(true);
        setTimeout(() => {
            setIsSyncing(false);
            setLastSynced("just now");
        }, 2500);
    }, []);

    const toggleRepoSync = (repoId: number) => {
        setRepos(prev => prev.map(r => r.id === repoId ? { ...r, synced: !r.synced } : r));
    };

    const filteredRepos = repos.filter(r => {
        const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase());
        if (filter === "synced") return matchSearch && r.synced;
        if (filter === "unsynced") return matchSearch && !r.synced;
        return matchSearch;
    });

    const syncedCount = repos.filter(r => r.synced).length;

    return (
        <div className="min-h-full" style={{ background: "var(--theme-bg)" }}>
            <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-5">

                {/* ═══ Header ═══ */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--theme-input-bg)", color: "var(--theme-text-primary)" }}>
                                <GitHubSVG />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight" style={{ color: "var(--theme-text-primary)", fontFamily: "var(--font-space-grotesk)" }}>
                                    GitHub Sync
                                </h1>
                                <p className="text-[12px]" style={{ color: "var(--theme-text-muted)" }}>
                                    Connected as <span className="font-semibold" style={{ color: accent }}>ghost-protocol</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-[11px]" style={{ color: "var(--theme-text-muted)", fontFamily: "var(--font-jetbrains-mono)" }}>
                            Last synced: {lastSynced}
                        </span>
                        <button
                            onClick={handleSync}
                            disabled={isSyncing}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[12px] font-bold border-none cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                            style={{
                                background: isSyncing ? "var(--theme-input-bg)" : accent,
                                color: isSyncing ? "var(--theme-text-muted)" : "#000",
                                boxShadow: isSyncing ? "none" : `0 4px 20px ${accent}40`,
                                opacity: isSyncing ? 0.7 : 1,
                            }}
                        >
                            <SyncIcon spinning={isSyncing} />
                            {isSyncing ? "Syncing..." : "Sync Now"}
                        </button>
                    </div>
                </div>

                {/* ═══ Stats Cards ═══ */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                    {[
                        { label: "Contributions", value: mockContributions.totalThisYear.toLocaleString(), icon: "🔥", sub: "this year" },
                        { label: "Current Streak", value: `${mockContributions.currentStreak}d`, icon: "⚡", sub: "days active" },
                        { label: "Longest Streak", value: `${mockContributions.longestStreak}d`, icon: "🏆", sub: "personal best" },
                        { label: "This Week", value: mockContributions.thisWeek.toString(), icon: "📊", sub: `+${Math.round(((mockContributions.thisWeek - mockContributions.lastWeek) / mockContributions.lastWeek) * 100)}% vs last week` },
                    ].map(stat => (
                        <div key={stat.label} className="rounded-2xl border p-4" style={{ background: "var(--theme-card)", borderColor: "var(--theme-border)" }}>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-lg">{stat.icon}</span>
                                <span className="text-[9px] uppercase tracking-widest font-semibold" style={{ color: "var(--theme-text-muted)" }}>{stat.label}</span>
                            </div>
                            <p className="text-xl sm:text-2xl font-bold" style={{ color: "var(--theme-text-primary)", fontFamily: "var(--font-jetbrains-mono)" }}>{stat.value}</p>
                            <p className="text-[10px] mt-0.5" style={{ color: "var(--theme-text-muted)" }}>{stat.sub}</p>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* ═══ Left Column — Repos + Activity ═══ */}
                    <div className="flex-1 min-w-0 space-y-6">

                        {/* Contribution Heatmap */}
                        <div className="rounded-2xl border p-4 sm:p-5" style={{ background: "var(--theme-card)", borderColor: "var(--theme-border)" }}>
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="text-[13px] font-bold" style={{ color: "var(--theme-text-primary)" }}>
                                    Contribution Activity
                                </h2>
                                <button onClick={() => setShowContribMap(!showContribMap)} className="text-[10px] font-medium bg-transparent border-none cursor-pointer" style={{ color: "var(--theme-text-muted)" }}>
                                    {showContribMap ? "Hide" : "Show"}
                                </button>
                            </div>
                            {showContribMap && (
                                <div className="overflow-x-auto">
                                    <div className="flex gap-[3px] flex-wrap min-w-[600px]">
                                        {contribData.map((intensity, i) => {
                                            let bg = "var(--theme-input-bg)";
                                            if (intensity > 0.8) bg = "#16A34A";
                                            else if (intensity > 0.6) bg = "#22C55E";
                                            else if (intensity > 0.4) bg = "#2D9B4E";
                                            else if (intensity > 0.2) bg = "#1A6B35";
                                            return <div key={i} className="w-[10px] h-[10px] rounded-[2px]" style={{ backgroundColor: bg }} />;
                                        })}
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-[9px]" style={{ color: "var(--theme-text-muted)" }}>Less</span>
                                        <div className="flex gap-[3px] items-center">
                                            {["var(--theme-input-bg)", "#1A6B35", "#2D9B4E", "#22C55E", "#16A34A"].map((c, i) => (
                                                <div key={i} className="w-[10px] h-[10px] rounded-[2px]" style={{ backgroundColor: c }} />
                                            ))}
                                        </div>
                                        <span className="text-[9px]" style={{ color: "var(--theme-text-muted)" }}>More</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Repositories */}
                        <div className="rounded-2xl border" style={{ background: "var(--theme-card)", borderColor: "var(--theme-border)" }}>
                            <div className="p-4 sm:p-5 space-y-3" style={{ borderBottom: "1px solid var(--theme-border)" }}>
                                <div className="flex items-center justify-between">
                                    <h2 className="text-[13px] font-bold" style={{ color: "var(--theme-text-primary)" }}>
                                        Repositories <span className="font-normal" style={{ color: "var(--theme-text-muted)" }}>({syncedCount}/{repos.length} synced)</span>
                                    </h2>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <div className="flex-1 flex items-center gap-2 rounded-xl px-3 py-2" style={{ background: "var(--theme-input-bg)", border: "1px solid var(--theme-border)" }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--theme-text-muted)" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                                        <input
                                            type="text"
                                            value={search}
                                            onChange={e => setSearch(e.target.value)}
                                            placeholder="Search repositories..."
                                            className="flex-1 bg-transparent border-none outline-none text-[12px]"
                                            style={{ color: "var(--theme-text-primary)" }}
                                        />
                                    </div>
                                    <div className="flex gap-1">
                                        {(["all", "synced", "unsynced"] as const).map(f => (
                                            <button
                                                key={f}
                                                onClick={() => setFilter(f)}
                                                className="px-3 py-2 rounded-xl text-[11px] font-medium border-none cursor-pointer transition-all capitalize"
                                                style={filter === f
                                                    ? { background: accent, color: "#000", boxShadow: `0 2px 10px ${accent}30` }
                                                    : { background: "var(--theme-input-bg)", color: "var(--theme-text-muted)", border: "1px solid var(--theme-border)" }
                                                }
                                            >
                                                {f}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="divide-y" style={{ borderColor: "var(--theme-border-light)" }}>
                                {filteredRepos.map(repo => (
                                    <div key={repo.id} className="flex items-start gap-3 p-4 sm:px-5 transition-colors" style={{ borderBottom: "1px solid var(--theme-border-light)" }}>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="text-[13px] font-bold truncate" style={{ color: accent }}>
                                                    {repo.name}
                                                </h3>
                                                {repo.isPrivate && (
                                                    <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium" style={{ background: "var(--theme-input-bg)", color: "var(--theme-text-muted)", border: "1px solid var(--theme-border)" }}>
                                                        Private
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-[11px] mb-2 leading-relaxed" style={{ color: "var(--theme-text-muted)" }}>{repo.description}</p>
                                            <div className="flex items-center gap-4 text-[10px]" style={{ color: "var(--theme-text-muted)" }}>
                                                <span className="flex items-center gap-1.5">
                                                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: repo.langColor }} />
                                                    {repo.language}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                                                    {repo.stars}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="6" y1="3" x2="6" y2="15" /><circle cx="18" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M18 9a9 9 0 0 1-9 9" /></svg>
                                                    {repo.forks}
                                                </span>
                                                <span>Updated {repo.updated}</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => toggleRepoSync(repo.id)}
                                            className="shrink-0 px-3 py-1.5 rounded-lg text-[10px] font-bold border-none cursor-pointer transition-all"
                                            style={repo.synced
                                                ? { background: `${accent}15`, color: accent, border: `1px solid ${accent}30` }
                                                : { background: "var(--theme-input-bg)", color: "var(--theme-text-muted)", border: "1px solid var(--theme-border)" }
                                            }
                                        >
                                            {repo.synced ? "✓ Synced" : "Sync"}
                                        </button>
                                    </div>
                                ))}
                                {filteredRepos.length === 0 && (
                                    <div className="text-center py-12">
                                        <p className="text-[13px]" style={{ color: "var(--theme-text-muted)" }}>No repositories found</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ═══ Right Sidebar ═══ */}
                    <div className="w-full lg:w-[320px] shrink-0 space-y-5">

                        {/* Connection Status */}
                        <div className="rounded-2xl border p-4 sm:p-5" style={{ background: "var(--theme-card)", borderColor: "var(--theme-border)" }}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "var(--theme-input-bg)", color: "var(--theme-text-primary)" }}>
                                    <GitHubSVG />
                                </div>
                                <div>
                                    <p className="text-[13px] font-bold" style={{ color: "var(--theme-text-primary)" }}>ghost-protocol</p>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                                        <span className="text-[10px] font-medium" style={{ color: "#22C55E" }}>Connected</span>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { label: "Repos", value: "47" },
                                    { label: "Stars", value: "1.3k" },
                                    { label: "Followers", value: "284" },
                                ].map(stat => (
                                    <div key={stat.label} className="text-center rounded-xl p-2" style={{ background: "var(--theme-bg-secondary)" }}>
                                        <p className="text-[14px] font-bold" style={{ color: "var(--theme-text-primary)", fontFamily: "var(--font-jetbrains-mono)" }}>{stat.value}</p>
                                        <p className="text-[9px] uppercase tracking-widest" style={{ color: "var(--theme-text-muted)" }}>{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-3 p-3 rounded-xl" style={{ background: `${accent}08`, border: `1px solid ${accent}20` }}>
                                <p className="text-[10px] font-medium" style={{ color: accent, fontFamily: "var(--font-jetbrains-mono)" }}>
                                    ⚡ Sync imports your repos, contributions, and coding stats to power your SkillSpill profile and skill tree progression.
                                </p>
                            </div>
                        </div>

                        {/* Language Breakdown */}
                        <div className="rounded-2xl border p-4 sm:p-5" style={{ background: "var(--theme-card)", borderColor: "var(--theme-border)" }}>
                            <h2 className="text-[13px] font-bold mb-3" style={{ color: "var(--theme-text-primary)" }}>Language Breakdown</h2>
                            {/* Bar chart */}
                            <div className="h-3 rounded-full overflow-hidden flex mb-3" style={{ background: "var(--theme-input-bg)" }}>
                                {mockLanguageStats.map(lang => (
                                    <div key={lang.name} className="h-full transition-all duration-700" style={{ width: `${lang.pct}%`, background: lang.color }} />
                                ))}
                            </div>
                            <div className="space-y-2">
                                {mockLanguageStats.map(lang => (
                                    <div key={lang.name} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2.5 h-2.5 rounded-full" style={{ background: lang.color }} />
                                            <span className="text-[11px] font-medium" style={{ color: "var(--theme-text-secondary)" }}>{lang.name}</span>
                                        </div>
                                        <span className="text-[11px] font-bold" style={{ color: "var(--theme-text-primary)", fontFamily: "var(--font-jetbrains-mono)" }}>{lang.pct}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="rounded-2xl border p-4 sm:p-5" style={{ background: "var(--theme-card)", borderColor: "var(--theme-border)" }}>
                            <h2 className="text-[13px] font-bold mb-3" style={{ color: "var(--theme-text-primary)" }}>Recent Activity</h2>
                            <div className="space-y-3">
                                {mockActivity.map(activity => (
                                    <div key={activity.id} className="flex items-start gap-2.5">
                                        <ActivityIcon type={activity.type} />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[11px] leading-snug" style={{ color: "var(--theme-text-secondary)" }}>
                                                <span className="font-medium" style={{ color: "var(--theme-text-muted)" }}>{activityLabel(activity.type)}</span>{" "}
                                                <span className="font-bold" style={{ color: accent }}>{activity.repo}</span>
                                            </p>
                                            <p className="text-[11px] truncate mt-0.5" style={{ color: "var(--theme-text-muted)", fontFamily: "var(--font-jetbrains-mono)" }}>
                                                {activity.message}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[9px]" style={{ color: "var(--theme-text-muted)" }}>{activity.time}</span>
                                                {activity.commits > 0 && (
                                                    <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: "var(--theme-input-bg)", color: "var(--theme-text-muted)" }}>
                                                        {activity.commits} commit{activity.commits > 1 ? "s" : ""}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Sync Settings */}
                        <div className="rounded-2xl border p-4 sm:p-5" style={{ background: "var(--theme-card)", borderColor: "var(--theme-border)" }}>
                            <h2 className="text-[13px] font-bold mb-3" style={{ color: "var(--theme-text-primary)" }}>Sync Settings</h2>
                            <div className="space-y-3">
                                {[
                                    { key: "autoSync" as const, label: "Auto-sync", desc: "Sync every 6 hours automatically" },
                                    { key: "privateRepos" as const, label: "Include private repos", desc: "Sync private repo stats (names hidden)" },
                                    { key: "showContribs" as const, label: "Show contributions", desc: "Display contribution graph on profile" },
                                ].map(setting => {
                                    const enabled = syncSettings[setting.key];
                                    return (
                                        <div key={setting.key} className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid var(--theme-border-light)" }}>
                                            <div>
                                                <p className="text-[12px] font-semibold" style={{ color: "var(--theme-text-primary)" }}>{setting.label}</p>
                                                <p className="text-[10px]" style={{ color: "var(--theme-text-muted)" }}>{setting.desc}</p>
                                            </div>
                                            <button
                                                onClick={() => setSyncSettings(prev => ({ ...prev, [setting.key]: !prev[setting.key] }))}
                                                className="relative w-10 h-5 rounded-full transition-all duration-300 cursor-pointer border-none shrink-0"
                                                style={{
                                                    background: enabled ? accent : "var(--theme-input-bg)",
                                                    boxShadow: enabled ? `0 0 8px ${accent}40` : "none",
                                                    border: enabled ? "none" : "1px solid var(--theme-border)",
                                                }}
                                            >
                                                <span
                                                    className="absolute top-[2px] w-[16px] h-[16px] rounded-full bg-white transition-all duration-300"
                                                    style={{
                                                        left: enabled ? "22px" : "2px",
                                                        boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                                                    }}
                                                />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══ Keyframes ═══ */}
            <style jsx>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
