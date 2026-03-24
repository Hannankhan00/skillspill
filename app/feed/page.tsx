"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import PostCard from "./components/PostCard";
import PostComposer from "./components/PostComposer";

type Post = any;

export default function SpillFeedPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [cursor, setCursor] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [filter, setFilter] = useState("all");
    const [composerOpen, setComposerOpen] = useState(false);
    const [userData, setUserData] = useState<any>(null);
    const sentinelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetch("/api/user/profile").then(r => r.json()).then(d => { if (d.user) setUserData(d.user); }).catch(console.error);
    }, []);

    const fetchPosts = useCallback(async (reset = false) => {
        if (reset) { setLoading(true); setCursor(null); }
        else setLoadingMore(true);

        try {
            const params = new URLSearchParams({ limit: "10", filter });
            if (!reset && cursor) params.set("cursor", cursor);
            const res = await fetch(`/api/spill/posts?${params}`);
            const data = await res.json();
            if (data.posts) {
                setPosts(prev => reset ? data.posts : [...prev, ...data.posts]);
                setCursor(data.nextCursor);
                setHasMore(data.hasMore);
            }
        } catch (e) { console.error(e); }
        setLoading(false);
        setLoadingMore(false);
    }, [cursor, filter]);

    useEffect(() => { fetchPosts(true); }, [filter]);

    // Infinite scroll
    useEffect(() => {
        if (!sentinelRef.current || !hasMore) return;
        const obs = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && !loadingMore && hasMore) fetchPosts();
        }, { threshold: 0.1 });
        obs.observe(sentinelRef.current);
        return () => obs.disconnect();
    }, [hasMore, loadingMore, fetchPosts]);

    const handlePostCreated = (newPost: Post) => {
        setPosts(prev => [newPost, ...prev]);
        setComposerOpen(false);
    };

    const handlePostDeleted = (postId: string) => {
        setPosts(prev => prev.filter(p => p.id !== postId));
    };

    const filters = [
        { key: "all", label: "All" },
        { key: "following", label: "Following" },
        { key: "trending", label: "Trending" },
    ];

    const initials = userData?.fullName?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) || "??";

    return (
        <div className="min-h-screen" style={{ background: "var(--theme-bg)" }}>
            {/* Sticky top bar */}
            <div className="sticky top-0 z-30 backdrop-blur-xl" style={{ background: "var(--theme-header-bg)", borderBottom: "1px solid var(--theme-border)" }}>
                <div className="max-w-2xl mx-auto px-4">
                    <div className="flex items-center justify-between h-14">
                        <h1 className="text-lg font-bold" style={{ color: "var(--theme-text-primary)" }}>
                            The Spill <span className="text-xl">🌊</span>
                        </h1>
                        <div className="flex items-center gap-2">
                            <Link href="/feed/saved" className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:bg-[var(--theme-input-bg)]" style={{ color: "var(--theme-text-muted)" }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
                            </Link>
                        </div>
                    </div>
                    {/* Filter tabs */}
                    <div className="flex gap-0 -mb-px">
                        {filters.map(f => (
                            <button key={f.key} onClick={() => setFilter(f.key)}
                                className={`px-4 py-2.5 text-[12px] font-semibold border-b-2 transition-all cursor-pointer bg-transparent
                                    ${filter === f.key ? "border-[#3CF91A] text-[#2edb13]" : "border-transparent text-[var(--theme-text-muted)] hover:text-[var(--theme-text-tertiary)]"}`}>
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 py-4 pb-24">
                {/* Desktop compose card */}
                <div className="hidden sm:block mb-4">
                    <button onClick={() => setComposerOpen(true)}
                        className="w-full rounded-2xl border bg-[var(--theme-card)] shadow-sm p-4 flex items-center gap-3 cursor-pointer transition-all hover:shadow-md text-left"
                        style={{ borderColor: "var(--theme-border)" }}>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-[#2edb13] flex items-center justify-center text-white text-[11px] font-bold shrink-0">{initials}</div>
                        <span className="text-[13px] flex-1" style={{ color: "var(--theme-text-muted)" }}>What&apos;s on your mind? Share a spill...</span>
                        <span className="px-3 py-1.5 rounded-lg text-[11px] font-bold text-black" style={{ background: "#3CF91A" }}>Spill</span>
                    </button>
                </div>

                {/* Loading skeletons */}
                {loading && (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="rounded-2xl border bg-[var(--theme-card)] shadow-sm p-5 animate-pulse" style={{ borderColor: "var(--theme-border)" }}>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-[var(--theme-input-bg)]" />
                                    <div className="flex-1"><div className="h-3 w-24 bg-[var(--theme-input-bg)] rounded mb-2" /><div className="h-2 w-16 bg-[var(--theme-input-bg)] rounded" /></div>
                                </div>
                                <div className="h-3 w-full bg-[var(--theme-input-bg)] rounded mb-2" />
                                <div className="h-3 w-3/4 bg-[var(--theme-input-bg)] rounded mb-4" />
                                <div className="h-8 w-full bg-[var(--theme-input-bg)] rounded" />
                            </div>
                        ))}
                    </div>
                )}

                {/* Posts */}
                {!loading && (
                    <div className="space-y-4">
                        {posts.map(post => (
                            <PostCard key={post.id} post={post} currentUserId={userData?.id} currentUserRole={userData?.role} onDeleted={handlePostDeleted} />
                        ))}
                    </div>
                )}

                {/* Loading more indicator */}
                {loadingMore && (
                    <div className="flex justify-center py-6">
                        <div className="w-6 h-6 border-2 border-[#3CF91A] border-t-transparent rounded-full animate-spin" />
                    </div>
                )}

                {/* Sentinel for infinite scroll */}
                <div ref={sentinelRef} className="h-4" />

                {/* End state */}
                {!loading && !hasMore && posts.length > 0 && (
                    <div className="text-center py-8">
                        <p className="text-2xl mb-1">✨</p>
                        <p className="text-[13px] font-semibold" style={{ color: "var(--theme-text-secondary)" }}>You&apos;re all caught up!</p>
                        <p className="text-[11px]" style={{ color: "var(--theme-text-muted)" }}>Check back later for new spills</p>
                    </div>
                )}

                {/* Empty state */}
                {!loading && posts.length === 0 && (
                    <div className="rounded-2xl border border-dashed bg-[var(--theme-card)] p-10 text-center" style={{ borderColor: "var(--theme-border)" }}>
                        <p className="text-4xl mb-3">🌊</p>
                        <p className="text-[15px] font-bold mb-1" style={{ color: "var(--theme-text-secondary)" }}>The feed is quiet...</p>
                        <p className="text-[12px] mb-4" style={{ color: "var(--theme-text-muted)" }}>Be the first to share a spill!</p>
                        <button onClick={() => setComposerOpen(true)} className="px-5 py-2.5 rounded-xl text-[12px] font-bold border-none cursor-pointer text-black transition-all hover:scale-105" style={{ background: "#3CF91A", boxShadow: "0 0 15px #3CF91A40" }}>
                            Create a Spill
                        </button>
                    </div>
                )}
            </div>

            {/* Floating compose button (mobile) */}
            <button onClick={() => setComposerOpen(true)}
                className="fixed bottom-20 right-4 sm:hidden w-14 h-14 rounded-full flex items-center justify-center shadow-lg z-30 cursor-pointer border-none transition-all hover:scale-110"
                style={{ background: "linear-gradient(135deg, #3CF91A, #16A34A)", boxShadow: "0 4px 20px #3CF91A50" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            </button>

            {/* Post Composer Modal */}
            {composerOpen && (
                <PostComposer
                    userData={userData}
                    onClose={() => setComposerOpen(false)}
                    onPostCreated={handlePostCreated}
                />
            )}
        </div>
    );
}
