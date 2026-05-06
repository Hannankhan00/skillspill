"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
    Sparkles, Users, Loader2, RefreshCw, AlertCircle,
    CheckCircle, Shield, Info, ExternalLink,
} from "lucide-react";

const accent = "#A855F7";

// ── Types ──────────────────────────────────────────────────────────────────────

interface Candidate {
    rank: number;
    talentProfileId: string;
    matchScore: number;
    skillOverlapScore: number;
    semanticScore: number;
    bonusScore: number;
    computedAt: string;
    talent: {
        name: string;
        email: string;
        avatar: string | null;
        experienceLevel: string | null;
        githubScore: number;
        isAvailable: boolean;
        skills: { name: string; isVerified: boolean }[];
    };
}

interface CandidatesData {
    bountyId: string;
    bountyTitle: string;
    totalCandidates: number;
    candidates: Candidate[];
    lastComputedAt: string | null;
}

export interface AIMatchedCandidatesProps {
    bountyId: string;
    bountyTitle: string;
    bountyStatus: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function scoreTextColor(score: number) {
    if (score >= 70) return "text-green-500";
    if (score >= 50) return "text-amber-500";
    return "text-red-400";
}

function scoreRingColor(score: number) {
    if (score >= 70) return "#22c55e";
    if (score >= 50) return "#f59e0b";
    return "#f87171";
}

function rankBadgeStyle(rank: number) {
    if (rank === 1) return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    if (rank === 2) return "bg-gray-400/20 text-gray-300 border-gray-400/30";
    if (rank === 3) return "bg-orange-500/20 text-orange-400 border-orange-500/30";
    return "bg-(--theme-input-bg) text-(--theme-text-muted) border-(--theme-border)";
}

function expBadgeStyle(level: string | null): string | null {
    const map: Record<string, string> = {
        JUNIOR: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        MID:    "bg-purple-500/10 text-purple-400 border-purple-500/20",
        SENIOR: "bg-amber-500/10 text-amber-500 border-amber-500/20",
        STAFF:  "bg-red-500/10 text-red-400 border-red-500/20",
    };
    return level
        ? (map[level] ?? "bg-(--theme-input-bg) text-(--theme-text-muted) border-(--theme-border)")
        : null;
}

function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60_000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
}

type ScoreFilter = "all" | "70+" | "50+" | "below50";

// ── Score bar ──────────────────────────────────────────────────────────────────

function ScoreBar({ label, value, barClass }: { label: string; value: number; barClass: string }) {
    return (
        <div className="flex items-center gap-2">
            <span className="text-[9px] text-(--theme-text-muted) w-[54px] shrink-0">{label}</span>
            <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-(--theme-border)">
                <div className={`h-full rounded-full ${barClass}`} style={{ width: `${Math.min(value, 100)}%` }} />
            </div>
            <span className="text-[9px] font-bold text-(--theme-text-muted) w-7 text-right shrink-0">
                {Math.round(value)}%
            </span>
        </div>
    );
}

// ── Main component ─────────────────────────────────────────────────────────────

