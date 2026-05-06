"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { Sparkles, Loader2, Users, Briefcase, Search, MapPin, ChevronRight, ExternalLink, Hash, UserCheck } from "lucide-react";

const accent = "#A855F7";

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

// Loose UUID / cuid / nanoid detection
function looksLikeId(val: string): boolean {
    if (/^c[a-z0-9]{20,}$/i.test(val)) return true;
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val)) return true;
    if (/^[A-Za-z0-9_-]{21}$/.test(val)) return true;
    return false;
}

interface IdLookupResult {
    status: "idle" | "loading" | "found" | "notfound";
    user: UserResult | null;
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
    const [idLookup, setIdLookup] = useState<IdLookupResult>({ status: "idle", user: null });

    // Fetch once on mount (server-side filtering for roles, client-side text search)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => {
        setIsLoading(true);
        const param = roleFilter !== "ALL" ? `?role=${roleFilter}` : "";
        fetch(`/api/search${param}`)
            .then(r => r.json())
            .then(d => { if (d.users) setUsers(d.users); })
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, [roleFilter]);

    // --- Direct ID lookup ---
    const lookupById = useCallback((id: string) => {
        setIdLookup({ status: "loading", user: null });
        fetch(`/api/search/by-id?id=${encodeURIComponent(id)}`)
            .then(r => r.json())
            .then(d => {
                if (d.user) setIdLookup({ status: "found", user: d.user });
                else setIdLookup({ status: "notfound", user: null });
            })
            .catch(() => setIdLookup({ status: "notfound", user: null }));
    }, []);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => {
        const trimmed = searchTerm.trim();
        if (!looksLikeId(trimmed)) {
            setIdLookup({ status: "idle", user: null });
            return;
        }
        const t = setTimeout(() => lookupById(trimmed), 300);
        return () => clearTimeout(t);
    }, [searchTerm, lookupById]);

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
            <div className="max-w-230 w-full mx-auto px-4 sm:px-6 py-5 pb-24 lg:pb-10 flex-1 flex flex-col">

                {/* HEADER */}
                <div className="mb-5">
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-(--theme-text-primary)">Search</h1>
                    <p className="text-[12px] sm:text-[13px] text-(--theme-text-muted) mt-1">
                        Find talents and recruiters across SkillSpill
                    </p>
                </div>

                {/* SEARCH BAR + ROLE FILTER */}
                <div className="rounded-2xl border border-(--theme-border) bg-(--theme-card) shadow-sm p-3 sm:p-4 mb-5">

                    {/* Search input */}
                    <div className="relative mb-3">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-(--theme-text-muted)" />
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
                        <span className="text-[11px] font-semibold text-(--theme-text-muted) uppercase tracking-wider shrink-0">Filter:</span>
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

                {/* ── DIRECT ID MATCH BANNER ── */}
                {idLookup.status === "loading" && (
                    <div className="flex items-center gap-3 rounded-2xl border p-4 mb-3"
                        style={{ borderColor: `${accent}40`, background: `${accent}08` }}>
                        <Loader2 className="w-4 h-4 animate-spin shrink-0" style={{ color: accent }} />
                        <span className="text-[13px] font-medium" style={{ color: accent }}>Looking up profile ID…</span>
                    </div>
                )}

                {idLookup.status === "notfound" && (
                    <div className="flex items-center gap-3 rounded-2xl border p-4 mb-3"
                        style={{ borderColor: "#ef444440", background: "#ef444408" }}>
                        <Hash className="w-4 h-4 shrink-0 text-red-400" />
                        <span className="text-[13px] font-medium text-red-400">No user found with that ID.</span>
                    </div>
                )}

                {idLookup.status === "found" && idLookup.user && (
                    <DirectIdCard user={idLookup.user} accent={accent} />
                )}

                {/* RESULTS */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center flex-1 p-12">
                        <Loader2 className="w-7 h-7 animate-spin mb-3" style={{ color: accent }} />
                        <p className="text-[13px] text-(--theme-text-muted) font-medium">Searching…</p>
                    </div>
                ) : results.length === 0 ? (
                    <div className="flex flex-col items-center justify-center flex-1 p-12 text-center rounded-2xl border border-(--theme-border) bg-(--theme-card)">
                        <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                            style={{ background: `${accent}10` }}>
                            <Search className="w-6 h-6" style={{ color: accent, opacity: 0.6 }} />
                        </div>
                        <h3 className="text-[15px] font-bold text-(--theme-text-primary) mb-1">No results found</h3>
                        <p className="text-[13px] text-(--theme-text-muted)">Try a different name, skill, or switch the filter.</p>
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
        <div className="rounded-2xl border bg-(--theme-card) p-4 sm:p-5 transition-all hover:border-(--theme-border) group"
            style={{ borderColor: "var(--theme-border)" }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = `${accent}40`)}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--theme-border)")}>

            <div className="flex gap-3 sm:gap-4">
                {/* Avatar */}
                <div className={`w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-linear-to-br ${grad} flex items-center justify-center text-white text-[13px] sm:text-[16px] font-bold shrink-0`}>
                    {getInitials(user.fullName)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h2 className="text-[14px] sm:text-[15px] font-bold text-(--theme-text-primary) truncate">{user.fullName}</h2>
                                <span className="text-[11px] text-(--theme-text-muted)">@{user.username}</span>
                                {available && (
                                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 border border-green-500/20 uppercase tracking-widest">
                                        Open to Work
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                                <p className="text-[12px] font-medium text-(--theme-text-secondary)">{role}</p>
                                {/* Role badge */}
                                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest"
                                    style={{ background: "#3CF91A15", color: "#3CF91A", border: "1px solid #3CF91A30" }}>
                                    Talent
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 shrink-0 ml-auto">
                            <Link href={`/recruiter/talent/${user.id}`}
                                className="px-3 py-1.5 rounded-xl text-[11px] font-bold text-white no-underline flex items-center gap-1 transition-all hover:scale-105"
                                style={{ background: `linear-gradient(135deg, ${accent}, #7C3AED)` }}>
                                Profile
                            </Link>
                            <Link href={`/recruiter/messages?with=${user.id}`}
                                className="px-3 py-1.5 rounded-xl text-[11px] font-medium no-underline flex items-center gap-1 transition-all hover:opacity-80"
                                style={{ background: "var(--theme-input-bg)", border: "1px solid var(--theme-border)", color: "var(--theme-text-secondary)" }}>
                                Message
                            </Link>
                        </div>
                    </div>

                    {bio && (
                        <p className="text-[12px] text-(--theme-text-muted) mt-2 leading-relaxed line-clamp-2 hidden sm:block">{bio}</p>
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
        <div className="rounded-2xl border bg-(--theme-card) p-4 sm:p-5 transition-all"
            style={{ borderColor: "var(--theme-border)" }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = `${accent}40`)}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--theme-border)")}>

            <div className="flex gap-3 sm:gap-4">
                {/* Avatar */}
                <div className={`w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-linear-to-br ${grad} flex items-center justify-center text-white text-[13px] sm:text-[16px] font-bold shrink-0`}>
                    {getInitials(user.fullName)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h2 className="text-[14px] sm:text-[15px] font-bold text-(--theme-text-primary) truncate">{user.fullName}</h2>
                                <span className="text-[11px] text-(--theme-text-muted)">@{user.username}</span>
                                {/* Role badge */}
                                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest"
                                    style={{ background: `${accent}15`, color: accent, border: `1px solid ${accent}30` }}>
                                    Recruiter
                                </span>
                            </div>
                            <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                                <p className="text-[12px] font-medium text-(--theme-text-secondary)">
                                    {jobTitle} at <span style={{ color: accent }}>{company}</span>
                                </p>
                                {location && (
                                    <span className="flex items-center gap-1 text-[11px] text-(--theme-text-muted)">
                                        <MapPin className="w-3 h-3" />{location}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 shrink-0 ml-auto">
                            <Link href={`/recruiter/recruiter/${user.id}`}
                                className="px-3 py-1.5 rounded-xl text-[11px] font-bold text-white no-underline flex items-center gap-1 transition-all hover:scale-105"
                                style={{ background: `linear-gradient(135deg, ${accent}, #7C3AED)` }}>
                                Profile
                            </Link>
                            <Link href={`/recruiter/messages?with=${user.id}`}
                                className="px-3 py-1.5 rounded-xl text-[11px] font-medium no-underline flex items-center gap-1 transition-all hover:opacity-80"
                                style={{ background: "var(--theme-input-bg)", border: "1px solid var(--theme-border)", color: "var(--theme-text-secondary)" }}>
                                Message
                            </Link>
                        </div>
                    </div>

                    {bio && (
                        <p className="text-[12px] text-(--theme-text-muted) mt-2 leading-relaxed line-clamp-2 hidden sm:block">{bio}</p>
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

// ── Direct ID match card ───────────────────────────────────────────
function DirectIdCard({ user, accent }: { user: UserResult; accent: string }) {
    const isTalent = user.role === "TALENT";
    const profileHref = isTalent
        ? `/recruiter/talent/${user.id}`
        : `/recruiter/recruiter/${user.id}`;

    const subtitle = isTalent
        ? user.talentProfile?.experienceLevel
            ? `${user.talentProfile.experienceLevel.charAt(0) + user.talentProfile.experienceLevel.slice(1).toLowerCase()} Developer`
            : "Talent"
        : user.recruiterProfile?.companyName
            ? `Recruiter at ${user.recruiterProfile.companyName}`
            : "Recruiter";

    const bio = isTalent ? user.talentProfile?.bio : user.recruiterProfile?.bio;
    const skills = user.talentProfile?.skills?.map(s => s.skillName) ?? [];

    return (
        <div
            className="rounded-2xl border p-4 sm:p-5 mb-3 transition-all"
            style={{
                background: `${accent}06`,
                borderColor: `${accent}50`,
                boxShadow: `0 0 0 1px ${accent}20, 0 4px 24px ${accent}10`,
            }}
        >
            <div className="flex items-center gap-2 mb-3">
                <UserCheck className="w-3.5 h-3.5" style={{ color: accent }} />
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: accent }}>
                    Direct ID Match
                </span>
            </div>

            <div className="flex gap-3 sm:gap-4 items-center">
                <div
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-white text-[15px] sm:text-[18px] font-bold shrink-0"
                    style={{ background: `linear-gradient(135deg, ${accent}, #7C3AED)` }}
                >
                    {getInitials(user.fullName)}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h2 className="text-[15px] sm:text-[16px] font-bold text-(--theme-text-primary)">
                                    {user.fullName}
                                </h2>
                                <span className="text-[11px] text-(--theme-text-muted)">@{user.username}</span>
                                <span
                                    className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest"
                                    style={{ background: `${accent}15`, color: accent, border: `1px solid ${accent}30` }}
                                >
                                    {isTalent ? "Talent" : "Recruiter"}
                                </span>
                            </div>
                            <p className="text-[12px] text-(--theme-text-secondary) mt-0.5">{subtitle}</p>
                            {bio && (
                                <p className="text-[12px] text-(--theme-text-muted) mt-1.5 leading-relaxed line-clamp-2 hidden sm:block">
                                    {bio}
                                </p>
                            )}
                            {skills.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                    {skills.slice(0, 5).map(s => (
                                        <span key={s} className="px-2 py-0.5 rounded-md text-[10px] font-medium"
                                            style={{ background: "var(--theme-input-bg)", border: "1px solid var(--theme-border-light)", color: "var(--theme-text-secondary)" }}>
                                            {s}
                                        </span>
                                    ))}
                                    {skills.length > 5 && (
                                        <span className="px-2 py-0.5 rounded-md text-[10px] font-medium"
                                            style={{ background: "var(--theme-input-bg)", border: "1px solid var(--theme-border-light)", color: "var(--theme-text-muted)" }}>
                                            +{skills.length - 5} more
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>

                        <Link
                            href={profileHref}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12px] font-bold text-white no-underline transition-all hover:scale-105 shrink-0"
                            style={{ background: `linear-gradient(135deg, ${accent}, #7C3AED)` }}
                        >
                            <ExternalLink className="w-3.5 h-3.5" />
                            View Profile
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
