"use client";

import React, { useState } from "react";
import Link from "next/link";

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   S K I L L S P I L L  â€”  R E C R U I T E R  S P I L L S
   Recruiter spills management page
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

/* â”€â”€ Mock Data â”€â”€ */
const mySpills = [
    {
        id: 1,
        content: "ðŸš€ We just opened a Senior Rust Systems Engineer bounty on SkillSpill! Looking for someone passionate about zero-cost abstractions and high-performance systems. $15k budget. Let's connect!",
        type: "bounty",
        bountyInfo: { title: "Senior Rust Systems Engineer", budget: "$15,000", applicants: 23, daysLeft: 12 },
        tags: ["Hiring", "Rust", "Systems Engineering"],
        likes: 89,
        comments: 14,
        shares: 12,
        views: 3241,
        time: "3h ago",
        status: "published",
    },
    {
        id: 2,
        content: "Just closed our Full-Stack Lead position in record time â€” 8 days from posting to hire! SkillSpill's skills-first approach made it incredibly easy to find the right candidate. The match score was 94% and the hire has been exceptional. ðŸ’œ\n\nHere's our hiring process breakdown:",
        type: "update",
        code: `// Our hiring pipeline on SkillSpill
const pipeline = {
  step1: "Post bounty with skill requirements",
  step2: "AI-powered candidate matching",
  step3: "Review code spills & GitHub activity",
  step4: "Skills assessment challenge",
  step5: "Culture fit interview",
  result: "Hired in 8 days! ðŸŽ‰"
};`,
        codeLang: "javascript",
        bountyInfo: null,
        tags: ["Hiring Success", "SkillSpill", "Full-Stack"],
        likes: 234,
        comments: 42,
        shares: 31,
        views: 8923,
        time: "2d ago",
        status: "published",
    },
    {
        id: 3,
        content: "Hot take: The best engineering hires I've made weren't from the most prestigious companies â€” they were from open-source contributors with deep domain expertise. Skills > Pedigree. ðŸŽ¯\n\nStop filtering by company names and start looking at actual code contributions.",
        type: "thought",
        code: null,
        codeLang: null,
        bountyInfo: null,
        tags: ["Recruiting", "Opinion", "Open Source"],
        likes: 567,
        comments: 93,
        shares: 85,
        views: 21043,
        time: "5d ago",
        status: "published",
    },
    {
        id: 4,
        content: "ðŸ”¥ New bounty coming soon: We're looking for a Staff ML Engineer to lead our computer vision team. Competitive budget, fully remote, and an incredible tech stack.\n\nStay tuned or DM me for early access to the posting.",
        type: "teaser",
        code: null,
        codeLang: null,
        bountyInfo: null,
        tags: ["ML", "Computer Vision", "Coming Soon"],
        likes: 0,
        comments: 0,
        shares: 0,
        views: 0,
        time: "Just now",
        status: "draft",
    },
    {
        id: 5,
        content: "Data dump: Our 2024 engineering hiring report is ready. Key findings:\n- Average time-to-hire: 11 days\n- Skills match accuracy: 92%\n- Candidate satisfaction: 4.8/5\n- 60% of hires from non-traditional backgrounds",
        type: "report",
        code: null,
        codeLang: null,
        bountyInfo: null,
        tags: ["Report", "Data", "Hiring Trends"],
        likes: 0,
        comments: 0,
        shares: 0,
        views: 0,
        time: "1d ago",
        status: "draft",
    },
];

const statsOverview = {
    totalSpills: 18,
    totalViews: 67230,
    totalLikes: 2341,
    avgEngagement: "12.1%",
};

const accent = "#A855F7";

