"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Sparkles, Briefcase, Target, BarChart2, Copy, Check, Loader2 } from "lucide-react";
import { CoverBanner } from "@/app/components/CoverBanners";
import CommentThread from "@/app/feed/components/CommentThread";

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   S K I L L S P I L L  —  R E C R U I T E R  F E E D
   Social feed — recruiter perspective
   â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

/* ── Icons ── */
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
        "from-[#A855F7] to-purple-600",
        "from-pink-400 to-rose-500",
        "from-emerald-400 to-teal-500",
        "from-sky-400 to-indigo-500",
    ];
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    return grads[Math.abs(hash) % grads.length];
}

const defaultActiveJobs = [
    { id: "j1", title: "Senior React Developer", type: "Full-time", apps: 12, budget: "$8k", days: 5, hot: true },
    { id: "j2", title: "Rust Systems Engineer", type: "Contract", apps: 7, budget: "$12k", days: 12, hot: false },
    { id: "j3", title: "DevOps Lead", type: "Full-time", apps: 19, budget: "$10k", days: 2, hot: true },
];

const defaultTopCandidates = [
    { id: "u1", name: "Sarah Chen", role: "Full-Stack", type: "TALENT", initials: "SC", grad: "from-violet-500 to-purple-600", score: 94, avatarUrl: null },
    { id: "u2", name: "Marcus Johnson", role: "Backend", type: "TALENT", initials: "MJ", grad: "from-sky-400 to-blue-500", score: 91, avatarUrl: null },
    { id: "u3", name: "Aisha Patel", role: "ML Eng", type: "TALENT", initials: "AP", grad: "from-emerald-400 to-teal-500", score: 89, avatarUrl: null },
];



/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• MAIN FEED â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
/* ═══════════════ SKELETON ═══════════════ */
function PostSkeleton() {
    return (
        <div className="rounded-2xl border border-(--theme-border) bg-(--theme-card) overflow-hidden animate-pulse">
            <div className="flex items-center gap-3 px-5 pt-4 pb-2">
                <div className="w-10 h-10 rounded-full bg-(--theme-border)" />
                <div className="flex-1 space-y-1.5">
                    <div className="h-3 bg-(--theme-border) rounded w-28" />
                    <div className="h-2.5 bg-(--theme-border) rounded w-20" />
                </div>
            </div>
            <div className="px-5 py-3 space-y-2">
                <div className="h-3 bg-(--theme-border) rounded w-full" />
                <div className="h-3 bg-(--theme-border) rounded w-4/5" />
                <div className="h-3 bg-(--theme-border) rounded w-3/5" />
            </div>
            <div className="flex items-center gap-5 px-5 py-3 border-t border-(--theme-border-light)">
                <div className="h-3 bg-(--theme-border) rounded w-10" />
                <div className="h-3 bg-(--theme-border) rounded w-10" />
                <div className="h-3 bg-(--theme-border) rounded w-10" />
            </div>
        </div>
    );
}

function SidebarJobSkeleton() {
    return (
        <div className="px-4 py-3 animate-pulse border-b border-(--theme-border-light) last:border-0 hover:bg-transparent cursor-default">
            <div className="flex items-start justify-between mb-1">
                <div className="flex items-center gap-1.5 w-full">
                    <div className="h-3 bg-(--theme-border) rounded w-3/4" />
                </div>
                <div className="h-2 bg-(--theme-border) rounded w-8 shrink-0 ml-4" />
            </div>
            <div className="flex items-center justify-between">
                <div className="h-2 bg-(--theme-border) rounded w-1/2" />
                <div className="h-2 bg-(--theme-border) rounded w-8 shrink-0" />
            </div>
        </div>
    );
}

