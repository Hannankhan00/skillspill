"use client";

import React, { useState } from "react";
import Link from "next/link";

/* ═══════════════════════════════════════════════
   S K I L L S P I L L  —  R E C R U I T E R  P R O F I L E
   LinkedIn-style profile page for recruiter users
   ═══════════════════════════════════════════════ */

/* ── Mock Data ── */
const profileData = {
    name: "Recruiter",
    companyName: "TechForge Solutions",
    tagline: "Talent Scout • Engineering Recruitment Lead",
    bio: "Connecting exceptional developers with groundbreaking opportunities. Specialized in sourcing top-tier talent for AI/ML, full-stack, and systems engineering roles. Passionate about building diverse engineering teams that push boundaries. Over 500+ successful placements across startups and Fortune 500 companies.",
    location: "San Francisco, CA",
    joinedDate: "Mar 2024",
    verified: true,
    stats: {
        bounties: 12,
        hires: 47,
        applicants: 1823,
        responseRate: "96%",
    },
    activeBounties: [
        {
            title: "Senior Rust Systems Engineer",
            budget: "$15,000",
            applicants: 23,
            daysLeft: 12,
            tags: ["Rust", "Systems", "Performance"],
            status: "Active",
        },
        {
            title: "Full-Stack Lead (React + Node)",
            budget: "$12,000",
            applicants: 34,
            daysLeft: 8,
            tags: ["React", "Node.js", "TypeScript"],
            status: "Active",
        },
        {
            title: "ML Engineer — Computer Vision",
            budget: "$18,000",
            applicants: 15,
            daysLeft: 20,
            tags: ["Python", "PyTorch", "CV"],
            status: "Active",
        },
        {
            title: "DevOps / SRE Lead",
            budget: "$14,000",
            applicants: 19,
            daysLeft: 5,
            tags: ["Kubernetes", "AWS", "Terraform"],
            status: "Closing Soon",
        },
    ],
    recentHires: [
        { name: "Sarah_Codes", role: "Full-Stack Engineer", matchScore: 94, initials: "SC", grad: "from-violet-500 to-purple-600" },
        { name: "RustWizard", role: "Systems Engineer", matchScore: 91, initials: "RW", grad: "from-orange-400 to-red-500" },
        { name: "MLQueen", role: "ML Engineer", matchScore: 89, initials: "MQ", grad: "from-blue-400 to-indigo-500" },
        { name: "CloudNinja", role: "DevOps Engineer", matchScore: 87, initials: "CN", grad: "from-cyan-400 to-blue-500" },
    ],
    skillDemand: [
        { name: "Rust", demand: 92, trending: true },
        { name: "React", demand: 88, trending: false },
        { name: "TypeScript", demand: 85, trending: true },
        { name: "Python/ML", demand: 90, trending: true },
        { name: "Kubernetes", demand: 78, trending: false },
        { name: "Go", demand: 74, trending: true },
    ],
    companyInfo: {
        industry: "Technology & AI",
        size: "500 – 2,000 employees",
        founded: "2018",
        website: "https://techforge.io",
        specialties: ["AI/ML", "Cloud Infrastructure", "Developer Tools", "Cybersecurity"],
    },
    recentPosts: [
        {
            id: 1,
            content: "🚀 We just opened a Senior Rust Systems Engineer bounty on SkillSpill! Looking for someone passionate about zero-cost abstractions and high-performance systems. $15k budget. Let's connect!",
            likes: 89,
            comments: 14,
            time: "3h",
        },
        {
            id: 2,
            content: "Just closed our Full-Stack Lead position in record time — 8 days from posting to hire! SkillSpill's skills-first approach made it incredibly easy to find the right candidate. 💜",
            likes: 234,
            comments: 42,
            time: "2d",
        },
        {
            id: 3,
            content: "Hot take: The best engineering hires I've made weren't from the most prestigious companies — they were from open-source contributors with deep domain expertise. Skills > Pedigree.",
            likes: 567,
            comments: 93,
            time: "5d",
        },
    ],
};

