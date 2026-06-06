"use client";

import React, { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SpillFeedPage from "@/app/feed/page";
import PostCard from "@/app/feed/components/PostCard";

export default function PostDetailPage({ params }: { params: Promise<{ postId: string }> }) {
    const { postId } = use(params);
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [userData, setUserData] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        Promise.all([
            fetch(`/api/spill/posts/${postId}`).then(r => r.json()),
            fetch("/api/user/profile").then(r => r.json()),
        ]).then(([postData, uData]) => {
            if (postData.post) setPost(postData.post);
            else setNotFound(true);
            if (uData.user) setUserData(uData.user);
        }).catch(() => setNotFound(true))
          .finally(() => setLoading(false));
    }, [postId]);

    // Lock background scroll while modal is open
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    const handleClose = () => router.push("/feed");

    return (
        <div>
            {/* Feed visible in background, non-interactive */}
            <div className="pointer-events-none select-none" aria-hidden="true">
                <SpillFeedPage />
            </div>

            {/* Modal overlay */}
            <div
                className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-6 px-4"
                style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(3px)" }}
                onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
            >
                <div className="w-full max-w-2xl relative mb-8">
                    {/* Close button */}
                    <div className="flex items-center gap-3 mb-3">
                        <button
                            onClick={handleClose}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-[12px] font-semibold cursor-pointer border transition-all hover:scale-105"
                            style={{ background: "var(--theme-card)", borderColor: "var(--theme-border)", color: "var(--theme-text-muted)" }}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <polyline points="15 18 9 12 15 6" />
                            </svg>
                            Back to Feed
                        </button>
                    </div>

                    {loading ? (
                        <div className="rounded-2xl border p-5 animate-pulse" style={{ background: "var(--theme-card)", borderColor: "var(--theme-border)" }}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full" style={{ background: "var(--theme-input-bg)" }} />
                                <div className="flex-1 space-y-2">
                                    <div className="h-3 w-28 rounded" style={{ background: "var(--theme-input-bg)" }} />
                                    <div className="h-2 w-16 rounded" style={{ background: "var(--theme-input-bg)" }} />
                                </div>
                            </div>
                            <div className="space-y-2 mb-4">
                                <div className="h-3 w-full rounded" style={{ background: "var(--theme-input-bg)" }} />
                                <div className="h-3 w-4/5 rounded" style={{ background: "var(--theme-input-bg)" }} />
                                <div className="h-3 w-3/5 rounded" style={{ background: "var(--theme-input-bg)" }} />
                            </div>
                            <div className="h-32 w-full rounded-xl" style={{ background: "var(--theme-input-bg)" }} />
                        </div>
                    ) : notFound ? (
                        <div className="rounded-2xl border p-10 text-center" style={{ background: "var(--theme-card)", borderColor: "var(--theme-border)" }}>
                            <p className="text-4xl mb-3">😕</p>
                            <p className="text-[15px] font-bold mb-1" style={{ color: "var(--theme-text-secondary)" }}>Post not found</p>
                            <p className="text-[12px] mb-5" style={{ color: "var(--theme-text-muted)" }}>This post may have been deleted or is unavailable.</p>
                            <button
                                onClick={handleClose}
                                className="px-5 py-2.5 rounded-xl text-[12px] font-bold border-none cursor-pointer text-black hover:scale-105 transition-all"
                                style={{ background: "#3CF91A", boxShadow: "0 0 15px #3CF91A40" }}
                            >
                                Back to Feed
                            </button>
                        </div>
                    ) : (
                        <PostCard
                            post={post}
                            currentUserId={userData?.id}
                            currentUserRole={userData?.role}
                            onDeleted={handleClose}
                            initialShowComments
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
