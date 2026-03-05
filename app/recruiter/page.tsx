"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Briefcase, Target, BarChart2 } from "lucide-react";

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

/* ── Mock Data ── */
const feedPosts = [
    {
        id: 1, username: "Sarah_Codes", role: "Full-Stack Engineer",
        initials: "SC", grad: "from-violet-500 to-purple-600",
        time: "25m", verified: true,
        content: "Just shipped a recursive search optimizer in Rust — 24% latency reduction using zero-cost abstractions. Sometimes the compiler really is your best friend.\n\nHere's the core function:",
        code: `fn optimized_search<T: PartialEq>(data: &[T], query: &T) -> Option<usize> {
    data.iter().position(|item| item == query)
}

// Benchmark: 0.8ms avg on 1M items
// Previous: 1.05ms — 24% improvement`,
        codeLang: "rust",
        tags: ["Rust", "Performance", "Algorithms"],
        likes: 128, comments: 24, shares: 8, liked: false, saved: false,
        matchScore: 94,
    },
    {
        id: 2, username: "Neon_Cipher", role: "Web3 Developer",
        initials: "NC", grad: "from-amber-400 to-orange-500",
        time: "2h", verified: true,
        content: "New smart contract for the bounty system is live on testnet. Audits coming back clean! Gas costs down 40% from the previous iteration.\n\nNo CV needed, just prove your skills on-chain. That's the future of hiring.",
        code: null, codeLang: null,
        tags: ["Web3", "Solidity", "Smart Contracts"],
        likes: 87, comments: 15, shares: 12, liked: true, saved: false,
        matchScore: null,
    },
    {
        id: 3, username: "Zero_Day", role: "Systems Engineer",
        initials: "ZD", grad: "from-cyan-400 to-blue-600",
        time: "4h", verified: false,
        content: "Built a real-time collaboration engine using WebSockets + CRDTs. Zero merge conflicts in live editing sessions.\n\nThe trick was using a last-writer-wins strategy with vector clocks for causal ordering:",
        code: `const syncEngine = new CRDTEngine({
  strategy: 'last-writer-wins',
  vectorClock: true,
  transport: new WSTransport(url),
  onConflict: (local, remote) => {
    return merge(local, remote, { preserveIntent: true });
  }
});`,
        codeLang: "typescript",
        tags: ["TypeScript", "WebSockets", "Distributed"],
        likes: 203, comments: 41, shares: 28, liked: false, saved: false,
        matchScore: 89,
    },
    {
        id: 4, username: "Data_Witch", role: "ML Engineer",
        initials: "DW", grad: "from-emerald-400 to-teal-500",
        time: "6h", verified: true,
        content: "Trained a transformer model that predicts skill compatibility between developers and projects. 94% accuracy after fine-tuning on SkillSpill data.\n\nThe model looks at code patterns, not CVs. Skills > Credentials every time.",
        code: `model = SkillTransformer(
    n_heads=8, d_model=512,
    skill_vocab=48203,
    max_seq_len=128
)
# Fine-tuned on 12,847 dev profiles
# Accuracy: 94.2% | F1: 0.91`,
        codeLang: "python",
        tags: ["Python", "ML", "Transformers"],
        likes: 312, comments: 56, shares: 45, liked: false, saved: false,
        matchScore: 91,
    },
    {
        id: 5, username: "Pixel_Punk", role: "Frontend Developer",
        initials: "PP", grad: "from-pink-400 to-rose-500",
        time: "8h", verified: false,
        content: "Recreated the entire iOS lock screen in pure CSS. No JavaScript. No images. Just 847 lines of carefully crafted gradients and animations.\n\nMy brain hurts but the dopamine is real.",
        code: null, codeLang: null,
        tags: ["CSS", "UI", "Creative Coding"],
        likes: 456, comments: 78, shares: 92, liked: false, saved: false,
        matchScore: null,
    },
];

const activeJobs = [
    { title: "Senior React Developer", type: "Full-time", apps: 12, budget: "$8k", days: 5, hot: true },
    { title: "Rust Systems Engineer", type: "Contract", apps: 7, budget: "$12k", days: 12, hot: false },
    { title: "DevOps Lead", type: "Full-time", apps: 19, budget: "$10k", days: 2, hot: true },
];

