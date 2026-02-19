"use client";

import { useState } from "react";

/* ═══════════════ ICONS ═══════════════ */
const IconDashboard = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
);
const IconSearch = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
);
const IconBriefcase = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x={2} y={7} width={20} height={14} rx={2} ry={2} /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
);
const IconUsers = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
);
const IconMsg = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
);
const IconBell = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
);
const IconStar = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
);
const IconGithub = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>
);
const IconTrending = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
);
const IconPlus = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
);
const IconFilter = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
);
const IconChevronRight = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
);
const IconSettings = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
);
const IconBookmark = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
);
const IconEye = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
);
const IconCode = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
);
const IconMapPin = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
);
const IconExternalLink = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
);

/* ═══════════════ MOCK DATA ═══════════════ */
const candidates = [
    {
        name: "Sarah Chen",
        handle: "@sarah_codes",
        role: "Full-Stack Engineer",
        location: "San Francisco, CA",
        avatar: "SC",
        avatarColor: "from-violet-500 to-fuchsia-500",
        skills: ["React", "Node.js", "TypeScript", "PostgreSQL"],
        score: 94,
        repos: 47,
        commits: 2340,
        verified: true,
        status: "Available",
    },
    {
        name: "Marcus Johnson",
        handle: "@marcus_dev",
        role: "Backend Architect",
        location: "Austin, TX",
        avatar: "MJ",
        avatarColor: "from-cyan-500 to-blue-500",
        skills: ["Rust", "Go", "AWS", "Kubernetes"],
        score: 91,
        repos: 32,
        commits: 1865,
        verified: true,
        status: "Open to offers",
    },
    {
        name: "Aisha Patel",
        handle: "@aisha_p",
        role: "ML Engineer",
        location: "London, UK",
        avatar: "AP",
        avatarColor: "from-emerald-500 to-teal-500",
        skills: ["Python", "TensorFlow", "PyTorch", "MLOps"],
        score: 89,
        repos: 23,
        commits: 1520,
        verified: true,
        status: "Available",
    },
];

const bounties = [
    { title: "Senior React Developer", budget: "$8,000", applicants: 12, status: "Active", daysLeft: 5 },
    { title: "Rust Systems Engineer", budget: "$12,000", applicants: 7, status: "Active", daysLeft: 12 },
    { title: "DevOps Lead", budget: "$10,000", applicants: 19, status: "Review", daysLeft: 2 },
];

const topTalent = [
    { name: "Elena Kowalski", role: "Blockchain Dev", score: 97, avatar: "EK", color: "from-amber-500 to-orange-500" },
    { name: "Raj Mehta", role: "Cloud Architect", score: 95, avatar: "RM", color: "from-pink-500 to-rose-500" },
    { name: "Yuki Tanaka", role: "AI/ML Specialist", score: 93, avatar: "YT", color: "from-indigo-500 to-violet-500" },
];

/* ═══════════════ SIDEBAR NAV ITEMS ═══════════════ */
const navItems = [
    { icon: <IconDashboard />, label: "Dashboard", active: true },
    { icon: <IconSearch />, label: "Search Talent", active: false },
    { icon: <IconBriefcase />, label: "My Bounties", active: false },
    { icon: <IconUsers />, label: "Applications", active: false },
    { icon: <IconMsg />, label: "Messages", active: false, badge: 3 },
];

