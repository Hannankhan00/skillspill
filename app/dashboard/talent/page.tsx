"use client";

import React, { useState } from "react";

/* ── Tiny SVG icons ── */
function HeartIcon({ filled }: { filled?: boolean }) {
    return filled ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#3CF91A" stroke="#3CF91A" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
    ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
    );
}
function CommentIcon() {
    return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>;
}
function ShareIcon() {
    return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>;
}
function MoreIcon() {
    return <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" /></svg>;
}
function ChevronRightIcon() {
    return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9,18 15,12 9,6" /></svg>;
}
function BoltIcon() {
    return <svg width="14" height="14" viewBox="0 0 24 24" fill="#3CF91A" stroke="#3CF91A" strokeWidth="1"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>;
}
function TrophyIcon() {
    return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3CF91A" strokeWidth="1.8"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></svg>;
}

/* ── Mock Feed Data ── */
const feedPosts = [
    {
        id: 1,
        username: "Byte_Master",
        avatar: "BM",
        tags: ["#Rust", "#Optimization"],
        timeAgo: "2 hours ago",
        content: "Just optimized the recursive search algorithm for the SkillSpill core. Reduced latency by 24% using zero-cost abstractions in Rust. Check out the snippet below! ⚡",
        codeSnippet: `fn optimized_search<T>(data: &[T], query: &T) -> Option<usize>
  where T: PartialEq {
    data.iter().position(|x| x == query)
}`,
        likes: 128,
        comments: 24,
        liked: false,
    },
    {
        id: 2,
        username: "Neon_Cipher",
        avatar: "NC",
        tags: ["#Web3", "#Solidity"],
        timeAgo: "5 hours ago",
        content: "New smart contract for the bounty system is live on testnet. Audits are coming back clean! 🔒",
        codeSnippet: null,
        likes: 87,
        comments: 15,
        liked: true,
    },
    {
        id: 3,
        username: "Zero_Day",
        avatar: "ZD",
        tags: ["#TypeScript", "#React"],
        timeAgo: "8 hours ago",
        content: "Built a real-time collaboration engine using WebSockets and CRDTs. No more merge conflicts in live editing sessions. The future is here. 🚀",
        codeSnippet: `const syncEngine = new CRDTEngine({
  strategy: 'last-writer-wins',
  transport: new WSTransport(url),
  onConflict: (a, b) => merge(a, b)
});`,
        likes: 203,
        comments: 41,
        liked: false,
    },
];

const recentSpills = [
    { title: "Termi-UI Framework", subtitle: "Last updated 3 days ago" },
    { title: "NoSQL-Graph Bridge", subtitle: "Last updated 1 week ago" },
];

const gitHubSyncLogs = [
    { time: "14:02:15", type: "info", message: "Pulling updates from 'origin/main'" },
    { time: "14:02:18", type: "success", message: "Commits synced: 8c72a1e" },
    { time: "14:02:18", type: "info", message: "Indexing new 'spills' found in repository" },
];

const recommendedJobs = [
    {
        title: "Senior Rust Engineer",
        company: "Nebula Systems • Remote",
        tags: ["Rust", "WebAssembly", "DistributedSys"],
        salary: "$150k - $210k",
        isNew: true,
    },
    {
        title: "Full Stack Developer",
        company: "CryptoVault Inc. • Berlin",
        tags: ["TypeScript", "React", "Node.js"],
        salary: "$120k - $180k",
        isNew: false,
    },
];

