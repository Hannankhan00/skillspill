"use client";

import React, { useState } from "react";
import Link from "next/link";

/* ═══════════════════════════════════════════════
   S K I L L S P I L L  —  T A L E N T  F E E D
   Social feed — like LinkedIn meets GitHub
   ═══════════════════════════════════════════════ */

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
        content: "Just shipped a recursive search optimizer in Rust — 24% latency reduction using zero-cost abstractions. Sometimes the compiler really is your best friend. ⚡\n\nHere's the core function:",
        code: `fn optimized_search<T: PartialEq>(data: &[T], query: &T) -> Option<usize> {
    data.iter().position(|item| item == query)
}

// Benchmark: 0.8ms avg on 1M items
// Previous: 1.05ms — 24% improvement`,
        codeLang: "rust",
        tags: ["Rust", "Performance", "Algorithms"],
        likes: 128, comments: 24, shares: 8, liked: false, saved: false,
    },
    {
        id: 2, username: "Neon_Cipher", role: "Web3 Developer",
        initials: "NC", grad: "from-amber-400 to-orange-500",
        time: "2h", verified: true,
        content: "New smart contract for the bounty system is live on testnet. Audits coming back clean! 🔒 Gas costs down 40% from the previous iteration.\n\nNo CV needed, just prove your skills on-chain. That's the future of hiring.",
        code: null, codeLang: null,
        tags: ["Web3", "Solidity", "Smart Contracts"],
        likes: 87, comments: 15, shares: 12, liked: true, saved: true,
    },
    {
        id: 3, username: "Zero_Day", role: "Systems Engineer",
        initials: "ZD", grad: "from-cyan-400 to-blue-600",
        time: "4h", verified: false,
        content: "Built a real-time collaboration engine using WebSockets + CRDTs. Zero merge conflicts in live editing sessions. 🚀\n\nThe trick was using a last-writer-wins strategy with vector clocks for causal ordering:",
        code: `const syncEngine = new CRDTEngine({
  strategy: 'last-writer-wins',
  vectorClock: true,
  transport: new WSTransport(url),
  onConflict: (local, remote) => {
    return merge(local, remote, { preserveIntent: true });
  }
});`,
        codeLang: "typescript",
        tags: ["TypeScript", "WebSockets", "CRDTs"],
        likes: 203, comments: 41, shares: 28, liked: false, saved: false,
    },
    {
        id: 4, username: "Data_Witch", role: "ML Engineer",
        initials: "DW", grad: "from-emerald-400 to-teal-500",
        time: "6h", verified: true,
        content: "Trained a transformer model that predicts skill compatibility between developers and projects. 94% accuracy after fine-tuning on SkillSpill data.\n\nThe model looks at code patterns, not CVs. Skills > Credentials every time. 🧠",
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
    },
    {
        id: 5, username: "Pixel_Punk", role: "Frontend Developer",
        initials: "PP", grad: "from-pink-400 to-rose-500",
        time: "8h", verified: false,
        content: "Recreated the entire iOS lock screen in pure CSS. No JavaScript. No images. Just 847 lines of carefully crafted gradients and animations. 🎨\n\nMy brain hurts but the dopamine is real.",
        code: null, codeLang: null,
        tags: ["CSS", "UI", "Creative Coding"],
        likes: 456, comments: 78, shares: 92, liked: false, saved: false,
    },
];

const trendingSkills = [
    { name: "Rust", posts: "2.4k", growth: "+31%" },
    { name: "TypeScript", posts: "8.1k", growth: "+12%" },
    { name: "WebAssembly", posts: "1.2k", growth: "+48%" },
    { name: "Solidity", posts: "980", growth: "+24%" },
    { name: "Go", posts: "3.7k", growth: "+18%" },
];

const suggestedUsers = [
    { name: "Alex_Kernel", role: "Kernel Dev", initials: "AK", grad: "from-red-400 to-rose-600" },
    { name: "Cloud_Nine", role: "DevOps Lead", initials: "C9", grad: "from-sky-400 to-indigo-500" },
    { name: "Bit_Wizard", role: "Security Eng", initials: "BW", grad: "from-amber-400 to-orange-500" },
];

const jobSuggestions = [
    { title: "Senior React Engineer", company: "CryptoVault", budget: "$8k", match: "94%" },
    { title: "Rust Systems Dev", company: "Nebula OS", budget: "$12k", match: "89%" },
    { title: "Full-Stack Lead", company: "SkillDAO", budget: "$10k", match: "87%" },
];

