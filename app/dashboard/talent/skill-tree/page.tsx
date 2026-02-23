"use client";

import React, { useState } from "react";

/* ── Skill Tree Data ── */
interface SkillNode {
    id: string;
    name: string;
    category: string;
    level: number;
    maxLevel: number;
    xp: number;
    xpRequired: number;
    unlocked: boolean;
    children: string[];
    description: string;
}

const skillCategories = [
    { key: "frontend", label: "Frontend", color: "#3CF91A" },
    { key: "backend", label: "Backend", color: "#00D2FF" },
    { key: "devops", label: "DevOps", color: "#A855F7" },
    { key: "web3", label: "Web3", color: "#FF9F43" },
    { key: "ai", label: "AI / ML", color: "#FF003C" },
];

const skillNodes: SkillNode[] = [
    // Frontend
    { id: "html", name: "HTML5", category: "frontend", level: 5, maxLevel: 5, xp: 500, xpRequired: 500, unlocked: true, children: ["css", "js"], description: "Semantic markup & accessibility" },
    { id: "css", name: "CSS3", category: "frontend", level: 4, maxLevel: 5, xp: 380, xpRequired: 500, unlocked: true, children: ["tailwind", "animations"], description: "Layouts, Flexbox, Grid, responsive design" },
    { id: "js", name: "JavaScript", category: "frontend", level: 5, maxLevel: 5, xp: 500, xpRequired: 500, unlocked: true, children: ["ts", "react"], description: "ES6+, async/await, closures" },
    { id: "ts", name: "TypeScript", category: "frontend", level: 4, maxLevel: 5, xp: 420, xpRequired: 500, unlocked: true, children: ["nextjs"], description: "Type-safe JavaScript with generics & utility types" },
    { id: "react", name: "React", category: "frontend", level: 4, maxLevel: 5, xp: 400, xpRequired: 500, unlocked: true, children: ["nextjs"], description: "Component-based UI with hooks & context" },
    { id: "nextjs", name: "Next.js", category: "frontend", level: 3, maxLevel: 5, xp: 280, xpRequired: 500, unlocked: true, children: [], description: "SSR, SSG, App Router, Server Components" },
    { id: "tailwind", name: "Tailwind CSS", category: "frontend", level: 3, maxLevel: 5, xp: 300, xpRequired: 500, unlocked: true, children: [], description: "Utility-first CSS framework" },
    { id: "animations", name: "Animations", category: "frontend", level: 2, maxLevel: 5, xp: 180, xpRequired: 500, unlocked: true, children: [], description: "CSS transitions, Framer Motion, GSAP" },

    // Backend
    { id: "node", name: "Node.js", category: "backend", level: 4, maxLevel: 5, xp: 440, xpRequired: 500, unlocked: true, children: ["express", "prisma"], description: "Server-side JavaScript runtime" },
    { id: "express", name: "Express", category: "backend", level: 3, maxLevel: 5, xp: 300, xpRequired: 500, unlocked: true, children: ["rest-api"], description: "Minimal web framework for Node.js" },
    { id: "prisma", name: "Prisma", category: "backend", level: 3, maxLevel: 5, xp: 280, xpRequired: 500, unlocked: true, children: ["db-design"], description: "Type-safe ORM for Node.js & TypeScript" },
    { id: "rest-api", name: "REST APIs", category: "backend", level: 4, maxLevel: 5, xp: 380, xpRequired: 500, unlocked: true, children: ["graphql"], description: "RESTful architecture & API design" },
    { id: "graphql", name: "GraphQL", category: "backend", level: 2, maxLevel: 5, xp: 150, xpRequired: 500, unlocked: true, children: [], description: "Query language for APIs" },
    { id: "db-design", name: "DB Design", category: "backend", level: 3, maxLevel: 5, xp: 320, xpRequired: 500, unlocked: true, children: [], description: "Schema design, normalization, indexing" },
    { id: "rust", name: "Rust", category: "backend", level: 2, maxLevel: 5, xp: 200, xpRequired: 500, unlocked: true, children: [], description: "Systems programming, memory safety" },
    { id: "python", name: "Python", category: "backend", level: 3, maxLevel: 5, xp: 340, xpRequired: 500, unlocked: true, children: [], description: "Scripting, data analysis, ML" },

    // DevOps
    { id: "git", name: "Git", category: "devops", level: 5, maxLevel: 5, xp: 500, xpRequired: 500, unlocked: true, children: ["cicd", "github-actions"], description: "Version control mastery" },
    { id: "docker", name: "Docker", category: "devops", level: 3, maxLevel: 5, xp: 260, xpRequired: 500, unlocked: true, children: ["k8s"], description: "Containerization & image management" },
    { id: "cicd", name: "CI/CD", category: "devops", level: 2, maxLevel: 5, xp: 180, xpRequired: 500, unlocked: true, children: [], description: "Continuous integration & deployment pipelines" },
    { id: "github-actions", name: "GitHub Actions", category: "devops", level: 3, maxLevel: 5, xp: 300, xpRequired: 500, unlocked: true, children: [], description: "Workflow automation" },
    { id: "k8s", name: "Kubernetes", category: "devops", level: 1, maxLevel: 5, xp: 80, xpRequired: 500, unlocked: false, children: [], description: "Container orchestration at scale" },
    { id: "aws", name: "AWS", category: "devops", level: 2, maxLevel: 5, xp: 150, xpRequired: 500, unlocked: true, children: [], description: "Cloud infrastructure & services" },

    // Web3
    { id: "solidity", name: "Solidity", category: "web3", level: 2, maxLevel: 5, xp: 180, xpRequired: 500, unlocked: true, children: ["defi"], description: "Smart contract development" },
    { id: "ethers", name: "Ethers.js", category: "web3", level: 2, maxLevel: 5, xp: 140, xpRequired: 500, unlocked: true, children: [], description: "Ethereum blockchain interaction library" },
    { id: "defi", name: "DeFi", category: "web3", level: 1, maxLevel: 5, xp: 60, xpRequired: 500, unlocked: false, children: [], description: "Decentralized finance protocols" },

    // AI
    { id: "ml-basics", name: "ML Basics", category: "ai", level: 2, maxLevel: 5, xp: 200, xpRequired: 500, unlocked: true, children: ["neural-nets"], description: "Supervised & unsupervised learning" },
    { id: "neural-nets", name: "Neural Nets", category: "ai", level: 1, maxLevel: 5, xp: 80, xpRequired: 500, unlocked: false, children: [], description: "Deep learning architectures" },
    { id: "prompt-eng", name: "Prompt Eng.", category: "ai", level: 3, maxLevel: 5, xp: 300, xpRequired: 500, unlocked: true, children: [], description: "LLM prompt engineering & fine-tuning" },
];

