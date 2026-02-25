"use client";

import React, { useState } from "react";
import Link from "next/link";

/* ===== SKILLSPILL - MY SPILLS ===== */

/* -- Mock Data -- */
const mySpills = [
    {
        id: 1,
        content: "Just shipped a recursive search optimizer in Rust \u2014 24% latency reduction using zero-cost abstractions. Sometimes the compiler really is your best friend. \u26A1",
        code: `fn optimized_search<T: PartialEq>(data: &[T], query: &T) -> Option<usize> {
    data.iter().position(|item| item == query)
}

// Benchmark: 0.8ms avg on 1M items
// Previous: 1.05ms \u2014 24% improvement`,
        codeLang: "rust",
        tags: ["Rust", "Performance", "Algorithms"],
        likes: 128,
        comments: 24,
        shares: 8,
        views: 2341,
        time: "2h ago",
        status: "published",
    },
    {
        id: 2,
        content: "Built a real-time collaborative editor using CRDTs. The conflict resolution is surprisingly elegant when you get the data structures right. Here's the sync engine core:",
        code: `const syncEngine = new CRDTEngine({
  strategy: 'last-writer-wins',
  vectorClock: true,
  transport: new WSTransport(url),
  onConflict: (local, remote) => {
    return merge(local, remote, { preserveIntent: true });
  }
});`,
        codeLang: "typescript",
        tags: ["TypeScript", "WebSockets", "CRDTs"],
        likes: 203,
        comments: 41,
        shares: 28,
        views: 4567,
        time: "1d ago",
        status: "published",
    },
    {
        id: 3,
        content: "Hot take: TypeScript's type system is basically a functional programming language that generates JavaScript as a side effect. Change my mind. \uD83E\uDD2F",
        code: null,
        codeLang: null,
        tags: ["TypeScript", "Opinion"],
        likes: 456,
        comments: 78,
        shares: 92,
        views: 12043,
        time: "3d ago",
        status: "published",
    },
    {
        id: 4,
        content: "Working on a new algorithm for distributed consensus in edge computing environments. Early results are promising \u2014 60% reduction in message rounds.",
        code: null,
        codeLang: null,
        tags: ["Distributed Systems", "Research"],
        likes: 0,
        comments: 0,
        shares: 0,
        views: 0,
        time: "Just now",
        status: "draft",
    },
    {
        id: 5,
        content: "My deep-dive into WebAssembly memory management is almost complete. Covering linear memory, grow patterns, and inter-module communication.",
        code: null,
        codeLang: null,
        tags: ["WebAssembly", "Memory", "Article"],
        likes: 0,
        comments: 0,
        shares: 0,
        views: 0,
        time: "2d ago",
        status: "draft",
    },
];

const statsOverview = {
    totalSpills: 23,
    totalViews: 48210,
    totalLikes: 1847,
    totalComments: 312,
    avgEngagement: "8.4%",
    topSpill: "TypeScript hot take",
};

const accent = "#3CF91A";

