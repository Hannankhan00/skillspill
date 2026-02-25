"use client";

import React, { useState } from "react";
import Link from "next/link";

/* ===== SKILLSPILL - TALENT PROFILE ===== */

/* -- Mock Data -- */
const profileData = {
    name: "Ghost_Protocol",
    tagline: "Full-Stack Developer \u2022 Open Source Contributor",
    bio: "Passionate full-stack developer with 5+ years of experience building scalable web applications. I specialize in React, Node.js, and cloud architecture. Currently exploring Rust and WebAssembly. Love contributing to open-source and mentoring junior developers. \uD83D\uDE80",
    level: 42,
    rank: "Shadow",
    location: "London, UK",
    joinedDate: "Jan 2024",
    availability: true,
    stats: {
        spills: 23,
        followers: 1247,
        following: 847,
        views: 4821,
    },
    skills: [
        { name: "React", level: 95, endorsed: 34 },
        { name: "TypeScript", level: 92, endorsed: 28 },
        { name: "Node.js", level: 88, endorsed: 22 },
        { name: "Rust", level: 72, endorsed: 15 },
        { name: "Python", level: 85, endorsed: 19 },
        { name: "PostgreSQL", level: 80, endorsed: 12 },
        { name: "Docker", level: 78, endorsed: 10 },
        { name: "AWS", level: 75, endorsed: 14 },
    ],
    experience: [
        {
            title: "Senior Full-Stack Developer",
            company: "NeuralForge AI",
            period: "2023 \u2013 Present",
            description: "Leading development of AI-powered developer tools. Built real-time collaboration engine using CRDTs.",
            tech: ["React", "TypeScript", "Rust", "WebSockets"],
        },
        {
            title: "Full-Stack Developer",
            company: "CloudNine Studios",
            period: "2021 \u2013 2023",
            description: "Developed and maintained microservices architecture serving 2M+ users. Reduced API latency by 40%.",
            tech: ["Node.js", "React", "PostgreSQL", "Docker"],
        },
        {
            title: "Junior Developer",
            company: "StartupHub",
            period: "2019 \u2013 2021",
            description: "Built MVPs for 3 startups. Gained full-stack expertise across multiple technology stacks.",
            tech: ["JavaScript", "Python", "MongoDB", "AWS"],
        },
    ],
    projects: [
        {
            name: "CRDTSync Engine",
            description: "Real-time collaborative editing engine with conflict resolution",
            stars: 342,
            forks: 67,
            lang: "TypeScript",
            langColor: "#3178C6",
        },
        {
            name: "RustSearch",
            description: "High-performance search library with zero-cost abstractions",
            stars: 189,
            forks: 28,
            lang: "Rust",
            langColor: "#DEA584",
        },
        {
            name: "ReactFlow Pro",
            description: "Advanced node-based editor for visual programming",
            stars: 256,
            forks: 45,
            lang: "React",
            langColor: "#61DAFB",
        },
    ],
    github: {
        connected: true,
        username: "ghost-protocol",
        repos: 47,
        stars: 1283,
        contributions: 2847,
    },
    links: {
        portfolio: "https://ghostprotocol.dev",
        linkedin: "https://linkedin.com/in/ghostprotocol",
        github: "https://github.com/ghost-protocol",
    },
    recentSpills: [
        {
            id: 1,
            content: "Just shipped a recursive search optimizer in Rust \u2014 24% latency reduction using zero-cost abstractions. \u26A1",
            likes: 128,
            comments: 24,
            time: "2h",
        },
        {
            id: 2,
            content: "Built a real-time collaborative editor using CRDTs. The conflict resolution is surprisingly elegant when you get the data structures right. \uD83D\uDD27",
            likes: 203,
            comments: 41,
            time: "1d",
        },
        {
            id: 3,
            content: "Hot take: TypeScript's type system is basically a functional programming language that generates JavaScript as a side effect. \uD83E\uDD2F",
            likes: 456,
            comments: 78,
            time: "3d",
        },
    ],
};

const accent = "#3CF91A";

