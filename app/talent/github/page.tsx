"use client";

import React, { useState, useCallback, useEffect } from "react";

/* ═══════════════════════════════════════════════
   S K I L L S P I L L  —  G I T H U B  S Y N C
   Connect, sync, and showcase your GitHub activity
   ═══════════════════════════════════════════════ */

const accent = "#3CF91A";

/* Language color map */
const langColors: Record<string, string> = {
    TypeScript: "#3178C6", JavaScript: "#F1E05A", Python: "#3572A5", Rust: "#DEA584",
    Go: "#00ADD8", Java: "#B07219", "C++": "#f34b7d", C: "#555555", "C#": "#178600",
    Ruby: "#701516", PHP: "#4F5D95", Shell: "#89e051", HTML: "#e34c26", CSS: "#563d7c",
    Swift: "#F05138", Kotlin: "#A97BFF", Dart: "#00B4AB", HCL: "#844FBA", Lua: "#000080",
    Scala: "#c22d40", Elixir: "#6e4a7e", Vue: "#41b883", SCSS: "#c6538c",
};

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
        case "PushEvent":
            return <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${accent}15`, color: accent }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 3 21 3 21 8" /><line x1="4" y1="20" x2="21" y2="3" /></svg>
            </div>;
        case "PullRequestEvent":
            return <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(168,85,247,0.12)", color: "#A855F7" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="18" r="3" /><circle cx="6" cy="6" r="3" /><path d="M6 21V9a9 9 0 0 0 9 9" /></svg>
            </div>;
        case "IssuesEvent":
        case "IssueCommentEvent":
            return <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(239,68,68,0.12)", color: "#EF4444" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
            </div>;
        case "CreateEvent":
            return <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(34,197,94,0.12)", color: "#22C55E" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            </div>;
        case "ForkEvent":
            return <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(59,130,246,0.12)", color: "#3B82F6" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="6" y1="3" x2="6" y2="15" /><circle cx="18" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M18 9a9 9 0 0 1-9 9" /></svg>
            </div>;
        case "WatchEvent":
            return <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(234,179,8,0.12)", color: "#EAB308" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
            </div>;
        default:
            return <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--theme-input-bg)", color: "var(--theme-text-muted)" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /></svg>
            </div>;
    }
}

function activityLabel(type: string) {
    const map: Record<string, string> = {
        PushEvent: "Pushed to",
        PullRequestEvent: "PR on",
        CreateEvent: "Created",
        IssuesEvent: "Issue on",
        IssueCommentEvent: "Commented on",
        ForkEvent: "Forked",
        WatchEvent: "Starred",
        DeleteEvent: "Deleted in",
        PullRequestReviewEvent: "Reviewed PR on",
        ReleaseEvent: "Released in",
    };
    return map[type] || type.replace("Event", "");
}

function timeAgo(dateStr: string) {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    const weeks = Math.floor(days / 7);
    return `${weeks}w ago`;
}

export default function GitHubSyncPage() {
    const [isSyncing, setIsSyncing] = useState(false);
    const [lastSynced, setLastSynced] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<"all" | "public" | "private">("all");
    const [showContribMap, setShowContribMap] = useState(true);

    // Real data from API
    const [githubData, setGithubData] = useState<any>(null);

    const fetchGithubData = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const res = await fetch("/api/user/github");
            if (!res.ok) {
                const d = await res.json();
                setError(d.error || "Failed to load GitHub data");
                setIsLoading(false);
                return;
            }
            const data = await res.json();
            setGithubData(data);
            setLastSynced("just now");
        } catch {
            setError("Network error loading GitHub data");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchGithubData();
    }, [fetchGithubData]);

    const handleSync = useCallback(() => {
        setIsSyncing(true);
        fetchGithubData().finally(() => {
            setIsSyncing(false);
        });
    }, [fetchGithubData]);

    // Derived data
    const repos = githubData?.repos || [];
    const languageStats = githubData?.languageStats || {};
    const profile = githubData?.githubProfile || null;
    const activity = githubData?.recentActivity || [];
    const totalStars = githubData?.totalStars || 0;
    const totalRepos = githubData?.totalRepos || repos.length;
    const ghUsername = githubData?.githubUsername || "";
    const contribs = githubData?.contributionData || null;

    // Language data for the bar chart
    const totalLangRepos = Object.values(languageStats).reduce((s: number, c) => s + (c as number), 0) as number;
    const langChartData = Object.entries(languageStats)
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .map(([name, count]) => ({
            name,
            count: count as number,
            pct: totalLangRepos > 0 ? Math.round(((count as number) / totalLangRepos) * 100) : 0,
            color: langColors[name] || "#737373",
        }));

    // Filtered repos
    const filteredRepos = repos.filter((r: any) => {
        const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) || (r.description || "").toLowerCase().includes(search.toLowerCase());
        if (filter === "public") return matchSearch && !r.private;
        if (filter === "private") return matchSearch && r.private;
        return matchSearch;
    });

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-full flex items-center justify-center" style={{ background: "var(--theme-bg)" }}>
                <div className="text-center">
                    <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: `${accent}15`, color: accent }}>
                        <SyncIcon spinning />
                    </div>
                    <p className="text-[13px] font-medium" style={{ color: "var(--theme-text-muted)" }}>Loading GitHub data...</p>
                </div>
            </div>
        );
    }

    // Not connected state
    if (error) {
        return (
            <div className="min-h-full flex items-center justify-center" style={{ background: "var(--theme-bg)" }}>
                <div className="text-center max-w-sm">
                    <div className="w-16 h-16 rounded-xl mx-auto mb-4 flex items-center justify-center" style={{ background: "var(--theme-input-bg)", color: "var(--theme-text-primary)" }}>
                        <GitHubSVG />
                    </div>
                    <h2 className="text-lg font-bold mb-2" style={{ color: "var(--theme-text-primary)" }}>GitHub Not Connected</h2>
                    <p className="text-[12px] mb-4" style={{ color: "var(--theme-text-muted)" }}>{error}</p>
                    <a href="/talent/settings"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[12px] font-bold border-none no-underline transition-all hover:scale-105"
                        style={{ background: accent, color: "#000", boxShadow: `0 4px 20px ${accent}40` }}>
                        Connect GitHub in Settings
                    </a>
                </div>
            </div>
        );
    }

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
                                    Connected as <span className="font-semibold" style={{ color: accent }}>{ghUsername}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {lastSynced && (
                            <span className="text-[11px]" style={{ color: "var(--theme-text-muted)", fontFamily: "var(--font-jetbrains-mono)" }}>
                                Last synced: {lastSynced}
                            </span>
                        )}
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
                        { label: "Contributions", value: contribs?.totalContributions?.toLocaleString() || "0", icon: "🔥", sub: "this year" },
                        { label: "Commits", value: contribs?.totalCommits?.toLocaleString() || "0", icon: "⚡", sub: `${contribs?.totalPRs || 0} PRs · ${contribs?.totalIssues || 0} issues` },
                        { label: "Total Stars", value: totalStars.toLocaleString(), icon: "⭐", sub: `${totalRepos} repos` },
                        { label: "Followers", value: profile?.followers?.toLocaleString() || "0", icon: "👥", sub: `following ${profile?.following || 0}` },
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
                                    {contribs && (
                                        <span className="font-normal ml-2 text-[11px]" style={{ color: "var(--theme-text-muted)" }}>
                                            {contribs.totalContributions.toLocaleString()} contributions in the last year
                                        </span>
                                    )}
                                </h2>
                                <button onClick={() => setShowContribMap(!showContribMap)} className="text-[10px] font-medium bg-transparent border-none cursor-pointer" style={{ color: "var(--theme-text-muted)" }}>
                                    {showContribMap ? "Hide" : "Show"}
                                </button>
                            </div>
                            {showContribMap && contribs?.weeks && (
                                <div>
                                    <div className="flex gap-[2px]">
                                        {contribs.weeks.map((week: any, wi: number) => (
                                            <div key={wi} className="flex flex-col gap-[2px] flex-1">
                                                {week.days.map((day: any, di: number) => (
                                                    <div
                                                        key={di}
                                                        className="w-full rounded-[2px] transition-colors"
                                                        style={{ backgroundColor: day.count === 0 ? 'var(--theme-input-bg)' : day.color, aspectRatio: '1/1' }}
                                                        title={`${day.date}: ${day.count} contribution${day.count !== 1 ? 's' : ''}`}
                                                    />
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-[9px]" style={{ color: "var(--theme-text-muted)" }}>Less</span>
                                        <div className="flex gap-[3px] items-center">
                                            {["var(--theme-input-bg)", "#0e4429", "#006d32", "#26a641", "#39d353"].map((c, i) => (
                                                <div key={i} className="w-[11px] h-[11px] rounded-[2px]" style={{ backgroundColor: c }} />
                                            ))}
                                        </div>
                                        <span className="text-[9px]" style={{ color: "var(--theme-text-muted)" }}>More</span>
                                    </div>
                                </div>
                            )}
                            {showContribMap && !contribs?.weeks && (
                                <p className="text-[11px]" style={{ color: "var(--theme-text-muted)" }}>Contribution data not available.</p>
                            )}
                        </div>

                        {/* Repositories */}
                        <div className="rounded-2xl border" style={{ background: "var(--theme-card)", borderColor: "var(--theme-border)" }}>
                            <div className="p-4 sm:p-5 space-y-3" style={{ borderBottom: "1px solid var(--theme-border)" }}>
                                <div className="flex items-center justify-between">
                                    <h2 className="text-[13px] font-bold" style={{ color: "var(--theme-text-primary)" }}>
                                        Repositories <span className="font-normal" style={{ color: "var(--theme-text-muted)" }}>({repos.length} total)</span>
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
                                        {(["all", "public", "private"] as const).map(f => (
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
                                {filteredRepos.map((repo: any) => (
                                    <div key={repo.id} className="flex items-start gap-3 p-4 sm:px-5 transition-colors" style={{ borderBottom: "1px solid var(--theme-border-light)" }}>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <a href={repo.html_url} target="_blank" rel="noopener noreferrer"
                                                    className="text-[13px] font-bold truncate no-underline hover:underline" style={{ color: accent }}>
                                                    {repo.name}
                                                </a>
                                                {repo.private && (
                                                    <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium" style={{ background: "var(--theme-input-bg)", color: "var(--theme-text-muted)", border: "1px solid var(--theme-border)" }}>
                                                        Private
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-[11px] mb-2 leading-relaxed" style={{ color: "var(--theme-text-muted)" }}>{repo.description || "No description"}</p>
                                            <div className="flex items-center gap-4 text-[10px]" style={{ color: "var(--theme-text-muted)" }}>
                                                {repo.language && (
                                                    <span className="flex items-center gap-1.5">
                                                        <span className="w-2.5 h-2.5 rounded-full" style={{ background: langColors[repo.language] || "#737373" }} />
                                                        {repo.language}
                                                    </span>
                                                )}
                                                <span className="flex items-center gap-1">
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                                                    {repo.stargazers_count}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="6" y1="3" x2="6" y2="15" /><circle cx="18" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M18 9a9 9 0 0 1-9 9" /></svg>
                                                    {repo.forks_count}
                                                </span>
                                                <span>Updated {new Date(repo.updated_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
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
                                {profile?.avatarUrl ? (
                                    <img src={profile.avatarUrl} alt="GitHub" className="w-12 h-12 rounded-xl border" style={{ borderColor: `${accent}30` }} />
                                ) : (
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "var(--theme-input-bg)", color: "var(--theme-text-primary)" }}>
                                        <GitHubSVG />
                                    </div>
                                )}
                                <div>
                                    <p className="text-[13px] font-bold" style={{ color: "var(--theme-text-primary)" }}>{ghUsername}</p>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                                        <span className="text-[10px] font-medium" style={{ color: "#22C55E" }}>Connected</span>
                                    </div>
                                </div>
                            </div>
                            {profile?.bio && (
                                <p className="text-[11px] mb-3 leading-relaxed" style={{ color: "var(--theme-text-muted)" }}>{profile.bio}</p>
                            )}
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { label: "Repos", value: totalRepos },
                                    { label: "Stars", value: totalStars },
                                    { label: "Followers", value: profile?.followers || 0 },
                                ].map(stat => (
                                    <div key={stat.label} className="text-center rounded-xl p-2" style={{ background: "var(--theme-bg-secondary)" }}>
                                        <p className="text-[14px] font-bold" style={{ color: "var(--theme-text-primary)", fontFamily: "var(--font-jetbrains-mono)" }}>{stat.value}</p>
                                        <p className="text-[9px] uppercase tracking-widest" style={{ color: "var(--theme-text-muted)" }}>{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                            {profile?.createdAt && (
                                <p className="text-[10px] mt-3" style={{ color: "var(--theme-text-muted)" }}>
                                    Member since {new Date(profile.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                                </p>
                            )}
                            <div className="mt-3 p-3 rounded-xl" style={{ background: `${accent}08`, border: `1px solid ${accent}20` }}>
                                <p className="text-[10px] font-medium" style={{ color: accent, fontFamily: "var(--font-jetbrains-mono)" }}>
                                    ⚡ Sync imports your repos, contributions, and coding stats to power your SkillSpill profile and skill tree progression.
                                </p>
                            </div>
                        </div>

                        {/* Language Breakdown */}
                        <div className="rounded-2xl border p-4 sm:p-5" style={{ background: "var(--theme-card)", borderColor: "var(--theme-border)" }}>
                            <h2 className="text-[13px] font-bold mb-3" style={{ color: "var(--theme-text-primary)" }}>Language Breakdown</h2>
                            {langChartData.length > 0 ? (
                                <>
                                    <div className="h-3 rounded-full overflow-hidden flex mb-3" style={{ background: "var(--theme-input-bg)" }}>
                                        {langChartData.map(lang => (
                                            <div key={lang.name} className="h-full transition-all duration-700" style={{ width: `${lang.pct}%`, background: lang.color }} />
                                        ))}
                                    </div>
                                    <div className="space-y-2">
                                        {langChartData.map(lang => (
                                            <div key={lang.name} className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: lang.color }} />
                                                    <span className="text-[11px] font-medium" style={{ color: "var(--theme-text-secondary)" }}>{lang.name}</span>
                                                </div>
                                                <span className="text-[11px] font-bold" style={{ color: "var(--theme-text-primary)", fontFamily: "var(--font-jetbrains-mono)" }}>{lang.pct}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <p className="text-[11px]" style={{ color: "var(--theme-text-muted)" }}>No language data available.</p>
                            )}
                        </div>

                        {/* Recent Activity */}
                        <div className="rounded-2xl border p-4 sm:p-5" style={{ background: "var(--theme-card)", borderColor: "var(--theme-border)" }}>
                            <h2 className="text-[13px] font-bold mb-3" style={{ color: "var(--theme-text-primary)" }}>Recent Activity</h2>
                            {activity.length > 0 ? (
                                <div className="space-y-3">
                                    {activity.slice(0, 10).map((event: any, i: number) => (
                                        <div key={i} className="flex items-start gap-2.5">
                                            <ActivityIcon type={event.type} />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[11px] leading-snug" style={{ color: "var(--theme-text-secondary)" }}>
                                                    <span className="font-medium" style={{ color: "var(--theme-text-muted)" }}>{activityLabel(event.type)}</span>{" "}
                                                    <span className="font-bold" style={{ color: accent }}>{event.repo?.split("/").pop() || event.repo}</span>
                                                </p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[9px]" style={{ color: "var(--theme-text-muted)" }}>{timeAgo(event.createdAt)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-[11px]" style={{ color: "var(--theme-text-muted)" }}>No recent activity found.</p>
                            )}
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
