"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
}

function CommentAvatar({ user, size = 28 }: { user: any; size?: number }) {
    const initials = user.fullName?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) || "??";
    if (user.avatarUrl) {
        return (
            <img
                src={user.avatarUrl}
                alt={user.fullName}
                className="rounded-full object-cover shrink-0"
                style={{ width: size, height: size }}
            />
        );
    }
    const bg = user.role === "RECRUITER"
        ? "linear-gradient(135deg, #A855F7, #7C3AED)"
        : "linear-gradient(135deg, #22C55E, #16A34A)";
    return (
        <div
            className="rounded-full flex items-center justify-center shrink-0 text-white font-bold"
            style={{ width: size, height: size, background: bg, fontSize: size * 0.3 }}
        >
            {initials}
        </div>
    );
}

function getProfileLink(user: any, viewerRole: string) {
    // If the viewer is on the talent side
    if (viewerRole === "TALENT") {
        if (user.role === "TALENT") return `/talent/talent/${user.id}`;
        return `/talent/recruiter/${user.id}`;
    }
    // If the viewer is on the recruiter side
    if (user.role === "TALENT") return `/recruiter/talent/${user.id}`;
    return `/recruiter/recruiter/${user.id}`;
}

interface SingleCommentProps {
    comment: any;
    depth: number;
    viewerRole: string;
    currentUserId?: string;
    onReply: (commentId: string, username: string) => void;
    onDelete: (commentId: string) => void;
}

