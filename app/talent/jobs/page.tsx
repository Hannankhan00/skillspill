"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";

/* ═══════════════════════════════════════════════
   SVG Icon Components
   ═══════════════════════════════════════════════ */

function GridIcon({ active }: { active: boolean }) {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? "#3CF91A" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
        </svg>
    );
}

function ListIcon({ active }: { active: boolean }) {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? "#3CF91A" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
    );
}

function FilterIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        </svg>
    );
}

function ChevronDownIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
        </svg>
    );
}

function CheckIcon() {
    return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
}

function SearchIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
    );
}

/* ═══════════════════════════════════════════════
   Mission / Job Icon Avatars (colored abstract icons)
   ═══════════════════════════════════════════════ */

function MissionIcon({ variant }: { variant: number }) {
    const icons = [
        <svg key="0" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="#3CF91A" stroke="#3CF91A" strokeWidth="0.5" />
        </svg>,
        <svg key="1" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00D2FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>,
        <svg key="2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#A855F7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 15c6.667-6 13.333 0 20-6" /><path d="M9 22c1.798-1.998 2.518-3.995 2.807-5.993" /><path d="M15 2c-1.798 1.998-2.518 3.995-2.807 5.993" /><path d="M2 9c6.667 6 13.333 0 20 6" />
        </svg>,
        <svg key="3" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00D2FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>,
        <svg key="4" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF9F43" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
        </svg>,
    ];
    return icons[variant % icons.length];
}

/* ═══════════════════════════════════════════════
   Custom Checkbox
   ═══════════════════════════════════════════════ */

