"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Building2, BarChart2, Flame, Target, Trophy, Zap, Gem, Heart, MessageSquare } from "lucide-react";

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   S K I L L S P I L L  —  R E C R U I T E R  P R O F I L E
   LinkedIn-style profile page for recruiter users
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

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
            content: "We just opened a Senior Rust Systems Engineer bounty on SkillSpill! Looking for someone passionate about zero-cost abstractions and high-performance systems. $15k budget. Let's connect!",
            likes: 89,
            comments: 14,
            time: "3h",
        },
        {
            id: 2,
            content: "Just closed our Full-Stack Lead position in record time — 8 days from posting to hire! SkillSpill's skills-first approach made it incredibly easy to find the right candidate.",
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
    const tabs = ["Overview", "Posts", "Hires"];
    const [showWelcome, setShowWelcome] = useState(false);
    const [isProfileIncomplete, setIsProfileIncomplete] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);

    const [userData, setUserData] = useState({ ...profileData, email: "recruiter@example.com", bio: "", phone: "", country: "" });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get("welcome") === "true") {
                setShowWelcome(true);
            }
        }

        fetch("/api/user/profile")
            .then(res => res.json())
            .then(data => {
                if (data.user) {
                    setUserData(prev => ({
                        ...prev,
                        name: data.user.fullName || prev.name,
                        email: data.user.email || prev.email,
                        tagline: data.user.recruiterProfile?.jobTitle || prev.tagline,
                        companyName: data.user.recruiterProfile?.companyName || prev.companyName,
                        location: data.user.recruiterProfile?.location || prev.location,
                        country: data.user.recruiterProfile?.country || prev.country,
                        phone: data.user.recruiterProfile?.phone || prev.phone,
                        bio: data.user.recruiterProfile?.bio || prev.bio,
                        companyInfo: {
                            ...prev.companyInfo,
                            website: data.user.recruiterProfile?.companyWebsite || prev.companyInfo.website,
                            size: data.user.recruiterProfile?.companySize || prev.companyInfo.size,
                        }
                    }));
                }
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));
    }, []);

    const handleSaveProfile = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const updateData = {
            fullName: formData.get("fullName") as string,
            email: formData.get("email") as string,
            recruiterProfile: {
                jobTitle: formData.get("jobTitle") as string,
                companyName: formData.get("companyName") as string,
                companyWebsite: formData.get("companyWebsite") as string,
                companySize: formData.get("companySize") as string,
                location: formData.get("location") as string,
                country: formData.get("country") as string,
                phone: formData.get("phone") as string,
                bio: formData.get("bio") as string,
            }
        };

        try {
            const res = await fetch("/api/user/profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updateData),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setUserData(prev => ({
                    ...prev,
                    name: updateData.fullName,
                    email: updateData.email,
                    tagline: updateData.recruiterProfile.jobTitle,
                    companyName: updateData.recruiterProfile.companyName,
                    location: updateData.recruiterProfile.location,
                    country: updateData.recruiterProfile.country,
                    phone: updateData.recruiterProfile.phone,
                    bio: updateData.recruiterProfile.bio,
                    companyInfo: {
                        ...prev.companyInfo,
                        website: updateData.recruiterProfile.companyWebsite,
                        size: updateData.recruiterProfile.companySize,
                    }
                }));
                setShowEditModal(false);
                setIsProfileIncomplete(false);
            }
        } catch (error) {
            console.error("Failed to update profile", error);
        }
    };

    return (
        <div style={{ background: "var(--theme-bg)" }} className="min-h-full">

            {/* ===== WELCOME POPUP ===== */}
            {showWelcome && (
                <div className="bg-[#A855F7]/10 border-b border-[#A855F7]/30 px-4 py-3 flex items-center justify-between">
                    <div>
                        <p className="text-[13px] font-bold text-[var(--theme-text-primary)]">Welcome to SkillSpill!</p>
                        <p className="text-[11px] text-[var(--theme-text-muted)] mt-0.5">Please take a moment to complete your profile before you start hiring.</p>
                    </div>
                    <button onClick={() => setShowWelcome(false)} className="px-4 py-1.5 rounded-lg text-[11px] font-bold text-white border-none cursor-pointer transition-all hover:scale-105" style={{ background: accent, boxShadow: `0 0 15px ${accent}40` }}>
                        Complete Profile
                    </button>
                </div>
            )}

            {/* â•â•â•â•â•â•â•â• COVER / BANNER â•â•â•â•â•â•â•â• */}
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
                                <h1 className="text-xl sm:text-2xl font-bold text-[var(--theme-text-primary)]">{userData.name}</h1>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="#8B5CF6" stroke="white" strokeWidth="2">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                                </svg>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#A855F7]/20 text-[#A855F7]">Recruiter</span>
                            </div>
                            <p className="text-[13px] text-[var(--theme-text-muted)] mt-0.5">{userData.tagline}</p>
                            <p className="text-[11px] text-[#A855F7] font-medium">{userData.companyName}</p>
                            {userData.companyInfo?.website && (
                                <a href={userData.companyInfo.website} target="_blank" rel="noopener noreferrer" className="text-[11px] text-[#3CF91A] hover:text-[#3CF91A]/80 transition-colors mt-0.5 inline-flex items-center gap-1">
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                                    {userData.companyInfo.website.replace(/^https?:\/\//, '')}
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile name */}
            <div className="sm:hidden px-4 mt-3">
                <div className="flex items-center gap-2">
                    <h1 className="text-lg font-bold text-[var(--theme-text-primary)]">{userData.name}</h1>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#8B5CF6" stroke="white" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#A855F7]/20 text-[#A855F7]">Recruiter</span>
                </div>
                <p className="text-[12px] text-[var(--theme-text-muted)] mt-0.5">{userData.tagline}</p>
                <p className="text-[11px] text-[#A855F7] font-medium">{userData.companyName}</p>
                {userData.companyInfo?.website && (
                    <a href={userData.companyInfo.website} target="_blank" rel="noopener noreferrer" className="text-[11px] text-[#3CF91A] hover:text-[#3CF91A]/80 transition-colors mt-0.5 inline-flex items-center gap-1">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                        {userData.companyInfo.website.replace(/^https?:\/\//, '')}
                    </a>
                )}
            </div>

            {/* â•â•â•â•â•â•â•â• MAIN CONTENT â•â•â•â•â•â•â•â• */}
            <div className="max-w-[900px] mx-auto px-4 sm:px-6 pb-24 lg:pb-8">

                {/* -- Profile Incomplete Alert -- */}
                {!showWelcome && isProfileIncomplete && (
                    <div className="mt-4 sm:mt-5 p-4 rounded-2xl border border-orange-500/30 bg-orange-500/5 sm:bg-orange-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-3">
                            <div className="mt-0.5 shrink-0">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                            </div>
                            <div>
                                <h3 className="text-[13px] font-bold text-orange-500">Action Required: Complete Your Profile</h3>
                                <p className="text-[11px] text-[var(--theme-text-muted)] mt-0.5 leading-relaxed">Your profile is missing key details. A complete profile increases your chances of attracting top candidates by up to 5x.</p>
                            </div>
                        </div>
                        <button onClick={() => setIsProfileIncomplete(false)} className="px-5 py-2.5 sm:py-2 w-full sm:w-auto rounded-xl text-[11px] font-bold text-white border-none cursor-pointer transition-all hover:scale-105 shrink-0" style={{ background: `linear-gradient(135deg, ${accent}, #7C3AED)`, boxShadow: `0 0 15px ${accent}40` }}>
                            Complete Now
                        </button>
                    </div>
                )}

                {/* ── Stats row ── */}
                <div className="flex items-center gap-3 sm:gap-6 mt-4 sm:mt-5 pb-4 border-b border-[var(--theme-border)]">
                    {[
                        { label: "Hires", value: userData.stats.hires },
                        { label: "Applicants", value: userData.stats.applicants.toLocaleString() },
                        { label: "Response", value: userData.stats.responseRate },
                    ].map(stat => (
                        <div key={stat.label} className="text-center">
                            <p className="text-sm sm:text-lg font-bold text-[var(--theme-text-primary)]">{stat.value}</p>
                            <p className="text-[9px] sm:text-[10px] text-[var(--theme-text-muted)] uppercase tracking-wider">{stat.label}</p>
                        </div>
                    ))}
                    <div className="ml-auto flex gap-2">
                        <button onClick={() => setShowEditModal(true)} className="px-4 sm:px-5 py-2 rounded-xl text-[11px] sm:text-[12px] font-bold text-white border-none cursor-pointer transition-all hover:scale-105"
                            style={{ background: `linear-gradient(135deg, ${accent}, #7C3AED)`, boxShadow: `0 0 15px ${accent}40` }}>
                            Edit Profile
                        </button>
                        <button className="px-3 py-2 rounded-xl text-[11px] sm:text-[12px] font-medium border border-[var(--theme-border)] bg-[var(--theme-card)] text-[var(--theme-text-tertiary)] cursor-pointer hover:bg-[var(--theme-bg-secondary)] transition-all hidden sm:block">
                            Share
                        </button>
                    </div>
                </div>

                {/* ── Tabs ── */}
                <div className="flex gap-0 mt-0 border-b border-[var(--theme-border)] overflow-x-auto scrollbar-none">
                    {tabs.map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)}
                            className={`px-4 sm:px-6 py-3 text-[12px] sm:text-[13px] font-semibold border-b-2 transition-all cursor-pointer bg-transparent whitespace-nowrap
                                ${activeTab === tab ? "border-purple-500 text-[#A855F7]" : "border-transparent text-[var(--theme-text-muted)] hover:text-[var(--theme-text-tertiary)]"}`}>
                            {tab}
                        </button>
                    ))}
                </div>

                {/* ── Tab Content ── */}
                <div className="mt-5 space-y-5">

                    {activeTab === "Overview" && (
                        <>
                            {/* About */}
                            <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm p-4 sm:p-5">
                                <h2 className="text-[14px] font-bold text-[var(--theme-text-primary)] mb-2">About</h2>
                                <p className="text-[13px] text-[var(--theme-text-tertiary)] leading-relaxed">{userData.bio}</p>
                                <div className="flex flex-wrap gap-3 mt-3 text-[11px] text-[var(--theme-text-muted)]">
                                    <span className="flex items-center gap-1">
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                                        {userData.location}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                                        Joined {userData.joinedDate}
                                    </span>
                                    <span className="flex items-center gap-1 text-[#A855F7] font-medium">
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                                        Verified Recruiter
                                    </span>
                                </div>
                            </div>

                            {/* Company Info */}
                            <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm p-4 sm:p-5">
                                <h2 className="text-[14px] font-bold text-[var(--theme-text-primary)] mb-3 flex items-center gap-2">
                                    <Building2 className="w-4 h-4" /> Company
                                </h2>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-violet-600 flex items-center justify-center text-white text-[11px] font-bold">TF</div>
                                    <div>
                                        <p className="text-[13px] font-bold text-[var(--theme-text-primary)]">{userData.companyName}</p>
                                        <p className="text-[11px] text-[var(--theme-text-muted)]">{userData.companyInfo.industry}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { label: "Size", value: userData.companyInfo.size },
                                        { label: "Founded", value: userData.companyInfo.founded },
                                    ].map(info => (
                                        <div key={info.label} className="bg-[#A855F7]/10 rounded-xl px-3 py-2.5">
                                            <p className="text-[9px] text-[var(--theme-text-muted)] uppercase tracking-wider">{info.label}</p>
                                            <p className="text-[12px] font-semibold text-[var(--theme-text-secondary)] mt-0.5">{info.value}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex flex-wrap gap-1.5 mt-3">
                                    {userData.companyInfo.specialties.map(s => (
                                        <span key={s} className="text-[9px] px-2 py-0.5 rounded-full bg-[#A855F7]/10 text-[#A855F7] font-medium">{s}</span>
                                    ))}
                                </div>
                            </div>

                            {/* Skill Demand */}
                            <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm p-4 sm:p-5">
                                <h2 className="text-[14px] font-bold text-[var(--theme-text-primary)] mb-3 flex items-center gap-2"><BarChart2 className="w-4 h-4" /> Skills In Demand</h2>
                                <div className="space-y-3">
                                    {userData.skillDemand.map(skill => (
                                        <div key={skill.name}>
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-[12px] font-medium text-[var(--theme-text-secondary)] flex items-center gap-1.5">
                                                    {skill.name}
                                                    {skill.trending && <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-orange-500/20 text-orange-500 font-bold flex items-center gap-1"><Flame className="w-2.5 h-2.5" /> HOT</span>}
                                                </span>
                                                <span className="text-[10px] text-[var(--theme-text-muted)]">{skill.demand}%</span>
                                            </div>
                                            <div className="h-2 bg-[var(--theme-input-bg)] rounded-full overflow-hidden">
                                                <div className="h-full rounded-full transition-all duration-700"
                                                    style={{ width: `${skill.demand}%`, background: `linear-gradient(90deg, ${accent}, #7C3AED)` }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Recent Hires Preview */}
                            <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm p-4 sm:p-5">
                                <h2 className="text-[14px] font-bold text-[var(--theme-text-primary)] mb-3 flex items-center gap-2"><Target className="w-4 h-4" /> Recent Successful Hires</h2>
                                <div className="space-y-2.5">
                                    {userData.recentHires.slice(0, 3).map(hire => (
                                        <div key={hire.name} className="flex items-center gap-3 p-2.5 rounded-xl bg-[var(--theme-bg-secondary)] hover:bg-[#A855F7]/10 transition-colors">
                                            <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${hire.grad} flex items-center justify-center text-white text-[10px] font-bold`}>{hire.initials}</div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[12px] font-semibold text-[var(--theme-text-secondary)]">{hire.name}</p>
                                                <p className="text-[10px] text-[var(--theme-text-muted)]">{hire.role}</p>
                                            </div>
                                            <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-[#A855F7]/20 text-[#A855F7]">{hire.matchScore}% match</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === "Posts" && (
                        <div className="space-y-4">
                            {userData.recentPosts.map(post => (
                                <div key={post.id} className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm p-4 sm:p-5">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-violet-600 flex items-center justify-center text-white text-[11px] font-bold">RC</div>
                                        <div>
                                            <div className="flex items-center gap-1.5">
                                                <p className="text-[13px] font-bold text-[var(--theme-text-primary)]">{userData.name}</p>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="#8B5CF6" stroke="white" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                                            </div>
                                            <p className="text-[10px] text-[var(--theme-text-muted)]">{post.time} ago • {userData.companyName}</p>
                                        </div>
                                    </div>
                                    <p className="text-[13px] text-[var(--theme-text-secondary)] leading-relaxed">{post.content}</p>
                                    <div className="flex items-center gap-6 mt-3 pt-3 border-t border-[var(--theme-border-light)]">
                                        <span className="text-[11px] text-[var(--theme-text-muted)] flex items-center gap-1"><Heart className="w-3 h-3" /> {post.likes}</span>
                                        <span className="text-[11px] text-[var(--theme-text-muted)] flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {post.comments}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === "Hires" && (
                        <div className="space-y-4">
                            <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm p-4 sm:p-5">
                                <h2 className="text-[14px] font-bold text-[var(--theme-text-primary)] mb-1">Hiring Track Record</h2>
                                <p className="text-[12px] text-[var(--theme-text-muted)] mb-4">Successful placements through SkillSpill's skills-first matching</p>

                                {/* Stats cards */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                                    {[
                                        { label: "Total Hires", value: "47", icon: <Trophy className="w-5 h-5 text-[#A855F7]" />, bg: "bg-[#A855F7]/10" },
                                        { label: "Avg Match", value: "92%", icon: <Target className="w-5 h-5 text-green-500" />, bg: "bg-green-500/10" },
                                        { label: "Time to Hire", value: "11d", icon: <Zap className="w-5 h-5 text-orange-500" />, bg: "bg-orange-500/10" },
                                        { label: "Retention", value: "95%", icon: <Gem className="w-5 h-5 text-blue-500" />, bg: "bg-blue-500/10" },
                                    ].map(card => (
                                        <div key={card.label} className={`${card.bg} rounded-xl p-3 text-center`}>
                                            <p className="text-lg">{card.icon}</p>
                                            <p className="text-[16px] font-bold text-[var(--theme-text-primary)]">{card.value}</p>
                                            <p className="text-[9px] text-[var(--theme-text-muted)] uppercase tracking-wider">{card.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* All hires list */}
                            <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm p-4 sm:p-5">
                                <h2 className="text-[14px] font-bold text-[var(--theme-text-primary)] mb-3">All Hires</h2>
                                <div className="space-y-2.5">
                                    {profileData.recentHires.map(hire => (
                                        <div key={hire.name} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--theme-bg-secondary)] hover:bg-[#A855F7]/10 transition-colors">
                                            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${hire.grad} flex items-center justify-center text-white text-[11px] font-bold`}>{hire.initials}</div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[13px] font-semibold text-[var(--theme-text-secondary)]">{hire.name}</p>
                                                <p className="text-[11px] text-[var(--theme-text-muted)]">{hire.role}</p>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <span className="text-[11px] font-bold text-[#A855F7]">{hire.matchScore}%</span>
                                                <p className="text-[9px] text-[var(--theme-text-muted)]">Match Score</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ===== EDIT PROFILE MODAL ===== */}
            {showEditModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <form onSubmit={handleSaveProfile} className="w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden" style={{ background: 'var(--theme-surface)', border: `1px solid ${accent}40` }}>

                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--theme-border-light)' }}>
                            <h2 className="text-[16px] font-bold" style={{ color: 'var(--theme-text-primary)' }}>Edit Recruiter Profile</h2>
                            <button type="button" onClick={() => setShowEditModal(false)} className="text-[var(--theme-text-muted)] hover:text-white transition-colors cursor-pointer bg-transparent border-none">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                            </button>
                        </div>

                        {/* Body - Scrollable */}
                        <div className="p-6 overflow-y-auto" style={{ scrollbarWidth: "thin", scrollbarColor: 'var(--theme-scrollbar-thumb) var(--theme-scrollbar-track)' }}>
                            <div className="space-y-6">

                                {/* Basic Info */}
                                <div>
                                    <h3 className="text-[13px] font-bold text-[#A855F7] mb-4 uppercase tracking-wider h-[20px] flex items-center gap-2">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                        Personal Information
                                    </h3>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[11px] font-medium" style={{ color: 'var(--theme-text-secondary)' }}>Full Name</label>
                                            <input type="text" name="fullName" defaultValue={userData.name} className="px-3 py-2 rounded-lg text-[13px] outline-none" style={{ background: 'var(--theme-input-bg)', border: '1px solid var(--theme-border)', color: 'var(--theme-text-primary)' }} />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[11px] font-medium" style={{ color: 'var(--theme-text-secondary)' }}>Email</label>
                                            <input type="email" name="email" defaultValue={userData.email} className="px-3 py-2 rounded-lg text-[13px] outline-none" style={{ background: 'var(--theme-input-bg)', border: '1px solid var(--theme-border)', color: 'var(--theme-text-primary)' }} />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[11px] font-medium" style={{ color: 'var(--theme-text-secondary)' }}>Phone Number</label>
                                            <input type="tel" name="phone" defaultValue={userData.phone} placeholder="+1 (555) 000-0000" className="px-3 py-2 rounded-lg text-[13px] outline-none border border-transparent focus:border-[#A855F7] transition-colors" style={{ background: 'var(--theme-input-bg)', color: 'var(--theme-text-primary)' }} />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[11px] font-medium" style={{ color: 'var(--theme-text-secondary)' }}>Job Title / Role</label>
                                            <input type="text" name="jobTitle" defaultValue={userData.tagline} className="px-3 py-2 rounded-lg text-[13px] outline-none border border-transparent focus:border-[#A855F7] transition-colors" style={{ background: 'var(--theme-input-bg)', color: 'var(--theme-text-primary)' }} />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[11px] font-medium" style={{ color: 'var(--theme-text-secondary)' }}>City / Location</label>
                                            <input type="text" name="location" defaultValue={userData.location} className="px-3 py-2 rounded-lg text-[13px] outline-none border border-transparent focus:border-[#A855F7] transition-colors" style={{ background: 'var(--theme-input-bg)', color: 'var(--theme-text-primary)' }} />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[11px] font-medium" style={{ color: 'var(--theme-text-secondary)' }}>Country</label>
                                            <input type="text" name="country" defaultValue={userData.country} className="px-3 py-2 rounded-lg text-[13px] outline-none border border-transparent focus:border-[#A855F7] transition-colors" style={{ background: 'var(--theme-input-bg)', color: 'var(--theme-text-primary)' }} />
                                        </div>
                                        <div className="col-span-1 sm:col-span-2 flex flex-col gap-1.5">
                                            <label className="text-[11px] font-medium" style={{ color: 'var(--theme-text-secondary)' }}>Bio</label>
                                            <textarea rows={4} name="bio" defaultValue={userData.bio} className="px-3 py-2 rounded-lg text-[13px] outline-none resize-none border border-transparent focus:border-[#A855F7] transition-colors" style={{ background: 'var(--theme-input-bg)', color: 'var(--theme-text-primary)' }} />
                                        </div>
                                    </div>
                                </div>

                                {/* Company Info */}
                                <div className="pt-6" style={{ borderTop: '1px solid var(--theme-border-light)' }}>
                                    <h3 className="text-[13px] font-bold text-[#A855F7] mb-4 uppercase tracking-wider h-[20px] flex items-center gap-2">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                                        Company Information
                                    </h3>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[11px] font-medium" style={{ color: 'var(--theme-text-secondary)' }}>Company Name</label>
                                            <input type="text" name="companyName" defaultValue={userData.companyName} className="px-3 py-2 rounded-lg text-[13px] outline-none border border-transparent focus:border-[#A855F7] transition-colors" style={{ background: 'var(--theme-input-bg)', color: 'var(--theme-text-primary)' }} />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[11px] font-medium" style={{ color: 'var(--theme-text-secondary)' }}>Industry</label>
                                            <input type="text" name="industry" defaultValue={userData.companyInfo.industry} className="px-3 py-2 rounded-lg text-[13px] outline-none border border-transparent focus:border-[#A855F7] transition-colors" style={{ background: 'var(--theme-input-bg)', color: 'var(--theme-text-primary)' }} />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[11px] font-medium" style={{ color: 'var(--theme-text-secondary)' }}>Company Website</label>
                                            <input type="url" name="companyWebsite" defaultValue={userData.companyInfo.website} className="px-3 py-2 rounded-lg text-[13px] outline-none border border-transparent focus:border-[#A855F7] transition-colors" style={{ background: 'var(--theme-input-bg)', color: 'var(--theme-text-primary)' }} />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-[11px] font-medium" style={{ color: 'var(--theme-text-secondary)' }}>Company Size</label>
                                            <select name="companySize" defaultValue={userData.companyInfo.size} className="px-3 py-2 rounded-lg text-[13px] outline-none border border-transparent focus:border-[#A855F7] transition-colors appearance-none" style={{ background: 'var(--theme-input-bg)', color: 'var(--theme-text-primary)' }}>
                                                <option value="1-10 employees">1-10 employees</option>
                                                <option value="11-50 employees">11-50 employees</option>
                                                <option value="51-200 employees">51-200 employees</option>
                                                <option value="500-2,000 employees">500-2,000 employees</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 flex items-center justify-end gap-3" style={{ borderTop: '1px solid var(--theme-border-light)', background: 'var(--theme-bg)' }}>
                            <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 rounded-lg text-[12px] font-bold text-white bg-transparent border cursor-pointer hover:bg-white/5 transition-colors" style={{ borderColor: 'var(--theme-border)' }}>
                                Cancel
                            </button>
                            <button type="submit" className="px-6 py-2 rounded-lg text-[12px] font-bold text-white border-none cursor-pointer transition-all hover:scale-105" style={{ background: `linear-gradient(135deg, ${accent}, #7C3AED)`, boxShadow: `0 0 15px ${accent}40` }}>
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div >
    );
}
