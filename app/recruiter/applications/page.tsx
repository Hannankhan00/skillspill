"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";

const accent = "#A855F7";

const applications = [
    {
        id: 1, name: "Sarah Codes", role: "Sr. Rust Engineer", initials: "SC", grad: "from-violet-500 to-purple-600",
        match: 94, status: "Review", appliedAt: "2 hours ago",
        source: "SkillSpill Match", tags: ["Rust", "Systems"]
    },
    {
        id: 2, name: "Rust Wizard", role: "Sr. Rust Engineer", initials: "RW", grad: "from-orange-400 to-red-500",
        match: 91, status: "Interview", appliedAt: "1 day ago",
        source: "Direct Apply", tags: ["C++", "Linux"]
    },
    {
        id: 3, name: "Data Ninja", role: "ML Engineer", initials: "DN", grad: "from-blue-400 to-indigo-500",
        match: 88, status: "Review", appliedAt: "2 days ago",
        source: "Referral", tags: ["Python", "PyTorch"]
    },
    {
        id: 4, name: "Cloud Native", role: "DevOps / SRE Lead", initials: "CN", grad: "from-cyan-400 to-blue-500",
        match: 65, status: "Rejected", appliedAt: "3 days ago",
        source: "Direct Apply", tags: ["Kubernetes", "AWS"]
    }
];

