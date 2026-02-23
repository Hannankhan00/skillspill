"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

/* ═══════════════════════════════════════════════════
   ICON COMPONENTS
   ═══════════════════════════════════════════════════ */

function ArrowRightIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
        </svg>
    );
}

function MapPinIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
        </svg>
    );
}

function TerminalIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3CF91A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" />
        </svg>
    );
}

function ChevronLeftIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
        </svg>
    );
}

function ChevronRightIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
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

function BellIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
    );
}

/* ─── Tech Stack Icons ─── */

function GolangIcon() {
    return (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#3CF91A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 15l4-8h2l-4 8H3z" />
            <circle cx="15" cy="11" r="4" />
            <path d="M19 7v8" />
        </svg>
    );
}

function KubernetesIcon() {
    return (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#3CF91A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 3v18" /><path d="M3 12h18" />
            <path d="M5.636 5.636l12.728 12.728" /><path d="M18.364 5.636L5.636 18.364" />
        </svg>
    );
}

function PostgresIcon() {
    return (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#3CF91A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <ellipse cx="12" cy="6" rx="8" ry="3" />
            <path d="M4 6v6c0 1.657 3.582 3 8 3s8-1.343 8-3V6" />
            <path d="M4 12v6c0 1.657 3.582 3 8 3s8-1.343 8-3v-6" />
        </svg>
    );
}

/* ═══════════════════════════════════════════════════
   MOCK JOB DATA (extended with detail info)
   ═══════════════════════════════════════════════════ */

interface JobDetail {
    id: number;
    missionCode: string;
    company: string;
    title: string;
    location: string;
    isRemote: boolean;
    salaryMin: number;
    salaryMax: number;
    equityMin: string;
    equityMax: string;
    spillTokens: number;
    tokenTrend: "SURGE" | "STABLE" | "RISING";
    compatibility: number;
    compatSkills: string[];
    techStack: { name: string; label: string }[];
    objective: string;
    objectiveDetail: string;
    responsibilities: { cmd: string; flags: string; description: string }[];
    teamMembers: { name: string; role: string; initials: string }[];
    tags: string[];
}

