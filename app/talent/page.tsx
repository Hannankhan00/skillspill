"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

/* ═══════════════════════════════════════════════
   S K I L L S P I L L  —  T A L E N T  D A S H B O A R D
   Light Theme Edition
   ═══════════════════════════════════════════════ */

/* ── SVG Icons ── */
function HeartIcon({ filled }: { filled?: boolean }) {
    return filled ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#16A34A" stroke="#16A34A" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
    ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
    );
}
function CommentIcon() {
    return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>;
}
function ShareIcon() {
    return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></svg>;
}
function MoreIcon() {
    return <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" /></svg>;
}

/* ── Animated typing text ── */
function TerminalText({ text, speed = 40 }: { text: string; speed?: number }) {
    const [displayed, setDisplayed] = useState("");
    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            if (i <= text.length) {
                setDisplayed(text.slice(0, i));
                i++;
            } else {
                clearInterval(interval);
            }
        }, speed);
        return () => clearInterval(interval);
    }, [text, speed]);
    return (
        <span>
            {displayed}
            <span className="animate-pulse text-emerald-500">▋</span>
        </span>
    );
}

/* ── Stat card ── */
function StatCard({ label, value, subtext, color, lightBg, icon }: {
    label: string; value: string; subtext?: string; color: string; lightBg: string; icon: React.ReactNode;
}) {
    return (
        <div
            className="relative overflow-hidden rounded-2xl border p-5 group hover:scale-[1.02] hover:shadow-lg transition-all duration-300 cursor-default"
            style={{
                borderColor: `${color}25`,
                background: lightBg,
            }}
        >
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                    <span
                        className="text-[9px] font-bold uppercase tracking-[3px]"
                        style={{ color: `${color}BB`, fontFamily: "var(--font-jetbrains-mono)" }}
                    >
                        {label}
                    </span>
                    <span style={{ color: `${color}80` }}>{icon}</span>
                </div>
                <p
                    className="text-3xl font-black tracking-tight"
                    style={{ color, fontFamily: "var(--font-space-grotesk)" }}
                >
                    {value}
                </p>
                {subtext && (
                    <p className="text-[10px] text-gray-400 mt-1.5" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>
                        {subtext}
                    </p>
                )}
            </div>
        </div>
    );
}

/* ── Mock Data ── */
const feedPosts = [
    {
        id: 1,
        username: "Byte_Master",
        avatar: "BM",
        avatarGradient: "from-green-400 to-emerald-600",
        tags: ["#Rust", "#Optimization"],
        timeAgo: "2h ago",
        content: "Just optimized the recursive search algorithm for the SkillSpill core. Reduced latency by 24% using zero-cost abstractions in Rust. Check out the snippet below! ⚡",
        codeSnippet: `fn optimized_search<T>(data: &[T], query: &T) -> Option<usize>
  where T: PartialEq {
    data.iter().position(|x| x == query)
}`,
        codeLang: "rust",
        likes: 128,
        comments: 24,
        liked: false,
    },
    {
        id: 2,
        username: "Neon_Cipher",
        avatar: "NC",
        avatarGradient: "from-purple-400 to-violet-600",
        tags: ["#Web3", "#Solidity"],
        timeAgo: "5h ago",
        content: "New smart contract for the bounty system is live on testnet. Audits are coming back clean! 🔒 Gas costs down 40% from the previous iteration.",
        codeSnippet: null,
        codeLang: null,
        likes: 87,
        comments: 15,
        liked: true,
    },
    {
        id: 3,
        username: "Zero_Day",
        avatar: "ZD",
        avatarGradient: "from-cyan-400 to-blue-600",
        tags: ["#TypeScript", "#React"],
        timeAgo: "8h ago",
        content: "Built a real-time collaboration engine using WebSockets and CRDTs. No more merge conflicts in live editing sessions. The future is here. 🚀",
        codeSnippet: `const syncEngine = new CRDTEngine({
  strategy: 'last-writer-wins',
  transport: new WSTransport(url),
  onConflict: (a, b) => merge(a, b)
});`,
        codeLang: "typescript",
        likes: 203,
        comments: 41,
        liked: false,
    },
];

const quickActions = [
    { label: "Browse Jobs", href: "/talent/jobs", icon: "💼", desc: "Find your next mission" },
    { label: "Skill Tree", href: "/talent/skill-tree", icon: "🌳", desc: "Level up abilities" },
    { label: "My Spills", href: "/talent/spills", icon: "📝", desc: "Your code shares" },
    { label: "Settings", href: "/talent/settings", icon: "⚙️", desc: "Manage account" },
];

