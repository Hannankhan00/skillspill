"use client";
import React, { useState } from "react";
import Link from "next/link";
import CommentThread from "./CommentThread";

function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 30) return `${days}d ago`;
    return `${Math.floor(days / 30)}mo ago`;
}

function Avatar({ user, size = 40 }: { user: any; size?: number }) {
    const initials = user.fullName?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) || "??";
    if (user.avatarUrl) {
        return <img src={user.avatarUrl} alt={user.fullName} className="rounded-full object-cover" style={{ width: size, height: size }} />;
    }
    const bg = user.role === "RECRUITER" ? "linear-gradient(135deg, #A855F7, #7C3AED)" : "linear-gradient(135deg, #22C55E, #16A34A)";
    return (
        <div className="rounded-full flex items-center justify-center text-white font-bold shrink-0" style={{ width: size, height: size, background: bg, fontSize: size * 0.28 }}>
            {initials}
        </div>
    );
}

function ImageGrid({ media }: { media: any[] }) {
    const images = media.filter(m => m.mediaType === "image");
    if (images.length === 0) return null;
    if (images.length === 1) return <img src={images[0].url} alt="" className="w-full rounded-xl object-cover max-h-[500px]" />;
    if (images.length === 2) return (
        <div className="grid grid-cols-2 gap-1 rounded-xl overflow-hidden">
            {images.map((img, i) => <img key={i} src={img.url} alt="" className="w-full h-64 object-cover" />)}
        </div>
    );
    return (
        <div className="grid grid-cols-2 gap-1 rounded-xl overflow-hidden" style={{ gridTemplateRows: "200px 150px" }}>
            <img src={images[0].url} alt="" className="w-full h-full object-cover col-span-2" />
            {images.slice(1, 4).map((img, i) => (
                <div key={i} className="relative">
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                    {i === 2 && images.length > 4 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-lg">+{images.length - 4}</div>
                    )}
                </div>
            ))}
        </div>
    );
}

function CodeBlock({ code, lang }: { code: string; lang?: string }) {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); };
    return (
        <div className="rounded-xl bg-[#0D1117] border border-[#21262D] overflow-hidden">
            <div className="flex items-center justify-between px-3 py-1.5 bg-[#161B22] border-b border-[#21262D]">
                <span className="text-[10px] text-zinc-400 font-mono">{lang || "code"}</span>
                <button onClick={handleCopy} className="text-[9px] text-zinc-400 hover:text-zinc-200 cursor-pointer bg-transparent border-none">{copied ? "Copied!" : "Copy"}</button>
            </div>
            <pre className="px-3 py-3 text-[11px] sm:text-[12px] text-green-400 font-mono overflow-x-auto leading-relaxed m-0"><code>{code}</code></pre>
        </div>
    );
}