function SingleComment({ comment, depth, viewerRole, currentUserId, onReply, onDelete }: SingleCommentProps) {
    const [showReplies, setShowReplies] = useState(depth < 1);
    const replies = comment.replies || [];
    const hasReplies = replies.length > 0;
    const isOwn = currentUserId === comment.userId;
    const maxDepth = 2;

    return (
        <div className={`${depth > 0 ? "ml-5 pl-3 border-l-2" : ""}`}
            style={depth > 0 ? { borderColor: "var(--theme-border-light)" } : {}}>
            <div className="flex gap-2.5 mb-2 group">
                {/* Avatar */}
                <Link href={getProfileLink(comment.user, viewerRole)} className="shrink-0">
                    <CommentAvatar user={comment.user} size={depth > 0 ? 24 : 28} />
                </Link>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="rounded-xl px-3 py-2" style={{ background: "var(--theme-input-bg)" }}>
                        <div className="flex items-center gap-2 mb-0.5">
                            <Link
                                href={getProfileLink(comment.user, viewerRole)}
                                className="text-[11px] font-semibold no-underline hover:underline transition-all"
                                style={{ color: "var(--theme-text-primary)" }}
                            >
                                {comment.user.fullName}
                            </Link>
                            <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-semibold ${
                                comment.user.role === "RECRUITER"
                                    ? "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
                                    : "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                            }`}>
                                {comment.user.role === "RECRUITER" ? "Recruiter" : "Talent"}
                            </span>
                        </div>
                        <p className="text-[12px] leading-relaxed" style={{ color: "var(--theme-text-secondary)" }}>
                            {comment.content}
                        </p>
                    </div>
                    {/* Action row */}
                    <div className="flex items-center gap-3 mt-1 ml-1">
                        <span className="text-[9px]" style={{ color: "var(--theme-text-muted)" }}>
                            {timeAgo(comment.createdAt)}
                        </span>
                        {depth < maxDepth && (
                            <button
                                onClick={() => onReply(comment.id, comment.user.fullName)}
                                className="text-[10px] font-semibold bg-transparent border-none cursor-pointer hover:underline transition-all"
                                style={{ color: "var(--theme-text-muted)" }}
                            >
                                Reply
                            </button>
                        )}
                        {isOwn && (
                            <button
                                onClick={() => onDelete(comment.id)}
                                className="text-[10px] font-medium bg-transparent border-none cursor-pointer text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-all"
                            >
                                Delete
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Replies */}
            {hasReplies && (
                <>
                    {!showReplies ? (
                        <button
                            onClick={() => setShowReplies(true)}
                            className="flex items-center gap-1.5 ml-9 mb-2 text-[10px] font-semibold bg-transparent border-none cursor-pointer transition-all"
                            style={{ color: "#3CF91A" }}
                        >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="6 9 12 15 18 9" />
                            </svg>
                            View {replies.length} {replies.length === 1 ? "reply" : "replies"}
                        </button>
                    ) : (
                        <div className="mt-1">
                            {replies.map((reply: any) => (
                                <SingleComment
                                    key={reply.id}
                                    comment={reply}
                                    depth={depth + 1}
                                    viewerRole={viewerRole}
                                    currentUserId={currentUserId}
                                    onReply={onReply}
                                    onDelete={onDelete}
                                />
                            ))}
                            {replies.length > 2 && showReplies && (
                                <button
                                    onClick={() => setShowReplies(false)}
                                    className="flex items-center gap-1.5 ml-9 mb-2 text-[10px] font-semibold bg-transparent border-none cursor-pointer transition-all"
                                    style={{ color: "var(--theme-text-muted)" }}
                                >
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="18 15 12 9 6 15" />
                                    </svg>
                                    Hide replies
                                </button>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

interface CommentThreadProps {
    postId: string;
    commentsCount: number;
    onCountChange: (n: number) => void;
    currentUserRole?: string;
    currentUserId?: string;
}

export default function CommentThread({ postId, commentsCount, onCountChange, currentUserRole, currentUserId }: CommentThreadProps) {
    const [comments, setComments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAll, setShowAll] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [sending, setSending] = useState(false);
    const [replyTo, setReplyTo] = useState<{ id: string; name: string } | null>(null);

    const viewerRole = currentUserRole || "TALENT";

    useEffect(() => {
        fetch(`/api/spill/posts/${postId}/comments`)
            .then(r => r.json())
            .then(d => { if (d.comments) setComments(d.comments); })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [postId]);

    const handleReply = (commentId: string, username: string) => {
        setReplyTo({ id: commentId, name: username });
        setNewComment("");
        // Focus the input
        setTimeout(() => {
            const input = document.getElementById(`comment-input-${postId}`);
            if (input) input.focus();
        }, 50);
    };

    const cancelReply = () => {
        setReplyTo(null);
        setNewComment("");
    };

    const handleSubmit = async () => {
        if (!newComment.trim() || sending) return;
        setSending(true);
        try {
            const body: any = { content: newComment.trim() };
            if (replyTo) body.parentId = replyTo.id;

            const res = await fetch(`/api/spill/posts/${postId}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            const data = await res.json();
            if (data.comment) {
                if (replyTo) {
                    // Add reply to the appropriate parent
                    const addReplyToTree = (list: any[]): any[] =>
                        list.map(c => {
                            if (c.id === replyTo.id) {
                                return { ...c, replies: [...(c.replies || []), data.comment] };
                            }
                            if (c.replies?.length) {
                                return { ...c, replies: addReplyToTree(c.replies) };
                            }
                            return c;
                        });
                    setComments(prev => addReplyToTree(prev));
                } else {
                    setComments(prev => [...prev, { ...data.comment, replies: [] }]);
                }
                setNewComment("");
                setReplyTo(null);
                onCountChange(commentsCount + 1);
            }
        } catch (e) { console.error(e); }
        setSending(false);
    };

    const handleDelete = async (commentId: string) => {
        try {
            await fetch(`/api/spill/comments/${commentId}`, { method: "DELETE" });
            // Remove from tree
            const removeFromTree = (list: any[]): any[] =>
                list
                    .filter(c => c.id !== commentId)
                    .map(c => ({
                        ...c,
                        replies: c.replies ? removeFromTree(c.replies) : [],
                    }));
            setComments(prev => removeFromTree(prev));
            onCountChange(commentsCount - 1);
        } catch (e) { console.error(e); }
    };

    const displayedComments = showAll ? comments : comments.slice(0, 3);

    return (
        <div className="mt-3 pt-3 border-t" style={{ borderColor: "var(--theme-border-light)" }}>
            {loading ? (
                <div className="flex justify-center py-3">
                    <div className="w-4 h-4 border-2 border-[#3CF91A] border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <>
                    {/* Comments list */}
                    <div className="space-y-1">
                        {displayedComments.map(c => (
                            <SingleComment
                                key={c.id}
                                comment={c}
                                depth={0}
                                viewerRole={viewerRole}
                                currentUserId={currentUserId}
                                onReply={handleReply}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>

                    {!showAll && comments.length > 3 && (
                        <button
                            onClick={() => setShowAll(true)}
                            className="text-[11px] font-medium bg-transparent border-none cursor-pointer mb-3 mt-1 transition-all hover:underline"
                            style={{ color: "#3CF91A" }}
                        >
                            View all {comments.length} comments
                        </button>
                    )}

                    {/* Reply indicator */}
                    {replyTo && (
                        <div className="flex items-center gap-2 mb-1.5 ml-1">
                            <span className="text-[10px]" style={{ color: "var(--theme-text-muted)" }}>
                                Replying to <strong style={{ color: "var(--theme-text-primary)" }}>{replyTo.name}</strong>
                            </span>
                            <button
                                onClick={cancelReply}
                                className="text-[10px] text-red-400 hover:text-red-300 bg-transparent border-none cursor-pointer font-medium"
                            >
                                ✕ Cancel
                            </button>
                        </div>
                    )}

                    {/* Comment input */}
                    <div className="flex gap-2 items-center">
                        <input
                            id={`comment-input-${postId}`}
                            value={newComment}
                            onChange={e => setNewComment(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && handleSubmit()}
                            placeholder={replyTo ? `Reply to ${replyTo.name}...` : "Add a comment..."}
                            maxLength={500}
                            className="flex-1 px-3 py-2 rounded-xl text-[12px] bg-(--theme-input-bg) border border-(--theme-border) outline-none focus:border-[#3CF91A] transition-colors"
                            style={{ color: "var(--theme-text-primary)" }}
                        />
                        <button onClick={handleSubmit} disabled={!newComment.trim() || sending}
                            className="px-3 py-2 rounded-xl text-[11px] font-bold border-none cursor-pointer text-black disabled:opacity-40 transition-all"
                            style={{ background: "#3CF91A" }}>
                            {sending ? "..." : replyTo ? "Reply" : "Send"}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