const recentActivity = [
    { icon: "🔥", text: "You gained 250 XP from your latest spill", time: "2h ago", color: "#16A34A" },
    { icon: "👀", text: "Nebula Systems viewed your profile", time: "4h ago", color: "#0EA5E9" },
    { icon: "🏆", text: "Reached Top 2% global ranking", time: "1d ago", color: "#EAB308" },
    { icon: "💬", text: "3 new comments on your Rust optimization post", time: "1d ago", color: "#8B5CF6" },
    { icon: "📬", text: "New job match: Senior React Engineer at CryptoVault", time: "2d ago", color: "#EF4444" },
];

const trendingSkills = [
    { name: "Rust", growth: "+24%", level: 85 },
    { name: "TypeScript", growth: "+18%", level: 92 },
    { name: "WebAssembly", growth: "+31%", level: 45 },
    { name: "Solidity", growth: "+12%", level: 68 },
];

const leaderboard = [
    { rank: 1, name: "Phantom_X", xp: "24,800", badge: "🥇" },
    { rank: 2, name: "Byte_Master", xp: "21,350", badge: "🥈" },
    { rank: 3, name: "Zero_Day", xp: "19,200", badge: "🥉" },
    { rank: 4, name: "Ghost_Protocol", xp: "12,450", badge: "⭐", isYou: true },
];