function GitHubCard({ post }: { post: any }) {
    return (
        <div className="rounded-xl p-4 border border-[var(--theme-border)]" style={{ background: "var(--theme-card)" }}>
            <div className="flex items-center gap-2 mb-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ color: "var(--theme-text-muted)" }}><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" /></svg>
                <span className="text-[14px] font-bold" style={{ color: "var(--theme-text-primary)" }}>{post.githubRepoName}</span>
            </div>
            {post.githubRepoDesc && <p className="text-[12px] mb-3" style={{ color: "var(--theme-text-muted)" }}>{post.githubRepoDesc}</p>}
            <div className="flex items-center gap-4 text-[11px]" style={{ color: "var(--theme-text-muted)" }}>
                {post.githubRepoLang && <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />{post.githubRepoLang}</span>}
                {post.githubRepoStars != null && <span>⭐ {post.githubRepoStars}</span>}
                {post.githubRepoForks != null && <span>🍴 {post.githubRepoForks}</span>}
            </div>
            {post.githubRepoUrl && (
                <a href={post.githubRepoUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium border border-[var(--theme-border)] bg-[var(--theme-card)] text-[var(--theme-text-tertiary)] hover:text-[#3CF91A] transition-all no-underline">
                    View on GitHub →
                </a>
            )}
        </div>
    );
}

function HiringCard({ post }: { post: any }) {
    const skills = post.hiringSkills || [];
    return (
        <div className="rounded-xl p-4 border border-teal-200 dark:border-teal-700" style={{ background: "linear-gradient(to bottom right, rgba(20,184,166,0.05), transparent)" }}>
            <p className="text-[15px] font-bold mb-2" style={{ color: "var(--theme-text-primary)" }}>{post.hiringTitle}</p>
            {skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                    {skills.map((s: string) => <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 font-medium">{s}</span>)}
                </div>
            )}
            <div className="flex flex-wrap gap-2 mb-3 text-[10px]">
                {post.hiringLocationType && <span className="px-2 py-0.5 rounded-full bg-[var(--theme-input-bg)] font-medium" style={{ color: "var(--theme-text-tertiary)" }}>📍 {post.hiringLocationType}</span>}
                {post.hiringCompType && <span className="px-2 py-0.5 rounded-full bg-[var(--theme-input-bg)] font-medium" style={{ color: "var(--theme-text-tertiary)" }}>💰 {post.hiringCompType}</span>}
                {post.hiringDeadline && <span className="px-2 py-0.5 rounded-full bg-[var(--theme-input-bg)] font-medium" style={{ color: "var(--theme-text-tertiary)" }}>⏰ {new Date(post.hiringDeadline).toLocaleDateString()}</span>}
            </div>
            <button className="px-4 py-2 rounded-xl text-[12px] font-bold border-none cursor-pointer text-white transition-all hover:scale-105" style={{ background: "linear-gradient(135deg, #14B8A6, #0D9488)", boxShadow: "0 0 15px rgba(20,184,166,0.3)" }}>
                Apply Now →
            </button>
        </div>
    );
}

export default function PostCard({ post, currentUserId, currentUserRole, onDeleted }: { post: any; currentUserId?: string; currentUserRole?: string; onDeleted?: (id: string) => void }) {
    const [liked, setLiked] = useState(post.isLiked);
    const [likesCount, setLikesCount] = useState(post.likesCount);
    const [saved, setSaved] = useState(post.isSaved);
    const [reposted, setReposted] = useState(post.isReposted);
    const [repostsCount, setRepostsCount] = useState(post.repostsCount);
    const [showComments, setShowComments] = useState(false);
    const [commentsCount, setCommentsCount] = useState(post.commentsCount);
    const [showMenu, setShowMenu] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [toast, setToast] = useState("");

    const isOwn = currentUserId === post.userId;
    const user = post.user;
    const hashtags: string[] = Array.isArray(post.hashtags) ? post.hashtags : [];
    const captionLong = post.caption && post.caption.length > 150;

    const toggleLike = async () => {
        setLiked(!liked); setLikesCount((c: number) => liked ? c - 1 : c + 1);
        try { await fetch(`/api/spill/posts/${post.id}/like`, { method: "POST" }); } catch { setLiked(liked); setLikesCount(likesCount); }
    };

    const toggleSave = async () => {
        setSaved(!saved);
        try { await fetch(`/api/spill/posts/${post.id}/save`, { method: "POST" }); } catch { setSaved(saved); }
    };

    const toggleRepost = async () => {
        setReposted(!reposted); setRepostsCount((c: number) => reposted ? c - 1 : c + 1);
        try { await fetch(`/api/spill/posts/${post.id}/repost`, { method: "POST" }); } catch { setReposted(reposted); setRepostsCount(repostsCount); }
    };

    const handleShare = () => {
        navigator.clipboard.writeText(`${window.location.origin}/feed?post=${post.id}`);
        setToast("Link copied!"); setTimeout(() => setToast(""), 2000);
    };

    const handleDelete = async () => {
        if (!confirm("Delete this post?")) return;
        try { await fetch(`/api/spill/posts/${post.id}`, { method: "DELETE" }); onDeleted?.(post.id); } catch { alert("Failed to delete"); }
    };

    return (
        <article className="rounded-2xl border bg-[var(--theme-card)] shadow-sm overflow-hidden transition-all hover:shadow-md" style={{ borderColor: "var(--theme-border)" }}>
            {/* Hiring banner */}
            {post.postType === "hiring" && (
                <div className="px-4 py-2 bg-gradient-to-r from-teal-500/10 to-transparent border-b border-teal-500/20 flex items-center gap-2">
                    <span className="text-[11px] font-bold text-teal-500">We&apos;re Hiring 🎯</span>
                </div>
            )}

            <div className="p-4 sm:p-5">
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <Link href={user.role === "TALENT" ? "/talent/profile" : "/recruiter/profile"}>
                            <Avatar user={user} size={40} />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <Link href={user.role === "TALENT" ? "/talent/profile" : "/recruiter/profile"} className="text-[13px] font-bold no-underline" style={{ color: "var(--theme-text-primary)" }}>{user.fullName}</Link>
                                <span className={`text-[9px] px-2 py-0.5 rounded-full font-semibold ${user.role === "TALENT" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" : "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400"}`}>
                                    {user.role === "TALENT" ? "Talent" : "Recruiter"}
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                {user.recruiterProfile?.companyName && <span className="text-[10px]" style={{ color: "var(--theme-text-muted)" }}>{user.recruiterProfile.companyName} · </span>}
                                <span className="text-[10px]" style={{ color: "var(--theme-text-muted)" }}>{timeAgo(post.createdAt)}</span>
                            </div>
                        </div>
                    </div>
                    {/* Three-dot menu */}
                    <div className="relative">
                        <button onClick={() => setShowMenu(!showMenu)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[var(--theme-input-bg)] cursor-pointer bg-transparent border-none transition-all" style={{ color: "var(--theme-text-muted)" }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" /></svg>
                        </button>
                        {showMenu && (
                            <div className="absolute right-0 top-10 w-44 rounded-xl shadow-xl py-1 z-20" style={{ background: "var(--theme-surface)", border: "1px solid var(--theme-border)" }}>
                                {isOwn ? (
                                    <>
                                        <button className="w-full px-4 py-2 text-left text-[12px] hover:bg-[var(--theme-input-bg)] bg-transparent border-none cursor-pointer" style={{ color: "var(--theme-text-tertiary)" }}>Edit caption</button>
                                        <button onClick={handleDelete} className="w-full px-4 py-2 text-left text-[12px] text-red-500 hover:bg-red-500/10 bg-transparent border-none cursor-pointer">Delete post</button>
                                    </>
                                ) : (
                                    <>
                                        <button className="w-full px-4 py-2 text-left text-[12px] hover:bg-[var(--theme-input-bg)] bg-transparent border-none cursor-pointer" style={{ color: "var(--theme-text-tertiary)" }}>Report post</button>
                                        <button className="w-full px-4 py-2 text-left text-[12px] hover:bg-[var(--theme-input-bg)] bg-transparent border-none cursor-pointer" style={{ color: "var(--theme-text-tertiary)" }}>Not interested</button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Caption */}
                {post.caption && (
                    <div className="mb-3">
                        <p className="text-[13px] leading-relaxed whitespace-pre-wrap" style={{ color: "var(--theme-text-secondary)" }}>
                            {captionLong && !expanded ? post.caption.slice(0, 150) + "..." : post.caption}
                        </p>
                        {captionLong && !expanded && (
                            <button onClick={() => setExpanded(true)} className="text-[12px] font-medium text-[#3CF91A] bg-transparent border-none cursor-pointer mt-1">see more</button>
                        )}
                    </div>
                )}

                {/* Hashtags */}
                {hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                        {hashtags.map((tag: string) => (
                            <Link key={tag} href={`/feed/tag/${tag}`} className="text-[10px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 font-medium no-underline hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors cursor-pointer">
                                #{tag}
                            </Link>
                        ))}
                    </div>
                )}

                {/* Content zone */}
                <div className="mb-3">
                    {post.postType === "image" && post.media?.length > 0 && <ImageGrid media={post.media} />}
                    {post.postType === "video" && post.videoUrl && (
                        <video controls className="w-full rounded-xl max-h-[500px]" poster={post.thumbnailUrl || undefined} preload="metadata"><source src={post.videoUrl} /></video>
                    )}
                    {post.postType === "code" && post.code && <CodeBlock code={post.code} lang={post.codeLang} />}
                    {post.postType === "github" && <GitHubCard post={post} />}
                    {post.postType === "hiring" && <HiringCard post={post} />}
                </div>

                {/* Interaction bar */}
                <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: "var(--theme-border-light)" }}>
                    <div className="flex items-center gap-1">
                        <button onClick={toggleLike} className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium bg-transparent border-none cursor-pointer transition-all hover:bg-[var(--theme-input-bg)] ${liked ? "text-red-500" : ""}`} style={liked ? {} : { color: "var(--theme-text-muted)" }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
                            {likesCount > 0 && likesCount}
                        </button>
                        <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium bg-transparent border-none cursor-pointer transition-all hover:bg-[var(--theme-input-bg)]" style={{ color: "var(--theme-text-muted)" }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                            {commentsCount > 0 && commentsCount}
                        </button>
                        <button onClick={toggleRepost} className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium bg-transparent border-none cursor-pointer transition-all hover:bg-[var(--theme-input-bg)] ${reposted ? "text-[#3CF91A]" : ""}`} style={reposted ? {} : { color: "var(--theme-text-muted)" }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" /></svg>
                            {repostsCount > 0 && repostsCount}
                        </button>
                        <button onClick={toggleSave} className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium bg-transparent border-none cursor-pointer transition-all hover:bg-[var(--theme-input-bg)] ${saved ? "text-yellow-500" : ""}`} style={saved ? {} : { color: "var(--theme-text-muted)" }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
                        </button>
                        <button onClick={handleShare} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium bg-transparent border-none cursor-pointer transition-all hover:bg-[var(--theme-input-bg)]" style={{ color: "var(--theme-text-muted)" }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                        </button>
                    </div>
                    <span className="text-[10px] flex items-center gap-1" style={{ color: "var(--theme-text-muted)" }}>👁 {post.viewsCount}</span>
                </div>

                {/* Comment thread */}
                {showComments && (
                    <CommentThread postId={post.id} commentsCount={commentsCount} onCountChange={setCommentsCount} />
                )}
            </div>

            {/* Toast */}
            {toast && (
                <div className="fixed bottom-24 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl text-[12px] font-medium text-white z-50 shadow-lg" style={{ background: "#333" }}>
                    {toast}
                </div>
            )}
        </article>
    );
}