const jobsData: Record<string, JobDetail> = {
    "1": {
        id: 1,
        missionCode: "MISSION #0852-BACKEND",
        company: "CYBERDYNE SYSTEMS",
        title: "Lead Backend Architect",
        location: "Neo-Tokyo Cluster (Remote)",
        isRemote: true,
        salaryMin: 180000,
        salaryMax: 240000,
        equityMin: "0.50%",
        equityMax: "0.75%",
        spillTokens: 50000,
        tokenTrend: "SURGE",
        compatibility: 87,
        compatSkills: ["System Design", "Mastery"],
        techStack: [
            { name: "golang", label: "GOLANG" },
            { name: "kubernetes", label: "KUBERNETES" },
            { name: "postgresql", label: "POSTGRESQL" },
        ],
        objective: `CyberDyne Systems is initiating Project "Genesis"—a global neural infrastructure overhaul. We are seeking a Lead Backend Architect to orchestrate the distributed systems that will power the next generation of autonomous networks.`,
        objectiveDetail: `Your primary directive is to design, implement, and scale fault-tolerant services using Go and high-concurrency patterns. You will lead a strike team of 12 senior engineers across four continents, ensuring architectural integrity and sub-millisecond latency across our edge-node clusters.`,
        responsibilities: [
            {
                cmd: "architect",
                flags: "--scale --global-distribution",
                description: "Design and maintain ultra-high availability microservices capable of handling 10M+ req/sec."
            },
            {
                cmd: "deploy",
                flags: "--env production --no-downtime",
                description: "Establish robust CI/CD pipelines and deployment strategies for zero-downtime updates."
            },
            {
                cmd: "monitor",
                flags: "--security --integrity",
                description: "Implement end-to-end encryption protocols and security best practices across the entire stack."
            },
        ],
        teamMembers: [
            { name: "Sarah Connor", role: "VP of Engineering", initials: "SC" },
            { name: "Kyle Reese", role: "Staff Engineer", initials: "KR" },
        ],
        tags: ["Rust", "gRPC", "K8s"],
    },
    "2": {
        id: 2,
        missionCode: "MISSION #1204-WEB3",
        company: "NEBULA PROTOCOL",
        title: "Lead Smart Contract Engineer",
        location: "Fully Remote",
        isRemote: true,
        salaryMin: 160000,
        salaryMax: 210000,
        equityMin: "0.75%",
        equityMax: "1.25%",
        spillTokens: 35000,
        tokenTrend: "RISING",
        compatibility: 72,
        compatSkills: ["Smart Contracts", "Security"],
        techStack: [
            { name: "golang", label: "SOLIDITY" },
            { name: "kubernetes", label: "HARDHAT" },
            { name: "postgresql", label: "ETHEREUM" },
        ],
        objective: `Nebula Protocol is building the next generation of decentralized finance infrastructure. We need a Lead Smart Contract Engineer to architect and deploy secure, auditable smart contracts across multiple chains.`,
        objectiveDetail: `You will lead smart contract development from concept to mainnet deployment, conducting thorough security audits and working with external auditors to ensure bulletproof contracts handling billions in TVL.`,
        responsibilities: [
            { cmd: "audit", flags: "--scope full --depth critical", description: "Lead comprehensive security audits of all smart contracts before deployment." },
            { cmd: "deploy", flags: "--chain multi --gas-optimized", description: "Deploy gas-optimized contracts across Ethereum, Polygon, and Arbitrum." },
            { cmd: "monitor", flags: "--realtime --alerts", description: "Implement real-time monitoring and alerting systems for on-chain activities." },
        ],
        teamMembers: [
            { name: "Vitalik Z.", role: "Protocol Lead", initials: "VZ" },
            { name: "Ada Chain", role: "Security Researcher", initials: "AC" },
        ],
        tags: ["Solidity", "Security Audit", "Web3"],
    },
    "3": {
        id: 3,
        missionCode: "MISSION #0731-BIOML",
        company: "HELIX SYNTHESIS",
        title: "Bio-Sim Pipeline Specialist",
        location: "London, UK",
        isRemote: false,
        salaryMin: 140000,
        salaryMax: 185000,
        equityMin: "0.25%",
        equityMax: "0.50%",
        spillTokens: 28000,
        tokenTrend: "STABLE",
        compatibility: 65,
        compatSkills: ["ML Pipelines", "GPU Computing"],
        techStack: [
            { name: "golang", label: "C++" },
            { name: "kubernetes", label: "PYTORCH" },
            { name: "postgresql", label: "CUDA" },
        ],
        objective: `Helix Synthesis is pioneering AI-driven biological simulation. We need a Bio-Sim Pipeline Specialist to build and optimize GPU-accelerated pipelines for molecular dynamics simulations.`,
        objectiveDetail: `You will design high-performance computing pipelines that process terabytes of molecular data, implementing custom CUDA kernels and PyTorch extensions for cutting-edge protein folding simulations.`,
        responsibilities: [
            { cmd: "optimize", flags: "--gpu --throughput-max", description: "Build and optimize CUDA kernels for molecular dynamics computations." },
            { cmd: "pipeline", flags: "--distributed --fault-tolerant", description: "Design distributed data pipelines for large-scale biological simulations." },
            { cmd: "validate", flags: "--accuracy --benchmarks", description: "Validate simulation results against wet-lab experimental data." },
        ],
        teamMembers: [
            { name: "Elena Rossi", role: "Chief Scientist", initials: "ER" },
            { name: "James Wu", role: "ML Engineer", initials: "JW" },
        ],
        tags: ["C++", "PyTorch", "CUDA"],
    },
    "4": {
        id: 4,
        missionCode: "MISSION #0993-CLOUD",
        company: "SKYNET EDGE",
        title: "Distributed Cloud Architect",
        location: "Global Remote",
        isRemote: true,
        salaryMin: 175000,
        salaryMax: 225000,
        equityMin: "0.40%",
        equityMax: "0.80%",
        spillTokens: 42000,
        tokenTrend: "SURGE",
        compatibility: 91,
        compatSkills: ["Cloud Architecture", "IaC"],
        techStack: [
            { name: "golang", label: "GO" },
            { name: "kubernetes", label: "TERRAFORM" },
            { name: "postgresql", label: "WASM" },
        ],
        objective: `SkyNet Edge is deploying a global edge computing network. We are looking for a Distributed Cloud Architect to design multi-region, fault-tolerant cloud infrastructure that runs at the edge.`,
        objectiveDetail: `You will architect cloud-native systems spanning 50+ edge locations, implementing Infrastructure as Code with Terraform and building custom Go services for edge orchestration.`,
        responsibilities: [
            { cmd: "provision", flags: "--multi-region --iac", description: "Design and provision multi-region infrastructure using Terraform." },
            { cmd: "orchestrate", flags: "--edge --low-latency", description: "Build edge orchestration systems achieving sub-5ms latency globally." },
            { cmd: "secure", flags: "--zero-trust --compliance", description: "Implement zero-trust security model across all edge nodes." },
        ],
        teamMembers: [
            { name: "Max Edge", role: "CTO", initials: "ME" },
            { name: "Nina Cloud", role: "Platform Lead", initials: "NC" },
        ],
        tags: ["Go", "Terraform", "WASM"],
    },
    "5": {
        id: 5, missionCode: "MISSION #1122-SYSTEMS", company: "QUANTUM FORGE", title: "Senior Rust Systems Dev", location: "San Francisco, US", isRemote: false,
        salaryMin: 200000, salaryMax: 280000, equityMin: "0.60%", equityMax: "1.00%", spillTokens: 55000, tokenTrend: "SURGE", compatibility: 94,
        compatSkills: ["Systems Programming", "Performance"], techStack: [{ name: "golang", label: "RUST" }, { name: "kubernetes", label: "WASM" }, { name: "postgresql", label: "LINUX" }],
        objective: "Quantum Forge is building next-gen bare-metal infrastructure tooling in Rust. We need a Senior Systems Developer to push the boundaries of performance and safety.",
        objectiveDetail: "You will architect and implement high-performance systems software, contributing to the Rust ecosystem and mentoring a team of 8 engineers.",
        responsibilities: [
            { cmd: "build", flags: "--release --optimize", description: "Design and implement zero-cost abstraction systems in Rust." },
            { cmd: "benchmark", flags: "--perf --flamegraph", description: "Profile and optimize critical hot paths for maximum throughput." },
            { cmd: "contribute", flags: "--upstream --rfc", description: "Contribute to Rust RFCs and upstream dependencies." },
        ],
        teamMembers: [{ name: "Ferris Oxide", role: "Lead Architect", initials: "FO" }, { name: "Crab Walker", role: "Staff SWE", initials: "CW" }],
        tags: ["Rust", "WASM", "Linux"],
    },
    "6": {
        id: 6, missionCode: "MISSION #0667-DEVOPS", company: "ATLAS CLOUD", title: "DevOps Platform Engineer", location: "Berlin, DE", isRemote: true,
        salaryMin: 130000, salaryMax: 170000, equityMin: "0.20%", equityMax: "0.40%", spillTokens: 20000, tokenTrend: "STABLE", compatibility: 78,
        compatSkills: ["DevOps", "Kubernetes"], techStack: [{ name: "golang", label: "GO" }, { name: "kubernetes", label: "K8S" }, { name: "postgresql", label: "TERRAFORM" }],
        objective: "Atlas Cloud provides managed Kubernetes infrastructure. We need a DevOps Platform Engineer to build internal developer platforms.",
        objectiveDetail: "You will design and maintain the internal developer platform, implementing self-service infrastructure provisioning and observability tooling.",
        responsibilities: [
            { cmd: "platform", flags: "--self-service --dx", description: "Build developer self-service portals with excellent DX." },
            { cmd: "observe", flags: "--metrics --traces --logs", description: "Implement comprehensive observability across all services." },
            { cmd: "automate", flags: "--gitops --ci-cd", description: "Create GitOps-based deployment workflows." },
        ],
        teamMembers: [{ name: "Kai Helm", role: "Platform Lead", initials: "KH" }, { name: "Rosa Pipe", role: "SRE Manager", initials: "RP" }],
        tags: ["Go", "K8s", "Terraform"],
    },
    "7": {
        id: 7, missionCode: "MISSION #1337-MLOPS", company: "NEXUS AI LABS", title: "ML Infrastructure Lead", location: "Remote (US)", isRemote: true,
        salaryMin: 185000, salaryMax: 250000, equityMin: "0.50%", equityMax: "1.00%", spillTokens: 48000, tokenTrend: "RISING", compatibility: 83,
        compatSkills: ["MLOps", "GPU Infrastructure"], techStack: [{ name: "golang", label: "PYTHON" }, { name: "kubernetes", label: "PYTORCH" }, { name: "postgresql", label: "CUDA" }],
        objective: "Nexus AI Labs is building foundation models. We need an ML Infrastructure Lead to design and scale our training infrastructure.",
        objectiveDetail: "You will architect distributed training pipelines, manage GPU clusters, and build tooling for seamless model development and deployment.",
        responsibilities: [
            { cmd: "train", flags: "--distributed --multi-gpu", description: "Architect distributed training across 1000+ GPU clusters." },
            { cmd: "serve", flags: "--low-latency --scale", description: "Build model serving infrastructure with sub-100ms inference." },
            { cmd: "pipeline", flags: "--data --feature-store", description: "Design feature stores and data pipelines for model training." },
        ],
        teamMembers: [{ name: "Luna Tensor", role: "Head of ML", initials: "LT" }, { name: "Ray Batch", role: "Staff MLOps", initials: "RB" }],
        tags: ["Python", "PyTorch", "CUDA"],
    },
    "8": {
        id: 8, missionCode: "MISSION #0404-ZKP", company: "CIPHER DAO", title: "Zero-Knowledge Proof Researcher", location: "Fully Remote", isRemote: true,
        salaryMin: 170000, salaryMax: 230000, equityMin: "1.00%", equityMax: "2.00%", spillTokens: 60000, tokenTrend: "SURGE", compatibility: 69,
        compatSkills: ["Cryptography", "ZK Proofs"], techStack: [{ name: "golang", label: "RUST" }, { name: "kubernetes", label: "SOLIDITY" }, { name: "postgresql", label: "CIRCOM" }],
        objective: "Cipher DAO is advancing privacy technology. We need a ZK Proof Researcher to develop novel zero-knowledge proof systems.",
        objectiveDetail: "You will research and implement cutting-edge ZK proof constructions, focusing on prover efficiency and verification cost optimization.",
        responsibilities: [
            { cmd: "research", flags: "--zkp --novel-constructions", description: "Research and implement novel ZK proof systems." },
            { cmd: "optimize", flags: "--prover --verifier", description: "Optimize proving time and on-chain verification costs." },
            { cmd: "audit", flags: "--cryptographic --formal", description: "Formally verify cryptographic protocol security." },
        ],
        teamMembers: [{ name: "Zero X", role: "Research Lead", initials: "ZX" }, { name: "Proof Y", role: "Cryptographer", initials: "PY" }],
        tags: ["Rust", "Solidity", "Cryptography"],
    },
};

