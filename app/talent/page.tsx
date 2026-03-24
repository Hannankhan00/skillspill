"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Copy, Check } from "lucide-react";

/* ═══════════════════════════════════════════════
   S K I L L S P I L L  —  T A L E N T  F E E D
   Social feed — like LinkedIn meets GitHub
   ═══════════════════════════════════════════════ */

/* —— Icons —— */
const HeartIcon = ({ filled }: { filled?: boolean }) => filled
    ? <svg width="18" height="18" viewBox="0 0 24 24" fill="#EF4444" stroke="#EF4444" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
    : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>;

const CommentIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>;
const ShareIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></svg>;
const BookmarkIcon = ({ filled }: { filled?: boolean }) => filled
    ? <svg width="18" height="18" viewBox="0 0 24 24" fill="#8B5CF6" stroke="#8B5CF6" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
    : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>;
const CodeIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>;
const ImageIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>;

/* —— Helper Functions —— */
function timeAgo(dateString: string) {
    const diff = Date.now() - new Date(dateString).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    const days = Math.floor(hrs / 24);
    return `${days}d`;
}

function getGrad(str: string) {
    const grads = [
        "from-violet-500 to-purple-600",
        "from-amber-400 to-orange-500",
        "from-cyan-400 to-blue-600",
        "from-[#3CF91A] to-teal-500",
        "from-pink-400 to-rose-500",
        "from-red-400 to-rose-600",
        "from-sky-400 to-indigo-500",
    ];
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    return grads[Math.abs(hash) % grads.length];
}
const suggestedUsers = [
    { name: "Alex_Kernel", role: "Kernel Dev", initials: "AK", grad: "from-red-400 to-rose-600" },
    { name: "Cloud_Nine", role: "DevOps Lead", initials: "C9", grad: "from-sky-400 to-indigo-500" },
    { name: "Bit_Wizard", role: "Security Eng", initials: "BW", grad: "from-amber-400 to-orange-500" },
];

const jobSuggestions = [
    { title: "Senior React Engineer", company: "CryptoVault", budget: "$8k", match: "94%" },
    { title: "Rust Systems Dev", company: "Nebula OS", budget: "$12k", match: "89%" },
    { title: "Full-Stack Lead", company: "SkillDAO", budget: "$10k", match: "87%" },
];

