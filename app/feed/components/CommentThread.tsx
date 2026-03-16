"use client";
import React, { useState, useEffect } from "react";

function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
}

export default function CommentThread({ postId, commentsCount, onCountChange }: { postId: string; commentsCount: number; onCountChange: (n: number) => void }) {
    const [comments, setComments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAll, setShowAll] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [sending, setSending] = useState(false);

    useEffect(() => {
        fetch(`/api/spill/posts/${postId}/comments`)
            .then(r => r.json())
            .then(d => { if (d.comments) setComments(d.comments); })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [postId]);

    const handleSubmit = async () => {
        if (!newComment.trim() || sending) return;
        setSending(true);
        try {
            const res = await fetch(`/api/spill/posts/${postId}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: newComment.trim() }),
            });
            const data = await res.json();
            if (data.comment) {
                setComments(prev => [...prev, data.comment]);
                setNewComment("");
                onCountChange(commentsCount + 1);
            }
        } catch (e) { console.error(e); }
        setSending(false);
    };

    const handleDelete = async (commentId: string) => {
        try {
            await fetch(`/api/spill/comments/${commentId}`, { method: "DELETE" });
            setComments(prev => prev.filter(c => c.id !== commentId));
            onCountChange(commentsCount - 1);
        } catch (e) { console.error(e); }
    };

    const displayedComments = showAll ? comments : comments.slice(0, 2);

    return (
        <div className="mt-3 pt-3 border-t" style={{ borderColor: "var(--theme-border-light)" }}>
            {loading ? (
                <div className="flex justify-center py-3">
                    <div className="w-4 h-4 border-2 border-[#3CF91A] border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <>
                    {displayedComments.map(c => (
                        <div key={c.id} className="flex gap-2.5 mb-3">
                            <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[8px] font-bold text-white"
                                style={{ background: c.user.role === "RECRUITER" ? "linear-gradient(135deg, #A855F7, #7C3AED)" : "linear-gradient(135deg, #22C55E, #16A34A)" }}>
                                {c.user.fullName?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="text-[11px] font-semibold" style={{ color: "var(--theme-text-primary)" }}>{c.user.fullName}</span>
                                    <span className="text-[9px]" style={{ color: "var(--theme-text-muted)" }}>{timeAgo(c.createdAt)}</span>
                                </div>
                                <p className="text-[12px] mt-0.5" style={{ color: "var(--theme-text-secondary)" }}>{c.content}</p>
                            </div>
                            <button onClick={() => handleDelete(c.id)} className="text-[9px] opacity-0 hover:opacity-100 focus:opacity-100 bg-transparent border-none cursor-pointer text-red-400 transition-opacity self-start mt-1 shrink-0">✕</button>
                        </div>
                    ))}

                    {!showAll && comments.length > 2 && (
                        <button onClick={() => setShowAll(true)} className="text-[11px] font-medium text-[#3CF91A] bg-transparent border-none cursor-pointer mb-3">
                            View all {comments.length} comments
                        </button>
                    )}

                    {/* Comment input */}
                    <div className="flex gap-2 items-center">
                        <input
                            value={newComment}
                            onChange={e => setNewComment(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && handleSubmit()}
                            placeholder="Add a comment..."
                            maxLength={500}
                            className="flex-1 px-3 py-2 rounded-xl text-[12px] bg-[var(--theme-input-bg)] border border-[var(--theme-border)] outline-none focus:border-[#3CF91A] transition-colors"
                            style={{ color: "var(--theme-text-primary)" }}
                        />
                        <button onClick={handleSubmit} disabled={!newComment.trim() || sending}
                            className="px-3 py-2 rounded-xl text-[11px] font-bold border-none cursor-pointer text-black disabled:opacity-40 transition-all"
                            style={{ background: "#3CF91A" }}>
                            {sending ? "..." : "Send"}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
