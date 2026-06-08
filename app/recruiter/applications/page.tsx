"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Loader2, Sparkles, ChevronRight } from "lucide-react";

const accent = "#A855F7";

const STATUS_LABELS: Record<string, string> = {
    PENDING: "Pending",
    REVIEWED: "Reviewed",
    SHORTLISTED: "Shortlisted",
    ACCEPTED: "Accepted",
    REJECTED: "Rejected",
};

const STATUS_STYLES: Record<string, string> = {
    PENDING:     "bg-amber-500/10 text-amber-500 border-amber-500/20",
    REVIEWED:    "bg-blue-500/10 text-blue-500 border-blue-500/20",
    SHORTLISTED: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    ACCEPTED:    "bg-green-500/10 text-green-500 border-green-500/20",
    REJECTED:    "bg-red-500/10 text-red-500 border-red-500/20",
};

const FILTERS = ["All", "PENDING", "REVIEWED", "SHORTLISTED", "ACCEPTED", "REJECTED"];

function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 30) return `${days}d ago`;
    return `${Math.floor(days / 30)}mo ago`;
}

function Avatar({ user }: { user: any }) {
    const initials = (user.fullName || user.username || "?")
        .split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
    if (user.avatarUrl) {
        return <img src={user.avatarUrl} alt={user.fullName} className="w-11 h-11 rounded-full object-cover shrink-0 border border-(--theme-border)" />;
    }
    return (
        <div className="w-11 h-11 rounded-full flex items-center justify-center text-white text-[12px] font-bold shrink-0"
            style={{ background: "linear-gradient(135deg, #A855F7, #7C3AED)" }}>
            {initials}
        </div>
    );
}

