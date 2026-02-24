"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

/* ── SVG Icon Components ── */
function HomeIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
        </svg>
    );
}

function SearchIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
    );
}

function BriefcaseIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
    );
}

function UsersIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );
}

function MessageIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
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
const recruiterNavItems = [
    { label: "Dashboard", icon: <HomeIcon />, href: "/recruiter" },
    { label: "Search Talent", icon: <SearchIcon />, href: "/recruiter/search" },
    { label: "Bounties", icon: <BriefcaseIcon />, href: "/recruiter/bounties" },
    { label: "Applications", icon: <UsersIcon />, href: "/recruiter/applications" },
    { label: "Messages", icon: <MessageIcon />, href: "/recruiter/messages" },
    { label: "Settings", icon: <SettingsIcon />, href: "/recruiter/settings" },
];

export default function RecruiterShell({
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
    const accent = "#A855F7";

    const navItems = recruiterNavItems;

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
        } catch {
            // ignore fetch errors
        }
        window.location.href = "/login";
    };

    const isActive = (href: string) => {
        if (href === "/recruiter") return pathname === "/recruiter";
        return pathname.startsWith(href);
    };

    return (
        <div className="h-screen overflow-hidden bg-[#F5F5F7] text-gray-900 flex">
            {/* ── Mobile Overlay ── */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/30 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* ── Sidebar ── */}
            <aside
                className={`
                    fixed lg:static inset-y-0 left-0 z-50
                    w-[220px] flex flex-col
                    bg-white border-r border-gray-200
                    transform transition-transform duration-300 ease-in-out
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
                `}
            >
                {/* Logo */}
                <div className="h-16 flex items-center px-5 border-b border-gray-100">
                    <Link href="/recruiter" className="flex items-center gap-2.5">
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
                                        ? `text-white`
                                        : "text-gray-400 hover:text-gray-700 hover:bg-gray-50"
                                    }
                                `}
                                style={active ? {
                                    background: accent,
                                    boxShadow: `0 0 20px ${accent}40, 0 0 40px ${accent}15`,
                                } : {}}
                            >
                                <span className={active ? "text-white" : `text-gray-400 group-hover:text-gray-600`}>
                                    {item.icon}
                                </span>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Section - User + New Bounty */}
                <div className="p-4 border-t border-gray-100 space-y-3">
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
                            <p className="text-xs font-semibold text-gray-700 truncate">Recruiter</p>
                            <p className="text-[10px] font-mono text-purple-500">
                                Talent Scout
                            </p>
                        </div>
                    </div>

                    {/* New Bounty Button */}
                    <button
                        className="w-full py-2.5 rounded-lg text-[12px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] cursor-pointer border-none"
                        style={{
                            background: `linear-gradient(135deg, ${accent}, #7C3AED)`,
                            color: "#fff",
                            boxShadow: `0 0 15px ${accent}40`,
                        }}
                    >
                        <PlusIcon />
                        NEW BOUNTY
                    </button>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className="w-full py-2 rounded-lg text-[11px] font-medium flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer border border-gray-200 bg-transparent text-gray-400 hover:text-red-500 hover:border-red-300 hover:bg-red-50"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* ── Main Content Area ── */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile Top Bar */}
                <header className="shrink-0 h-14 flex items-center justify-between px-4 border-b border-gray-200 bg-white/80 backdrop-blur-xl lg:hidden">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="text-gray-500 hover:text-gray-800 p-1 cursor-pointer bg-transparent border-none"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                    </button>
                    <img src="/assets/logo 2.png" alt="SkillSpill" className="h-8" />
                    <button
                        onClick={handleLogout}
                        className="text-[11px] text-gray-400 hover:text-red-500 transition-colors font-medium cursor-pointer bg-transparent border-none"
                    >
                        Sign Out
                    </button>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "#D1D5DB #F5F5F7" }}>
                    {children}
                </main>
            </div>
        </div>
    );
}