function LevelBadge({ level, maxLevel }: { level: number; maxLevel: number }) {
    return (
        <span
            className="text-[9px] font-bold px-1.5 py-0.5 rounded"
            style={{
                color: level === maxLevel ? "#000" : "#3CF91A",
                background: level === maxLevel ? "#3CF91A" : "#3CF91A15",
                border: level === maxLevel ? "none" : "1px solid #3CF91A30",
            }}
        >
            Lv.{level}/{maxLevel}
        </span>
    );
}

function LockIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/20">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
    );
}

export default function SkillTreePage() {
    const [activeCategory, setActiveCategory] = useState<string>("all");
    const [selectedSkill, setSelectedSkill] = useState<SkillNode | null>(null);

    const filteredSkills = activeCategory === "all"
        ? skillNodes
        : skillNodes.filter((s) => s.category === activeCategory);

    const totalXP = skillNodes.reduce((acc, s) => acc + s.xp, 0);
    const totalMaxXP = skillNodes.reduce((acc, s) => acc + s.xpRequired, 0);
    const unlockedCount = skillNodes.filter((s) => s.unlocked).length;
    const maxedCount = skillNodes.filter((s) => s.level === s.maxLevel).length;

    return (
        <div className="min-h-full bg-[#050505]">
            {/* Header */}
            <div className="border-b border-white/[0.06] bg-[#0A0A0A]/60 backdrop-blur-sm">
                <div className="max-w-[1400px] mx-auto px-6 py-5">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                                Skill Tree
                            </h1>
                            <p className="text-[12px] text-white/40 mt-1" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>
                                Map your expertise. Unlock new capabilities. <span className="text-[#3CF91A]">Level up.</span>
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="flex flex-wrap gap-3">
                            <div className="px-4 py-2.5 rounded-lg border border-[#3CF91A]/20 bg-[#3CF91A]/[0.04]">
                                <p className="text-[9px] uppercase tracking-widest text-white/30 font-semibold">Total Skill XP</p>
                                <p className="text-lg font-bold text-[#3CF91A]" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>
                                    {totalXP.toLocaleString()}
                                </p>
                            </div>
                            <div className="px-4 py-2.5 rounded-lg border border-white/[0.08] bg-white/[0.02]">
                                <p className="text-[9px] uppercase tracking-widest text-white/30 font-semibold">Skills Unlocked</p>
                                <p className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>
                                    {unlockedCount}/{skillNodes.length}
                                </p>
                            </div>
                            <div className="px-4 py-2.5 rounded-lg border border-white/[0.08] bg-white/[0.02]">
                                <p className="text-[9px] uppercase tracking-widest text-white/30 font-semibold">Mastered</p>
                                <p className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>
                                    {maxedCount}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* XP Progress Bar */}
                    <div className="mt-4 flex items-center gap-3">
                        <div className="flex-1 h-2 rounded-full bg-white/[0.06] overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all duration-700"
                                style={{
                                    width: `${(totalXP / totalMaxXP) * 100}%`,
                                    background: "linear-gradient(90deg, #3CF91A, #00D2FF)",
                                    boxShadow: "0 0 12px #3CF91A40",
                                }}
                            />
                        </div>
                        <span className="text-[10px] text-white/30" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>
                            {Math.round((totalXP / totalMaxXP) * 100)}%
                        </span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-[1400px] mx-auto px-6 py-6">
                {/* Category Filter */}
                <div className="flex items-center gap-2 mb-6 flex-wrap">
                    <button
                        onClick={() => setActiveCategory("all")}
                        className={`px-3.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-200 border cursor-pointer ${activeCategory === "all"
                                ? "bg-white/10 text-white border-white/20"
                                : "bg-transparent text-white/30 border-white/[0.06] hover:text-white/50 hover:border-white/10"
                            }`}
                    >
                        All Skills
                    </button>
                    {skillCategories.map((cat) => (
                        <button
                            key={cat.key}
                            onClick={() => setActiveCategory(cat.key)}
                            className={`px-3.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-200 border cursor-pointer ${activeCategory === cat.key
                                    ? "text-black"
                                    : "bg-transparent text-white/30 hover:text-white/50"
                                }`}
                            style={
                                activeCategory === cat.key
                                    ? {
                                        background: cat.color,
                                        borderColor: cat.color,
                                        boxShadow: `0 0 15px ${cat.color}30`,
                                    }
                                    : {
                                        borderColor: `${cat.color}20`,
                                    }
                            }
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Skill Grid */}
                    <div className="flex-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                            {filteredSkills.map((skill) => {
                                const cat = skillCategories.find((c) => c.key === skill.category);
                                const color = cat?.color || "#3CF91A";
                                const pct = Math.round((skill.xp / skill.xpRequired) * 100);
                                const isSelected = selectedSkill?.id === skill.id;

                                return (
                                    <button
                                        key={skill.id}
                                        onClick={() => setSelectedSkill(skill)}
                                        className={`
                                            relative text-left p-4 rounded-xl border transition-all duration-300
                                            cursor-pointer group
                                            ${!skill.unlocked ? "opacity-40" : ""}
                                            ${isSelected ? "scale-[1.02]" : "hover:scale-[1.01]"}
                                        `}
                                        style={{
                                            background: isSelected ? `${color}08` : "#0A0A0A",
                                            borderColor: isSelected ? `${color}50` : "rgba(255,255,255,0.06)",
                                            boxShadow: isSelected ? `0 0 20px ${color}15` : "none",
                                        }}
                                    >
                                        {!skill.unlocked && (
                                            <div className="absolute top-3 right-3">
                                                <LockIcon />
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="text-[13px] font-bold text-white/90">{skill.name}</h4>
                                            <LevelBadge level={skill.level} maxLevel={skill.maxLevel} />
                                        </div>

                                        <p className="text-[10px] text-white/30 mb-3 leading-relaxed">{skill.description}</p>

                                        {/* XP Bar */}
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                                                <div
                                                    className="h-full rounded-full transition-all duration-500"
                                                    style={{
                                                        width: `${pct}%`,
                                                        background: color,
                                                        boxShadow: `0 0 8px ${color}40`,
                                                    }}
                                                />
                                            </div>
                                            <span
                                                className="text-[9px] font-semibold shrink-0"
                                                style={{
                                                    color: `${color}90`,
                                                    fontFamily: "var(--font-jetbrains-mono)",
                                                }}
                                            >
                                                {skill.xp}/{skill.xpRequired}
                                            </span>
                                        </div>

                                        {/* Category tag */}
                                        <div className="mt-2.5 flex items-center gap-1.5">
                                            <span
                                                className="w-1.5 h-1.5 rounded-full"
                                                style={{ background: color }}
                                            />
                                            <span className="text-[9px] text-white/25 uppercase tracking-wider font-semibold">
                                                {cat?.label}
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Skill Detail Panel */}
                    <div className="w-full lg:w-[320px] shrink-0">
                        <div className="rounded-xl border border-white/[0.06] bg-[#0A0A0A] overflow-hidden sticky top-6">
                            {selectedSkill ? (
                                <>
                                    <div
                                        className="px-5 py-4 border-b border-white/[0.04]"
                                        style={{
                                            background: `linear-gradient(135deg, ${skillCategories.find((c) => c.key === selectedSkill.category)?.color || "#3CF91A"
                                                }08, transparent)`,
                                        }}
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className="text-base font-bold text-white">{selectedSkill.name}</h3>
                                            <LevelBadge level={selectedSkill.level} maxLevel={selectedSkill.maxLevel} />
                                        </div>
                                        <p className="text-[10px] text-white/30 uppercase tracking-wider font-semibold">
                                            {skillCategories.find((c) => c.key === selectedSkill.category)?.label}
                                        </p>
                                    </div>
                                    <div className="p-5 space-y-4">
                                        <p className="text-[12px] text-white/50 leading-relaxed">{selectedSkill.description}</p>

                                        {/* XP Progress */}
                                        <div>
                                            <div className="flex items-center justify-between mb-1.5">
                                                <span className="text-[10px] text-white/30 font-semibold uppercase tracking-wider">Experience</span>
                                                <span className="text-[10px] font-semibold" style={{ color: skillCategories.find((c) => c.key === selectedSkill.category)?.color, fontFamily: "var(--font-jetbrains-mono)" }}>
                                                    {selectedSkill.xp}/{selectedSkill.xpRequired} XP
                                                </span>
                                            </div>
                                            <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                                                <div
                                                    className="h-full rounded-full transition-all duration-500"
                                                    style={{
                                                        width: `${(selectedSkill.xp / selectedSkill.xpRequired) * 100}%`,
                                                        background: `linear-gradient(90deg, ${skillCategories.find((c) => c.key === selectedSkill.category)?.color || "#3CF91A"
                                                            }, ${(skillCategories.find((c) => c.key === selectedSkill.category)?.color || "#3CF91A")}80)`,
                                                        boxShadow: `0 0 10px ${skillCategories.find((c) => c.key === selectedSkill.category)?.color || "#3CF91A"}40`,
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        {/* Level Progress */}
                                        <div>
                                            <span className="text-[10px] text-white/30 font-semibold uppercase tracking-wider">Level Progress</span>
                                            <div className="flex items-center gap-1 mt-2">
                                                {Array.from({ length: selectedSkill.maxLevel }).map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className="flex-1 h-3 rounded transition-all duration-300"
                                                        style={{
                                                            background: i < selectedSkill.level
                                                                ? skillCategories.find((c) => c.key === selectedSkill.category)?.color
                                                                : "rgba(255,255,255,0.06)",
                                                            boxShadow: i < selectedSkill.level
                                                                ? `0 0 6px ${skillCategories.find((c) => c.key === selectedSkill.category)?.color}30`
                                                                : "none",
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        {/* Unlocks */}
                                        {selectedSkill.children.length > 0 && (
                                            <div>
                                                <span className="text-[10px] text-white/30 font-semibold uppercase tracking-wider">Unlocks</span>
                                                <div className="flex flex-wrap gap-1.5 mt-2">
                                                    {selectedSkill.children.map((childId) => {
                                                        const child = skillNodes.find((s) => s.id === childId);
                                                        return child ? (
                                                            <span
                                                                key={childId}
                                                                className="text-[10px] px-2.5 py-1 rounded-full border text-white/50"
                                                                style={{
                                                                    borderColor: `${skillCategories.find((c) => c.key === child.category)?.color}30`,
                                                                    background: `${skillCategories.find((c) => c.key === child.category)?.color}08`,
                                                                }}
                                                            >
                                                                {child.name}
                                                            </span>
                                                        ) : null;
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {/* Status */}
                                        <div className="pt-3 border-t border-white/[0.04]">
                                            <div className="flex items-center gap-2">
                                                <span className={`w-2 h-2 rounded-full ${selectedSkill.unlocked ? "bg-[#3CF91A]" : "bg-white/20"}`} />
                                                <span className="text-[10px] text-white/40" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>
                                                    {selectedSkill.level === selectedSkill.maxLevel
                                                        ? "MASTERED"
                                                        : selectedSkill.unlocked
                                                            ? "IN PROGRESS"
                                                            : "LOCKED"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="p-8 text-center">
                                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-white/[0.04] flex items-center justify-center">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" opacity="0.2">
                                            <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="8" />
                                        </svg>
                                    </div>
                                    <p className="text-[12px] text-white/30">Select a skill to view details</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
