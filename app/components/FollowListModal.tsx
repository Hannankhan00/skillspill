"use client";

import React, { useEffect, useState, useRef } from "react";
import { X, Search, Loader2, Users } from "lucide-react";
import Link from "next/link";

interface FollowUser {
    id: string;
    fullName: string;
    username: string;
    avatarUrl?: string;
    role: string;
    talentProfile?: { experienceLevel?: string };
    recruiterProfile?: { companyName?: string };
}

interface FollowListModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
    type: "followers" | "following";
    count: number;
    accent: string;
    profileBasePath: string; // e.g. "/talent" or "/recruiter"
}

export default function FollowListModal({
    isOpen,
    onClose,
    userId,
    type,
    count,
    accent,
    profileBasePath,
}: FollowListModalProps) {
    const [users, setUsers] = useState<FollowUser[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const searchRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!isOpen) {
            setSearch("");
            return;
        }
        setLoading(true);
        fetch(`/api/user/${type}?userId=${userId}`)
            .then(r => r.json())
            .then(d => {
                setUsers(d[type] ?? []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [isOpen, userId, type]);

    useEffect(() => {
        if (isOpen) setTimeout(() => searchRef.current?.focus(), 100);
    }, [isOpen]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        if (isOpen) window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const filtered = users.filter(u =>
        u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        u.username?.toLowerCase().includes(search.toLowerCase())
    );

    const getSubtitle = (u: FollowUser) => {
        if (u.role === "TALENT" && u.talentProfile?.experienceLevel)
            return `${u.talentProfile.experienceLevel} Developer`;
        if (u.role === "RECRUITER" && u.recruiterProfile?.companyName)
            return u.recruiterProfile.companyName;
        return u.role === "TALENT" ? "Talent" : "Recruiter";
    };

    const getUserPath = (u: FollowUser) => {
        const base = u.role === "TALENT" ? profileBasePath + "/talent" : profileBasePath + "/recruiter";
        return `${base}/${u.id}`;
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div
                className="w-full max-w-md rounded-2xl flex flex-col overflow-hidden"
                style={{
                    background: "var(--theme-card)",
                    border: "1px solid var(--theme-border)",
                    maxHeight: "80vh",
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--theme-border)" }}>
                    <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" style={{ color: accent }} />
                        <h2 className="text-[14px] font-bold" style={{ color: "var(--theme-text-primary)" }}>
                            {type === "followers" ? "Followers" : "Following"}
                            <span className="ml-2 text-[12px] font-normal" style={{ color: "var(--theme-text-muted)" }}>{count}</span>
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer border-none"
                        style={{ background: "var(--theme-bg-secondary)", color: "var(--theme-text-muted)" }}
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Search */}
                <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--theme-border-light)" }}>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: "var(--theme-input-bg)", border: "1px solid var(--theme-border-light)" }}>
                        <Search className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--theme-text-muted)" }} />
                        <input
                            ref={searchRef}
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search by name or username..."
                            className="flex-1 bg-transparent text-[12px] outline-none border-none"
                            style={{ color: "var(--theme-text-primary)" }}
                        />
                        {search && (
                            <button onClick={() => setSearch("")} className="cursor-pointer border-none bg-transparent p-0" style={{ color: "var(--theme-text-muted)" }}>
                                <X className="w-3 h-3" />
                            </button>
                        )}
                    </div>
                </div>

                {/* List */}
                <div className="overflow-y-auto flex-1 px-3 py-2">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-3">
                            <Loader2 className="w-6 h-6 animate-spin" style={{ color: accent }} />
                            <p className="text-[12px]" style={{ color: "var(--theme-text-muted)" }}>Loading...</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-2">
                            <Users className="w-8 h-8" style={{ color: "var(--theme-text-muted)", opacity: 0.4 }} />
                            <p className="text-[13px] font-semibold" style={{ color: "var(--theme-text-secondary)" }}>
                                {search ? "No results found" : type === "followers" ? "No followers yet" : "Not following anyone"}
                            </p>
                            {search && (
                                <p className="text-[11px]" style={{ color: "var(--theme-text-muted)" }}>Try a different search term</p>
                            )}
                        </div>
                    ) : (
                        filtered.map(u => (
                            <Link
                                key={u.id}
                                href={getUserPath(u)}
                                onClick={onClose}
                                className="flex items-center gap-3 px-2 py-2.5 rounded-xl transition-all no-underline group"
                                style={{ color: "inherit" }}
                                onMouseEnter={e => (e.currentTarget.style.background = "var(--theme-bg-secondary)")}
                                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                            >
                                {/* Avatar */}
                                {u.avatarUrl ? (
                                    <img src={u.avatarUrl} alt={u.fullName} className="w-10 h-10 rounded-full object-cover shrink-0" style={{ border: `1px solid ${accent}30` }} />
                                ) : (
                                    <div
                                        className="w-10 h-10 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
                                        style={{
                                            background: u.role === "TALENT"
                                                ? "linear-gradient(135deg, #22C55E, #16A34A)"
                                                : "linear-gradient(135deg, #A855F7, #7C3AED)",
                                            color: "#fff",
                                        }}
                                    >
                                        {u.fullName?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "??"}
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="text-[13px] font-semibold truncate" style={{ color: "var(--theme-text-primary)" }}>{u.fullName}</p>
                                    <p className="text-[11px] truncate" style={{ color: "var(--theme-text-muted)" }}>
                                        @{u.username} · {getSubtitle(u)}
                                    </p>
                                </div>
                                <span
                                    className="text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0"
                                    style={{
                                        background: u.role === "TALENT" ? "#3CF91A15" : `${accent}15`,
                                        color: u.role === "TALENT" ? "#3CF91A" : accent,
                                        border: u.role === "TALENT" ? "1px solid #3CF91A30" : `1px solid ${accent}30`,
                                    }}
                                >
                                    {u.role === "TALENT" ? "Talent" : "Recruiter"}
                                </span>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
