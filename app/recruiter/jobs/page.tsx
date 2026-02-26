"use client";

import React, { useState } from "react";
import { Briefcase, CircleDot, Users, Target, Plus, Search, Filter, MoreHorizontal, MapPin, DollarSign, Clock, LayoutGrid, List } from "lucide-react";

export default function RecruiterJobsPage() {
    const accent = "#A855F7";
    const [activeTab, setActiveTab] = useState("All");
    const [viewMode, setViewMode] = useState<"grid" | "list">("list");

    // Mock data for jobs
    const jobs = [
        {
            id: 1,
            title: "Senior Rust Systems Engineer",
            department: "Engineering",
            type: "Full-Time",
            location: "Remote",
            budget: "$140k - $180k",
            applicants: 42,
            daysLeft: 12,
            tags: ["Rust", "Systems", "WebAssembly"],
            status: "Active",
            posted: "2 days ago",
            matchRate: 88,
        },
        {
            id: 2,
            title: "Lead Frontend Developer",
            department: "Product",
            type: "Full-Time",
            location: "New York, NY",
            budget: "$130k - $160k",
            applicants: 28,
            daysLeft: 5,
            tags: ["React", "TypeScript", "Tailwind"],
            status: "Active",
            posted: "1 week ago",
            matchRate: 92,
        },
        {
            id: 3,
            title: "Machine Learning Engineer",
            department: "Data",
            type: "Contract",
            location: "Remote",
            budget: "$80 - $120 / hr",
            applicants: 15,
            daysLeft: 0,
            tags: ["Python", "PyTorch", "LLMs"],
            status: "Closed",
            posted: "1 month ago",
            matchRate: 75,
        },
        {
            id: 4,
            title: "Product Designer (UI/UX)",
            department: "Design",
            type: "Full-Time",
            location: "London, UK",
            budget: "£70k - £90k",
            applicants: 0,
            daysLeft: 30,
            tags: ["Figma", "Design Systems", "Prototyping"],
            status: "Draft",
            posted: "Just now",
            matchRate: 0,
        }
    ];

    const filteredJobs = jobs.filter(j => activeTab === "All" || j.status === activeTab);

    return (
        <div className="min-h-full" style={{ background: 'var(--theme-bg)' }}>
            <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-4 pb-24 lg:pb-8">

                {/* HEADER */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--theme-text-primary)] fade-up">Jobs</h1>
                        <p className="text-[12px] sm:text-[13px] text-[var(--theme-text-muted)] mt-0.5 sm:mt-1.5">Manage job postings and attract top talent</p>
                    </div>
                    <button className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-[12px] font-bold text-white transition-all hover:scale-105 border-none cursor-pointer"
                        style={{ background: `linear-gradient(135deg, ${accent}, #7C3AED)`, boxShadow: `0 0 20px ${accent}40` }}>
                        <Plus className="w-4 h-4" />
                        Post New Job
                    </button>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
                    {[
                        { label: "Total Jobs", value: jobs.length, color: "text-[#A855F7]", bg: "bg-[#A855F7]/10", border: "border-[#A855F7]/20", icon: <Briefcase className="w-5 h-5 text-[#A855F7]" /> },
                        { label: "Active Postings", value: jobs.filter(j => j.status === "Active").length, color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/20", icon: <CircleDot className="w-5 h-5 text-green-500" /> },
                        { label: "Total Applicants", value: "85", color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20", icon: <Users className="w-5 h-5 text-blue-500" /> },
                        { label: "Avg Match", value: "85%", color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20", icon: <Target className="w-5 h-5 text-orange-500" /> }
                    ].map((stat, i) => (
                        <div key={i} className={`rounded-2xl border ${stat.border} ${stat.bg} p-4 flex flex-col items-center sm:items-start text-center sm:text-left transition-all hover:shadow-md cursor-default`}>
                            <div className="flex items-center justify-between w-full mb-3">
                                <p className="text-[10px] sm:text-[11px] font-semibold text-[var(--theme-text-muted)] uppercase tracking-widest">{stat.label}</p>
                                <div className="hidden sm:block">{stat.icon}</div>
                            </div>
                            <p className={`text-2xl sm:text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* FILTERS & TABS */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-5">
                    <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
                        {["All", "Active", "Draft", "Closed"].map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-xl text-[12px] font-bold transition-all border whitespace-nowrap cursor-pointer ${activeTab === tab
                                        ? "bg-[#A855F7] text-white border-transparent shadow-md shadow-purple-500/20"
                                        : "bg-[var(--theme-input-bg)] text-[var(--theme-text-muted)] border-[var(--theme-border)] hover:bg-[var(--theme-bg-secondary)] hover:text-[var(--theme-text-primary)]"
                                    }`}>
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                        <div className="flex items-center gap-2 bg-[var(--theme-input-bg)] px-3 py-2 rounded-xl border border-[var(--theme-border)] flex-1 sm:w-[200px] focus-within:border-[#A855F7]/40 focus-within:ring-2 focus-within:ring-purple-50 transition-all">
                            <Search className="w-4 h-4 text-[var(--theme-text-muted)]" />
                            <input type="text" placeholder="Search jobs..." className="bg-transparent border-none outline-none text-[12px] w-full text-[var(--theme-text-primary)]" />
                        </div>
                        <div className="flex items-center gap-1 bg-[var(--theme-input-bg)] p-1 rounded-xl border border-[var(--theme-border)]">
                            <button onClick={() => setViewMode("list")} className={`p-1.5 rounded-lg transition-colors cursor-pointer border-none ${viewMode === "list" ? "bg-[var(--theme-bg)] text-[var(--theme-text-primary)] shadow-sm" : "bg-transparent text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)]"}`}>
                                <List className="w-4 h-4" />
                            </button>
                            <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded-lg transition-colors cursor-pointer border-none ${viewMode === "grid" ? "bg-[var(--theme-bg)] text-[var(--theme-text-primary)] shadow-sm" : "bg-transparent text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)]"}`}>
                                <LayoutGrid className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* JOBS LIST */}
                <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "flex flex-col gap-4"}>
                    {filteredJobs.length === 0 ? (
                        <div className={`col-span-full py-16 text-center border-2 border-dashed border-[var(--theme-border)] rounded-2xl bg-[var(--theme-card)]`}>
                            <Briefcase className="w-12 h-12 text-[var(--theme-text-muted)] mx-auto mb-3 opacity-50" />
                            <p className="text-[14px] font-bold text-[var(--theme-text-secondary)]">No jobs found</p>
                            <p className="text-[12px] text-[var(--theme-text-muted)] mt-1">Try adjusting your filters or post a new job.</p>
                        </div>
                    ) : (
                        filteredJobs.map(job => (
                            <div key={job.id} className={`bg-[var(--theme-card)] border border-[var(--theme-border)] rounded-2xl p-4 sm:p-5 transition-all hover:border-[#A855F7]/40 hover:shadow-md group relative overflow-hidden ${viewMode === "grid" ? "flex flex-col" : "flex flex-col sm:flex-row sm:items-center gap-4"}`}>

                                {/* Status border top/left */}
                                <div className={`absolute left-0 top-0 ${viewMode === "grid" ? "w-full h-1" : "w-1 h-full"} ${job.status === "Active" ? "bg-green-500" :
                                        job.status === "Draft" ? "bg-orange-500" : "bg-[var(--theme-text-muted)]"
                                    }`} />

                                <div className="flex-1 min-w-0 z-10">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="min-w-0 pr-4">
                                            <div className="flex items-center gap-2 mb-1 cursor-pointer">
                                                <h3 className="text-[15px] sm:text-[16px] font-bold text-[var(--theme-text-primary)] truncate transition-colors group-hover:text-[#A855F7]">{job.title}</h3>
                                                {job.status === "Active" && <span className="flex w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] shrink-0"></span>}
                                            </div>
                                            <p className="text-[12px] text-[var(--theme-text-muted)] truncate">{job.department} &bull; {job.type}</p>
                                        </div>
                                        <button className="text-[var(--theme-text-muted)] hover:text-[#A855F7] transition-colors bg-transparent border-none cursor-pointer p-1 shrink-0">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-medium text-[var(--theme-text-tertiary)] mt-3">
                                        <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#A855F7]" /> {job.location}</span>
                                        <span className="flex items-center gap-1.5 text-green-600 dark:text-green-500"><DollarSign className="w-3.5 h-3.5" /> {job.budget}</span>
                                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-[var(--theme-text-muted)]" /> {job.posted}</span>
                                    </div>

                                    <div className="flex flex-wrap gap-1.5 mt-4">
                                        {job.tags.map(tag => (
                                            <span key={tag} className="text-[10px] px-2 py-1 rounded-md bg-[var(--theme-input-bg)] text-[var(--theme-text-secondary)] border border-[var(--theme-border)] hover:bg-[#A855F7]/10 hover:text-[#A855F7] hover:border-[#A855F7]/30 transition-colors cursor-default">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className={`flex items-center gap-3 sm:gap-6 mt-4 sm:mt-0 z-10 ${viewMode === "grid" ? "pt-4 border-t border-[var(--theme-border-light)] justify-between" : "pl-0 sm:pl-4 sm:border-l border-[var(--theme-border-light)] sm:justify-end"}`}>
                                    <div className="flex items-center gap-6 sm:gap-8">
                                        <div className="text-center sm:text-right">
                                            <p className="text-[16px] font-bold text-[var(--theme-text-primary)]">{job.applicants}</p>
                                            <p className="text-[10px] text-[var(--theme-text-muted)] uppercase tracking-wider mt-0.5">Applicants</p>
                                        </div>
                                        {job.status === "Active" && job.matchRate > 0 && (
                                            <div className="text-center sm:text-right">
                                                <p className="text-[16px] font-bold text-[#A855F7] flex items-center justify-center sm:justify-end gap-1"><Target className="w-3.5 h-3.5" /> {job.matchRate}%</p>
                                                <p className="text-[10px] text-[var(--theme-text-muted)] uppercase tracking-wider mt-0.5">Avg Match</p>
                                            </div>
                                        )}
                                    </div>
                                    <button className="px-4 py-2 rounded-xl text-[11px] font-bold text-[#A855F7] bg-[#A855F7]/10 transition-all hover:bg-purple-600 hover:text-white cursor-pointer border border-[#A855F7]/20 hover:border-purple-600 whitespace-nowrap">
                                        View
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

            </div>
        </div>
    );
}
