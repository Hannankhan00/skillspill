"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PostCard from "../components/PostCard";

/* ─── Icons ─── */
const BookmarkFillIcon = ({ size = 20 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1.5"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
);
const SearchIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
);
const GridIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
);
const ListIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
);
const SparklesIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3L14.5 8.5L20 9.5L16 14L17 20L12 17L7 20L8 14L4 9.5L9.5 8.5L12 3Z" /></svg>
);
const FilterIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
);

export default function SavedSpillsPage() {
    const router = useRouter();
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [cursor, setCursor] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [userData, setUserData] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState("all");
    const [viewMode, setViewMode] = useState<"list" | "compact">("list");
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
                setPosts(prev => {
                    if (reset) return data.posts;
                    const newPosts = data.posts.filter((p: any) => !prev.some(existing => existing.id === p.id));
                    return [...prev, ...newPosts];
                });
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

    // Filter posts by search query and type
    const filteredPosts = posts.filter(post => {
        const matchesSearch = !searchQuery.trim() ||
            post.caption?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.user?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (Array.isArray(post.hashtags) && post.hashtags.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase())));
        const matchesType = filterType === "all" ||
            (filterType === "code" && post.postType === "code") ||
            (filterType === "media" && (post.postType === "image" || post.postType === "video")) ||
            (filterType === "text" && post.postType === "text") ||
            (filterType === "github" && post.postType === "github") ||
            (filterType === "hiring" && post.postType === "hiring");
        return matchesSearch && matchesType;
    });

    const typeFilters = [
        { key: "all", label: "All", icon: "✨" },
        { key: "text", label: "Text", icon: "💬" },
        { key: "code", label: "Code", icon: "💻" },
        { key: "media", label: "Media", icon: "🖼️" },
        { key: "github", label: "GitHub", icon: "🐙" },
        { key: "hiring", label: "Jobs", icon: "💼" },
    ];

    // Stats
    const totalSaved = posts.length;
    const codeCount = posts.filter(p => p.postType === "code").length;
    const mediaCount = posts.filter(p => p.postType === "image" || p.postType === "video").length;

    return (
        <div className="min-h-screen" style={{ background: "var(--theme-bg)" }}>
            {/* ═══ Premium Header ═══ */}
            <div className="sticky top-0 z-30 backdrop-blur-xl" style={{ background: "var(--theme-header-bg)", borderBottom: "1px solid var(--theme-border)" }}>
                <div className="max-w-2xl mx-auto px-4">
                    <div className="h-14 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => router.back()}
                                className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-[var(--theme-input-bg)] transition-all bg-transparent border-none cursor-pointer"
                                style={{ color: "var(--theme-text-muted)" }}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5" /><path d="m12 19-7-7 7-7" /></svg>
                            </button>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #8B5CF6, #6D28D9)", boxShadow: "0 0 12px rgba(139,92,246,0.3)" }}>
                                    <BookmarkFillIcon size={14} />
                                </div>
                                <div>
                                    <h1 className="text-[14px] font-bold" style={{ color: "var(--theme-text-primary)" }}>
                                        Your Collection
                                    </h1>
                                    <p className="text-[9px] font-medium" style={{ color: "var(--theme-text-muted)" }}>
                                        {totalSaved} saved {totalSaved === 1 ? "spill" : "spills"}
                                    </p>
                                </div>
                            </div>
                        </div>
                        {/* View mode toggle */}
                        <div className="flex items-center gap-1 p-1 rounded-lg" style={{ background: "var(--theme-input-bg)" }}>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`w-7 h-7 rounded-md flex items-center justify-center border-none cursor-pointer transition-all ${viewMode === "list" ? "shadow-sm" : "bg-transparent"}`}
                                style={{
                                    background: viewMode === "list" ? "var(--theme-card)" : "transparent",
                                    color: viewMode === "list" ? "#8B5CF6" : "var(--theme-text-muted)"
                                }}
                            >
                                <ListIcon />
                            </button>
                            <button
                                onClick={() => setViewMode("compact")}
                                className={`w-7 h-7 rounded-md flex items-center justify-center border-none cursor-pointer transition-all ${viewMode === "compact" ? "shadow-sm" : "bg-transparent"}`}
                                style={{
                                    background: viewMode === "compact" ? "var(--theme-card)" : "transparent",
                                    color: viewMode === "compact" ? "#8B5CF6" : "var(--theme-text-muted)"
                                }}
                            >
                                <GridIcon />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 py-4 pb-24">
                {/* ═══ Stats Strip ═══ */}
                {!loading && posts.length > 0 && (
                    <div className="flex items-center gap-3 mb-4 overflow-x-auto pb-1">
                        <div className="flex items-center gap-2 px-3 py-2 rounded-xl border shrink-0" style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.08), rgba(109,40,217,0.04))", borderColor: "rgba(139,92,246,0.15)" }}>
                            <span className="text-[16px]">📚</span>
                            <div>
                                <p className="text-[13px] font-bold" style={{ color: "#8B5CF6" }}>{totalSaved}</p>
                                <p className="text-[8px] font-semibold uppercase tracking-wider" style={{ color: "var(--theme-text-muted)" }}>Total</p>
                            </div>
                        </div>
                        {codeCount > 0 && (
                            <div className="flex items-center gap-2 px-3 py-2 rounded-xl border shrink-0" style={{ background: "linear-gradient(135deg, rgba(60,249,26,0.06), rgba(22,163,74,0.03))", borderColor: "rgba(60,249,26,0.12)" }}>
                                <span className="text-[16px]">💻</span>
                                <div>
                                    <p className="text-[13px] font-bold" style={{ color: "#3CF91A" }}>{codeCount}</p>
                                    <p className="text-[8px] font-semibold uppercase tracking-wider" style={{ color: "var(--theme-text-muted)" }}>Code</p>
                                </div>
                            </div>
                        )}
                        {mediaCount > 0 && (
                            <div className="flex items-center gap-2 px-3 py-2 rounded-xl border shrink-0" style={{ background: "linear-gradient(135deg, rgba(236,72,153,0.06), rgba(219,39,119,0.03))", borderColor: "rgba(236,72,153,0.12)" }}>
                                <span className="text-[16px]">🖼️</span>
                                <div>
                                    <p className="text-[13px] font-bold" style={{ color: "#EC4899" }}>{mediaCount}</p>
                                    <p className="text-[8px] font-semibold uppercase tracking-wider" style={{ color: "var(--theme-text-muted)" }}>Media</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ═══ Search & Filter ═══ */}
                {!loading && posts.length > 0 && (
                    <div className="mb-4 space-y-3">
                        {/* Search bar */}
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--theme-text-muted)" }}>
                                <SearchIcon />
                            </div>
                            <input
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Search saved spills..."
                                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-[12px] bg-[var(--theme-input-bg)] border border-[var(--theme-border)] outline-none focus:border-[#8B5CF6] transition-all"
                                style={{ color: "var(--theme-text-primary)" }}
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center bg-transparent border-none cursor-pointer text-[10px]"
                                    style={{ color: "var(--theme-text-muted)", background: "var(--theme-input-bg)" }}
                                >
                                    ✕
                                </button>
                            )}
                        </div>

                        {/* Type filter pills */}
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                            <span className="shrink-0" style={{ color: "var(--theme-text-muted)" }}><FilterIcon /></span>
                            {typeFilters.map(f => (
                                <button
                                    key={f.key}
                                    onClick={() => setFilterType(f.key)}
                                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold border cursor-pointer transition-all shrink-0 ${filterType === f.key
                                        ? "shadow-sm"
                                        : "bg-transparent hover:bg-[var(--theme-input-bg)]"
                                        }`}
                                    style={{
                                        background: filterType === f.key ? "linear-gradient(135deg, rgba(139,92,246,0.12), rgba(109,40,217,0.06))" : undefined,
                                        borderColor: filterType === f.key ? "rgba(139,92,246,0.3)" : "var(--theme-border)",
                                        color: filterType === f.key ? "#8B5CF6" : "var(--theme-text-muted)",
                                    }}
                                >
                                    <span className="text-[11px]">{f.icon}</span>
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* ═══ Loading State ═══ */}
                {loading && (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="rounded-2xl border bg-[var(--theme-card)] shadow-sm p-5 animate-pulse" style={{ borderColor: "var(--theme-border)" }}>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full" style={{ background: "var(--theme-input-bg)" }} />
                                    <div className="flex-1">
                                        <div className="h-3 w-28 rounded-full mb-2" style={{ background: "var(--theme-input-bg)" }} />
                                        <div className="h-2 w-16 rounded-full" style={{ background: "var(--theme-input-bg)" }} />
                                    </div>
                                    <div className="w-8 h-8 rounded-lg" style={{ background: "var(--theme-input-bg)" }} />
                                </div>
                                <div className="h-3 w-full rounded-full mb-2" style={{ background: "var(--theme-input-bg)" }} />
                                <div className="h-3 w-2/3 rounded-full mb-4" style={{ background: "var(--theme-input-bg)" }} />
                                <div className="h-48 w-full rounded-xl" style={{ background: "var(--theme-input-bg)" }} />
                            </div>
                        ))}
                    </div>
                )}

                {/* ═══ Empty State ═══ */}
                {!loading && posts.length === 0 && (
                    <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--theme-border)" }}>
                        {/* Animated gradient header */}
                        <div className="relative h-32 overflow-hidden" style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)" }}>
                            {/* Floating bookmark particles */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="relative">
                                    <div className="absolute -top-6 -left-10 text-2xl opacity-20 animate-bounce" style={{ animationDelay: "0s", animationDuration: "3s" }}>🔖</div>
                                    <div className="absolute -top-2 left-12 text-lg opacity-15 animate-bounce" style={{ animationDelay: "0.5s", animationDuration: "4s" }}>⭐</div>
                                    <div className="absolute top-4 -left-14 text-lg opacity-15 animate-bounce" style={{ animationDelay: "1s", animationDuration: "3.5s" }}>💎</div>
                                    <div className="absolute -top-4 left-20 text-xl opacity-10 animate-bounce" style={{ animationDelay: "1.5s", animationDuration: "4.5s" }}>📌</div>
                                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #8B5CF6, #6D28D9)", boxShadow: "0 0 30px rgba(139,92,246,0.4)" }}>
                                        <BookmarkFillIcon size={28} />
                                    </div>
                                </div>
                            </div>
                            {/* Gradient overlay */}
                            <div className="absolute bottom-0 left-0 right-0 h-12" style={{ background: "linear-gradient(to top, var(--theme-card), transparent)" }} />
                        </div>

                        <div className="px-6 pb-8 pt-2 text-center" style={{ background: "var(--theme-card)" }}>
                            <h2 className="text-[18px] font-bold mb-1" style={{ color: "var(--theme-text-primary)" }}>
                                Your collection is empty
                            </h2>
                            <p className="text-[12px] mb-5 max-w-xs mx-auto leading-relaxed" style={{ color: "var(--theme-text-muted)" }}>
                                Save interesting spills, code snippets, and job posts to revisit them anytime
                            </p>

                            {/* How it works mini-guide */}
                            <div className="flex flex-col gap-2.5 mb-6 max-w-xs mx-auto">
                                {[
                                    { icon: "🔖", text: "Tap the bookmark icon on any post", color: "#8B5CF6" },
                                    { icon: "📂", text: "Organize and search your saves here", color: "#3CF91A" },
                                    { icon: "⚡", text: "Quick access to your best finds", color: "#F59E0B" },
                                ].map((step, i) => (
                                    <div key={i} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-left" style={{ background: "var(--theme-input-bg)" }}>
                                        <span className="text-[18px] shrink-0">{step.icon}</span>
                                        <span className="text-[11px] font-medium" style={{ color: "var(--theme-text-secondary)" }}>{step.text}</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => router.back()}
                                className="px-6 py-2.5 rounded-xl text-[12px] font-bold border-none cursor-pointer text-white transition-all hover:scale-105 hover:shadow-lg"
                                style={{ background: "linear-gradient(135deg, #8B5CF6, #6D28D9)", boxShadow: "0 4px 15px rgba(139,92,246,0.3)" }}
                            >
                                <span className="flex items-center gap-1.5">
                                    <SparklesIcon /> Explore the Feed
                                </span>
                            </button>
                        </div>
                    </div>
                )}

                {/* ═══ Filtered Empty ═══ */}
                {!loading && posts.length > 0 && filteredPosts.length === 0 && (
                    <div className="rounded-2xl border p-8 text-center" style={{ borderColor: "var(--theme-border)", background: "var(--theme-card)" }}>
                        <p className="text-2xl mb-2">🔍</p>
                        <p className="text-[13px] font-semibold mb-1" style={{ color: "var(--theme-text-secondary)" }}>
                            No matching spills
                        </p>
                        <p className="text-[11px] mb-3" style={{ color: "var(--theme-text-muted)" }}>
                            Try a different search or filter
                        </p>
                        <button
                            onClick={() => { setSearchQuery(""); setFilterType("all"); }}
                            className="px-4 py-2 rounded-xl text-[11px] font-bold border cursor-pointer transition-all bg-transparent hover:bg-[var(--theme-input-bg)]"
                            style={{ borderColor: "var(--theme-border)", color: "#8B5CF6" }}
                        >
                            Clear Filters
                        </button>
                    </div>
                )}

                {/* ═══ Posts ═══ */}
                {!loading && filteredPosts.length > 0 && (
                    <>
                        {/* Results count */}
                        {(searchQuery || filterType !== "all") && (
                            <p className="text-[10px] font-medium mb-3" style={{ color: "var(--theme-text-muted)" }}>
                                Showing {filteredPosts.length} of {totalSaved} saved spills
                            </p>
                        )}

                        <div className={viewMode === "compact" ? "grid grid-cols-1 gap-3" : "space-y-4"}>
                            {filteredPosts.map(post => (
                                <div key={post.id} className={viewMode === "compact" ? "transform transition-all hover:scale-[1.01]" : ""}>
                                    <PostCard
                                        post={post}
                                        currentUserId={userData?.id}
                                        currentUserRole={userData?.role}
                                        onDeleted={(id) => setPosts(prev => prev.filter(p => p.id !== id))}
                                    />
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* Loading more */}
                {loadingMore && (
                    <div className="flex items-center justify-center gap-2 py-6">
                        <div className="w-5 h-5 border-2 border-[#8B5CF6] border-t-transparent rounded-full animate-spin" />
                        <span className="text-[11px] font-medium" style={{ color: "var(--theme-text-muted)" }}>Loading more...</span>
                    </div>
                )}

                {/* End state */}
                {!loading && !hasMore && filteredPosts.length > 0 && (
                    <div className="text-center py-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: "var(--theme-input-bg)" }}>
                            <span className="text-[14px]">✨</span>
                            <span className="text-[11px] font-semibold" style={{ color: "var(--theme-text-muted)" }}>
                                That&apos;s your entire collection
                            </span>
                        </div>
                    </div>
                )}

                {/* Sentinel */}
                <div ref={sentinelRef} className="h-4" />
            </div>
        </div>
    );
}