export default function TalentSpillsPage() {
    const [activeFilter, setActiveFilter] = useState("All");
    const [composerOpen, setComposerOpen] = useState(false);
    const [composerText, setComposerText] = useState("");
    const [composerCode, setComposerCode] = useState("");
    const [showCode, setShowCode] = useState(false);
    const filters = ["All", "Published", "Drafts"];

    const filteredSpills = activeFilter === "All"
        ? mySpills
        : activeFilter === "Published"
            ? mySpills.filter(s => s.status === "published")
            : mySpills.filter(s => s.status === "draft");

    return (
        <div style={{ background: "var(--theme-bg)" }} className="min-h-full">
            <div className="max-w-[800px] mx-auto px-4 sm:px-6 py-5 pb-20 lg:pb-8">

                {/* ===== HEADER ===== */}
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-[var(--theme-text-primary)]">My Spills</h1>
                        <p className="text-[12px] text-[var(--theme-text-muted)] mt-0.5">Manage and create your code spills</p>
                    </div>
                    <button
                        onClick={() => setComposerOpen(!composerOpen)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-bold border-none cursor-pointer transition-all hover:scale-105"
                        style={{ background: accent, color: "#000", boxShadow: `0 0 15px ${accent}40` }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                        New Spill
                    </button>
                </div>

                {/* ===== COMPOSER (expandable) ===== */}
                {composerOpen && (
                    <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm p-4 sm:p-5 mb-5 animate-in">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-[#2edb13] flex items-center justify-center text-white text-[11px] font-bold shrink-0">GP</div>
                            <div>
                                <p className="text-[13px] font-bold text-[var(--theme-text-primary)]">Ghost_Protocol</p>
                                <p className="text-[10px] text-[var(--theme-text-muted)]">Public spill to your followers</p>
                            </div>
                        </div>

                        <textarea
                            value={composerText}
                            onChange={e => setComposerText(e.target.value)}
                            placeholder="What did you build today? Share your code, insights, or hot takes..."
                            className="w-full min-h-[100px] p-3 rounded-xl bg-[var(--theme-bg-secondary)] border border-[var(--theme-border)] text-[13px] text-[var(--theme-text-secondary)] placeholder:text-[var(--theme-text-muted)] resize-none outline-none focus:border-[#3CF91A] focus:ring-2 focus:ring-[#3CF91A]/10 transition-all"
                        />

                        {showCode && (
                            <textarea
                                value={composerCode}
                                onChange={e => setComposerCode(e.target.value)}
                                placeholder="Paste your code snippet here..."
                                className="w-full min-h-[120px] p-3 mt-2 rounded-xl bg-[#0D1117] border border-[var(--theme-code-border)] text-[12px] text-green-400 placeholder:text-[var(--theme-text-tertiary)] font-mono resize-none outline-none focus:border-[#3CF91A] transition-all"
                            />
                        )}

                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--theme-border-light)]">
                            <div className="flex items-center gap-2">
                                <button onClick={() => setShowCode(!showCode)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium border cursor-pointer transition-all
                                        ${showCode ? "bg-[#3CF91A]/10 border-[#3CF91A]/20 text-[#2edb13]" : "bg-[var(--theme-card)] border-[var(--theme-border)] text-[var(--theme-text-muted)] hover:text-[var(--theme-text-secondary)] hover:bg-[var(--theme-bg-secondary)]"}`}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
                                    Code
                                </button>
                                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium border border-[var(--theme-border)] bg-[var(--theme-card)] text-[var(--theme-text-muted)] hover:text-[var(--theme-text-secondary)] hover:bg-[var(--theme-bg-secondary)] cursor-pointer transition-all">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                                    Image
                                </button>
                                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium border border-[var(--theme-border)] bg-[var(--theme-card)] text-[var(--theme-text-muted)] hover:text-[var(--theme-text-secondary)] hover:bg-[var(--theme-bg-secondary)] cursor-pointer transition-all">
                                    #
                                    Tags
                                </button>
                            </div>
                            <div className="flex gap-2">
                                <button className="px-3 py-1.5 rounded-lg text-[11px] font-medium border border-[var(--theme-border)] bg-[var(--theme-card)] text-[var(--theme-text-muted)] hover:bg-[var(--theme-bg-secondary)] cursor-pointer transition-all">
                                    Save Draft
                                </button>
                                <button className="px-4 py-1.5 rounded-lg text-[11px] font-bold border-none cursor-pointer text-black transition-all hover:scale-105"
                                    style={{ background: accent }}>
                                    Publish Spill
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ===== STATS OVERVIEW ===== */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                    {[
                        { label: "Total Spills", value: statsOverview.totalSpills, icon: "\uD83D\uDCDD" },
                        { label: "Total Views", value: statsOverview.totalViews.toLocaleString(), icon: "\uD83D\uDC41" },
                        { label: "Total Likes", value: statsOverview.totalLikes.toLocaleString(), icon: "\u2764\uFE0F" },
                        { label: "Engagement", value: statsOverview.avgEngagement, icon: "\uD83D\uDCCA" },
                    ].map(stat => (
                        <div key={stat.label} className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm p-3 sm:p-4 text-center">
                            <p className="text-lg">{stat.icon}</p>
                            <p className="text-base sm:text-lg font-bold text-[var(--theme-text-primary)] mt-1">{stat.value}</p>
                            <p className="text-[9px] text-[var(--theme-text-muted)] uppercase tracking-wider">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* ===== FILTER TABS ===== */}
                <div className="flex gap-0 border-b border-[var(--theme-border)] mb-4">
                    {filters.map(filter => {
                        const count = filter === "All" ? mySpills.length : filter === "Published" ? mySpills.filter(s => s.status === "published").length : mySpills.filter(s => s.status === "draft").length;
                        return (
                            <button key={filter} onClick={() => setActiveFilter(filter)}
                                className={`px-4 sm:px-5 py-2.5 text-[12px] font-semibold border-b-2 transition-all cursor-pointer bg-transparent flex items-center gap-1.5
                                    ${activeFilter === filter ? "border-[#3CF91A] text-[#2edb13]" : "border-transparent text-[var(--theme-text-muted)] hover:text-[var(--theme-text-tertiary)]"}`}>
                                {filter}
                                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold
                                    ${activeFilter === filter ? "bg-[#3CF91A]/10 text-[#2edb13]" : "bg-[var(--theme-input-bg)] text-[var(--theme-text-muted)]"}`}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* ===== SPILLS LIST ===== */}
                <div className="space-y-4">
                    {filteredSpills.map(spill => (
                        <article key={spill.id} className={`rounded-2xl border bg-[var(--theme-card)] shadow-sm overflow-hidden transition-all hover:shadow-md
                            ${spill.status === "draft" ? "border-dashed border-amber-500/40" : "border-[var(--theme-border)]"}`}>

                            {/* Draft badge */}
                            {spill.status === "draft" && (
                                <div className="px-4 py-1.5 border-b flex items-center justify-between" style={{ background: 'var(--theme-badge-bg)', borderColor: 'var(--theme-border)' }}>
                                    <span className="text-[10px] font-bold text-amber-500 flex items-center gap-1">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                        DRAFT
                                    </span>
                                    <button className="text-[10px] font-medium text-amber-500 hover:text-amber-400 cursor-pointer bg-transparent border-none">
                                        Continue Editing &rarr;
                                    </button>
                                </div>
                            )}

                            <div className="p-4 sm:p-5">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-[#2edb13] flex items-center justify-center text-white text-[10px] font-bold">GP</div>
                                        <div>
                                            <p className="text-[13px] font-bold text-[var(--theme-text-primary)]">Ghost_Protocol</p>
                                            <p className="text-[10px] text-[var(--theme-text-muted)]">{spill.time}</p>
                                        </div>
                                    </div>

                                    {/* Actions dropdown */}
                                    <div className="flex items-center gap-1">
                                        {spill.status === "published" && (
                                            <span className="text-[9px] font-medium px-2 py-0.5 rounded-full bg-green-500/15 text-green-500 hidden sm:inline-block">Published</span>
                                        )}
                                        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--theme-text-muted)] hover:text-[var(--theme-text-secondary)] hover:bg-[var(--theme-input-bg)] cursor-pointer bg-transparent border-none transition-all">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" /></svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Content */}
                                <p className="text-[13px] text-[var(--theme-text-secondary)] leading-relaxed mb-3">{spill.content}</p>

                                {/* Code block */}
                                {spill.code && (
                                    <div className="rounded-xl bg-[#0D1117] border border-[var(--theme-code-border)] overflow-hidden mb-3">
                                        <div className="flex items-center justify-between px-3 py-1.5 bg-[#161B22] border-b border-[var(--theme-code-border)]">
                                            <span className="text-[10px] text-[var(--theme-text-muted)] font-mono">{spill.codeLang}</span>
                                            <button className="text-[9px] text-[var(--theme-text-muted)] hover:text-[var(--theme-text-tertiary)] cursor-pointer bg-transparent border-none transition-colors">
                                                Copy
                                            </button>
                                        </div>
                                        <pre className="px-3 py-3 text-[11px] sm:text-[12px] text-green-400 font-mono overflow-x-auto leading-relaxed" style={{ margin: 0 }}>
                                            <code>{spill.code}</code>
                                        </pre>
                                    </div>
                                )}

                                {/* Tags */}
                                <div className="flex flex-wrap gap-1.5 mb-3">
                                    {spill.tags.map(tag => (
                                        <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full bg-[#3CF91A]/10 text-[#2edb13] font-medium">#{tag}</span>
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
                                            <button className="text-[10px] font-medium text-[var(--theme-text-muted)] hover:text-[#2edb13] cursor-pointer bg-transparent border-none transition-colors flex items-center gap-1">
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                                Edit
                                            </button>
                                            <span style={{ color: 'var(--theme-text-muted)' }}>&middot;</span>
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
                                        <button className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-[11px] font-bold border-none cursor-pointer text-black transition-all hover:scale-105"
                                            style={{ background: accent }}>
                                            Publish Now
                                        </button>
                                        <button className="px-4 py-2 rounded-xl text-[11px] font-medium border border-[var(--theme-border)] bg-[var(--theme-card)] text-[var(--theme-text-tertiary)] cursor-pointer hover:bg-[var(--theme-bg-secondary)] transition-all">
                                            Edit
                                        </button>
                                        <button className="px-3 py-2 rounded-xl text-[11px] font-medium border border-[var(--theme-border)] bg-[var(--theme-card)] text-red-400 cursor-pointer hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 transition-all ml-auto">
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
                    <div className="rounded-2xl border border-dashed bg-[var(--theme-card)] p-8 text-center" style={{ borderColor: 'var(--theme-border)' }}>
                        <p className="text-3xl mb-2">{"\uD83D\uDCDD"}</p>
                        <p className="text-[14px] font-bold text-[var(--theme-text-secondary)] mb-1">No spills yet</p>
                        <p className="text-[12px] text-[var(--theme-text-muted)] mb-4">Start sharing your code, insights, and hot takes</p>
                        <button onClick={() => setComposerOpen(true)}
                            className="px-5 py-2.5 rounded-xl text-[12px] font-bold border-none cursor-pointer text-black transition-all hover:scale-105"
                            style={{ background: accent, boxShadow: `0 0 15px ${accent}40` }}>
                            Create Your First Spill
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