/* ═══════════════ MAIN COMPONENT ═══════════════ */
export default function RecruiterDashboard() {
    const [activeNav, setActiveNav] = useState("Dashboard");
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="flex h-[calc(100vh-73px)] overflow-hidden bg-[#060608]">

            {/* ═══════ LEFT SIDEBAR ═══════ */}
            <aside className="hidden lg:flex flex-col w-[260px] shrink-0 border-r border-white/[0.06] p-4 gap-2 overflow-y-auto scrollbar-recruiter">
                {/* Brand Block */}
                <div className="liquid-glass-purple rounded-2xl p-5 mb-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#A855F7] to-[#7C3AED] flex items-center justify-center text-white font-bold text-sm shadow-neon-purple">
                            SP
                        </div>
                        <div>
                            <div className="font-bold text-white text-sm">SkillSpill</div>
                            <div className="text-[10px] text-[#A855F7] uppercase tracking-[2px] font-semibold">Recruiter Hub</div>
                        </div>
                    </div>

                    {/* Nav List */}
                    <nav className="flex flex-col gap-1">
                        {navItems.map((item) => (
                            <button
                                key={item.label}
                                onClick={() => setActiveNav(item.label)}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border-none cursor-pointer w-full text-left relative
                  ${activeNav === item.label
                                        ? "bg-[#A855F7] text-white shadow-neon-purple"
                                        : "bg-transparent text-[#888] hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                                {item.badge && (
                                    <span className="ml-auto bg-[#FF003C] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                        {item.badge}
                                    </span>
                                )}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Create Bounty CTA */}
                <button className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-[#A855F7] to-[#7C3AED] text-white font-bold text-sm border-none cursor-pointer hover:shadow-neon-purple-strong transition-all duration-300 hover:-translate-y-0.5">
                    <IconPlus /> New Bounty
                </button>

                {/* Profile Card */}
                <div className="liquid-glass rounded-2xl p-4 mt-auto">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#A855F7] to-[#6D28D9] flex items-center justify-center text-white font-bold text-xs">
                            RX
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-white">@recruiter_x</div>
                            <div className="text-[10px] text-[#888]">TechCorp Inc.</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full w-[72%] bg-gradient-to-r from-[#A855F7] to-[#00D2FF] rounded-full" />
                        </div>
                        <span className="text-[10px] text-[#A855F7] font-semibold" style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>72%</span>
                    </div>
                    <div className="text-[10px] text-[#555] mt-1">Profile Completion</div>
                </div>
            </aside>

            {/* ═══════ CENTER FEED ═══════ */}
            <main className="flex-1 overflow-y-auto px-4 md:px-6 py-6 scrollbar-recruiter">
                {/* Search Header */}
                <div className="liquid-glass-purple rounded-2xl p-4 md:p-5 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="flex-1 flex items-center gap-3 bg-black/30 rounded-xl px-4 py-3 border border-white/5 focus-within:border-[#A855F7]/40 transition-colors">
                            <IconSearch />
                            <input
                                type="text"
                                placeholder="Search talent by skills, role, or name..."
                                className="flex-1 bg-transparent border-none outline-none text-white text-sm placeholder:text-[#555]"
                                style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button className="hidden sm:flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[#888] text-sm cursor-pointer hover:border-[#A855F7]/30 hover:text-[#A855F7] transition-all font-medium">
                            <IconFilter /> Filters
                        </button>
                    </div>
                    <div className="flex gap-2 mt-3 flex-wrap">
                        {["All", "React", "Rust", "Python", "Go", "TypeScript"].map((tag, i) => (
                            <button
                                key={tag}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border-none
                  ${i === 0
                                        ? "bg-[#A855F7] text-white shadow-neon-purple"
                                        : "bg-white/5 text-[#888] hover:text-[#A855F7] hover:bg-[#A855F7]/10"
                                    }`}
                                style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    {[
                        { label: "Active Bounties", value: "3", accent: "#A855F7" },
                        { label: "Total Applicants", value: "38", accent: "#3CF91A" },
                        { label: "Interviews", value: "8", accent: "#00D2FF" },
                        { label: "Hires This Month", value: "2", accent: "#F59E0B" },
                    ].map((stat) => (
                        <div key={stat.label} className="liquid-glass rounded-xl p-4 group hover:border-white/10 transition-all">
                            <div className="text-[10px] text-[#666] uppercase tracking-wider mb-1 font-semibold">{stat.label}</div>
                            <div className="text-2xl md:text-3xl font-bold" style={{ color: stat.accent, fontFamily: "var(--font-jetbrains-mono), monospace" }}>
                                {stat.value}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Talent Feed Label */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <span className="w-1.5 h-5 bg-[#A855F7] rounded-full" />
                        Top Talent Matches
                    </h2>
                    <button className="text-xs text-[#A855F7] font-semibold hover:underline cursor-pointer bg-transparent border-none">View All</button>
                </div>

                {/* Candidate Cards */}
                <div className="flex flex-col gap-4">
                    {candidates.map((c) => (
                        <div key={c.handle} className="liquid-glass rounded-2xl p-5 md:p-6 group hover:border-[#A855F7]/20 transition-all duration-300">
                            <div className="flex flex-col sm:flex-row gap-4">
                                {/* Avatar + Info */}
                                <div className="flex items-start gap-4 flex-1">
                                    <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${c.avatarColor} flex items-center justify-center text-white font-bold text-sm sm:text-base shrink-0 shadow-lg`}>
                                        {c.avatar}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h3 className="text-base font-bold text-white">{c.name}</h3>
                                            {c.verified && (
                                                <span className="flex items-center gap-1 text-[10px] text-[#3CF91A] bg-[#3CF91A]/10 px-2 py-0.5 rounded-full font-semibold">
                                                    <IconGithub /> Verified
                                                </span>
                                            )}
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${c.status === "Available" ? "bg-[#3CF91A]/10 text-[#3CF91A]" : "bg-[#00D2FF]/10 text-[#00D2FF]"}`}>
                                                {c.status}
                                            </span>
                                        </div>
                                        <div className="text-sm text-[#999] mt-0.5">{c.role}</div>
                                        <div className="flex items-center gap-1 text-[#666] text-xs mt-1">
                                            <IconMapPin /> {c.location}
                                        </div>

                                        {/* Skills */}
                                        <div className="flex flex-wrap gap-1.5 mt-3">
                                            {c.skills.map((s) => (
                                                <span
                                                    key={s}
                                                    className="px-2.5 py-1 rounded-md text-xs bg-[#A855F7]/8 border border-[#A855F7]/15 text-[#A855F7]/80 hover:text-[#A855F7] hover:border-[#A855F7]/30 transition-colors cursor-default"
                                                    style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
                                                >
                                                    {s}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Score + Actions */}
                                <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-2 shrink-0">
                                    <div className="relative">
                                        <div className="w-14 h-14 rounded-xl liquid-glass-purple flex items-center justify-center animate-pulse-purple">
                                            <span className="text-xl font-bold text-[#A855F7]" style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>{c.score}</span>
                                        </div>
                                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[8px] bg-[#A855F7] text-white px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wide whitespace-nowrap">Score</div>
                                    </div>

                                    <div className="flex items-center gap-3 text-xs text-[#666] mt-2" style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>
                                        <span className="flex items-center gap-1"><IconCode /> {c.repos}</span>
                                        <span className="flex items-center gap-1"><IconGithub /> {c.commits.toLocaleString()}</span>
                                    </div>

                                    <div className="flex gap-2 mt-1">
                                        <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-[#888] hover:text-[#A855F7] hover:border-[#A855F7]/30 transition-all cursor-pointer">
                                            <IconBookmark />
                                        </button>
                                        <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-[#888] hover:text-[#00D2FF] hover:border-[#00D2FF]/30 transition-all cursor-pointer">
                                            <IconEye />
                                        </button>
                                        <button className="px-4 py-2 rounded-lg bg-[#A855F7] text-white text-xs font-bold border-none cursor-pointer hover:shadow-neon-purple-strong transition-all hover:-translate-y-0.5">
                                            Connect
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* ═══════ RIGHT SIDEBAR ═══════ */}
            <aside className="hidden xl:flex flex-col w-[300px] shrink-0 border-l border-white/[0.06] p-4 gap-4 overflow-y-auto scrollbar-recruiter">
                {/* Active Bounties */}
                <div className="liquid-glass-purple rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <span className="text-[#A855F7]"><IconBriefcase /></span>
                            Active Bounties
                        </h3>
                        <button className="text-[10px] text-[#A855F7] font-semibold hover:underline cursor-pointer bg-transparent border-none">View All</button>
                    </div>

                    <div className="flex flex-col gap-3">
                        {bounties.map((b, i) => (
                            <div key={i} className="bg-black/20 rounded-xl p-3.5 border border-white/5 hover:border-[#A855F7]/20 transition-all cursor-pointer group">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="text-sm font-semibold text-white/90 group-hover:text-white transition-colors">{b.title}</h4>
                                    <span className="text-sm font-bold text-[#3CF91A]" style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>{b.budget}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] text-[#888]">{b.applicants} applicants</span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold
                    ${b.status === "Active" ? "bg-[#3CF91A]/10 text-[#3CF91A]" : "bg-[#F59E0B]/10 text-[#F59E0B]"}`}>
                                        {b.status} • {b.daysLeft}d left
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Talent */}
                <div className="liquid-glass rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <span className="text-[#F59E0B]"><IconStar /></span>
                            Top Spillers
                        </h3>
                    </div>

                    <div className="flex flex-col gap-3">
                        {topTalent.map((t, i) => (
                            <div key={i} className="flex items-center gap-3 group">
                                <span className="text-[10px] font-bold text-[#555] w-4 text-right" style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>
                                    {i + 1}
                                </span>
                                <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>
                                    {t.avatar}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-semibold text-white/90 truncate">{t.name}</div>
                                    <div className="text-[10px] text-[#666]">{t.role}</div>
                                </div>
                                <button className="px-2.5 py-1.5 rounded-lg bg-[#A855F7]/10 border border-[#A855F7]/20 text-[#A855F7] text-[10px] font-bold cursor-pointer hover:bg-[#A855F7] hover:text-white transition-all border-none">
                                    Connect
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="liquid-glass rounded-2xl p-5">
                    <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                        <span className="text-[#00D2FF]"><IconTrending /></span>
                        Quick Actions
                    </h3>
                    <div className="flex flex-col gap-2">
                        {[
                            { label: "Post a New Bounty", icon: <IconPlus /> },
                            { label: "Browse Talent Pool", icon: <IconSearch /> },
                            { label: "Review Applications", icon: <IconUsers /> },
                            { label: "Account Settings", icon: <IconSettings /> },
                        ].map((action) => (
                            <button
                                key={action.label}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[#888] bg-transparent border border-white/5 hover:border-[#A855F7]/20 hover:text-white hover:bg-white/[0.03] transition-all cursor-pointer w-full text-left font-medium group"
                            >
                                <span className="text-[#555] group-hover:text-[#A855F7] transition-colors">{action.icon}</span>
                                {action.label}
                                <span className="ml-auto text-[#333] group-hover:text-[#A855F7] transition-colors"><IconChevronRight /></span>
                            </button>
                        ))}
                    </div>
                </div>
            </aside>

            {/* ═══════ MOBILE BOTTOM NAV ═══════ */}
            <div className="fixed bottom-0 left-0 right-0 lg:hidden liquid-glass-surface border-t border-white/[0.06] z-50">
                <div className="flex items-center justify-around py-2 px-2 max-w-md mx-auto">
                    {[
                        { icon: <IconDashboard />, label: "Home", key: "Dashboard" },
                        { icon: <IconSearch />, label: "Search", key: "Search Talent" },
                        { icon: <IconBriefcase />, label: "Bounties", key: "My Bounties" },
                        { icon: <IconMsg />, label: "Messages", key: "Messages", badge: 3 },
                        { icon: <IconBell />, label: "Alerts", key: "Alerts" },
                    ].map((item) => (
                        <button
                            key={item.key}
                            onClick={() => setActiveNav(item.key)}
                            className={`flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl border-none cursor-pointer transition-all relative
                ${activeNav === item.key
                                    ? "text-[#A855F7] bg-[#A855F7]/10"
                                    : "text-[#555] bg-transparent hover:text-[#A855F7]"
                                }`}
                        >
                            {item.icon}
                            <span className="text-[9px] font-semibold tracking-wide">{item.label}</span>
                            {item.badge && (
                                <span className="absolute top-1 right-1 bg-[#FF003C] text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                    {item.badge}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
