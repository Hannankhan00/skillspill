"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Loader2, RefreshCw, ExternalLink, ChevronDown, ChevronUp, Sparkles } from "lucide-react";

/* ══════════════════════════════════════════════
   G I T H U B  S C O R E  C A R D
   Displays the AI-powered GitHub score for a Talent
   ══════════════════════════════════════════════ */

const accent = "#3CF91A";

/* ── Types ── */

interface TopRepo {
    name:     string;
    url:      string;
    type:     string;
    language: string;
    scores: {
        metadata:  number;
        structure: number;
        ai:        number;
        final:     number;
    };
    scoreBreakdown: any;
    feedback: string | null;
}

interface OtherRepo {
    name:       string;
    url:        string;
    type:       string;
    language:   string;
    finalScore: number;
}

interface ScorecardData {
    githubScore:      number;
    scoreLastUpdated: string | null;
    githubUsername:   string | null;
    totalRepos:       number;
    topRepo:          TopRepo | null;
    otherRepos:       OtherRepo[];
    canRefresh:       boolean;
    nextRefreshAt:    string | null;
}

interface GitHubScoreCardProps {
    userId?:       string;   // if viewing another user's card (recruiter view)
    isOwnProfile:  boolean;  // controls whether the refresh button is shown
}

/* ── Helpers ── */

function scoreColor(s: number): string {
    if (s >= 80) return "#22C55E";
    if (s >= 60) return "#3B82F6";
    if (s >= 40) return "#EAB308";
    return "#EF4444";
}

function scoreBg(s: number): string {
    if (s >= 80) return "rgba(34,197,94,0.12)";
    if (s >= 60) return "rgba(59,130,246,0.12)";
    if (s >= 40) return "rgba(234,179,8,0.12)";
    return "rgba(239,68,68,0.12)";
}

const REPO_TYPE_LABELS: Record<string, string> = {
    web_app:          "Web App",
    backend_api:      "Backend API",
    android:          "Android",
    ios:              "iOS",
    data_science:     "Data Science",
    chrome_extension: "Chrome Extension",
    flutter:          "Flutter",
    cli_tool:         "CLI Tool",
    vscode_extension: "VS Code Extension",
    desktop_app:      "Desktop App",
    library_package:  "Library / Package",
    other:            "Other",
};

function repoTypeLabel(t: string): string {
    return REPO_TYPE_LABELS[t] ?? t;
}

function timeAgo(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime();
    const mins  = Math.floor(diff / 60000);
    if (mins < 1)  return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24)  return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7)  return `${days}d ago`;
    const weeks = Math.floor(days / 7);
    return `${weeks}w ago`;
}

function formatNextRefresh(iso: string): string {
    const diff = new Date(iso).getTime() - Date.now();
    if (diff <= 0) return "now";
    const hrs = Math.ceil(diff / (60 * 60 * 1000));
    return hrs <= 1 ? "less than 1 hour" : `${hrs} hours`;
}

/* ── GitHub Icon ── */

function GitHubSVG({ size = 20 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
        </svg>
    );
}

/* ── Score Ring (SVG arc) ── */

function ScoreRing({ score }: { score: number }) {
    const r            = 42;
    const circumference = 2 * Math.PI * r;
    const filled       = Math.min(score, 100) / 100 * circumference;
    const color        = scoreColor(score);

    return (
        <svg width="112" height="112" viewBox="0 0 100 100">
            {/* Track */}
            <circle cx="50" cy="50" r={r} fill="none" stroke="var(--theme-input-bg)" strokeWidth="8" />
            {/* Fill */}
            <circle
                cx="50" cy="50" r={r}
                fill="none"
                stroke={color}
                strokeWidth="8"
                strokeDasharray={`${filled} ${circumference}`}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
                style={{ transition: "stroke-dasharray 1.2s ease" }}
            />
            {/* Score number */}
            <text x="50" y="44" textAnchor="middle" dominantBaseline="middle"
                fill="var(--theme-text-primary)"
                fontSize="20" fontWeight="bold"
                fontFamily="var(--font-jetbrains-mono, monospace)">
                {Math.round(score)}
            </text>
            {/* Label */}
            <text x="50" y="60" textAnchor="middle" dominantBaseline="middle"
                fill="var(--theme-text-muted)"
                fontSize="8">
                / 100
            </text>
        </svg>
    );
}

