"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Sparkles, Loader2, Users, Briefcase, Search, MapPin, ChevronRight } from "lucide-react";

const accent = "#3CF91A";

const gradients = [
    "from-violet-500 to-purple-600",
    "from-orange-400 to-red-500",
    "from-blue-400 to-indigo-500",
    "from-cyan-400 to-teal-500",
    "from-emerald-400 to-green-500",
    "from-pink-400 to-rose-500",
    "from-amber-400 to-orange-500",
    "from-indigo-400 to-blue-600",
];

function getInitials(name: string) {
    if (!name) return "??";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
}

type RoleFilter = "ALL" | "TALENT" | "RECRUITER";

interface UserResult {
    id: string;
    fullName: string;
    username: string;
    role: "TALENT" | "RECRUITER";
    talentProfile?: {
        bio?: string;
        experienceLevel?: string;
        isAvailable?: boolean;
        skills?: { skillName: string }[];
        workExperience?: { companyName: string; role: string }[];
    };
    recruiterProfile?: {
        companyName?: string;
        companyWebsite?: string;
        jobTitle?: string;
        location?: string;
        bio?: string;
    };
}

const ROLE_FILTERS: { label: string; value: RoleFilter; icon: React.ReactNode }[] = [
    { label: "Everyone", value: "ALL", icon: <Users className="w-3.5 h-3.5" /> },
    { label: "Talents", value: "TALENT", icon: <Sparkles className="w-3.5 h-3.5" /> },
    { label: "Recruiters", value: "RECRUITER", icon: <Briefcase className="w-3.5 h-3.5" /> },
];

