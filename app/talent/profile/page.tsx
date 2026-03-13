"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
    Sparkles, CheckCircle, Github, Linkedin, Briefcase, FileText,
    Loader2, Link as LinkIcon, Phone, Mail, Heart, MessageSquare,
    Eye, Share2, Zap, ExternalLink, Star, Camera, Upload, Trash, X
} from "lucide-react";
import { compressImageClient } from "@/lib/client-compress";

const accent = "#3CF91A";

export default function TalentProfilePage() {
    const [userData, setUserData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [githubData, setGithubData] = useState<any>(null);
    const [isLoadingGithub, setIsLoadingGithub] = useState(false);
    const [activeTab, setActiveTab] = useState("Spills");
    const tabs = ["Spills", "Experience", "Projects", "GitHub", "Skills"];
    
    const [showAvatarMenu, setShowAvatarMenu] = useState(false);
    const [avatarUploading, setAvatarUploading] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [toastMessage, setToastMessage] = useState<{ type: "success" | "error", text: string } | null>(null);

    const showToast = (type: "success" | "error", text: string) => {
        setToastMessage({ type, text });
        setTimeout(() => setToastMessage(null), 4000);
    };

    useEffect(() => {
        fetch("/api/user/profile")
            .then(r => r.json())
            .then(d => {
                if (d.user) setUserData(d.user);
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        if (userData?.talentProfile?.githubConnected) {
            setIsLoadingGithub(true);
            fetch("/api/user/github").then(r => r.json()).then(d => {
                if (!d.error) setGithubData(d);
                setIsLoadingGithub(false);
            }).catch(() => setIsLoadingGithub(false));
        }
    }, [userData]);

    /* Avatar Handlers */
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setAvatarUploading(true);
            const processedFile = await compressImageClient(file);
            const fd = new FormData();
            fd.append("file", processedFile);
            fd.append("category", "avatars");
            fd.append("folder", "avatars");
            
            const res = await fetch("/api/upload", { method: "POST", body: fd });
            const data = await res.json();
            
            if (res.ok && data.url) {
                // Save URL in DB
                await fetch("/api/user/profile", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ avatarUrl: data.url })
                });
                setUserData((prev: any) => ({ ...prev, avatarUrl: data.url }));
                showToast("success", "Profile picture updated!");
            } else {
                showToast("error", data.error || "Upload failed");
            }
        } catch (error) {
            console.error("Avatar upload failed:", error);
            showToast("error", "Upload failed. Check console for details.");
        } finally {
            setAvatarUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleRemoveAvatar = async () => {
        if (!userData?.avatarUrl) return;
        setAvatarUploading(true);
        try {
            await fetch("/api/user/profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ avatarUrl: "" })
            });
            setUserData((prev: any) => ({ ...prev, avatarUrl: "" }));
            showToast("success", "Profile picture removed!");
        } catch (err) {
            console.error("Failed to remove avatar", err);
            showToast("error", "Failed to remove avatar");
        } finally {
            setAvatarUploading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-full p-20">
                <Loader2 className="w-10 h-10 animate-spin mb-4" style={{ color: accent }} />
                <p className="text-[13px] text-[var(--theme-text-muted)] font-medium">Loading your profile...</p>
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-full p-20">
                <h3 className="text-lg font-bold text-red-400 mb-2">Profile Not Found</h3>
                <p className="text-[13px] text-[var(--theme-text-muted)]">Could not load your profile data.</p>
            </div>
        );
    }

    const { fullName, username, email, spills, avatarUrl } = userData;
    const {
        bio, experienceLevel, isAvailable, skills, projectLinks, workExperience,
        githubUsername, githubConnected, githubRepos, githubStars,
        linkedinUrl, portfolioUrl, resumeUrl,
        contactEmail, contactPhone, showEmail, showPhone, showSocials,
    } = userData.talentProfile || {};

    const initials = fullName
        ? fullName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
        : "??";

    const currentJob = workExperience?.find((w: any) => w.isCurrent);
    const displayRole = currentJob
        ? `${currentJob.role} at ${currentJob.companyName}`
        : experienceLevel
            ? `${experienceLevel.charAt(0) + experienceLevel.slice(1).toLowerCase()} Developer`
            : "Developer";

    const fmtDate = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", year: "numeric" });

    return (
        <div style={{ background: "var(--theme-bg)" }} className="min-h-full">
            {toastMessage && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-5 fade-in duration-300">
                    <div className={`px-4 py-3 rounded-xl shadow-2xl border flex items-center gap-3 ${
                        toastMessage.type === "success" 
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500" 
                            : "bg-red-500/10 border-red-500/30 text-red-500"
                    }`} style={{ backdropFilter: "blur(12px)" }}>
                        {toastMessage.type === "success" ? <CheckCircle className="w-5 h-5" /> : <X className="w-5 h-5" />}
                        <p className="text-sm font-semibold">{toastMessage.text}</p>
                    </div>
                </div>
            )}

            {/* ── COVER BANNER ── */}
            <div className="relative">
                <div className="h-32 sm:h-44 lg:h-52 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10"
                        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fff' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
                    />
                    <div className="absolute right-4 sm:right-8 top-4 sm:top-6 text-white/20 font-mono text-[10px] sm:text-xs hidden sm:block text-right">
                        <p>{"// talent.profile"}</p>
                        <p>{`const username = "${username}";`}</p>
                        <p>{`const isAvailable = ${isAvailable ?? true};`}</p>
                    </div>
                </div>

                {/* Avatar */}
                <div className="max-w-[900px] mx-auto px-4 sm:px-6">
                    <div className="relative -mt-12 sm:-mt-16 flex items-end gap-4">
                        {/* Interactive Avatar Container */}
                        <div className="relative group shrink-0">
                            <div 
                                onClick={() => setShowAvatarMenu(prev => !prev)}
                                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-black text-2xl sm:text-3xl font-bold border-4 border-[var(--theme-bg)] shadow-xl cursor-pointer overflow-hidden relative">
                                {avatarUrl ? (
                                    <img src={avatarUrl} alt={fullName} className="w-full h-full object-cover" />
                                ) : (
                                    initials
                                )}
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-white opacity-80" />
                                </div>
                                {avatarUploading && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                        <Loader2 className="w-6 h-6 animate-spin text-white" />
                                    </div>
                                )}
                            </div>
                            
                            {/* Dropdown Menu */}
                            {showAvatarMenu && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setShowAvatarMenu(false)} />
                                    <div className="absolute top-full left-0 translate-x-0 sm:left-1/2 sm:-translate-x-1/2 mt-2 w-48 rounded-xl shadow-xl border border-[var(--theme-border)] bg-[var(--theme-card)] z-50 overflow-hidden text-sm animate-in fade-in zoom-in duration-200" onClick={(e) => e.stopPropagation()}>
                                        <div className="p-1 flex flex-col">
                                            <button onClick={() => { setShowAvatarMenu(false); fileInputRef.current?.click(); }}
                                                className="w-full text-left px-4 py-2 hover:bg-[var(--theme-bg-secondary)] text-[var(--theme-text-primary)] rounded-lg transition-colors flex items-center gap-2 border-none bg-transparent cursor-pointer">
                                                <Upload className="w-4 h-4" /> Upload Photo
                                            </button>
                                            {(avatarUrl && avatarUrl !== "") && (
                                                <button onClick={() => { setShowAvatarMenu(false); handleRemoveAvatar(); }}
                                                    className="w-full text-left px-4 py-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors flex items-center gap-2 border-none bg-transparent cursor-pointer mt-1">
                                                    <Trash className="w-4 h-4" /> Remove Photo
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} />

                        <div className="pb-1 sm:pb-2 min-w-0 hidden sm:block">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-xl sm:text-2xl font-bold text-[var(--theme-text-primary)]">{fullName}</h1>
                                <span className="text-[12px] font-medium text-[var(--theme-text-muted)]">@{username}</span>
                                {isAvailable !== false && (
                                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 uppercase tracking-widest border border-green-500/20">
                                        Open to Work
                                    </span>
                                )}
                            </div>
                            <p className="text-[13px] text-[var(--theme-text-muted)] mt-0.5">{displayRole}</p>
                            <p className="text-[11px] font-medium flex items-center gap-1 mt-1" style={{ color: accent }}>
                                <Sparkles className="w-3 h-3" /> Talent Profile
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile name */}
            <div className="sm:hidden px-4 mt-3">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h1 className="text-lg font-bold text-[var(--theme-text-primary)]">{fullName}</h1>
                    <span className="text-[11px] font-medium text-[var(--theme-text-muted)]">@{username}</span>
                </div>
                <p className="text-[12px] text-[var(--theme-text-muted)]">{displayRole}</p>
                {isAvailable !== false && (
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 uppercase tracking-widest border border-green-500/20 inline-block mt-1">
                        Open to Work
                    </span>
                )}
            </div>

            {/* ── MAIN CONTENT ── */}
            <div className="max-w-[900px] mx-auto px-4 sm:px-6 pb-24 lg:pb-8">

                {/* Bio & Social Links */}
                <div className="mt-4 sm:mt-6">
                    {bio ? (
                        <p className="text-[13px] sm:text-[14px] text-[var(--theme-text-primary)] leading-relaxed whitespace-pre-wrap max-w-3xl">
                            {bio}
                        </p>
                    ) : (
                        <p className="text-[13px] text-[var(--theme-text-muted)] italic">
                            No bio added yet. Go to Settings → Privacy to add one.
                        </p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 mt-4 text-[12px] font-medium">
                        {currentJob && (
                            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-card)]" style={{ color: accent }}>
                                <Briefcase className="w-3.5 h-3.5" />
                                {currentJob.role} at {currentJob.companyName}
                            </span>
                        )}
                        {experienceLevel && (
                            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-card)] text-[var(--theme-text-secondary)]">
                                <Zap className="w-3.5 h-3.5 text-yellow-500" />
                                {experienceLevel.charAt(0) + experienceLevel.slice(1).toLowerCase()} Level
                            </span>
                        )}
                        {showEmail && contactEmail && (
                            <a href={`mailto:${contactEmail}`} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:opacity-80 transition-colors bg-[var(--theme-card)] border border-[var(--theme-border)] no-underline text-[var(--theme-text-secondary)]">
                                <Mail className="w-3.5 h-3.5" /> <span className="hidden sm:inline">{contactEmail}</span>
                            </a>
                        )}
                        {showPhone && contactPhone && (
                            <a href={`tel:${contactPhone}`} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:opacity-80 transition-colors bg-[var(--theme-card)] border border-[var(--theme-border)] no-underline text-[var(--theme-text-secondary)]">
                                <Phone className="w-3.5 h-3.5" /> <span className="hidden sm:inline">{contactPhone}</span>
                            </a>
                        )}
                        {showSocials && githubUsername && (
                            <a href={`https://github.com/${githubUsername}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:opacity-80 transition-colors bg-[var(--theme-card)] border border-[var(--theme-border)] no-underline text-[var(--theme-text-secondary)]">
                                <Github className="w-3.5 h-3.5" /> <span className="hidden sm:inline">@{githubUsername}</span>
                            </a>
                        )}
                        {showSocials && linkedinUrl && (
                            <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:opacity-80 transition-colors bg-[var(--theme-card)] border border-[var(--theme-border)] no-underline text-[var(--theme-text-secondary)]">
                                <Linkedin className="w-3.5 h-3.5 text-blue-500" /> <span className="hidden sm:inline">LinkedIn</span>
                            </a>
                        )}
                        {showSocials && portfolioUrl && (
                            <a href={portfolioUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:opacity-80 transition-colors bg-[var(--theme-card)] border border-[var(--theme-border)] no-underline text-[var(--theme-text-secondary)]">
                                <ExternalLink className="w-3.5 h-3.5 text-purple-500" /> <span className="hidden sm:inline">Portfolio</span>
                            </a>
                        )}
                    </div>
                </div>

                {/* Stats / Actions row */}
                <div className="flex items-center gap-3 sm:gap-6 mt-4 sm:mt-5 pb-4 border-b border-[var(--theme-border)]">
                    <div className="text-center">
                        <p className="text-sm sm:text-lg font-bold text-[var(--theme-text-primary)]">{skills?.length || 0}</p>
                        <p className="text-[9px] sm:text-[10px] text-[var(--theme-text-muted)] uppercase tracking-wider">Skills</p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm sm:text-lg font-bold text-[var(--theme-text-primary)]">{workExperience?.length || 0}</p>
                        <p className="text-[9px] sm:text-[10px] text-[var(--theme-text-muted)] uppercase tracking-wider">Jobs</p>
                    </div>
                    {githubConnected && (
                        <div className="text-center">
                            <p className="text-sm sm:text-lg font-bold text-[var(--theme-text-primary)]">{githubRepos || 0}</p>
                            <p className="text-[9px] sm:text-[10px] text-[var(--theme-text-muted)] uppercase tracking-wider">Repos</p>
                        </div>
                    )}
                    <div className="text-center">
                        <p className="text-sm sm:text-lg font-bold text-[var(--theme-text-primary)]">{spills?.length || 0}</p>
                        <p className="text-[9px] sm:text-[10px] text-[var(--theme-text-muted)] uppercase tracking-wider">Spills</p>
                    </div>
                    <div className="ml-auto flex gap-2">
                        <Link href="/talent/settings"
                            className="px-4 sm:px-5 py-2 rounded-xl text-[11px] sm:text-[12px] font-bold text-black border-none cursor-pointer transition-all hover:scale-105 no-underline"
                            style={{ background: accent, boxShadow: `0 0 15px ${accent}40` }}>
                            Edit Profile
                        </Link>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-0 mt-0 border-b border-[var(--theme-border)] overflow-x-auto scrollbar-none">
                    {tabs.map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)}
                            className={`px-4 sm:px-6 py-3 text-[12px] sm:text-[13px] font-semibold border-b-2 transition-all cursor-pointer bg-transparent whitespace-nowrap
                                ${activeTab === tab ? "border-[#3CF91A] text-[#3CF91A]" : "border-transparent text-[var(--theme-text-muted)] hover:text-[var(--theme-text-tertiary)]"}`}>
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="mt-5 space-y-5">



                    {/* ── EXPERIENCE TAB ── */}
                    {activeTab === "Experience" && (
                        <div className="space-y-3">
                            {workExperience && workExperience.length > 0 ? (
                                <>
                                    {workExperience.map((exp: any) => (
                                        <div key={exp.id}
                                            className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] p-4 sm:p-5 flex gap-4 hover:border-[#3CF91A]/30 transition-all"
                                            onMouseEnter={e => (e.currentTarget.style.borderColor = `${accent}40`)}
                                            onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--theme-border)")}>
                                            <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-[#3CF91A] to-[#10B981] flex items-center justify-center text-[13px] font-bold" style={{ color: "#000" }}>
                                                {exp.companyName[0].toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start gap-2 justify-between flex-wrap">
                                                    <div>
                                                        <p className="text-[13px] font-bold text-[var(--theme-text-primary)]">{exp.role}</p>
                                                        <p className="text-[12px] font-medium" style={{ color: accent }}>{exp.companyName}</p>
                                                        <p className="text-[10px] mt-0.5 text-[var(--theme-text-muted)]">
                                                            {fmtDate(exp.startDate)} – {exp.isCurrent ? "Present" : exp.endDate ? fmtDate(exp.endDate) : ""}
                                                        </p>
                                                    </div>
                                                    {exp.isCurrent && (
                                                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0"
                                                            style={{ background: `${accent}15`, color: accent, border: `1px solid ${accent}30` }}>
                                                            Current
                                                        </span>
                                                    )}
                                                </div>
                                                {exp.description && (
                                                    <p className="text-[12px] text-[var(--theme-text-muted)] mt-2 leading-relaxed">{exp.description}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    <div className="pt-2">
                                        <Link href="/talent/settings"
                                            className="inline-flex items-center gap-1.5 text-[11px] font-medium no-underline transition-all hover:opacity-80"
                                            style={{ color: accent }}
                                            onClick={() => { /* will navigate to settings, user must switch to Experience tab */ }}>
                                            <span>+ Add or edit experience in Settings</span>
                                        </Link>
                                    </div>
                                </>
                            ) : (
                                <div className="rounded-2xl border border-dashed border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm p-8 text-center flex flex-col items-center">
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3" style={{ background: `${accent}10` }}>
                                        <Briefcase className="w-5 h-5" style={{ color: accent }} />
                                    </div>
                                    <h3 className="text-[14px] font-bold text-[var(--theme-text-primary)] mb-1">No Work Experience Yet</h3>
                                    <p className="text-[12px] text-[var(--theme-text-muted)] mb-3">Add your current and past roles — they'll appear here and on your public profile.</p>
                                    <Link href="/talent/settings"
                                        className="px-4 py-2 rounded-xl text-[12px] font-bold text-black no-underline transition-all hover:scale-105"
                                        style={{ background: accent }}>
                                        Add Experience in Settings
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── SKILLS TAB ── */}
                    {activeTab === "Skills" && (
                        <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm p-4 sm:p-5">
                            <h2 className="text-[14px] font-bold text-[var(--theme-text-primary)] mb-4 flex items-center gap-2">
                                <Zap className="w-4 h-4 text-[#3CF91A]" /> Professional Skills
                            </h2>
                            {skills && skills.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {skills.map((skill: any) => (
                                        <span key={skill.skillName}
                                            className="px-3 py-1.5 rounded-lg text-[11px] sm:text-[12px] font-medium bg-[var(--theme-input-bg)] text-[var(--theme-text-secondary)] border border-[var(--theme-border-light)] shadow-sm flex items-center gap-1.5 hover:border-[#3CF91A]/30 transition-colors">
                                            {skill.isVerified && <CheckCircle className="w-3 h-3 text-[#3CF91A]" />}
                                            {skill.skillName}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <p className="text-[12px] text-[var(--theme-text-muted)] mb-2">No skills added yet.</p>
                                    <Link href="/talent/settings" className="text-[11px] no-underline font-medium" style={{ color: accent }}>
                                        Add skills in Settings
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── PROJECTS TAB ── */}
                    {activeTab === "Projects" && (
                        <div className="space-y-4">
                            {projectLinks && projectLinks.length > 0 ? (
                                projectLinks.map((project: any, i: number) => (
                                    <div key={i}
                                        className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm p-4 sm:p-5 transition-all"
                                        onMouseEnter={e => (e.currentTarget.style.borderColor = `${accent}40`)}
                                        onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--theme-border)")}>
                                        <h3 className="text-[14px] font-bold text-[var(--theme-text-primary)] mb-1">{project.title || "Project Link"}</h3>
                                        {project.description && (
                                            <p className="text-[12px] text-[var(--theme-text-secondary)] mb-3 leading-relaxed">{project.description}</p>
                                        )}
                                        <a href={project.url} target="_blank" rel="noopener noreferrer"
                                            className="text-[11px] font-medium flex items-center gap-1 no-underline hover:underline"
                                            style={{ color: accent }}>
                                            <LinkIcon className="w-3 h-3" /> View Project
                                        </a>
                                    </div>
                                ))
                            ) : (
                                <div className="rounded-2xl border border-dashed border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm p-8 text-center flex flex-col items-center">
                                    <div className="w-12 h-12 rounded-full bg-[var(--theme-bg-secondary)] flex items-center justify-center mb-3">
                                        <Briefcase className="w-5 h-5 text-[var(--theme-text-muted)]" />
                                    </div>
                                    <h3 className="text-[14px] font-bold text-[var(--theme-text-primary)] mb-1">No Projects Yet</h3>
                                    <p className="text-[12px] text-[var(--theme-text-muted)]">Add spotlight projects from your profile settings.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── GITHUB TAB ── */}
                    {activeTab === "GitHub" && (
                        <div className="space-y-4">
                            {isLoadingGithub ? (
                                <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-[#3CF91A]" /></div>
                            ) : githubData ? (
                                <>
                                    {/* ── GitHub Profile Card ── */}
                                    {githubData.githubProfile && (
                                        <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm p-4 sm:p-5">
                                            <div className="flex items-start gap-4">
                                                <img
                                                    src={githubData.githubProfile.avatarUrl}
                                                    alt="GitHub Avatar"
                                                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 shrink-0"
                                                    style={{ borderColor: `${accent}40` }}
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                                        <h2 className="text-[15px] font-bold text-[var(--theme-text-primary)]">@{githubData.githubUsername}</h2>
                                                        <a href={githubData.githubProfile.htmlUrl} target="_blank" rel="noopener noreferrer"
                                                            className="flex items-center gap-1 text-[10px] font-medium no-underline px-2 py-0.5 rounded-full transition-all hover:opacity-80"
                                                            style={{ background: `${accent}15`, color: accent }}>
                                                            <ExternalLink className="w-3 h-3" /> View on GitHub
                                                        </a>
                                                    </div>
                                                    {githubData.githubProfile.bio && (
                                                        <p className="text-[12px] text-[var(--theme-text-muted)] mb-2 line-clamp-2">{githubData.githubProfile.bio}</p>
                                                    )}
                                                    <div className="flex items-center gap-4 text-[11px] text-[var(--theme-text-secondary)]">
                                                        <span><strong style={{ color: 'var(--theme-text-primary)' }}>{githubData.githubProfile.followers}</strong> followers</span>
                                                        <span><strong style={{ color: 'var(--theme-text-primary)' }}>{githubData.githubProfile.following}</strong> following</span>
                                                        <span><strong style={{ color: 'var(--theme-text-primary)' }}>{githubData.totalRepos}</strong> repos</span>
                                                        <span><strong style={{ color: accent }}>{githubData.totalStars}</strong> <Star className="w-3 h-3 inline" /></span>
                                                    </div>
                                                    <p className="text-[10px] text-[var(--theme-text-muted)] mt-1.5">
                                                        Member since {new Date(githubData.githubProfile.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* ── Top Languages ── */}
                                    <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm p-4 sm:p-5">
                                        <h2 className="text-[14px] font-bold text-[var(--theme-text-primary)] mb-4 flex items-center gap-2">
                                            <Github className="w-4 h-4 text-[#3CF91A]" /> Top Languages
                                        </h2>
                                        {Object.keys(githubData.languageStats).length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {Object.entries(githubData.languageStats)
                                                    .sort(([, a], [, b]) => (b as number) - (a as number))
                                                    .map(([lang, count]) => (
                                                        <span key={lang} className="px-3 py-1.5 rounded-lg text-[11px] sm:text-[12px] font-medium bg-[var(--theme-input-bg)] text-[var(--theme-text-secondary)] border border-[var(--theme-border-light)] flex items-center gap-1.5">
                                                            <span className="w-2 h-2 rounded-full bg-[#3CF91A]"></span>
                                                            {lang} <span className="text-[#3CF91A] font-bold">{count as number}</span>
                                                        </span>
                                                    ))}
                                            </div>
                                        ) : (
                                            <p className="text-[12px] text-[var(--theme-text-muted)]">No language data available.</p>
                                        )}
                                    </div>

                                    {/* ── Repositories ── */}
                                    <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm p-4 sm:p-5">
                                        <h2 className="text-[14px] font-bold text-[var(--theme-text-primary)] mb-4 flex items-center gap-2">
                                            <Github className="w-4 h-4 text-[#3CF91A]" /> Repositories {githubData.sharePrivateRepos && <span className="text-[10px] bg-[#3CF91A]/10 text-[#3CF91A] px-2 py-0.5 rounded-full ml-2">Includes Private</span>}
                                        </h2>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {githubData.repos.map((repo: any) => (
                                                <a key={repo.id} href={repo.html_url} target="_blank" rel="noopener noreferrer" className="p-4 rounded-xl border border-[var(--theme-border-light)] bg-[var(--theme-bg-secondary)] hover:border-[#3CF91A]/40 transition-all no-underline block flex flex-col break-inside-avoid">
                                                    <h3 className="text-[13px] font-bold text-[var(--theme-text-primary)] mb-1 flex items-center justify-between">
                                                        <span className="truncate pr-2">{repo.name}</span>
                                                        {repo.private && <span className="text-[9px] bg-red-500/10 text-red-500 px-2 py-0.5 rounded-full border border-red-500/20 shrink-0">Private</span>}
                                                    </h3>
                                                    <p className="text-[11px] text-[var(--theme-text-muted)] mb-3 line-clamp-2 flex-grow">{repo.description || "No description"}</p>
                                                    <div className="flex items-center gap-3 text-[10px] text-[var(--theme-text-secondary)] mt-auto pt-2 border-t border-[var(--theme-border-light)]">
                                                        {repo.language && <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#3CF91A]"></span>{repo.language}</span>}
                                                        <span className="flex items-center gap-1"><Star className="w-3 h-3 text-[var(--theme-text-muted)]" /> {repo.stargazers_count}</span>
                                                        {repo.forks_count > 0 && <span className="flex items-center gap-1">🔱 {repo.forks_count}</span>}
                                                        <span className="flex items-center gap-1 ml-auto text-[var(--theme-text-muted)]">{new Date(repo.updated_at).toLocaleDateString()}</span>
                                                    </div>
                                                </a>
                                            ))}
                                        </div>
                                    </div>

                                    {/* ── Recent Activity ── */}
                                    {githubData.recentActivity && githubData.recentActivity.length > 0 && (
                                        <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm p-4 sm:p-5">
                                            <h2 className="text-[14px] font-bold text-[var(--theme-text-primary)] mb-4 flex items-center gap-2">
                                                <Zap className="w-4 h-4 text-[#3CF91A]" /> Recent Activity
                                            </h2>
                                            <div className="space-y-2 max-h-[300px] overflow-y-auto">
                                                {githubData.recentActivity.slice(0, 15).map((event: any, i: number) => {
                                                    const typeMap: Record<string, string> = {
                                                        PushEvent: "Pushed to",
                                                        CreateEvent: "Created",
                                                        PullRequestEvent: "PR on",
                                                        IssuesEvent: "Issue on",
                                                        WatchEvent: "Starred",
                                                        ForkEvent: "Forked",
                                                        DeleteEvent: "Deleted in",
                                                        IssueCommentEvent: "Commented on",
                                                        PullRequestReviewEvent: "Reviewed PR on",
                                                    };
                                                    const label = typeMap[event.type] || event.type.replace("Event", "");
                                                    return (
                                                        <div key={i} className="flex items-center gap-3 py-2 border-b border-[var(--theme-border-light)] last:border-b-0">
                                                            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: accent }}></div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-[12px] text-[var(--theme-text-secondary)] truncate">
                                                                    <span className="font-semibold text-[var(--theme-text-primary)]">{label}</span>{" "}
                                                                    <span className="font-mono text-[11px]" style={{ color: accent }}>{event.repo}</span>
                                                                </p>
                                                            </div>
                                                            <span className="text-[10px] text-[var(--theme-text-muted)] shrink-0">
                                                                {new Date(event.createdAt).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* ── ACHIEVEMENTS (Gamification) ── */}
                                    <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm p-4 sm:p-5">
                                        <h2 className="text-[14px] font-bold text-[var(--theme-text-primary)] mb-4 flex items-center gap-2">
                                            <Sparkles className="w-4 h-4 text-[#3CF91A]" /> GitHub Achievements
                                        </h2>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            {/* Badge 1: Connected */}
                                            <div className="flex flex-col items-center justify-center p-3 rounded-xl border border-[#3CF91A]/30 bg-[#3CF91A]/5 text-center">
                                                <div className="w-10 h-10 rounded-full bg-[#3CF91A]/20 text-[#3CF91A] flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(60,249,26,0.3)]">
                                                    <Github className="w-5 h-5" />
                                                </div>
                                                <span className="text-[11px] font-bold text-[var(--theme-text-primary)]">Verified Hacker</span>
                                                <span className="text-[9px] text-[var(--theme-text-muted)] mt-0.5">Linked GitHub</span>
                                            </div>

                                            {/* Badge 2: Polyglot */}
                                            <div className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${Object.keys(githubData.languageStats).length >= 3 ? 'border-purple-500/30 bg-purple-500/5' : 'border-[var(--theme-border)] bg-[var(--theme-bg-secondary)] opacity-50 grayscale'}`}>
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${Object.keys(githubData.languageStats).length >= 3 ? 'bg-purple-500/20 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)]' : 'bg-[var(--theme-input-bg)] text-[var(--theme-text-muted)]'}`}>
                                                    <FileText className="w-5 h-5" />
                                                </div>
                                                <span className="text-[11px] font-bold text-[var(--theme-text-primary)]">Polyglot</span>
                                                <span className="text-[9px] text-[var(--theme-text-muted)] mt-0.5">3+ Languages</span>
                                            </div>

                                            {/* Badge 3: Stargazer */}
                                            <div className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${(githubData.totalStars || 0) >= 10 ? 'border-yellow-500/30 bg-yellow-500/5' : 'border-[var(--theme-border)] bg-[var(--theme-bg-secondary)] opacity-50 grayscale'}`}>
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${(githubData.totalStars || 0) >= 10 ? 'bg-yellow-500/20 text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)]' : 'bg-[var(--theme-input-bg)] text-[var(--theme-text-muted)]'}`}>
                                                    <Star className="w-5 h-5" />
                                                </div>
                                                <span className="text-[11px] font-bold text-[var(--theme-text-primary)]">Stargazer</span>
                                                <span className="text-[9px] text-[var(--theme-text-muted)] mt-0.5">10+ Total Stars</span>
                                            </div>

                                            {/* Badge 4: Deep Contributor */}
                                            <div className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${(githubData.totalRepos || 0) >= 10 ? 'border-blue-500/30 bg-blue-500/5' : 'border-[var(--theme-border)] bg-[var(--theme-bg-secondary)] opacity-50 grayscale'}`}>
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${(githubData.totalRepos || 0) >= 10 ? 'bg-blue-500/20 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'bg-[var(--theme-input-bg)] text-[var(--theme-text-muted)]'}`}>
                                                    <Briefcase className="w-5 h-5" />
                                                </div>
                                                <span className="text-[11px] font-bold text-[var(--theme-text-primary)]">Archivist</span>
                                                <span className="text-[9px] text-[var(--theme-text-muted)] mt-0.5">10+ Repositories</span>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="rounded-2xl border border-dashed border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm p-8 text-center flex flex-col items-center">
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3" style={{ background: `${accent}10` }}>
                                        <Github className="w-5 h-5" style={{ color: accent }} />
                                    </div>
                                    <h3 className="text-[14px] font-bold text-[var(--theme-text-primary)] mb-1">No GitHub Data</h3>
                                    <p className="text-[12px] text-[var(--theme-text-muted)] mb-3">Connect your account in settings to display your source code activities.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── SPILLS TAB ── */}
                    {activeTab === "Spills" && (
                        <div className="space-y-4">
                            {spills && spills.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {spills.map((spill: any) => (
                                        <div key={spill.id}
                                            className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm overflow-hidden flex flex-col transition-all"
                                            onMouseEnter={e => (e.currentTarget.style.borderColor = `${accent}40`)}
                                            onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--theme-border)")}>
                                            <div className="p-4 sm:p-5 flex-1">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-black text-[9px] font-bold shrink-0 overflow-hidden">
                                                        {avatarUrl ? (
                                                            <img src={avatarUrl} alt={fullName} className="w-full h-full object-cover" />
                                                        ) : (
                                                            initials
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-[12px] font-bold text-[var(--theme-text-primary)]">@{username}</p>
                                                        <p className="text-[9px] text-[var(--theme-text-muted)]">{new Date(spill.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <p className="text-[12px] text-[var(--theme-text-secondary)] leading-relaxed mb-3 line-clamp-4">{spill.content}</p>
                                                {spill.code && (
                                                    <div className="rounded-xl bg-[#0D1117] border border-[var(--theme-code-border)] overflow-hidden mb-3">
                                                        <pre className="px-3 py-3 text-[10px] text-green-400 font-mono overflow-hidden h-20 relative" style={{ margin: 0 }}>
                                                            <code>{spill.code}</code>
                                                            <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#0D1117] to-transparent pointer-events-none" />
                                                        </pre>
                                                    </div>
                                                )}
                                                {spill.tags && (
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {spill.tags.split(",").slice(0, 3).map((tag: string) => (
                                                            <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full font-medium"
                                                                style={{ background: `${accent}15`, color: accent }}>
                                                                #{tag.trim()}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="px-4 py-3 border-t border-[var(--theme-border-light)] flex flex-wrap items-center gap-4 text-[11px] text-[var(--theme-text-muted)]"
                                                style={{ background: "var(--theme-bg-secondary)" }}>
                                                <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" /> {spill.likes}</span>
                                                <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" /> {spill.comments}</span>
                                                <span className="flex items-center gap-1"><Share2 className="w-3.5 h-3.5" /> {spill.shares}</span>
                                                <span className="flex items-center gap-1 ml-auto"><Eye className="w-3.5 h-3.5" /> {spill.views}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm p-8 text-center flex flex-col items-center">
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3" style={{ background: `${accent}10` }}>
                                        <MessageSquare className="w-5 h-5" style={{ color: accent }} />
                                    </div>
                                    <h3 className="text-[14px] font-bold text-[var(--theme-text-primary)] mb-1">No Spills Yet</h3>
                                    <p className="text-[12px] text-[var(--theme-text-muted)] mb-3">Share your thoughts, code snippets, or insights with the community.</p>
                                    <Link href="/talent/spills"
                                        className="px-4 py-2 rounded-xl text-[12px] font-bold text-black no-underline transition-all hover:scale-105"
                                        style={{ background: accent }}>
                                        Create a Spill
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
