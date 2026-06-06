"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
    Bell, FileText, Sparkles, MessageSquare, Rocket, AlertTriangle,
    CheckCheck, Loader2, UserPlus, MessageCircle, Heart,
} from "lucide-react";

const accent = "#A855F7";

interface Notification {
    id: string;
    title: string;
    message: string;
    type: string;
    isRead: boolean;
    link: string | null;
    createdAt: string;
}

const TYPE_META: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
    application: { icon: <FileText className="w-5 h-5" />,        color: "#3B82F6", bg: "#3B82F620" },
    match:       { icon: <Sparkles className="w-5 h-5" />,        color: "#A855F7", bg: "#A855F720" },
    message:     { icon: <MessageSquare className="w-5 h-5" />,   color: "#06B6D4", bg: "#06B6D420" },
    system:      { icon: <Rocket className="w-5 h-5" />,          color: "#F59E0B", bg: "#F59E0B20" },
    alert:       { icon: <AlertTriangle className="w-5 h-5" />,   color: "#EF4444", bg: "#EF444420" },
    follow:      { icon: <UserPlus className="w-5 h-5" />,        color: "#EC4899", bg: "#EC489920" },
    comment:     { icon: <MessageCircle className="w-5 h-5" />,   color: "#8B5CF6", bg: "#8B5CF620" },
    like:        { icon: <Heart className="w-5 h-5" />,           color: "#EF4444", bg: "#EF444420" },
    info:        { icon: <Bell className="w-5 h-5" />,            color: "#6B7280", bg: "#6B728020" },
};