export default function RecruiterApplicationsPage() {
    const [activeFilter, setActiveFilter] = useState("Review");
    const filters = ["All", "Review", "Interview", "Offer", "Rejected"];

    const filtered = activeFilter === "All" ? applications : applications.filter(a => a.status === activeFilter);

    return (
        <div style={{ background: "var(--theme-bg)" }} className="min-h-full flex flex-col">
            <div className="max-w-[1000px] w-full mx-auto px-4 sm:px-6 py-4 pb-24 lg:pb-8 flex-1 flex flex-col">

                {/* HEADER */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 sm:mb-6 shrink-0">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-[var(--theme-text-primary)]">Applicant Tracking</h1>
                        <p className="text-[12px] sm:text-[13px] text-[var(--theme-text-muted)] mt-0.5 sm:mt-1">Manage pipeline across all active jobs</p>
                    </div>
                    <div className="flex bg-[var(--theme-input-bg)] border border-[var(--theme-border)] rounded-xl p-1 shrink-0 w-max sm:w-auto">
                        <button className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-[11px] font-bold bg-[#A855F7]/10 text-[#A855F7] border border-[#A855F7]/30 transition-all cursor-pointer">List</button>
                        <button className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-[11px] font-medium text-[var(--theme-text-muted)] cursor-pointer hover:bg-[var(--theme-bg-secondary)] transition-all bg-transparent border-none">Board</button>
                    </div>
                </div>

                {/* FILTERS TABS */}
                <div className="flex gap-2 lg:gap-3 overflow-x-auto pb-1 lg:pb-0 mb-5 sm:mb-6 border-b border-[var(--theme-border)] scrollbar-none shrink-0 w-[calc(100vw-32px)] sm:w-auto">
                    {filters.map(filter => {
                        const count = filter === "All" ? applications.length : applications.filter(a => a.status === filter).length;
                        return (
                            <button key={filter} onClick={() => setActiveFilter(filter)}
                                className={`px-3 sm:px-5 py-2.5 sm:py-3 text-[11px] sm:text-[13px] font-semibold border-b-2 transition-all cursor-pointer bg-transparent whitespace-nowrap flex items-center gap-1.5
                                    ${activeFilter === filter ? "border-purple-500 text-[#A855F7]" : "border-transparent text-[var(--theme-text-muted)] hover:text-[var(--theme-text-tertiary)]"}`}>
                                {filter}
                                <span className={`text-[8px] sm:text-[9px] px-1.5 py-0.5 rounded-full font-bold
                                    ${activeFilter === filter ? "bg-[#A855F7]/20 text-[#A855F7]" : "bg-[var(--theme-input-bg)] text-[var(--theme-text-muted)]"}`}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* PIPELINE LIST */}
                <div className="space-y-3 sm:space-y-4">
                    {filtered.map(app => (
                        <div key={app.id} className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm p-4 sm:p-5 hover:border-[#A855F7]/30 transition-all cursor-pointer group flex flex-col md:flex-row md:items-center gap-4">

                            {/* APPLICANT BASE INFO */}
                            <div className="flex items-start md:items-center gap-3 w-full md:w-[250px] shrink-0">
                                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br ${app.grad} flex items-center justify-center text-white text-[12px] font-bold shrink-0 shadow-sm border border-[var(--theme-surface)]`}>
                                    {app.initials}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between md:hidden mb-0.5">
                                        <div className="px-2 py-0.5 rounded-lg text-[9px] font-bold flex items-center gap-1 shrink-0" style={{ background: `linear-gradient(135deg, ${accent}20, ${accent}05)`, color: accent, border: `1px solid ${accent}30` }}>
                                            <Sparkles className="w-3 h-3 inline-block" /> {app.match}%
                                        </div>
                                    </div>
                                    <p className="text-[13px] sm:text-[15px] font-bold text-[var(--theme-text-primary)] truncate">{app.name}</p>
                                    <p className="text-[9px] sm:text-[10px] text-[var(--theme-text-muted)] uppercase tracking-wider mt-0.5">{app.source}</p>
                                </div>
                            </div>

                            {/* ROLE INFO */}
                            <div className="flex-1 w-full bg-[var(--theme-input-bg)] rounded-xl py-2 sm:py-3 px-3 sm:px-4 border border-[var(--theme-border-light)] break-words lg:mx-4">
                                <p className="text-[12px] sm:text-[14px] font-bold text-[var(--theme-text-secondary)] truncate">{app.role}</p>
                                <div className="flex items-center justify-between mt-1 sm:mt-1.5">
                                    <p className="text-[9px] sm:text-[11px] text-[var(--theme-text-muted)] font-medium">Applied {app.appliedAt}</p>
                                    <div className="flex gap-1">
                                        {app.tags.map(t => (
                                            <span key={t} className="px-1.5 py-0.5 rounded text-[8px] bg-[var(--theme-card)] text-[var(--theme-text-tertiary)] border border-[var(--theme-border)]">{t}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* ACTIONS / STATUS */}
                            <div className="flex items-center justify-between md:justify-end gap-2 sm:gap-4 shrink-0 mt-2 md:mt-0 pt-3 md:pt-0 border-t md:border-none border-[var(--theme-border-light)]">

                                {/* DESKTOP MATCH */}
                                <div className="hidden md:flex flex-col items-center">
                                    <div className="px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-bold flex flex-col justify-center min-w-[70px] text-center shrink-0" style={{ background: `linear-gradient(135deg, ${accent}20, ${accent}05)`, color: accent, border: `1px solid ${accent}30` }}>
                                        <span><Sparkles className="w-3 h-3 inline-block" /> {app.match}%</span>
                                    </div>
                                    <span className="text-[8px] mt-1 font-bold tracking-widest text-[#A855F7] uppercase uppercase">Match</span>
                                </div>

                                <div className="w-px h-8 bg-[var(--theme-border)] mx-1 hidden min-[1100px]:block"></div>

                                <span className={`text-[10px] sm:text-[11px] font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl flex justify-center flex-1 md:flex-none md:min-w-[100px] border shrink-0 transition-colors
                                    ${app.status === "Review" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                                        app.status === "Interview" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                                            app.status === "Rejected" ? "bg-red-500/10 text-red-500 border-red-500/20" :
                                                "bg-green-500/10 text-green-500 border-green-500/20"}`}>
                                    {app.status}
                                </span>

                                <button className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center bg-[var(--theme-input-bg)] border border-[var(--theme-border-light)] text-[var(--theme-text-muted)] hover:text-[#A855F7] hover:border-[#A855F7]/40 transition-all shrink-0 cursor-pointer">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
                                </button>
                            </div>
                        </div>
                    ))}

                    {filtered.length === 0 && (
                        <div className="py-12 sm:py-16 text-center rounded-2xl border-2 border-dashed border-[var(--theme-border)]">
                            <p className="text-[13px] sm:text-[15px] font-bold text-[var(--theme-text-secondary)]">No applications found in this stage.</p>
                            <p className="text-[11px] sm:text-[12px] mt-1 text-[var(--theme-text-muted)]">Check back later or adjust your jobs.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