/* ═══════════════ MAIN DASHBOARD ═══════════════ */
export default function TalentDashboard() {
    const [feedTab, setFeedTab] = useState<"trending" | "latest">("trending");
    const [likedPosts, setLikedPosts] = useState<Record<number, boolean>>({ 2: true });
    const [currentTime, setCurrentTime] = useState("");

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString("en-US", { hour12: false }));
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    const toggleLike = (id: number) => {
        setLikedPosts((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 6) return "Night Owl Mode";
        if (hour < 12) return "Good Morning";
        if (hour < 17) return "Good Afternoon";
        if (hour < 21) return "Good Evening";
        return "Night Owl Mode";
    };

    return (
        <div className="min-h-full bg-[#F5F5F7]">
            {/* ═══════════════════════════════════════
                HERO / WELCOME SECTION
               ═══════════════════════════════════════ */}
            <div className="relative overflow-hidden">
                {/* Soft gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-cyan-50" />

                <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 pt-6 pb-8">
                    {/* Greeting + Time */}
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
                        <div>
                            <p
                                className="text-[10px] font-bold uppercase tracking-[4px] text-emerald-500 mb-2"
                                style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                            >
                                MISSION CONTROL // {getGreeting().toUpperCase()}
                            </p>
                            <h1
                                className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 tracking-tight"
                                style={{ fontFamily: "var(--font-space-grotesk)" }}
                            >
                                <TerminalText text="Welcome back, Ghost_Protocol" speed={35} />
                            </h1>
                            <p className="text-[12px] text-gray-400 mt-2" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>
                                System Status: <span className="text-emerald-500">ONLINE</span> • Uptime: 847d 14h 22m • {currentTime && (
                                    <span className="text-gray-500">{currentTime}</span>
                                )}
                            </p>
                        </div>

                        {/* XP Progress Ring */}
                        <div className="flex items-center gap-4 px-5 py-3 rounded-2xl border border-emerald-200 bg-white shadow-sm">
                            <div className="relative w-14 h-14">
                                <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                                    <circle cx="28" cy="28" r="24" fill="none" stroke="#E5E7EB" strokeWidth="4" />
                                    <circle
                                        cx="28" cy="28" r="24" fill="none"
                                        stroke="#16A34A" strokeWidth="4" strokeLinecap="round"
                                        strokeDasharray={`${2 * Math.PI * 24}`}
                                        strokeDashoffset={`${2 * Math.PI * 24 * 0.3}`}
                                    />
                                </svg>
                                <span
                                    className="absolute inset-0 flex items-center justify-center text-[12px] font-black text-emerald-600"
                                    style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                                >
                                    42
                                </span>
                            </div>
                            <div>
                                <p className="text-[9px] font-bold uppercase tracking-[3px] text-gray-400">Level XP</p>
                                <p className="text-lg font-black text-emerald-600" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>
                                    12,450
                                </p>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <div className="w-20 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                                        <div className="w-[70%] h-full rounded-full bg-gradient-to-r from-emerald-400 to-green-500" />
                                    </div>
                                    <span className="text-[9px] text-emerald-500 font-semibold">70%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Stat Cards ── */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        <StatCard
                            label="Global Rank"
                            value="Top 2%"
                            subtext="↑ 3 positions this week"
                            color="#CA8A04"
                            lightBg="linear-gradient(135deg, #FEFCE8, #FFF)"
                            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></svg>}
                        />
                        <StatCard
                            label="Active Bounties"
                            value="04"
                            subtext="2 expiring this week"
                            color="#16A34A"
                            lightBg="linear-gradient(135deg, #F0FDF4, #FFF)"
                            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>}
                        />
                        <StatCard
                            label="Spills Published"
                            value="23"
                            subtext="+3 this month"
                            color="#0EA5E9"
                            lightBg="linear-gradient(135deg, #F0F9FF, #FFF)"
                            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14,2 14,8 20,8" /></svg>}
                        />
                        <StatCard
                            label="Profile Views"
                            value="1.2k"
                            subtext="+47% vs last month"
                            color="#8B5CF6"
                            lightBg="linear-gradient(135deg, #F5F3FF, #FFF)"
                            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>}
                        />
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════
                QUICK ACTIONS
               ═══════════════════════════════════════ */}
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-5">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {quickActions.map((action) => (
                        <Link
                            key={action.label}
                            href={action.href}
                            className="group flex items-center gap-3 px-4 py-3 rounded-2xl border border-gray-200 bg-white hover:border-emerald-300 hover:shadow-md hover:shadow-emerald-100 transition-all duration-300 no-underline"
                        >
                            <span className="text-xl group-hover:scale-110 transition-transform">{action.icon}</span>
                            <div>
                                <p className="text-[12px] font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">{action.label}</p>
                                <p className="text-[10px] text-gray-400">{action.desc}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* ═══════════════════════════════════════
                MAIN CONTENT GRID
               ═══════════════════════════════════════ */}
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pb-10">
                <div className="flex flex-col lg:flex-row gap-6">

                    {/* ────── LEFT: Developer Feed ────── */}
                    <div className="flex-1 min-w-0">
                        {/* Feed Header */}
                        <div className="flex items-center justify-between mb-5">
                            <h2
                                className="text-lg font-bold text-gray-800 flex items-center gap-2"
                                style={{ fontFamily: "var(--font-space-grotesk)" }}
                            >
                                <span className="w-1.5 h-5 rounded-full bg-gradient-to-b from-emerald-400 to-emerald-200" />
                                Developer Feed
                            </h2>
                            <div className="flex items-center gap-1 p-0.5 rounded-xl bg-gray-100 border border-gray-200">
                                <button
                                    onClick={() => setFeedTab("trending")}
                                    className={`px-3.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-200 border-none cursor-pointer ${feedTab === "trending"
                                        ? "bg-white text-gray-800 shadow-sm"
                                        : "bg-transparent text-gray-400 hover:text-gray-600"
                                        }`}
                                >
                                    🔥 Trending
                                </button>
                                <button
                                    onClick={() => setFeedTab("latest")}
                                    className={`px-3.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-200 border-none cursor-pointer ${feedTab === "latest"
                                        ? "bg-white text-gray-800 shadow-sm"
                                        : "bg-transparent text-gray-400 hover:text-gray-600"
                                        }`}
                                >
                                    ⚡ Latest
                                </button>
                            </div>
                        </div>

                        {/* Feed Posts */}
                        <div className="space-y-4">
                            {feedPosts.map((post) => (
                                <article
                                    key={post.id}
                                    className="rounded-2xl border border-gray-200 bg-white hover:border-gray-300 hover:shadow-md transition-all duration-300 group overflow-hidden"
                                >
                                    {/* Post Header */}
                                    <div className="flex items-center justify-between px-5 pt-4 pb-2">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${post.avatarGradient} flex items-center justify-center text-[11px] font-bold text-white shadow-md`}>
                                                {post.avatar}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[13px] font-bold text-gray-800">{post.username}</span>
                                                    <span className="text-[10px] text-gray-400" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>
                                                        {post.timeAgo}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    {post.tags.map((tag) => (
                                                        <span
                                                            key={tag}
                                                            className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-100"
                                                            style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <button className="text-gray-300 hover:text-gray-500 transition-colors bg-transparent border-none cursor-pointer p-1">
                                            <MoreIcon />
                                        </button>
                                    </div>

                                    {/* Post Content */}
                                    <div className="px-5 py-3">
                                        <p className="text-[13px] text-gray-600 leading-relaxed">{post.content}</p>
                                    </div>

                                    {/* Code Snippet */}
                                    {post.codeSnippet && (
                                        <div className="mx-5 mb-3 rounded-xl overflow-hidden border border-gray-200">
                                            <div className="flex items-center justify-between px-3.5 py-2 bg-gray-50 border-b border-gray-100">
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                                                    <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                                                    <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
                                                </div>
                                                <span className="text-[9px] text-gray-400 uppercase tracking-wider" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>
                                                    {post.codeLang}
                                                </span>
                                            </div>
                                            <pre
                                                className="px-4 py-3 text-[11px] leading-relaxed overflow-x-auto bg-[#1E1E2E] text-emerald-400 m-0"
                                                style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
                                            >
                                                <code>{post.codeSnippet}</code>
                                            </pre>
                                        </div>
                                    )}

                                    {/* Post Actions */}
                                    <div className="flex items-center gap-5 px-5 pb-4 pt-2 border-t border-gray-100">
                                        <button
                                            onClick={() => toggleLike(post.id)}
                                            className={`flex items-center gap-1.5 text-[12px] transition-colors bg-transparent border-none cursor-pointer ${likedPosts[post.id] ? "text-emerald-500" : "text-gray-400 hover:text-emerald-500"
                                                }`}
                                        >
                                            <HeartIcon filled={likedPosts[post.id]} />
                                            <span>{post.likes + (likedPosts[post.id] && !post.liked ? 1 : 0)}</span>
                                        </button>
                                        <button className="flex items-center gap-1.5 text-[12px] text-gray-400 hover:text-gray-600 transition-colors bg-transparent border-none cursor-pointer">
                                            <CommentIcon />
                                            <span>{post.comments}</span>
                                        </button>
                                        <button className="flex items-center gap-1.5 text-[12px] text-gray-400 hover:text-gray-600 transition-colors bg-transparent border-none cursor-pointer ml-auto">
                                            <ShareIcon />
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>

                    {/* ────── RIGHT: Sidebar ────── */}
                    <div className="w-full lg:w-[320px] shrink-0 space-y-5">

                        {/* ── Activity Stream ── */}
                        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
                            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                                <h3
                                    className="text-[11px] font-bold text-gray-500 uppercase tracking-[2px] flex items-center gap-2"
                                    style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                                >
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                                    </span>
                                    Activity
                                </h3>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {recentActivity.map((item, i) => (
                                    <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                                        <span className="text-sm mt-0.5">{item.icon}</span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[11px] text-gray-600 leading-relaxed">{item.text}</p>
                                            <p className="text-[9px] text-gray-400 mt-0.5" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>{item.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ── Skill Tracker ── */}
                        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
                            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                                <h3
                                    className="text-[11px] font-bold text-gray-500 uppercase tracking-[2px]"
                                    style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                                >
                                    Skills
                                </h3>
                                <Link href="/talent/skill-tree" className="text-[9px] text-emerald-500 hover:text-emerald-600 font-bold no-underline transition-colors">
                                    VIEW TREE →
                                </Link>
                            </div>
                            <div className="p-4 space-y-3.5">
                                {trendingSkills.map((skill) => (
                                    <div key={skill.name}>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-[12px] font-semibold text-gray-700">{skill.name}</span>
                                            <span className="text-[10px] text-emerald-500 font-semibold" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>
                                                {skill.growth}
                                            </span>
                                        </div>
                                        <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all duration-700"
                                                style={{
                                                    width: `${skill.level}%`,
                                                    background: `linear-gradient(90deg, #16A34A, #22C55E)`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ── Leaderboard ── */}
                        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
                            <div className="px-4 py-3 border-b border-gray-100">
                                <h3
                                    className="text-[11px] font-bold text-gray-500 uppercase tracking-[2px]"
                                    style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                                >
                                    Leaderboard
                                </h3>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {leaderboard.map((user) => (
                                    <div
                                        key={user.rank}
                                        className={`flex items-center gap-3 px-4 py-3 ${user.isYou ? "bg-emerald-50 border-l-2 border-l-emerald-500" : ""}`}
                                    >
                                        <span className="text-sm w-5 text-center">{user.badge}</span>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-[12px] font-semibold ${user.isYou ? "text-emerald-600" : "text-gray-700"}`}>
                                                {user.name} {user.isYou && <span className="text-[9px] text-emerald-400">(you)</span>}
                                            </p>
                                        </div>
                                        <span className="text-[11px] font-bold text-gray-400" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>
                                            {user.xp} XP
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ── GitHub Sync ── */}
                        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
                            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                                <h3
                                    className="text-[11px] font-bold text-gray-500 uppercase tracking-[2px] flex items-center gap-2"
                                    style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                                >
                                    GitHub Sync
                                </h3>
                                <span className="text-[8px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-200">
                                    SYNCED
                                </span>
                            </div>
                            <div className="p-3">
                                <div
                                    className="rounded-xl bg-[#1E1E2E] border border-gray-200 p-3 space-y-1.5 overflow-x-auto"
                                    style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
                                >
                                    {[
                                        { time: "14:02:15", type: "info", msg: "Pulling from 'origin/main'" },
                                        { time: "14:02:18", type: "success", msg: "Synced: 8c72a1e" },
                                        { time: "14:02:18", type: "info", msg: "Indexing new spills..." },
                                    ].map((log, i) => (
                                        <div key={i} className="flex gap-2 text-[10px] leading-relaxed">
                                            <span className="text-gray-500 shrink-0">{log.time}</span>
                                            <span className={`shrink-0 ${log.type === "success" ? "text-emerald-400" : "text-cyan-400"}`}>
                                                [{log.type}]
                                            </span>
                                            <span className="text-gray-400">{log.msg}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
