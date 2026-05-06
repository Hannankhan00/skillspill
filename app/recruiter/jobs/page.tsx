"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { Briefcase, CircleDot, Users, Plus, Search, MoreHorizontal, MapPin, DollarSign, Clock, LayoutGrid, List, X, ChevronDown, Trash2, Edit2, Eye, Loader2 } from "lucide-react";

const accent = "#A855F7";

type BountyStatus = "OPEN" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

interface Job {
    id: string;
    title: string;
    description: string;
    requirements?: string;
    reward?: number | null;
    currency: string;
    status: BountyStatus;
    deadline?: string | null;
    maxApplicants?: number | null;
    isRemote: boolean;
    location?: string | null;
    createdAt: string;
    skills: { skillName: string }[];
    _count: { applications: number };
}

const STATUS_LABELS: Record<BountyStatus, string> = {
    OPEN: "Active",
    IN_PROGRESS: "In Progress",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
};

const STATUS_COLORS: Record<BountyStatus, string> = {
    OPEN: "bg-green-500",
    IN_PROGRESS: "bg-blue-500",
    COMPLETED: "bg-gray-400",
    CANCELLED: "bg-red-400",
};

function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString();
}

function formatReward(reward: number | null | undefined, currency: string) {
    if (!reward) return null;
    return `${currency === "USD" ? "$" : currency}${reward.toLocaleString()}`;
}

/* ─── Post Job Modal ─── */
const blankForm = {
    title: "",
    description: "",
    requirements: "",
    reward: "",
    currency: "USD",
    deadline: "",
    maxApplicants: "",
    isRemote: true,
    location: "",
    skillsRaw: "",
};

