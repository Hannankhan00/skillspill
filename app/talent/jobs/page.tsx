"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { Search, Filter, Loader2, Clock, Wifi, Building2 } from "lucide-react";

const accent = "#3CF91A";

interface Job {
    id: string;
    title: string;
    description: string;
    reward?: number | null;
    currency: string;
    status: string;
    deadline?: string | null;
    isRemote: boolean;
    location?: string | null;
    createdAt: string;
    skills: { skillName: string }[];
    _count: { applications: number };
    hasApplied: boolean;
    recruiterProfile: {
        companyName: string;
        companySize?: string | null;
        user: { avatarUrl?: string | null; fullName: string };
    };
}

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
    const sym = currency === "USD" ? "$" : currency === "EUR" ? "€" : currency === "GBP" ? "£" : currency + " ";
    if (reward >= 1000) return `${sym}${(reward / 1000).toFixed(reward % 1000 === 0 ? 0 : 1)}k`;
    return `${sym}${reward.toLocaleString()}`;
}

/* Icon helpers */
function GridIcon({ active }: { active: boolean }) {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? accent : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
        </svg>
    );
}

function ListIcon({ active }: { active: boolean }) {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? accent : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
    );
}

function JobSkeleton() {
    return (
        <div className="rounded-2xl border border-(--theme-border) bg-(--theme-card) p-5 animate-pulse">
            <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-(--theme-bg-secondary) shrink-0" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 w-2/3 bg-(--theme-bg-secondary) rounded" />
                    <div className="h-3 w-1/3 bg-(--theme-bg-secondary) rounded" />
                    <div className="flex gap-2 mt-3">
                        <div className="h-5 w-16 bg-(--theme-bg-secondary) rounded-full" />
                        <div className="h-5 w-16 bg-(--theme-bg-secondary) rounded-full" />
                    </div>
                </div>
                <div className="h-5 w-16 bg-(--theme-bg-secondary) rounded" />
            </div>
        </div>
    );
}

function CompanyAvatar({ name, avatarUrl }: { name: string; avatarUrl?: string | null }) {
    if (avatarUrl) return <img loading="lazy" src={avatarUrl} alt={name} className="w-11 h-11 rounded-xl object-cover border border-(--theme-border)" />;
    const initials = name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
    const hue = name.charCodeAt(0) * 37 % 360;
    return (
        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-[12px] font-black shrink-0 border"
            style={{ background: `hsl(${hue},50%,15%)`, color: `hsl(${hue},70%,60%)`, borderColor: `hsl(${hue},50%,25%)` }}>
            {initials}
        </div>
    );
}

/* Sidebar filter section */
function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="pt-4 first:pt-0" style={{ borderTop: "1px solid var(--theme-border-light)" }}>
            <h3 className="text-[11px] font-bold mb-2.5 text-(--theme-text-secondary)"
                style={{ fontFamily: "var(--font-space-grotesk)" }}>{title}</h3>
            {children}
        </div>
    );
}