export default function SearchPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState<RoleFilter>("ALL");
    const [users, setUsers] = useState<UserResult[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch once on mount (server-side filtering for roles, client-side text search)
    useEffect(() => {
        setIsLoading(true);
        const param = roleFilter !== "ALL" ? `?role=${roleFilter}` : "";
        fetch(`/api/search${param}`)
            .then(r => r.json())
            .then(d => { if (d.users) setUsers(d.users); })
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, [roleFilter]);

    // Client-side text search on top
    const results = useMemo(() => {
        const q = searchTerm.toLowerCase().trim();
        if (!q) return users;
        return users.filter(u => {
            const name = u.fullName?.toLowerCase() ?? "";
            const username = u.username?.toLowerCase() ?? "";
            const company = u.recruiterProfile?.companyName?.toLowerCase() ?? "";
            const jobTitle = u.recruiterProfile?.jobTitle?.toLowerCase() ?? "";
            const skills = u.talentProfile?.skills?.map(s => s.skillName.toLowerCase()) ?? [];
            const exp = u.talentProfile?.experienceLevel?.toLowerCase() ?? "";
            return name.includes(q) || username.includes(q) || company.includes(q) ||
                jobTitle.includes(q) || skills.some(s => s.includes(q)) || exp.includes(q);
        });
    }, [users, searchTerm]);

    return (
        <div style={{ background: "var(--theme-bg)" }} className="min-h-full flex flex-col">
            <div className="max-w-[920px] w-full mx-auto px-4 sm:px-6 py-5 pb-24 lg:pb-10 flex-1 flex flex-col">

                {/* HEADER */}
                <div className="mb-5">
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--theme-text-primary)]">Search</h1>
                    <p className="text-[12px] sm:text-[13px] text-[var(--theme-text-muted)] mt-1">
                        Find talents and recruiters across SkillSpill
                    </p>
                </div>

                {/* SEARCH BAR + ROLE FILTER */}
                <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm p-3 sm:p-4 mb-5">

                    {/* Search input */}
                    <div className="relative mb-3">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--theme-text-muted)]" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            placeholder="Search by name, @alias, skill, company..."
                            className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl text-[13px] outline-none transition-all"
                            style={{
                                background: "var(--theme-input-bg)",
                                border: "1px solid var(--theme-border)",
                                color: "var(--theme-text-primary)",
                            }}
                        />
                    </div>

                    {/* Role filter pills */}
                    <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-[var(--theme-text-muted)] uppercase tracking-wider shrink-0">Filter:</span>
                        <div className="flex gap-2 overflow-x-auto scrollbar-none">
                            {ROLE_FILTERS.map(f => (
                                <button
                                    key={f.value}
                                    onClick={() => setRoleFilter(f.value)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] sm:text-[12px] font-semibold whitespace-nowrap transition-all border cursor-pointer"
                                    style={roleFilter === f.value ? {
                                        background: `${accent}15`,
                                        borderColor: `${accent}40`,
                                        color: accent,
                                    } : {
                                        background: "var(--theme-card)",
                                        borderColor: "var(--theme-border)",
                                        color: "var(--theme-text-tertiary)",
                                    }}
                                >
                                    {f.icon}
                                    {f.label}
                                </button>
                            ))}
                        </div>

                        {/* Result count badge */}
                        {!isLoading && (
                            <span className="ml-auto shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-full"
                                style={{ background: `${accent}15`, color: accent }}>
                                {results.length} found
                            </span>
                        )}
                    </div>
                </div>

                {/* RESULTS */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center flex-1 p-12">
                        <Loader2 className="w-7 h-7 animate-spin mb-3" style={{ color: accent }} />
                        <p className="text-[13px] text-[var(--theme-text-muted)] font-medium">Searching…</p>
                    </div>
                ) : results.length === 0 ? (
                    <div className="flex flex-col items-center justify-center flex-1 p-12 text-center rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)]">
                        <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                            style={{ background: `${accent}10` }}>
                            <Search className="w-6 h-6" style={{ color: accent, opacity: 0.6 }} />
                        </div>
                        <h3 className="text-[15px] font-bold text-[var(--theme-text-primary)] mb-1">No results found</h3>
                        <p className="text-[13px] text-[var(--theme-text-muted)]">Try a different name, skill, or switch the filter.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {results.map((user, index) => (
                            user.role === "TALENT"
                                ? <TalentCard key={user.id} user={user} index={index} accent={accent} />
                                : <RecruiterCard key={user.id} user={user} index={index} accent={accent} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// ── Talent Card ────────────────────────────────────────────────────
function TalentCard({ user, index, accent }: { user: UserResult; index: number; accent: string }) {
    const grad = gradients[index % gradients.length];
    const skills = user.talentProfile?.skills?.map(s => s.skillName) ?? [];
    const exp = user.talentProfile?.experienceLevel;
    const available = user.talentProfile?.isAvailable !== false;
    const bio = user.talentProfile?.bio;
    const currentJob = user.talentProfile?.workExperience?.[0];
    const role = currentJob
        ? `${currentJob.role} at ${currentJob.companyName}`
        : exp ? `${exp.charAt(0) + exp.slice(1).toLowerCase()} Developer` : "Developer";

    return (
        <div className="rounded-2xl border bg-[var(--theme-card)] p-4 sm:p-5 transition-all hover:border-[var(--theme-border)] group"
            style={{ borderColor: "var(--theme-border)" }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = `${accent}40`)}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--theme-border)")}>

            <div className="flex gap-3 sm:gap-4">
                {/* Avatar */}
                <div className={`w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br ${grad} flex items-center justify-center text-white text-[13px] sm:text-[16px] font-bold shrink-0`}>
                    {getInitials(user.fullName)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h2 className="text-[14px] sm:text-[15px] font-bold text-[var(--theme-text-primary)] truncate">{user.fullName}</h2>
                                <span className="text-[11px] text-[var(--theme-text-muted)]">@{user.username}</span>
                                {available && (
                                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 border border-green-500/20 uppercase tracking-widest">
                                        Open to Work
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                                <p className="text-[12px] font-medium text-[var(--theme-text-secondary)]">{role}</p>
                                {/* Role badge */}
                                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest"
                                    style={{ background: "#3CF91A15", color: "#3CF91A", border: "1px solid #3CF91A30" }}>
                                    Talent
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 shrink-0 ml-auto">
                            <Link href={`/talent/talent/${user.id}`}
                                className="px-3 py-1.5 rounded-xl text-[11px] font-bold text-black no-underline flex items-center gap-1 transition-all hover:scale-105"
                                style={{ background: `linear-gradient(135deg, ${accent}, #10B981)` }}>
                                Profile
                            </Link>
                            <Link href={`/talent/messages?with=${user.id}`}
                                className="px-3 py-1.5 rounded-xl text-[11px] font-medium no-underline flex items-center gap-1 transition-all hover:opacity-80"
                                style={{ background: "var(--theme-input-bg)", border: "1px solid var(--theme-border)", color: "var(--theme-text-secondary)" }}>
                                Message
                            </Link>
                        </div>
                    </div>

                    {bio && (
                        <p className="text-[12px] text-[var(--theme-text-muted)] mt-2 leading-relaxed line-clamp-2 hidden sm:block">{bio}</p>
                    )}

                    {/* Skills */}
                    {skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                            {skills.slice(0, 6).map(s => (
                                <span key={s} className="px-2 py-0.5 rounded-md text-[10px] font-medium"
                                    style={{ background: "var(--theme-input-bg)", border: "1px solid var(--theme-border-light)", color: "var(--theme-text-secondary)" }}>
                                    {s}
                                </span>
                            ))}
                            {skills.length > 6 && (
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-medium"
                                    style={{ background: "var(--theme-input-bg)", border: "1px solid var(--theme-border-light)", color: "var(--theme-text-muted)" }}>
                                    +{skills.length - 6} more
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ── Recruiter Card ─────────────────────────────────────────────────
function RecruiterCard({ user, index, accent }: { user: UserResult; index: number; accent: string }) {
    const grad = gradients[(index + 3) % gradients.length];
    const company = user.recruiterProfile?.companyName ?? "Company";
    const jobTitle = user.recruiterProfile?.jobTitle ?? "Recruiter";
    const location = user.recruiterProfile?.location;
    const website = user.recruiterProfile?.companyWebsite;
    const bio = user.recruiterProfile?.bio;

    return (
        <div className="rounded-2xl border bg-[var(--theme-card)] p-4 sm:p-5 transition-all"
            style={{ borderColor: "var(--theme-border)" }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = `${accent}40`)}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--theme-border)")}>

            <div className="flex gap-3 sm:gap-4">
                {/* Avatar */}
                <div className={`w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br ${grad} flex items-center justify-center text-white text-[13px] sm:text-[16px] font-bold shrink-0`}>
                    {getInitials(user.fullName)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h2 className="text-[14px] sm:text-[15px] font-bold text-[var(--theme-text-primary)] truncate">{user.fullName}</h2>
                                <span className="text-[11px] text-[var(--theme-text-muted)]">@{user.username}</span>
                                {/* Role badge */}
                                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest"
                                    style={{ background: `${accent}15`, color: accent, border: `1px solid ${accent}30` }}>
                                    Recruiter
                                </span>
                            </div>
                            <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                                <p className="text-[12px] font-medium text-[var(--theme-text-secondary)]">
                                    {jobTitle} at <span style={{ color: accent }}>{company}</span>
                                </p>
                                {location && (
                                    <span className="flex items-center gap-1 text-[11px] text-[var(--theme-text-muted)]">
                                        <MapPin className="w-3 h-3" />{location}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 shrink-0 ml-auto">
                            <Link href={`/talent/recruiter/${user.id}`}
                                className="px-3 py-1.5 rounded-xl text-[11px] font-bold text-black no-underline flex items-center gap-1 transition-all hover:scale-105"
                                style={{ background: `linear-gradient(135deg, ${accent}, #10B981)` }}>
                                Profile
                            </Link>
                            <Link href={`/talent/messages?with=${user.id}`}
                                className="px-3 py-1.5 rounded-xl text-[11px] font-medium no-underline flex items-center gap-1 transition-all hover:opacity-80"
                                style={{ background: "var(--theme-input-bg)", border: "1px solid var(--theme-border)", color: "var(--theme-text-secondary)" }}>
                                Message
                            </Link>
                        </div>
                    </div>

                    {bio && (
                        <p className="text-[12px] text-[var(--theme-text-muted)] mt-2 leading-relaxed line-clamp-2 hidden sm:block">{bio}</p>
                    )}

                    {website && (
                        <a href={website.startsWith("http") ? website : `https://${website}`}
                            target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 mt-2 text-[11px] no-underline hover:underline"
                            style={{ color: accent }}>
                            <ChevronRight className="w-3 h-3" />
                            {website.replace(/^https?:\/\//, "")}
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}