export default function RecruiterSpillsPage() {
    const [activeFilter, setActiveFilter] = useState("All");
    const [composerOpen, setComposerOpen] = useState(false);
    const [composerText, setComposerText] = useState("");
    const [composerCode, setComposerCode] = useState("");
    const [showCode, setShowCode] = useState(false);
    const [postType, setPostType] = useState<"update" | "bounty" | "thought">("update");
    const filters = ["All", "Published", "Drafts"];

    const filteredSpills = activeFilter === "All"
        ? mySpills
        : activeFilter === "Published"
            ? mySpills.filter(s => s.status === "published")
            : mySpills.filter(s => s.status === "draft");

    const typeIcons: Record<string, string> = {
        bounty: "ðŸ’¼",
        update: "ðŸ“¢",
        thought: "ðŸ’­",
        teaser: "ðŸ”¥",
        report: "ðŸ“Š",
    };

    return (
        <div style={{ background: "var(--theme-bg)" }} className="min-h-full">
            <div className="max-w-[800px] mx-auto px-4 sm:px-6 py-5 pb-20 lg:pb-8">

                {/* â•â•â•â•â•â•â•â• HEADER â•â•â•â•â•â•â•â• */}
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-[var(--theme-text-primary)]">My Spills</h1>
                        <p className="text-[12px] text-[var(--theme-text-muted)] mt-0.5">Share updates, bounties, and hiring insights</p>
                    </div>
                    <button
                        onClick={() => setComposerOpen(!composerOpen)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-bold text-white border-none cursor-pointer transition-all hover:scale-105"
                        style={{ background: `linear-gradient(135deg, ${accent}, #7C3AED)`, boxShadow: `0 0 15px ${accent}40` }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                        New Spill
                    </button>
                </div>

                {/* â•â•â•â•â•â•â•â• COMPOSER â•â•â•â•â•â•â•â• */}
                {composerOpen && (
                    <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm p-4 sm:p-5 mb-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-violet-600 flex items-center justify-center text-white text-[11px] font-bold shrink-0">RC</div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[13px] font-bold text-[var(--theme-text-primary)]">Recruiter</p>
                                <p className="text-[10px] text-[var(--theme-text-muted)]">TechForge Solutions</p>
                            </div>
                        </div>

                        {/* Post type selector */}
                        <div className="flex gap-2 mb-3">
                            {([["update", "ðŸ“¢ Update"], ["bounty", "ðŸ’¼ Bounty"], ["thought", "ðŸ’­ Thought"]] as const).map(([type, label]) => (
                                <button key={type} onClick={() => setPostType(type)}
                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold border cursor-pointer transition-all
                                        ${postType === type ? "bg-purple-50 border-purple-200 text-purple-700" : "bg-[var(--theme-card)] border-[var(--theme-border)] text-[var(--theme-text-muted)] hover:bg-[var(--theme-bg-secondary)]"}`}>
                                    {label}
                                </button>
                            ))}
                        </div>

                        <textarea
                            value={composerText}
                            onChange={e => setComposerText(e.target.value)}
                            placeholder={postType === "bounty" ? "Describe the role you're hiring for..." : postType === "thought" ? "Share your recruiting insights and hot takes..." : "Share a hiring update or company news..."}
                            className="w-full min-h-[100px] p-3 rounded-xl bg-[var(--theme-bg-secondary)] border border-[var(--theme-border)] text-[13px] text-[var(--theme-text-secondary)] placeholder:text-[var(--theme-text-muted)] resize-none outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-50 transition-all"
                        />

                        {showCode && (
                            <textarea
                                value={composerCode}
                                onChange={e => setComposerCode(e.target.value)}
                                placeholder="Paste a code snippet or tech stack..."
                                className="w-full min-h-[100px] p-3 mt-2 rounded-xl bg-gray-900 border border-gray-700 text-[12px] text-purple-400 placeholder:text-[var(--theme-text-tertiary)] font-mono resize-none outline-none focus:border-purple-500 transition-all"
                            />
                        )}

                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--theme-border-light)]">
                            <div className="flex items-center gap-2">
                                <button onClick={() => setShowCode(!showCode)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium border cursor-pointer transition-all
                                        ${showCode ? "bg-purple-50 border-purple-200 text-purple-700" : "bg-[var(--theme-card)] border-[var(--theme-border)] text-[var(--theme-text-muted)] hover:bg-[var(--theme-bg-secondary)]"}`}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
                                    Code
                                </button>
                                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium border border-[var(--theme-border)] bg-[var(--theme-card)] text-[var(--theme-text-muted)] hover:bg-[var(--theme-bg-secondary)] cursor-pointer transition-all">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                                    Image
                                </button>
                                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium border border-[var(--theme-border)] bg-[var(--theme-card)] text-[var(--theme-text-muted)] hover:bg-[var(--theme-bg-secondary)] cursor-pointer transition-all">
                                    # Tags
                                </button>
                            </div>
                            <div className="flex gap-2">
                                <button className="px-3 py-1.5 rounded-lg text-[11px] font-medium border border-[var(--theme-border)] bg-[var(--theme-card)] text-[var(--theme-text-muted)] hover:bg-[var(--theme-bg-secondary)] cursor-pointer transition-all">
                                    Save Draft
                                </button>
                                <button className="px-4 py-1.5 rounded-lg text-[11px] font-bold text-white border-none cursor-pointer transition-all hover:scale-105"
                                    style={{ background: `linear-gradient(135deg, ${accent}, #7C3AED)` }}>
                                    Publish Spill
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* â•â•â•â•â•â•â•â• STATS OVERVIEW â•â•â•â•â•â•â•â• */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                    {[
                        { label: "Total Spills", value: statsOverview.totalSpills, icon: "ðŸ“" },
                        { label: "Total Views", value: statsOverview.totalViews.toLocaleString(), icon: "ðŸ‘" },
                        { label: "Total Likes", value: statsOverview.totalLikes.toLocaleString(), icon: "â¤ï¸" },
                        { label: "Engagement", value: statsOverview.avgEngagement, icon: "ðŸ“Š" },
                    ].map(stat => (
                        <div key={stat.label} className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm p-3 sm:p-4 text-center">
                            <p className="text-lg">{stat.icon}</p>
                            <p className="text-base sm:text-lg font-bold text-[var(--theme-text-primary)] mt-1">{stat.value}</p>
                            <p className="text-[9px] text-[var(--theme-text-muted)] uppercase tracking-wider">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* â•â•â•â•â•â•â•â• FILTER TABS â•â•â•â•â•â•â•â• */}
                <div className="flex gap-0 border-b border-[var(--theme-border)] mb-4">
                    {filters.map(filter => {
                        const count = filter === "All" ? mySpills.length : filter === "Published" ? mySpills.filter(s => s.status === "published").length : mySpills.filter(s => s.status === "draft").length;
                        return (
                            <button key={filter} onClick={() => setActiveFilter(filter)}
                                className={`px-4 sm:px-5 py-2.5 text-[12px] font-semibold border-b-2 transition-all cursor-pointer bg-transparent flex items-center gap-1.5
                                    ${activeFilter === filter ? "border-purple-500 text-purple-600" : "border-transparent text-[var(--theme-text-muted)] hover:text-[var(--theme-text-tertiary)]"}`}>
                                {filter}
                                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold
                                    ${activeFilter === filter ? "bg-purple-100 text-purple-700" : "bg-[var(--theme-input-bg)] text-[var(--theme-text-muted)]"}`}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* â•â•â•â•â•â•â•â• SPILLS LIST â•â•â•â•â•â•â•â• */}
                <div className="space-y-4">
                    {filteredSpills.map(spill => (
                        <article key={spill.id} className={`rounded-2xl border bg-[var(--theme-card)] shadow-sm overflow-hidden transition-all hover:shadow-md
                            ${spill.status === "draft" ? "border-dashed border-amber-300" : "border-[var(--theme-border)]"}`}>

                            {/* Draft badge */}
                            {spill.status === "draft" && (
                                <div className="px-4 py-1.5 bg-amber-50 border-b border-amber-200 flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-amber-700 flex items-center gap-1">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                        DRAFT
                                    </span>
                                    <button className="text-[10px] font-medium text-amber-600 hover:text-amber-800 cursor-pointer bg-transparent border-none">
                                        Continue Editing â†’
                                    </button>
                                </div>
                            )}

                            <div className="p-4 sm:p-5">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-violet-600 flex items-center justify-center text-white text-[10px] font-bold">RC</div>
                                        <div>
                                            <div className="flex items-center gap-1.5">
                                                <p className="text-[13px] font-bold text-[var(--theme-text-primary)]">Recruiter</p>
                                                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700 font-medium">{typeIcons[spill.type]} {spill.type}</span>
                                            </div>
                                            <p className="text-[10px] text-[var(--theme-text-muted)]">{spill.time} â€¢ TechForge Solutions</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {spill.status === "published" && (
                                            <span className="text-[9px] font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700 hidden sm:inline-block">Published</span>
                                        )}
                                        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--theme-text-muted)] hover:text-[var(--theme-text-secondary)] hover:bg-[var(--theme-input-bg)] cursor-pointer bg-transparent border-none transition-all">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" /></svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Content */}
                                <p className="text-[13px] text-[var(--theme-text-secondary)] leading-relaxed mb-3 whitespace-pre-line">{spill.content}</p>

                                {/* Bounty card (inline) */}
                                {spill.bountyInfo && (
                                    <div className="rounded-xl border border-purple-200 bg-gradient-to-r from-purple-50 to-violet-50 p-3.5 mb-3">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="text-[13px] font-bold text-[var(--theme-text-primary)]">{spill.bountyInfo.title}</p>
                                                <p className="text-[12px] font-semibold text-purple-600 mt-0.5">{spill.bountyInfo.budget}</p>
                                            </div>
                                            <span className="text-[9px] font-bold px-2 py-1 rounded-full bg-green-100 text-green-700">Active</span>
                                        </div>
                                        <div className="flex items-center gap-4 mt-2 text-[10px] text-[var(--theme-text-muted)]">
                                            <span className="flex items-center gap-1">
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
                                                {spill.bountyInfo.applicants} applicants
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                                {spill.bountyInfo.daysLeft} days left
                                            </span>
                                        </div>
                                        <button className="mt-2.5 px-4 py-1.5 rounded-lg text-[10px] font-bold text-white border-none cursor-pointer hover:scale-105 transition-all"
                                            style={{ background: `linear-gradient(135deg, ${accent}, #7C3AED)` }}>
                                            View Bounty â†’
                                        </button>
                                    </div>
                                )}

                                {/* Code block */}
                                {spill.code && (
                                    <div className="rounded-xl bg-[#0D1117] border border-gray-800 overflow-hidden mb-3">
                                        <div className="flex items-center justify-between px-3 py-1.5 bg-[#161B22] border-b border-gray-800">
                                            <span className="text-[10px] text-[var(--theme-text-muted)] font-mono">{spill.codeLang}</span>
                                            <button className="text-[9px] text-[var(--theme-text-muted)] hover:text-gray-300 cursor-pointer bg-transparent border-none transition-colors">
                                                Copy
                                            </button>
                                        </div>
                                        <pre className="px-3 py-3 text-[11px] sm:text-[12px] text-purple-400 font-mono overflow-x-auto leading-relaxed" style={{ margin: 0 }}>
                                            <code>{spill.code}</code>
                                        </pre>
                                    </div>
                                )}

                                {/* Tags */}
                                <div className="flex flex-wrap gap-1.5 mb-3">
                                    {spill.tags.map(tag => (
                                        <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 font-medium">#{tag}</span>
                                    ))}
                                </div>

                                {/* Stats */}
                                {spill.status === "published" && (
                                    <div className="flex items-center justify-between pt-3 border-t border-[var(--theme-border-light)]">
                                        <div className="flex items-center gap-4 sm:gap-5 text-[11px] text-[var(--theme-text-muted)]">
                                            <span className="flex items-center gap-1">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
                                                {spill.likes}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                                                {spill.comments}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></svg>
                                                {spill.shares}
                                            </span>
                                            <span className="flex items-center gap-1 hidden sm:flex">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                                {spill.views.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <button className="text-[10px] font-medium text-[var(--theme-text-muted)] hover:text-purple-600 cursor-pointer bg-transparent border-none transition-colors flex items-center gap-1">
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                                Edit
                                            </button>
                                            <span className="text-gray-200">Â·</span>
                                            <button className="text-[10px] font-medium text-[var(--theme-text-muted)] hover:text-red-500 cursor-pointer bg-transparent border-none transition-colors flex items-center gap-1">
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Draft actions */}
                                {spill.status === "draft" && (
                                    <div className="flex items-center gap-2 pt-3 border-t border-[var(--theme-border-light)]">
                                        <button className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-[11px] font-bold text-white border-none cursor-pointer transition-all hover:scale-105"
                                            style={{ background: `linear-gradient(135deg, ${accent}, #7C3AED)` }}>
                                            Publish Now
                                        </button>
                                        <button className="px-4 py-2 rounded-xl text-[11px] font-medium border border-[var(--theme-border)] bg-[var(--theme-card)] text-[var(--theme-text-tertiary)] cursor-pointer hover:bg-[var(--theme-bg-secondary)] transition-all">
                                            Edit
                                        </button>
                                        <button className="px-3 py-2 rounded-xl text-[11px] font-medium border border-[var(--theme-border)] bg-[var(--theme-card)] text-red-400 cursor-pointer hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all ml-auto">
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </article>
                    ))}
                </div>

                {/* Empty state */}
                {filteredSpills.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-gray-300 bg-[var(--theme-card)] p-8 text-center">
                        <p className="text-3xl mb-2">ðŸ“¢</p>
                        <p className="text-[14px] font-bold text-[var(--theme-text-secondary)] mb-1">No spills yet</p>
                        <p className="text-[12px] text-[var(--theme-text-muted)] mb-4">Start sharing bounties, hiring updates, and insights</p>
                        <button onClick={() => setComposerOpen(true)}
                            className="px-5 py-2.5 rounded-xl text-[12px] font-bold text-white border-none cursor-pointer transition-all hover:scale-105"
                            style={{ background: `linear-gradient(135deg, ${accent}, #7C3AED)`, boxShadow: `0 0 15px ${accent}40` }}>
                            Create Your First Spill
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