function SidebarUserSkeleton() {
    return (
        <div className="flex items-center justify-between px-4 py-3 animate-pulse border-b border-(--theme-border-light) last:border-0 hover:bg-transparent cursor-default">
            <div className="flex items-center gap-2.5 w-full">
                <div className="w-8 h-8 rounded-full bg-(--theme-border) shrink-0" />
                <div className="space-y-1.5 flex-1">
                    <div className="h-3 bg-(--theme-border) rounded w-1/2" />
                    <div className="h-2 bg-(--theme-border) rounded w-1/3" />
                </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-4">
                <div className="h-2 bg-(--theme-border) rounded w-6" />
                <div className="h-6 bg-(--theme-border) rounded w-12" />
            </div>
        </div>
    );
}

export default function RecruiterFeed() {
    const [feedTab, setFeedTab] = useState("Discover");
    const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
    const [savedPosts, setSavedPosts] = useState<Record<string, boolean>>({});
    const [copiedStatus, setCopiedStatus] = useState<Record<string, boolean>>({});
    const [openComments, setOpenComments] = useState<Record<string, boolean>>({});
    const [overrideCommentsCount, setOverrideCommentsCount] = useState<Record<string, number>>({});
    
    // In-flight guards keyed by post ID
    const likeInFlight = useRef<Record<string, boolean>>({});
    const saveInFlight = useRef<Record<string, boolean>>({});

    // Real feed data
    const [posts, setPosts] = useState<any[]>([]);
    const [loadingPosts, setLoadingPosts] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const cursorRef = useRef<string | null>(null);
    const sentinelRef = useRef<HTMLDivElement>(null);

    const [userData, setUserData] = useState<any>(null);
    const [sidebarData, setSidebarData] = useState<{ suggestedUsers: any[], jobSuggestions: any[] } | null>(null);
    const [sidebarLoading, setSidebarLoading] = useState(true);

    useEffect(() => {
        fetch("/api/user/profile")
            .then(res => res.json())
            .then(data => {
                if (data.user) {
                    setUserData(data.user);
                }
            })
            .catch(() => {});
            
        fetch("/api/sidebar")
            .then(res => res.json())
            .then(data => {
                if (data.suggestedUsers) setSidebarData(data);
                setSidebarLoading(false);
            })
            .catch(() => setSidebarLoading(false));
    }, []);

    // Fetch the Feed Posts (initial / tab change)
    useEffect(() => {
        setLoadingPosts(true);
        setPosts([]);
        cursorRef.current = null;
        setHasMore(false);
        let filter = "all";
        if (feedTab === "My Network") filter = "following";
        if (feedTab === "Trending") filter = "trending";
        fetch(`/api/spill/posts?limit=10&filter=${filter}`)
            .then(res => res.json())
            .then(data => {
                if (data.posts) setPosts(data.posts);
                cursorRef.current = data.nextCursor ?? null;
                setHasMore(data.hasMore ?? false);
                setLoadingPosts(false);
            })
            .catch(() => setLoadingPosts(false));
    }, [feedTab]);

    // Fetch next page
    const fetchMore = useCallback(async () => {
        if (!cursorRef.current || loadingMore) return;
        setLoadingMore(true);
        let filter = "all";
        if (feedTab === "My Network") filter = "following";
        if (feedTab === "Trending") filter = "trending";
        try {
            const res = await fetch(`/api/spill/posts?limit=10&filter=${filter}&cursor=${cursorRef.current}`);
            const data = await res.json();
            if (data.posts) {
                setPosts(prev => [...prev, ...data.posts]);
                cursorRef.current = data.nextCursor ?? null;
                setHasMore(data.hasMore ?? false);
            }
        } catch { /* noop */ }
        setLoadingMore(false);
    }, [loadingMore, feedTab]);

    // IntersectionObserver sentinel for infinite scroll
    useEffect(() => {
        const el = sentinelRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            (entries) => { if (entries[0].isIntersecting) fetchMore(); },
            { rootMargin: "400px" }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [fetchMore]);

    const toggleLike = useCallback(async (id: string, currentlyLiked: boolean) => {
        if (likeInFlight.current[id]) return;
        likeInFlight.current[id] = true;

        // Optimistic update
        setLikedPosts(p => ({ ...p, [id]: !currentlyLiked }));
        setPosts(prev => prev.map(p => p.id === id
            ? { ...p, likesCount: Math.max(0, p.likesCount + (currentlyLiked ? -1 : 1)) }
            : p
        ));
        try {
            const res = await fetch(`/api/spill/posts/${id}/like`, { method: "POST" });
            if (res.ok) {
                const data = await res.json();
                // Reconcile with server truth
                setLikedPosts(p => ({ ...p, [id]: data.liked }));
                setPosts(prev => prev.map(p => p.id === id ? { ...p, likesCount: data.likesCount } : p));
            } else {
                // Revert
                setLikedPosts(p => ({ ...p, [id]: currentlyLiked }));
                setPosts(prev => prev.map(p => p.id === id
                    ? { ...p, likesCount: Math.max(0, p.likesCount + (currentlyLiked ? 1 : -1)) }
                    : p
                ));
            }
        } catch {
            setLikedPosts(p => ({ ...p, [id]: currentlyLiked }));
            setPosts(prev => prev.map(p => p.id === id
                ? { ...p, likesCount: Math.max(0, p.likesCount + (currentlyLiked ? 1 : -1)) }
                : p
            ));
        } finally {
            likeInFlight.current[id] = false;
        }
    }, []);

    const toggleSave = useCallback(async (id: string, currentlySaved: boolean) => {
        if (saveInFlight.current[id]) return;
        saveInFlight.current[id] = true;

        setSavedPosts(p => ({ ...p, [id]: !currentlySaved }));
        try {
            const res = await fetch(`/api/spill/posts/${id}/save`, { method: "POST" });
            if (!res.ok) setSavedPosts(p => ({ ...p, [id]: currentlySaved }));
        } catch {
            setSavedPosts(p => ({ ...p, [id]: currentlySaved }));
        } finally {
            saveInFlight.current[id] = false;
        }
    }, []);

    const handleCopyCode = (id: string, code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedStatus(p => ({ ...p, [id]: true }));
        setTimeout(() => {
            setCopiedStatus(p => ({ ...p, [id]: false }));
        }, 2000);
    };

    const tabs = ["Discover", "My Network", "Trending", "Code", "Saved"];

    const companyName = userData?.recruiterProfile?.companyName || "Company";
    const jobTitle = userData?.recruiterProfile?.jobTitle || "Talent Scout";
    const initials = companyName ? companyName.substring(0, 2).toUpperCase() : "RC";
    const avatarUrl = userData?.avatarUrl || "";
    const coverUrl = userData?.coverUrl || "1";
    const followersCount = userData?._count?.followers ?? 0;
    const followingCount = userData?._count?.following ?? 0;
    const spillsCount = userData?.spillPosts?.length ?? 0;

    const fmtCount = (n: number) => {
        if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'm';
        if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
        return String(n);
    };

    const displayJobs = sidebarData?.jobSuggestions?.length ? sidebarData.jobSuggestions : defaultActiveJobs;
    const displayCandidates = sidebarData?.suggestedUsers?.length ? sidebarData.suggestedUsers : defaultTopCandidates;


    return (
        <div style={{ background: "var(--theme-bg)" }} className="min-h-full">
            <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-4 pb-24 lg:pb-8">
                <div className="flex flex-col lg:flex-row gap-6">

                    {/* â•â•â•â•â•â•â•â• MAIN FEED â•â•â•â•â•â•â•â• */}
                    <div className="flex-1 min-w-0 space-y-4">


                        {/* ── Feed Tabs ── */}
                        <div className="flex items-center gap-1 px-1 overflow-x-auto">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setFeedTab(tab)}
                                    className={`px-4 py-2 rounded-xl text-[12px] font-semibold transition-all duration-200 border-none cursor-pointer whitespace-nowrap
                                        ${feedTab === tab
                                            ? "bg-(--theme-card) text-(--theme-text-primary) shadow-sm"
                                            : "bg-transparent text-(--theme-text-muted) hover:text-(--theme-text-tertiary) hover:bg-(--theme-card)/50"
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* ── Posts ── */}
                        {loadingPosts ? (
                            <>{[0, 1, 2].map(i => <PostSkeleton key={i} />)}</>
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
                            
                            // Mock match score only for talent profiles
                            const isTalent = post.user?.role === "TALENT";
                            const mockMatchScore = isTalent ? Math.floor(Math.random() * 20) + 80 : null;

                            return (
                                <article key={post.id} className="rounded-2xl border border-(--theme-border) bg-(--theme-card) shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                                    {/* Header */}
                                    <div className="flex items-center justify-between px-5 pt-4 pb-2">
                                        <div className="flex items-center gap-3">
                                            <Link href={userData?.id === post.userId ? "/recruiter/profile" : (post.user?.role === "TALENT" ? `/recruiter/talent/${post.user?.id}` : `/recruiter/recruiter/${post.user?.id}`)}>
                                            {post.user?.avatarUrl ? (
                                                <img src={post.user.avatarUrl} alt={pFullName} loading="lazy" className="w-10 h-10 rounded-full object-cover shadow-md" />
                                            ) : (
                                                <div className={`w-10 h-10 rounded-full bg-linear-to-br ${pGrad} flex items-center justify-center text-white text-[11px] font-bold shadow-md`}>
                                                    {pInitials}
                                                </div>
                                            )}
                                            </Link>
                                            <div>
                                                <div className="flex items-center gap-1.5">
                                                    <Link href={userData?.id === post.userId ? "/recruiter/profile" : (post.user?.role === "TALENT" ? `/recruiter/talent/${post.user?.id}` : `/recruiter/recruiter/${post.user?.id}`)}
                                                        className="text-[13px] font-bold text-(--theme-text-primary) no-underline hover:underline">{pUsername}</Link>
                                                    {pVerified && (
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="#8B5CF6"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#fff" strokeWidth="2" /></svg>
                                                    )}
                                                    {mockMatchScore && (
                                                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#A855F7]/10 text-[#A855F7] border border-[#A855F7]/20 font-bold"
                                                            style={{ fontFamily: "var(--font-jetbrains-mono)" }}>
                                                            {mockMatchScore}% match
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-[11px] text-(--theme-text-muted)">
                                                    {pRole} • <span style={{ fontFamily: "var(--font-jetbrains-mono)" }}>{pTime} ago</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {mockMatchScore && (
                                                <button className="px-3 py-1 rounded-lg text-[10px] font-bold text-[#A855F7] border border-[#A855F7]/30 bg-[#A855F7]/10 cursor-pointer hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-all">
                                                    Connect
                                                </button>
                                            )}
                                            <button className="text-(--theme-text-muted) hover:text-(--theme-text-muted) transition-colors bg-transparent border-none cursor-pointer p-1">
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" /></svg>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Content (Caption) */}
                                    {post.caption && (
                                        <div className="px-5 py-3">
                                            <p className="text-[13px] text-(--theme-text-secondary) leading-relaxed whitespace-pre-line">{post.caption}</p>
                                        </div>
                                    )}

                                    {/* Media */}
                                    {post.media && post.media.length > 0 && (
                                        <div className="px-5 mb-3">
                                            <div className={`grid gap-1 rounded-xl overflow-hidden ${post.media.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
                                                {post.media.map((m: any, i: number) => (
                                                    <img key={i} src={m.url} alt="Post media" loading="lazy" className="w-full h-auto object-cover max-h-100 border border-(--theme-border-light)" />
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Video */}
                                    {post.videoUrl && (
                                        <div className="px-5 mb-3">
                                            <video controls className="w-full rounded-xl max-h-[500px] object-cover border border-(--theme-border-light)" poster={post.thumbnailUrl || undefined} preload="metadata">
                                                <source src={post.videoUrl} />
                                            </video>
                                        </div>
                                    )}

                                    {/* Code Snippet */}
                                    {post.code && (
                                        <div className="mx-5 mb-3 rounded-xl overflow-hidden border border-(--theme-border)">
                                            <div className="flex items-center justify-between px-3.5 py-2 bg-(--theme-bg-secondary) border-b border-(--theme-border-light)">
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                                                    <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                                                    <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[9px] text-(--theme-text-muted) uppercase tracking-wider font-bold"
                                                        style={{ fontFamily: "var(--font-jetbrains-mono)" }}>{post.codeLang}</span>
                                                    <button 
                                                        onClick={() => handleCopyCode(post.id, post.code)}
                                                        className="flex items-center justify-center bg-transparent border-none cursor-pointer text-(--theme-text-muted) hover:text-[#A855F7] transition-colors"
                                                        title="Copy Code"
                                                    >
                                                        {copiedStatus[post.id] ? <Check size={14} className="text-[#A855F7]" /> : <Copy size={14} />}
                                                    </button>
                                                </div>
                                            </div>
                                            <pre className="px-4 py-3 text-[11px] leading-relaxed overflow-x-auto bg-[#1E1E2E] text-emerald-400 m-0"
                                                style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>
                                                <code>{post.code}</code>
                                            </pre>
                                        </div>
                                    )}

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-1.5 px-5 pb-3">
                                        {pTags.map((tag: string) => (
                                            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-(--theme-bg-secondary) border border-(--theme-border) text-(--theme-text-muted) font-medium cursor-pointer hover:border-[#A855F7]/40 hover:text-[#A855F7] hover:bg-[#A855F7]/10 transition-all"
                                                style={{ fontFamily: "var(--font-jetbrains-mono)" }}>
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center justify-between px-5 py-3 border-t border-(--theme-border-light)">
                                        <div className="flex items-center gap-5">
                                            <button onClick={() => toggleLike(post.id, isLiked)}
                                                className={`flex items-center gap-1.5 text-[12px] font-medium transition-all bg-transparent border-none cursor-pointer ${isLiked ? "text-red-500" : "text-(--theme-text-muted) hover:text-red-500"}`}>
                                                <HeartIcon filled={isLiked} />
                                                <span>{post.likesCount}</span>
                                            </button>
                                            <button onClick={() => setOpenComments(p => ({ ...p, [post.id]: !p[post.id] }))} className="flex items-center gap-1.5 text-[12px] font-medium text-(--theme-text-muted) hover:text-blue-500 transition-all bg-transparent border-none cursor-pointer">
                                                <CommentIcon /> {(overrideCommentsCount[post.id] !== undefined ? overrideCommentsCount[post.id] : post.commentsCount) || 0}
                                            </button>
                                            <button className="flex items-center gap-1.5 text-[12px] font-medium text-(--theme-text-muted) hover:text-[#A855F7] transition-all bg-transparent border-none cursor-pointer">
                                                <ShareIcon /> {post.repostsCount || 0}
                                            </button>
                                        </div>
                                        <button onClick={() => toggleSave(post.id, isSaved)}
                                            className={`transition-all bg-transparent border-none cursor-pointer ${isSaved ? "text-[#A855F7]" : "text-(--theme-text-muted) hover:text-[#A855F7]"}`}>
                                            <BookmarkIcon filled={isSaved} />
                                        </button>
                                    </div>

                                    {/* Comments Thread */}
                                    {openComments[post.id] && (
                                        <div className="px-5 pb-4">
                                            <CommentThread
                                                postId={post.id}
                                                commentsCount={overrideCommentsCount[post.id] !== undefined ? overrideCommentsCount[post.id] : post.commentsCount}
                                                onCountChange={(n: number) => setOverrideCommentsCount(p => ({ ...p, [post.id]: n }))}
                                                currentUserRole="RECRUITER"
                                                currentUserId={userData?.id}
                                            />
                                        </div>
                                    )}
                                </article>
                            );
                        })}

                        {/* Infinite scroll sentinel */}
                        <div ref={sentinelRef} className="h-1" />
                        {loadingMore && (
                            <div className="py-6 flex items-center justify-center gap-2 text-(--theme-text-muted)">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span className="text-[12px]">Loading more…</span>
                            </div>
                        )}
                        {!loadingPosts && !hasMore && posts.length > 0 && (
                            <p className="py-6 text-center text-[11px] text-(--theme-text-muted)">You&apos;re all caught up</p>
                        )}
                    </div>

                    {/* â•â•â•â•â•â•â•â• RIGHT SIDEBAR (hidden on mobile) â•â•â•â•â•â•â•â• */}
                    <div className="hidden lg:block w-75 shrink-0 space-y-5" style={{ position: "sticky", top: "1.25rem", alignSelf: "flex-start" }}>

                        {/* ── Company Card ── */}
                        <div className="rounded-2xl border border-(--theme-border) bg-(--theme-card) shadow-sm overflow-hidden">
                            <div className="h-16 relative overflow-hidden">
                                <CoverBanner coverId={coverUrl} />
                            </div>
                            <div className="px-4 pb-4 -mt-6">
                                {avatarUrl ? (
                                    <img src={avatarUrl} alt={companyName} className="w-12 h-12 rounded-xl object-cover shadow-lg border-2 border-white relative z-10" />
                                ) : (
                                    <div className="w-12 h-12 rounded-xl bg-linear-to-br from-purple-400 to-violet-600 flex items-center justify-center text-white text-[13px] font-bold shadow-lg border-2 border-white relative z-10">
                                        {initials}
                                    </div>
                                )}
                                <h3 className="text-[14px] font-bold text-(--theme-text-primary) mt-2">{companyName}</h3>
                                <p className="text-[11px] text-(--theme-text-muted) mb-3">{jobTitle} • SkillSpill</p>
                                <div className="grid grid-cols-3 gap-2 text-center">
                                    <div className="bg-[#A855F7]/10 rounded-lg py-2">
                                        <p className="text-[14px] font-bold text-[#A855F7]">{fmtCount(spillsCount)}</p>
                                        <p className="text-[8px] text-(--theme-text-muted) uppercase tracking-wider font-semibold">Spills</p>
                                    </div>
                                    <div className="bg-indigo-500/10 rounded-lg py-2">
                                        <p className="text-[14px] font-bold text-indigo-500">{fmtCount(followersCount)}</p>
                                        <p className="text-[8px] text-(--theme-text-muted) uppercase tracking-wider font-semibold">Followers</p>
                                    </div>
                                    <div className="bg-emerald-500/10 rounded-lg py-2">
                                        <p className="text-[14px] font-bold text-emerald-500">{fmtCount(followingCount)}</p>
                                        <p className="text-[8px] text-(--theme-text-muted) uppercase tracking-wider font-semibold">Following</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── Active Jobs ── */}
                        <div className="rounded-2xl border border-(--theme-border) bg-(--theme-card) shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3 border-b border-(--theme-border-light)">
                                <h3 className="text-[11px] font-bold text-(--theme-text-muted) uppercase tracking-[2px]"
                                    style={{ fontFamily: "var(--font-jetbrains-mono)" }}><Briefcase className="inline-block w-4 h-4 mr-1.5 align-text-bottom" />Your Jobs</h3>
                                <Link href="/recruiter/applications"
                                    className="block p-3 rounded-xl hover:bg-(--theme-bg-secondary) transition-colors border border-transparent hover:border-(--theme-border-light) no-underline">
                                    MANAGE <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
                                </Link>
                            </div>
                            <div className="divide-y divide-(--theme-border-light)">
                                {sidebarLoading ? (
                                    [...Array(3)].map((_, i) => <SidebarJobSkeleton key={i} />)
                                ) : (
                                    displayJobs.map((job: any, i: number) => (
                                        <div key={i} className="px-4 py-3 hover:bg-purple-500/10 transition-colors cursor-pointer group">
                                            <div className="flex items-start justify-between mb-1">
                                                <div className="flex items-center gap-1.5">
                                                    {job.hot && <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />}
                                                    <p className="text-[12px] font-semibold text-(--theme-text-secondary) group-hover:text-(--theme-text-primary) transition-colors">{job.title}</p>
                                                </div>
                                                <span className="text-[10px] font-bold text-emerald-500"
                                                    style={{ fontFamily: "var(--font-jetbrains-mono)" }}>{job.budget}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] text-(--theme-text-muted)">{job.apps} applicants • {job.type}</span>
                                                <span className={`text-[10px] ${job.days <= 3 ? "text-orange-500 font-semibold" : "text-(--theme-text-muted)"}`}
                                                    style={{ fontFamily: "var(--font-jetbrains-mono)" }}>{job.days}d left</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            <div className="px-4 py-3 border-t border-(--theme-border-light)">
                                <Link href="/recruiter/applications"
                                    className="flex items-center justify-center gap-2 w-full py-2 rounded-xl text-[11px] font-bold text-[#A855F7] bg-[#A855F7]/10 border border-[#A855F7]/20 hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-all no-underline cursor-pointer">
                                    + Post New Job
                                </Link>
                            </div>
                        </div>

                        {/* ── Top Candidates ── */}
                        <div className="rounded-2xl border border-(--theme-border) bg-(--theme-card) shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3 border-b border-(--theme-border-light)">
                                <h3 className="text-[11px] font-bold text-(--theme-text-muted) uppercase tracking-[2px]"
                                    style={{ fontFamily: "var(--font-jetbrains-mono)" }}><Target className="inline-block w-4 h-4 mr-1.5 align-text-bottom" />Top Matches</h3>
                                <Link href="/recruiter/search"
                                    className="text-[9px] text-[#A855F7] hover:text-[#A855F7] font-bold no-underline transition-colors flex items-center gap-0.5">
                                    SEARCH <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
                                </Link>
                            </div>
                            <div className="divide-y divide-(--theme-border-light)">
                                {sidebarLoading ? (
                                    [...Array(3)].map((_, i) => <SidebarUserSkeleton key={i} />)
                                ) : (
                                    displayCandidates.map((c: any) => (
                                        <div key={c.name} className="flex items-center justify-between px-4 py-3 hover:bg-(--theme-bg-secondary) transition-colors">
                                            <Link href={`/recruiter/${c.type === 'RECRUITER' ? 'recruiter' : 'talent'}/${c.id || 'u1'}`} className="flex items-center gap-2.5 no-underline">
                                                {c.avatarUrl ? (
                                                    <img src={c.avatarUrl} alt={c.name} className="w-8 h-8 rounded-full object-cover shadow-sm border border-(--theme-border-light)" />
                                                ) : (
                                                    <div className={`w-8 h-8 rounded-full bg-linear-to-br ${c.grad} flex items-center justify-center text-white text-[9px] font-bold shadow-sm`}>
                                                        {c.initials}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="text-[12px] font-semibold text-(--theme-text-secondary) hover:text-[#A855F7] transition-colors">{c.name}</p>
                                                    <p className="text-[10px] text-(--theme-text-muted)">{c.role}</p>
                                                </div>
                                            </Link>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-bold text-[#A855F7]"
                                                    style={{ fontFamily: "var(--font-jetbrains-mono)" }}>{c.score}%</span>
                                                <button className="px-2.5 py-1 rounded-md text-[9px] font-bold text-[#A855F7] border border-[#A855F7]/30 bg-[#A855F7]/10 cursor-pointer hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-all">
                                                    View
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>


                        {/* ── Footer links ── */}
                        <div className="px-2 text-center">
                            <p className="text-[10px] text-(--theme-text-muted) leading-relaxed">
                                About • Help • Terms • Privacy
                            </p>
                            <p className="text-[10px] text-(--theme-text-muted) mt-1">© 2026 SkillSpill</p>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}