const accent = "#A855F7";

export default function RecruiterProfilePage() {
    const [activeTab, setActiveTab] = useState("Overview");
    const tabs = ["Overview", "Bounties", "Posts", "Hires"];

    return (
        <div className="min-h-full bg-[#F5F5F7]">

            {/* ════════ COVER / BANNER ════════ */}
            <div className="relative">
                <div className="h-32 sm:h-44 lg:h-52 w-full bg-gradient-to-r from-purple-500 via-violet-500 to-indigo-600 relative overflow-hidden">
                    {/* Pattern overlay */}
                    <div className="absolute inset-0 opacity-10"
                        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fff' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
                    />
                    {/* Decoration */}
                    <div className="absolute right-4 sm:right-8 top-4 sm:top-6 text-white/20 font-mono text-[10px] sm:text-xs hidden sm:block text-right">
                        <p>{"// recruiter.profile"}</p>
                        <p>{"const hires = 47;"}</p>
                        <p>{"const successRate = \"96%\";"}</p>
                    </div>
                </div>

                {/* Avatar */}
                <div className="max-w-[900px] mx-auto px-4 sm:px-6">
                    <div className="relative -mt-12 sm:-mt-16 flex items-end gap-4">
                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-purple-400 to-violet-600 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold border-4 border-white shadow-xl shrink-0">
                            RC
                        </div>
                        <div className="pb-1 sm:pb-2 min-w-0 hidden sm:block">
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{profileData.name}</h1>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="#8B5CF6" stroke="white" strokeWidth="2">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                                </svg>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">Recruiter</span>
                            </div>
                            <p className="text-[13px] text-gray-500 mt-0.5">{profileData.tagline}</p>
                            <p className="text-[11px] text-purple-500 font-medium">{profileData.companyName}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile name */}
            <div className="sm:hidden px-4 mt-3">
                <div className="flex items-center gap-2">
                    <h1 className="text-lg font-bold text-gray-900">{profileData.name}</h1>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#8B5CF6" stroke="white" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700">Recruiter</span>
                </div>
                <p className="text-[12px] text-gray-500 mt-0.5">{profileData.tagline}</p>
                <p className="text-[11px] text-purple-500 font-medium">{profileData.companyName}</p>
            </div>

            {/* ════════ MAIN CONTENT ════════ */}
            <div className="max-w-[900px] mx-auto px-4 sm:px-6 pb-20 lg:pb-8">

                {/* ── Stats row ── */}
                <div className="flex items-center gap-3 sm:gap-6 mt-4 sm:mt-5 pb-4 border-b border-gray-200">
                    {[
                        { label: "Bounties", value: profileData.stats.bounties },
                        { label: "Hires", value: profileData.stats.hires },
                        { label: "Applicants", value: profileData.stats.applicants.toLocaleString() },
                        { label: "Response", value: profileData.stats.responseRate },
                    ].map(stat => (
                        <div key={stat.label} className="text-center">
                            <p className="text-sm sm:text-lg font-bold text-gray-800">{stat.value}</p>
                            <p className="text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-wider">{stat.label}</p>
                        </div>
                    ))}
                    <div className="ml-auto flex gap-2">
                        <button className="px-4 sm:px-5 py-2 rounded-xl text-[11px] sm:text-[12px] font-bold text-white border-none cursor-pointer transition-all hover:scale-105"
                            style={{ background: `linear-gradient(135deg, ${accent}, #7C3AED)`, boxShadow: `0 0 15px ${accent}40` }}>
                            Edit Profile
                        </button>
                        <button className="px-3 py-2 rounded-xl text-[11px] sm:text-[12px] font-medium border border-gray-200 bg-white text-gray-600 cursor-pointer hover:bg-gray-50 transition-all hidden sm:block">
                            Share
                        </button>
                    </div>
                </div>

                {/* ── Tabs ── */}
                <div className="flex gap-0 mt-0 border-b border-gray-200 overflow-x-auto scrollbar-none">
                    {tabs.map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)}
                            className={`px-4 sm:px-6 py-3 text-[12px] sm:text-[13px] font-semibold border-b-2 transition-all cursor-pointer bg-transparent whitespace-nowrap
                                ${activeTab === tab ? "border-purple-500 text-purple-600" : "border-transparent text-gray-400 hover:text-gray-600"}`}>
                            {tab}
                        </button>
                    ))}
                </div>

                {/* ── Tab Content ── */}
                <div className="mt-5 space-y-5">

                    {activeTab === "Overview" && (
                        <>
                            {/* About */}
                            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4 sm:p-5">
                                <h2 className="text-[14px] font-bold text-gray-800 mb-2">About</h2>
                                <p className="text-[13px] text-gray-600 leading-relaxed">{profileData.bio}</p>
                                <div className="flex flex-wrap gap-3 mt-3 text-[11px] text-gray-400">
                                    <span className="flex items-center gap-1">
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                                        {profileData.location}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                                        Joined {profileData.joinedDate}
                                    </span>
                                    <span className="flex items-center gap-1 text-purple-500 font-medium">
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                                        Verified Recruiter
                                    </span>
                                </div>
                            </div>

                            {/* Company Info */}
                            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4 sm:p-5">
                                <h2 className="text-[14px] font-bold text-gray-800 mb-3 flex items-center gap-2">
                                    🏢 Company
                                </h2>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-violet-600 flex items-center justify-center text-white text-[11px] font-bold">TF</div>
                                    <div>
                                        <p className="text-[13px] font-bold text-gray-800">{profileData.companyName}</p>
                                        <p className="text-[11px] text-gray-400">{profileData.companyInfo.industry}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { label: "Size", value: profileData.companyInfo.size },
                                        { label: "Founded", value: profileData.companyInfo.founded },
                                    ].map(info => (
                                        <div key={info.label} className="bg-purple-50 rounded-xl px-3 py-2.5">
                                            <p className="text-[9px] text-gray-400 uppercase tracking-wider">{info.label}</p>
                                            <p className="text-[12px] font-semibold text-gray-700 mt-0.5">{info.value}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex flex-wrap gap-1.5 mt-3">
                                    {profileData.companyInfo.specialties.map(s => (
                                        <span key={s} className="text-[9px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 font-medium">{s}</span>
                                    ))}
                                </div>
                            </div>

                            {/* Skill Demand */}
                            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4 sm:p-5">
                                <h2 className="text-[14px] font-bold text-gray-800 mb-3">📊 Skills In Demand</h2>
                                <div className="space-y-3">
                                    {profileData.skillDemand.map(skill => (
                                        <div key={skill.name}>
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-[12px] font-medium text-gray-700 flex items-center gap-1.5">
                                                    {skill.name}
                                                    {skill.trending && <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-600 font-bold">🔥 HOT</span>}
                                                </span>
                                                <span className="text-[10px] text-gray-400">{skill.demand}%</span>
                                            </div>
                                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div className="h-full rounded-full transition-all duration-700"
                                                    style={{ width: `${skill.demand}%`, background: `linear-gradient(90deg, ${accent}, #7C3AED)` }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Recent Hires Preview */}
                            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4 sm:p-5">
                                <h2 className="text-[14px] font-bold text-gray-800 mb-3">🎯 Recent Successful Hires</h2>
                                <div className="space-y-2.5">
                                    {profileData.recentHires.slice(0, 3).map(hire => (
                                        <div key={hire.name} className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 hover:bg-purple-50 transition-colors">
                                            <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${hire.grad} flex items-center justify-center text-white text-[10px] font-bold`}>{hire.initials}</div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[12px] font-semibold text-gray-700">{hire.name}</p>
                                                <p className="text-[10px] text-gray-400">{hire.role}</p>
                                            </div>
                                            <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-purple-100 text-purple-700">{hire.matchScore}% match</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === "Bounties" && (
                        <div className="space-y-4">
                            {profileData.activeBounties.map((bounty, i) => (
                                <div key={i} className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4 sm:p-5 hover:border-purple-300 hover:shadow-md transition-all">
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <h3 className="text-[14px] font-bold text-gray-800">{bounty.title}</h3>
                                            <p className="text-[12px] text-purple-500 font-semibold mt-0.5">{bounty.budget}</p>
                                        </div>
                                        <span className={`text-[9px] font-bold px-2 py-1 rounded-full ${bounty.status === "Active" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                                            {bounty.status}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5 mb-3">
                                        {bounty.tags.map(tag => (
                                            <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 font-medium">{tag}</span>
                                        ))}
                                    </div>
                                    <div className="flex items-center justify-between text-[11px] text-gray-400 pt-3 border-t border-gray-100">
                                        <div className="flex items-center gap-4">
                                            <span className="flex items-center gap-1">
                                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
                                                {bounty.applicants} applicants
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                                {bounty.daysLeft} days left
                                            </span>
                                        </div>
                                        <button className="text-[11px] font-medium text-purple-500 hover:text-purple-700 cursor-pointer bg-transparent border-none transition-colors">
                                            View Details →
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === "Posts" && (
                        <div className="space-y-4">
                            {profileData.recentPosts.map(post => (
                                <div key={post.id} className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4 sm:p-5">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-violet-600 flex items-center justify-center text-white text-[11px] font-bold">RC</div>
                                        <div>
                                            <div className="flex items-center gap-1.5">
                                                <p className="text-[13px] font-bold text-gray-800">{profileData.name}</p>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="#8B5CF6" stroke="white" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                                            </div>
                                            <p className="text-[10px] text-gray-400">{post.time} ago • {profileData.companyName}</p>
                                        </div>
                                    </div>
                                    <p className="text-[13px] text-gray-700 leading-relaxed">{post.content}</p>
                                    <div className="flex items-center gap-6 mt-3 pt-3 border-t border-gray-100">
                                        <span className="text-[11px] text-gray-400 flex items-center gap-1">❤️ {post.likes}</span>
                                        <span className="text-[11px] text-gray-400 flex items-center gap-1">💬 {post.comments}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === "Hires" && (
                        <div className="space-y-4">
                            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4 sm:p-5">
                                <h2 className="text-[14px] font-bold text-gray-800 mb-1">Hiring Track Record</h2>
                                <p className="text-[12px] text-gray-500 mb-4">Successful placements through SkillSpill's skills-first matching</p>

                                {/* Stats cards */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                                    {[
                                        { label: "Total Hires", value: "47", icon: "🏆", bg: "bg-purple-50" },
                                        { label: "Avg Match", value: "92%", icon: "🎯", bg: "bg-green-50" },
                                        { label: "Time to Hire", value: "11d", icon: "⚡", bg: "bg-orange-50" },
                                        { label: "Retention", value: "95%", icon: "💎", bg: "bg-blue-50" },
                                    ].map(card => (
                                        <div key={card.label} className={`${card.bg} rounded-xl p-3 text-center`}>
                                            <p className="text-lg">{card.icon}</p>
                                            <p className="text-[16px] font-bold text-gray-800">{card.value}</p>
                                            <p className="text-[9px] text-gray-400 uppercase tracking-wider">{card.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* All hires list */}
                            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4 sm:p-5">
                                <h2 className="text-[14px] font-bold text-gray-800 mb-3">All Hires</h2>
                                <div className="space-y-2.5">
                                    {profileData.recentHires.map(hire => (
                                        <div key={hire.name} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-purple-50 transition-colors">
                                            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${hire.grad} flex items-center justify-center text-white text-[11px] font-bold`}>{hire.initials}</div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[13px] font-semibold text-gray-700">{hire.name}</p>
                                                <p className="text-[11px] text-gray-400">{hire.role}</p>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <span className="text-[11px] font-bold text-purple-600">{hire.matchScore}%</span>
                                                <p className="text-[9px] text-gray-400">Match Score</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
