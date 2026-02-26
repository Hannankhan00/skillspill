"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ThemeToggle } from "../components/ThemeProvider";
import Logo from "../components/Logo";

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

function SpillsIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14,2 14,8 20,8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10,9 9,9 8,9" />
        </svg>
    );
}

/* ── Nav Items ── */
const recruiterNavItems = [
    { label: "Feed", icon: <HomeIcon />, href: "/recruiter" },
    { label: "My Spills", icon: <SpillsIcon />, href: "/recruiter/spills" },
    { label: "Search Talent", icon: <SearchIcon />, href: "/recruiter/search" },
    { label: "Applications", icon: <UsersIcon />, href: "/recruiter/applications" },
    { label: "Messages", icon: <MessageIcon />, href: "/recruiter/messages" },
    { label: "Settings", icon: <SettingsIcon />, href: "/recruiter/settings" },
];

/* ── Bottom nav items (mobile) ── */
const mobileNavItems = [
    {
        label: "Home", href: "/recruiter",
        icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
        iconFilled: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><rect x="9" y="12" width="6" height="10" fill="white" /></svg>,
    },
    {
        label: "Search", href: "/recruiter/search",
        icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
        iconFilled: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
    },
    { label: "Spill", href: "#spill", icon: null, iconFilled: null }, // special center button
    {
        label: "Alerts", href: "/recruiter/notifications",
        icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>,
        iconFilled: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg>,
    },
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
    const [profileDropdown, setProfileDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
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
        <div className="h-screen overflow-hidden flex" style={{ background: 'var(--theme-bg)', color: 'var(--theme-text-primary)' }}>

            {/* ══════════════════════════════════════
                DESKTOP SIDEBAR (hidden on mobile)
               ══════════════════════════════════════ */}
            <aside className="hidden lg:flex w-[220px] flex-col shrink-0" style={{ background: 'var(--theme-surface)', borderRight: '1px solid var(--theme-border)' }}>
                {/* Logo */}
                <div className="h-14 flex items-center px-5" style={{ borderBottom: '1px solid var(--theme-border-light)' }}>
                    <Link href="/recruiter" className="flex items-center gap-2.5">
                        <Logo height={36} accentColor="#A855F7" />
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
                                        ? `text-white`
                                        : ""
                                    }
                                `}
                                style={active ? {
                                    background: accent,
                                    boxShadow: `0 0 20px ${accent}40, 0 0 40px ${accent}15`,
                                } : { color: 'var(--theme-text-muted)' }}
                            >
                                <span className={active ? "text-white" : ``} style={active ? {} : { color: 'var(--theme-text-muted)' }}>
                                    {item.icon}
                                </span>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Section */}
                <div className="p-4 space-y-3" style={{ borderTop: '1px solid var(--theme-border-light)' }}>
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
                            <p className="text-xs font-semibold truncate" style={{ color: 'var(--theme-text-secondary)' }}>Recruiter</p>
                            <p className="text-[10px] font-mono text-[#A855F7]">Talent Scout</p>
                        </div>
                    </div>

                    <button
                        className="w-full py-2.5 rounded-lg text-[12px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] cursor-pointer border-none"
                        style={{
                            background: `linear-gradient(135deg, ${accent}, #7C3AED)`,
                            color: "#fff",
                            boxShadow: `0 0 15px ${accent}40`,
                        }}
                    >
                        <PlusIcon />
                        NEW APPLICATION
                    </button>

                    <button
                        onClick={handleLogout}
                        className="w-full py-2 rounded-lg text-[11px] font-medium flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer bg-transparent hover:text-red-500 hover:border-red-300"
                        style={{ border: '1px solid var(--theme-border)', color: 'var(--theme-text-muted)' }}
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
                <header className="shrink-0 h-12 flex items-center gap-3 px-3 lg:hidden" style={{ background: 'var(--theme-surface)', borderBottom: '1px solid var(--theme-border)' }}>
                    {/* Profile pic */}
                    <Link href="/recruiter/profile" className="shrink-0">
                        <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm border-2"
                            style={{
                                background: `linear-gradient(135deg, #A855F7, #7C3AED)`,
                                color: "#fff",
                                borderColor: `${accent}40`,
                            }}
                        >
                            {userId.slice(-2).toUpperCase()}
                        </div>
                    </Link>

                    {/* Search bar */}
                    <div className="flex-1 flex items-center gap-2 rounded-lg px-3 py-1.5" style={{ background: 'var(--theme-input-bg)' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search"
                            className="flex-1 bg-transparent border-none outline-none text-[13px]"
                            style={{ color: 'var(--theme-text-primary)' }}
                        />
                    </div>

                    {/* Chat icon */}
                    <ThemeToggle size="sm" />

                    <Link href="/recruiter/messages" className="shrink-0 relative transition-colors" style={{ color: 'var(--theme-text-muted)' }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full" style={{ border: '1px solid var(--theme-surface)' }} />
                    </Link>
                </header>

                {/* ══════════════════════════════════════
                    DESKTOP HEADER (full header bar)
                   ══════════════════════════════════════ */}
                <header className="shrink-0 h-14 hidden lg:flex items-center justify-between px-6 backdrop-blur-xl z-30" style={{ background: 'var(--theme-header-bg)', borderBottom: '1px solid var(--theme-border)' }}>
                    <div className="flex items-center gap-2 rounded-xl px-3.5 py-2 focus-within:border-[#A855F7]/40 focus-within:ring-2 focus-within:ring-purple-50 transition-all max-w-[360px] w-full" style={{ background: 'var(--theme-input-bg)', border: '1px solid var(--theme-border)' }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search SkillSpill..."
                            className="flex-1 bg-transparent border-none outline-none text-[12px]"
                            style={{ color: 'var(--theme-text-primary)' }}
                        />
                    </div>

                    {/* Right actions */}
                    <div className="flex items-center gap-2 shrink-0">
                        <ThemeToggle size="sm" />

                        <Link href="/recruiter/notifications"
                            className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all" style={{ color: 'var(--theme-text-muted)' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" style={{ border: '1px solid var(--theme-surface)' }} />
                        </Link>

                        <Link href="/recruiter/settings"
                            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all" style={{ color: 'var(--theme-text-muted)' }}>
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
                        </Link>

                        <div className="w-px h-6 mx-1" style={{ background: 'var(--theme-border)' }} />

                        {/* Profile Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setProfileDropdown(!profileDropdown)}
                                className="flex items-center gap-2 p-1 rounded-xl transition-all cursor-pointer bg-transparent border-none"
                            >
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm"
                                    style={{ background: `linear-gradient(135deg, #A855F7, #7C3AED)`, color: "#fff" }}>
                                    {userId.slice(-2).toUpperCase()}
                                </div>
                                <div className="text-left">
                                    <p className="text-[11px] font-semibold leading-tight" style={{ color: 'var(--theme-text-secondary)' }}>Recruiter</p>
                                    <p className="text-[9px] leading-tight" style={{ color: 'var(--theme-text-muted)' }}>Talent Scout</p>
                                </div>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </button>

                            {profileDropdown && (
                                <div className="absolute right-0 top-12 w-52 rounded-xl shadow-xl py-1.5 z-50" style={{ background: 'var(--theme-surface)', border: '1px solid var(--theme-border)' }}>
                                    <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--theme-border-light)' }}>
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold"
                                                style={{ background: `linear-gradient(135deg, #A855F7, #7C3AED)`, color: "#fff" }}>
                                                {userId.slice(-2).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-[12px] font-semibold" style={{ color: 'var(--theme-text-primary)' }}>Recruiter</p>
                                                <p className="text-[10px]" style={{ color: 'var(--theme-text-muted)' }}>Talent Scout</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="py-1">
                                        <Link href="/recruiter/profile" onClick={() => setProfileDropdown(false)}
                                            className="flex items-center gap-3 px-4 py-2.5 text-[12px] hover:text-[#A855F7] transition-colors no-underline" style={{ color: 'var(--theme-text-tertiary)' }}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                            View Profile
                                        </Link>
                                        <Link href="/recruiter/settings" onClick={() => setProfileDropdown(false)}
                                            className="flex items-center gap-3 px-4 py-2.5 text-[12px] hover:text-[#A855F7] transition-colors no-underline" style={{ color: 'var(--theme-text-tertiary)' }}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82" /></svg>
                                            Settings
                                        </Link>
                                        <Link href="/recruiter/notifications" onClick={() => setProfileDropdown(false)}
                                            className="flex items-center gap-3 px-4 py-2.5 text-[12px] hover:text-[#A855F7] transition-colors no-underline" style={{ color: 'var(--theme-text-tertiary)' }}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
                                            Notifications
                                            <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full bg-red-100 text-red-600 font-bold">3</span>
                                        </Link>
                                    </div>
                                    <div className="pt-1" style={{ borderTop: '1px solid var(--theme-border-light)' }}>
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

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto pb-16 lg:pb-0" style={{ scrollbarWidth: "thin", scrollbarColor: 'var(--theme-scrollbar-thumb) var(--theme-scrollbar-track)' }}>
                    {children}
                </main>

                {/* ══════════════════════════════════════
                    MOBILE BOTTOM NAV (LinkedIn-style)
                   ══════════════════════════════════════ */}
                <nav className="fixed bottom-0 left-0 right-0 h-14 flex items-center justify-around px-2 z-40 lg:hidden" style={{ background: 'var(--theme-surface)', borderTop: '1px solid var(--theme-border)' }}>
                    {mobileNavItems.map((item) => {
                        // Special center Spill button
                        if (item.label === "Spill") {
                            return (
                                <Link key="spill" href="/recruiter/spills"
                                    className="flex flex-col items-center justify-center -mt-5 no-underline">
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
                                        style={{ background: `linear-gradient(135deg, ${accent}, #7C3AED)` }}>
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                                            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                                        </svg>
                                    </div>
                                    <span className="text-[9px] font-semibold mt-0.5" style={{ color: accent }}>Spill</span>
                                </Link>
                            );
                        }

                        const active = isActive(item.href);
                        return (
                            <Link key={item.label} href={item.href}
                                className={`flex flex-col items-center justify-center gap-0.5 py-1 px-2 no-underline transition-colors
                                    ${active ? "text-[#A855F7]" : "text-[var(--theme-text-muted)]"}`}>
                                {active ? item.iconFilled : item.icon}
                                <span className="text-[9px] font-medium">{item.label}</span>
                                {item.label === "Alerts" && (
                                    <span className="absolute top-1 right-1/2 translate-x-3 w-1.5 h-1.5 bg-red-500 rounded-full" />
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}
