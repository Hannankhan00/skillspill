"use client";

import React, { useState, useRef, useEffect } from "react";
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
    { label: "Feed", icon: <FeedIcon />, href: "/talent" },
    { label: "My Spills", icon: <SpillsIcon />, href: "/talent/spills" },
    { label: "Jobs", icon: <JobsIcon />, href: "/talent/jobs" },
    { label: "GitHub Sync", icon: <GitHubIcon />, href: "/talent/github" },
    { label: "Profile", icon: <ProfileIcon />, href: "/talent/profile" },
    { label: "Skill Tree", icon: <SkillTreeIcon />, href: "/talent/skill-tree" },
    { label: "Settings", icon: <SettingsIcon />, href: "/talent/settings" },
];

/* ── Bottom nav items (mobile — LinkedIn-style) ── */
const mobileNavItems = [
    {
        label: "Home", href: "/talent",
        icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
        iconFilled: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><rect x="9" y="12" width="6" height="10" fill="white" /></svg>,
    },
    {
        label: "Jobs", href: "/talent/jobs",
        icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>,
        iconFilled: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0.5"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" fill="white" /></svg>,
    },
    { label: "Spill", href: "#spill", icon: null, iconFilled: null }, // special center button
    {
        label: "Alerts", href: "/talent/notifications",
        icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>,
        iconFilled: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg>,
    },
    {
        label: "Profile", href: "/talent/profile",
        icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
        iconFilled: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
    },
];