/* ── Score Bar ── */

function ScoreBar({ label, value, isFinal = false }: { label: string; value: number; isFinal?: boolean }) {
    const pct   = Math.min(Math.round(value), 100);
    const color = scoreColor(value);
    return (
        <div className="space-y-1">
            <div className="flex items-center justify-between">
                <span className={`text-[11px] font-${isFinal ? "bold" : "medium"}`}
                    style={{ color: isFinal ? "var(--theme-text-primary)" : "var(--theme-text-secondary)" }}>
                    {label}
                </span>
                <span className="text-[11px] font-bold"
                    style={{ color, fontFamily: "var(--font-jetbrains-mono, monospace)" }}>
                    {pct}
                </span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--theme-input-bg)" }}>
                <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, background: isFinal ? color : color + "99" }}
                />
            </div>
        </div>
    );
}

/* ── Skeleton ── */

function Skeleton() {
    return (
        <div className="rounded-2xl border animate-pulse space-y-4 p-5"
            style={{ background: "var(--theme-card)", borderColor: "var(--theme-border)" }}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-(--theme-border)" />
                    <div className="space-y-1.5">
                        <div className="h-3 bg-(--theme-border) rounded w-28" />
                        <div className="h-2.5 bg-(--theme-border) rounded w-20" />
                    </div>
                </div>
                <div className="w-[112px] h-[112px] rounded-full bg-(--theme-border)" />
            </div>
            <div className="space-y-2">
                {[100, 80, 90, 70].map((w, i) => (
                    <div key={i} className="h-3 bg-(--theme-border) rounded" style={{ width: `${w}%` }} />
                ))}
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════════
   M A I N  C O M P O N E N T
   ══════════════════════════════════════════════ */

export default function GitHubScoreCard({ userId, isOwnProfile }: GitHubScoreCardProps) {
    const [data,            setData]            = useState<ScorecardData | null>(null);
    const [loading,         setLoading]         = useState(true);
    const [error,           setError]           = useState<string | null>(null);
    const [refreshing,      setRefreshing]      = useState(false);
    const [refreshError,    setRefreshError]    = useState<string | null>(null);
    const [refreshSuccess,  setRefreshSuccess]  = useState(false);
    const [showExplanation, setShowExplanation] = useState(false);

    // ── Fetch scorecard ──
    const fetchScorecard = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const url = userId
                ? `/api/github/scorecard?userId=${userId}`
                : "/api/github/scorecard";
            const res = await fetch(url);
            if (!res.ok) {
                const d = await res.json().catch(() => ({}));
                setError(d.error ?? "Failed to load scorecard");
                setLoading(false);
                return;
            }
            const d: ScorecardData = await res.json();
            setData(d);
        } catch {
            setError("Network error — please try again");
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => { fetchScorecard(); }, [fetchScorecard]);

    // ── Trigger scoring run ──
    const handleRefresh = async () => {
        setRefreshing(true);
        setRefreshError(null);
        setRefreshSuccess(false);
        try {
            const res  = await fetch("/api/github/score", { method: "POST" });
            const body = await res.json().catch(() => ({}));

            if (res.status === 429) {
                setRefreshError(body.message ?? "Score already up to date. Try again later.");
                return;
            }
            if (!res.ok || body.success === false) {
                setRefreshError(body.error ?? "Scoring failed. Please try again.");
                return;
            }
            setRefreshSuccess(true);
            await fetchScorecard();
            setTimeout(() => setRefreshSuccess(false), 3000);
        } catch {
            setRefreshError("Network error — please try again.");
        } finally {
            setRefreshing(false);
        }
    };

    // ── Loading state ──
    if (loading) return <Skeleton />;

    // ── Error state ──
    if (error) {
        return (
            <div className="rounded-2xl border p-5 text-center"
                style={{ background: "var(--theme-card)", borderColor: "var(--theme-border)" }}>
                <div className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center"
                    style={{ background: "var(--theme-input-bg)", color: "var(--theme-text-muted)" }}>
                    <GitHubSVG />
                </div>
                <p className="text-[12px] font-semibold mb-1" style={{ color: "var(--theme-text-primary)" }}>
                    Could not load scorecard
                </p>
                <p className="text-[11px] mb-4" style={{ color: "var(--theme-text-muted)" }}>{error}</p>
                <button
                    onClick={fetchScorecard}
                    className="px-4 py-2 rounded-xl text-[11px] font-bold border-none cursor-pointer transition-all hover:scale-105"
                    style={{ background: accent, color: "#000" }}>
                    Retry
                </button>
            </div>
        );
    }

    // ── Not connected / never scored state ──
    const isEmpty = !data || (data.totalRepos === 0 && data.scoreLastUpdated === null);
    if (isEmpty) {
        const connected = data?.githubUsername != null;
        return (
            <div className="rounded-2xl border p-5 text-center"
                style={{ background: "var(--theme-card)", borderColor: "var(--theme-border)" }}>
                <div className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center"
                    style={{ background: "var(--theme-input-bg)", color: "var(--theme-text-muted)" }}>
                    <GitHubSVG size={26} />
                </div>
                <h3 className="text-[14px] font-bold mb-2" style={{ color: "var(--theme-text-primary)", fontFamily: "var(--font-space-grotesk, sans-serif)" }}>
                    {connected ? "Get your GitHub score" : "Connect your GitHub to get scored"}
                </h3>
                <p className="text-[11px] mb-4 mx-auto max-w-xs leading-relaxed" style={{ color: "var(--theme-text-muted)" }}>
                    {connected
                        ? "We'll analyse your repositories for code quality, structure, activity, and best practices to generate your developer score."
                        : "We analyse your repositories for code quality, structure, activity, and best practices to generate your developer score."}
                </p>
                {isOwnProfile && (
                    connected ? (
                        <button
                            onClick={handleRefresh}
                            disabled={refreshing}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[12px] font-bold border-none cursor-pointer transition-all hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
                            style={{ background: accent, color: "#000", boxShadow: `0 4px 20px ${accent}40` }}>
                            {refreshing ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Analysing…</> : <><RefreshCw className="w-3.5 h-3.5" /> Generate Score</>}
                        </button>
                    ) : (
                        <a
                            href="/talent/settings"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[12px] font-bold border-none cursor-pointer transition-all hover:scale-[1.02] no-underline"
                            style={{ background: accent, color: "#000", boxShadow: `0 4px 20px ${accent}40` }}>
                            <GitHubSVG size={14} /> Connect GitHub
                        </a>
                    )
                )}
                {refreshing && (
                    <p className="text-[10px] mt-3" style={{ color: "var(--theme-text-muted)" }}>
                        This may take up to 30 seconds…
                    </p>
                )}
                {refreshError && (
                    <p className="text-[11px] mt-3 font-medium" style={{ color: "#EF4444" }}>{refreshError}</p>
                )}
            </div>
        );
    }

    // ── Full scorecard ──
    const { githubScore, scoreLastUpdated, githubUsername, topRepo, otherRepos, canRefresh, nextRefreshAt } = data!;

    return (
        <div className="rounded-2xl border overflow-hidden"
            style={{ background: "var(--theme-card)", borderColor: "var(--theme-border)" }}>

            {/* ═══ Section 1 — Header ═══ */}
            <div className="p-5" style={{ borderBottom: "1px solid var(--theme-border)" }}>
                <div className="flex items-start justify-between gap-4">

                    {/* Left — username + score ring */}
                    <div className="flex items-center gap-4">
                        <ScoreRing score={githubScore} />
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                                    style={{ background: "var(--theme-input-bg)", color: "var(--theme-text-primary)" }}>
                                    <GitHubSVG size={16} />
                                </div>
                                <a
                                    href={`https://github.com/${githubUsername}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[13px] font-bold no-underline hover:underline flex items-center gap-1"
                                    style={{ color: accent }}>
                                    {githubUsername}
                                    <ExternalLink className="w-3 h-3" />
                                </a>
                            </div>
                            <p className="text-[11px] font-semibold mb-1" style={{ color: "var(--theme-text-secondary)" }}>
                                GitHub Score
                            </p>
                            {scoreLastUpdated && (
                                <p className="text-[10px]" style={{ color: "var(--theme-text-muted)" }}>
                                    Updated {timeAgo(scoreLastUpdated)}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Right — refresh button */}
                    {isOwnProfile && (
                        <div className="text-right shrink-0">
                            {canRefresh ? (
                                <button
                                    onClick={handleRefresh}
                                    disabled={refreshing}
                                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-bold border-none cursor-pointer transition-all hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
                                    style={refreshSuccess
                                        ? { background: "rgba(34,197,94,0.15)", color: "#22C55E" }
                                        : { background: refreshing ? "var(--theme-input-bg)" : accent, color: refreshing ? "var(--theme-text-muted)" : "#000" }}>
                                    {refreshing
                                        ? <><Loader2 className="w-3 h-3 animate-spin" /> Analysing…</>
                                        : refreshSuccess
                                            ? "Score updated!"
                                            : <><RefreshCw className="w-3 h-3" /> Refresh</>}
                                </button>
                            ) : nextRefreshAt ? (
                                <p className="text-[10px]" style={{ color: "var(--theme-text-muted)" }}>
                                    Next refresh in {formatNextRefresh(nextRefreshAt)}
                                </p>
                            ) : null}
                            {refreshing && (
                                <p className="text-[9px] mt-1.5" style={{ color: "var(--theme-text-muted)" }}>
                                    This may take up to 30 seconds…
                                </p>
                            )}
                            {refreshError && (
                                <p className="text-[10px] mt-1.5 max-w-[160px]" style={{ color: "#EF4444" }}>
                                    {refreshError}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* ═══ Section 2 — Top Repository ═══ */}
            {topRepo && (
                <div className="p-5" style={{ borderBottom: "1px solid var(--theme-border)" }}>
                    <p className="text-[9px] font-bold uppercase tracking-[2px] mb-3"
                        style={{ color: "var(--theme-text-muted)", fontFamily: "var(--font-jetbrains-mono, monospace)" }}>
                        ⭐ Top Repository
                    </p>

                    {/* Repo name + badges */}
                    <div className="flex items-start justify-between gap-2 mb-4">
                        <a
                            href={topRepo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[14px] font-bold no-underline hover:underline flex items-center gap-1.5 min-w-0"
                            style={{ color: accent, fontFamily: "var(--font-space-grotesk, sans-serif)" }}>
                            <span className="truncate">{topRepo.name}</span>
                            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                        </a>
                        <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                                style={{ background: `${accent}15`, color: accent, border: `1px solid ${accent}30` }}>
                                {repoTypeLabel(topRepo.type)}
                            </span>
                            <span className="text-[9px] font-medium px-2 py-0.5 rounded-full"
                                style={{ background: "var(--theme-input-bg)", color: "var(--theme-text-muted)", border: "1px solid var(--theme-border)" }}>
                                {topRepo.language}
                            </span>
                        </div>
                    </div>

                    {/* Score bars */}
                    <div className="space-y-2.5 mb-4">
                        <ScoreBar label="Metadata Score"  value={topRepo.scores.metadata}  />
                        <ScoreBar label="Structure Score" value={topRepo.scores.structure} />
                        <ScoreBar label="AI Score"        value={topRepo.scores.ai}        />
                        <div className="pt-1" style={{ borderTop: "1px solid var(--theme-border-light)" }}>
                            <ScoreBar label="Final Score" value={topRepo.scores.final} isFinal />
                        </div>
                    </div>

                    {/* AI Feedback */}
                    {topRepo.feedback && (
                        <div className="rounded-xl p-3.5"
                            style={{ background: "var(--theme-bg-secondary)", border: "1px solid var(--theme-border)" }}>
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="w-3.5 h-3.5" style={{ color: accent }} />
                                <span className="text-[10px] font-bold uppercase tracking-[1.5px]"
                                    style={{ color: accent, fontFamily: "var(--font-jetbrains-mono, monospace)" }}>
                                    AI Analysis
                                </span>
                            </div>
                            <p className="text-[11px] leading-relaxed" style={{ color: "var(--theme-text-secondary)" }}>
                                {topRepo.feedback}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* ═══ Section 3 — Other Repositories ═══ */}
            {otherRepos.length > 0 && (
                <div className="p-5" style={{ borderBottom: "1px solid var(--theme-border)" }}>
                    <p className="text-[9px] font-bold uppercase tracking-[2px] mb-3"
                        style={{ color: "var(--theme-text-muted)", fontFamily: "var(--font-jetbrains-mono, monospace)" }}>
                        Other Repositories
                    </p>
                    <div className="space-y-2">
                        {otherRepos.map(repo => {
                            const color = scoreColor(repo.finalScore);
                            const bg    = scoreBg(repo.finalScore);
                            return (
                                <div key={repo.name}
                                    className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5"
                                    style={{ background: "var(--theme-bg-secondary)", border: "1px solid var(--theme-border)" }}>
                                    <div className="flex items-center gap-2 min-w-0 flex-1">
                                        <a
                                            href={repo.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[12px] font-semibold no-underline hover:underline truncate"
                                            style={{ color: "var(--theme-text-primary)" }}>
                                            {repo.name}
                                        </a>
                                        <span className="text-[9px] px-1.5 py-0.5 rounded-md shrink-0"
                                            style={{ background: "var(--theme-input-bg)", color: "var(--theme-text-muted)" }}>
                                            {repoTypeLabel(repo.type)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <span className="text-[10px]" style={{ color: "var(--theme-text-muted)" }}>
                                            {repo.language}
                                        </span>
                                        <span className="text-[12px] font-bold px-2 py-0.5 rounded-lg"
                                            style={{ color, background: bg, fontFamily: "var(--font-jetbrains-mono, monospace)" }}>
                                            {Math.round(repo.finalScore)}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ═══ Section 4 — Score Explanation (collapsible) ═══ */}
            <div className="px-5 py-3">
                <button
                    onClick={() => setShowExplanation(v => !v)}
                    className="flex items-center gap-1.5 bg-transparent border-none cursor-pointer w-full text-left"
                    style={{ color: "var(--theme-text-muted)" }}>
                    <span className="text-[10px] font-medium">How is this score calculated?</span>
                    {showExplanation
                        ? <ChevronUp className="w-3 h-3 ml-auto" />
                        : <ChevronDown className="w-3 h-3 ml-auto" />}
                </button>
                {showExplanation && (
                    <p className="text-[10px] mt-3 leading-relaxed"
                        style={{ color: "var(--theme-text-muted)" }}>
                        Your GitHub score is calculated from your top 5 repositories. Your best repository
                        receives 40% of the weight and undergoes deep analysis including file structure
                        review and AI code quality assessment. Other repositories are scored on metadata
                        signals like size, activity, stars, and language.
                    </p>
                )}
            </div>

            {/* Keyframe for spin */}
            <style jsx>{`
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}