const topCandidates = [
    { name: "Sarah Chen", role: "Full-Stack", initials: "SC", grad: "from-violet-500 to-purple-600", score: 94 },
    { name: "Marcus Johnson", role: "Backend", initials: "MJ", grad: "from-sky-400 to-blue-500", score: 91 },
    { name: "Aisha Patel", role: "ML Eng", initials: "AP", grad: "from-emerald-400 to-teal-500", score: 89 },
];

const skillDemand = [
    { name: "React", demand: 92, color: "#8B5CF6" },
    { name: "Rust", demand: 78, color: "#6366F1" },
    { name: "TypeScript", demand: 88, color: "#0EA5E9" },
    { name: "Python", demand: 85, color: "#16A34A" },
];

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• MAIN FEED â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
export default function RecruiterFeed() {
    const [feedTab, setFeedTab] = useState("Discover");
    const [composerText, setComposerText] = useState("");
    const [likedPosts, setLikedPosts] = useState<Record<number, boolean>>({ 2: true });
    const [savedPosts, setSavedPosts] = useState<Record<number, boolean>>({});

    const toggleLike = (id: number) => setLikedPosts(p => ({ ...p, [id]: !p[id] }));
    const toggleSave = (id: number) => setSavedPosts(p => ({ ...p, [id]: !p[id] }));

    const tabs = ["Discover", "My Network", "Trending", "Code", "Saved"];

    return (
        <div style={{ background: "var(--theme-bg)" }} className="min-h-full">
            <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-4 pb-24 lg:pb-8">
                <div className="flex flex-col lg:flex-row gap-6">

                    {/* â•â•â•â•â•â•â•â• MAIN FEED â•â•â•â•â•â•â•â• */}
                    <div className="flex-1 min-w-0 space-y-4">

                        {/* ── Composer ── */}
                        <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm p-4">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-violet-600 flex items-center justify-center text-white text-[11px] font-bold shadow-md shrink-0">
                                    RC
                                </div>
                                <div className="flex-1">
                                    <textarea
                                        placeholder="Share an update, post a job, or spill some knowledge..."
                                        value={composerText}
                                        onChange={(e) => setComposerText(e.target.value)}
                                        className="w-full bg-[var(--theme-bg-secondary)] border border-[var(--theme-border)] rounded-xl px-4 py-3 text-[13px] text-[var(--theme-text-secondary)] placeholder:text-[var(--theme-text-muted)] resize-none outline-none focus:border-[#A855F7]/40 focus:ring-2 focus:ring-purple-50 transition-all"
                                        rows={2}
                                    />
                                    <div className="flex items-center justify-between mt-3">
                                        <div className="flex items-center gap-2">
                                            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium text-[var(--theme-text-muted)] hover:text-[var(--theme-text-tertiary)] hover:bg-[var(--theme-bg-secondary)] transition-all bg-transparent border-none cursor-pointer">
                                                <CodeIcon /> Code
                                            </button>
                                            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium text-[var(--theme-text-muted)] hover:text-[var(--theme-text-tertiary)] hover:bg-[var(--theme-bg-secondary)] transition-all bg-transparent border-none cursor-pointer">
                                                <ImageIcon /> Image
                                            </button>
                                            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium text-purple-400 hover:text-[#A855F7] hover:bg-[#A855F7]/10 transition-all bg-transparent border-none cursor-pointer">
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                                                Job Post
                                            </button>
                                        </div>
                                        <button
                                            className={`px-5 py-2 rounded-xl text-[12px] font-bold uppercase tracking-wider border-none cursor-pointer transition-all duration-200 ${composerText.trim()
                                                ? "bg-purple-600 text-white hover:bg-purple-700 shadow-md shadow-purple-200"
                                                : "bg-[var(--theme-input-bg)] text-[var(--theme-text-muted)] cursor-default"
                                                }`}
                                            disabled={!composerText.trim()}
                                        >
                                            Post <Sparkles className="inline-block w-3.5 h-3.5 ml-1 flex-shrink-0" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── Feed Tabs ── */}
                        <div className="flex items-center gap-1 px-1 overflow-x-auto">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setFeedTab(tab)}
                                    className={`px-4 py-2 rounded-xl text-[12px] font-semibold transition-all duration-200 border-none cursor-pointer whitespace-nowrap
                                        ${feedTab === tab
                                            ? "bg-[var(--theme-card)] text-[var(--theme-text-primary)] shadow-sm"
                                            : "bg-transparent text-[var(--theme-text-muted)] hover:text-[var(--theme-text-tertiary)] hover:bg-[var(--theme-card)]/50"
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* ── Posts ── */}
                        {feedPosts.map((post) => {
                            const isLiked = likedPosts[post.id] ?? post.liked;
                            const isSaved = savedPosts[post.id] ?? post.saved;
                            return (
                                <article key={post.id} className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                                    {/* Header */}
                                    <div className="flex items-center justify-between px-5 pt-4 pb-2">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${post.grad} flex items-center justify-center text-white text-[11px] font-bold shadow-md`}>
                                                {post.initials}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-[13px] font-bold text-[var(--theme-text-primary)]">{post.username}</span>
                                                    {post.verified && (
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="#8B5CF6"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#fff" strokeWidth="2" /></svg>
                                                    )}
                                                    {post.matchScore && (
                                                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#A855F7]/10 text-[#A855F7] border border-[#A855F7]/20 font-bold"
                                                            style={{ fontFamily: "var(--font-jetbrains-mono)" }}>
                                                            {post.matchScore}% match
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-[11px] text-[var(--theme-text-muted)]">
                                                    {post.role} • <span style={{ fontFamily: "var(--font-jetbrains-mono)" }}>{post.time} ago</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {post.matchScore && (
                                                <button className="px-3 py-1 rounded-lg text-[10px] font-bold text-[#A855F7] border border-[#A855F7]/30 bg-[#A855F7]/10 cursor-pointer hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-all">
                                                    Connect
                                                </button>
                                            )}
                                            <button className="text-[var(--theme-text-muted)] hover:text-[var(--theme-text-muted)] transition-colors bg-transparent border-none cursor-pointer p-1">
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" /></svg>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="px-5 py-3">
                                        <p className="text-[13px] text-[var(--theme-text-secondary)] leading-relaxed whitespace-pre-line">{post.content}</p>
                                    </div>

                                    {/* Code Snippet */}
                                    {post.code && (
                                        <div className="mx-5 mb-3 rounded-xl overflow-hidden border border-[var(--theme-border)]">
                                            <div className="flex items-center justify-between px-3.5 py-2 bg-[var(--theme-bg-secondary)] border-b border-[var(--theme-border-light)]">
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                                                    <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                                                    <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
                                                </div>
                                                <span className="text-[9px] text-[var(--theme-text-muted)] uppercase tracking-wider font-bold"
                                                    style={{ fontFamily: "var(--font-jetbrains-mono)" }}>{post.codeLang}</span>
                                            </div>
                                            <pre className="px-4 py-3 text-[11px] leading-relaxed overflow-x-auto bg-[#1E1E2E] text-emerald-400 m-0"
                                                style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>
                                                <code>{post.code}</code>
                                            </pre>
                                        </div>
                                    )}

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-1.5 px-5 pb-3">
                                        {post.tags.map((tag) => (
                                            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--theme-bg-secondary)] border border-[var(--theme-border)] text-[var(--theme-text-muted)] font-medium cursor-pointer hover:border-[#A855F7]/40 hover:text-[#A855F7] hover:bg-[#A855F7]/10 transition-all"
                                                style={{ fontFamily: "var(--font-jetbrains-mono)" }}>
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center justify-between px-5 py-3 border-t border-[var(--theme-border-light)]">
                                        <div className="flex items-center gap-5">
                                            <button onClick={() => toggleLike(post.id)}
                                                className={`flex items-center gap-1.5 text-[12px] font-medium transition-all bg-transparent border-none cursor-pointer ${isLiked ? "text-red-500" : "text-[var(--theme-text-muted)] hover:text-red-500"}`}>
                                                <HeartIcon filled={isLiked} />
                                                <span>{post.likes + (isLiked && !post.liked ? 1 : 0)}</span>
                                            </button>
                                            <button className="flex items-center gap-1.5 text-[12px] font-medium text-[var(--theme-text-muted)] hover:text-blue-500 transition-all bg-transparent border-none cursor-pointer">
                                                <CommentIcon /> {post.comments}
                                            </button>
                                            <button className="flex items-center gap-1.5 text-[12px] font-medium text-[var(--theme-text-muted)] hover:text-[#A855F7] transition-all bg-transparent border-none cursor-pointer">
                                                <ShareIcon /> {post.shares}
                                            </button>
                                        </div>
                                        <button onClick={() => toggleSave(post.id)}
                                            className={`transition-all bg-transparent border-none cursor-pointer ${isSaved ? "text-[#A855F7]" : "text-[var(--theme-text-muted)] hover:text-[#A855F7]"}`}>
                                            <BookmarkIcon filled={isSaved} />
                                        </button>
                                    </div>
                                </article>
                            );
                        })}
                    </div>

                    {/* â•â•â•â•â•â•â•â• RIGHT SIDEBAR (hidden on mobile) â•â•â•â•â•â•â•â• */}
                    <div className="hidden lg:block w-[300px] shrink-0 space-y-5">

                        {/* ── Company Card ── */}
                        <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm overflow-hidden">
                            <div className="h-16 bg-gradient-to-r from-purple-500 to-indigo-600" />
                            <div className="px-4 pb-4 -mt-6">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-violet-600 flex items-center justify-center text-white text-[13px] font-bold shadow-lg border-2 border-white">
                                    RC
                                </div>
                                <h3 className="text-[14px] font-bold text-[var(--theme-text-primary)] mt-2">Company</h3>
                                <p className="text-[11px] text-[var(--theme-text-muted)] mb-3">Talent Scout • SkillSpill</p>
                                <div className="grid grid-cols-3 gap-2 text-center">
                                    <div className="bg-[#A855F7]/10 rounded-lg py-2">
                                        <p className="text-[14px] font-bold text-[#A855F7]">3</p>
                                        <p className="text-[8px] text-[var(--theme-text-muted)] uppercase tracking-wider font-semibold">Jobs</p>
                                    </div>
                                    <div className="bg-indigo-500/10 rounded-lg py-2">
                                        <p className="text-[14px] font-bold text-indigo-500">38</p>
                                        <p className="text-[8px] text-[var(--theme-text-muted)] uppercase tracking-wider font-semibold">Applicants</p>
                                    </div>
                                    <div className="bg-emerald-500/10 rounded-lg py-2">
                                        <p className="text-[14px] font-bold text-emerald-500">2</p>
                                        <p className="text-[8px] text-[var(--theme-text-muted)] uppercase tracking-wider font-semibold">Hires</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── Active Jobs ── */}
                        <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--theme-border-light)]">
                                <h3 className="text-[11px] font-bold text-[var(--theme-text-muted)] uppercase tracking-[2px]"
                                    style={{ fontFamily: "var(--font-jetbrains-mono)" }}><Briefcase className="inline-block w-4 h-4 mr-1.5 align-text-bottom" />Your Jobs</h3>
                                <Link href="/recruiter/applications"
                                    className="block p-3 rounded-xl hover:bg-[var(--theme-bg-secondary)] transition-colors border border-transparent hover:border-[var(--theme-border-light)] no-underline">
                                    MANAGE <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
                                </Link>
                            </div>
                            <div className="divide-y divide-[var(--theme-border-light)]">
                                {activeJobs.map((job, i) => (
                                    <div key={i} className="px-4 py-3 hover:bg-purple-500/10 transition-colors cursor-pointer group">
                                        <div className="flex items-start justify-between mb-1">
                                            <div className="flex items-center gap-1.5">
                                                {job.hot && <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />}
                                                <p className="text-[12px] font-semibold text-[var(--theme-text-secondary)] group-hover:text-[var(--theme-text-primary)] transition-colors">{job.title}</p>
                                            </div>
                                            <span className="text-[10px] font-bold text-emerald-500"
                                                style={{ fontFamily: "var(--font-jetbrains-mono)" }}>{job.budget}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] text-[var(--theme-text-muted)]">{job.apps} applicants • {job.type}</span>
                                            <span className={`text-[10px] ${job.days <= 3 ? "text-orange-500 font-semibold" : "text-[var(--theme-text-muted)]"}`}
                                                style={{ fontFamily: "var(--font-jetbrains-mono)" }}>{job.days}d left</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="px-4 py-3 border-t border-[var(--theme-border-light)]">
                                <Link href="/recruiter/applications"
                                    className="flex items-center justify-center gap-2 w-full py-2 rounded-xl text-[11px] font-bold text-[#A855F7] bg-[#A855F7]/10 border border-[#A855F7]/20 hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-all no-underline cursor-pointer">
                                    + Post New Job
                                </Link>
                            </div>
                        </div>

                        {/* ── Top Candidates ── */}
                        <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--theme-border-light)]">
                                <h3 className="text-[11px] font-bold text-[var(--theme-text-muted)] uppercase tracking-[2px]"
                                    style={{ fontFamily: "var(--font-jetbrains-mono)" }}><Target className="inline-block w-4 h-4 mr-1.5 align-text-bottom" />Top Matches</h3>
                                <Link href="/recruiter/search"
                                    className="text-[9px] text-[#A855F7] hover:text-[#A855F7] font-bold no-underline transition-colors flex items-center gap-0.5">
                                    SEARCH <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
                                </Link>
                            </div>
                            <div className="divide-y divide-[var(--theme-border-light)]">
                                {topCandidates.map((c) => (
                                    <div key={c.name} className="flex items-center justify-between px-4 py-3 hover:bg-[var(--theme-bg-secondary)] transition-colors">
                                        <div className="flex items-center gap-2.5">
                                            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${c.grad} flex items-center justify-center text-white text-[9px] font-bold shadow-sm`}>
                                                {c.initials}
                                            </div>
                                            <div>
                                                <p className="text-[12px] font-semibold text-[var(--theme-text-secondary)]">{c.name}</p>
                                                <p className="text-[10px] text-[var(--theme-text-muted)]">{c.role}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-bold text-[#A855F7]"
                                                style={{ fontFamily: "var(--font-jetbrains-mono)" }}>{c.score}%</span>
                                            <button className="px-2.5 py-1 rounded-md text-[9px] font-bold text-[#A855F7] border border-[#A855F7]/30 bg-[#A855F7]/10 cursor-pointer hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-all">
                                                View
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ── Skill Demand ── */}
                        <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm overflow-hidden">
                            <div className="px-4 py-3 border-b border-[var(--theme-border-light)]">
                                <h3 className="text-[11px] font-bold text-[var(--theme-text-muted)] uppercase tracking-[2px]"
                                    style={{ fontFamily: "var(--font-jetbrains-mono)" }}><BarChart2 className="inline-block w-4 h-4 mr-1.5 align-text-bottom" />Skill Demand</h3>
                            </div>
                            <div className="p-4 space-y-3">
                                {skillDemand.map((skill) => (
                                    <div key={skill.name}>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-[11px] font-semibold text-[var(--theme-text-secondary)]">{skill.name}</span>
                                            <span className="text-[10px] text-[var(--theme-text-muted)]"
                                                style={{ fontFamily: "var(--font-jetbrains-mono)" }}>{skill.demand}%</span>
                                        </div>
                                        <div className="w-full h-1.5 rounded-full bg-[var(--theme-input-bg)] overflow-hidden">
                                            <div className="h-full rounded-full transition-all duration-700"
                                                style={{ width: `${skill.demand}%`, background: skill.color }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ── Footer links ── */}
                        <div className="px-2 text-center">
                            <p className="text-[10px] text-[var(--theme-text-muted)] leading-relaxed">
                                About • Help • Terms • Privacy
                            </p>
                            <p className="text-[10px] text-[var(--theme-text-muted)] mt-1">© 2026 SkillSpill</p>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}
