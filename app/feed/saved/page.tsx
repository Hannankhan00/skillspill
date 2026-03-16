"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import PostCard from "../components/PostCard";

export default function SavedSpillsPage() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [cursor, setCursor] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [userData, setUserData] = useState<any>(null);
    const sentinelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetch("/api/user/profile").then(r => r.json()).then(d => { if (d.user) setUserData(d.user); }).catch(console.error);
    }, []);

    const fetchSaved = useCallback(async (reset = false) => {
        if (reset) { setLoading(true); setCursor(null); }
        else setLoadingMore(true);
        try {
            const params = new URLSearchParams({ limit: "10" });
            if (!reset && cursor) params.set("cursor", cursor);
            const res = await fetch(`/api/spill/posts/saved?${params}`);
            const data = await res.json();
            if (data.posts) {
                setPosts(prev => reset ? data.posts : [...prev, ...data.posts]);
                setCursor(data.nextCursor);
                setHasMore(data.hasMore);
            }
        } catch (e) { console.error(e); }
        setLoading(false);
        setLoadingMore(false);
    }, [cursor]);

    useEffect(() => { fetchSaved(true); }, []);

    useEffect(() => {
        if (!sentinelRef.current || !hasMore) return;
        const obs = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && !loadingMore && hasMore) fetchSaved();
        }, { threshold: 0.1 });
        obs.observe(sentinelRef.current);
        return () => obs.disconnect();
    }, [hasMore, loadingMore, fetchSaved]);

    return (
        <div className="min-h-screen" style={{ background: "var(--theme-bg)" }}>
            <div className="sticky top-0 z-30 backdrop-blur-xl" style={{ background: "var(--theme-header-bg)", borderBottom: "1px solid var(--theme-border)" }}>
                <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
                    <Link href="/feed" className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[var(--theme-input-bg)] transition-all no-underline" style={{ color: "var(--theme-text-muted)" }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5" /><path d="m12 19-7-7 7-7" /></svg>
                    </Link>
                    <div>
                        <h1 className="text-[15px] font-bold" style={{ color: "var(--theme-text-primary)" }}>Saved Spills 🔖</h1>
                        <p className="text-[10px]" style={{ color: "var(--theme-text-muted)" }}>Your bookmarked posts</p>
                    </div>
                </div>
            </div>
            <div className="max-w-2xl mx-auto px-4 py-4 pb-24">
                {loading ? (
                    <div className="flex justify-center py-10"><div className="w-6 h-6 border-2 border-[#3CF91A] border-t-transparent rounded-full animate-spin" /></div>
                ) : posts.length === 0 ? (
                    <div className="rounded-2xl border border-dashed bg-[var(--theme-card)] p-10 text-center" style={{ borderColor: "var(--theme-border)" }}>
                        <p className="text-3xl mb-2">🔖</p>
                        <p className="text-[14px] font-bold" style={{ color: "var(--theme-text-secondary)" }}>No saved spills yet</p>
                        <p className="text-[12px] mb-3" style={{ color: "var(--theme-text-muted)" }}>Save posts you want to revisit later</p>
                        <Link href="/feed" className="px-4 py-2 rounded-xl text-[12px] font-bold text-black no-underline inline-block" style={{ background: "#3CF91A" }}>Browse Feed</Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {posts.map(post => (
                            <PostCard key={post.id} post={post} currentUserId={userData?.id} currentUserRole={userData?.role} onDeleted={(id) => setPosts(prev => prev.filter(p => p.id !== id))} />
                        ))}
                    </div>
                )}
                {loadingMore && <div className="flex justify-center py-6"><div className="w-6 h-6 border-2 border-[#3CF91A] border-t-transparent rounded-full animate-spin" /></div>}
                <div ref={sentinelRef} className="h-4" />
            </div>
        </div>
    );
}
