"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

/* ── SVG Icon Components ── */
function FeedIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 11a9 9 0 0 1 9 9" /><path d="M4 4a16 16 0 0 1 16 16" /><circle cx="5" cy="20" r="1" />
        </svg>
    );
}

function SpillsIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14,2 14,8 20,8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10,9 9,9 8,9" />
        </svg>
    );
}

function JobsIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
    );
}

function GitHubIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
        </svg>
    );
}

function ProfileIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
        </svg>
    );
}

function SkillTreeIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="5" r="3" />
            <line x1="12" y1="8" x2="12" y2="14" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="18" r="3" />
            <line x1="12" y1="14" x2="6" y2="15" />
            <line x1="12" y1="14" x2="18" y2="15" />
        </svg>
    );
}

function SettingsIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
    );
}

function PlusIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
        </svg>
    );
}

/* ── Nav Items ── */
const talentNavItems = [
    { label: "Feed", icon: <FeedIcon />, href: "/dashboard/talent" },
    { label: "My Spills", icon: <SpillsIcon />, href: "/dashboard/talent/spills" },
    { label: "Jobs", icon: <JobsIcon />, href: "/dashboard/talent/jobs" },
    { label: "GitHub Sync", icon: <GitHubIcon />, href: "/dashboard/talent/github" },
    { label: "Profile", icon: <ProfileIcon />, href: "/dashboard/talent/profile" },
    { label: "Skill Tree", icon: <SkillTreeIcon />, href: "/dashboard/talent/skill-tree" },
    { label: "Settings", icon: <SettingsIcon />, href: "/dashboard/talent/settings" },
];

export default function DashboardShell({
    role,
    userId,
    children,
}: {
    role: string;
    userId: string;
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const isTalent = role === "TALENT";
    const accent = isTalent ? "#3CF91A" : "#A855F7";

    const navItems = talentNavItems;

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
        } catch {
            // ignore fetch errors
        }
        window.location.href = "/login";
    };

    const isActive = (href: string) => {
        if (href === "/dashboard/talent") return pathname === "/dashboard/talent";
        return pathname.startsWith(href);
    };

    return (
        <div className="h-screen overflow-hidden bg-[#050505] text-white flex">
            {/* ── Mobile Overlay ── */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* ── Sidebar ── */}
            <aside
                className={`
                    fixed lg:static inset-y-0 left-0 z-50
                    w-[220px] flex flex-col
                    bg-[#0A0A0A] border-r border-white/[0.06]
                    transform transition-transform duration-300 ease-in-out
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                `}
            >
                {/* Logo */}
                <div className="h-16 flex items-center px-5 border-b border-white/[0.06]">
                    <Link href="/dashboard/talent" className="flex items-center gap-2.5">
                        <img src="/assets/logo 2.png" alt="SkillSpill" className="h-9" />
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-4 px-3 flex flex-col gap-1">
                    {navItems.map((item) => {
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`
                                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium
                                    transition-all duration-200 group relative
                                    ${active
                                        ? `text-black`
                                        : "text-white/50 hover:text-white/80 hover:bg-white/[0.04]"
                                    }
                                `}
                                style={active ? {
                                    background: accent,
                                    boxShadow: `0 0 20px ${accent}40, 0 0 40px ${accent}15`,
                                } : {}}
                            >
                                <span className={active ? "text-black" : `text-white/40 group-hover:text-white/70`}>
                                    {item.icon}
                                </span>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Section - User + New Spill */}
                <div className="p-4 border-t border-white/[0.06] space-y-3">
                    {/* User */}
                    <div className="flex items-center gap-3">
                        <div
                            className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold"
                            style={{
                                background: `linear-gradient(135deg, ${accent}30, ${accent}10)`,
                                border: `1px solid ${accent}40`,
                                color: accent,
                            }}
                        >
                            {userId.slice(-2).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-white/70 truncate">Ghost_Protocol</p>
                            <p className="text-[10px] font-mono" style={{ color: `${accent}80` }}>
                                Lv.42 Shadow
                            </p>
                        </div>
                    </div>

                    {/* New Spill Button */}
                    <button
                        className="w-full py-2.5 rounded-lg text-[12px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] cursor-pointer"
                        style={{
                            background: accent,
                            color: "#000",
                            boxShadow: `0 0 15px ${accent}40`,
                        }}
                    >
                        <PlusIcon />
                        NEW SPILL
                    </button>
                </div>
            </aside>

            {/* ── Main Content Area ── */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile Top Bar */}
                <header className="shrink-0 h-14 flex items-center justify-between px-4 border-b border-white/[0.06] bg-[#050505]/80 backdrop-blur-xl lg:hidden">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="text-white/60 hover:text-white p-1 cursor-pointer bg-transparent border-none"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                    </button>
                    <img src="/assets/logo 2.png" alt="SkillSpill" className="h-8" />
                    <button
                        onClick={handleLogout}
                        className="text-[11px] text-white/30 hover:text-red-400 transition-colors font-medium cursor-pointer bg-transparent border-none"
                    >
                        Sign Out
                    </button>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto scrollbar-talent">
                    {children}
                </main>
            </div>
        </div>
    );
}
