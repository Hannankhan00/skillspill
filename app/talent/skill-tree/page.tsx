"use client";

import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";

/* ═══════════════════════════════════════════════
   SKILL TREE — Interactive Tree Visualization
   Each category is its own "branch" with nodes
   connected by glowing lines.
   ═══════════════════════════════════════════════ */

/* -- Data Types -- */
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
    { key: "frontend", label: "Frontend", color: "#3CF91A", icon: "⚡" },
    { key: "backend", label: "Backend", color: "#3B82F6", icon: "⚙️" },
    { key: "devops", label: "DevOps", color: "#8B5CF6", icon: "🔧" },
    { key: "web3", label: "Web3", color: "#F59E0B", icon: "🔗" },
    { key: "ai", label: "AI / ML", color: "#EF4444", icon: "🧠" },
];

const DEFAULT_SKILL_NODES: SkillNode[] = [
    // Frontend
    { id: "html", name: "HTML5", category: "frontend", level: 5, maxLevel: 5, xp: 500, xpRequired: 500, unlocked: true, children: ["css", "js"], description: "Semantic markup & accessibility" },
    { id: "css", name: "CSS3", category: "frontend", level: 4, maxLevel: 5, xp: 380, xpRequired: 500, unlocked: true, children: ["tailwind", "animations"], description: "Layouts, Flexbox, Grid, responsive design" },
    { id: "js", name: "JavaScript", category: "frontend", level: 5, maxLevel: 5, xp: 500, xpRequired: 500, unlocked: true, children: ["ts", "react"], description: "ES6+, async/await, closures" },
    { id: "ts", name: "TypeScript", category: "frontend", level: 4, maxLevel: 5, xp: 420, xpRequired: 500, unlocked: true, children: ["nextjs"], description: "Type-safe JavaScript with generics & utility types" },
    { id: "react", name: "React", category: "frontend", level: 4, maxLevel: 5, xp: 400, xpRequired: 500, unlocked: true, children: ["nextjs"], description: "Component-based UI with hooks & context" },
    { id: "nextjs", name: "Next.js", category: "frontend", level: 3, maxLevel: 5, xp: 280, xpRequired: 500, unlocked: true, children: [], description: "SSR, SSG, App Router, Server Components" },
    { id: "tailwind", name: "Tailwind", category: "frontend", level: 3, maxLevel: 5, xp: 300, xpRequired: 500, unlocked: true, children: [], description: "Utility-first CSS framework" },
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
    { id: "github-actions", name: "GH Actions", category: "devops", level: 3, maxLevel: 5, xp: 300, xpRequired: 500, unlocked: true, children: [], description: "Workflow automation" },
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
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
    );
}
function StarIconSmall() {
    return (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
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
function TargetIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
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

/* ═══════════════════════════════════════════════
   buildTreeLayout — compute x,y positions for each
   node in a category to form a top-down tree
   ═══════════════════════════════════════════════ */

interface LayoutNode {
    id: string;
    x: number;
    y: number;
    row: number;
}

interface TreeEdge {
    from: string;
    to: string;
}

interface LayoutSizing {
    nodeW: number;
    gapX: number;
    rowH: number;
}

function buildTreeLayout(categoryKey: string, sizing: LayoutSizing, nodesData: SkillNode[]): { nodes: Map<string, LayoutNode>; edges: TreeEdge[]; rows: string[][] } {
    const catSkills = nodesData.filter(s => s.category === categoryKey);
    const childIds = new Set(catSkills.flatMap(s => s.children.filter(cid => catSkills.find(cs => cs.id === cid))));
    const roots = catSkills.filter(s => !childIds.has(s.id));

    const nodes = new Map<string, LayoutNode>();
    const edges: TreeEdge[] = [];

    // BFS to assign rows
    const rows: string[][] = [];
    const visited = new Set<string>();
    let currentLevel = roots.map(r => r.id);

    while (currentLevel.length > 0) {
        const row: string[] = [];
        const nextLevel: string[] = [];

        for (const nid of currentLevel) {
            if (visited.has(nid)) continue;
            visited.add(nid);
            row.push(nid);
            const node = catSkills.find(s => s.id === nid);
            if (node) {
                for (const cid of node.children) {
                    if (catSkills.find(s => s.id === cid) && !visited.has(cid)) {
                        nextLevel.push(cid);
                        edges.push({ from: nid, to: cid });
                    }
                }
            }
        }

        if (row.length > 0) rows.push(row);
        currentLevel = nextLevel;
    }

    // Add any orphaned nodes
    for (const s of catSkills) {
        if (!visited.has(s.id)) {
            const lastRow = rows.length > 0 ? rows.length - 1 : 0;
            if (rows[lastRow]) {
                rows[lastRow].push(s.id);
            } else {
                rows.push([s.id]);
            }
            visited.add(s.id);
        }
    }

    // Assign x,y — center each row
    const { nodeW, gapX, rowH } = sizing;

    for (let rowIdx = 0; rowIdx < rows.length; rowIdx++) {
        const row = rows[rowIdx];
        const totalWidth = row.length * nodeW + (row.length - 1) * gapX;
        const startX = -totalWidth / 2 + nodeW / 2;
        for (let col = 0; col < row.length; col++) {
            nodes.set(row[col], {
                id: row[col],
                x: startX + col * (nodeW + gapX),
                y: rowIdx * rowH,
                row: rowIdx,
            });
        }
    }

    return { nodes, edges, rows };
}

/* ═══════════════════════════════════════════════
   SINGLE TREE NODE COMPONENT
   ═══════════════════════════════════════════════ */

function TreeNode({
    skill,
    color,
    isSelected,
    onClick,
    scale = 1,
}: {
    skill: SkillNode;
    color: string;
    isSelected: boolean;
    onClick: () => void;
    scale?: number;
}) {
    const isMastered = skill.level === skill.maxLevel;
    const pct = Math.round((skill.xp / skill.xpRequired) * 100);

    // Scale dimensions
    const boxSize = Math.round(72 * scale);
    const nodeWidth = Math.round(120 * scale);
    const fontSize = Math.max(9, Math.round(13 * scale));
    const labelSize = Math.max(8, Math.round(10 * scale));
    const xpBarW = Math.round(56 * scale);
    const pipW = Math.max(4, Math.round(6 * scale));
    const pipH = Math.max(2, Math.round(3 * scale));
    const badgeSize = Math.round(20 * scale);

    return (
        <button
            onClick={onClick}
            className="relative flex flex-col items-center gap-1 group transition-all duration-300 bg-transparent border-none cursor-pointer"
            style={{ width: nodeWidth }}
        >
            {/* Glow ring */}
            {isSelected && (
                <div
                    className="absolute -inset-2 rounded-2xl pointer-events-none"
                    style={{
                        background: `radial-gradient(ellipse at center, ${color}18 0%, transparent 70%)`,
                        animation: "pulse 2s ease-in-out infinite",
                    }}
                />
            )}

            {/* Node box */}
            <div
                className={`relative rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${isSelected ? "scale-110" : ""}`}
                style={{
                    width: boxSize,
                    height: boxSize,
                    background: skill.unlocked
                        ? `linear-gradient(135deg, ${color}20, ${color}08)`
                        : "var(--theme-input-bg)",
                    border: `2px solid ${isSelected ? color : skill.unlocked ? `${color}50` : "var(--theme-border)"}`,
                    boxShadow: isSelected
                        ? `0 0 25px ${color}40, 0 0 50px ${color}15, inset 0 0 15px ${color}08`
                        : skill.unlocked
                            ? `0 0 10px ${color}12`
                            : "none",
                }}
            >
                {/* Lock overlay */}
                {!skill.unlocked && (
                    <div className="absolute inset-0 rounded-xl flex items-center justify-center bg-black/30 backdrop-blur-[1px]" style={{ color: "var(--theme-text-muted)" }}>
                        <LockIcon />
                    </div>
                )}

                {/* Mastered badge */}
                {isMastered && (
                    <div
                        className="absolute -top-2 -right-2 rounded-full flex items-center justify-center z-10"
                        style={{
                            width: badgeSize,
                            height: badgeSize,
                            background: color,
                            boxShadow: `0 0 10px ${color}80`,
                            color: "#000",
                        }}
                    >
                        <StarIconSmall />
                    </div>
                )}

                {/* Inner icon/label */}
                <span
                    className="font-black tracking-wide"
                    style={{
                        fontSize,
                        fontFamily: "var(--font-jetbrains-mono)",
                        color: skill.unlocked ? color : "var(--theme-text-muted)",
                        textShadow: skill.unlocked ? `0 0 12px ${color}50` : "none",
                        opacity: skill.unlocked ? 1 : 0.5,
                    }}
                >
                    {skill.name.slice(0, 3).toUpperCase()}
                </span>

                {/* Level pip row */}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex" style={{ gap: Math.max(1, 3 * scale) }}>
                    {Array.from({ length: skill.maxLevel }).map((_, i) => (
                        <div
                            key={i}
                            className="rounded-full"
                            style={{
                                width: pipW,
                                height: pipH,
                                background: i < skill.level ? color : "var(--theme-border)",
                                boxShadow: i < skill.level ? `0 0 4px ${color}50` : "none",
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Label */}
            <span
                className="font-bold uppercase tracking-wider text-center leading-tight mt-1"
                style={{
                    fontSize: labelSize,
                    fontFamily: "var(--font-jetbrains-mono)",
                    color: isSelected ? color : skill.unlocked ? "var(--theme-text-secondary)" : "var(--theme-text-muted)",
                    textShadow: isSelected ? `0 0 8px ${color}40` : "none",
                }}
            >
                {skill.name}
            </span>

            {/* XP Bar */}
            {skill.unlocked && (
                <div className="h-[3px] rounded-full overflow-hidden" style={{ width: xpBarW, background: "var(--theme-input-bg)" }}>
                    <div
                        className="h-full rounded-full"
                        style={{
                            width: `${pct}%`,
                            background: color,
                            boxShadow: `0 0 4px ${color}50`,
                        }}
                    />
                </div>
            )}
        </button>
    );
}

/* ═══════════════════════════════════════════════
   CATEGORY TREE — renders one category as a tree
   ═══════════════════════════════════════════════ */

function CategoryTree({
    categoryKey,
    selectedSkill,
    onSelectSkill,
    nodesData,
}: {
    categoryKey: string;
    selectedSkill: SkillNode | null;
    onSelectSkill: (skill: SkillNode) => void;
    nodesData: SkillNode[];
}) {
    const cat = skillCategories.find(c => c.key === categoryKey)!;
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(600);

    useEffect(() => {
        const measure = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.offsetWidth);
            }
        };
        measure();
        window.addEventListener("resize", measure);
        return () => window.removeEventListener("resize", measure);
    }, []);

    // Compute responsive sizing based on container width
    // Find the widest row for this category to determine the best scale
    const catSkills = nodesData.filter(s => s.category === categoryKey);
    const widestRowCount = useMemo(() => {
        // Quick BFS just to find the widest row count
        const childIds = new Set(catSkills.flatMap(s => s.children.filter(cid => catSkills.find(cs => cs.id === cid))));
        const roots = catSkills.filter(s => !childIds.has(s.id));
        let maxRow = roots.length;
        const visited = new Set<string>();
        let currentLevel = roots.map(r => r.id);
        while (currentLevel.length > 0) {
            const nextLevel: string[] = [];
            for (const nid of currentLevel) {
                if (visited.has(nid)) continue;
                visited.add(nid);
                const node = catSkills.find(s => s.id === nid);
                if (node) {
                    for (const cid of node.children) {
                        if (catSkills.find(s => s.id === cid) && !visited.has(cid)) {
                            nextLevel.push(cid);
                        }
                    }
                }
            }
            if (nextLevel.length > maxRow) maxRow = nextLevel.length;
            currentLevel = nextLevel;
        }
        return Math.max(1, maxRow);
    }, [categoryKey]);

    // Responsive sizing: scale down to fit container
    const desktopNodeW = 120;
    const desktopGapX = 32;
    const desktopRowH = 170;
    const padding = 40; // padding on each side

    const neededWidth = widestRowCount * desktopNodeW + (widestRowCount - 1) * desktopGapX;
    const availableWidth = containerWidth - padding;
    const scaleFactor = availableWidth > 0 ? Math.min(1, availableWidth / neededWidth) : 1;
    const clampedScale = Math.max(0.55, scaleFactor); // never go below 55%

    const nodeW = Math.round(desktopNodeW * clampedScale);
    const gapX = Math.round(desktopGapX * clampedScale);
    const rowH = Math.round(desktopRowH * clampedScale);

    const sizing: LayoutSizing = { nodeW, gapX, rowH };
    const { nodes: layoutNodes, edges } = useMemo(() => buildTreeLayout(categoryKey, sizing, nodesData), [categoryKey, nodeW, gapX, rowH, nodesData]);

    // Compute bounding box
    const allLayoutNodes = Array.from(layoutNodes.values());
    if (allLayoutNodes.length === 0) return null;

    const halfNodeW = nodeW / 2;
    const minX = Math.min(...allLayoutNodes.map(n => n.x)) - halfNodeW;
    const maxX = Math.max(...allLayoutNodes.map(n => n.x)) + halfNodeW;
    const maxY = Math.max(...allLayoutNodes.map(n => n.y));
    const treeWidth = maxX - minX;
    const treeHeight = maxY + rowH;
    const centerOffsetX = containerWidth / 2;

    // Scaled node content height for line coordinates
    const boxSize = Math.round(72 * clampedScale);
    const nodeContentH = boxSize + 20 * clampedScale; // box + pips + label + xp bar

    return (
        <div className="rounded-2xl border overflow-hidden" style={{ background: "var(--theme-card)", borderColor: "var(--theme-border)" }}>
            {/* Category header */}
            <div
                className="flex items-center gap-2.5 px-4 sm:px-5 py-3"
                style={{ borderBottom: `1px solid ${cat.color}20`, background: `${cat.color}06` }}
            >
                <span className="text-[16px]">{cat.icon}</span>
                <h2
                    className="text-[11px] sm:text-[12px] font-bold uppercase tracking-[2px]"
                    style={{ fontFamily: "var(--font-jetbrains-mono)", color: cat.color }}
                >
                    {cat.label}
                </h2>
                <span className="text-[9px] sm:text-[10px] ml-auto" style={{ color: "var(--theme-text-muted)", fontFamily: "var(--font-jetbrains-mono)" }}>
                    {nodesData.filter(s => s.category === categoryKey && s.unlocked).length}/
                    {nodesData.filter(s => s.category === categoryKey).length} UNLOCKED
                </span>
            </div>

            {/* Tree canvas — NO overflow-x so it never scrolls horizontally */}
            <div ref={containerRef} className="relative" style={{ minHeight: treeHeight + 40, padding: `${Math.round(20 * clampedScale)}px 0 ${Math.round(28 * clampedScale)}px` }}>
                {/* SVG Connections */}
                <svg
                    className="absolute top-0 left-0 pointer-events-none"
                    width={containerWidth}
                    height={treeHeight + 40}
                    style={{ overflow: "visible", zIndex: 1 }}
                >
                    <defs>
                        <filter id={`glow-${categoryKey}`} x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>
                    {edges.map((edge, i) => {
                        const fromNode = layoutNodes.get(edge.from);
                        const toNode = layoutNodes.get(edge.to);
                        if (!fromNode || !toNode) return null;

                        const fromSkill = nodesData.find(s => s.id === edge.from);
                        const toSkill = nodesData.find(s => s.id === edge.to);
                        const isActive = fromSkill?.unlocked && toSkill?.unlocked;

                        const topPad = Math.round(20 * clampedScale);
                        const x1 = fromNode.x - minX + (centerOffsetX - treeWidth / 2);
                        const y1 = fromNode.y + topPad + nodeContentH + 4 * clampedScale;
                        const x2 = toNode.x - minX + (centerOffsetX - treeWidth / 2);
                        const y2 = toNode.y + topPad - 4 * clampedScale;

                        const midY = (y1 + y2) / 2;

                        return (
                            <path
                                key={i}
                                d={`M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`}
                                fill="none"
                                stroke={isActive ? cat.color : "var(--theme-border)"}
                                strokeWidth={isActive ? 2 : 1}
                                strokeDasharray={isActive ? "none" : "4 4"}
                                opacity={isActive ? 0.6 : 0.3}
                                filter={isActive ? `url(#glow-${categoryKey})` : undefined}
                            />
                        );
                    })}
                </svg>

                {/* Nodes */}
                {allLayoutNodes.map(layoutNode => {
                    const skill = nodesData.find(s => s.id === layoutNode.id);
                    if (!skill) return null;
                    const x = layoutNode.x - minX + (centerOffsetX - treeWidth / 2) - halfNodeW;
                    const y = layoutNode.y + Math.round(20 * clampedScale);

                    return (
                        <div
                            key={skill.id}
                            className="absolute"
                            style={{ left: x, top: y, zIndex: 10, isolation: "isolate" }}
                        >
                            <TreeNode
                                skill={skill}
                                color={cat.color}
                                isSelected={selectedSkill?.id === skill.id}
                                onClick={() => onSelectSkill(skill)}
                                scale={clampedScale}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════
   SKILL DETAIL PANEL (sidebar)
   ═══════════════════════════════════════════════ */

function SkillDetailPanel({ skill, onClose, nodesData }: { skill: SkillNode | null; onClose: () => void; nodesData: SkillNode[] }) {
    if (!skill) {
        return (
            <div className="rounded-2xl border overflow-hidden sticky top-6" style={{ background: "var(--theme-card)", borderColor: "var(--theme-border)" }}>
                <div className="p-8 text-center">
                    <div className="w-14 h-14 mx-auto mb-3 rounded-2xl flex items-center justify-center" style={{ background: "var(--theme-input-bg)", color: "var(--theme-text-muted)" }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
                        </svg>
                    </div>
                    <p className="text-[13px] font-medium" style={{ color: "var(--theme-text-muted)" }}>Select a skill to view details</p>
                    <p className="text-[11px] mt-1" style={{ color: "var(--theme-text-faint)" }}>Click any node in the tree</p>
                </div>
            </div>
        );
    }

    const cat = skillCategories.find(c => c.key === skill.category);
    const color = cat?.color || "#3CF91A";
    const pct = Math.round((skill.xp / skill.xpRequired) * 100);

    return (
        <div className="rounded-2xl border overflow-hidden sticky top-6" style={{ background: "var(--theme-card)", borderColor: "var(--theme-border)" }}>
            {/* Header with gradient */}
            <div className="px-5 py-4" style={{ background: `linear-gradient(135deg, ${color}15, ${color}05)`, borderBottom: "1px solid var(--theme-border)" }}>
                <div className="flex items-center gap-3">
                    <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold text-black shrink-0"
                        style={{ background: `linear-gradient(135deg, ${color}, ${color}BB)`, boxShadow: `0 0 20px ${color}30` }}
                    >
                        {skill.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                        <h3 className="text-[15px] font-bold" style={{ color: "var(--theme-text-primary)" }}>{skill.name}</h3>
                        <p className="text-[10px] uppercase tracking-wider font-semibold" style={{ color }}>
                            {cat?.label} • Lv. {skill.level}/{skill.maxLevel}
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-5 space-y-5">
                <p className="text-[12px] leading-relaxed" style={{ color: "var(--theme-text-tertiary)" }}>{skill.description}</p>

                {/* XP Bar */}
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: "var(--theme-text-muted)" }}>Experience</span>
                        <span className="text-[11px] font-bold" style={{ color, fontFamily: "var(--font-jetbrains-mono)" }}>
                            {skill.xp}/{skill.xpRequired} XP
                        </span>
                    </div>
                    <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "var(--theme-input-bg)" }}>
                        <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                                width: `${pct}%`,
                                background: `linear-gradient(90deg, ${color}, ${color}80)`,
                                boxShadow: `0 0 10px ${color}30`,
                            }}
                        />
                    </div>
                </div>

                {/* Level blocks */}
                <div>
                    <span className="text-[10px] uppercase tracking-widest font-semibold block mb-2" style={{ color: "var(--theme-text-muted)" }}>Level Progress</span>
                    <div className="flex items-center gap-1.5">
                        {Array.from({ length: skill.maxLevel }).map((_, i) => (
                            <div
                                key={i}
                                className="flex-1 h-4 rounded-md transition-all duration-300"
                                style={{
                                    background: i < skill.level ? color : "var(--theme-input-bg)",
                                    boxShadow: i < skill.level ? `0 0 6px ${color}25` : "none",
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Unlocks */}
                {skill.children.length > 0 && (
                    <div>
                        <span className="text-[10px] uppercase tracking-widest font-semibold block mb-2" style={{ color: "var(--theme-text-muted)" }}>Unlocks</span>
                        <div className="flex flex-wrap gap-1.5">
                            {skill.children.map(childId => {
                                const child = nodesData.find(s => s.id === childId);
                                const childCat = child ? skillCategories.find(c => c.key === child.category) : null;
                                const childColor = childCat?.color || "#3CF91A";
                                return child ? (
                                    <span key={childId} className="text-[10px] font-medium px-2.5 py-1 rounded-full"
                                        style={{ background: `${childColor}12`, color: childColor, border: `1px solid ${childColor}25` }}>
                                        {child.name}
                                    </span>
                                ) : null;
                            })}
                        </div>
                    </div>
                )}

                {/* Status */}
                <div className="pt-3" style={{ borderTop: "1px solid var(--theme-border)" }}>
                    <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${skill.level === skill.maxLevel ? "bg-amber-400" : skill.unlocked ? "bg-[#3CF91A]" : "bg-gray-400"}`}
                            style={skill.level === skill.maxLevel ? { boxShadow: "0 0 8px #F59E0B40" } : skill.unlocked ? { boxShadow: "0 0 8px rgba(60,249,26,0.4)" } : {}}
                        />
                        <span className="text-[11px] font-semibold" style={{ color: "var(--theme-text-tertiary)", fontFamily: "var(--font-jetbrains-mono)" }}>
                            {skill.level === skill.maxLevel ? "⭐ MASTERED" : skill.unlocked ? "IN PROGRESS" : "🔒 LOCKED"}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════ */

export default function SkillTreePage() {
    const [activeCategory, setActiveCategory] = useState<string>("all");
    const [selectedSkill, setSelectedSkill] = useState<SkillNode | null>(null);
    const [activeNodes, setActiveNodes] = useState<SkillNode[]>(DEFAULT_SKILL_NODES);

    useEffect(() => {
        fetch("/api/user/github")
            .then(r => r.json())
            .then(data => {
                if (data.languageStats) {
                    const map: Record<string, string> = { "HTML": "html", "CSS": "css", "JavaScript": "js", "TypeScript": "ts", "Python": "python", "Rust": "rust", "Solidity": "solidity" };
                    setActiveNodes(prev => prev.map(node => {
                        const ghName = Object.keys(map).find(k => map[k] === node.id);
                        if (ghName && data.languageStats[ghName]) {
                            const bonusXp = data.languageStats[ghName] * 100;
                            const newXp = Math.min(node.xpRequired, node.xp + bonusXp);
                            const newLevel = Math.min(node.maxLevel, Math.max(1, Math.floor((newXp / node.xpRequired) * node.maxLevel)));
                            return { ...node, unlocked: true, xp: newXp, level: newLevel };
                        }
                        return node;
                    }));
                }
            })
            .catch(console.error);
    }, []);

    const totalXP = activeNodes.reduce((acc, s) => acc + s.xp, 0);
    const totalMaxXP = activeNodes.reduce((acc, s) => acc + s.xpRequired, 0);
    const unlockedCount = activeNodes.filter(s => s.unlocked).length;
    const maxedCount = activeNodes.filter(s => s.level === s.maxLevel).length;
    const overallPct = totalMaxXP > 0 ? Math.round((totalXP / totalMaxXP) * 100) : 0;

    const categoriesToShow = activeCategory === "all"
        ? skillCategories.map(c => c.key)
        : [activeCategory];

    return (
        <div className="min-h-full" style={{ background: "var(--theme-bg)" }}>
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-5">

                {/* -- Header -- */}
                <div className="mb-6">
                    <h1 className="text-2xl lg:text-3xl font-bold tracking-tight" style={{ color: "var(--theme-text-primary)", fontFamily: "var(--font-space-grotesk)" }}>
                        🌳 Skill Tree
                    </h1>
                    <p className="text-[13px] mt-1" style={{ color: "var(--theme-text-muted)" }}>
                        Map your expertise. Unlock new capabilities. <span className="text-[#3CF91A] font-semibold">Level up.</span>
                    </p>
                </div>

                {/* -- Stats Overview -- */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                    {[
                        { icon: <ZapIcon />, label: "Total XP", value: totalXP.toLocaleString(), sub: `/ ${totalMaxXP.toLocaleString()}`, color: "#3CF91A" },
                        { icon: <TargetIcon />, label: "Unlocked", value: `${unlockedCount}`, sub: `/ ${activeNodes.length}`, color: "#3B82F6" },
                        { icon: <StarIcon />, label: "Mastered", value: `${maxedCount}`, sub: "skills", color: "#F59E0B" },
                        { icon: <TrophyIcon />, label: "Overall", value: `${overallPct}%`, sub: "complete", color: "#8B5CF6" },
                    ].map((stat, i) => (
                        <div key={i} className="rounded-2xl border p-4 transition-all hover:shadow-md" style={{ background: "var(--theme-card)", borderColor: "var(--theme-border)" }}>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${stat.color}15`, color: stat.color }}>
                                    {stat.icon}
                                </div>
                                <span className="text-[10px] uppercase tracking-widest font-semibold" style={{ color: "var(--theme-text-muted)" }}>{stat.label}</span>
                            </div>
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-xl font-bold" style={{ color: "var(--theme-text-primary)", fontFamily: "var(--font-jetbrains-mono)" }}>{stat.value}</span>
                                <span className="text-[11px]" style={{ color: "var(--theme-text-muted)" }}>{stat.sub}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* -- XP Progress Bar -- */}
                <div className="rounded-2xl border p-4 mb-6" style={{ background: "var(--theme-card)", borderColor: "var(--theme-border)" }}>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--theme-text-muted)" }}>Overall Progress</span>
                        <span className="text-[12px] font-bold" style={{ color: "#3CF91A", fontFamily: "var(--font-jetbrains-mono)" }}>{overallPct}%</span>
                    </div>
                    <div className="h-3 rounded-full overflow-hidden" style={{ background: "var(--theme-input-bg)" }}>
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${overallPct}%`, background: "linear-gradient(90deg, #3CF91A, #3B82F6, #8B5CF6)", boxShadow: "0 0 12px rgba(60,249,26,0.3)" }} />
                    </div>
                </div>

                {/* -- Category Filter -- */}
                <div className="flex items-center gap-2 mb-6 flex-wrap">
                    <button
                        onClick={() => setActiveCategory("all")}
                        className="px-4 py-2 rounded-xl text-[12px] font-semibold transition-all duration-200 border-none cursor-pointer"
                        style={activeCategory === "all"
                            ? { background: "var(--theme-text-primary)", color: "var(--theme-bg)" }
                            : { background: "var(--theme-card)", color: "var(--theme-text-muted)", border: "1px solid var(--theme-border)" }
                        }
                    >
                        All Skills
                    </button>
                    {skillCategories.map(cat => (
                        <button
                            key={cat.key}
                            onClick={() => setActiveCategory(cat.key)}
                            className="px-4 py-2 rounded-xl text-[12px] font-semibold transition-all duration-200 cursor-pointer border-none"
                            style={activeCategory === cat.key
                                ? { background: cat.color, color: "#fff", boxShadow: `0 4px 15px ${cat.color}40` }
                                : { background: "var(--theme-card)", color: "var(--theme-text-muted)", border: "1px solid var(--theme-border)" }
                            }
                        >
                            {cat.icon} {cat.label}
                        </button>
                    ))}
                </div>

                {/* -- Main Content: Trees + Detail Panel -- */}
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Tree Visualizations */}
                    <div className="flex-1 min-w-0 space-y-4">
                        {categoriesToShow.map(catKey => (
                            <CategoryTree
                                key={catKey}
                                categoryKey={catKey}
                                selectedSkill={selectedSkill}
                                onSelectSkill={setSelectedSkill}
                                nodesData={activeNodes}
                            />
                        ))}
                    </div>

                    {/* Detail Panel */}
                    <div className="w-full lg:w-[320px] shrink-0">
                        <SkillDetailPanel
                            skill={selectedSkill}
                            onClose={() => setSelectedSkill(null)}
                            nodesData={activeNodes}
                        />
                    </div>
                </div>
            </div>

            {/* Pulse animation */}
            <style jsx>{`
                @keyframes pulse {
                    0%, 100% { opacity: 0.4; }
                    50% { opacity: 0.8; }
                }
            `}</style>
        </div>
    );
}
