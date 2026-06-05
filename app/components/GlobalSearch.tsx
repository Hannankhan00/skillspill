"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

type SearchItem = {
    label: string;
    description: string;
    href: string;
    keywords: string[];
    icon: React.ReactNode;
    group: string;
};

const recruiterItems: SearchItem[] = [
    {
        label: "Feed",
        description: "Your home feed and posts",
        href: "/recruiter",
        keywords: ["home", "feed", "posts", "spills", "news"],
        group: "Pages",
        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
    },
    {
        label: "Search Talent",
        description: "Find and browse talent profiles",
        href: "/recruiter/search",
        keywords: ["search", "find", "browse", "talent", "candidates", "people"],
        group: "Pages",
        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
    },
    {
        label: "Jobs",
        description: "Manage your job postings",
        href: "/recruiter/jobs",
        keywords: ["jobs", "postings", "listings", "vacancies", "openings", "hire", "create job"],
        group: "Pages",
        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>,
    },
    {
        label: "Applications",
        description: "Review job applications from candidates",
        href: "/recruiter/applications",
        keywords: ["applications", "applicants", "candidates", "review", "cvs", "resumes"],
        group: "Pages",
        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
    },
    {
        label: "Messages",
        description: "Chat with candidates and connections",
        href: "/recruiter/messages",
        keywords: ["messages", "chat", "inbox", "conversations", "dm", "direct"],
        group: "Pages",
        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>,
    },
    {
        label: "My Profile",
        description: "View and edit your recruiter profile",
        href: "/recruiter/profile",
        keywords: ["profile", "my profile", "company", "bio", "edit profile", "avatar"],
        group: "Pages",
        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
    },
    {
        label: "Notifications",
        description: "Your alerts and activity",
        href: "/recruiter/notifications",
        keywords: ["notifications", "alerts", "activity", "updates", "bell"],
        group: "Pages",
        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>,
    },
    {
        label: "Settings",
        description: "Account and preference settings",
        href: "/recruiter/settings",
        keywords: ["settings", "account", "preferences", "password", "email", "privacy"],
        group: "Pages",
        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>,
    },
];

const talentItems: SearchItem[] = [
    {
        label: "Home",
        description: "Your home feed and posts",
        href: "/talent",
        keywords: ["home", "feed", "posts", "spills", "news"],
        group: "Pages",
        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
    },
    {
        label: "Search",
        description: "Search for people and content",
        href: "/talent/search",
        keywords: ["search", "find", "browse", "people", "recruiters", "users"],
        group: "Pages",
        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
    },
    {
        label: "Discover Jobs",
        description: "Browse and apply for jobs",
        href: "/talent/jobs",
        keywords: ["jobs", "apply", "listings", "vacancies", "openings", "find work", "career", "employment"],
        group: "Pages",
        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>,
    },
    {
        label: "Messages",
        description: "Chat with recruiters and connections",
        href: "/talent/messages",
        keywords: ["messages", "chat", "inbox", "conversations", "dm", "direct"],
        group: "Pages",
        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>,
    },
    {
        label: "My Profile",
        description: "View and edit your talent profile",
        href: "/talent/profile",
        keywords: ["profile", "my profile", "bio", "edit profile", "avatar", "portfolio", "resume", "cv", "skills"],
        group: "Pages",
        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
    },
    {
        label: "GitHub",
        description: "Connect your GitHub and showcase your work",
        href: "/talent/github",
        keywords: ["github", "git", "code", "repositories", "repos", "open source", "contributions", "developer"],
        group: "Pages",
        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" /></svg>,
    },
    {
        label: "Skill Tree",
        description: "Your skill progression and badges",
        href: "/talent/skill-tree",
        keywords: ["skills", "skill tree", "badges", "level", "xp", "experience", "progression", "achievements"],
        group: "Pages",
        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>,
    },
    {
        label: "Notifications",
        description: "Your alerts and activity",
        href: "/talent/notifications",
        keywords: ["notifications", "alerts", "activity", "updates", "bell"],
        group: "Pages",
        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>,
    },
    {
        label: "Settings",
        description: "Account and preference settings",
        href: "/talent/settings",
        keywords: ["settings", "account", "preferences", "password", "email", "privacy"],
        group: "Pages",
        icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>,
    },
];

function highlight(text: string, query: string) {
    if (!query) return <>{text}</>;
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return <>{text}</>;
    return (
        <>
            {text.slice(0, idx)}
            <mark className="bg-transparent font-bold" style={{ color: "inherit" }}>
                {text.slice(idx, idx + query.length)}
            </mark>
            {text.slice(idx + query.length)}
        </>
    );
}

