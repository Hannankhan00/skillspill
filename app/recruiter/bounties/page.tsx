"use client";

import React, { useState } from "react";
import Link from "next/link";

const accent = "#A855F7";

const bounties = [
    {
        id: 1, title: "Senior Rust Systems Engineer", budget: "$15,000",
        applicants: 23, daysLeft: 12, tags: ["Rust", "Systems", "Performance"],
        status: "Active", posted: "March 12, 2024"
    },
    {
        id: 2, title: "Full-Stack Lead (React + Node)", budget: "$12,000",
        applicants: 34, daysLeft: 8, tags: ["React", "Node.js", "TypeScript"],
        status: "Active", posted: "March 10, 2024"
    },
    {
        id: 3, title: "ML Engineer — Computer Vision", budget: "$18,000",
        applicants: 15, daysLeft: 20, tags: ["Python", "PyTorch", "CV"],
        status: "Active", posted: "March 15, 2024"
    },
    {
        id: 4, title: "DevOps / SRE Lead", budget: "$14,000",
        applicants: 19, daysLeft: 5, tags: ["Kubernetes", "AWS", "Terraform"],
        status: "Draft", posted: "Not published"
    },
    {
        id: 5, title: "Frontend Specialist (WebGL)", budget: "$10,000",
        applicants: 45, daysLeft: 0, tags: ["WebGL", "Three.js", "React"],
        status: "Closed", posted: "February 20, 2024"
    }
];