function Checkbox({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
    return (
        <button onClick={onChange} className="flex items-center gap-2.5 w-full text-left bg-transparent border-none cursor-pointer py-1">
            <span className={`w-4 h-4 rounded flex items-center justify-center shrink-0 transition-all ${checked ? "bg-primary" : ""}`}
                style={{ border: checked ? "none" : "1.5px solid var(--theme-border)" }}>
                {checked && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
            </span>
            <span className="text-[12px] transition-colors" style={{ color: checked ? "var(--theme-text-secondary)" : "var(--theme-text-muted)" }}>{label}</span>
        </button>
    );
}

/* ─── Main Page ─── */
export default function TalentJobsPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const cursorRef = useRef<string | null>(null);
    const sentinelRef = useRef<HTMLDivElement | null>(null);

    const [search, setSearch] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("list");
    const [remoteOnly, setRemoteOnly] = useState(false);
    const [onsiteOnly, setOnsiteOnly] = useState(false);
    const [maxSalary, setMaxSalary] = useState(300);
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [allSkills, setAllSkills] = useState<string[]>([]);
    const [filtersOpen, setFiltersOpen] = useState(false);

    const remoteParam = remoteOnly ? "true" : onsiteOnly ? "false" : undefined;

    const fetchJobs = useCallback(async (replace = true, cursor?: string) => {
        if (replace) setLoading(true);
        const params = new URLSearchParams();
        params.set("limit", "20");
        if (search) params.set("search", search);
        if (remoteParam) params.set("remote", remoteParam);
        if (selectedSkills.length > 0) params.set("skills", selectedSkills.join(","));
        if (cursor) params.set("cursor", cursor);

        const res = await fetch(`/api/jobs?${params}`);
        if (!res.ok) { if (replace) setLoading(false); return; }
        const data = await res.json();

        setJobs(prev => {
            const next = replace ? data.jobs : [...prev, ...data.jobs];
            const skills = new Set<string>();
            next.forEach((j: Job) => j.skills.forEach(s => skills.add(s.skillName)));
            setAllSkills(Array.from(skills).slice(0, 20));
            return next;
        });
        setHasMore(data.hasMore);
        cursorRef.current = data.nextCursor;
        if (replace) setLoading(false);
    }, [search, remoteParam, selectedSkills]);

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

    // Client-side salary filter (reward is annual in $)
    const filtered = jobs.filter(j => !j.reward || j.reward / 1000 <= maxSalary);

    function toggleSkill(s: string) {
        setSelectedSkills(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
    }

    return (
        <div style={{ background: "var(--theme-bg)" }} className="min-h-full">
            <div className="max-w-275 mx-auto px-4 sm:px-6 py-5 pb-24 lg:pb-8">
                <div className="flex flex-col lg:flex-row gap-6">

                    {/* ════════ MAIN CONTENT ════════ */}
                    <div className="flex-1 min-w-0 space-y-4">

                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-baseline gap-3">
                                <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-(--theme-text-primary)"
                                    style={{ fontFamily: "var(--font-space-grotesk)" }}>
                                    Job Opportunities
                                </h1>
                                <span className="text-[12px] text-(--theme-text-muted)" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>
                                    ({filtered.length} found)
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                {/* Mobile filter toggle */}
                                <button onClick={() => setFiltersOpen(f => !f)}
                                    className="flex lg:hidden items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold border cursor-pointer bg-transparent transition-colors"
                                    style={{ borderColor: "var(--theme-border)", color: "var(--theme-text-muted)" }}>
                                    <Filter className="w-3.5 h-3.5" /> Filters
                                </button>
                                <div className="flex items-center gap-1 p-1 rounded-lg border border-(--theme-border)" style={{ background: "var(--theme-input-bg)" }}>
                                    <button onClick={() => setViewMode("grid")}
                                        className="p-1.5 rounded-md transition-all cursor-pointer border-none"
                                        style={{ background: viewMode === "grid" ? "var(--theme-bg-secondary)" : "transparent" }}>
                                        <GridIcon active={viewMode === "grid"} />
                                    </button>
                                    <button onClick={() => setViewMode("list")}
                                        className="p-1.5 rounded-md transition-all cursor-pointer border-none"
                                        style={{ background: viewMode === "list" ? "var(--theme-bg-secondary)" : "transparent" }}>
                                        <ListIcon active={viewMode === "list"} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Search bar */}
                        <div className="rounded-2xl border border-(--theme-border) bg-(--theme-card) shadow-sm p-4">
                            <div className="relative">
                                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-(--theme-text-muted)" />
                                <input type="text" placeholder="Search jobs, skills, or companies…"
                                    value={search} onChange={e => setSearch(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 rounded-xl text-[13px] outline-none transition-all"
                                    style={{
                                        fontFamily: "var(--font-space-grotesk)",
                                        background: "var(--theme-bg-secondary)",
                                        border: "1px solid var(--theme-border)",
                                        color: "var(--theme-text-primary)",
                                    }} />
                            </div>
                        </div>

                        {/* Mobile filters panel */}
                        {filtersOpen && (
                            <div className="lg:hidden rounded-2xl border border-(--theme-border) bg-(--theme-card) p-4 space-y-4">
                                <FilterSection title="Remote Status">
                                    <Checkbox checked={remoteOnly} onChange={() => { setRemoteOnly(v => !v); if (!remoteOnly) setOnsiteOnly(false); }} label="Remote Only" />
                                    <Checkbox checked={onsiteOnly} onChange={() => { setOnsiteOnly(v => !v); if (!onsiteOnly) setRemoteOnly(false); }} label="On-site Only" />
                                </FilterSection>
                                {allSkills.length > 0 && (
                                    <FilterSection title="Skills">
                                        <div className="flex flex-wrap gap-1.5">
                                            {allSkills.map(s => (
                                                <button key={s} onClick={() => toggleSkill(s)}
                                                    className="px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer border-none"
                                                    style={{
                                                        fontFamily: "var(--font-jetbrains-mono)",
                                                        background: selectedSkills.includes(s) ? accent : "var(--theme-bg-secondary)",
                                                        color: selectedSkills.includes(s) ? "#000" : "var(--theme-text-muted)",
                                                    }}>
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    </FilterSection>
                                )}
                            </div>
                        )}

                        {/* Job cards */}
                        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "flex flex-col gap-3"}>
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => <JobSkeleton key={i} />)
                            ) : filtered.length === 0 ? (
                                <div className="rounded-2xl border border-(--theme-border) bg-(--theme-card) p-12 text-center">
                                    <p className="text-[14px] font-semibold mb-1 text-(--theme-text-secondary)">No jobs found</p>
                                    <p className="text-[12px] text-(--theme-text-muted)">Try adjusting your filters or search query</p>
                                </div>
                            ) : filtered.map(job => (
                                <Link key={job.id} href={`/talent/jobs/${job.id}`} className="block no-underline">
                                    <article className="rounded-2xl border border-(--theme-border) bg-(--theme-card) shadow-sm hover:border-primary/30 hover:shadow-md transition-all duration-300 group cursor-pointer overflow-hidden">
                                        <div className={`flex items-start justify-between px-5 py-4 ${viewMode === "list" ? "flex-row" : "flex-col gap-3"}`}>
                                            <div className="flex items-start gap-4 flex-1 min-w-0">
                                                <CompanyAvatar name={job.recruiterProfile.companyName} avatarUrl={job.recruiterProfile.user.avatarUrl} />
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="text-[14px] font-bold truncate text-(--theme-text-primary) group-hover:text-primary transition-colors"
                                                            style={{ fontFamily: "var(--font-space-grotesk)" }}>
                                                            {job.title}
                                                        </h3>
                                                        {job.hasApplied && (
                                                            <span className="shrink-0 text-[9px] px-2 py-0.5 rounded-full font-bold"
                                                                style={{ background: "#3CF91A20", color: accent, border: "1px solid #3CF91A30" }}>
                                                                Applied
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-[11px] mt-0.5 text-(--theme-text-muted)">
                                                        {job.recruiterProfile.companyName}
                                                        {job.recruiterProfile.companySize && <> &bull; {job.recruiterProfile.companySize}</>}
                                                    </p>
                                                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                                                        <span className="flex items-center gap-1 text-[10px] text-(--theme-text-muted)">
                                                            {job.isRemote ? <Wifi className="w-3 h-3 text-primary" /> : <Building2 className="w-3 h-3" />}
                                                            {job.isRemote ? "Remote" : job.location || "On-site"}
                                                        </span>
                                                        <span className="flex items-center gap-1 text-[10px] text-(--theme-text-muted)">
                                                            <Clock className="w-3 h-3" />
                                                            {timeAgo(job.createdAt)}
                                                        </span>
                                                        <span className="text-[10px] text-(--theme-text-muted)">
                                                            {job._count.applications} applicant{job._count.applications !== 1 ? "s" : ""}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
                                                        {job.skills.slice(0, 5).map(s => (
                                                            <span key={s.skillName} className="text-[9px] px-2 py-0.75 rounded-full font-semibold"
                                                                style={{
                                                                    fontFamily: "var(--font-jetbrains-mono)",
                                                                    background: "var(--theme-bg-secondary)",
                                                                    color: "var(--theme-text-muted)",
                                                                    border: "1px solid var(--theme-border)",
                                                                }}>
                                                                {s.skillName}
                                                            </span>
                                                        ))}
                                                        {job.skills.length > 5 && (
                                                            <span className="text-[9px] text-(--theme-text-muted)">+{job.skills.length - 5}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`shrink-0 ${viewMode === "list" ? "text-right ml-4 flex flex-col items-end gap-2" : "w-full flex justify-between items-center"}`}>
                                                {formatReward(job.reward, job.currency) && (
                                                    <span className="text-[14px] font-bold text-primary whitespace-nowrap"
                                                        style={{ fontFamily: "var(--font-jetbrains-mono)" }}>
                                                        {formatReward(job.reward, job.currency)}
                                                    </span>
                                                )}
                                                {job.deadline && (
                                                    <span className="text-[10px] text-orange-500 flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        Closes {new Date(job.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </article>
                                </Link>
                            ))}
                        </div>

                        {/* Infinite scroll sentinel */}
                        <div ref={sentinelRef} className="flex justify-center py-4">
                            {loadingMore && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
                            {!loading && !hasMore && filtered.length > 0 && (
                                <p className="text-[11px] text-(--theme-text-muted)">You&apos;ve seen all open jobs</p>
                            )}
                        </div>
                    </div>

                    {/* ════════ RIGHT SIDEBAR: Filters (desktop) ════════ */}
                    <div className="hidden lg:block w-70 shrink-0 space-y-4">

                        {/* Filters card */}
                        <div className="rounded-2xl border border-(--theme-border) bg-(--theme-card) shadow-sm overflow-hidden">
                            <div className="flex items-center gap-2 px-4 py-3 border-b border-(--theme-border-light)" style={{ color: "var(--theme-text-muted)" }}>
                                <Filter className="w-3.5 h-3.5" />
                                <h2 className="text-[11px] font-bold uppercase tracking-[2px] text-(--theme-text-muted)"
                                    style={{ fontFamily: "var(--font-jetbrains-mono)" }}>
                                    Filters
                                </h2>
                            </div>

                            <div className="p-4 space-y-4">
                                {/* Remote status */}
                                <FilterSection title="Remote Status">
                                    <Checkbox checked={remoteOnly} onChange={() => { setRemoteOnly(v => !v); if (!remoteOnly) setOnsiteOnly(false); }} label="Remote Only" />
                                    <Checkbox checked={onsiteOnly} onChange={() => { setOnsiteOnly(v => !v); if (!onsiteOnly) setRemoteOnly(false); }} label="On-site Only" />
                                    <Checkbox checked={!remoteOnly && !onsiteOnly} onChange={() => { setRemoteOnly(false); setOnsiteOnly(false); }} label="All locations" />
                                </FilterSection>

                                {/* Skills */}
                                {allSkills.length > 0 && (
                                    <FilterSection title="Skills">
                                        <div className="flex flex-wrap gap-1.5">
                                            {allSkills.map(s => {
                                                const active = selectedSkills.includes(s);
                                                return (
                                                    <button key={s} onClick={() => toggleSkill(s)}
                                                        className="px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer border-none"
                                                        style={{
                                                            fontFamily: "var(--font-jetbrains-mono)",
                                                            background: active ? accent : "var(--theme-bg-secondary)",
                                                            color: active ? "#000" : "var(--theme-text-muted)",
                                                            boxShadow: active ? `0 0 10px ${accent}30` : "none",
                                                        }}>
                                                        {s}
                                                    </button>
                                                );
                                            })}
                                            {selectedSkills.length > 0 && (
                                                <button onClick={() => setSelectedSkills([])}
                                                    className="px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer border-none bg-transparent text-(--theme-text-muted) hover:text-red-400 transition-colors">
                                                    Clear
                                                </button>
                                            )}
                                        </div>
                                    </FilterSection>
                                )}

                                {/* Salary range */}
                                <FilterSection title="Max Salary (USD)">
                                    <div className="px-1">
                                        <input type="range" min={50} max={500} value={maxSalary}
                                            onChange={e => setMaxSalary(Number(e.target.value))}
                                            className="w-full accent-primary"
                                            style={{
                                                height: "4px", appearance: "none", WebkitAppearance: "none",
                                                background: `linear-gradient(to right, ${accent} ${((maxSalary - 50) / 450) * 100}%, var(--theme-input-bg) ${((maxSalary - 50) / 450) * 100}%)`,
                                                borderRadius: "4px", outline: "none", cursor: "pointer",
                                            }} />
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-[10px] text-(--theme-text-muted)" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>$50k</span>
                                            <span className="text-[10px] text-primary font-bold" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>${maxSalary}k+</span>
                                        </div>
                                    </div>
                                </FilterSection>
                            </div>
                        </div>

                        {/* Stats card */}
                        <div className="rounded-2xl border border-(--theme-border) bg-(--theme-card) shadow-sm overflow-hidden">
                            <div className="px-4 py-3 border-b border-(--theme-border-light)">
                                <h3 className="text-[11px] font-bold uppercase tracking-[2px] text-(--theme-text-muted)"
                                    style={{ fontFamily: "var(--font-jetbrains-mono)" }}>
                                    Market Pulse
                                </h3>
                            </div>
                            <div className="divide-y divide-(--theme-border-light)">
                                {[
                                    { label: "Open Jobs", value: jobs.filter(j => j.status === "OPEN").length || "—" },
                                    { label: "Remote Roles", value: jobs.filter(j => j.isRemote).length || "—" },
                                    { label: "Applied", value: jobs.filter(j => j.hasApplied).length || 0 },
                                ].map(stat => (
                                    <div key={stat.label} className="flex items-center justify-between px-4 py-2.5">
                                        <span className="text-[12px] text-(--theme-text-secondary)">{stat.label}</span>
                                        <span className="text-[12px] font-bold text-(--theme-text-primary)"
                                            style={{ fontFamily: "var(--font-jetbrains-mono)" }}>
                                            {stat.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                input[type="range"]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: ${accent};
                    cursor: pointer;
                    box-shadow: 0 0 8px ${accent}60;
                    border: 2px solid var(--theme-bg);
                }
                input[type="range"]::-moz-range-thumb {
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: ${accent};
                    cursor: pointer;
                    box-shadow: 0 0 8px ${accent}60;
                    border: 2px solid var(--theme-bg);
                }
            `}</style>
        </div>
    );
}
