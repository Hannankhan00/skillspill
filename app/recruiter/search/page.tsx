"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Loader2 } from "lucide-react";

const accent = "#A855F7";

const gradients = [
    "from-violet-500 to-purple-600",
    "from-orange-400 to-red-500",
    "from-blue-400 to-indigo-500",
    "from-cyan-400 to-blue-500",
    "from-emerald-400 to-teal-500",
    "from-pink-400 to-rose-500"
];

function getInitials(name: string) {
    if (!name) return "??";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
}

export default function RecruiterSearchPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeFilter, setActiveFilter] = useState("All");
    const [talents, setTalents] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch("/api/talents")
            .then(res => res.json())
            .then(data => {
                if (data.talents) {
                    const mappedTalents = data.talents.map((t: any, index: number) => ({
                        id: t.id,
                        name: t.fullName || "Unknown",
                        username: t.username || "unknown",
                        role: t.talentProfile?.experienceLevel ? `${t.talentProfile.experienceLevel} Developer` : "Developer",
                        initials: getInitials(t.fullName || "Unknown"),
                        grad: gradients[index % gradients.length],
                        match: Math.floor(Math.random() * 20) + 75, // Mock match score
                        location: t.talentProfile?.location || "Remote",
                        experience: t.talentProfile?.experienceLevel || "Mid-Level",
                        skills: t.talentProfile?.skills?.map((s: any) => s.skillName) || [],
                        headline: t.talentProfile?.bio || "Passionate about building software.",
                        available: t.talentProfile?.isAvailable !== false,
                    }));
                    setTalents(mappedTalents);
                }
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Failed to load talents", err);
                setIsLoading(false);
            });
    }, []);

    const filteredCandidates = talents.filter(candidate => {
        const matchesSearch = searchTerm === "" ||
            candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            candidate.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            candidate.skills.some((s: string) => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
            candidate.role.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesSearch;
    });

    return (
        <div style={{ background: "var(--theme-bg)" }} className="min-h-full flex flex-col">
            <div className="max-w-[1000px] w-full mx-auto px-4 sm:px-6 py-4 pb-24 lg:pb-8 flex-1 flex flex-col">

                {/* HEADER */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--theme-text-primary)]">Talent Search</h1>
                        <p className="text-[12px] sm:text-[13px] text-[var(--theme-text-muted)] mt-0.5 sm:mt-1.5">Find the perfect match for your active jobs</p>
                    </div>
                </div>

                {/* SEARCH & FILTERS */}
                <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm p-3 sm:p-5 mb-5 lg:mb-6">
                    <div className="flex flex-col lg:flex-row gap-3 sm:gap-4">
                        <div className="flex-1 relative">
                            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by name, hacker alias, role, or skills..."
                                className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl text-[13px] bg-[var(--theme-input-bg)] border border-[var(--theme-border)] text-[var(--theme-text-primary)] outline-none focus:border-[#A855F7]/40 focus:ring-2 focus:ring-purple-50 transition-all"
                            />
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none shrink-0 w-full lg:w-auto">
                            {["All", "Full-Stack", "Frontend", "Backend", "ML/AI"].map(f => (
                                <button key={f} onClick={() => setActiveFilter(f)}
                                    className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-[12px] font-semibold whitespace-nowrap transition-all border cursor-pointer
                                        ${activeFilter === f ? "bg-[#A855F7]/10 border-[#A855F7]/30 text-[#A855F7]" : "bg-[var(--theme-card)] border-[var(--theme-border)] text-[var(--theme-text-tertiary)] hover:bg-[var(--theme-bg-secondary)]"}`}>
                                    {f}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RESULTS */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center flex-1 p-10">
                        <Loader2 className="w-8 h-8 text-[#A855F7] animate-spin mb-4" />
                        <p className="text-[13px] text-[var(--theme-text-muted)] font-medium">Loading talents...</p>
                    </div>
                ) : filteredCandidates.length === 0 ? (
                    <div className="flex flex-col items-center justify-center flex-1 p-10 text-center bg-[var(--theme-card)] border border-[var(--theme-border)] rounded-2xl">
                        <div className="w-16 h-16 rounded-full bg-[var(--theme-bg-secondary)] flex items-center justify-center mb-4">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--theme-text-muted)]"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                        </div>
                        <h3 className="text-[15px] font-bold text-[var(--theme-text-primary)] mb-1">No talents found</h3>
                        <p className="text-[13px] text-[var(--theme-text-muted)]">Adjust your search or filters to find more candidates.</p>
                    </div>
                ) : (
                    <div className="space-y-3 sm:space-y-4">
                        {filteredCandidates.map(candidate => (
                            <div key={candidate.id} className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm p-4 sm:p-5 hover:border-[#A855F7]/30 transition-all group">
                                <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 lg:gap-5">

                                    {/* AVATAR */}
                                    <div className="flex justify-between items-start sm:block">
                                        <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${candidate.grad} flex items-center justify-center text-white text-[14px] sm:text-[18px] font-bold shrink-0 shadow-inner`}>
                                            {candidate.initials}
                                        </div>
                                        <div className="sm:hidden text-right">
                                            <div className="flex items-center gap-1.5 justify-end mb-1">
                                                {candidate.available && (
                                                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 uppercase tracking-widest border border-green-500/20">Open</span>
                                                )}
                                            </div>
                                            <div className="px-2 py-0.5 rounded-lg text-[10px] sm:text-[11px] font-bold flex items-center gap-1" style={{ background: `linear-gradient(135deg, ${accent}20, ${accent}05)`, color: accent, border: `1px solid ${accent}30` }}>
                                                <Sparkles className="w-3 h-3 inline-block" /> {candidate.match}% Match
                                            </div>
                                        </div>
                                    </div>

                                    {/* INFO */}
                                    <div className="flex-1 min-w-0">
                                        <div className="hidden sm:flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                                            <div className="flex items-center gap-2">
                                                <h2 className="text-[15px] sm:text-[17px] font-bold text-[var(--theme-text-primary)] truncate">{candidate.name} <span className="text-[12px] font-medium text-[var(--theme-text-muted)] ml-2">@{candidate.username}</span></h2>
                                                {candidate.available && (
                                                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 uppercase tracking-widest border border-green-500/20">Open</span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1.5 shrink-0">
                                                {/* Match Pill */}
                                                <div className="px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-bold flex items-center gap-1" style={{ background: `linear-gradient(135deg, ${accent}20, ${accent}05)`, color: accent, border: `1px solid ${accent}30` }}>
                                                    <Sparkles className="w-3 h-3 inline-block" /> {candidate.match}% Match
                                                </div>
                                            </div>
                                        </div>

                                        <h2 className="text-[15px] font-bold text-[var(--theme-text-primary)] sm:hidden mb-0.5">{candidate.name} <span className="text-[11px] font-medium text-[var(--theme-text-muted)]">@{candidate.username}</span></h2>
                                        <p className="text-[12px] sm:text-[13px] font-medium text-[var(--theme-text-secondary)] mb-1.5 sm:mb-2">{candidate.role}</p>
                                        <p className="text-[12px] sm:text-[13px] text-[var(--theme-text-muted)] mb-3 leading-relaxed hidden sm:block">{candidate.headline}</p>

                                        {/* META */}
                                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[10px] sm:text-[11px] text-[var(--theme-text-tertiary)] mb-3 sm:mb-4">
                                            <span className="flex items-center gap-1 sm:gap-1.5"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>{candidate.location}</span>
                                            <span className="flex items-center gap-1 sm:gap-1.5"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>{candidate.experience}</span>
                                        </div>

                                        {/* SKILLS */}
                                        <div className="flex flex-wrap gap-1.5 sm:gap-2 sm:pt-4 sm:border-t border-[var(--theme-border-light)] relative">
                                            <span className="hidden lg:block absolute -top-2 left-0 text-[9px] uppercase tracking-widest font-semibold text-[var(--theme-text-muted)] bg-[var(--theme-card)] pr-2">Top Skills</span>
                                            {candidate.skills.slice(0, 5).map((s: string) => (
                                                <span key={s} className="px-2 py-0.5 sm:py-1 rounded-md text-[9px] sm:text-[10px] font-medium bg-[var(--theme-input-bg)] text-[var(--theme-text-secondary)] border border-[var(--theme-border-light)]">{s}</span>
                                            ))}
                                            {candidate.skills.length > 5 && (
                                                <span className="px-2 py-0.5 sm:py-1 rounded-md text-[9px] sm:text-[10px] font-medium bg-[var(--theme-input-bg)] text-[var(--theme-text-secondary)] border border-[var(--theme-border-light)]">+{candidate.skills.length - 5}</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* ACTIONS */}
                                    <div className="sm:ml-auto flex flex-row sm:flex-col gap-2 shrink-0 w-full sm:w-auto mt-3 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-none border-[var(--theme-border-light)]">
                                        <Link href={`/talent/profile/${candidate.id}`} className="flex-1 sm:w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-[12px] font-bold text-white border-none cursor-pointer transition-all hover:scale-105 flex items-center justify-center"
                                            style={{ background: `linear-gradient(135deg, ${accent}, #7C3AED)`, boxShadow: `0 0 15px ${accent}40` }}>
                                            Profile
                                        </Link>
                                        <button className="flex-1 sm:w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-[11px] sm:text-[12px] font-medium border border-[var(--theme-border)] bg-[var(--theme-card)] text-[var(--theme-text-secondary)] cursor-pointer hover:bg-[var(--theme-bg-secondary)] transition-all">
                                            Message
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}

