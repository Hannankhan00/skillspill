"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Send, Search, CheckCircle, Loader2 } from "lucide-react";

interface Follower {
    id: string;
    fullName: string;
    username: string;
    avatarUrl: string | null;
    role: string;
    talentProfile?: { experienceLevel?: string } | null;
    recruiterProfile?: { companyName?: string } | null;
}

interface ShareModalProps {
    postId: string;
    postCaption?: string;
    onClose: () => void;
}

function gradFor(str: string) {
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

export default function ShareModal({ postId, postCaption, onClose }: ShareModalProps) {
    const [followers, setFollowers] = useState<Follower[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [sending, setSending] = useState<Record<string, boolean>>({});
    const [sent, setSent] = useState<Record<string, boolean>>({});
    const [error, setError] = useState<string | null>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    /* fetch followers once */
    useEffect(() => {
        fetch("/api/user/followers")
            .then((r) => r.json())
            .then((d) => {
                setFollowers(d.followers ?? []);
                setLoading(false);
            })
            .catch(() => {
                setError("Could not load followers.");
                setLoading(false);
            });
    }, []);

    /* close on backdrop click */
    const handleOverlay = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === overlayRef.current) onClose();
    };

    /* close on Escape */
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose]);

    const shareWithUser = async (follower: Follower) => {
        if (sending[follower.id] || sent[follower.id]) return;
        setSending((p) => ({ ...p, [follower.id]: true }));
        try {
            /* 1. get or create conversation */
            const convRes = await fetch("/api/conversations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ targetUserId: follower.id }),
            });
            const convData = await convRes.json();
            if (!convRes.ok) throw new Error(convData.error ?? "Failed");

            const convoId = convData.conversation.id;

            /* 2. send message with post link */
            const postUrl = `${window.location.origin}/feed/post/${postId}`;
            const msgText = postCaption
                ? `📢 Check out this spill: "${postCaption.slice(0, 60)}${postCaption.length > 60 ? "…" : ""}"\n${postUrl}`
                : `📢 Check out this spill!\n${postUrl}`;

            const msgRes = await fetch(`/api/conversations/${convoId}/messages`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: msgText }),
            });
            if (!msgRes.ok) throw new Error("Message failed");

            setSent((p) => ({ ...p, [follower.id]: true }));
        } catch {
            /* silently fail — button resets */
        } finally {
            setSending((p) => ({ ...p, [follower.id]: false }));
        }
    };

    const filtered = followers.filter(
        (f) =>
            f.fullName.toLowerCase().includes(search.toLowerCase()) ||
            f.username.toLowerCase().includes(search.toLowerCase())
    );

    const subtitleFor = (f: Follower) => {
        if (f.role === "RECRUITER" && f.recruiterProfile?.companyName)
            return `@ ${f.recruiterProfile.companyName}`;
        if (f.talentProfile?.experienceLevel)
            return f.talentProfile.experienceLevel.charAt(0) + f.talentProfile.experienceLevel.slice(1).toLowerCase() + " Dev";
        return f.role === "TALENT" ? "Developer" : "Recruiter";
    };

    return (
        <div
            ref={overlayRef}
            onClick={handleOverlay}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
            style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)" }}
        >
            <div
                className="w-full sm:max-w-[420px] rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-300"
                style={{
                    background: "var(--theme-card)",
                    border: "1px solid var(--theme-border)",
                    maxHeight: "80vh",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {/* ── Header ── */}
                <div
                    className="flex items-center justify-between px-5 py-4 shrink-0"
                    style={{ borderBottom: "1px solid var(--theme-border)" }}
                >
                    <div>
                        <h2 className="text-[15px] font-bold text-(--theme-text-primary)">Share Spill</h2>
                        <p className="text-[11px] text-(--theme-text-muted) mt-0.5">
                            Send to one of your followers
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full flex items-center justify-center bg-transparent border border-(--theme-border) text-(--theme-text-muted) hover:text-(--theme-text-primary) hover:bg-(--theme-bg-secondary) transition-all cursor-pointer"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* ── Search ── */}
                <div className="px-4 py-3 shrink-0" style={{ borderBottom: "1px solid var(--theme-border)" }}>
                    <div
                        className="flex items-center gap-2 px-3 py-2 rounded-xl"
                        style={{ background: "var(--theme-input-bg)", border: "1px solid var(--theme-border)" }}
                    >
                        <Search className="w-3.5 h-3.5 shrink-0 text-(--theme-text-muted)" />
                        <input
                            type="text"
                            placeholder="Search followers..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="flex-1 bg-transparent border-none outline-none text-[13px] text-(--theme-text-primary) placeholder:text-(--theme-text-muted)"
                            autoFocus
                        />
                        {search && (
                            <button
                                onClick={() => setSearch("")}
                                className="text-(--theme-text-muted) hover:text-(--theme-text-primary) bg-transparent border-none cursor-pointer p-0 flex items-center"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        )}
                    </div>
                </div>

                {/* ── Followers list (scrollable) ── */}
                <div
                    className="flex-1 overflow-y-auto"
                    style={{ scrollbarWidth: "thin", scrollbarColor: "var(--theme-scrollbar-thumb) transparent" }}
                >
                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <Loader2 className="w-6 h-6 animate-spin text-(--theme-text-muted)" />
                        </div>
                    ) : error ? (
                        <p className="text-center text-[13px] text-red-400 py-10">{error}</p>
                    ) : filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-14 gap-2">
                            <div className="w-12 h-12 rounded-full bg-(--theme-bg-secondary) flex items-center justify-center">
                                <Search className="w-5 h-5 text-(--theme-text-muted)" />
                            </div>
                            <p className="text-[13px] font-medium text-(--theme-text-muted)">
                                {search ? "No followers match your search" : "You have no followers yet"}
                            </p>
                        </div>
                    ) : (
                        <ul className="py-1">
                            {filtered.map((f) => {
                                const isSending = sending[f.id];
                                const isSent = sent[f.id];
                                const initials = f.fullName
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()
                                    .slice(0, 2);
                                const grad = gradFor(f.fullName);

                                return (
                                    <li
                                        key={f.id}
                                        className="flex items-center gap-3 px-4 py-3 hover:bg-(--theme-bg-secondary) transition-colors"
                                    >
                                        {/* Avatar */}
                                        {f.avatarUrl ? (
                                            <img
                                                src={f.avatarUrl}
                                                alt={f.fullName}
                                                className="w-10 h-10 rounded-full object-cover shrink-0"
                                            />
                                        ) : (
                                            <div
                                                className={`w-10 h-10 rounded-full bg-linear-to-br ${grad} flex items-center justify-center text-white text-[11px] font-bold shrink-0`}
                                            >
                                                {initials}
                                            </div>
                                        )}

                                        {/* Name */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[13px] font-semibold text-(--theme-text-primary) truncate">
                                                {f.fullName}
                                            </p>
                                            <p className="text-[11px] text-(--theme-text-muted) truncate">
                                                @{f.username} · {subtitleFor(f)}
                                            </p>
                                        </div>

                                        {/* Send button */}
                                        <button
                                            onClick={() => shareWithUser(f)}
                                            disabled={isSending || isSent}
                                            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all border-none cursor-pointer disabled:cursor-default"
                                            style={
                                                isSent
                                                    ? { background: "rgba(60,249,26,0.1)", color: "#3CF91A", border: "1px solid rgba(60,249,26,0.3)" }
                                                    : { background: "var(--theme-bg-secondary)", color: "var(--theme-text-primary)", border: "1px solid var(--theme-border)" }
                                            }
                                        >
                                            {isSending ? (
                                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                            ) : isSent ? (
                                                <>
                                                    <CheckCircle className="w-3.5 h-3.5" />
                                                    Sent
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-3.5 h-3.5" />
                                                    Send
                                                </>
                                            )}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>

                {/* ── Footer count ── */}
                {!loading && filtered.length > 0 && (
                    <div
                        className="px-5 py-3 shrink-0 text-center"
                        style={{ borderTop: "1px solid var(--theme-border)" }}
                    >
                        <p className="text-[10px] text-(--theme-text-muted)">
                            {filtered.length} follower{filtered.length !== 1 ? "s" : ""}
                            {search && ` matching "${search}"`}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