export default function RecruiterBountiesPage() {
    const [activeTab, setActiveTab] = useState("All");
    const tabs = ["All", "Active", "Drafts", "Closed"];

    const filteredBounties = activeTab === "All"
        ? bounties
        : bounties.filter(b => b.status === (activeTab === "Drafts" ? "Draft" : activeTab));

    return (
        <div style={{ background: "var(--theme-bg)" }} className="min-h-full">
            <div className="max-w-[1000px] mx-auto px-4 sm:px-6 py-4 pb-24 lg:pb-8">

                {/* HEADER */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 sm:mb-6">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-[var(--theme-text-primary)]">Bounties Engine</h1>
                        <p className="text-[12px] sm:text-[13px] text-[var(--theme-text-muted)] mt-0.5 sm:mt-1">Manage active jobs and review applicants</p>
                    </div>
                    <button className="flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 rounded-xl text-[12px] font-bold text-white border-none cursor-pointer transition-all hover:scale-105 shadow-lg w-full sm:w-auto"
                        style={{ background: `linear-gradient(135deg, ${accent}, #7C3AED)`, boxShadow: `0 0 15px ${accent}40` }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                        Deploy New Bounty
                    </button>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-5 md:mb-6">
                    {[
                        { label: "Total Bounties", value: bounties.length, color: "text-[#A855F7]", bg: "bg-[#A855F7]/10", border: "border-[#A855F7]/20", icon: "💼" },
                        { label: "Active Nodes", value: bounties.filter(b => b.status === "Active").length, color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/20", icon: "🟢" },
                        { label: "Total Applicants", value: "91", color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20", icon: "👥" },
                        { label: "Avg Match", value: "88%", color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20", icon: "🎯" }
                    ].map(stat => (
                        <div key={stat.label} className={`rounded-xl border ${stat.border} ${stat.bg} p-3 sm:p-4 transition-all hover:scale-[1.02] flex items-center gap-2`}>
                            <div className="text-xl sm:text-2xl">{stat.icon}</div>
                            <div>
                                <p className={`text-[16px] sm:text-[20px] font-black ${stat.color} tracking-tight leading-none`}>{stat.value}</p>
                                <p className="text-[9px] sm:text-[10px] font-bold text-[var(--theme-text-primary)] uppercase tracking-wider mt-1">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* TABS */}
                <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0 mb-5 md:mb-6 border-b border-[var(--theme-border)] scrollbar-none">
                    {tabs.map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)}
                            className={`px-4 sm:px-6 py-2.5 sm:py-3 text-[11px] sm:text-[13px] font-semibold border-b-2 transition-all cursor-pointer bg-transparent whitespace-nowrap
                                ${activeTab === tab ? "border-purple-500 text-[#A855F7]" : "border-transparent text-[var(--theme-text-muted)] hover:text-[var(--theme-text-tertiary)]"}`}>
                            {tab}
                        </button>
                    ))}
                </div>

                {/* BOUNTIES LIST */}
                <div className="space-y-3 md:space-y-4">
                    {filteredBounties.map(bounty => (
                        <div key={bounty.id} className="flex flex-col rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm p-4 sm:p-5 transition-all hover:border-[#A855F7]/40 hover:shadow-md group relative">

                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1.5 w-full sm:w-auto overflow-hidden">
                                        <h3 className="text-[14px] sm:text-[16px] font-bold text-[var(--theme-text-primary)] truncate">{bounty.title}</h3>
                                        {bounty.status === "Active" && <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse relative blur-[1px] shrink-0"></span>}
                                        {bounty.status === "Active" && <span className="w-2 h-2 rounded-full bg-green-500 absolute ml-[2px] right-4 sm:right-auto sm:ml-2 sm:relative shrink-0"></span>}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-[12px] text-[var(--theme-text-muted)] font-medium mb-3">
                                        <span className="text-[#A855F7] bg-[#A855F7]/10 px-2 py-0.5 rounded-md font-bold shrink-0">{bounty.budget}</span>
                                        <span>·</span>
                                        <span className="flex items-center gap-1.5 shrink-0">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                                            {bounty.posted}
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap gap-1.5 md:gap-2 mb-3 lg:mb-0">
                                        {bounty.tags.map(tag => (
                                            <span key={tag} className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest px-2 sm:px-2.5 py-1 rounded-lg bg-[var(--theme-input-bg)] border border-[var(--theme-border-light)] text-[var(--theme-text-tertiary)] group-hover:border-[#A855F7]/20 transition-all truncate">{tag}</span>
                                        ))}
                                    </div>
                                </div>

                                {/* META ACTIONS */}
                                <div className="flex flex-col sm:flex-row lg:flex-col lg:items-end justify-between items-start sm:items-center gap-3 md:gap-4 border-t lg:border-t-0 border-[var(--theme-border-light)] pt-3 lg:pt-0 shrink-0">
                                    <div className="flex flex-row gap-4 sm:gap-6 text-left sm:text-center lg:text-right w-full sm:w-auto">
                                        <div className="flex-1 sm:flex-none">
                                            <p className="text-[14px] sm:text-[18px] font-bold text-[var(--theme-text-primary)]">{bounty.applicants}</p>
                                            <p className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-[var(--theme-text-muted)]">Applicants</p>
                                        </div>
                                        <div className="w-px h-8 bg-[var(--theme-border)] hidden sm:block overflow-hidden" />
                                        <div className="flex-1 sm:flex-none border-l sm:border-none border-[var(--theme-border)] pl-4 sm:pl-0">
                                            <p className="text-[14px] sm:text-[18px] font-bold text-[var(--theme-text-primary)]">{bounty.daysLeft > 0 ? bounty.daysLeft : "—"}</p>
                                            <p className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-[var(--theme-text-muted)]">Days Left</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 w-full sm:w-auto">
                                        <Link href="/recruiter/applications" className="flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-[11px] font-bold text-white border-none cursor-pointer hover:scale-105 transition-all text-center"
                                            style={{ background: `linear-gradient(135deg, ${accent}, #7C3AED)`, boxShadow: `0 0 10px ${accent}30` }}>
                                            Review
                                        </Link>
                                        <button className="p-2 sm:p-2.5 flex items-center justify-center rounded-xl bg-[var(--theme-input-bg)] hover:bg-[var(--theme-bg-secondary)] border border-[var(--theme-border)] text-[var(--theme-text-secondary)] transition-all cursor-pointer">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* MATCH HIGHLIGHT */}
                            {bounty.status === "Active" && (
                                <div className="mt-3 md:mt-4 p-2.5 sm:p-3 rounded-xl bg-[var(--theme-input-bg)] border border-[var(--theme-border-light)] flex items-center justify-between">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-[7px] sm:text-[8px] font-bold text-white shrink-0">SC</div>
                                        <p className="text-[10px] sm:text-[11px] text-[var(--theme-text-secondary)] truncate">
                                            <span className="font-bold text-[var(--theme-text-primary)]">Sarah Codes</span> is a 94% match.
                                        </p>
                                    </div>
                                    <button className="text-[9px] sm:text-[10px] font-bold text-[#A855F7] shrink-0 hover:underline cursor-pointer bg-transparent border-none flex items-center gap-1">Invite <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7" /></svg></button>
                                </div>
                            )}

                        </div>
                    ))}

                    {filteredBounties.length === 0 && (
                        <div className="py-12 text-center rounded-2xl border-2 border-dashed border-[var(--theme-border)]">
                            <p className="text-[13px] font-bold text-[var(--theme-text-secondary)]">No bounties found</p>
                            <p className="text-[11px] text-[var(--theme-text-muted)] mt-1">Deploy a new bounty to discover elite talent.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
