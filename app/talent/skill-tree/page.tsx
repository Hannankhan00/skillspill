"use client";

import React, { useState } from "react";

/* -- Skill Tree Data -- */
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
    { key: "frontend", label: "Frontend", color: "#3CF91A", gradient: "from-lime-400 to-green-500" },
    { key: "backend", label: "Backend", color: "#3B82F6", gradient: "from-blue-400 to-indigo-500" },
    { key: "devops", label: "DevOps", color: "#8B5CF6", gradient: "from-violet-400 to-purple-500" },
    { key: "web3", label: "Web3", color: "#F59E0B", gradient: "from-amber-400 to-orange-500" },
    { key: "ai", label: "AI / ML", color: "#EF4444", gradient: "from-red-400 to-rose-500" },
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

/* -- Icons -- */
function LockIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--theme-text-muted)' }}>
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
    );
}

function TrophyIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
            <path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22" />
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22" />
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
        </svg>
    );
}

function ZapIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
    );
}

function StarIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    );
}

function TargetIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
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
    const overallPct = Math.round((totalXP / totalMaxXP) * 100);

    return (
        <div className="min-h-full" style={{ background: 'var(--theme-bg)' }}>
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-5">

                {/* -- Header -- */}
                <div className="mb-6">
                    <h1 className="text-2xl lg:text-3xl font-bold tracking-tight" style={{ color: 'var(--theme-text-primary)', fontFamily: 'var(--font-space-grotesk)' }}>
                        ? Skill Tree
                    </h1>
                    <p className="text-[13px] mt-1" style={{ color: 'var(--theme-text-muted)' }}>
                        Map your expertise. Unlock new capabilities. <span className="text-[#3CF91A] font-semibold">Level up.</span>
                    </p>
                </div>

                {/* -- Stats Overview -- */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                    {[
                        { icon: <ZapIcon />, label: "Total XP", value: totalXP.toLocaleString(), sub: `/ ${totalMaxXP.toLocaleString()}`, color: "#3CF91A" },
                        { icon: <TargetIcon />, label: "Skills Unlocked", value: `${unlockedCount}`, sub: `/ ${skillNodes.length}`, color: "#3B82F6" },
                        { icon: <StarIcon />, label: "Mastered", value: `${maxedCount}`, sub: "skills", color: "#F59E0B" },
                        { icon: <TrophyIcon />, label: "Overall", value: `${overallPct}%`, sub: "complete", color: "#8B5CF6" },
                    ].map((stat, i) => (
                        <div
                            key={i}
                            className="rounded-2xl border p-4 transition-all hover:shadow-md"
                            style={{ background: 'var(--theme-card)', borderColor: 'var(--theme-border)' }}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <div
                                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                                    style={{ background: `${stat.color}15`, color: stat.color }}
                                >
                                    {stat.icon}
                                </div>
                                <span className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: 'var(--theme-text-muted)' }}>
                                    {stat.label}
                                </span>
                            </div>
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-xl font-bold" style={{ color: 'var(--theme-text-primary)', fontFamily: 'var(--font-jetbrains-mono)' }}>
                                    {stat.value}
                                </span>
                                <span className="text-[11px]" style={{ color: 'var(--theme-text-muted)' }}>{stat.sub}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* -- XP Progress Bar -- */}
                <div className="rounded-2xl border p-4 mb-6" style={{ background: 'var(--theme-card)', borderColor: 'var(--theme-border)' }}>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--theme-text-muted)' }}>Overall Progress</span>
                        <span className="text-[12px] font-bold" style={{ color: '#3CF91A', fontFamily: 'var(--font-jetbrains-mono)' }}>{overallPct}%</span>
                    </div>
                    <div className="h-3 rounded-full overflow-hidden" style={{ background: 'var(--theme-input-bg)' }}>
                        <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                                width: `${overallPct}%`,
                                background: "linear-gradient(90deg, #3CF91A, #3B82F6, #8B5CF6)",
                                boxShadow: "0 0 12px rgba(60, 249, 26, 0.3)",
                            }}
                        />
                    </div>
                </div>

                {/* -- Category Filter -- */}
                <div className="flex items-center gap-2 mb-5 flex-wrap">
                    <button
                        onClick={() => setActiveCategory("all")}
                        className={`px-4 py-2 rounded-xl text-[12px] font-semibold transition-all duration-200 border-none cursor-pointer ${activeCategory === "all"
                            ? "text-white shadow-md"
                            : ""
                            }`}
                        style={activeCategory === "all"
                            ? { background: 'var(--theme-text-primary)', color: 'var(--theme-bg)' }
                            : { background: 'var(--theme-card)', color: 'var(--theme-text-muted)', border: '1px solid var(--theme-border)' }
                        }
                    >
                        All Skills
                    </button>
                    {skillCategories.map((cat) => (
                        <button
                            key={cat.key}
                            onClick={() => setActiveCategory(cat.key)}
                            className="px-4 py-2 rounded-xl text-[12px] font-semibold transition-all duration-200 cursor-pointer border-none"
                            style={
                                activeCategory === cat.key
                                    ? {
                                        background: cat.color,
                                        color: "#fff",
                                        boxShadow: `0 4px 15px ${cat.color}40`,
                                    }
                                    : {
                                        background: 'var(--theme-card)',
                                        color: 'var(--theme-text-muted)',
                                        border: `1px solid var(--theme-border)`,
                                    }
                            }
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* -- Main Content -- */}
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Skill Grid */}
                    <div className="flex-1 min-w-0">
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                            {filteredSkills.map((skill) => {
                                const cat = skillCategories.find((c) => c.key === skill.category);
                                const color = cat?.color || "#3CF91A";
                                const pct = Math.round((skill.xp / skill.xpRequired) * 100);
                                const isSelected = selectedSkill?.id === skill.id;
                                const isMastered = skill.level === skill.maxLevel;

                                return (
                                    <button
                                        key={skill.id}
                                        onClick={() => setSelectedSkill(skill)}
                                        className={`
                                            relative text-left p-4 rounded-2xl border transition-all duration-300
                                            cursor-pointer group
                                            ${!skill.unlocked ? "opacity-50" : ""}
                                            ${isSelected ? "scale-[1.02] shadow-lg" : "hover:shadow-md hover:scale-[1.005]"}
                                        `}
                                        style={{
                                            background: 'var(--theme-card)',
                                            borderColor: isSelected ? color : 'var(--theme-border)',
                                            boxShadow: isSelected ? `0 4px 20px ${color}20` : undefined,
                                        }}
                                    >
                                        {/* Locked overlay */}
                                        {!skill.unlocked && (
                                            <div className="absolute top-3 right-3">
                                                <LockIcon />
                                            </div>
                                        )}

                                        {/* Mastered badge */}
                                        {isMastered && (
                                            <div className="absolute top-3 right-3">
                                                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full text-black" style={{ background: color }}>
                                                    ? MAX
                                                </span>
                                            </div>
                                        )}

                                        {/* Header */}
                                        <div className="flex items-center gap-2.5 mb-2.5">
                                            <div
                                                className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold text-black shrink-0"
                                                style={{ background: `linear-gradient(135deg, ${color}, ${color}CC)` }}
                                            >
                                                {skill.name.slice(0, 2).toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="text-[13px] font-bold truncate" style={{ color: 'var(--theme-text-primary)' }}>{skill.name}</h4>
                                                <p className="text-[10px]" style={{ color: 'var(--theme-text-muted)' }}>
                                                    Lv. {skill.level}/{skill.maxLevel}
                                                </p>
                                            </div>
                                        </div>

                                        <p className="text-[11px] leading-relaxed mb-3" style={{ color: 'var(--theme-text-tertiary)' }}>
                                            {skill.description}
                                        </p>

                                        {/* XP Bar */}
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--theme-input-bg)' }}>
                                                <div
                                                    className="h-full rounded-full transition-all duration-500"
                                                    style={{
                                                        width: `${pct}%`,
                                                        background: `linear-gradient(90deg, ${color}, ${color}AA)`,
                                                    }}
                                                />
                                            </div>
                                            <span
                                                className="text-[9px] font-bold shrink-0"
                                                style={{ color, fontFamily: "var(--font-jetbrains-mono)" }}
                                            >
                                                {skill.xp}/{skill.xpRequired}
                                            </span>
                                        </div>

                                        {/* Category tag */}
                                        <div className="mt-2.5 flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
                                            <span className="text-[9px] uppercase tracking-wider font-semibold" style={{ color: 'var(--theme-text-muted)' }}>
                                                {cat?.label}
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* -- Detail Panel -- */}
                    <div className="w-full lg:w-[320px] shrink-0">
                        <div className="rounded-2xl border overflow-hidden sticky top-6" style={{ background: 'var(--theme-card)', borderColor: 'var(--theme-border)' }}>
                            {selectedSkill ? (() => {
                                const cat = skillCategories.find((c) => c.key === selectedSkill.category);
                                const color = cat?.color || "#3CF91A";
                                return (
                                    <>
                                        {/* Detail header with gradient */}
                                        <div
                                            className="px-5 py-4"
                                            style={{
                                                background: `linear-gradient(135deg, ${color}15, ${color}05)`,
                                                borderBottom: '1px solid var(--theme-border)',
                                            }}
                                        >
                                            <div className="flex items-center gap-3 mb-2">
                                                <div
                                                    className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-black"
                                                    style={{ background: `linear-gradient(135deg, ${color}, ${color}BB)` }}
                                                >
                                                    {selectedSkill.name.slice(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <h3 className="text-base font-bold" style={{ color: 'var(--theme-text-primary)' }}>{selectedSkill.name}</h3>
                                                    <p className="text-[10px] uppercase tracking-wider font-semibold" style={{ color }}>
                                                        {cat?.label}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-5 space-y-5">
                                            <p className="text-[12px] leading-relaxed" style={{ color: 'var(--theme-text-tertiary)' }}>{selectedSkill.description}</p>

                                            {/* XP */}
                                            <div>
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <span className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: 'var(--theme-text-muted)' }}>Experience</span>
                                                    <span className="text-[11px] font-bold" style={{ color, fontFamily: "var(--font-jetbrains-mono)" }}>
                                                        {selectedSkill.xp}/{selectedSkill.xpRequired} XP
                                                    </span>
                                                </div>
                                                <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--theme-input-bg)' }}>
                                                    <div
                                                        className="h-full rounded-full transition-all duration-500"
                                                        style={{
                                                            width: `${(selectedSkill.xp / selectedSkill.xpRequired) * 100}%`,
                                                            background: `linear-gradient(90deg, ${color}, ${color}80)`,
                                                            boxShadow: `0 0 10px ${color}30`,
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Level blocks */}
                                            <div>
                                                <span className="text-[10px] uppercase tracking-widest font-semibold block mb-2" style={{ color: 'var(--theme-text-muted)' }}>Level Progress</span>
                                                <div className="flex items-center gap-1.5">
                                                    {Array.from({ length: selectedSkill.maxLevel }).map((_, i) => (
                                                        <div
                                                            key={i}
                                                            className="flex-1 h-4 rounded-md transition-all duration-300"
                                                            style={{
                                                                background: i < selectedSkill.level ? color : 'var(--theme-input-bg)',
                                                                boxShadow: i < selectedSkill.level ? `0 0 6px ${color}25` : "none",
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Unlocks */}
                                            {selectedSkill.children.length > 0 && (
                                                <div>
                                                    <span className="text-[10px] uppercase tracking-widest font-semibold block mb-2" style={{ color: 'var(--theme-text-muted)' }}>Unlocks</span>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {selectedSkill.children.map((childId) => {
                                                            const child = skillNodes.find((s) => s.id === childId);
                                                            const childCat = child ? skillCategories.find((c) => c.key === child.category) : null;
                                                            const childColor = childCat?.color || "#3CF91A";
                                                            return child ? (
                                                                <span
                                                                    key={childId}
                                                                    className="text-[10px] font-medium px-2.5 py-1 rounded-full"
                                                                    style={{
                                                                        background: `${childColor}12`,
                                                                        color: childColor,
                                                                        border: `1px solid ${childColor}25`,
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
                                            <div className="pt-3" style={{ borderTop: '1px solid var(--theme-border)' }}>
                                                <div className="flex items-center gap-2">
                                                    <span className={`w-2.5 h-2.5 rounded-full ${selectedSkill.level === selectedSkill.maxLevel
                                                        ? "bg-amber-400"
                                                        : selectedSkill.unlocked
                                                            ? "bg-[#3CF91A]"
                                                            : "bg-gray-400"
                                                        }`}
                                                        style={selectedSkill.level === selectedSkill.maxLevel ? { boxShadow: '0 0 8px #F59E0B40' } : selectedSkill.unlocked ? { boxShadow: '0 0 8px rgba(60, 249, 26, 0.4)' } : {}}
                                                    />
                                                    <span className="text-[11px] font-semibold" style={{ color: 'var(--theme-text-tertiary)', fontFamily: "var(--font-jetbrains-mono)" }}>
                                                        {selectedSkill.level === selectedSkill.maxLevel
                                                            ? "? MASTERED"
                                                            : selectedSkill.unlocked
                                                                ? "IN PROGRESS"
                                                                : "?? LOCKED"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                );
                            })() : (
                                <div className="p-8 text-center">
                                    <div className="w-14 h-14 mx-auto mb-3 rounded-2xl flex items-center justify-center" style={{ background: 'var(--theme-input-bg)', color: 'var(--theme-text-muted)' }}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
                                        </svg>
                                    </div>
                                    <p className="text-[13px] font-medium" style={{ color: 'var(--theme-text-muted)' }}>Select a skill to view details</p>
                                    <p className="text-[11px] mt-1" style={{ color: 'var(--theme-text-faint)' }}>Click any skill card to explore</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