function PostJobModal({ onClose, onCreated, editJob }: {
    onClose: () => void;
    onCreated: (job: Job) => void;
    editJob?: Job | null;
}) {
    const [form, setForm] = useState(() => editJob ? {
        title: editJob.title,
        description: editJob.description,
        requirements: editJob.requirements || "",
        reward: editJob.reward ? String(editJob.reward) : "",
        currency: editJob.currency,
        deadline: editJob.deadline ? editJob.deadline.split("T")[0] : "",
        maxApplicants: editJob.maxApplicants ? String(editJob.maxApplicants) : "",
        isRemote: editJob.isRemote,
        location: editJob.location || "",
        skillsRaw: editJob.skills.map(s => s.skillName).join(", "),
    } : { ...blankForm });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const set = (k: string, v: string | number | boolean) => setForm(f => ({ ...f, [k]: v }));

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setError("");
        const skills = form.skillsRaw.split(",").map(s => s.trim()).filter(Boolean);
        const body = {
            title: form.title,
            description: form.description,
            requirements: form.requirements || null,
            reward: form.reward ? Number(form.reward) : null,
            currency: form.currency,
            deadline: form.deadline || null,
            maxApplicants: form.maxApplicants ? Number(form.maxApplicants) : null,
            isRemote: form.isRemote,
            location: form.location || null,
            skills,
        };
        try {
            const url = editJob ? `/api/jobs/${editJob.id}` : "/api/jobs";
            const method = editJob ? "PATCH" : "POST";
            const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
            const data = await res.json();
            if (!res.ok) { setError(data.error || "Something went wrong"); setSaving(false); return; }
            onCreated(data.job);
        } catch {
            setError("Network error");
            setSaving(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
            <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-(--theme-border) shadow-2xl" style={{ background: "var(--theme-card)" }}>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-(--theme-border)">
                    <h2 className="text-[16px] font-bold text-(--theme-text-primary)">{editJob ? "Edit Job" : "Post New Job"}</h2>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-(--theme-bg-secondary) text-(--theme-text-muted) cursor-pointer border-none bg-transparent transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <form onSubmit={submit} className="p-6 space-y-4">
                    {/* Title */}
                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-(--theme-text-muted) mb-1.5">Job Title *</label>
                        <input required value={form.title} onChange={e => set("title", e.target.value)}
                            placeholder="e.g. Senior Frontend Engineer"
                            className="w-full px-3.5 py-2.5 rounded-xl text-[13px] outline-none transition-all border border-(--theme-border) focus:border-secondary/50 focus:ring-2 focus:ring-secondary/10"
                            style={{ background: "var(--theme-input-bg)", color: "var(--theme-text-primary)" }} />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-(--theme-text-muted) mb-1.5">Description *</label>
                        <textarea required value={form.description} onChange={e => set("description", e.target.value)}
                            placeholder="Describe the role, responsibilities, and what you're looking for..."
                            rows={4}
                            className="w-full px-3.5 py-2.5 rounded-xl text-[13px] outline-none resize-none transition-all border border-(--theme-border) focus:border-secondary/50 focus:ring-2 focus:ring-secondary/10"
                            style={{ background: "var(--theme-input-bg)", color: "var(--theme-text-primary)" }} />
                    </div>

                    {/* Requirements */}
                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-(--theme-text-muted) mb-1.5">Requirements</label>
                        <textarea value={form.requirements} onChange={e => set("requirements", e.target.value)}
                            placeholder="List specific qualifications, years of experience, etc."
                            rows={3}
                            className="w-full px-3.5 py-2.5 rounded-xl text-[13px] outline-none resize-none transition-all border border-(--theme-border) focus:border-secondary/50 focus:ring-2 focus:ring-secondary/10"
                            style={{ background: "var(--theme-input-bg)", color: "var(--theme-text-primary)" }} />
                    </div>

                    {/* Skills */}
                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-(--theme-text-muted) mb-1.5">Required Skills</label>
                        <input value={form.skillsRaw} onChange={e => set("skillsRaw", e.target.value)}
                            placeholder="React, TypeScript, Node.js (comma-separated)"
                            className="w-full px-3.5 py-2.5 rounded-xl text-[13px] outline-none transition-all border border-(--theme-border) focus:border-secondary/50 focus:ring-2 focus:ring-secondary/10"
                            style={{ background: "var(--theme-input-bg)", color: "var(--theme-text-primary)" }} />
                    </div>

                    {/* Reward + Currency */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-(--theme-text-muted) mb-1.5">Salary / Reward</label>
                            <input type="number" min="0" value={form.reward} onChange={e => set("reward", e.target.value)}
                                placeholder="e.g. 120000"
                                className="w-full px-3.5 py-2.5 rounded-xl text-[13px] outline-none transition-all border border-(--theme-border) focus:border-secondary/50 focus:ring-2 focus:ring-secondary/10"
                                style={{ background: "var(--theme-input-bg)", color: "var(--theme-text-primary)" }} />
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-(--theme-text-muted) mb-1.5">Currency</label>
                            <div className="relative">
                                <select value={form.currency} onChange={e => set("currency", e.target.value)}
                                    className="w-full appearance-none px-3.5 py-2.5 rounded-xl text-[13px] outline-none cursor-pointer transition-all border border-(--theme-border) focus:border-secondary/50"
                                    style={{ background: "var(--theme-input-bg)", color: "var(--theme-text-primary)" }}>
                                    <option value="USD">USD</option>
                                    <option value="EUR">EUR</option>
                                    <option value="GBP">GBP</option>
                                    <option value="PKR">PKR</option>
                                </select>
                                <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-(--theme-text-muted)" />
                            </div>
                        </div>
                    </div>

                    {/* Deadline + Max Applicants */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-(--theme-text-muted) mb-1.5">Deadline</label>
                            <input type="date" value={form.deadline} onChange={e => set("deadline", e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl text-[13px] outline-none transition-all border border-(--theme-border) focus:border-secondary/50"
                                style={{ background: "var(--theme-input-bg)", color: "var(--theme-text-primary)", colorScheme: "dark" }} />
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-(--theme-text-muted) mb-1.5">Max Applicants</label>
                            <input type="number" min="1" value={form.maxApplicants} onChange={e => set("maxApplicants", e.target.value)}
                                placeholder="Unlimited"
                                className="w-full px-3.5 py-2.5 rounded-xl text-[13px] outline-none transition-all border border-(--theme-border) focus:border-secondary/50"
                                style={{ background: "var(--theme-input-bg)", color: "var(--theme-text-primary)" }} />
                        </div>
                    </div>

                    {/* Remote toggle + Location */}
                    <div>
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <button type="button" onClick={() => set("isRemote", !form.isRemote)}
                                className={`relative w-10 h-5 rounded-full transition-all border-none cursor-pointer shrink-0 ${form.isRemote ? "bg-secondary" : "bg-(--theme-input-bg) border border-(--theme-border)"}`}>
                                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${form.isRemote ? "left-5" : "left-0.5"}`} />
                            </button>
                            <span className="text-[12px] font-medium text-(--theme-text-secondary)">Remote position</span>
                        </label>
                        {!form.isRemote && (
                            <input value={form.location} onChange={e => set("location", e.target.value)}
                                placeholder="City, Country"
                                className="mt-2 w-full px-3.5 py-2.5 rounded-xl text-[13px] outline-none transition-all border border-(--theme-border) focus:border-secondary/50"
                                style={{ background: "var(--theme-input-bg)", color: "var(--theme-text-primary)" }} />
                        )}
                    </div>

                    {error && <p className="text-[12px] text-red-400 bg-red-400/10 rounded-xl px-3 py-2">{error}</p>}

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose}
                            className="flex-1 px-4 py-2.5 rounded-xl text-[12px] font-bold text-(--theme-text-secondary) bg-(--theme-input-bg) hover:bg-(--theme-bg-secondary) border border-(--theme-border) transition-all cursor-pointer">
                            Cancel
                        </button>
                        <button type="submit" disabled={saving}
                            className="flex-1 px-4 py-2.5 rounded-xl text-[12px] font-bold text-white transition-all cursor-pointer border-none flex items-center justify-center gap-2 disabled:opacity-60"
                            style={{ background: `linear-gradient(135deg, ${accent}, #7C3AED)`, boxShadow: saving ? "none" : `0 0 20px ${accent}40` }}>
                            {saving ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving…</> : editJob ? "Save Changes" : "Post Job"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* ─── Applications Drawer ─── */
interface Application {
    id: string;
    status: string;
    coverLetter?: string;
    submissionUrl?: string;
    appliedAt: string;
    talentProfile: {
        user: { fullName: string; avatarUrl?: string; email: string };
        skills: { skillName: string }[];
        bio?: string;
    };
}

const APP_STATUS_COLORS: Record<string, string> = {
    PENDING: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
    REVIEWED: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    SHORTLISTED: "text-purple-400 bg-purple-400/10 border-purple-400/20",
    REJECTED: "text-red-400 bg-red-400/10 border-red-400/20",
    ACCEPTED: "text-green-500 bg-green-500/10 border-green-500/20",
};

function ApplicationsDrawer({ job, onClose }: { job: Job; onClose: () => void }) {
    const [apps, setApps] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    useEffect(() => {
        fetch(`/api/jobs/${job.id}/apply`)
            .then(r => r.json())
            .then(d => { setApps(d.applications || []); setLoading(false); })
            .catch(() => setLoading(false));
    }, [job.id]);

    async function updateStatus(appId: string, status: string) {
        setUpdatingId(appId);
        const res = await fetch(`/api/jobs/${job.id}/applications/${appId}`, {
            method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }),
        });
        if (res.ok) {
            setApps(prev => prev.map(a => a.id === appId ? { ...a, status } : a));
        }
        setUpdatingId(null);
    }

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
            <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-t-2xl sm:rounded-2xl border border-(--theme-border) shadow-2xl" style={{ background: "var(--theme-card)" }}>
                <div className="flex items-center justify-between px-5 py-4 border-b border-(--theme-border) shrink-0">
                    <div>
                        <h2 className="text-[15px] font-bold text-(--theme-text-primary)">{job.title}</h2>
                        <p className="text-[11px] text-(--theme-text-muted) mt-0.5">{apps.length} applicant{apps.length !== 1 ? "s" : ""}</p>
                    </div>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-(--theme-bg-secondary) text-(--theme-text-muted) cursor-pointer border-none bg-transparent">
                        <X className="w-4 h-4" />
                    </button>
                </div>
                <div className="overflow-y-auto flex-1 p-4 space-y-3">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-6 h-6 animate-spin text-secondary" />
                        </div>
                    ) : apps.length === 0 ? (
                        <div className="text-center py-12">
                            <Users className="w-10 h-10 mx-auto mb-3 text-(--theme-text-muted) opacity-40" />
                            <p className="text-[13px] font-semibold text-(--theme-text-secondary)">No applications yet</p>
                            <p className="text-[11px] text-(--theme-text-muted) mt-1">Applicants will appear here once they apply.</p>
                        </div>
                    ) : apps.map(app => (
                        <div key={app.id} className="rounded-xl border border-(--theme-border) p-4 space-y-3" style={{ background: "var(--theme-bg-secondary)" }}>
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <Image loading="lazy" src={app.talentProfile.user.avatarUrl || "/default-avatar.png"} alt={app.talentProfile.user.fullName}
                                        width={36} height={36}
                                        className="w-9 h-9 rounded-full object-cover border border-(--theme-border)" />
                                    <div>
                                        <p className="text-[13px] font-bold text-(--theme-text-primary)">{app.talentProfile.user.fullName}</p>
                                        <p className="text-[11px] text-(--theme-text-muted)">{app.talentProfile.user.email}</p>
                                    </div>
                                </div>
                                <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${APP_STATUS_COLORS[app.status] || ""}`}>{app.status}</span>
                            </div>
                            {app.talentProfile.skills.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                    {app.talentProfile.skills.slice(0, 6).map(s => (
                                        <span key={s.skillName} className="text-[9px] px-2 py-0.5 rounded-full bg-(--theme-input-bg) border border-(--theme-border) text-(--theme-text-muted)">{s.skillName}</span>
                                    ))}
                                </div>
                            )}
                            {app.coverLetter && (
                                <p className="text-[11px] text-(--theme-text-secondary) leading-relaxed line-clamp-3 italic">&ldquo;{app.coverLetter}&rdquo;</p>
                            )}
                            {app.submissionUrl && (
                                <a href={app.submissionUrl} target="_blank" rel="noopener noreferrer" className="text-[11px] text-secondary hover:underline">View submission →</a>
                            )}
                            <div className="flex flex-wrap gap-2 pt-1">
                                {["REVIEWED", "SHORTLISTED", "ACCEPTED", "REJECTED"].map(s => (
                                    <button key={s} disabled={app.status === s || updatingId === app.id}
                                        onClick={() => updateStatus(app.id, s)}
                                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer border transition-all disabled:opacity-50 ${app.status === s ? APP_STATUS_COLORS[s] : "bg-(--theme-input-bg) border-(--theme-border) text-(--theme-text-muted) hover:border-secondary/40 hover:text-secondary"}`}>
                                        {updatingId === app.id ? "…" : s.charAt(0) + s.slice(1).toLowerCase()}
                                    </button>
                                ))}
                            </div>
                            <p className="text-[10px] text-(--theme-text-muted)">Applied {timeAgo(app.appliedAt)}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ─── Main Page ─── */
export default function RecruiterJobsPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const cursorRef = useRef<string | null>(null);
    const sentinelRef = useRef<HTMLDivElement | null>(null);

    const [activeTab, setActiveTab] = useState<string>("All");
    const [viewMode, setViewMode] = useState<"grid" | "list">("list");
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editJob, setEditJob] = useState<Job | null>(null);
    const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
    const [viewAppsJob, setViewAppsJob] = useState<Job | null>(null);
    const [deleting, setDeleting] = useState<string | null>(null);

    const statusFilter = activeTab === "All" ? undefined
        : activeTab === "Active" ? "OPEN"
        : activeTab === "In Progress" ? "IN_PROGRESS"
        : activeTab === "Completed" ? "COMPLETED"
        : "CANCELLED";

    const fetchJobs = useCallback(async (replace = true, cursor?: string) => {
        const params = new URLSearchParams();
        params.set("limit", "20");
        if (statusFilter) params.set("status", statusFilter);
        if (search) params.set("search", search);
        if (cursor) params.set("cursor", cursor);

        if (replace) setLoading(true);
        try {
            const res = await fetch(`/api/jobs?${params}`);
            if (!res.ok) return;
            const data = await res.json();
            setJobs(prev => replace ? data.jobs : [...prev, ...data.jobs]);
            setHasMore(data.hasMore);
            cursorRef.current = data.nextCursor;
        } finally {
            if (replace) setLoading(false);
        }
    }, [statusFilter, search]);

    useEffect(() => {
        cursorRef.current = null;
        fetchJobs(true);
    }, [fetchJobs]);

    const fetchMore = useCallback(async () => {
        if (!hasMore || loadingMore || !cursorRef.current) return;
        setLoadingMore(true);
        await fetchJobs(false, cursorRef.current);
        setLoadingMore(false);
    }, [hasMore, loadingMore, fetchJobs]);

    useEffect(() => {
        const el = sentinelRef.current;
        if (!el) return;
        const obs = new IntersectionObserver(entries => { if (entries[0].isIntersecting) fetchMore(); }, { threshold: 0.1 });
        obs.observe(el);
        return () => obs.disconnect();
    }, [fetchMore]);

    function handleJobCreated(job: Job) {
        if (editJob) {
            setJobs(prev => prev.map(j => j.id === job.id ? job : j));
        } else {
            setJobs(prev => [job, ...prev]);
        }
        setShowModal(false);
        setEditJob(null);
    }

    async function deleteJob(id: string) {
        if (!confirm("Delete this job posting? This cannot be undone.")) return;
        setDeleting(id);
        const res = await fetch(`/api/jobs/${id}`, { method: "DELETE" });
        if (res.ok) setJobs(prev => prev.filter(j => j.id !== id));
        setDeleting(null);
        setMenuOpenId(null);
    }

    async function toggleStatus(job: Job) {
        const newStatus = job.status === "OPEN" ? "CANCELLED" : "OPEN";
        const res = await fetch(`/api/jobs/${job.id}`, {
            method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: newStatus }),
        });
        if (res.ok) {
            const data = await res.json();
            setJobs(prev => prev.map(j => j.id === job.id ? data.job : j));
        }
        setMenuOpenId(null);
    }

    const totalApplicants = jobs.reduce((sum, j) => sum + j._count.applications, 0);
    const activeCount = jobs.filter(j => j.status === "OPEN").length;

    const tabCounts: Record<string, number> = {
        All: jobs.length,
        Active: jobs.filter(j => j.status === "OPEN").length,
        "In Progress": jobs.filter(j => j.status === "IN_PROGRESS").length,
        Completed: jobs.filter(j => j.status === "COMPLETED").length,
        Cancelled: jobs.filter(j => j.status === "CANCELLED").length,
    };

    return (
        <div className="min-h-full" style={{ background: "var(--theme-bg)" }}>
            <div className="max-w-275 mx-auto px-4 sm:px-6 py-4 pb-24 lg:pb-8">

                {/* HEADER */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-(--theme-text-primary)">Jobs</h1>
                        <p className="text-[12px] sm:text-[13px] text-(--theme-text-muted) mt-0.5 sm:mt-1.5">Manage job postings and attract top talent</p>
                    </div>
                    <button onClick={() => { setEditJob(null); setShowModal(true); }}
                        className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-[12px] font-bold text-white transition-all hover:scale-105 border-none cursor-pointer"
                        style={{ background: `linear-gradient(135deg, ${accent}, #7C3AED)`, boxShadow: `0 0 20px ${accent}40` }}>
                        <Plus className="w-4 h-4" />
                        Post New Job
                    </button>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
                    {[
                        { label: "Total Jobs", value: jobs.length, color: "text-[#A855F7]", bg: "bg-[#A855F7]/10", border: "border-[#A855F7]/20", icon: <Briefcase className="w-5 h-5 text-secondary" /> },
                        { label: "Active Postings", value: activeCount, color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/20", icon: <CircleDot className="w-5 h-5 text-green-500" /> },
                        { label: "Total Applicants", value: totalApplicants, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20", icon: <Users className="w-5 h-5 text-blue-500" /> },
                    ].map((stat, i) => (
                        <div key={i} className={`rounded-2xl border ${stat.border} ${stat.bg} p-4 flex flex-col items-center sm:items-start text-center sm:text-left transition-all hover:shadow-md cursor-default`}>
                            <div className="flex items-center justify-between w-full mb-3">
                                <p className="text-[10px] sm:text-[11px] font-semibold text-(--theme-text-muted) uppercase tracking-widest">{stat.label}</p>
                                <div className="hidden sm:block">{stat.icon}</div>
                            </div>
                            <p className={`text-2xl sm:text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* FILTERS & TABS */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-5">
                    <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
                        {["All", "Active", "In Progress", "Completed", "Cancelled"].map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-xl text-[12px] font-bold transition-all border whitespace-nowrap cursor-pointer ${activeTab === tab
                                    ? "bg-secondary text-white border-transparent shadow-md shadow-purple-500/20"
                                    : "bg-(--theme-input-bg) text-(--theme-text-muted) border-(--theme-border) hover:bg-(--theme-bg-secondary) hover:text-(--theme-text-primary)"
                                    }`}>
                                {tab} {tabCounts[tab] > 0 && <span className="ml-1 opacity-70">({tabCounts[tab]})</span>}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                        <div className="flex items-center gap-2 bg-(--theme-input-bg) px-3 py-2 rounded-xl border border-(--theme-border) flex-1 sm:w-50 focus-within:border-secondary/40 transition-all">
                            <Search className="w-4 h-4 text-(--theme-text-muted)" />
                            <input type="text" placeholder="Search jobs…" value={search} onChange={e => setSearch(e.target.value)}
                                className="bg-transparent border-none outline-none text-[12px] w-full text-(--theme-text-primary)" />
                        </div>
                        <div className="flex items-center gap-1 bg-(--theme-input-bg) p-1 rounded-xl border border-(--theme-border)">
                            <button onClick={() => setViewMode("list")} className={`p-1.5 rounded-lg transition-colors cursor-pointer border-none ${viewMode === "list" ? "bg-(--theme-bg) text-(--theme-text-primary) shadow-sm" : "bg-transparent text-(--theme-text-muted) hover:text-(--theme-text-primary)"}`}>
                                <List className="w-4 h-4" />
                            </button>
                            <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded-lg transition-colors cursor-pointer border-none ${viewMode === "grid" ? "bg-(--theme-bg) text-(--theme-text-primary) shadow-sm" : "bg-transparent text-(--theme-text-muted) hover:text-(--theme-text-primary)"}`}>
                                <LayoutGrid className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* JOBS LIST */}
                {loading ? (
                    <div className="flex flex-col gap-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-(--theme-card) border border-(--theme-border) rounded-2xl p-5 animate-pulse">
                                <div className="h-4 w-1/3 bg-(--theme-bg-secondary) rounded mb-3" />
                                <div className="h-3 w-1/2 bg-(--theme-bg-secondary) rounded mb-4" />
                                <div className="flex gap-2"><div className="h-5 w-16 bg-(--theme-bg-secondary) rounded" /><div className="h-5 w-16 bg-(--theme-bg-secondary) rounded" /></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "flex flex-col gap-4"}>
                        {jobs.length === 0 ? (
                            <div className="col-span-full py-16 text-center border-2 border-dashed border-(--theme-border) rounded-2xl bg-(--theme-card)">
                                <Briefcase className="w-12 h-12 text-(--theme-text-muted) mx-auto mb-3 opacity-50" />
                                <p className="text-[14px] font-bold text-(--theme-text-secondary)">No jobs found</p>
                                <p className="text-[12px] text-(--theme-text-muted) mt-1">Post your first job to start attracting talent.</p>
                                <button onClick={() => setShowModal(true)}
                                    className="mt-4 px-5 py-2 rounded-xl text-[12px] font-bold text-white border-none cursor-pointer"
                                    style={{ background: `linear-gradient(135deg, ${accent}, #7C3AED)` }}>
                                    Post a Job
                                </button>
                            </div>
                        ) : jobs.map(job => (
                            <div key={job.id} className={`bg-(--theme-card) border border-(--theme-border) rounded-2xl p-4 sm:p-5 transition-all hover:border-secondary/40 hover:shadow-md group relative overflow-hidden ${viewMode === "grid" ? "flex flex-col" : "flex flex-col sm:flex-row sm:items-center gap-4"}`}>
                                {/* Status stripe */}
                                <div className={`absolute left-0 top-0 ${viewMode === "grid" ? "w-full h-1" : "w-1 h-full"} ${STATUS_COLORS[job.status]}`} />

                                <div className="flex-1 min-w-0 z-10">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="min-w-0 pr-4">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="text-[15px] sm:text-[16px] font-bold text-(--theme-text-primary) truncate group-hover:text-secondary transition-colors">{job.title}</h3>
                                                {job.status === "OPEN" && <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] shrink-0" />}
                                            </div>
                                            <p className="text-[12px] text-(--theme-text-muted)">{STATUS_LABELS[job.status]} &bull; {job.isRemote ? "Remote" : job.location || "On-site"}</p>
                                        </div>
                                        <div className="relative shrink-0">
                                            <button onClick={() => setMenuOpenId(menuOpenId === job.id ? null : job.id)}
                                                className="text-(--theme-text-muted) hover:text-secondary transition-colors bg-transparent border-none cursor-pointer p-1">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </button>
                                            {menuOpenId === job.id && (
                                                <div className="absolute right-0 top-7 z-20 w-44 rounded-xl border border-(--theme-border) shadow-lg overflow-hidden" style={{ background: "var(--theme-card)" }}>
                                                    <button onClick={() => { setEditJob(job); setShowModal(true); setMenuOpenId(null); }}
                                                        className="flex items-center gap-2.5 w-full px-4 py-2.5 text-[12px] text-(--theme-text-secondary) hover:bg-(--theme-bg-secondary) cursor-pointer bg-transparent border-none text-left">
                                                        <Edit2 className="w-3.5 h-3.5" /> Edit Job
                                                    </button>
                                                    <button onClick={() => { setViewAppsJob(job); setMenuOpenId(null); }}
                                                        className="flex items-center gap-2.5 w-full px-4 py-2.5 text-[12px] text-(--theme-text-secondary) hover:bg-(--theme-bg-secondary) cursor-pointer bg-transparent border-none text-left">
                                                        <Eye className="w-3.5 h-3.5" /> View Applicants
                                                    </button>
                                                    <button onClick={() => toggleStatus(job)}
                                                        className="flex items-center gap-2.5 w-full px-4 py-2.5 text-[12px] text-(--theme-text-secondary) hover:bg-(--theme-bg-secondary) cursor-pointer bg-transparent border-none text-left">
                                                        <CircleDot className="w-3.5 h-3.5" /> {job.status === "OPEN" ? "Close Job" : "Reopen"}
                                                    </button>
                                                    <button onClick={() => deleteJob(job.id)} disabled={deleting === job.id}
                                                        className="flex items-center gap-2.5 w-full px-4 py-2.5 text-[12px] text-red-400 hover:bg-red-400/10 cursor-pointer bg-transparent border-none text-left disabled:opacity-50">
                                                        <Trash2 className="w-3.5 h-3.5" /> Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-medium text-(--theme-text-tertiary) mt-3">
                                        <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-secondary" /> {job.isRemote ? "Remote" : job.location || "On-site"}</span>
                                        {formatReward(job.reward, job.currency) && (
                                            <span className="flex items-center gap-1.5 text-green-600 dark:text-green-500"><DollarSign className="w-3.5 h-3.5" /> {formatReward(job.reward, job.currency)}</span>
                                        )}
                                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-(--theme-text-muted)" /> {timeAgo(job.createdAt)}</span>
                                        {job.deadline && <span className="text-orange-500">Closes {new Date(job.deadline).toLocaleDateString()}</span>}
                                    </div>

                                    {job.skills.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mt-4">
                                            {job.skills.map(s => (
                                                <span key={s.skillName} className="text-[10px] px-2 py-1 rounded-md bg-(--theme-input-bg) text-(--theme-text-secondary) border border-(--theme-border) hover:bg-secondary/10 hover:text-secondary hover:border-secondary/30 transition-colors cursor-default">
                                                    {s.skillName}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className={`flex items-center gap-4 mt-4 sm:mt-0 z-10 ${viewMode === "grid" ? "pt-4 border-t border-(--theme-border-light) justify-between" : "pl-0 sm:pl-4 sm:border-l border-(--theme-border-light)"}`}>
                                    <div className="text-center sm:text-right">
                                        <p className="text-[18px] font-bold text-(--theme-text-primary)">{job._count.applications}</p>
                                        <p className="text-[10px] text-(--theme-text-muted) uppercase tracking-wider mt-0.5">Applicants</p>
                                    </div>
                                    <button onClick={() => setViewAppsJob(job)}
                                        className="px-4 py-2 rounded-xl text-[11px] font-bold text-secondary bg-secondary/10 transition-all hover:bg-purple-600 hover:text-white cursor-pointer border border-secondary/20 hover:border-purple-600 whitespace-nowrap">
                                        View
                                    </button>
                                </div>
                            </div>
                        ))}

                        {/* Sentinel */}
                        <div ref={sentinelRef} className="col-span-full py-4 flex justify-center">
                            {loadingMore && <Loader2 className="w-5 h-5 animate-spin text-secondary" />}
                            {!hasMore && jobs.length > 0 && <p className="text-[11px] text-(--theme-text-muted)">All jobs loaded</p>}
                        </div>
                    </div>
                )}
            </div>

            {/* Click outside to close menu */}
            {menuOpenId && <div className="fixed inset-0 z-10" onClick={() => setMenuOpenId(null)} />}

            {/* Post / Edit Modal */}
            {showModal && (
                <PostJobModal
                    onClose={() => { setShowModal(false); setEditJob(null); }}
                    onCreated={handleJobCreated}
                    editJob={editJob}
                />
            )}

            {/* Applications Drawer */}
            {viewAppsJob && <ApplicationsDrawer job={viewAppsJob} onClose={() => setViewAppsJob(null)} />}
        </div>
    );
}
