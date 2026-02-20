"use client";

import { useState } from "react";

/* ═══════ ICONS ═══════ */
const I = ({ children, size = 20 }: { children: React.ReactNode; size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);

const Icons = {
    home: <I><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></I>,
    search: <I><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></I>,
    briefcase: <I><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></I>,
    users: <I><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></I>,
    msg: <I><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></I>,
    bell: <I><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></I>,
    plus: <I><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></I>,
    settings: <I><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></I>,
    pin: <I size={14}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></I>,
    github: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>,
    chevron: <I size={14}><polyline points="9 18 15 12 9 6" /></I>,
    trending: <I><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></I>,
    clock: <I size={14}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></I>,
    check: <I size={14}><polyline points="20 6 9 17 4 12" /></I>,
};

/* ═══════ DATA ═══════ */
const candidates = [
    {
        name: "Sarah Chen", handle: "@sarah_codes", role: "Full-Stack Engineer",
        location: "San Francisco, CA", initials: "SC",
        bg: "from-violet-500 to-purple-600",
        skills: ["React", "Node.js", "TypeScript", "PostgreSQL"],
        score: 94, repos: 47, commits: "2.3k", verified: true, available: true,
    },
    {
        name: "Marcus Johnson", handle: "@marcus_dev", role: "Backend Architect",
        location: "Austin, TX", initials: "MJ",
        bg: "from-cyan-400 to-blue-500",
        skills: ["Rust", "Go", "AWS", "Kubernetes"],
        score: 91, repos: 32, commits: "1.8k", verified: true, available: true,
    },
    {
        name: "Aisha Patel", handle: "@aisha_p", role: "ML Engineer",
        location: "London, UK", initials: "AP",
        bg: "from-emerald-400 to-teal-500",
        skills: ["Python", "TensorFlow", "PyTorch", "MLOps"],
        score: 89, repos: 23, commits: "1.5k", verified: true, available: false,
    },
    {
        name: "Liam O'Brien", handle: "@liam_rb", role: "Frontend Lead",
        location: "Dublin, IE", initials: "LO",
        bg: "from-amber-400 to-orange-500",
        skills: ["Vue.js", "Nuxt", "Tailwind", "Figma"],
        score: 87, repos: 19, commits: "1.2k", verified: true, available: true,
    },
];

const bounties = [
    { title: "Senior React Developer", budget: "$8,000", apps: 12, days: 5, hot: true },
    { title: "Rust Systems Engineer", budget: "$12,000", apps: 7, days: 12, hot: false },
    { title: "DevOps Lead", budget: "$10,000", apps: 19, days: 2, hot: true },
];

const activity = [
    { text: "Sarah Chen applied to Senior React Developer", time: "2m ago", type: "apply" },
    { text: "New match found: Marcus Johnson (91 score)", time: "15m ago", type: "match" },
    { text: "Interview scheduled with Aisha Patel", time: "1h ago", type: "interview" },
    { text: "Bounty 'DevOps Lead' expires in 2 days", time: "3h ago", type: "warning" },
];

/* ═══════ NAV ═══════ */
const sideNav = [
    { icon: Icons.home, label: "Dashboard" },
    { icon: Icons.search, label: "Search Talent" },
    { icon: Icons.briefcase, label: "Bounties" },
    { icon: Icons.users, label: "Applications" },
    { icon: Icons.msg, label: "Messages", badge: 3 },
];

/* ═══════ GLASS CARD COMPONENT ═══════ */
function GlassCard({ children, className = "", hover = false }: { children: React.ReactNode; className?: string; hover?: boolean }) {
    return (
        <div className={`
      bg-white/[0.03] backdrop-blur-sm
      border border-white/[0.06]
      rounded-2xl
      ${hover ? "hover:bg-white/[0.05] hover:border-white/[0.10] transition-all duration-300" : ""}
      ${className}
    `}>
            {children}
        </div>
    );
}

/* ═══════ SCORE RING ═══════ */
function ScoreRing({ score }: { score: number }) {
    const circumference = 2 * Math.PI * 18;
    const offset = circumference - (score / 100) * circumference;
    return (
        <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="absolute inset-0" width="48" height="48" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="18" fill="none" stroke="rgba(168,85,247,0.1)" strokeWidth="3" />
                <circle
                    cx="24" cy="24" r="18" fill="none"
                    stroke="url(#scoreGrad)" strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    transform="rotate(-90 24 24)"
                />
                <defs>
                    <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#A855F7" />
                        <stop offset="100%" stopColor="#3CF91A" />
                    </linearGradient>
                </defs>
            </svg>
            <span className="text-sm font-bold text-white" style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>{score}</span>
        </div>
    );
}

/* ═══════════════ MAIN PAGE ═══════════════ */
export default function RecruiterDashboard() {
    const [active, setActive] = useState("Dashboard");
    const [search, setSearch] = useState("");

    return (
        <div className="flex h-full overflow-hidden">

            {/* ═══ SIDEBAR ═══ */}
            <aside className="hidden lg:flex flex-col w-[220px] shrink-0 bg-[#080C16] border-r border-white/[0.04] py-5 px-3">
                <nav className="flex flex-col gap-1 flex-1">
                    {sideNav.map((n) => (
                        <button
                            key={n.label}
                            onClick={() => setActive(n.label)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 border-none cursor-pointer w-full text-left group
                ${active === n.label
                                    ? "bg-[#A855F7]/10 text-[#A855F7]"
                                    : "bg-transparent text-white/35 hover:text-white/60 hover:bg-white/[0.03]"
                                }`}
                        >
                            <span className={active === n.label ? "text-[#A855F7]" : "text-white/25 group-hover:text-white/40 transition-colors"}>{n.icon}</span>
                            <span>{n.label}</span>
                            {n.badge && (
                                <span className="ml-auto text-[10px] bg-[#A855F7] text-white w-5 h-5 rounded-full flex items-center justify-center font-bold">{n.badge}</span>
                            )}
                        </button>
                    ))}

                    {/* Create Bounty */}
                    <button className="flex items-center justify-center gap-2 w-full mt-5 py-2.5 rounded-xl bg-gradient-to-r from-[#A855F7] to-[#7C3AED] text-white text-[13px] font-semibold border-none cursor-pointer hover:shadow-[0_4px_20px_rgba(168,85,247,0.3)] transition-all duration-300">
                        {Icons.plus} New Bounty
                    </button>
                </nav>

                {/* Bottom Settings */}
                <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] text-white/25 hover:text-white/50 hover:bg-white/[0.03] transition-all border-none cursor-pointer w-full text-left mt-auto bg-transparent">
                    {Icons.settings}
                    <span>Settings</span>
                </button>
            </aside>

            {/* ═══ MAIN ═══ */}
            <main className="flex-1 overflow-y-auto pb-24 lg:pb-6" style={{ scrollbarWidth: "thin", scrollbarColor: "#1e1e2e #0B0F1A" }}>
                <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-6">

                    {/* ── HEADER ── */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-[22px] font-semibold text-white tracking-tight mb-1">Good evening, Recruiter</h1>
                            <p className="text-[13px] text-white/30">Here&apos;s what&apos;s happening with your talent pipeline.</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="w-9 h-9 rounded-xl border border-white/[0.06] bg-white/[0.02] text-white/30 flex items-center justify-center cursor-pointer hover:text-white/60 hover:border-white/[0.10] transition-all relative">
                                {Icons.bell}
                                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#A855F7] rounded-full" />
                            </button>
                        </div>
                    </div>

                    {/* ── METRIC CARDS ── */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {[
                            { label: "Active Bounties", value: "3", change: "+1 this week", color: "#A855F7", glow: "shadow-[0_0_40px_rgba(168,85,247,0.06)]" },
                            { label: "Applicants", value: "38", change: "+12 today", color: "#3CF91A", glow: "shadow-[0_0_40px_rgba(60,249,26,0.06)]" },
                            { label: "Interviews", value: "8", change: "3 this week", color: "#00D2FF", glow: "shadow-[0_0_40px_rgba(0,210,255,0.06)]" },
                            { label: "Hires", value: "2", change: "This month", color: "#F59E0B", glow: "shadow-[0_0_40px_rgba(245,158,11,0.06)]" },
                        ].map((m) => (
                            <GlassCard key={m.label} className={`p-5 ${m.glow}`}>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-[11px] text-white/30 uppercase tracking-wider font-medium">{m.label}</span>
                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color, boxShadow: `0 0 8px ${m.color}40` }} />
                                </div>
                                <div className="text-3xl font-bold mb-1" style={{ color: m.color, fontFamily: "var(--font-jetbrains-mono), monospace" }}>
                                    {m.value}
                                </div>
                                <span className="text-[11px] text-white/20">{m.change}</span>
                            </GlassCard>
                        ))}
                    </div>

                    <div className="flex flex-col xl:flex-row gap-6">
                        {/* ── LEFT COLUMN: TALENT ── */}
                        <div className="flex-1 min-w-0">
                            {/* Search */}
                            <GlassCard className="p-4 mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 flex items-center gap-2.5 bg-white/[0.02] rounded-xl px-4 py-2.5 border border-white/[0.04] focus-within:border-[#A855F7]/25 transition-colors">
                                        <span className="text-white/20">{Icons.search}</span>
                                        <input
                                            type="text"
                                            placeholder="Search talent by skills, role, or name..."
                                            className="flex-1 bg-transparent border-none outline-none text-white/80 text-[13px] placeholder:text-white/20"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                        />
                                    </div>
                                </div>
                                {/* Filter pills */}
                                <div className="flex gap-2 mt-3 flex-wrap">
                                    {["All", "React", "Rust", "Python", "Go", "TypeScript"].map((tag, i) => (
                                        <button
                                            key={tag}
                                            className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer border
                        ${i === 0
                                                    ? "bg-[#A855F7]/15 text-[#A855F7] border-[#A855F7]/20"
                                                    : "bg-transparent text-white/25 border-white/[0.06] hover:text-white/50 hover:border-white/[0.10]"
                                                }`}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </GlassCard>

                            {/* Label */}
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-[14px] font-semibold text-white/60 flex items-center gap-2">
                                    <span className="w-1 h-4 bg-gradient-to-b from-[#A855F7] to-[#A855F7]/30 rounded-full" />
                                    Top Matches
                                </h2>
                                <span className="text-[11px] text-white/20" style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>{candidates.length} results</span>
                            </div>

                            {/* Candidate Cards */}
                            <div className="flex flex-col gap-3">
                                {candidates.map((c) => (
                                    <GlassCard key={c.handle} hover className="p-5 group">
                                        <div className="flex items-start gap-4">
                                            {/* Avatar */}
                                            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${c.bg} flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-lg`}>
                                                {c.initials}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                                    <span className="text-[14px] font-semibold text-white/90">{c.name}</span>
                                                    {c.verified && (
                                                        <span className="flex items-center gap-1 text-[10px] text-[#3CF91A]/60">{Icons.github} verified</span>
                                                    )}
                                                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wider
                            ${c.available ? "bg-[#3CF91A]/8 text-[#3CF91A]/60 border border-[#3CF91A]/10" : "bg-white/[0.03] text-white/20 border border-white/[0.05]"}`}>
                                                        {c.available ? "Available" : "Busy"}
                                                    </span>
                                                </div>
                                                <div className="text-[12px] text-white/40 mb-0.5">{c.role}</div>
                                                <div className="flex items-center gap-1 text-[11px] text-white/20 mb-3">
                                                    {Icons.pin} {c.location}
                                                </div>

                                                {/* Skills */}
                                                <div className="flex flex-wrap gap-1.5">
                                                    {c.skills.map((s) => (
                                                        <span
                                                            key={s}
                                                            className="px-2.5 py-1 rounded-full text-[10px] bg-white/[0.03] border border-white/[0.06] text-white/40 font-medium"
                                                            style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
                                                        >
                                                            {s}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Score + Action */}
                                            <div className="flex flex-col items-center gap-2 shrink-0">
                                                <ScoreRing score={c.score} />
                                                <div className="text-[9px] text-white/15 uppercase tracking-wider font-medium" style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>
                                                    {c.repos} repos · {c.commits}
                                                </div>
                                                <button className="mt-1 px-4 py-1.5 rounded-lg bg-[#A855F7]/10 text-[#A855F7] text-[11px] font-semibold border border-[#A855F7]/15 cursor-pointer hover:bg-[#A855F7] hover:text-white hover:border-[#A855F7] transition-all duration-200">
                                                    Connect
                                                </button>
                                            </div>
                                        </div>
                                    </GlassCard>
                                ))}
                            </div>
                        </div>

                        {/* ── RIGHT COLUMN ── */}
                        <div className="w-full xl:w-[300px] shrink-0 flex flex-col gap-5">

                            {/* Active Bounties */}
                            <GlassCard className="p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-[13px] font-semibold text-white/60 flex items-center gap-2">
                                        <span className="text-[#A855F7]">{Icons.briefcase}</span>
                                        Active Bounties
                                    </h3>
                                    <button className="text-[10px] text-[#A855F7]/60 font-medium hover:text-[#A855F7] cursor-pointer bg-transparent border-none transition-colors">View all</button>
                                </div>

                                <div className="flex flex-col gap-2.5">
                                    {bounties.map((b, i) => (
                                        <div key={i} className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-3.5 hover:border-white/[0.08] transition-all cursor-pointer group">
                                            <div className="flex justify-between items-start mb-2.5">
                                                <div className="flex items-center gap-2">
                                                    {b.hot && <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] shadow-[0_0_6px_rgba(245,158,11,0.5)]" />}
                                                    <h4 className="text-[12px] font-medium text-white/60 group-hover:text-white/80 transition-colors">{b.title}</h4>
                                                </div>
                                                <span className="text-[12px] font-bold text-[#3CF91A]/70" style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>{b.budget}</span>
                                            </div>
                                            <div className="flex justify-between text-[10px] text-white/20">
                                                <span className="flex items-center gap-1">{Icons.users} {b.apps}</span>
                                                <span className="flex items-center gap-1">{Icons.clock} {b.days}d left</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </GlassCard>

                            {/* Recent Activity */}
                            <GlassCard className="p-5">
                                <h3 className="text-[13px] font-semibold text-white/60 flex items-center gap-2 mb-4">
                                    <span className="text-[#00D2FF]">{Icons.trending}</span>
                                    Recent Activity
                                </h3>
                                <div className="flex flex-col gap-3">
                                    {activity.map((a, i) => (
                                        <div key={i} className="flex gap-3 items-start">
                                            <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0
                        ${a.type === "apply" ? "bg-[#A855F7]" : a.type === "match" ? "bg-[#3CF91A]" : a.type === "interview" ? "bg-[#00D2FF]" : "bg-[#F59E0B]"}`}
                                            />
                                            <div>
                                                <p className="text-[11px] text-white/40 leading-relaxed">{a.text}</p>
                                                <span className="text-[10px] text-white/15">{a.time}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </GlassCard>
                        </div>
                    </div>
                </div>
            </main>

            {/* ═══ MOBILE BOTTOM NAV ═══ */}
            <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-[#080C16]/95 backdrop-blur-xl border-t border-white/[0.05] z-50">
                <div className="flex items-center justify-around py-2 max-w-md mx-auto">
                    {[
                        { icon: Icons.home, label: "Home", key: "Dashboard" },
                        { icon: Icons.search, label: "Search", key: "Search Talent" },
                        { icon: Icons.briefcase, label: "Bounties", key: "Bounties" },
                        { icon: Icons.msg, label: "Messages", key: "Messages", badge: 3 },
                        { icon: Icons.bell, label: "Alerts", key: "Alerts" },
                    ].map((item) => (
                        <button
                            key={item.key}
                            onClick={() => setActive(item.key)}
                            className={`flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl border-none cursor-pointer transition-all relative
                ${active === item.key ? "text-[#A855F7]" : "text-white/20 bg-transparent"}`}
                        >
                            {item.icon}
                            <span className="text-[9px] font-medium">{item.label}</span>
                            {item.badge && (
                                <span className="absolute top-0.5 right-0.5 bg-[#A855F7] text-white text-[7px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">{item.badge}</span>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
