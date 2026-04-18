"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, MapPin, Building2, Wifi, Users, Clock, DollarSign, Calendar, CheckCircle2, Loader2, ExternalLink, Send } from "lucide-react";

const accent = "#3CF91A";

interface Job {
    id: string;
    title: string;
    description: string;
    requirements?: string | null;
    reward?: number | null;
    currency: string;
    status: string;
    deadline?: string | null;
    maxApplicants?: number | null;
    isRemote: boolean;
    location?: string | null;
    createdAt: string;
    skills: { skillName: string }[];
    _count: { applications: number };
    hasApplied: boolean;
    applicationStatus?: string | null;
    recruiterProfile: {
        companyName: string;
        companyWebsite?: string | null;
        companySize?: string | null;
        city?: string | null;
        country?: string | null;
        bio?: string | null;
        user: { avatarUrl?: string | null; fullName: string };
    };
}

function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatReward(reward: number | null | undefined, currency: string) {
    if (!reward) return null;
    const sym = currency === "USD" ? "$" : currency === "EUR" ? "€" : currency === "GBP" ? "£" : `${currency} `;
    if (reward >= 1000) return `${sym}${(reward / 1000).toFixed(reward % 1000 === 0 ? 0 : 1)}k / yr`;
    return `${sym}${reward.toLocaleString()}`;
}

function CompanyAvatar({ name, avatarUrl, size = "lg" }: { name: string; avatarUrl?: string | null; size?: "sm" | "lg" }) {
    const dim = size === "lg" ? "w-16 h-16" : "w-10 h-10";
    const textSize = size === "lg" ? "text-[18px]" : "text-[12px]";
    if (avatarUrl) return <img loading="lazy" src={avatarUrl} alt={name} className={`${dim} rounded-2xl object-cover border border-(--theme-border)`} />;
    const initials = name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
    const hue = name.charCodeAt(0) * 37 % 360;
    return (
        <div className={`${dim} rounded-2xl flex items-center justify-center font-black shrink-0 border ${textSize}`}
            style={{ background: `hsl(${hue},50%,12%)`, color: `hsl(${hue},70%,60%)`, borderColor: `hsl(${hue},50%,22%)` }}>
            {initials}
        </div>
    );
}

const APP_STATUS_META: Record<string, { label: string; color: string; bg: string }> = {
    PENDING: { label: "Application Pending", color: "#F59E0B", bg: "#F59E0B15" },
    REVIEWED: { label: "Under Review", color: "#3B82F6", bg: "#3B82F615" },
    SHORTLISTED: { label: "Shortlisted", color: "#A855F7", bg: "#A855F715" },
    ACCEPTED: { label: "Accepted!", color: "#3CF91A", bg: "#3CF91A15" },
    REJECTED: { label: "Not Selected", color: "#EF4444", bg: "#EF444415" },
};