const similarMissions = [
    { id: "s1", code: "MISSION #0214-SEC", title: "Cloud Security Lead", company: "Sentinel Corp", salary: "$160k - $220k", tags: ["AWS", "Security"] },
    { id: "s2", code: "MISSION #0901-MOBILE", title: "Fullstack Android Dev", company: "NovaTech", salary: "$130k - $180k", tags: ["Kotlin", "Android"] },
    { id: "s3", code: "MISSION #0347-FE", title: "AI Frontline Engineer", company: "DataForge", salary: "$155k - $200k", tags: ["React", "ML"] },
    { id: "s4", code: "MISSION #0589-DATA", title: "Data Integrity Lead", company: "VaultDB", salary: "$145k - $195k", tags: ["PostgreSQL", "Go"] },
];

/* ═══════════════════════════════════════════════════
   COMPATIBILITY RING (SVG Donut)
   ═══════════════════════════════════════════════════ */

function CompatibilityRing({ percent }: { percent: number }) {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percent / 100) * circumference;

    return (
        <div className="relative w-[130px] h-[130px] flex items-center justify-center">
            <svg width="130" height="130" viewBox="0 0 120 120" className="transform -rotate-90">
                {/* Background ring */}
                <circle cx="60" cy="60" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                {/* Progress ring */}
                <circle
                    cx="60" cy="60" r={radius} fill="none"
                    stroke="#3CF91A" strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    style={{ transition: "stroke-dashoffset 1s ease-out", filter: "drop-shadow(0 0 6px #3CF91A60)" }}
                />
            </svg>
            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span
                    className="text-3xl font-black text-[#3CF91A]"
                    style={{ fontFamily: "var(--font-jetbrains-mono)", textShadow: "0 0 20px #3CF91A40" }}
                >
                    {percent}%
                </span>
                <span className="text-[8px] uppercase tracking-[3px] text-white/30 font-bold mt-0.5">
                    MATCH SCORE
                </span>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════
   TECH STACK ICON CARD
   ═══════════════════════════════════════════════════ */

function TechIconCard({ label, index }: { label: string; index: number }) {
    const icons = [<GolangIcon key={0} />, <KubernetesIcon key={1} />, <PostgresIcon key={2} />];
    const sublabels = ["Core Language", "Orchestration", "Data Store"];

    return (
        <div className="flex flex-col items-center gap-2.5 group">
            <div
                className="w-[80px] h-[80px] rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-105"
                style={{
                    background: "rgba(60,249,26,0.05)",
                    border: "1px solid rgba(60,249,26,0.15)",
                    boxShadow: "0 0 20px rgba(60,249,26,0.05)",
                }}
            >
                {icons[index % 3]}
            </div>
            <div className="text-center">
                <p
                    className="text-[10px] font-bold text-white/60 uppercase tracking-wider"
                    style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                >
                    {label}
                </p>
                <p className="text-[8px] text-white/25 mt-0.5">{sublabels[index % 3]}</p>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════
   JOB DETAIL PAGE COMPONENT
   ═══════════════════════════════════════════════════ */

export default function JobDetailPage() {
    const params = useParams();
    const jobId = params.id as string;
    const job = jobsData[jobId];
    const [activeTab, setActiveTab] = useState("brief");

    if (!job) {
        return (
            <div className="min-h-full bg-[#050505] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-[60px] font-black text-white/10" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>404</p>
                    <p className="text-[14px] text-white/40 mt-2">Mission not found in the database.</p>
                    <Link
                        href="/dashboard/talent/jobs"
                        className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg text-[12px] font-bold bg-[#3CF91A] text-black no-underline hover:scale-[1.02] transition-transform"
                    >
                        <ChevronLeftIcon /> Return to Missions
                    </Link>
                </div>
            </div>
        );
    }

    const tabs = [
        { key: "brief", label: "MISSION BRIEF" },
        { key: "stack", label: "THE STACK" },
        { key: "team", label: "TEAM INTEL" },
        { key: "network", label: "NETWORK MAP" },
    ];

    const formatCurrency = (v: number) => `$${v.toLocaleString()}`;

    return (
        <div className="min-h-full bg-[#050505]">

            {/* ═══════════════════════════════════════════
                TOP NAV BAR
               ═══════════════════════════════════════════ */}
            <div className="border-b border-white/[0.06] bg-[#0A0A0A]/80 backdrop-blur-xl sticky top-0 z-30">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="flex items-center h-12 gap-6">
                        {/* Logo */}
                        <Link href="/dashboard/talent" className="flex items-center gap-2 no-underline shrink-0">
                            <img src="/assets/logo 2.png" alt="SkillSpill" className="h-7" />
                        </Link>

                        {/* Nav Links */}
                        <nav className="hidden lg:flex items-center gap-5">
                            {["MISSIONS", "NETWORK", "TERMINAL", "VAULT"].map((item) => (
                                <span
                                    key={item}
                                    className="text-[10px] font-bold uppercase tracking-[2px] text-white/30 hover:text-white/60 cursor-pointer transition-colors"
                                    style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                                >
                                    {item}
                                </span>
                            ))}
                        </nav>

                        <div className="flex-1" />

                        {/* Search */}
                        <div className="hidden md:flex items-center relative">
                            <div className="absolute left-3 text-white/20"><SearchIcon /></div>
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-[200px] pl-9 pr-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[11px] text-white placeholder-white/20 focus:border-[#3CF91A]/30 focus:outline-none transition-colors"
                                style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                            />
                        </div>

                        {/* User */}
                        <div className="flex items-center gap-3">
                            <span
                                className="text-[10px] font-bold text-[#3CF91A] uppercase tracking-wider hidden sm:inline"
                                style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                            >
                                DEV_NULL
                            </span>
                            <div
                                className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold"
                                style={{
                                    background: "linear-gradient(135deg, #3CF91A30, #3CF91A10)",
                                    border: "1px solid #3CF91A40",
                                    color: "#3CF91A",
                                }}
                            >
                                DN
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════
                HERO BANNER
               ═══════════════════════════════════════════ */}
            <div className="relative overflow-hidden">
                {/* Background gradient/pattern */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: "linear-gradient(135deg, #0A1A0F 0%, #050B08 30%, #0A0D14 60%, #050505 100%)",
                    }}
                />
                {/* Scan lines effect */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(60,249,26,0.1) 2px, rgba(60,249,26,0.1) 4px)",
                    }}
                />
                {/* Grid pattern */}
                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: "linear-gradient(rgba(60,249,26,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(60,249,26,0.3) 1px, transparent 1px)",
                        backgroundSize: "60px 60px",
                    }}
                />
                {/* Glowing orb */}
                <div
                    className="absolute top-1/2 right-[20%] w-[300px] h-[300px] rounded-full -translate-y-1/2 opacity-20"
                    style={{
                        background: "radial-gradient(circle, #3CF91A20 0%, transparent 70%)",
                        filter: "blur(60px)",
                    }}
                />

                {/* Content */}
                <div className="relative max-w-[1400px] mx-auto px-6 py-12 lg:py-16">
                    {/* Back button */}
                    <Link
                        href="/dashboard/talent/jobs"
                        className="inline-flex items-center gap-1.5 text-[11px] text-white/30 hover:text-[#3CF91A] transition-colors no-underline mb-6"
                    >
                        <ChevronLeftIcon /> Back to Missions
                    </Link>

                    {/* Mission code badge */}
                    <div className="mb-3">
                        <span
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-[9px] font-bold uppercase tracking-[2px]"
                            style={{
                                fontFamily: "var(--font-jetbrains-mono)",
                                background: "#3CF91A15",
                                color: "#3CF91A",
                                border: "1px solid #3CF91A30",
                            }}
                        >
                            <TerminalIcon />
                            {job.missionCode}
                        </span>
                    </div>

                    {/* Company name */}
                    <h1
                        className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-2"
                        style={{ fontFamily: "var(--font-space-grotesk)" }}
                    >
                        {job.company}
                    </h1>

                    {/* Job title */}
                    <p className="text-[16px] lg:text-[18px] text-white/50 font-medium mb-1">
                        {job.title}
                    </p>

                    {/* Location */}
                    <div className="flex items-center gap-1.5 text-white/30 mb-6">
                        <MapPinIcon />
                        <span className="text-[12px]">{job.location}</span>
                    </div>

                    {/* Apply Button */}
                    <button
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-[12px] font-bold uppercase tracking-wider border-none cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:shadow-lg"
                        style={{
                            background: "#3CF91A",
                            color: "#000",
                            boxShadow: "0 0 25px #3CF91A40, 0 0 50px #3CF91A15",
                        }}
                    >
                        APPLY NOW <ArrowRightIcon />
                    </button>
                </div>
            </div>

            {/* ═══════════════════════════════════════════
                TAB NAVIGATION
               ═══════════════════════════════════════════ */}
            <div className="border-b border-white/[0.06] bg-[#050505] sticky top-12 z-20">
                <div className="max-w-[1400px] mx-auto px-6">
                    <div className="flex items-center gap-1 overflow-x-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className="relative px-4 py-3.5 text-[10px] font-bold uppercase tracking-[2px] transition-all duration-200 border-none bg-transparent cursor-pointer whitespace-nowrap"
                                style={{
                                    fontFamily: "var(--font-jetbrains-mono)",
                                    color: activeTab === tab.key ? "#3CF91A" : "rgba(255,255,255,0.3)",
                                }}
                            >
                                {tab.label}
                                {activeTab === tab.key && (
                                    <span
                                        className="absolute bottom-0 left-0 right-0 h-[2px]"
                                        style={{
                                            background: "#3CF91A",
                                            boxShadow: "0 0 10px #3CF91A60",
                                        }}
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════
                MAIN CONTENT AREA
               ═══════════════════════════════════════════ */}
            <div className="max-w-[1400px] mx-auto px-6 py-8">
                <div className="flex flex-col lg:flex-row gap-6">

                    {/* ──────── LEFT COLUMN ──────── */}
                    <div className="flex-1 min-w-0 space-y-6">

                        {/* ── Mission Objective ── */}
                        <div className="rounded-xl border border-white/[0.06] bg-[#0A0A0A] p-6">
                            <div className="flex items-center gap-2.5 mb-4">
                                <TerminalIcon />
                                <h2
                                    className="text-[11px] font-bold uppercase tracking-[2px] text-[#3CF91A]"
                                    style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                                >
                                    MISSION OBJECTIVE
                                </h2>
                            </div>
                            <p className="text-[13px] text-white/60 leading-relaxed mb-4">
                                {job.objective}
                            </p>
                            <p className="text-[13px] text-white/45 leading-relaxed">
                                {job.objectiveDetail}
                            </p>
                        </div>

                        {/* ── The Tech Stack ── */}
                        <div className="rounded-xl border border-white/[0.06] bg-[#0A0A0A] p-6">
                            <h2
                                className="text-[11px] font-bold uppercase tracking-[2px] text-[#3CF91A] mb-6"
                                style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                            >
                                THE TECH STACK
                            </h2>

                            <div className="flex items-center justify-center gap-8 lg:gap-12 py-4">
                                {job.techStack.map((tech, i) => (
                                    <TechIconCard key={tech.name + i} label={tech.label} index={i} />
                                ))}
                            </div>

                            {/* Carousel dots */}
                            <div className="flex items-center justify-center gap-2 mt-5">
                                <span className="w-2 h-2 rounded-full bg-[#3CF91A]" style={{ boxShadow: "0 0 6px #3CF91A80" }} />
                                <span className="w-2 h-2 rounded-full bg-white/10" />
                                <span className="w-2 h-2 rounded-full bg-white/10" />
                            </div>
                        </div>

                        {/* ── Key Responsibilities ── */}
                        <div className="rounded-xl border border-white/[0.06] bg-[#0A0A0A] p-6">
                            <h2
                                className="text-[11px] font-bold uppercase tracking-[2px] text-white/40 mb-5"
                                style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                            >
                                KEY RESPONSIBILITIES v1.0
                            </h2>

                            <div className="space-y-5">
                                {job.responsibilities.map((resp, i) => (
                                    <div key={i} className="space-y-2">
                                        {/* Terminal command */}
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="text-[11px] text-white/30"
                                                style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                                            >
                                                $
                                            </span>
                                            <span
                                                className="text-[12px] font-bold text-white/70"
                                                style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                                            >
                                                {resp.cmd}
                                            </span>
                                            <span
                                                className="text-[11px] text-[#3CF91A]/70"
                                                style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                                            >
                                                {resp.flags}
                                            </span>
                                        </div>
                                        {/* Description */}
                                        <p className="text-[12px] text-white/40 leading-relaxed pl-5">
                                            {resp.description}
                                        </p>
                                        {i < job.responsibilities.length - 1 && (
                                            <div className="border-b border-white/[0.04] pt-2" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ──────── RIGHT COLUMN (Sidebar) ──────── */}
                    <div className="w-full lg:w-[320px] shrink-0 space-y-5">

                        {/* ── The Reward ── */}
                        <div className="rounded-xl border border-white/[0.06] bg-[#0A0A0A] overflow-hidden">
                            <div className="px-5 py-3.5 border-b border-white/[0.04]">
                                <h3
                                    className="text-[10px] font-bold uppercase tracking-[2px] text-[#3CF91A]"
                                    style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                                >
                                    THE REWARD
                                </h3>
                            </div>
                            <div className="p-5 space-y-4">
                                {/* Annual Salary */}
                                <div>
                                    <p className="text-[9px] uppercase tracking-widest text-white/25 font-semibold mb-1">
                                        ANNUAL SALARY
                                    </p>
                                    <p
                                        className="text-[18px] font-black text-white"
                                        style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                                    >
                                        {formatCurrency(job.salaryMin)}
                                        <span className="text-white/20 mx-2">—</span>
                                        {formatCurrency(job.salaryMax)}
                                    </p>
                                </div>

                                {/* Equity */}
                                <div>
                                    <p className="text-[9px] uppercase tracking-widest text-white/25 font-semibold mb-1">
                                        EQUITY
                                    </p>
                                    <p
                                        className="text-[16px] font-bold text-white/70"
                                        style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                                    >
                                        {job.equityMin}
                                        <span className="text-white/20 mx-2">—</span>
                                        {job.equityMax}
                                    </p>
                                </div>

                                {/* Spill Tokens */}
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-[9px] uppercase tracking-widest text-white/25 font-semibold mb-1">
                                            SPILL TOKENS
                                        </p>
                                        <p
                                            className="text-[22px] font-black text-white"
                                            style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                                        >
                                            {job.spillTokens.toLocaleString()}
                                        </p>
                                    </div>
                                    <span
                                        className="text-[8px] px-2.5 py-1 rounded font-black uppercase tracking-wider"
                                        style={{
                                            fontFamily: "var(--font-jetbrains-mono)",
                                            background: job.tokenTrend === "SURGE" ? "#3CF91A" : job.tokenTrend === "RISING" ? "#3CF91A20" : "rgba(255,255,255,0.06)",
                                            color: job.tokenTrend === "SURGE" ? "#000" : job.tokenTrend === "RISING" ? "#3CF91A" : "rgba(255,255,255,0.4)",
                                            border: job.tokenTrend === "RISING" ? "1px solid #3CF91A30" : "none",
                                            boxShadow: job.tokenTrend === "SURGE" ? "0 0 12px #3CF91A40" : "none",
                                        }}
                                    >
                                        {job.tokenTrend}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* ── Your Compatibility ── */}
                        <div className="rounded-xl border border-white/[0.06] bg-[#0A0A0A] overflow-hidden">
                            <div className="px-5 py-3.5 border-b border-white/[0.04]">
                                <h3
                                    className="text-[10px] font-bold uppercase tracking-[2px] text-[#3CF91A]"
                                    style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                                >
                                    YOUR COMPATIBILITY
                                </h3>
                            </div>
                            <div className="p-5 flex flex-col items-center">
                                <CompatibilityRing percent={job.compatibility} />

                                {/* Skill badges */}
                                <div className="flex items-center gap-2 mt-4">
                                    {job.compatSkills.map((skill) => (
                                        <span
                                            key={skill}
                                            className="text-[9px] px-3 py-1.5 rounded-full font-bold uppercase tracking-wider"
                                            style={{
                                                fontFamily: "var(--font-jetbrains-mono)",
                                                background: "rgba(60,249,26,0.08)",
                                                color: "#3CF91A",
                                                border: "1px solid rgba(60,249,26,0.2)",
                                            }}
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* ── Team Insights ── */}
                        <div className="rounded-xl border border-white/[0.06] bg-[#0A0A0A] overflow-hidden">
                            <div className="px-5 py-3.5 border-b border-white/[0.04]">
                                <h3
                                    className="text-[10px] font-bold uppercase tracking-[2px] text-white/40"
                                    style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                                >
                                    TEAM INSIGHTS
                                </h3>
                            </div>
                            <div className="p-5 space-y-3">
                                {job.teamMembers.map((member) => (
                                    <div key={member.name} className="flex items-center gap-3">
                                        <div
                                            className="w-10 h-10 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
                                            style={{
                                                background: "linear-gradient(135deg, #3CF91A20, #3CF91A08)",
                                                border: "1px solid #3CF91A30",
                                                color: "#3CF91A",
                                            }}
                                        >
                                            {member.initials}
                                        </div>
                                        <div>
                                            <p className="text-[12px] font-semibold text-white/80">{member.name}</p>
                                            <p className="text-[10px] text-white/30">{member.role}</p>
                                        </div>
                                    </div>
                                ))}

                                {/* View full team button */}
                                <button
                                    className="w-full mt-3 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-[2px] border cursor-pointer transition-all duration-200 hover:bg-[#3CF91A]/10 hover:border-[#3CF91A]/30"
                                    style={{
                                        fontFamily: "var(--font-jetbrains-mono)",
                                        background: "transparent",
                                        color: "#3CF91A",
                                        border: "1px solid rgba(60,249,26,0.2)",
                                    }}
                                >
                                    VIEW FULL TEAM MAP
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════
                SIMILAR MISSIONS SECTION
               ═══════════════════════════════════════════ */}
            <div className="border-t border-white/[0.06] bg-[#050505]">
                <div className="max-w-[1400px] mx-auto px-6 py-10">
                    <div className="flex items-center justify-between mb-6">
                        <h2
                            className="text-[16px] font-bold text-white tracking-tight"
                            style={{ fontFamily: "var(--font-space-grotesk)" }}
                        >
                            SIMILAR MISSIONS
                        </h2>
                        <div className="flex items-center gap-2">
                            <button
                                className="w-8 h-8 rounded-full flex items-center justify-center border border-white/[0.1] bg-white/[0.03] text-white/30 hover:text-white/60 hover:border-white/20 transition-all cursor-pointer"
                            >
                                <ChevronLeftIcon />
                            </button>
                            <button
                                className="w-8 h-8 rounded-full flex items-center justify-center border border-[#3CF91A]/30 bg-[#3CF91A]/10 text-[#3CF91A] hover:bg-[#3CF91A]/20 transition-all cursor-pointer"
                                style={{ boxShadow: "0 0 10px #3CF91A20" }}
                            >
                                <ChevronRightIcon />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {similarMissions.map((mission) => (
                            <div
                                key={mission.id}
                                className="rounded-xl border border-white/[0.06] bg-[#0A0A0A] p-4 hover:border-[#3CF91A]/20 transition-all duration-300 cursor-pointer group"
                            >
                                <p
                                    className="text-[8px] font-bold uppercase tracking-[2px] text-[#3CF91A]/50 mb-2"
                                    style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                                >
                                    {mission.code}
                                </p>
                                <h3
                                    className="text-[13px] font-bold text-white/80 group-hover:text-white transition-colors mb-0.5"
                                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                                >
                                    {mission.title}
                                </h3>
                                <p className="text-[10px] text-white/30 mb-2">{mission.company}</p>
                                <div className="flex items-center gap-1.5 mb-3 flex-wrap">
                                    {mission.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="text-[8px] px-2 py-[2px] rounded-full border border-white/[0.08] text-white/35"
                                            style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <p
                                    className="text-[12px] font-bold text-[#3CF91A]"
                                    style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                                >
                                    {mission.salary}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════
                FOOTER
               ═══════════════════════════════════════════ */}
            <footer className="border-t border-white/[0.06] bg-[#050505]">
                <div className="max-w-[1400px] mx-auto px-6 py-5">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <img src="/assets/logo 2.png" alt="SkillSpill" className="h-5 opacity-40" />
                            <span
                                className="text-[9px] text-white/20 uppercase tracking-[2px]"
                                style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                            >
                                SKILLSPILL © 2077
                            </span>
                        </div>
                        <div className="flex items-center gap-6">
                            {["PRIVACY PROTOCOLS", "TERMS OF SERVICE", "SYSTEM STATUS"].map((item) => (
                                <span
                                    key={item}
                                    className="text-[8px] text-white/15 uppercase tracking-[2px] hover:text-white/30 transition-colors cursor-pointer"
                                    style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                                >
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