/* ═══════════════ MAIN FEED ═══════════════ */
export default function TalentFeed() {
    const [feedTab, setFeedTab] = useState("For You");
    const [composerText, setComposerText] = useState("");
    const [likedPosts, setLikedPosts] = useState<Record<number, boolean>>({ 2: true });
    const [savedPosts, setSavedPosts] = useState<Record<number, boolean>>({ 2: true });

    const toggleLike = (id: number) => setLikedPosts(p => ({ ...p, [id]: !p[id] }));
    const toggleSave = (id: number) => setSavedPosts(p => ({ ...p, [id]: !p[id] }));

    const tabs = ["For You", "Following", "Trending", "Code", "Jobs"];

    return (
        <div className="min-h-full bg-[#F5F5F7]">
            <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-5">
                <div className="flex flex-col lg:flex-row gap-6">

                    {/* ════════ MAIN FEED ════════ */}
                    <div className="flex-1 min-w-0 space-y-4">

                        {/* ── Composer ── */}
                        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-[11px] font-bold shadow-md shrink-0">
                                    GP
                                </div>
                                <div className="flex-1">
                                    <textarea
                                        placeholder="What are you working on? Share a spill..."
                                        value={composerText}
                                        onChange={(e) => setComposerText(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[13px] text-gray-700 placeholder:text-gray-400 resize-none outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-50 transition-all"
                                        rows={2}
                                    />
                                    <div className="flex items-center justify-between mt-3">
                                        <div className="flex items-center gap-2">
                                            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all bg-transparent border-none cursor-pointer">
                                                <CodeIcon /> Code
                                            </button>
                                            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all bg-transparent border-none cursor-pointer">
                                                <ImageIcon /> Image
                                            </button>
                                        </div>
                                        <button
                                            className={`px-5 py-2 rounded-xl text-[12px] font-bold uppercase tracking-wider border-none cursor-pointer transition-all duration-200 ${composerText.trim()
                                                ? "bg-emerald-500 text-white hover:bg-emerald-600 shadow-md shadow-emerald-200"
                                                : "bg-gray-100 text-gray-400 cursor-default"
                                                }`}
                                            disabled={!composerText.trim()}
                                        >
                                            Spill It 🔥
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
                                            ? "bg-white text-gray-800 shadow-sm border border-gray-200"
                                            : "bg-transparent text-gray-400 hover:text-gray-600 hover:bg-white/50"
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
                                <article key={post.id} className="rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                                    {/* Header */}
                                    <div className="flex items-center justify-between px-5 pt-4 pb-2">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${post.grad} flex items-center justify-center text-white text-[11px] font-bold shadow-md`}>
                                                {post.initials}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-[13px] font-bold text-gray-800">{post.username}</span>
                                                    {post.verified && (
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="#8B5CF6"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#fff" strokeWidth="2" /></svg>
                                                    )}
                                                </div>
                                                <p className="text-[11px] text-gray-400">
                                                    {post.role} • <span style={{ fontFamily: "var(--font-jetbrains-mono)" }}>{post.time} ago</span>
                                                </p>
                                            </div>
                                        </div>
                                        <button className="text-gray-300 hover:text-gray-500 transition-colors bg-transparent border-none cursor-pointer p-1">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" /></svg>
                                        </button>
                                    </div>

                                    {/* Content */}
                                    <div className="px-5 py-3">
                                        <p className="text-[13px] text-gray-700 leading-relaxed whitespace-pre-line">{post.content}</p>
                                    </div>

                                    {/* Code Snippet */}
                                    {post.code && (
                                        <div className="mx-5 mb-3 rounded-xl overflow-hidden border border-gray-200">
                                            <div className="flex items-center justify-between px-3.5 py-2 bg-gray-50 border-b border-gray-100">
                                                <div className="flex items-center gap-1.5">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                                                    <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                                                    <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
                                                </div>
                                                <span className="text-[9px] text-gray-400 uppercase tracking-wider font-bold"
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
                                            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-gray-50 border border-gray-200 text-gray-500 font-medium cursor-pointer hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
                                                style={{ fontFamily: "var(--font-jetbrains-mono)" }}>
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
                                        <div className="flex items-center gap-5">
                                            <button onClick={() => toggleLike(post.id)}
                                                className={`flex items-center gap-1.5 text-[12px] font-medium transition-all bg-transparent border-none cursor-pointer ${isLiked ? "text-red-500" : "text-gray-400 hover:text-red-500"}`}>
                                                <HeartIcon filled={isLiked} />
                                                <span>{post.likes + (isLiked && !post.liked ? 1 : 0)}</span>
                                            </button>
                                            <button className="flex items-center gap-1.5 text-[12px] font-medium text-gray-400 hover:text-blue-500 transition-all bg-transparent border-none cursor-pointer">
                                                <CommentIcon /> {post.comments}
                                            </button>
                                            <button className="flex items-center gap-1.5 text-[12px] font-medium text-gray-400 hover:text-emerald-500 transition-all bg-transparent border-none cursor-pointer">
                                                <ShareIcon /> {post.shares}
                                            </button>
                                        </div>
                                        <button onClick={() => toggleSave(post.id)}
                                            className={`transition-all bg-transparent border-none cursor-pointer ${isSaved ? "text-purple-500" : "text-gray-300 hover:text-purple-500"}`}>
                                            <BookmarkIcon filled={isSaved} />
                                        </button>
                                    </div>
                                </article>
                            );
                        })}
                    </div>

                    {/* ════════ RIGHT SIDEBAR (hidden on mobile) ════════ */}
                    <div className="hidden lg:block w-[300px] shrink-0 space-y-5">

                        {/* ── Profile Card Mini ── */}
                        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                            <div className="h-16 bg-gradient-to-r from-emerald-400 to-cyan-500" />
                            <div className="px-4 pb-4 -mt-6">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-[13px] font-bold shadow-lg border-2 border-white">
                                    GP
                                </div>
                                <h3 className="text-[14px] font-bold text-gray-800 mt-2">Ghost_Protocol</h3>
                                <p className="text-[11px] text-gray-400 mb-3">Full-Stack Developer • Lv.42</p>
                                <div className="flex items-center gap-4 text-center">
                                    <div>
                                        <p className="text-[14px] font-bold text-gray-700">23</p>
                                        <p className="text-[9px] text-gray-400 uppercase tracking-wider">Spills</p>
                                    </div>
                                    <div className="w-px h-6 bg-gray-200" />
                                    <div>
                                        <p className="text-[14px] font-bold text-gray-700">1.2k</p>
                                        <p className="text-[9px] text-gray-400 uppercase tracking-wider">Followers</p>
                                    </div>
                                    <div className="w-px h-6 bg-gray-200" />
                                    <div>
                                        <p className="text-[14px] font-bold text-gray-700">847</p>
                                        <p className="text-[9px] text-gray-400 uppercase tracking-wider">Following</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── Trending Skills ── */}
                        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                            <div className="px-4 py-3 border-b border-gray-100">
                                <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-[2px]"
                                    style={{ fontFamily: "var(--font-jetbrains-mono)" }}>🔥 Trending Skills</h3>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {trendingSkills.map((skill, i) => (
                                    <div key={skill.name} className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <span className="text-[11px] font-bold text-gray-300 w-4">{i + 1}</span>
                                            <div>
                                                <p className="text-[12px] font-semibold text-gray-700">{skill.name}</p>
                                                <p className="text-[10px] text-gray-400">{skill.posts} spills</p>
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-bold text-emerald-500"
                                            style={{ fontFamily: "var(--font-jetbrains-mono)" }}>{skill.growth}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ── Job Suggestions ── */}
                        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                                <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-[2px]"
                                    style={{ fontFamily: "var(--font-jetbrains-mono)" }}>💼 Jobs For You</h3>
                                <Link href="/talent/jobs"
                                    className="text-[9px] text-emerald-500 hover:text-emerald-600 font-bold no-underline transition-colors">
                                    ALL →
                                </Link>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {jobSuggestions.map((job) => (
                                    <div key={job.title} className="px-4 py-3 hover:bg-emerald-50/30 transition-colors cursor-pointer group">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="text-[12px] font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">{job.title}</p>
                                                <p className="text-[10px] text-gray-400">{job.company} • {job.budget}</p>
                                            </div>
                                            <span className="text-[10px] font-bold text-emerald-500 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-100"
                                                style={{ fontFamily: "var(--font-jetbrains-mono)" }}>{job.match}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ── Suggested Connections ── */}
                        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                            <div className="px-4 py-3 border-b border-gray-100">
                                <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-[2px]"
                                    style={{ fontFamily: "var(--font-jetbrains-mono)" }}>👥 People to Follow</h3>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {suggestedUsers.map((user) => (
                                    <div key={user.name} className="flex items-center justify-between px-4 py-3">
                                        <div className="flex items-center gap-2.5">
                                            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${user.grad} flex items-center justify-center text-white text-[9px] font-bold shadow-sm`}>
                                                {user.initials}
                                            </div>
                                            <div>
                                                <p className="text-[12px] font-semibold text-gray-700">{user.name}</p>
                                                <p className="text-[10px] text-gray-400">{user.role}</p>
                                            </div>
                                        </div>
                                        <button className="px-3 py-1 rounded-lg text-[10px] font-bold text-emerald-600 border border-emerald-200 bg-emerald-50 cursor-pointer hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all">
                                            Follow
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ── Footer links ── */}
                        <div className="px-2 text-center">
                            <p className="text-[10px] text-gray-300 leading-relaxed">
                                About • Help • Terms • Privacy
                            </p>
                            <p className="text-[10px] text-gray-300 mt-1">© 2026 SkillSpill</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