/* ─── Apply Modal ─── */
function ApplyModal({ jobId, jobTitle, onClose, onApplied }: {
    jobId: string;
    jobTitle: string;
    onClose: () => void;
    onApplied: (status: string) => void;
}) {
    const [coverLetter, setCoverLetter] = useState("");
    const [submissionUrl, setSubmissionUrl] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);
        setError("");
        try {
            const res = await fetch(`/api/jobs/${jobId}/apply`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ coverLetter: coverLetter.trim() || null, submissionUrl: submissionUrl.trim() || null }),
            });
            const data = await res.json();
            if (!res.ok) { setError(data.error || "Failed to submit application"); setSubmitting(false); return; }
            onApplied("PENDING");
        } catch {
            setError("Network error. Please try again.");
            setSubmitting(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}>
            <div className="w-full max-w-lg rounded-2xl border border-(--theme-border) shadow-2xl overflow-hidden" style={{ background: "var(--theme-card)" }}>
                <div className="px-6 py-5 border-b border-(--theme-border)">
                    <h2 className="text-[16px] font-bold text-(--theme-text-primary)">Apply for this role</h2>
                    <p className="text-[12px] text-(--theme-text-muted) mt-1 truncate">{jobTitle}</p>
                </div>
                <form onSubmit={submit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-(--theme-text-muted) mb-1.5">Cover Letter</label>
                        <textarea value={coverLetter} onChange={e => setCoverLetter(e.target.value)}
                            placeholder="Tell them why you're the right fit for this role…"
                            rows={5}
                            className="w-full px-3.5 py-2.5 rounded-xl text-[13px] outline-none resize-none transition-all border border-(--theme-border)"
                            style={{ background: "var(--theme-input-bg)", color: "var(--theme-text-primary)" }} />
                    </div>
                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-(--theme-text-muted) mb-1.5">Portfolio / Submission URL <span className="normal-case text-[10px] opacity-60">(optional)</span></label>
                        <input type="url" value={submissionUrl} onChange={e => setSubmissionUrl(e.target.value)}
                            placeholder="https://github.com/you/project"
                            className="w-full px-3.5 py-2.5 rounded-xl text-[13px] outline-none transition-all border border-(--theme-border)"
                            style={{ background: "var(--theme-input-bg)", color: "var(--theme-text-primary)" }} />
                    </div>
                    {error && <p className="text-[12px] text-red-400 bg-red-400/10 rounded-xl px-3 py-2">{error}</p>}
                    <div className="flex gap-3 pt-1">
                        <button type="button" onClick={onClose}
                            className="flex-1 px-4 py-2.5 rounded-xl text-[12px] font-bold text-(--theme-text-secondary) bg-(--theme-input-bg) hover:bg-(--theme-bg-secondary) border border-(--theme-border) transition-all cursor-pointer">
                            Cancel
                        </button>
                        <button type="submit" disabled={submitting}
                            className="flex-1 px-4 py-2.5 rounded-xl text-[12px] font-bold text-black transition-all cursor-pointer border-none flex items-center justify-center gap-2 disabled:opacity-60"
                            style={{ background: submitting ? "#3CF91A80" : accent, boxShadow: submitting ? "none" : `0 0 20px ${accent}40` }}>
                            {submitting ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Submitting…</> : <><Send className="w-3.5 h-3.5" /> Submit Application</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* ─── Main Page ─── */
export default function TalentJobDetailPage() {
    const { id } = useParams<{ id: string }>();
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [showApply, setShowApply] = useState(false);
    const [hasApplied, setHasApplied] = useState(false);
    const [appStatus, setAppStatus] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        fetch(`/api/jobs/${id}`)
            .then(r => r.json())
            .then(d => {
                if (d.error) { setNotFound(true); setLoading(false); return; }
                setJob(d.job);
                setHasApplied(d.job.hasApplied);
                setAppStatus(d.job.applicationStatus ?? null);
                setLoading(false);
            })
            .catch(() => { setNotFound(true); setLoading(false); });
    }, [id]);

    function handleApplied(status: string) {
        setHasApplied(true);
        setAppStatus(status);
        setShowApply(false);
    }

    if (loading) {
        return (
            <div style={{ background: "var(--theme-bg)" }} className="min-h-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (notFound || !job) {
        return (
            <div style={{ background: "var(--theme-bg)" }} className="min-h-full flex flex-col items-center justify-center gap-4 p-8">
                <p className="text-[16px] font-bold text-(--theme-text-secondary)">Job not found</p>
                <Link href="/talent/jobs" className="text-[13px] text-primary hover:underline flex items-center gap-1">
                    <ArrowLeft className="w-4 h-4" /> Back to jobs
                </Link>
            </div>
        );
    }

    const statusMeta = hasApplied && appStatus ? APP_STATUS_META[appStatus] : null;
    const isClosed = job.status !== "OPEN";

    return (
        <div style={{ background: "var(--theme-bg)" }} className="min-h-full">
            <div className="max-w-275 mx-auto px-4 sm:px-6 py-5 pb-24 lg:pb-8">

                {/* Back */}
                <Link href="/talent/jobs"
                    className="inline-flex items-center gap-1.5 text-[12px] font-medium text-(--theme-text-muted) hover:text-primary transition-colors mb-5 no-underline">
                    <ArrowLeft className="w-4 h-4" /> Back to jobs
                </Link>

                <div className="flex flex-col lg:flex-row gap-6">

                    {/* ════════ MAIN ════════ */}
                    <div className="flex-1 min-w-0 space-y-5">

                        {/* Job header card */}
                        <div className="rounded-2xl border border-(--theme-border) bg-(--theme-card) p-5 sm:p-6">
                            <div className="flex items-start gap-4">
                                <CompanyAvatar name={job.recruiterProfile.companyName} avatarUrl={job.recruiterProfile.user.avatarUrl} size="lg" />
                                <div className="flex-1 min-w-0">
                                    <h1 className="text-[20px] sm:text-[22px] font-bold text-(--theme-text-primary) leading-snug"
                                        style={{ fontFamily: "var(--font-space-grotesk)" }}>
                                        {job.title}
                                    </h1>
                                    <p className="text-[13px] text-(--theme-text-muted) mt-1">
                                        {job.recruiterProfile.companyName}
                                        {job.recruiterProfile.companySize && <> &bull; {job.recruiterProfile.companySize}</>}
                                    </p>

                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-[12px] text-(--theme-text-muted)">
                                        <span className="flex items-center gap-1.5">
                                            {job.isRemote ? <Wifi className="w-3.5 h-3.5 text-primary" /> : <Building2 className="w-3.5 h-3.5" />}
                                            {job.isRemote ? "Remote" : job.location || "On-site"}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Users className="w-3.5 h-3.5" />
                                            {job._count.applications} applicant{job._count.applications !== 1 ? "s" : ""}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5" />
                                            Posted {timeAgo(job.createdAt)}
                                        </span>
                                        {job.reward && (
                                            <span className="flex items-center gap-1.5 text-green-500 font-semibold">
                                                <DollarSign className="w-3.5 h-3.5" />
                                                {formatReward(job.reward, job.currency)}
                                            </span>
                                        )}
                                        {job.deadline && (
                                            <span className="flex items-center gap-1.5 text-orange-500">
                                                <Calendar className="w-3.5 h-3.5" />
                                                Closes {new Date(job.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                            </span>
                                        )}
                                    </div>

                                    {job.skills.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mt-4">
                                            {job.skills.map(s => (
                                                <span key={s.skillName}
                                                    className="text-[10px] px-2.5 py-1 rounded-full font-semibold"
                                                    style={{
                                                        fontFamily: "var(--font-jetbrains-mono)",
                                                        background: "var(--theme-bg-secondary)",
                                                        color: "var(--theme-text-muted)",
                                                        border: "1px solid var(--theme-border)",
                                                    }}>
                                                    {s.skillName}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Status banner / CTA */}
                            {isClosed ? (
                                <div className="mt-5 px-4 py-3 rounded-xl text-[13px] font-medium text-center text-(--theme-text-muted) border border-(--theme-border)"
                                    style={{ background: "var(--theme-bg-secondary)" }}>
                                    This position is no longer accepting applications
                                </div>
                            ) : statusMeta ? (
                                <div className="mt-5 px-4 py-3 rounded-xl border flex items-center justify-center gap-2"
                                    style={{ background: statusMeta.bg, borderColor: `${statusMeta.color}30`, color: statusMeta.color }}>
                                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                                    <span className="text-[13px] font-bold">{statusMeta.label}</span>
                                </div>
                            ) : (
                                <button onClick={() => setShowApply(true)}
                                    className="mt-5 w-full py-3 rounded-xl text-[14px] font-bold text-black border-none cursor-pointer transition-all hover:scale-[1.01] flex items-center justify-center gap-2"
                                    style={{ background: accent, boxShadow: `0 0 24px ${accent}40` }}>
                                    <Send className="w-4 h-4" />
                                    Apply Now
                                </button>
                            )}
                        </div>

                        {/* Description */}
                        <div className="rounded-2xl border border-(--theme-border) bg-(--theme-card) p-5 sm:p-6">
                            <h2 className="text-[14px] font-bold text-(--theme-text-primary) mb-4 pb-3 border-b border-(--theme-border)"
                                style={{ fontFamily: "var(--font-space-grotesk)" }}>
                                About the Role
                            </h2>
                            <div className="text-[13px] text-(--theme-text-secondary) leading-relaxed whitespace-pre-wrap">
                                {job.description}
                            </div>
                        </div>

                        {/* Requirements */}
                        {job.requirements && (
                            <div className="rounded-2xl border border-(--theme-border) bg-(--theme-card) p-5 sm:p-6">
                                <h2 className="text-[14px] font-bold text-(--theme-text-primary) mb-4 pb-3 border-b border-(--theme-border)"
                                    style={{ fontFamily: "var(--font-space-grotesk)" }}>
                                    Requirements
                                </h2>
                                <div className="text-[13px] text-(--theme-text-secondary) leading-relaxed whitespace-pre-wrap">
                                    {job.requirements}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ════════ SIDEBAR ════════ */}
                    <div className="w-full lg:w-72 shrink-0 space-y-4">

                        {/* Quick apply (desktop) */}
                        {!isClosed && !hasApplied && (
                            <button onClick={() => setShowApply(true)}
                                className="hidden lg:flex w-full py-3 rounded-2xl text-[13px] font-bold text-black border-none cursor-pointer transition-all hover:scale-[1.02] items-center justify-center gap-2"
                                style={{ background: accent, boxShadow: `0 0 24px ${accent}40` }}>
                                <Send className="w-4 h-4" />
                                Apply Now
                            </button>
                        )}
                        {hasApplied && statusMeta && (
                            <div className="hidden lg:flex items-center justify-center gap-2 w-full py-3 rounded-2xl border text-[13px] font-bold"
                                style={{ background: statusMeta.bg, borderColor: `${statusMeta.color}30`, color: statusMeta.color }}>
                                <CheckCircle2 className="w-4 h-4" />
                                {statusMeta.label}
                            </div>
                        )}

                        {/* Job details */}
                        <div className="rounded-2xl border border-(--theme-border) bg-(--theme-card) overflow-hidden">
                            <div className="px-4 py-3 border-b border-(--theme-border-light)">
                                <h3 className="text-[11px] font-bold uppercase tracking-[2px] text-(--theme-text-muted)"
                                    style={{ fontFamily: "var(--font-jetbrains-mono)" }}>
                                    Job Details
                                </h3>
                            </div>
                            <div className="divide-y divide-(--theme-border-light)">
                                {[
                                    { icon: <MapPin className="w-3.5 h-3.5" />, label: "Location", value: job.isRemote ? "Remote" : job.location || "On-site" },
                                    { icon: <DollarSign className="w-3.5 h-3.5" />, label: "Compensation", value: formatReward(job.reward, job.currency) || "Not specified" },
                                    { icon: <Users className="w-3.5 h-3.5" />, label: "Applicants", value: String(job._count.applications) },
                                    ...(job.maxApplicants ? [{ icon: <Users className="w-3.5 h-3.5" />, label: "Max Applicants", value: String(job.maxApplicants) }] : []),
                                    { icon: <Calendar className="w-3.5 h-3.5" />, label: "Posted", value: timeAgo(job.createdAt) },
                                    ...(job.deadline ? [{ icon: <Calendar className="w-3.5 h-3.5" />, label: "Deadline", value: new Date(job.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) }] : []),
                                ].map(row => (
                                    <div key={row.label} className="flex items-center justify-between px-4 py-2.5 gap-3">
                                        <div className="flex items-center gap-2 text-(--theme-text-muted) shrink-0">
                                            {row.icon}
                                            <span className="text-[11px]">{row.label}</span>
                                        </div>
                                        <span className="text-[12px] font-semibold text-(--theme-text-primary) text-right">{row.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Company card */}
                        <div className="rounded-2xl border border-(--theme-border) bg-(--theme-card) overflow-hidden">
                            <div className="px-4 py-3 border-b border-(--theme-border-light)">
                                <h3 className="text-[11px] font-bold uppercase tracking-[2px] text-(--theme-text-muted)"
                                    style={{ fontFamily: "var(--font-jetbrains-mono)" }}>
                                    About the Company
                                </h3>
                            </div>
                            <div className="p-4 space-y-3">
                                <div className="flex items-center gap-3">
                                    <CompanyAvatar name={job.recruiterProfile.companyName} avatarUrl={job.recruiterProfile.user.avatarUrl} size="sm" />
                                    <div>
                                        <p className="text-[13px] font-bold text-(--theme-text-primary)">{job.recruiterProfile.companyName}</p>
                                        {(job.recruiterProfile.city || job.recruiterProfile.country) && (
                                            <p className="text-[11px] text-(--theme-text-muted)">
                                                {[job.recruiterProfile.city, job.recruiterProfile.country].filter(Boolean).join(", ")}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                {job.recruiterProfile.bio && (
                                    <p className="text-[12px] text-(--theme-text-secondary) leading-relaxed line-clamp-4">
                                        {job.recruiterProfile.bio}
                                    </p>
                                )}
                                {job.recruiterProfile.companyWebsite && (
                                    <a href={job.recruiterProfile.companyWebsite} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 text-[12px] text-primary hover:underline no-underline">
                                        <ExternalLink className="w-3.5 h-3.5" />
                                        Visit website
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showApply && (
                <ApplyModal
                    jobId={job.id}
                    jobTitle={job.title}
                    onClose={() => setShowApply(false)}
                    onApplied={handleApplied}
                />
            )}
        </div>
    );
}