function Checkbox({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
    return (
        <button
            onClick={onChange}
            className="flex items-center gap-2.5 text-left bg-transparent border-none cursor-pointer group py-1"
        >
            <span
                className={`w-4 h-4 rounded flex items-center justify-center shrink-0 transition-all duration-200 ${checked
                    ? "bg-[#3CF91A]"
                    : "bg-transparent"
                    }`}
                style={{ border: checked ? "none" : "1.5px solid var(--theme-border)" }}
            >
                {checked && <CheckIcon />}
            </span>
            <span
                className="text-[12px] transition-colors"
                style={{ color: checked ? "var(--theme-text-secondary)" : "var(--theme-text-muted)" }}
            >
                {label}
            </span>
        </button>
    );
}

/* ═══════════════════════════════════════════════
   Mock Job Data
   ═══════════════════════════════════════════════ */

interface Job {
    id: number;
    title: string;
    company: string;
    location: string;
    salaryMin: number;
    salaryMax: number;
    tags: string[];
    iconVariant: number;
    isPriority: boolean;
    type: "fulltime" | "contract" | "retainer";
    isRemote: boolean;
}

const allJobs: Job[] = [
    {
        id: 1, title: "Core Systems Architect", company: "Cyberdyne Dynamics", location: "Neo Tokyo, JP",
        salaryMin: 190, salaryMax: 240, tags: ["Rust", "gRPC", "K8s", "Critical Priority"],
        iconVariant: 0, isPriority: true, type: "fulltime", isRemote: false,
    },
    {
        id: 2, title: "Lead Smart Contract Engineer", company: "Nebula Protocol", location: "Fully Remote",
        salaryMin: 160, salaryMax: 210, tags: ["Solidity", "Security Audit", "Web3"],
        iconVariant: 1, isPriority: false, type: "contract", isRemote: true,
    },
    {
        id: 3, title: "Bio-Sim Pipeline Specialist", company: "Helix Synthesis", location: "London, UK",
        salaryMin: 140, salaryMax: 185, tags: ["C++", "PyTorch", "CUDA"],
        iconVariant: 2, isPriority: false, type: "fulltime", isRemote: false,
    },
    {
        id: 4, title: "Distributed Cloud Architect", company: "SkyNet Edge", location: "Global Remote",
        salaryMin: 175, salaryMax: 225, tags: ["Go", "Terraform", "WASM"],
        iconVariant: 3, isPriority: false, type: "fulltime", isRemote: true,
    },
    {
        id: 5, title: "Senior Rust Systems Dev", company: "Quantum Forge", location: "San Francisco, US",
        salaryMin: 200, salaryMax: 280, tags: ["Rust", "WASM", "Linux"],
        iconVariant: 4, isPriority: false, type: "fulltime", isRemote: false,
    },
    {
        id: 6, title: "DevOps Platform Engineer", company: "Atlas Cloud", location: "Berlin, DE",
        salaryMin: 130, salaryMax: 170, tags: ["Go", "K8s", "Terraform"],
        iconVariant: 3, isPriority: false, type: "retainer", isRemote: true,
    },
    {
        id: 7, title: "ML Infrastructure Lead", company: "Nexus AI Labs", location: "Remote (US)",
        salaryMin: 185, salaryMax: 250, tags: ["Python", "PyTorch", "CUDA"],
        iconVariant: 2, isPriority: true, type: "fulltime", isRemote: true,
    },
    {
        id: 8, title: "Zero-Knowledge Proof Researcher", company: "Cipher DAO", location: "Fully Remote",
        salaryMin: 170, salaryMax: 230, tags: ["Rust", "Solidity", "Cryptography"],
        iconVariant: 1, isPriority: false, type: "contract", isRemote: true,
    },
];

const techStackOptions = ["Rust", "Solidity", "Go", "WASM", "Python", "C++", "K8s", "PyTorch", "Terraform"];

/* ═══════════════════════════════════════════════
   JOBS PAGE COMPONENT
   ═══════════════════════════════════════════════ */

export default function JobsPage() {
    /* —— State —— */
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("list");

    // Filters
    const [bountyTypes, setBountyTypes] = useState({
        fulltime: true,
        contract: true,
        retainer: true,
    });
    const [selectedTechs, setSelectedTechs] = useState<string[]>(["Rust", "Solidity", "Go", "WASM", "Python", "C++"]);
    const [salaryRange, setSalaryRange] = useState([120, 280]);
    const [remoteStatus, setRemoteStatus] = useState("all");

    /* —— Handlers —— */
    const toggleBountyType = (key: keyof typeof bountyTypes) => {
        setBountyTypes((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const toggleTech = (tech: string) => {
        setSelectedTechs((prev) =>
            prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]
        );
    };

    /* —— Filtered Jobs —— */
    const filteredJobs = useMemo(() => {
        return allJobs.filter((job) => {
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                const matchesSearch =
                    job.title.toLowerCase().includes(q) ||
                    job.company.toLowerCase().includes(q) ||
                    job.tags.some((t) => t.toLowerCase().includes(q));
                if (!matchesSearch) return false;
            }
            if (!bountyTypes[job.type]) return false;
            if (selectedTechs.length > 0) {
                const jobTechTags = job.tags.filter((t) => t !== "Critical Priority");
                const hasMatchingTech = jobTechTags.some((t) => selectedTechs.includes(t));
                if (!hasMatchingTech) return false;
            }
            if (job.salaryMax < salaryRange[0] || job.salaryMin > salaryRange[1]) return false;
            if (remoteStatus === "remote" && !job.isRemote) return false;
            if (remoteStatus === "onsite" && job.isRemote) return false;
            return true;
        });
    }, [searchQuery, bountyTypes, selectedTechs, salaryRange, remoteStatus]);

    const formatSalary = (v: number) => `$${v}k`;

    return (
        <div style={{ background: "var(--theme-bg)" }} className="min-h-full">
            <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-5">
                <div className="flex flex-col lg:flex-row gap-6">

                    {/* ════════ LEFT: Mission Listings (main content) ════════ */}
                    <div className="flex-1 min-w-0 space-y-4">

                        {/* —— Header + Search —— */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-baseline gap-3">
                                <h1
                                    className="text-xl lg:text-2xl font-bold tracking-tight"
                                    style={{ fontFamily: "var(--font-space-grotesk)", color: "var(--theme-text-primary)" }}
                                >
                                    Mission Opportunities
                                </h1>
                                <span
                                    className="text-[12px]"
                                    style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--theme-text-muted)" }}
                                >
                                    ({filteredJobs.length} found)
                                </span>
                            </div>

                            {/* View Mode Toggle */}
                            <div className="flex items-center gap-1 p-1 rounded-lg border border-[var(--theme-border)]" style={{ background: "var(--theme-input-bg)" }}>
                                <button
                                    onClick={() => setViewMode("grid")}
                                    className="p-1.5 rounded-md transition-all duration-200 cursor-pointer border-none"
                                    style={{
                                        background: viewMode === "grid" ? "var(--theme-bg-secondary)" : "transparent",
                                        color: viewMode === "grid" ? "#3CF91A" : "var(--theme-text-muted)",
                                    }}
                                >
                                    <GridIcon active={viewMode === "grid"} />
                                </button>
                                <button
                                    onClick={() => setViewMode("list")}
                                    className="p-1.5 rounded-md transition-all duration-200 cursor-pointer border-none"
                                    style={{
                                        background: viewMode === "list" ? "var(--theme-bg-secondary)" : "transparent",
                                        color: viewMode === "list" ? "#3CF91A" : "var(--theme-text-muted)",
                                    }}
                                >
                                    <ListIcon active={viewMode === "list"} />
                                </button>
                            </div>
                        </div>

                        {/* —— Search Bar (inline, like composer in feed) —— */}
                        <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm p-4">
                            <div className="relative">
                                <div className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--theme-text-muted)" }}>
                                    <SearchIcon />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search missions, tech stacks, or companies..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 rounded-xl text-[13px] outline-none focus:border-[#3CF91A] focus:ring-2 focus:ring-[#3CF91A]/10 transition-all duration-200"
                                    style={{
                                        fontFamily: "var(--font-space-grotesk)",
                                        background: "var(--theme-bg-secondary)",
                                        border: "1px solid var(--theme-border)",
                                        color: "var(--theme-text-primary)",
                                    }}
                                />
                            </div>
                        </div>

                        {/* —— Job Cards —— */}
                        <div className={viewMode === "grid"
                            ? "grid grid-cols-1 md:grid-cols-2 gap-4"
                            : "flex flex-col gap-3"
                        }>
                            {filteredJobs.map((job) => (
                                <Link key={job.id} href={`/talent/jobs/${job.id}`} className="block no-underline">
                                    <article
                                        className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm hover:border-[#3CF91A]/30 hover:shadow-md transition-all duration-300 group cursor-pointer overflow-hidden"
                                    >
                                        <div className={`flex items-start justify-between px-5 py-4 ${viewMode === "list" ? "flex-row" : "flex-col gap-3"}`}>
                                            {/* Left: Icon + Info */}
                                            <div className="flex items-start gap-4 flex-1 min-w-0">
                                                {/* Icon Avatar */}
                                                <div
                                                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-105"
                                                    style={{
                                                        background: job.iconVariant === 0 ? "rgba(60,249,26,0.1)"
                                                            : job.iconVariant === 1 ? "rgba(0,210,255,0.1)"
                                                                : job.iconVariant === 2 ? "rgba(168,85,247,0.1)"
                                                                    : job.iconVariant === 3 ? "rgba(0,210,255,0.1)"
                                                                        : "rgba(255,159,67,0.1)",
                                                        border: `1px solid ${job.iconVariant === 0 ? "rgba(60,249,26,0.2)"
                                                            : job.iconVariant === 1 ? "rgba(0,210,255,0.2)"
                                                                : job.iconVariant === 2 ? "rgba(168,85,247,0.2)"
                                                                    : job.iconVariant === 3 ? "rgba(0,210,255,0.2)"
                                                                        : "rgba(255,159,67,0.2)"
                                                            }`,
                                                    }}
                                                >
                                                    <MissionIcon variant={job.iconVariant} />
                                                </div>

                                                {/* Text Info */}
                                                <div className="min-w-0 flex-1">
                                                    <h3
                                                        className="text-[14px] font-bold truncate transition-colors"
                                                        style={{
                                                            fontFamily: "var(--font-space-grotesk)",
                                                            color: "var(--theme-text-primary)",
                                                        }}
                                                    >
                                                        {job.title}
                                                    </h3>
                                                    <p className="text-[11px] mt-0.5" style={{ color: "var(--theme-text-muted)" }}>
                                                        {job.company} &bull; {job.location}
                                                    </p>

                                                    {/* Tags */}
                                                    <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
                                                        {job.tags.map((tag) => {
                                                            const isCritical = tag === "Critical Priority";
                                                            return (
                                                                <span
                                                                    key={tag}
                                                                    className="text-[9px] px-2 py-[3px] rounded-full font-semibold transition-all duration-200"
                                                                    style={{
                                                                        fontFamily: "var(--font-jetbrains-mono)",
                                                                        ...(isCritical
                                                                            ? {
                                                                                background: "#3CF91A15",
                                                                                color: "#3CF91A",
                                                                                border: "1px solid #3CF91A30",
                                                                            }
                                                                            : {
                                                                                background: "var(--theme-bg-secondary)",
                                                                                color: "var(--theme-text-muted)",
                                                                                border: "1px solid var(--theme-border)",
                                                                            }),
                                                                    }}
                                                                >
                                                                    {tag}
                                                                </span>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right: Salary */}
                                            <div className={`shrink-0 ${viewMode === "list" ? "text-right ml-4" : "w-full flex justify-end"}`}>
                                                <span
                                                    className="text-[14px] font-bold text-[#3CF91A] whitespace-nowrap"
                                                    style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                                                >
                                                    {formatSalary(job.salaryMin)}{" "}
                                                    <span style={{ color: "var(--theme-text-muted)" }}>-</span>{" "}
                                                    {formatSalary(job.salaryMax)}
                                                </span>
                                            </div>
                                        </div>
                                    </article>
                                </Link>
                            ))}

                            {/* Empty State */}
                            {filteredJobs.length === 0 && (
                                <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm p-12 text-center">
                                    <p className="text-[14px] font-semibold mb-1" style={{ color: "var(--theme-text-secondary)" }}>No missions found</p>
                                    <p className="text-[12px]" style={{ color: "var(--theme-text-muted)" }}>Try adjusting your filters or search query</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ════════ RIGHT SIDEBAR: Filters ════════ */}
                    <div className="w-full lg:w-[280px] shrink-0 space-y-4">

                        {/* —— Filters Card —— */}
                        <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm overflow-hidden">
                            <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--theme-border-light)]" style={{ color: "var(--theme-text-muted)" }}>
                                <FilterIcon />
                                <h2
                                    className="text-[11px] font-bold uppercase tracking-[2px]"
                                    style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--theme-text-muted)" }}
                                >
                                    Filters
                                </h2>
                            </div>

                            <div className="p-4 space-y-5">
                                {/* —— Bounty Type —— */}
                                <div>
                                    <h3
                                        className="text-[11px] font-bold mb-2.5"
                                        style={{ fontFamily: "var(--font-space-grotesk)", color: "var(--theme-text-secondary)" }}
                                    >
                                        Bounty Type
                                    </h3>
                                    <div className="space-y-0.5">
                                        <Checkbox checked={bountyTypes.fulltime} onChange={() => toggleBountyType("fulltime")} label="Full-time Mission" />
                                        <Checkbox checked={bountyTypes.contract} onChange={() => toggleBountyType("contract")} label="Smart Contract Bounty" />
                                        <Checkbox checked={bountyTypes.retainer} onChange={() => toggleBountyType("retainer")} label="Tactical Retainer" />
                                    </div>
                                </div>

                                {/* —— Tech Stack —— */}
                                <div className="pt-4" style={{ borderTop: "1px solid var(--theme-border-light)" }}>
                                    <h3
                                        className="text-[11px] font-bold mb-2.5"
                                        style={{ fontFamily: "var(--font-space-grotesk)", color: "var(--theme-text-secondary)" }}
                                    >
                                        Tech Stack
                                    </h3>
                                    <div className="flex flex-wrap gap-1.5">
                                        {techStackOptions.map((tech) => {
                                            const isActive = selectedTechs.includes(tech);
                                            return (
                                                <button
                                                    key={tech}
                                                    onClick={() => toggleTech(tech)}
                                                    className="px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer border-none"
                                                    style={{
                                                        fontFamily: "var(--font-jetbrains-mono)",
                                                        background: isActive ? "#3CF91A" : "var(--theme-bg-secondary)",
                                                        color: isActive ? "#000" : "var(--theme-text-muted)",
                                                        boxShadow: isActive ? "0 0 10px #3CF91A30" : "none",
                                                    }}
                                                >
                                                    {tech}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* —— Comp. Range (USD) —— */}
                                <div className="pt-4" style={{ borderTop: "1px solid var(--theme-border-light)" }}>
                                    <h3
                                        className="text-[11px] font-bold mb-2.5"
                                        style={{ fontFamily: "var(--font-space-grotesk)", color: "var(--theme-text-secondary)" }}
                                    >
                                        Comp. Range (USD)
                                    </h3>
                                    <div className="px-1">
                                        <input
                                            type="range"
                                            min={80}
                                            max={300}
                                            value={salaryRange[1]}
                                            onChange={(e) => setSalaryRange([salaryRange[0], Number(e.target.value)])}
                                            className="w-full accent-[#3CF91A]"
                                            style={{
                                                height: "4px",
                                                appearance: "none",
                                                WebkitAppearance: "none",
                                                background: `linear-gradient(to right, #3CF91A ${((salaryRange[1] - 80) / (300 - 80)) * 100}%, var(--theme-input-bg) ${((salaryRange[1] - 80) / (300 - 80)) * 100}%)`,
                                                borderRadius: "4px",
                                                outline: "none",
                                                cursor: "pointer",
                                            }}
                                        />
                                        <div className="flex items-center justify-between mt-2">
                                            <span
                                                className="text-[10px]"
                                                style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--theme-text-muted)" }}
                                            >
                                                ${salaryRange[0]}k
                                            </span>
                                            <span
                                                className="text-[10px] text-[#3CF91A] font-bold"
                                                style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                                            >
                                                ${salaryRange[1]}k+
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* —— Remote Status —— */}
                                <div className="pt-4" style={{ borderTop: "1px solid var(--theme-border-light)" }}>
                                    <h3
                                        className="text-[11px] font-bold mb-2.5"
                                        style={{ fontFamily: "var(--font-space-grotesk)", color: "var(--theme-text-secondary)" }}
                                    >
                                        Remote Status
                                    </h3>
                                    <div className="relative">
                                        <select
                                            value={remoteStatus}
                                            onChange={(e) => setRemoteStatus(e.target.value)}
                                            className="w-full px-3.5 py-2.5 rounded-xl text-[12px] appearance-none focus:border-[#3CF91A] focus:ring-2 focus:ring-[#3CF91A]/10 focus:outline-none transition-colors cursor-pointer"
                                            style={{
                                                fontFamily: "var(--font-space-grotesk)",
                                                background: "var(--theme-input-bg)",
                                                border: "1px solid var(--theme-border)",
                                                color: "var(--theme-text-secondary)",
                                            }}
                                        >
                                            <option value="all">All (Interstellar)</option>
                                            <option value="remote">Remote Only</option>
                                            <option value="onsite">On-site Only</option>
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--theme-text-muted)" }}>
                                            <ChevronDownIcon />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* —— Quick Stats Card (like feed sidebar cards) —— */}
                        <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm overflow-hidden">
                            <div className="px-4 py-3 border-b border-[var(--theme-border-light)]">
                                <h3 className="text-[11px] font-bold uppercase tracking-[2px]"
                                    style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--theme-text-muted)" }}>
                                    📊 Market Pulse
                                </h3>
                            </div>
                            <div className="divide-y divide-[var(--theme-border-light)]">
                                {[
                                    { label: "Active Missions", value: "2,847", trend: "+12%" },
                                    { label: "Avg. Salary", value: "$185k", trend: "+8%" },
                                    { label: "Remote Ratio", value: "73%", trend: "+5%" },
                                ].map((stat) => (
                                    <div key={stat.label} className="flex items-center justify-between px-4 py-2.5">
                                        <span className="text-[12px]" style={{ color: "var(--theme-text-secondary)" }}>{stat.label}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[12px] font-bold" style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--theme-text-primary)" }}>
                                                {stat.value}
                                            </span>
                                            <span className="text-[9px] font-bold text-[#3CF91A]" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>
                                                {stat.trend}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom styles for range input */}
            <style jsx>{`
                input[type="range"]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: #3CF91A;
                    cursor: pointer;
                    box-shadow: 0 0 8px #3CF91A60;
                    border: 2px solid var(--theme-bg);
                }
                input[type="range"]::-moz-range-thumb {
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: #3CF91A;
                    cursor: pointer;
                    box-shadow: 0 0 8px #3CF91A60;
                    border: 2px solid var(--theme-bg);
                }
                select option {
                    background: var(--theme-surface);
                    color: var(--theme-text-secondary);
                }
            `}</style>
        </div>
    );
}