export default function RecruiterApplicationsPage() {
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState("All");
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    const fetchApplications = useCallback(() => {
        setLoading(true);
        fetch("/api/recruiter/applications")
            .then(r => r.json())
            .then(d => { setApplications(d.applications || []); })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => { fetchApplications(); }, [fetchApplications]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handler = () => setOpenMenuId(null);
        document.addEventListener("click", handler);
        return () => document.removeEventListener("click", handler);
    }, []);

    const updateStatus = async (applicationId: string, status: string) => {
        setUpdatingId(applicationId);
        setOpenMenuId(null);
        try {
            const res = await fetch("/api/recruiter/applications", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ applicationId, status }),
            });
            if (res.ok) {
                setApplications(prev =>
                    prev.map(a => a.id === applicationId ? { ...a, status } : a)
                );
            }
        } finally {
            setUpdatingId(null);
        }
    };

    const filtered = activeFilter === "All"
        ? applications
        : applications.filter(a => a.status === activeFilter);

    const countFor = (f: string) => f === "All" ? applications.length : applications.filter(a => a.status === f).length;

    return (
        <div style={{ background: "var(--theme-bg)" }} className="min-h-full">
            <div className="max-w-[1000px] w-full mx-auto px-4 sm:px-6 py-4 pb-24 lg:pb-8">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 sm:mb-6">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-(--theme-text-primary)">Applicant Tracking</h1>
                        <p className="text-[12px] sm:text-[13px] text-(--theme-text-muted) mt-0.5">
                            {loading ? "Loading..." : `${applications.length} total application${applications.length !== 1 ? "s" : ""} across all jobs`}
                        </p>
                    </div>
                </div>

                {/* Filter tabs */}
                <div className="flex gap-1 overflow-x-auto pb-1 mb-5 border-b border-(--theme-border) scrollbar-none">
                    {FILTERS.map(f => (
                        <button key={f} onClick={() => setActiveFilter(f)}
                            className={`px-3 sm:px-5 py-2.5 text-[11px] sm:text-[12px] font-semibold border-b-2 transition-all cursor-pointer bg-transparent whitespace-nowrap flex items-center gap-1.5
                                ${activeFilter === f ? "border-purple-500 text-[#A855F7]" : "border-transparent text-(--theme-text-muted) hover:text-(--theme-text-tertiary)"}`}>
                            {f === "All" ? "All" : STATUS_LABELS[f]}
                            <span className={`text-[8px] sm:text-[9px] px-1.5 py-0.5 rounded-full font-bold
                                ${activeFilter === f ? "bg-[#A855F7]/20 text-[#A855F7]" : "bg-(--theme-input-bg) text-(--theme-text-muted)"}`}>
                                {countFor(f)}
                            </span>
                        </button>
                    ))}
                </div>

                {/* List */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <Loader2 className="w-8 h-8 animate-spin" style={{ color: accent }} />
                        <p className="text-[13px] text-(--theme-text-muted)">Loading applications...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="py-14 text-center rounded-2xl border-2 border-dashed border-(--theme-border)">
                        <p className="text-[14px] font-bold text-(--theme-text-secondary) mb-1">
                            {activeFilter === "All" ? "No applications yet" : `No ${STATUS_LABELS[activeFilter] || activeFilter} applications`}
                        </p>
                        <p className="text-[12px] text-(--theme-text-muted)">
                            {activeFilter === "All" ? "Applications will appear here once talents apply to your jobs." : "Try another filter."}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filtered.map(app => {
                            const talent = app.talentProfile?.user;
                            const skills: any[] = app.talentProfile?.skills || [];
                            const isUpdating = updatingId === app.id;

                            return (
                                <div key={app.id}
                                    className="rounded-2xl border border-(--theme-border) bg-(--theme-card) shadow-sm p-4 sm:p-5 hover:border-[#A855F7]/30 transition-all flex flex-col md:flex-row md:items-center gap-4">

                                    {/* Talent info */}
                                    <div className="flex items-center gap-3 w-full md:w-[240px] shrink-0">
                                        {talent && <Avatar user={talent} />}
                                        <div className="min-w-0 flex-1">
                                            <p className="text-[14px] font-bold text-(--theme-text-primary) truncate">
                                                {talent?.fullName || talent?.username || "Unknown"}
                                            </p>
                                            <p className="text-[10px] text-(--theme-text-muted) truncate">
                                                {app.talentProfile?.experienceLevel
                                                    ? `${app.talentProfile.experienceLevel} Developer`
                                                    : "Developer"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Job info */}
                                    <div className="flex-1 bg-(--theme-input-bg) rounded-xl py-2.5 px-3.5 border border-(--theme-border-light)">
                                        <p className="text-[13px] font-bold text-(--theme-text-secondary) truncate">{app.bounty?.title || "Untitled Job"}</p>
                                        <div className="flex items-center justify-between mt-1">
                                            <p className="text-[10px] text-(--theme-text-muted)">Applied {timeAgo(app.appliedAt)}</p>
                                            {skills.length > 0 && (
                                                <div className="flex gap-1">
                                                    {skills.slice(0, 3).map((s: any) => (
                                                        <span key={s.skillName} className="px-1.5 py-0.5 rounded text-[8px] bg-(--theme-card) text-(--theme-text-tertiary) border border-(--theme-border)">{s.skillName}</span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 shrink-0 mt-2 md:mt-0 pt-3 md:pt-0 border-t md:border-none border-(--theme-border-light)">
                                        {/* GitHub score badge */}
                                        {app.talentProfile?.githubScore > 0 && (
                                            <div className="hidden sm:flex flex-col items-center px-2.5 py-1 rounded-lg text-center"
                                                style={{ background: `${accent}15`, border: `1px solid ${accent}30` }}>
                                                <span className="text-[11px] font-bold" style={{ color: accent }}>
                                                    <Sparkles className="w-3 h-3 inline-block" /> {app.talentProfile.githubScore}
                                                </span>
                                                <span className="text-[8px] tracking-widest" style={{ color: accent }}>GH Score</span>
                                            </div>
                                        )}

                                        {/* Status badge + dropdown */}
                                        <div className="relative" onClick={e => e.stopPropagation()}>
                                            <button
                                                onClick={() => setOpenMenuId(openMenuId === app.id ? null : app.id)}
                                                disabled={isUpdating}
                                                className={`text-[11px] font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${STATUS_STYLES[app.status] || STATUS_STYLES.PENDING}`}>
                                                {isUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : STATUS_LABELS[app.status] || app.status}
                                                <ChevronRight className="w-3 h-3 rotate-90" />
                                            </button>
                                            {openMenuId === app.id && (
                                                <div className="absolute right-0 top-10 w-40 rounded-xl shadow-xl py-1 z-20"
                                                    style={{ background: "var(--theme-surface)", border: "1px solid var(--theme-border)" }}>
                                                    {Object.entries(STATUS_LABELS).map(([val, label]) => (
                                                        <button key={val}
                                                            onClick={() => updateStatus(app.id, val)}
                                                            className={`w-full px-4 py-2 text-left text-[12px] hover:bg-(--theme-input-bg) bg-transparent border-none cursor-pointer transition-colors ${app.status === val ? "font-bold" : ""}`}
                                                            style={{ color: app.status === val ? accent : "var(--theme-text-tertiary)" }}>
                                                            {label}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* View profile */}
                                        {talent?.id && (
                                            <Link href={`/recruiter/talent/${talent.id}`}
                                                className="w-9 h-9 rounded-xl flex items-center justify-center bg-(--theme-input-bg) border border-(--theme-border-light) text-(--theme-text-muted) hover:text-[#A855F7] hover:border-[#A855F7]/40 transition-all no-underline">
                                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