export default function GlobalSearch({
    role,
    accent,
    placeholder = "Search SkillSpill...",
}: {
    role: "recruiter" | "talent";
    accent: string;
    placeholder?: string;
}) {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const [activeIdx, setActiveIdx] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    const allItems = role === "recruiter" ? recruiterItems : talentItems;

    const filtered = query.trim()
        ? allItems.filter((item) => {
              const q = query.toLowerCase();
              return (
                  item.label.toLowerCase().includes(q) ||
                  item.description.toLowerCase().includes(q) ||
                  item.keywords.some((k) => k.includes(q))
              );
          })
        : allItems;

    useEffect(() => {
        setActiveIdx(0);
    }, [query]);

    const navigate = useCallback(
        (item: SearchItem) => {
            setOpen(false);
            setQuery("");
            router.push(item.href);
        },
        [router]
    );

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!open) return;
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIdx((i) => Math.min(i + 1, filtered.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIdx((i) => Math.max(i - 1, 0));
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (filtered[activeIdx]) navigate(filtered[activeIdx]);
        } else if (e.key === "Escape") {
            setOpen(false);
            inputRef.current?.blur();
        }
    };

    // Scroll active item into view
    useEffect(() => {
        if (!listRef.current) return;
        const el = listRef.current.querySelectorAll("[data-item]")[activeIdx] as HTMLElement | undefined;
        el?.scrollIntoView({ block: "nearest" });
    }, [activeIdx]);

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node) &&
                inputRef.current &&
                !inputRef.current.contains(e.target as Node)
            ) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div className="relative max-w-[360px] w-full">
            {/* Input */}
            <div
                className="flex items-center gap-2 rounded-xl px-3.5 py-2 transition-all"
                style={{
                    background: "var(--theme-input-bg)",
                    border: `1px solid ${open ? accent + "60" : "var(--theme-border)"}`,
                    boxShadow: open ? `0 0 0 3px ${accent}15` : "none",
                }}
            >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" className="shrink-0">
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setOpen(true)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="flex-1 bg-transparent border-none outline-none text-[12px]"
                    style={{ color: "var(--theme-text-primary)" }}
                    autoComplete="off"
                />
                {query && (
                    <button
                        onClick={() => { setQuery(""); inputRef.current?.focus(); }}
                        className="shrink-0 bg-transparent border-none cursor-pointer p-0 flex items-center"
                        style={{ color: "var(--theme-text-muted)" }}
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                )}
                <kbd className="shrink-0 hidden sm:inline-flex items-center text-[9px] px-1.5 py-0.5 rounded font-mono" style={{ background: "var(--theme-border)", color: "var(--theme-text-muted)" }}>
                    /
                </kbd>
            </div>

            {/* Dropdown */}
            {open && (
                <div
                    ref={dropdownRef}
                    className="absolute top-[calc(100%+6px)] left-0 w-[340px] rounded-xl shadow-2xl z-[100] overflow-hidden"
                    style={{ background: "var(--theme-surface)", border: "1px solid var(--theme-border)" }}
                >
                    {filtered.length === 0 ? (
                        <div className="px-4 py-6 text-center">
                            <p className="text-[12px]" style={{ color: "var(--theme-text-muted)" }}>No results for &ldquo;{query}&rdquo;</p>
                        </div>
                    ) : (
                        <div ref={listRef} className="py-1.5 max-h-72 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
                            {!query && (
                                <p className="px-3 pt-1 pb-1.5 text-[9px] font-bold uppercase tracking-widest" style={{ color: "var(--theme-text-muted)" }}>
                                    Navigate to
                                </p>
                            )}
                            {filtered.map((item, i) => (
                                <button
                                    key={item.href}
                                    data-item
                                    onClick={() => navigate(item)}
                                    onMouseEnter={() => setActiveIdx(i)}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-left border-none cursor-pointer transition-all"
                                    style={{
                                        background: i === activeIdx ? `${accent}15` : "transparent",
                                        color: "var(--theme-text-primary)",
                                    }}
                                >
                                    <span
                                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                                        style={{
                                            background: i === activeIdx ? `${accent}25` : "var(--theme-input-bg)",
                                            color: i === activeIdx ? accent : "var(--theme-text-muted)",
                                        }}
                                    >
                                        {item.icon}
                                    </span>
                                    <span className="flex-1 min-w-0">
                                        <span className="block text-[12px] font-medium truncate">
                                            {highlight(item.label, query)}
                                        </span>
                                        <span className="block text-[10px] truncate" style={{ color: "var(--theme-text-muted)" }}>
                                            {highlight(item.description, query)}
                                        </span>
                                    </span>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 opacity-40">
                                        <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                                    </svg>
                                </button>
                            ))}
                        </div>
                    )}
                    <div className="flex items-center gap-3 px-3 py-2" style={{ borderTop: "1px solid var(--theme-border-light)" }}>
                        <span className="text-[9px]" style={{ color: "var(--theme-text-muted)" }}>
                            <kbd className="px-1 py-0.5 rounded text-[8px]" style={{ background: "var(--theme-border)" }}>↑↓</kbd> navigate &nbsp;
                            <kbd className="px-1 py-0.5 rounded text-[8px]" style={{ background: "var(--theme-border)" }}>↵</kbd> go &nbsp;
                            <kbd className="px-1 py-0.5 rounded text-[8px]" style={{ background: "var(--theme-border)" }}>esc</kbd> close
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