export default function TalentShell({
    role,
    userId,
    children,
}: {
    role: string;
    userId: string;
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [profileDropdown, setProfileDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const accent = "#3CF91A";

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
        if (href === "/talent") return pathname === "/talent";
        return pathname.startsWith(href);
    };

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setProfileDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="h-screen overflow-hidden bg-[#F5F5F7] text-gray-900 flex">

            {/* ══════════════════════════════════════
                DESKTOP SIDEBAR (hidden on mobile)
               ══════════════════════════════════════ */}
            <aside className="hidden lg:flex w-[220px] flex-col bg-white border-r border-gray-200 shrink-0">
                {/* Logo */}
                <div className="h-14 flex items-center px-5 border-b border-gray-100">
                    <Link href="/talent" className="flex items-center gap-2.5">
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
                                className={`
                                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium
                                    transition-all duration-200 group relative no-underline
                                    ${active
                                        ? `text-black`
                                        : "text-gray-400 hover:text-gray-700 hover:bg-gray-50"
                                    }
                                `}
                                style={active ? {
                                    background: accent,
                                    boxShadow: `0 0 20px ${accent}40, 0 0 40px ${accent}15`,
                                } : {}}
                            >
                                <span className={active ? "text-black" : `text-gray-400 group-hover:text-gray-600`}>
                                    {item.icon}
                                </span>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Section */}
                <div className="p-4 border-t border-gray-100 space-y-3">
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
                            <p className="text-xs font-semibold text-gray-700 truncate">Ghost_Protocol</p>
                            <p className="text-[10px] font-mono text-emerald-600">Lv.42 Shadow</p>
                        </div>
                    </div>

                    <button
                        className="w-full py-2.5 rounded-lg text-[12px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] cursor-pointer border-none"
                        style={{
                            background: accent,
                            color: "#000",
                            boxShadow: `0 0 15px ${accent}40`,
                        }}
                    >
                        <PlusIcon />
                        NEW SPILL
                    </button>

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

                {/* ══════════════════════════════════════
                    MOBILE HEADER (LinkedIn-style)
                    Profile pic | Search bar | Chat icon
                   ══════════════════════════════════════ */}
                <header className="shrink-0 h-12 flex items-center gap-3 px-3 border-b border-gray-200 bg-white lg:hidden">
                    {/* Profile pic */}
                    <Link href="/talent/profile" className="shrink-0">
                        <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm border-2"
                            style={{
                                background: `linear-gradient(135deg, #22C55E, #16A34A)`,
                                color: "#fff",
                                borderColor: `${accent}40`,
                            }}
                        >
                            {userId.slice(-2).toUpperCase()}
                        </div>
                    </Link>

                    {/* Search bar */}
                    <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1.5">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search"
                            className="flex-1 bg-transparent border-none outline-none text-gray-700 text-[13px] placeholder:text-gray-500"
                        />
                    </div>

                    {/* Chat icon */}
                    <Link href="/talent/messages" className="shrink-0 relative text-gray-500 hover:text-gray-700 transition-colors">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
                    </Link>
                </header>

                {/* ══════════════════════════════════════
                    DESKTOP HEADER (full header bar)
                   ══════════════════════════════════════ */}
                <header className="shrink-0 h-14 hidden lg:flex items-center justify-between px-6 border-b border-gray-200 bg-white/80 backdrop-blur-xl z-30">
                    {/* Search bar */}
                    <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3.5 py-2 border border-gray-200 focus-within:border-emerald-300 focus-within:ring-2 focus-within:ring-emerald-50 transition-all max-w-[360px] w-full">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search SkillSpill..."
                            className="flex-1 bg-transparent border-none outline-none text-gray-700 text-[12px] placeholder:text-gray-400"
                        />
                    </div>

                    {/* Right actions */}
                    <div className="flex items-center gap-2 shrink-0">
                        <Link href="/talent/notifications"
                            className="relative w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
                        </Link>

                        <Link href="/talent/settings"
                            className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all">
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
                        </Link>

                        <div className="w-px h-6 bg-gray-200 mx-1" />

                        {/* Profile Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setProfileDropdown(!profileDropdown)}
                                className="flex items-center gap-2 p-1 rounded-xl hover:bg-gray-100 transition-all cursor-pointer bg-transparent border-none"
                            >
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm"
                                    style={{ background: `linear-gradient(135deg, #22C55E, #16A34A)`, color: "#fff" }}>
                                    {userId.slice(-2).toUpperCase()}
                                </div>
                                <div className="text-left">
                                    <p className="text-[11px] font-semibold text-gray-700 leading-tight">Ghost_Protocol</p>
                                    <p className="text-[9px] text-gray-400 leading-tight">Lv.42 Shadow</p>
                                </div>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </button>

                            {profileDropdown && (
                                <div className="absolute right-0 top-12 w-52 rounded-xl border border-gray-200 bg-white shadow-xl py-1.5 z-50">
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold"
                                                style={{ background: `linear-gradient(135deg, #22C55E, #16A34A)`, color: "#fff" }}>
                                                {userId.slice(-2).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-[12px] font-semibold text-gray-800">Ghost_Protocol</p>
                                                <p className="text-[10px] text-gray-400">Lv.42 Shadow</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="py-1">
                                        <Link href="/talent/profile" onClick={() => setProfileDropdown(false)}
                                            className="flex items-center gap-3 px-4 py-2.5 text-[12px] text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors no-underline">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                            View Profile
                                        </Link>
                                        <Link href="/talent/settings" onClick={() => setProfileDropdown(false)}
                                            className="flex items-center gap-3 px-4 py-2.5 text-[12px] text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors no-underline">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82" /></svg>
                                            Settings
                                        </Link>
                                        <Link href="/talent/notifications" onClick={() => setProfileDropdown(false)}
                                            className="flex items-center gap-3 px-4 py-2.5 text-[12px] text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors no-underline">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
                                            Notifications
                                            <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full bg-red-100 text-red-600 font-bold">5</span>
                                        </Link>
                                    </div>
                                    <div className="border-t border-gray-100 pt-1">
                                        <button onClick={handleLogout}
                                            className="flex items-center gap-3 px-4 py-2.5 text-[12px] text-red-500 hover:bg-red-50 transition-colors w-full bg-transparent border-none cursor-pointer text-left">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Content — pb-16 on mobile for bottom nav space */}
                <main className="flex-1 overflow-y-auto pb-16 lg:pb-0" style={{ scrollbarWidth: "thin", scrollbarColor: "#D1D5DB #F5F5F7" }}>
                    {children}
                </main>

                {/* ══════════════════════════════════════
                    MOBILE BOTTOM NAV (LinkedIn-style)
                   ══════════════════════════════════════ */}
                <nav className="fixed bottom-0 left-0 right-0 h-14 bg-white border-t border-gray-200 flex items-center justify-around px-2 z-40 lg:hidden">
                    {mobileNavItems.map((item) => {
                        // Special center Spill button
                        if (item.label === "Spill") {
                            return (
                                <Link key="spill" href="/talent/spills"
                                    className="flex flex-col items-center justify-center -mt-5 no-underline">
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
                                        style={{ background: `linear-gradient(135deg, ${accent}, #16A34A)` }}>
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                                            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                                        </svg>
                                    </div>
                                    <span className="text-[9px] font-semibold mt-0.5" style={{ color: "#16A34A" }}>Spill</span>
                                </Link>
                            );
                        }

                        const active = isActive(item.href);
                        return (
                            <Link key={item.label} href={item.href}
                                className={`flex flex-col items-center justify-center gap-0.5 py-1 px-2 no-underline transition-colors
                                    ${active ? "text-emerald-600" : "text-gray-400"}`}>
                                {active ? item.iconFilled : item.icon}
                                <span className="text-[9px] font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}