/* ═══════════════ MAIN FEED ═══════════════ */
export default function TalentFeed() {
    const [feedTab, setFeedTab] = useState("For You");
    const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
    const [savedPosts, setSavedPosts] = useState<Record<string, boolean>>({});
    const [copiedStatus, setCopiedStatus] = useState<Record<string, boolean>>({});
    
    // Real feed data
    const [posts, setPosts] = useState<any[]>([]);
    const [loadingPosts, setLoadingPosts] = useState(true);

    // Fetch live user data for the mini profile card
    const [userData, setUserData] = useState<any>(null);
    useEffect(() => {
        fetch("/api/user/profile")
            .then(res => res.json())
            .then(data => {
                if (data.user) {
                    setUserData(data.user);
                }
            })
            .catch(console.error);
    }, []);

    // Fetch the Feed Posts
    useEffect(() => {
        setLoadingPosts(true);
        let filter = "all";
        if (feedTab === "Following") filter = "following";
        if (feedTab === "Trending") filter = "trending";
        fetch(`/api/spill/posts?limit=20&filter=${filter}`)
            .then(res => res.json())
            .then(data => {
                if (data.posts) setPosts(data.posts);
                setLoadingPosts(false);
            })
            .catch(() => setLoadingPosts(false));
    }, [feedTab]);

    const toggleLike = async (id: string, currentlyLiked: boolean) => {
        setLikedPosts(p => ({ ...p, [id]: !currentlyLiked }));
        try { await fetch(`/api/spill/posts/${id}/like`, { method: "POST" }); } catch {}
    };
    const toggleSave = async (id: string, currentlySaved: boolean) => {
        setSavedPosts(p => ({ ...p, [id]: !currentlySaved }));
        try { await fetch(`/api/spill/posts/${id}/save`, { method: "POST" }); } catch {}
    };

    const handleCopyCode = (id: string, code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedStatus(p => ({ ...p, [id]: true }));
        setTimeout(() => {
            setCopiedStatus(p => ({ ...p, [id]: false }));
        }, 2000);
    };

    const tabs = ["For You", "Following", "Trending", "Code", "Jobs"];

    // Compute user data or fallbacks
    const username = userData?.username || "Guest";
    const fullName = userData?.fullName || "Hacker";
    const initials = fullName
        ? fullName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
        : "??";
    const spillsCount = userData?.spills?.length || 0;
    const currentJob = userData?.talentProfile?.workExperience?.find((w: any) => w.isCurrent);
    const roleLine = currentJob
        ? `${currentJob.role}`
        : userData?.talentProfile?.experienceLevel
            ? `${userData.talentProfile.experienceLevel.charAt(0) + userData.talentProfile.experienceLevel.slice(1).toLowerCase()} Developer`
            : "Developer";

    return (
        <div style={{ background: "var(--theme-bg)" }} className="min-h-full">
            <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-5">
                <div className="flex flex-col lg:flex-row gap-6">

                    {/* ════════ MAIN FEED ════════ */}
                    <div className="flex-1 min-w-0 space-y-4">



                        {/* —— Feed Tabs —— */}
                        <div className="flex items-center gap-1 px-1 overflow-x-auto">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setFeedTab(tab)}
                                    className={`px-4 py-2 rounded-xl text-[12px] font-semibold transition-all duration-200 border-none cursor-pointer whitespace-nowrap
                                        ${feedTab === tab
                                            ? "bg-[var(--theme-card)] text-[var(--theme-text-primary)] shadow-sm border border-[var(--theme-border)]"
                                            : "bg-transparent text-[var(--theme-text-muted)] hover:text-[var(--theme-text-tertiary)] hover:bg-[var(--theme-card)]/50"
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* —— Posts —— */}
                        {loadingPosts ? (
                            <div className="py-10 text-center text-[var(--theme-text-muted)] animate-pulse">Loading spill activity...</div>
                        ) : posts.map((post) => {
                            const isLiked = likedPosts[post.id] !== undefined ? likedPosts[post.id] : post.isLiked;
                            const isSaved = savedPosts[post.id] !== undefined ? savedPosts[post.id] : post.isSaved;
                            
                            const pFullName = post.user?.fullName || "User";
                            const pUsername = post.user?.username || pFullName.split(" ")[0] || "user";
                            const pInitials = pFullName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
                            const pRole = post.user?.role === "TALENT" ? "Developer" : post.user?.recruiterProfile?.companyName ? `Recruiter @ ${post.user.recruiterProfile.companyName}` : "Recruiter";
                            const pVerified = post.user?.talentProfile?.githubConnected;
                            const pTime = timeAgo(post.createdAt);
                            const pGrad = getGrad(pFullName);
                            const pTags = Array.isArray(post.hashtags) ? post.hashtags : [];

                            return (
                                <article key={post.id} className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                                    {/* Header */}
                                    <div className="flex items-center justify-between px-5 pt-4 pb-2">
                                        <div className="flex items-center gap-3">
                                            {post.user?.avatarUrl ? (
                                                <img src={post.user.avatarUrl} alt={pFullName} className="w-10 h-10 rounded-full object-cover shadow-md" />
                                            ) : (
                                                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${pGrad} flex items-center justify-center text-white text-[11px] font-bold shadow-md`}>
                                                    {pInitials}
                                                </div>
                                            )}
                                            <div>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-[13px] font-bold text-[var(--theme-text-primary)]">{pUsername}</span>
                                                    {pVerified && (
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="#8B5CF6"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#fff" strokeWidth="2" /></svg>
                                                    )}
                                                </div>
                                                <p className="text-[11px] text-[var(--theme-text-muted)]">
                                                    {pRole} &bull; <span style={{ fontFamily: "var(--font-jetbrains-mono)" }}>{pTime} ago</span>
                                                </p>
                                            </div>
                                        </div>
                                        <button className="text-[var(--theme-text-muted)] hover:text-[var(--theme-text-tertiary)] transition-colors bg-transparent border-none cursor-pointer p-1">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" /></svg>
                                        </button>
                                    </div>

                                    {/* Content (Caption) */}
                                    {post.caption && (
                                        <div className="px-5 py-3">
                                            <p className="text-[13px] text-[var(--theme-text-secondary)] leading-relaxed whitespace-pre-line">{post.caption}</p>
                                        </div>
                                    )}

                                    {/* Media */}
                                    {post.media && post.media.length > 0 && (
                                        <div className="px-5 mb-3">
                                            <div className={`grid gap-1 rounded-xl overflow-hidden ${post.media.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
                                                {post.media.map((m: any, i: number) => (
                                                    <img key={i} src={m.url} alt="Post media" className="w-full h-auto object-cover max-h-[400px] border border-[var(--theme-border-light)]" />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Video */}
                                    {post.videoUrl && (
                                        <div className="px-5 mb-3">
                                            <video controls className="w-full rounded-xl max-h-[500px] object-cover border border-[var(--theme-border-light)]" poster={post.thumbnailUrl || undefined} preload="metadata">
                                                <source src={post.videoUrl} />
                                            </video>
                                        </div>
                                    )}

                                    {/* Code Snippet */}
                                    {post.code && (
                                        <div className="mx-5 mb-3 rounded-xl overflow-hidden border border-[var(--theme-border)]">
                                            <div className="flex items-center justify-between px-3.5 py-2 bg-[var(--theme-bg-secondary)] border-b border-[var(--theme-border-light)]">
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                                                    <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                                                    <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[9px] text-[var(--theme-text-muted)] uppercase tracking-wider font-bold"
                                                        style={{ fontFamily: "var(--font-jetbrains-mono)" }}>{post.codeLang}</span>
                                                    <button 
                                                        onClick={() => handleCopyCode(post.id, post.code)}
                                                        className="flex items-center justify-center bg-transparent border-none cursor-pointer text-[var(--theme-text-muted)] hover:text-[#3CF91A] transition-colors"
                                                        title="Copy Code"
                                                    >
                                                        {copiedStatus[post.id] ? <Check size={14} className="text-[#3CF91A]" /> : <Copy size={14} />}
                                                    </button>
                                                </div>
                                            </div>
                                            <pre className="px-4 py-3 text-[11px] leading-relaxed overflow-x-auto bg-[#1E1E2E] text-[#3CF91A] m-0"
                                                style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>
                                                <code>{post.code}</code>
                                            </pre>
                                        </div>
                                    )}

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-1.5 px-5 pb-3">
                                        {pTags.map((tag: string) => (
                                            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--theme-bg-secondary)] border border-[var(--theme-border)] text-[var(--theme-text-muted)] font-medium cursor-pointer hover:border-[#3CF91A] hover:text-[#2edb13] hover:bg-[#3CF91A]/10 transition-all"
                                                style={{ fontFamily: "var(--font-jetbrains-mono)" }}>
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center justify-between px-5 py-3 border-t border-[var(--theme-border-light)]">
                                        <div className="flex items-center gap-5">
                                            <button onClick={() => toggleLike(post.id, isLiked)}
                                                className={`flex items-center gap-1.5 text-[12px] font-medium transition-all bg-transparent border-none cursor-pointer ${isLiked ? "text-red-500" : "text-[var(--theme-text-muted)] hover:text-red-500"}`}>
                                                <HeartIcon filled={isLiked} />
                                                <span>{post.likesCount + (isLiked && !post.liked ? 1 : 0)}</span>
                                            </button>
                                            <button className="flex items-center gap-1.5 text-[12px] font-medium text-[var(--theme-text-muted)] hover:text-blue-500 transition-all bg-transparent border-none cursor-pointer">
                                                <CommentIcon /> {post.commentsCount || 0}
                                            </button>
                                            <button className="flex items-center gap-1.5 text-[12px] font-medium text-[var(--theme-text-muted)] hover:text-[#3CF91A] transition-all bg-transparent border-none cursor-pointer">
                                                <ShareIcon /> {post.repostsCount || 0}
                                            </button>
                                        </div>
                                        <button onClick={() => toggleSave(post.id, isSaved)}
                                            className={`transition-all bg-transparent border-none cursor-pointer ${isSaved ? "text-[#A855F7]" : "text-[var(--theme-text-muted)] hover:text-[#A855F7]"}`}>
                                            <BookmarkIcon filled={isSaved} />
                                        </button>
                                    </div>
                                </article>
                            );
                        })}
                    </div>

                    {/* ════════ RIGHT SIDEBAR (hidden on mobile) ════════ */}
                    <div className="hidden lg:block w-[300px] shrink-0 space-y-5" style={{ position: "sticky", top: "1.25rem", alignSelf: "flex-start" }}>

                        {/* —— Profile Card Mini —— */}
                        <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm overflow-hidden">
                            <div className="h-16 bg-gradient-to-r from-[#3CF91A] to-cyan-500" />
                            <div className="px-4 pb-4 -mt-6">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-[#2edb13] flex items-center justify-center text-white text-[14px] font-bold shadow-lg border-2 border-[var(--theme-card)] relative z-10">
                                    {initials}
                                </div>
                                <h3 className="text-[14px] font-bold text-[var(--theme-text-primary)] mt-2">
                                    <Link href="/talent/profile" className="text-[var(--theme-text-primary)] hover:text-[#3CF91A] no-underline transition-colors">{username}</Link>
                                </h3>
                                <p className="text-[11px] text-[var(--theme-text-muted)] mb-3">{roleLine} &bull; Lv.1</p>
                                <div className="flex items-center gap-4 text-center">
                                    <div>
                                        <p className="text-[14px] font-bold text-[var(--theme-text-secondary)]">{spillsCount}</p>
                                        <p className="text-[9px] text-[var(--theme-text-muted)] uppercase tracking-wider">Spills</p>
                                    </div>
                                    <div className="w-px h-6" style={{ background: "var(--theme-border)" }} />
                                    <div>
                                        <p className="text-[14px] font-bold text-[var(--theme-text-secondary)]">1.2k</p>
                                        <p className="text-[9px] text-[var(--theme-text-muted)] uppercase tracking-wider">Followers</p>
                                    </div>
                                    <div className="w-px h-6" style={{ background: "var(--theme-border)" }} />
                                    <div>
                                        <p className="text-[14px] font-bold text-[var(--theme-text-secondary)]">847</p>
                                        <p className="text-[9px] text-[var(--theme-text-muted)] uppercase tracking-wider">Following</p>
                                    </div>
                                </div>
                            </div>
                        </div>



                        {/* —— Job Suggestions —— */}
                        <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--theme-border-light)]">
                                <h3 className="text-[11px] font-bold text-[var(--theme-text-muted)] uppercase tracking-[2px]"
                                    style={{ fontFamily: "var(--font-jetbrains-mono)" }}>💼 Jobs For You</h3>
                                <Link href="/talent/jobs"
                                    className="text-[9px] text-[#3CF91A] hover:text-[#2edb13] font-bold no-underline transition-colors">
                                    ALL →
                                </Link>
                            </div>
                            <div className="divide-y divide-[var(--theme-border-light)]">
                                {jobSuggestions.map((job) => (
                                    <div key={job.title} className="px-4 py-3 hover:bg-[#3CF91A]/10 transition-colors cursor-pointer group" style={{ borderColor: "var(--theme-border-light)" }}>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="text-[12px] font-semibold text-[var(--theme-text-secondary)] group-hover:text-[var(--theme-text-primary)] transition-colors">{job.title}</p>
                                                <p className="text-[10px] text-[var(--theme-text-muted)]">{job.company} &bull; {job.budget}</p>
                                            </div>
                                            <span className="text-[10px] font-bold text-[#3CF91A] px-2 py-0.5 rounded-full bg-[#3CF91A]/10 border border-[#3CF91A]/20"
                                                style={{ fontFamily: "var(--font-jetbrains-mono)" }}>{job.match}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* —— Suggested Connections —— */}
                        <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm overflow-hidden">
                            <div className="px-4 py-3 border-b border-[var(--theme-border-light)]">
                                <h3 className="text-[11px] font-bold text-[var(--theme-text-muted)] uppercase tracking-[2px]"
                                    style={{ fontFamily: "var(--font-jetbrains-mono)" }}>👥 People to Follow</h3>
                            </div>
                            <div className="divide-y divide-[var(--theme-border-light)]">
                                {suggestedUsers.map((user) => (
                                    <div key={user.name} className="flex items-center justify-between px-4 py-3" style={{ borderColor: "var(--theme-border-light)" }}>
                                        <div className="flex items-center gap-2.5">
                                            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${user.grad} flex items-center justify-center text-white text-[9px] font-bold shadow-sm`}>
                                                {user.initials}
                                            </div>
                                            <div>
                                                <p className="text-[12px] font-semibold text-[var(--theme-text-secondary)]">{user.name}</p>
                                                <p className="text-[10px] text-[var(--theme-text-muted)]">{user.role}</p>
                                            </div>
                                        </div>
                                        <button className="px-3 py-1 rounded-lg text-[10px] font-bold text-[#2edb13] border border-[#3CF91A]/20 bg-[#3CF91A]/10 cursor-pointer hover:bg-[#2edb13] hover:text-white hover:border-[#2edb13] transition-all">
                                            Follow
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* —— Footer links —— */}
                        <div className="px-2 text-center">
                            <p className="text-[10px] text-[var(--theme-text-muted)] leading-relaxed">
                                About &bull; Help &bull; Terms &bull; Privacy
                            </p>
                            <p className="text-[10px] text-[var(--theme-text-muted)] mt-1">&copy; 2026 SkillSpill</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