function timeAgo(iso: string) {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1)  return "Just now";
    if (m < 60) return `${m}m`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h`;
    const d = Math.floor(h / 24);
    if (d < 7)  return `${d}d`;
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function groupByTime(notifs: Notification[]) {
    const now = Date.now();
    const groups: { label: string; items: Notification[] }[] = [
        { label: "New", items: [] },
        { label: "Today", items: [] },
        { label: "This Week", items: [] },
        { label: "Earlier", items: [] },
    ];
    for (const n of notifs) {
        const diff = now - new Date(n.createdAt).getTime();
        const hours = diff / 3600000;
        if (!n.isRead && hours < 24)      groups[0].items.push(n);
        else if (hours < 24)              groups[1].items.push(n);
        else if (hours < 168)             groups[2].items.push(n);
        else                              groups[3].items.push(n);
    }
    return groups.filter(g => g.items.length > 0);
}

export default function RecruiterNotificationsPage() {
    const [notifs, setNotifs]         = useState<Notification[]>([]);
    const [loading, setLoading]       = useState(true);
    const [unread, setUnread]         = useState(0);
    const [filter, setFilter]         = useState<"all" | "unread">("all");
    const [markingAll, setMarkingAll] = useState(false);

    useEffect(() => {
        fetch("/api/notifications")
            .then(r => r.json())
            .then(d => {
                setNotifs(d.notifications ?? []);
                setUnread(d.unreadCount ?? 0);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const markAllRead = async () => {
        setMarkingAll(true);
        await fetch("/api/notifications", { method: "PATCH" });
        setNotifs(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnread(0);
        setMarkingAll(false);
    };

    const markOneRead = async (id: string) => {
        await fetch(`/api/notifications/${id}`, { method: "PATCH" });
        setNotifs(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        setUnread(prev => Math.max(0, prev - 1));
    };

    const dismiss = async (id: string, wasUnread: boolean) => {
        await fetch(`/api/notifications/${id}`, { method: "DELETE" });
        setNotifs(prev => prev.filter(n => n.id !== id));
        if (wasUnread) setUnread(prev => Math.max(0, prev - 1));
    };

    const visible = filter === "unread" ? notifs.filter(n => !n.isRead) : notifs;
    const groups = groupByTime(visible);

    return (
        <div className="min-h-full" style={{ background: "var(--theme-bg)" }}>
            <div className="max-w-xl mx-auto px-0 sm:px-4 py-0 pb-24 lg:pb-8">

                {/* Sticky header */}
                <div className="sticky top-0 z-10 px-4 pt-5 pb-3" style={{ background: "var(--theme-bg)" }}>
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-[20px] font-bold tracking-tight" style={{ color: "var(--theme-text-primary)" }}>
                            Notifications
                        </h1>
                        {unread > 0 && (
                            <button
                                onClick={markAllRead}
                                disabled={markingAll}
                                className="flex items-center gap-1.5 text-[12px] font-semibold cursor-pointer bg-transparent border-none disabled:opacity-50 transition-opacity"
                                style={{ color: accent }}>
                                {markingAll ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCheck className="w-3.5 h-3.5" />}
                                Mark all read
                            </button>
                        )}
                    </div>

                    {/* Filter pills */}
                    <div className="flex gap-2">
                        {(["all", "unread"] as const).map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className="px-4 py-1.5 rounded-full text-[12px] font-semibold cursor-pointer border transition-all"
                                style={filter === f
                                    ? { background: accent, color: "#fff", borderColor: accent }
                                    : { background: "transparent", color: "var(--theme-text-muted)", borderColor: "var(--theme-border)" }}>
                                {f === "all" ? "All" : `Unread${unread > 0 ? ` (${unread})` : ""}`}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex items-center justify-center py-24">
                        <Loader2 className="w-7 h-7 animate-spin" style={{ color: accent }} />
                    </div>
                ) : visible.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: `${accent}15` }}>
                            <Bell className="w-7 h-7" style={{ color: accent }} />
                        </div>
                        <p className="text-[16px] font-bold mb-1" style={{ color: "var(--theme-text-primary)" }}>
                            {filter === "unread" ? "All caught up!" : "No notifications yet"}
                        </p>
                        <p className="text-[13px]" style={{ color: "var(--theme-text-muted)" }}>
                            {filter === "unread" ? "You've read everything." : "Activity will show up here."}
                        </p>
                    </div>
                ) : (
                    <div>
                        {groups.map(group => (
                            <div key={group.label}>
                                {/* Section label */}
                                <p className="px-4 py-2 text-[12px] font-bold uppercase tracking-wider" style={{ color: "var(--theme-text-muted)" }}>
                                    {group.label}
                                </p>

                                {group.items.map(n => {
                                    const meta = TYPE_META[n.type] ?? TYPE_META["info"];
                                    const Wrapper = n.link ? Link : "div";
                                    return (
                                        <div
                                            key={n.id}
                                            className="relative group"
                                            style={!n.isRead ? { background: `${accent}06` } : {}}>

                                            {/* Unread left stripe */}
                                            {!n.isRead && (
                                                <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r-full" style={{ background: accent }} />
                                            )}

                                            <Wrapper
                                                href={n.link ?? "#"}
                                                onClick={() => { if (!n.isRead) markOneRead(n.id); }}
                                                className="flex items-center gap-3.5 px-4 py-3.5 no-underline cursor-pointer transition-all hover:bg-(--theme-bg-secondary)">

                                                {/* Type icon circle */}
                                                <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0"
                                                    style={{ background: meta.bg, color: meta.color }}>
                                                    {meta.icon}
                                                </div>

                                                {/* Text */}
                                                <div className="flex-1 min-w-0 pr-8">
                                                    <p className="text-[13px] leading-snug line-clamp-1"
                                                        style={{ color: "var(--theme-text-primary)", fontWeight: n.isRead ? 400 : 600 }}>
                                                        {n.title}
                                                    </p>
                                                    <p className="text-[12px] mt-0.5 leading-snug line-clamp-2" style={{ color: "var(--theme-text-muted)" }}>
                                                        {n.message}
                                                    </p>
                                                    <p className="text-[11px] mt-1 font-medium" style={{ color: !n.isRead ? accent : "var(--theme-text-muted)" }}>
                                                        {timeAgo(n.createdAt)}
                                                    </p>
                                                </div>

                                                {/* Unread dot */}
                                                {!n.isRead && (
                                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full shrink-0" style={{ background: accent }} />
                                                )}
                                            </Wrapper>

                                            {/* Dismiss on hover */}
                                            <button
                                                onClick={() => dismiss(n.id, !n.isRead)}
                                                className="absolute right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 w-6 h-6 rounded-full flex items-center justify-center border-none cursor-pointer transition-all"
                                                style={{ background: "var(--theme-input-bg)", color: "var(--theme-text-muted)" }}>
                                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                            </button>
                                        </div>
                                    );
                                })}

                                {/* Divider */}
                                <div className="mx-4 my-1" style={{ borderTop: "1px solid var(--theme-border-light)" }} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