export default function TalentProfilePage() {
    const [activeTab, setActiveTab] = useState("Overview");
    const tabs = ["Overview", "Spills", "Projects", "Skills"];

    return (
        <div style={{ background: "var(--theme-bg)" }} className="min-h-full">

            {/* ===== COVER / BANNER ===== */}
            <div className="relative">
                <div className="h-32 sm:h-44 lg:h-52 w-full bg-gradient-to-r from-[#3CF91A] via-green-400 to-cyan-500 relative overflow-hidden">
                    {/* Pattern overlay */}
                    <div className="absolute inset-0 opacity-10"
                        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-rule='evenodd'%3E%3Cpath d='M0 0h20v20H0zM20 20h20v20H20z'/%3E%3C/g%3E%3C/svg%3E\")" }}
                    />
                    {/* Code decoration */}
                    <div className="absolute right-4 sm:right-8 top-4 sm:top-6 text-white/20 font-mono text-[10px] sm:text-xs hidden sm:block text-right">
                        <p>{"// ghost_protocol.profile"}</p>
                        <p>{"const level = 42;"}</p>
                        <p>{"const rank = \"Shadow\";"}</p>
                    </div>
                </div>

                {/* Avatar */}
                <div className="max-w-[900px] mx-auto px-4 sm:px-6">
                    <div className="relative -mt-12 sm:-mt-16 flex items-end gap-4">
                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-green-400 to-[#2edb13] flex items-center justify-center text-white text-2xl sm:text-3xl font-bold border-4 shadow-xl shrink-0" style={{ borderColor: 'var(--theme-surface)' }}>
                            GP
                        </div>
                        <div className="pb-1 sm:pb-2 min-w-0 hidden sm:block">
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl sm:text-2xl font-bold text-[var(--theme-text-primary)]">{profileData.name}</h1>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="#22C55E" stroke="var(--theme-card)" strokeWidth="2">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                                </svg>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#3CF91A]/10 text-[#2edb13]">Lv.{profileData.level}</span>
                            </div>
                            <p className="text-[13px] text-[var(--theme-text-muted)] mt-0.5">{profileData.tagline}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile name (below avatar) */}
            <div className="sm:hidden px-4 mt-3">
                <div className="flex items-center gap-2">
                    <h1 className="text-lg font-bold text-[var(--theme-text-primary)]">{profileData.name}</h1>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#22C55E" stroke="var(--theme-card)" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#3CF91A]/10 text-[#2edb13]">Lv.{profileData.level}</span>
                </div>
                <p className="text-[12px] text-[var(--theme-text-muted)] mt-0.5">{profileData.tagline}</p>
            </div>

            {/* ===== MAIN CONTENT ===== */}
            <div className="max-w-[900px] mx-auto px-4 sm:px-6 pb-20 lg:pb-8">

                {/* -- Stats row -- */}
                <div className="flex items-center gap-3 sm:gap-6 mt-4 sm:mt-5 pb-4 border-b border-[var(--theme-border)]">
                    {[
                        { label: "Spills", value: profileData.stats.spills },
                        { label: "Followers", value: profileData.stats.followers.toLocaleString() },
                        { label: "Following", value: profileData.stats.following },
                        { label: "Profile Views", value: profileData.stats.views.toLocaleString() },
                    ].map(stat => (
                        <div key={stat.label} className="text-center">
                            <p className="text-sm sm:text-lg font-bold text-[var(--theme-text-primary)]">{stat.value}</p>
                            <p className="text-[9px] sm:text-[10px] text-[var(--theme-text-muted)] uppercase tracking-wider">{stat.label}</p>
                        </div>
                    ))}
                    <div className="ml-auto flex gap-2">
                        <button className="px-4 sm:px-5 py-2 rounded-xl text-[11px] sm:text-[12px] font-bold border-none cursor-pointer text-black transition-all hover:scale-105"
                            style={{ background: accent, boxShadow: `0 0 15px ${accent}40` }}>
                            Edit Profile
                        </button>
                        <button className="px-3 py-2 rounded-xl text-[11px] sm:text-[12px] font-medium border border-[var(--theme-border)] bg-[var(--theme-card)] text-[var(--theme-text-tertiary)] cursor-pointer hover:bg-[var(--theme-bg-secondary)] transition-all hidden sm:block">
                            Share
                        </button>
                    </div>
                </div>

                {/* -- Tabs -- */}
                <div className="flex gap-0 mt-0 border-b border-[var(--theme-border)] overflow-x-auto scrollbar-none">
                    {tabs.map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)}
                            className={`px-4 sm:px-6 py-3 text-[12px] sm:text-[13px] font-semibold border-b-2 transition-all cursor-pointer bg-transparent whitespace-nowrap
                                ${activeTab === tab ? "border-[#3CF91A] text-[#2edb13]" : "border-transparent text-[var(--theme-text-muted)] hover:text-[var(--theme-text-tertiary)]"}`}>
                            {tab}
                        </button>
                    ))}
                </div>

                {/* -- Tab Content -- */}
                <div className="mt-5 space-y-5">

                    {activeTab === "Overview" && (
                        <>
                            {/* About */}
                            <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm p-4 sm:p-5">
                                <h2 className="text-[14px] font-bold text-[var(--theme-text-primary)] mb-2">About</h2>
                                <p className="text-[13px] text-[var(--theme-text-tertiary)] leading-relaxed">{profileData.bio}</p>
                                <div className="flex flex-wrap gap-3 mt-3 text-[11px] text-[var(--theme-text-muted)]">
                                    <span className="flex items-center gap-1">
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                                        {profileData.location}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                                        Joined {profileData.joinedDate}
                                    </span>
                                    {profileData.availability && (
                                        <span className="flex items-center gap-1 text-[#3CF91A] font-medium">
                                            <span className="w-2 h-2 rounded-full bg-[#3CF91A]" />
                                            Open to Opportunities
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* GitHub Stats */}
                            {profileData.github.connected && (
                                <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm p-4 sm:p-5">
                                    <div className="flex items-center justify-between mb-3">
                                        <h2 className="text-[14px] font-bold text-[var(--theme-text-primary)] flex items-center gap-2">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" /></svg>
                                            GitHub
                                        </h2>
                                        <span className="text-[10px] px-2 py-1 rounded-full bg-green-500/15 text-green-500 font-medium">Connected</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3">
                                        {[
                                            { label: "Repos", value: profileData.github.repos, icon: "\uD83D\uDCE6" },
                                            { label: "Stars", value: profileData.github.stars.toLocaleString(), icon: "\u2B50" },
                                            { label: "Contributions", value: profileData.github.contributions.toLocaleString(), icon: "\uD83D\uDD25" },
                                        ].map(stat => (
                                            <div key={stat.label} className="bg-[var(--theme-bg-secondary)] rounded-xl p-3 text-center">
                                                <p className="text-lg">{stat.icon}</p>
                                                <p className="text-[15px] font-bold text-[var(--theme-text-primary)]">{stat.value}</p>
                                                <p className="text-[9px] text-[var(--theme-text-muted)] uppercase tracking-wider">{stat.label}</p>
                                            </div>
                                        ))}
                                    </div>
                                    {/* Contribution heatmap placeholder */}
                                    <div className="mt-4 rounded-xl bg-[var(--theme-bg-secondary)] p-3">
                                        <p className="text-[10px] text-[var(--theme-text-muted)] mb-2 font-medium">CONTRIBUTION ACTIVITY</p>
                                        <div className="flex gap-[3px] flex-wrap">
                                            {Array.from({ length: 52 * 7 }).map((_, i) => {
                                                const intensity = Math.random();
                                                let bg = "var(--theme-input-bg)";
                                                if (intensity > 0.8) bg = "#16A34A";
                                                else if (intensity > 0.6) bg = "#22C55E";
                                                else if (intensity > 0.4) bg = "#2D9B4E";
                                                else if (intensity > 0.2) bg = "#1A6B35";
                                                return <div key={i} className="w-[8px] h-[8px] sm:w-[10px] sm:h-[10px] rounded-[2px]" style={{ backgroundColor: bg }} />;
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Top Skills */}
                            <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm p-4 sm:p-5">
                                <h2 className="text-[14px] font-bold text-[var(--theme-text-primary)] mb-3">Top Skills</h2>
                                <div className="space-y-3">
                                    {profileData.skills.slice(0, 5).map(skill => (
                                        <div key={skill.name}>
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-[12px] font-medium text-[var(--theme-text-secondary)]">{skill.name}</span>
                                                <span className="text-[10px] text-[var(--theme-text-muted)]">{skill.endorsed} endorsements</span>
                                            </div>
                                            <div className="h-2 bg-[var(--theme-input-bg)] rounded-full overflow-hidden">
                                                <div className="h-full rounded-full transition-all duration-700"
                                                    style={{ width: `${skill.level}%`, background: `linear-gradient(90deg, #22C55E, ${accent})` }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Experience */}
                            <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm p-4 sm:p-5">
                                <h2 className="text-[14px] font-bold text-[var(--theme-text-primary)] mb-3">Experience</h2>
                                <div className="space-y-4">
                                    {profileData.experience.map((exp, i) => (
                                        <div key={i} className={`relative pl-6 ${i < profileData.experience.length - 1 ? "pb-4 border-l-2 border-[var(--theme-border-light)] ml-1.5" : "ml-1.5"}`}>
                                            <div className="absolute left-0 top-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#3CF91A] bg-[var(--theme-card)] -translate-x-[7px]" />
                                            <h3 className="text-[13px] font-bold text-[var(--theme-text-primary)]">{exp.title}</h3>
                                            <p className="text-[11px] text-[#2edb13] font-medium">{exp.company}</p>
                                            <p className="text-[10px] text-[var(--theme-text-muted)] mt-0.5">{exp.period}</p>
                                            <p className="text-[12px] text-[var(--theme-text-tertiary)] mt-1.5 leading-relaxed">{exp.description}</p>
                                            <div className="flex flex-wrap gap-1.5 mt-2">
                                                {exp.tech.map(t => (
                                                    <span key={t} className="text-[9px] px-2 py-0.5 rounded-full bg-[#3CF91A]/10 text-[#2edb13] font-medium">{t}</span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Links */}
                            <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm p-4 sm:p-5">
                                <h2 className="text-[14px] font-bold text-[var(--theme-text-primary)] mb-3">Links</h2>
                                <div className="space-y-2">
                                    {[
                                        { label: "Portfolio", url: profileData.links.portfolio, icon: "\uD83C\uDF10" },
                                        { label: "LinkedIn", url: profileData.links.linkedin, icon: "\uD83D\uDCBC" },
                                        { label: "GitHub", url: profileData.links.github, icon: "\uD83D\uDC19" },
                                    ].map(link => (
                                        <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer"
                                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[var(--theme-bg-secondary)] hover:bg-[#3CF91A]/10 transition-colors group no-underline">
                                            <span className="text-base">{link.icon}</span>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[12px] font-medium text-[var(--theme-text-secondary)] group-hover:text-[#2edb13]">{link.label}</p>
                                                <p className="text-[10px] text-[var(--theme-text-muted)] truncate">{link.url}</p>
                                            </div>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" className="group-hover:stroke-[#3CF91A] shrink-0"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === "Spills" && (
                        <div className="space-y-4">
                            {profileData.recentSpills.map(spill => (
                                <div key={spill.id} className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm p-4 sm:p-5">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-[#2edb13] flex items-center justify-center text-white text-[11px] font-bold">GP</div>
                                        <div>
                                            <p className="text-[13px] font-bold text-[var(--theme-text-primary)]">{profileData.name}</p>
                                            <p className="text-[10px] text-[var(--theme-text-muted)]">{spill.time} ago</p>
                                        </div>
                                    </div>
                                    <p className="text-[13px] text-[var(--theme-text-secondary)] leading-relaxed">{spill.content}</p>
                                    <div className="flex items-center gap-6 mt-3 pt-3 border-t border-[var(--theme-border-light)]">
                                        <span className="text-[11px] text-[var(--theme-text-muted)] flex items-center gap-1">{"\u2764\uFE0F"} {spill.likes}</span>
                                        <span className="text-[11px] text-[var(--theme-text-muted)] flex items-center gap-1">{"\uD83D\uDCAC"} {spill.comments}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === "Projects" && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {profileData.projects.map(project => (
                                <div key={project.name} className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm p-4 sm:p-5 hover:border-[#3CF91A] hover:shadow-md transition-all">
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="text-[14px] font-bold text-[var(--theme-text-primary)]">{project.name}</h3>
                                        <span className="flex items-center gap-1 text-[10px] text-[var(--theme-text-muted)]">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                                            {project.stars}
                                        </span>
                                    </div>
                                    <p className="text-[12px] text-[var(--theme-text-muted)] mb-3">{project.description}</p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: project.langColor }} />
                                            <span className="text-[11px] text-[var(--theme-text-tertiary)]">{project.lang}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-[10px] text-[var(--theme-text-muted)]">
                                            <span className="flex items-center gap-1">
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                                                {project.stars}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="6" y1="3" x2="6" y2="15" /><circle cx="18" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M18 9a9 9 0 0 1-9 9" /></svg>
                                                {project.forks}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === "Skills" && (
                        <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm p-4 sm:p-5">
                            <h2 className="text-[14px] font-bold text-[var(--theme-text-primary)] mb-4">All Skills</h2>
                            <div className="space-y-4">
                                {profileData.skills.map(skill => (
                                    <div key={skill.name}>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-[13px] font-medium text-[var(--theme-text-secondary)]">{skill.name}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] text-[var(--theme-text-muted)]">{skill.endorsed} endorsements</span>
                                                <span className="text-[11px] font-bold" style={{ color: skill.level >= 90 ? "#16A34A" : skill.level >= 80 ? "#22C55E" : "#9CA3AF" }}>
                                                    {skill.level}%
                                                </span>
                                            </div>
                                        </div>
                                        <div className="h-2.5 bg-[var(--theme-input-bg)] rounded-full overflow-hidden">
                                            <div className="h-full rounded-full transition-all duration-700"
                                                style={{ width: `${skill.level}%`, background: skill.level >= 90 ? `linear-gradient(90deg, #16A34A, ${accent})` : skill.level >= 80 ? "linear-gradient(90deg, #22C55E, #4ADE80)" : "var(--theme-text-muted)" }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