export function AIMatchedCandidates({ bountyId, bountyStatus }: AIMatchedCandidatesProps) {
    const [data,           setData]           = useState<CandidatesData | null>(null);
    const [loading,        setLoading]        = useState(true);
    const [error,          setError]          = useState("");
    const [running,        setRunning]        = useState(false);
    const [runError,       setRunError]       = useState("");
    const [runInfo,        setRunInfo]        = useState("");
    const [filter,         setFilter]         = useState<ScoreFilter>("all");
    const [shortlisting,   setShortlisting]   = useState<string | null>(null);
    const [shortlistedIds, setShortlistedIds] = useState<Set<string>>(new Set());
    const [appIdMap,       setAppIdMap]       = useState<Map<string, string>>(new Map());

    const fetchCandidates = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const res  = await fetch(`/api/matching/candidates?bountyId=${bountyId}`);
            const json = await res.json();
            if (!res.ok) {
                setError(json.error || "Failed to load candidates");
            } else {
                setData(json);
            }
        } catch {
            setError("Network error — couldn't load candidates");
        } finally {
            setLoading(false);
        }
    }, [bountyId]);

    // Fetch applications so we can cross-reference who has applied (for Shortlist button)
    const fetchApplications = useCallback(async () => {
        try {
            const res  = await fetch(`/api/jobs/${bountyId}/apply`);
            if (!res.ok) return;
            const json = await res.json();
            const apps: any[] = json.applications ?? [];
            const map        = new Map<string, string>();
            const shortlisted = new Set<string>();
            apps.forEach((app) => {
                if (app.talentProfileId) {
                    map.set(app.talentProfileId, app.id);
                    if (app.status === "SHORTLISTED") shortlisted.add(app.talentProfileId);
                }
            });
            setAppIdMap(map);
            setShortlistedIds(shortlisted);
        } catch {
            // non-fatal — shortlist button will remain disabled for all
        }
    }, [bountyId]);

    useEffect(() => {
        fetchCandidates();
        fetchApplications();
    }, [fetchCandidates, fetchApplications]);

    async function triggerRun() {
        setRunning(true);
        setRunError("");
        setRunInfo("");
        try {
            const res  = await fetch("/api/matching/run", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bountyId }),
            });
            const json = await res.json();
            if (res.status === 429) {
                const nextAt = json.nextRunAt
                    ? new Date(json.nextRunAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                    : "";
                setRunInfo(`${json.message ?? "Matching was run recently."} Next run at ${nextAt}`);
            } else if (!res.ok || !json.success) {
                setRunError(json.error || "Matching failed. Please try again.");
            } else {
                await fetchCandidates();
            }
        } catch {
            setRunError("Network error — matching service may be offline.");
        } finally {
            setRunning(false);
        }
    }

    async function shortlistCandidate(talentProfileId: string) {
        const appId = appIdMap.get(talentProfileId);
        if (!appId) return;
        setShortlisting(talentProfileId);
        try {
            const res = await fetch(`/api/jobs/${bountyId}/applications/${appId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "SHORTLISTED" }),
            });
            if (res.ok) setShortlistedIds((prev) => new Set([...prev, talentProfileId]));
        } finally {
            setShortlisting(null);
        }
    }

    const isOpen = bountyStatus === "OPEN";

    const filtered = (data?.candidates ?? []).filter((c) => {
        if (filter === "70+")      return c.matchScore >= 70;
        if (filter === "50+")      return c.matchScore >= 50 && c.matchScore < 70;
        if (filter === "below50")  return c.matchScore < 50;
        return true;
    });

    // ── Loading skeleton ──
    if (loading) {
        return (
            <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="rounded-xl border border-(--theme-border) p-4 animate-pulse"
                        style={{ background: "var(--theme-bg-secondary)" }}>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-9 h-9 rounded-full bg-(--theme-input-bg) shrink-0" />
                            <div className="flex-1 space-y-1.5">
                                <div className="h-2.5 w-28 bg-(--theme-input-bg) rounded" />
                                <div className="h-2 w-20 bg-(--theme-input-bg) rounded" />
                            </div>
                            <div className="w-12 h-12 rounded-full bg-(--theme-input-bg) shrink-0" />
                        </div>
                        <div className="space-y-2">
                            <div className="h-1.5 rounded-full bg-(--theme-input-bg)" />
                            <div className="h-1.5 rounded-full bg-(--theme-input-bg) w-4/5" />
                            <div className="h-1.5 rounded-full bg-(--theme-input-bg) w-3/4" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-4">

            {/* ── Run matching controls ── */}
            <div className="space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                    {isOpen ? (
                        <button
                            onClick={triggerRun}
                            disabled={running}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-bold text-white border-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed transition-all hover:scale-[1.02]"
                            style={{
                                background:  `linear-gradient(135deg, ${accent}, #7C3AED)`,
                                boxShadow:   running ? "none" : `0 0 16px ${accent}40`,
                            }}
                        >
                            {running
                                ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Analysing candidates…</>
                                : <><Sparkles className="w-3.5 h-3.5" /> Find Matching Candidates</>
                            }
                        </button>
                    ) : (
                        <p className="text-[11px] text-(--theme-text-muted) italic">
                            Matching only available for open bounties
                        </p>
                    )}
                    <span className="text-[10px] text-(--theme-text-muted)">
                        {data?.lastComputedAt
                            ? `Last analysed ${timeAgo(data.lastComputedAt)}`
                            : "Not yet analysed"}
                    </span>
                </div>
                {running  && <p className="text-[10px] text-(--theme-text-muted)">This may take 20–40 seconds…</p>}
                {runError && <p className="text-[11px] text-red-400 bg-red-400/10 rounded-xl px-3 py-2">{runError}</p>}
                {runInfo  && <p className="text-[11px] text-amber-500 bg-amber-500/10 rounded-xl px-3 py-2">{runInfo}</p>}
            </div>

            {/* ── Error state ── */}
            {error && (
                <div className="flex flex-col items-center gap-2 py-8 text-center">
                    <AlertCircle className="w-8 h-8 text-red-400 opacity-60" />
                    <p className="text-[13px] font-semibold text-(--theme-text-secondary)">{error}</p>
                    <button onClick={fetchCandidates}
                        className="flex items-center gap-1.5 text-[11px] text-secondary bg-transparent border-none cursor-pointer hover:underline">
                        <RefreshCw className="w-3 h-3" /> Retry
                    </button>
                </div>
            )}

            {/* ── Empty state ── */}
            {!error && data?.totalCandidates === 0 && (
                <div className="flex flex-col items-center gap-3 py-10 text-center border-2 border-dashed border-(--theme-border) rounded-2xl">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                        style={{ background: `${accent}15` }}>
                        <Users className="w-7 h-7" style={{ color: accent }} />
                    </div>
                    <div>
                        <p className="text-[14px] font-bold text-(--theme-text-secondary)">No AI matches yet</p>
                        <p className="text-[11px] text-(--theme-text-muted) mt-1 max-w-[250px] mx-auto">
                            Click &lsquo;Find Matching Candidates&rsquo; to analyse all available talent profiles against this job.
                        </p>
                    </div>
                </div>
            )}

            {/* ── Candidates list ── */}
            {!error && data && data.totalCandidates > 0 && (
                <>
                    {/* Filter bar */}
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-bold text-(--theme-text-secondary)">
                                {data.totalCandidates} candidate{data.totalCandidates !== 1 ? "s" : ""}
                            </span>
                            {/* Score explanation tooltip */}
                            <div className="relative group">
                                <button className="w-4 h-4 rounded-full bg-(--theme-input-bg) border border-(--theme-border) flex items-center justify-center cursor-default">
                                    <Info className="w-2.5 h-2.5 text-(--theme-text-muted)" />
                                </button>
                                <div className="absolute left-0 bottom-6 z-30 w-60 rounded-xl border border-(--theme-border) shadow-xl px-3 py-2.5 text-[10px] text-(--theme-text-secondary) leading-relaxed opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity"
                                    style={{ background: "var(--theme-card)" }}>
                                    Match score combines{" "}
                                    <span className="font-bold text-(--theme-text-primary)">skill overlap (35%)</span>,{" "}
                                    <span className="font-bold text-(--theme-text-primary)">semantic text similarity (50%)</span>,
                                    and profile signals like availability and GitHub score{" "}
                                    <span className="font-bold text-(--theme-text-primary)">(15%)</span>.
                                </div>
                            </div>
                        </div>

                        {/* Score filter buttons */}
                        <div className="flex gap-1">
                            {(["all", "70+", "50+", "below50"] as ScoreFilter[]).map((f) => (
                                <button key={f} onClick={() => setFilter(f)}
                                    className={`px-2.5 py-1 rounded-lg text-[9px] font-bold cursor-pointer border transition-all ${
                                        filter === f
                                            ? "bg-secondary text-white border-transparent"
                                            : "bg-(--theme-input-bg) text-(--theme-text-muted) border-(--theme-border) hover:border-secondary/40 hover:text-secondary"
                                    }`}>
                                    {f === "all" ? "All" : f === "70+" ? "70%+" : f === "50+" ? "50%+" : "Below 50%"}
                                </button>
                            ))}
                        </div>
                    </div>

                    {filtered.length === 0 && (
                        <p className="text-center text-[12px] text-(--theme-text-muted) py-5">
                            No candidates in this score range.
                        </p>
                    )}

                    <div className="space-y-3">
                        {filtered.map((c) => {
                            const hasApplied    = appIdMap.has(c.talentProfileId);
                            const isShortlisted = shortlistedIds.has(c.talentProfileId);
                            const ringColor     = scoreRingColor(c.matchScore);
                            const expStyle      = expBadgeStyle(c.talent.experienceLevel);
                            const visibleSkills = c.talent.skills.slice(0, 5);
                            const extraSkills   = c.talent.skills.length - 5;

                            return (
                                <div key={c.talentProfileId}
                                    className="rounded-xl border border-(--theme-border) p-4 transition-all hover:border-secondary/30 hover:shadow-sm"
                                    style={{ background: "var(--theme-bg-secondary)" }}>
                                    <div className="flex items-start gap-3">

                                        {/* Left — rank badge + avatar */}
                                        <div className="flex flex-col items-center gap-1.5 shrink-0 pt-0.5">
                                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border whitespace-nowrap ${rankBadgeStyle(c.rank)}`}>
                                                #{c.rank}
                                            </span>
                                            {c.talent.avatar ? (
                                                <img src={c.talent.avatar} alt={c.talent.name}
                                                    className="w-9 h-9 rounded-full object-cover border border-(--theme-border)" />
                                            ) : (
                                                <div className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold text-white"
                                                    style={{ background: `linear-gradient(135deg, ${accent}, #7C3AED)` }}>
                                                    {c.talent.name.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>

                                        {/* Middle — name, skills, score bars, actions */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                                                <p className="text-[13px] font-bold text-(--theme-text-primary)">{c.talent.name}</p>
                                                {expStyle && (
                                                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border ${expStyle}`}>
                                                        {c.talent.experienceLevel}
                                                    </span>
                                                )}
                                                {c.talent.isAvailable && (
                                                    <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-md bg-green-500/10 text-green-500 border border-green-500/20">
                                                        AVAILABLE
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-[10px] text-(--theme-text-muted) mb-2">{c.talent.email}</p>

                                            {c.talent.skills.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mb-3">
                                                    {visibleSkills.map((s) => (
                                                        <span key={s.name}
                                                            className={`text-[9px] px-2 py-0.5 rounded-md border flex items-center gap-0.5 ${
                                                                s.isVerified
                                                                    ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                                                                    : "bg-(--theme-input-bg) text-(--theme-text-muted) border-(--theme-border)"
                                                            }`}>
                                                            {s.isVerified && <Shield className="w-2 h-2 shrink-0" />}
                                                            {s.name}
                                                        </span>
                                                    ))}
                                                    {extraSkills > 0 && (
                                                        <span className="text-[9px] px-2 py-0.5 rounded-md bg-(--theme-input-bg) text-(--theme-text-muted) border border-(--theme-border)">
                                                            +{extraSkills} more
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            {/* Score breakdown bars */}
                                            <div className="space-y-1.5 mb-3">
                                                <ScoreBar label="Skill Match" value={c.skillOverlapScore} barClass="bg-purple-500" />
                                                <ScoreBar label="Semantic"    value={c.semanticScore}     barClass="bg-blue-500"   />
                                                <ScoreBar label="Bonus"       value={c.bonusScore}        barClass="bg-amber-500"  />
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-2 flex-wrap">
                                                <Link href={`/recruiter/talent/${c.talentProfileId}`}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold text-secondary bg-secondary/10 border border-secondary/20 hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-all no-underline">
                                                    <ExternalLink className="w-3 h-3" /> View Profile
                                                </Link>

                                                <div className="relative group/shortlist">
                                                    <button
                                                        disabled={!hasApplied || isShortlisted || shortlisting === c.talentProfileId}
                                                        onClick={() => shortlistCandidate(c.talentProfileId)}
                                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
                                                            isShortlisted
                                                                ? "bg-green-500/10 text-green-500 border-green-500/20 cursor-default"
                                                                : "bg-(--theme-input-bg) text-(--theme-text-muted) border-(--theme-border) hover:border-secondary/40 hover:text-secondary cursor-pointer"
                                                        }`}>
                                                        {shortlisting === c.talentProfileId ? (
                                                            <Loader2 className="w-3 h-3 animate-spin" />
                                                        ) : isShortlisted ? (
                                                            <><CheckCircle className="w-3 h-3" /> Shortlisted</>
                                                        ) : (
                                                            "Shortlist"
                                                        )}
                                                    </button>
                                                    {/* Tooltip: only shown when candidate hasn't applied */}
                                                    {!hasApplied && (
                                                        <div className="absolute bottom-9 left-0 z-20 w-44 rounded-lg border border-(--theme-border) shadow-xl px-2.5 py-2 text-[10px] text-(--theme-text-secondary) opacity-0 group-hover/shortlist:opacity-100 pointer-events-none transition-opacity"
                                                            style={{ background: "var(--theme-card)" }}>
                                                            Candidate hasn&apos;t applied yet
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right — circular match score */}
                                        <div className="shrink-0 flex flex-col items-center gap-1 ml-1">
                                            <div className="w-14 h-14 rounded-full flex items-center justify-center border-2"
                                                style={{
                                                    borderColor: ringColor,
                                                    boxShadow:   `0 0 12px ${ringColor}25`,
                                                }}>
                                                <span className={`text-[15px] font-black ${scoreTextColor(c.matchScore)}`}>
                                                    {Math.round(c.matchScore)}
                                                </span>
                                            </div>
                                            <span className="text-[8px] text-(--theme-text-muted) uppercase tracking-wider">Match</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}

// ── MatchScoreBadge ─────────────────────────────────────────────────────────────
// Compact badge for the recruiter job list cards — shows at a glance whether
// matching has been run and what the top score is.

export function MatchScoreBadge({
    topScore,
    candidateCount,
}: {
    topScore: number | null;
    candidateCount: number;
}) {
    if (topScore === null && candidateCount === 0) return null;
    return (
        <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full border border-[#A855F7]/20 bg-[#A855F7]/10 text-[#A855F7]">
            <Sparkles className="w-2.5 h-2.5" />
            {topScore !== null ? `${Math.round(topScore)}% match` : "Matched"}
            {candidateCount > 0 && <span className="opacity-40 mx-0.5">·</span>}
            {candidateCount > 0 && `${candidateCount} candidates`}
        </span>
    );
}

export default AIMatchedCandidates;
