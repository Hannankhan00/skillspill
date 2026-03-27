"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
    Building2, MapPin, Globe, Briefcase, Loader2,
    Link as LinkIcon, Heart, MessageSquare, Share2,
    Eye, Sparkles, Users, CheckCircle,
} from "lucide-react";
import FollowButton from "@/app/components/FollowButton";

const accent = "#A855F7";

export default function RecruiterProfileViewPage() {
    const params = useParams();
    const id = params?.id as string;
    const [recruiterData, setRecruiterData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("Overview");
    const tabs = ["Overview", "Jobs", "Spills"];

    useEffect(() => {
        if (!id) return;
        fetch(`/api/recruiters/${id}`)
            .then(r => r.json())
            .then(d => {
                if (d.recruiter) setRecruiterData(d.recruiter);
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-full p-20">
                <Loader2 className="w-10 h-10 animate-spin mb-4" style={{ color: accent }} />
                <p className="text-[13px] text-[var(--theme-text-muted)] font-medium">Loading recruiter profile...</p>
            </div>
        );
    }

    if (!recruiterData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-full p-20">
                <h3 className="text-lg font-bold text-red-400 mb-2">Recruiter Not Found</h3>
                <p className="text-[13px] text-[var(--theme-text-muted)]">We couldn't locate this recruiter's profile.</p>
            </div>
        );
    }

    const { fullName, username, recruiterProfile, spills, avatarUrl, coverUrl } = recruiterData;
    const { bio, jobTitle, companyName, companyWebsite, location, country, industries, bounties } = recruiterProfile || {};

    const initials = fullName
        ? fullName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
        : "??";

    const displayTitle = jobTitle
        ? `${jobTitle}${companyName ? ` at ${companyName}` : ""}`
        : companyName || "Recruiter";

    return (
        <div style={{ background: "var(--theme-bg)" }} className="min-h-full">

            {/* ── COVER BANNER ── */}
            <div className="relative">
                <div className={`h-32 sm:h-44 lg:h-52 w-full relative overflow-hidden ${coverUrl || "bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600"}`}>
                    <div className="absolute inset-0 opacity-10"
                        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fff' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
                    />
                    <div className="absolute right-4 sm:right-8 top-4 sm:top-6 text-white/20 font-mono text-[10px] sm:text-xs hidden sm:block text-right">
                        <p>{"// recruiter.profile"}</p>
                        <p>{`const company = "${companyName || "SkillSpill"}";`}</p>
                        <p>{`const hiring = true;`}</p>
                    </div>
                </div>

                {/* Avatar */}
                <div className="max-w-[900px] mx-auto px-4 sm:px-6">
                    <div className="relative -mt-12 sm:-mt-16 flex items-end gap-4">
                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold border-4 border-[var(--theme-bg)] shadow-xl shrink-0">
                            {avatarUrl ? (
                                <img src={avatarUrl} alt={fullName} className="w-full h-full object-cover" />
                            ) : (
                                initials
                            )}
                        </div>
                        <div className="pb-1 sm:pb-2 min-w-0 hidden sm:block">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-xl sm:text-2xl font-bold text-[var(--theme-text-primary)]">{fullName}</h1>
                                <span className="text-[12px] font-medium text-[var(--theme-text-muted)]">@{username}</span>
                                {/* Recruiter badge */}
                                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest"
                                    style={{ background: `${accent}15`, color: accent, border: `1px solid ${accent}30` }}>
                                    Recruiter
                                </span>
                            </div>
                            <p className="text-[13px] text-[var(--theme-text-muted)] mt-0.5">{displayTitle}</p>
                            <p className="text-[11px] font-medium flex items-center gap-1 mt-1" style={{ color: accent }}>
                                <Sparkles className="w-3 h-3" /> Recruiter Profile
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile name */}
            <div className="sm:hidden px-4 mt-3">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h1 className="text-lg font-bold text-[var(--theme-text-primary)]">{fullName}</h1>
                    <span className="text-[11px] font-medium text-[var(--theme-text-muted)]">@{username}</span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest"
                        style={{ background: `${accent}15`, color: accent, border: `1px solid ${accent}30` }}>
                        Recruiter
                    </span>
                </div>
                <p className="text-[12px] text-[var(--theme-text-muted)]">{displayTitle}</p>
            </div>

            {/* ── MAIN CONTENT ── */}
            <div className="max-w-[900px] mx-auto px-4 sm:px-6 pb-24 lg:pb-8">

                {/* Stats / Actions row */}
                <div className="flex items-center gap-3 sm:gap-6 mt-4 sm:mt-5 pb-4 border-b border-[var(--theme-border)]">
                    <div className="text-center">
                        <p className="text-sm sm:text-lg font-bold text-[var(--theme-text-primary)]">{bounties?.length || 0}</p>
                        <p className="text-[9px] sm:text-[10px] text-[var(--theme-text-muted)] uppercase tracking-wider">Open Jobs</p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm sm:text-lg font-bold text-[var(--theme-text-primary)]">{spills?.length || 0}</p>
                        <p className="text-[9px] sm:text-[10px] text-[var(--theme-text-muted)] uppercase tracking-wider">Spills</p>
                    </div>
                    <div className="ml-auto flex gap-2">
                        {recruiterData?.id && (
                            <FollowButton targetUserId={recruiterData.id} initialIsFollowing={recruiterData.isFollowing} />
                        )}
                        <Link href={`/recruiter/messages?with=${recruiterData.id}`}
                            className="px-4 sm:px-5 py-2 rounded-xl text-[11px] sm:text-[12px] font-bold text-white border-none cursor-pointer transition-all hover:scale-105 no-underline"
                            style={{ background: `linear-gradient(135deg, ${accent}, #7C3AED)`, boxShadow: `0 0 15px ${accent}40` }}>
                            Message
                        </Link>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-0 mt-0 border-b border-[var(--theme-border)] overflow-x-auto scrollbar-none">
                    {tabs.map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)}
                            className={`px-4 sm:px-6 py-3 text-[12px] sm:text-[13px] font-semibold border-b-2 transition-all cursor-pointer bg-transparent whitespace-nowrap
                                ${activeTab === tab ? "border-[#A855F7] text-[#A855F7]" : "border-transparent text-[var(--theme-text-muted)] hover:text-[var(--theme-text-tertiary)]"}`}>
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="mt-5 space-y-5">

                    {/* ── OVERVIEW TAB ── */}
                    {activeTab === "Overview" && (
                        <>
                            {/* About */}
                            <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm p-4 sm:p-5">
                                <h2 className="text-[14px] font-bold text-[var(--theme-text-primary)] mb-2">About</h2>
                                <p className="text-[13px] text-[var(--theme-text-tertiary)] leading-relaxed whitespace-pre-wrap">
                                    {bio || "This recruiter hasn't added a bio yet."}
                                </p>
                                <div className="flex flex-wrap gap-3 mt-4 text-[11px] text-[var(--theme-text-muted)] pt-3 border-t border-[var(--theme-border-light)]">
                                    {(location || country) && (
                                        <span className="flex items-center gap-1.5">
                                            <MapPin className="w-3.5 h-3.5" />
                                            {[location, country].filter(Boolean).join(", ")}
                                        </span>
                                    )}
                                    {companyName && (
                                        <span className="flex items-center gap-1.5 font-medium" style={{ color: accent }}>
                                            <Building2 className="w-3.5 h-3.5" />
                                            {companyName}
                                        </span>
                                    )}
                                    {jobTitle && (
                                        <span className="flex items-center gap-1.5">
                                            <Briefcase className="w-3.5 h-3.5" />
                                            {jobTitle}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Links */}
                            {companyWebsite && (
                                <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm p-4 sm:p-5">
                                    <h2 className="text-[14px] font-bold text-[var(--theme-text-primary)] mb-3 flex items-center gap-2">
                                        <LinkIcon className="w-4 h-4" /> Links
                                    </h2>
                                    <a href={companyWebsite.startsWith("http") ? companyWebsite : `https://${companyWebsite}`}
                                        target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-3 rounded-xl hover:opacity-80 transition-colors border no-underline w-fit"
                                        style={{ background: "var(--theme-bg-secondary)", borderColor: "var(--theme-border-light)" }}
                                        onMouseEnter={e => (e.currentTarget.style.borderColor = `${accent}40`)}
                                        onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--theme-border-light)")}>
                                        <Globe className="w-5 h-5 text-[var(--theme-text-secondary)]" />
                                        <div>
                                            <p className="text-[12px] font-bold text-[var(--theme-text-primary)]">Company Website</p>
                                            <p className="text-[10px] text-[var(--theme-text-muted)]">{companyWebsite.replace(/^https?:\/\//, "")}</p>
                                        </div>
                                    </a>
                                </div>
                            )}

                            {/* Industries */}
                            {industries && industries.length > 0 && (
                                <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm p-4 sm:p-5">
                                    <h2 className="text-[14px] font-bold text-[var(--theme-text-primary)] mb-3 flex items-center gap-2">
                                        <Users className="w-4 h-4" style={{ color: accent }} /> Industries & Specialties
                                    </h2>
                                    <div className="flex flex-wrap gap-2">
                                        {industries.map((ind: any) => (
                                            <span key={ind.industryName}
                                                className="px-3 py-1.5 rounded-lg text-[11px] sm:text-[12px] font-medium border flex items-center gap-1.5"
                                                style={{ background: "var(--theme-input-bg)", borderColor: "var(--theme-border-light)", color: "var(--theme-text-secondary)" }}>
                                                <CheckCircle className="w-3 h-3" style={{ color: accent }} />
                                                {ind.industryName}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* ── JOBS TAB ── */}
                    {activeTab === "Jobs" && (
                        <div className="space-y-4">
                            {bounties && bounties.length > 0 ? (
                                bounties.map((bounty: any) => (
                                    <div key={bounty.id}
                                        className="rounded-2xl border bg-[var(--theme-card)] p-4 sm:p-5 transition-all"
                                        style={{ borderColor: "var(--theme-border)" }}
                                        onMouseEnter={e => (e.currentTarget.style.borderColor = `${accent}40`)}
                                        onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--theme-border)")}>
                                        <div className="flex items-start justify-between gap-3 flex-wrap">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-[14px] font-bold text-[var(--theme-text-primary)] mb-1">{bounty.title}</h3>
                                                {bounty.description && (
                                                    <p className="text-[12px] text-[var(--theme-text-secondary)] leading-relaxed mb-2 line-clamp-2">{bounty.description}</p>
                                                )}
                                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                                    {bounty.reward && (
                                                        <span className="font-bold text-[12px]" style={{ color: accent }}>
                                                            ${Number(bounty.reward).toLocaleString()}
                                                        </span>
                                                    )}
                                                    {bounty.skills?.slice(0, 4).map((s: any) => (
                                                        <span key={s.skillName}
                                                            className="px-2 py-0.5 rounded-md text-[10px] font-medium"
                                                            style={{ background: "var(--theme-input-bg)", border: "1px solid var(--theme-border-light)", color: "var(--theme-text-secondary)" }}>
                                                            {s.skillName}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-bold px-2 py-1 rounded-full shrink-0 bg-green-500/10 text-green-500 border border-green-500/20">
                                                {bounty.status}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm p-8 text-center flex flex-col items-center">
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3" style={{ background: `${accent}15` }}>
                                        <Briefcase className="w-5 h-5" style={{ color: accent }} />
                                    </div>
                                    <h3 className="text-[14px] font-bold text-[var(--theme-text-primary)] mb-1">No Open Jobs</h3>
                                    <p className="text-[12px] text-[var(--theme-text-muted)]">This recruiter has no active bounties right now.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── SPILLS TAB ── */}
                    {activeTab === "Spills" && (
                        <div className="space-y-4">
                            {spills && spills.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {spills.map((spill: any) => (
                                        <div key={spill.id}
                                            className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm overflow-hidden flex flex-col h-full transition-all"
                                            onMouseEnter={e => (e.currentTarget.style.borderColor = `${accent}40`)}
                                            onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--theme-border)")}>
                                            <div className="p-4 sm:p-5 flex-1">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white text-[9px] font-bold shrink-0">
                                                        {initials}
                                                    </div>
                                                    <div>
                                                        <p className="text-[12px] font-bold text-[var(--theme-text-primary)]">@{username}</p>
                                                        <p className="text-[9px] text-[var(--theme-text-muted)]">{new Date(spill.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <p className="text-[12px] text-[var(--theme-text-secondary)] leading-relaxed mb-3 line-clamp-4">{spill.content}</p>
                                                {spill.code && (
                                                    <div className="rounded-xl bg-[#0D1117] border border-[var(--theme-code-border)] overflow-hidden mb-3">
                                                        <pre className="px-3 py-3 text-[10px] text-green-400 font-mono overflow-hidden h-20 relative" style={{ margin: 0 }}>
                                                            <code>{spill.code}</code>
                                                            <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#0D1117] to-transparent pointer-events-none" />
                                                        </pre>
                                                    </div>
                                                )}
                                                {spill.tags && (
                                                    <div className="flex flex-wrap gap-1.5 mt-auto">
                                                        {spill.tags.split(',').slice(0, 3).map((tag: string) => (
                                                            <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full font-medium"
                                                                style={{ background: `${accent}15`, color: accent }}>
                                                                #{tag.trim()}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="px-4 py-3 border-t border-[var(--theme-border-light)] flex flex-wrap items-center gap-4 text-[11px] text-[var(--theme-text-muted)]"
                                                style={{ background: "var(--theme-bg-secondary)" }}>
                                                <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" /> {spill.likes}</span>
                                                <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" /> {spill.comments}</span>
                                                <span className="flex items-center gap-1"><Share2 className="w-3.5 h-3.5" /> {spill.shares}</span>
                                                <span className="flex items-center gap-1 ml-auto"><Eye className="w-3.5 h-3.5" /> {spill.views}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm p-8 text-center flex flex-col items-center">
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3" style={{ background: `${accent}15` }}>
                                        <MessageSquare className="w-5 h-5" style={{ color: accent }} />
                                    </div>
                                    <h3 className="text-[14px] font-bold text-[var(--theme-text-primary)] mb-1">No Spills Yet</h3>
                                    <p className="text-[12px] text-[var(--theme-text-muted)]">This recruiter hasn't posted any spills.</p>
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
