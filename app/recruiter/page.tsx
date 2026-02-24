"use client";

import { useState } from "react";

/* ═══════ ICONS ═══════ */
const I = ({ children, size = 20 }: { children: React.ReactNode; size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{children}</svg>
);

const Icons = {
    search: <I><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></I>,
    briefcase: <I><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></I>,
    users: <I><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></I>,
    bell: <I><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></I>,
    pin: <I size={14}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></I>,
    github: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>,
    trending: <I><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></I>,
    clock: <I size={14}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></I>,
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

/* ═══════ CARD COMPONENT ═══════ */
function Card({ children, className = "", hover = false }: { children: React.ReactNode; className?: string; hover?: boolean }) {
    return (
        <div className={`
      bg-white border border-gray-200
      rounded-2xl shadow-sm
      ${hover ? "hover:shadow-md hover:border-gray-300 transition-all duration-300" : ""}
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
                <circle cx="24" cy="24" r="18" fill="none" stroke="#F3E8FF" strokeWidth="3" />
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
                        <stop offset="100%" stopColor="#16A34A" />
                    </linearGradient>
                </defs>
            </svg>
            <span className="text-sm font-bold text-gray-800" style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>{score}</span>
        </div>
    );
}

/* ═══════════════ MAIN PAGE ═══════════════ */
export default function RecruiterDashboard() {
    const [search, setSearch] = useState("");

    return (
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-6">

            {/* ── HEADER ── */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-[22px] font-semibold text-gray-800 tracking-tight mb-1">Good evening, Recruiter</h1>
                    <p className="text-[13px] text-gray-400">Here&apos;s what&apos;s happening with your talent pipeline.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="w-9 h-9 rounded-xl border border-gray-200 bg-white text-gray-400 flex items-center justify-center cursor-pointer hover:text-gray-600 hover:border-gray-300 hover:shadow-sm transition-all relative">
                        {Icons.bell}
                        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-purple-500 rounded-full" />
                    </button>
                </div>
            </div>

            {/* ── METRIC CARDS ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                    { label: "Active Bounties", value: "3", change: "+1 this week", color: "#8B5CF6", lightBg: "#F5F3FF" },
                    { label: "Applicants", value: "38", change: "+12 today", color: "#16A34A", lightBg: "#F0FDF4" },
                    { label: "Interviews", value: "8", change: "3 this week", color: "#0EA5E9", lightBg: "#F0F9FF" },
                    { label: "Hires", value: "2", change: "This month", color: "#D97706", lightBg: "#FFFBEB" },
                ].map((m) => (
                    <div key={m.label} className="rounded-2xl border border-gray-200 p-5 bg-white hover:shadow-md transition-all duration-300" style={{ background: `linear-gradient(135deg, ${m.lightBg}, white)` }}>
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[11px] text-gray-400 uppercase tracking-wider font-medium">{m.label}</span>
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color }} />
                        </div>
                        <div className="text-3xl font-bold mb-1" style={{ color: m.color, fontFamily: "var(--font-jetbrains-mono), monospace" }}>
                            {m.value}
                        </div>
                        <span className="text-[11px] text-gray-400">{m.change}</span>
                    </div>
                ))}
            </div>

            <div className="flex flex-col xl:flex-row gap-6">
                {/* ── LEFT COLUMN: TALENT ── */}
                <div className="flex-1 min-w-0">
                    {/* Search */}
                    <Card className="p-4 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="flex-1 flex items-center gap-2.5 bg-gray-50 rounded-xl px-4 py-2.5 border border-gray-200 focus-within:border-purple-300 focus-within:ring-2 focus-within:ring-purple-100 transition-all">
                                <span className="text-gray-400">{Icons.search}</span>
                                <input
                                    type="text"
                                    placeholder="Search talent by skills, role, or name..."
                                    className="flex-1 bg-transparent border-none outline-none text-gray-700 text-[13px] placeholder:text-gray-400"
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
                                            ? "bg-purple-50 text-purple-600 border-purple-200"
                                            : "bg-transparent text-gray-400 border-gray-200 hover:text-gray-600 hover:border-gray-300"
                                        }`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </Card>

                    {/* Label */}
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-[14px] font-semibold text-gray-600 flex items-center gap-2">
                            <span className="w-1 h-4 bg-gradient-to-b from-purple-500 to-purple-200 rounded-full" />
                            Top Matches
                        </h2>
                        <span className="text-[11px] text-gray-400" style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>{candidates.length} results</span>
                    </div>

                    {/* Candidate Cards */}
                    <div className="flex flex-col gap-3">
                        {candidates.map((c) => (
                            <Card key={c.handle} hover className="p-5 group">
                                <div className="flex items-start gap-4">
                                    {/* Avatar */}
                                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${c.bg} flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-md`}>
                                        {c.initials}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                            <span className="text-[14px] font-semibold text-gray-800">{c.name}</span>
                                            {c.verified && (
                                                <span className="flex items-center gap-1 text-[10px] text-emerald-500">{Icons.github} verified</span>
                                            )}
                                            <span className={`text-[9px] px-2 py-0.5 rounded-full font-medium uppercase tracking-wider
                            ${c.available ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-gray-100 text-gray-400 border border-gray-200"}`}>
                                                {c.available ? "Available" : "Busy"}
                                            </span>
                                        </div>
                                        <div className="text-[12px] text-gray-500 mb-0.5">{c.role}</div>
                                        <div className="flex items-center gap-1 text-[11px] text-gray-400 mb-3">
                                            {Icons.pin} {c.location}
                                        </div>

                                        {/* Skills */}
                                        <div className="flex flex-wrap gap-1.5">
                                            {c.skills.map((s) => (
                                                <span
                                                    key={s}
                                                    className="px-2.5 py-1 rounded-full text-[10px] bg-gray-50 border border-gray-200 text-gray-500 font-medium"
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
                                        <div className="text-[9px] text-gray-400 uppercase tracking-wider font-medium" style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>
                                            {c.repos} repos · {c.commits}
                                        </div>
                                        <button className="mt-1 px-4 py-1.5 rounded-lg bg-purple-50 text-purple-600 text-[11px] font-semibold border border-purple-200 cursor-pointer hover:bg-purple-600 hover:text-white hover:border-purple-600 hover:shadow-md transition-all duration-200">
                                            Connect
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* ── RIGHT COLUMN ── */}
                <div className="w-full xl:w-[300px] shrink-0 flex flex-col gap-5">

                    {/* Active Bounties */}
                    <Card className="p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-[13px] font-semibold text-gray-600 flex items-center gap-2">
                                <span className="text-purple-500">{Icons.briefcase}</span>
                                Active Bounties
                            </h3>
                            <button className="text-[10px] text-purple-500 font-medium hover:text-purple-700 cursor-pointer bg-transparent border-none transition-colors">View all</button>
                        </div>

                        <div className="flex flex-col gap-2.5">
                            {bounties.map((b, i) => (
                                <div key={i} className="bg-gray-50 border border-gray-200 rounded-xl p-3.5 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer group">
                                    <div className="flex justify-between items-start mb-2.5">
                                        <div className="flex items-center gap-2">
                                            {b.hot && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.5)]" />}
                                            <h4 className="text-[12px] font-medium text-gray-600 group-hover:text-gray-800 transition-colors">{b.title}</h4>
                                        </div>
                                        <span className="text-[12px] font-bold text-emerald-600" style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>{b.budget}</span>
                                    </div>
                                    <div className="flex justify-between text-[10px] text-gray-400">
                                        <span className="flex items-center gap-1">{Icons.users} {b.apps}</span>
                                        <span className="flex items-center gap-1">{Icons.clock} {b.days}d left</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Recent Activity */}
                    <Card className="p-5">
                        <h3 className="text-[13px] font-semibold text-gray-600 flex items-center gap-2 mb-4">
                            <span className="text-sky-500">{Icons.trending}</span>
                            Recent Activity
                        </h3>
                        <div className="flex flex-col gap-3">
                            {activity.map((a, i) => (
                                <div key={i} className="flex gap-3 items-start">
                                    <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0
                        ${a.type === "apply" ? "bg-purple-500" : a.type === "match" ? "bg-emerald-500" : a.type === "interview" ? "bg-sky-500" : "bg-amber-500"}`}
                                    />
                                    <div>
                                        <p className="text-[11px] text-gray-500 leading-relaxed">{a.text}</p>
                                        <span className="text-[10px] text-gray-400">{a.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