export default function TalentDashboard() {
    const [feedTab, setFeedTab] = useState<"trending" | "latest">("trending");
    const [likedPosts, setLikedPosts] = useState<Record<number, boolean>>({
        2: true,
    });

    const toggleLike = (id: number) => {
        setLikedPosts((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="min-h-full bg-[#050505]">
            {/* ─── Top Mission Control Header ─── */}
            <div className="border-b border-white/[0.06] bg-[#0A0A0A]/60 backdrop-blur-sm">
                <div className="max-w-[1400px] mx-auto px-6 py-5">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        {/* Left: Title & Status */}
                        <div>
                            <h1
                                className="text-2xl lg:text-3xl font-bold text-white tracking-tight"
                                style={{ fontFamily: "var(--font-space-grotesk)" }}
                            >
                                Mission Control
                            </h1>
                            <p className="text-[12px] text-white/40 mt-1" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>
                                Status: <span className="text-[#3CF91A]">SYSTEM ONLINE</span> • Welcome back,{" "}
                                <span className="text-white/70">Ghost_Protocol</span>
                            </p>
                        </div>

                        {/* Right: Stats Bar */}
                        <div className="flex flex-wrap gap-3">
                            {/* Total XP */}
                            <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg border border-[#3CF91A]/20 bg-[#3CF91A]/[0.04]">
                                <div>
                                    <p className="text-[9px] uppercase tracking-widest text-white/30 font-semibold">Total XP</p>
                                    <p className="text-lg font-bold text-[#3CF91A]" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>
                                        12,450
                                    </p>
                                </div>
                                <div className="flex items-center gap-1.5 ml-2">
                                    <span className="text-[10px] text-white/40">Level 42</span>
                                    <div className="w-12 h-1.5 rounded-full bg-white/10 overflow-hidden">
                                        <div className="w-[70%] h-full rounded-full bg-[#3CF91A]" />
                                    </div>
                                    <span className="text-[10px] text-[#3CF91A]">70%</span>
                                </div>
                            </div>

                            {/* Global Rank */}
                            <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/[0.08] bg-white/[0.02]">
                                <TrophyIcon />
                                <div>
                                    <p className="text-[9px] uppercase tracking-widest text-white/30 font-semibold">Global Rank</p>
                                    <p className="text-base font-bold text-white" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>
                                        Top 2%
                                    </p>
                                </div>
                            </div>

                            {/* Active Bounties */}
                            <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/[0.08] bg-white/[0.02]">
                                <div>
                                    <p className="text-[9px] uppercase tracking-widest text-white/30 font-semibold">Active Bounties</p>
                                    <p className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>
                                        04
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── Main Content Grid ─── */}
            <div className="max-w-[1400px] mx-auto px-6 py-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* ────── LEFT: Developer Feed ────── */}
                    <div className="flex-1 min-w-0">
                        {/* Feed Header */}
                        <div className="flex items-center justify-between mb-5">
                            <h2
                                className="text-lg font-bold text-white flex items-center gap-2"
                                style={{ fontFamily: "var(--font-space-grotesk)" }}
                            >
                                <span className="text-[#3CF91A]">⟩</span> Developer Feed
                            </h2>
                            <div className="flex items-center gap-1 p-0.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                                <button
                                    onClick={() => setFeedTab("trending")}
                                    className={`px-3.5 py-1.5 rounded-md text-[11px] font-semibold transition-all duration-200 border-none cursor-pointer ${feedTab === "trending"
                                            ? "bg-[#3CF91A] text-black"
                                            : "bg-transparent text-white/40 hover:text-white/60"
                                        }`}
                                >
                                    Trending
                                </button>
                                <button
                                    onClick={() => setFeedTab("latest")}
                                    className={`px-3.5 py-1.5 rounded-md text-[11px] font-semibold transition-all duration-200 border-none cursor-pointer ${feedTab === "latest"
                                            ? "bg-[#3CF91A] text-black"
                                            : "bg-transparent text-white/40 hover:text-white/60"
                                        }`}
                                >
                                    Latest
                                </button>
                            </div>
                        </div>

                        {/* Feed Posts */}
                        <div className="space-y-4">
                            {feedPosts.map((post) => (
                                <article
                                    key={post.id}
                                    className="rounded-xl border border-white/[0.06] bg-[#0A0A0A] hover:border-white/[0.1] transition-all duration-300 group"
                                >
                                    {/* Post Header */}
                                    <div className="flex items-center justify-between px-5 pt-4 pb-2">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-10 h-10 rounded-full flex items-center justify-center text-[11px] font-bold border border-[#3CF91A]/30"
                                                style={{
                                                    background: "linear-gradient(135deg, #3CF91A15, #00B8FF10)",
                                                    color: "#3CF91A",
                                                }}
                                            >
                                                {post.avatar}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[13px] font-bold text-white">{post.username}</span>
                                                    <span className="text-[10px] text-white/25">{post.timeAgo}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    {post.tags.map((tag) => (
                                                        <span
                                                            key={tag}
                                                            className="text-[10px] text-[#3CF91A]/60"
                                                            style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <button className="text-white/20 hover:text-white/50 transition-colors bg-transparent border-none cursor-pointer p-1">
                                            <MoreIcon />
                                        </button>
                                    </div>

                                    {/* Post Content */}
                                    <div className="px-5 py-3">
                                        <p className="text-[13px] text-white/70 leading-relaxed">
                                            {post.content}
                                        </p>
                                    </div>

                                    {/* Code Snippet */}
                                    {post.codeSnippet && (
                                        <div className="mx-5 mb-3 rounded-lg overflow-hidden border border-white/[0.06]">
                                            {/* Code header dots */}
                                            <div className="flex items-center gap-1.5 px-3.5 py-2 bg-[#151515] border-b border-white/[0.04]">
                                                <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                                                <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                                                <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
                                            </div>
                                            <pre
                                                className="px-4 py-3 text-[11px] leading-relaxed overflow-x-auto bg-[#0D0D0D] text-[#3CF91A]/80 m-0"
                                                style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
                                            >
                                                <code>{post.codeSnippet}</code>
                                            </pre>
                                        </div>
                                    )}

                                    {/* Post Actions */}
                                    <div className="flex items-center gap-5 px-5 pb-4 pt-1 border-t border-white/[0.04] mt-1">
                                        <button
                                            onClick={() => toggleLike(post.id)}
                                            className="flex items-center gap-1.5 text-[12px] text-white/30 hover:text-[#3CF91A] transition-colors bg-transparent border-none cursor-pointer"
                                        >
                                            <HeartIcon filled={likedPosts[post.id]} />
                                            <span>{post.likes + (likedPosts[post.id] && !post.liked ? 1 : 0)}</span>
                                        </button>
                                        <button className="flex items-center gap-1.5 text-[12px] text-white/30 hover:text-white/60 transition-colors bg-transparent border-none cursor-pointer">
                                            <CommentIcon />
                                            <span>{post.comments}</span>
                                        </button>
                                        <button className="flex items-center gap-1.5 text-[12px] text-white/30 hover:text-white/60 transition-colors bg-transparent border-none cursor-pointer">
                                            <ShareIcon />
                                            <span>Share</span>
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>

                    {/* ────── RIGHT: Sidebar Panels ────── */}
                    <div className="w-full lg:w-[320px] shrink-0 space-y-5">
                        {/* ── Recent Spills ── */}
                        <div className="rounded-xl border border-white/[0.06] bg-[#0A0A0A] overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.04]">
                                <h3 className="text-[12px] font-bold text-white/60 uppercase tracking-wider">Recent Spills</h3>
                                <button className="text-[10px] text-[#3CF91A] hover:underline font-semibold bg-transparent border-none cursor-pointer">
                                    View All
                                </button>
                            </div>
                            <div className="divide-y divide-white/[0.04]">
                                {recentSpills.map((spill, i) => (
                                    <button
                                        key={i}
                                        className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/[0.02] transition-colors group bg-transparent border-none cursor-pointer text-left"
                                    >
                                        <div>
                                            <p className="text-[12px] font-semibold text-white/80 group-hover:text-white transition-colors">
                                                {spill.title}
                                            </p>
                                            <p className="text-[10px] text-white/30 mt-0.5">{spill.subtitle}</p>
                                        </div>
                                        <span className="text-white/20 group-hover:text-[#3CF91A] transition-colors">
                                            <ChevronRightIcon />
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* ── GitHub Sync Live ── */}
                        <div className="rounded-xl border border-white/[0.06] bg-[#0A0A0A] overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.04]">
                                <h3 className="text-[12px] font-bold text-white/60 uppercase tracking-wider flex items-center gap-2">
                                    GitHub Sync Live
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3CF91A] opacity-75" />
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#3CF91A]" />
                                    </span>
                                </h3>
                                <span
                                    className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider"
                                    style={{
                                        background: "#3CF91A20",
                                        color: "#3CF91A",
                                        border: "1px solid #3CF91A30",
                                    }}
                                >
                                    SYNCED
                                </span>
                            </div>
                            <div className="p-3">
                                <div
                                    className="rounded-lg bg-[#0D0D0D] border border-white/[0.04] p-3 space-y-1.5 overflow-x-auto"
                                    style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
                                >
                                    {gitHubSyncLogs.map((log, i) => (
                                        <div key={i} className="flex gap-2 text-[10px] leading-relaxed">
                                            <span className="text-white/20 shrink-0">{log.time}</span>
                                            <span
                                                className={`shrink-0 ${log.type === "success"
                                                        ? "text-[#3CF91A]"
                                                        : "text-[#00D2FF]"
                                                    }`}
                                            >
                                                [{log.type}]
                                            </span>
                                            <span className="text-white/50">
                                                {log.message.includes("8c72a1e") ? (
                                                    <>
                                                        Commits synced:{" "}
                                                        <span className="text-[#3CF91A]">8c72a1e</span>
                                                    </>
                                                ) : log.message.includes("'spills'") ? (
                                                    <>
                                                        Indexing new{" "}
                                                        <span className="text-[#3CF91A]">&apos;spills&apos;</span>{" "}
                                                        found in repository
                                                    </>
                                                ) : (
                                                    <>
                                                        Pulling updates from{" "}
                                                        <span className="text-white/70">&apos;origin/main&apos;</span>
                                                    </>
                                                )}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* ── Recommended Jobs ── */}
                        <div className="rounded-xl border border-white/[0.06] bg-[#0A0A0A] overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.04]">
                                <h3 className="text-[12px] font-bold text-white/60 uppercase tracking-wider">Recommended Jobs</h3>
                            </div>
                            <div className="divide-y divide-white/[0.04]">
                                {recommendedJobs.map((job, i) => (
                                    <div key={i} className="px-4 py-3.5 hover:bg-white/[0.02] transition-colors">
                                        <div className="flex items-start justify-between mb-1.5">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="text-[13px] font-semibold text-white/90">{job.title}</h4>
                                                    {job.isNew && (
                                                        <span
                                                            className="text-[8px] px-1.5 py-0.5 rounded font-bold uppercase"
                                                            style={{
                                                                background: "#3CF91A",
                                                                color: "#000",
                                                            }}
                                                        >
                                                            NEW
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-[10px] text-white/30 mt-0.5">{job.company}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                                            {job.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="text-[9px] px-2 py-0.5 rounded-full border border-white/[0.08] text-white/40 bg-white/[0.02]"
                                                    style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex items-center justify-between mt-3">
                                            <span
                                                className="text-[11px] font-semibold text-white/50"
                                                style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                                            >
                                                {job.salary}
                                            </span>
                                            <button
                                                className="text-[10px] px-3 py-1 rounded font-bold uppercase tracking-wider border-none cursor-pointer transition-all duration-200 hover:scale-105"
                                                style={{
                                                    background: "#3CF91A",
                                                    color: "#000",
                                                    boxShadow: "0 0 10px #3CF91A30",
                                                }}
                                            >
                                                APPLY
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
