"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
    Bell, FileText, Sparkles, MessageSquare, Rocket, AlertTriangle,
    CheckCheck, Loader2, Trash2, X
} from "lucide-react";

const accent = "#3CF91A";

interface Notification {
    id: string;
    title: string;
    message: string;
    type: string;
    isRead: boolean;
    link: string | null;
    createdAt: string;
}

const TYPE_META: Record<string, { icon: React.ReactNode; color: string }> = {
    application: { icon: <FileText className="w-4 h-4" />,   color: "#3B82F6" },
    match:       { icon: <Sparkles className="w-4 h-4" />,   color: accent    },
    message:     { icon: <MessageSquare className="w-4 h-4" />, color: "#8B5CF6" },
    system:      { icon: <Rocket className="w-4 h-4" />,     color: "#F59E0B" },
    alert:       { icon: <AlertTriangle className="w-4 h-4" />, color: "#EF4444" },
    info:        { icon: <Bell className="w-4 h-4" />,        color: "var(--theme-text-muted)" },
};

function timeAgo(iso: string) {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1)  return "Just now";
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    if (d < 7)  return `${d}d ago`;
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function TalentNotificationsPage() {
    const [notifs, setNotifs]     = useState<Notification[]>([]);
    const [loading, setLoading]   = useState(true);
    const [unread, setUnread]     = useState(0);
    const [filter, setFilter]     = useState("All");
    const [markingAll, setMarkingAll] = useState(false);

    const filters = ["All", "Unread"];

    useEffect(() => {
        fetch("/api/notifications")
            .then(r => r.json())
            .then(d => {
                setNotifs(d.notifications ?? []);
                setUnread(d.unreadCount ?? 0);
                setLoading(false);
            })
            .catch(() => setLoading(false));
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

    const visible = filter === "Unread"
        ? notifs.filter(n => !n.isRead)
        : notifs;

    return (
        <div style={{ background: "var(--theme-bg)" }} className="min-h-full">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 py-5 pb-24 lg:pb-8">

                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h1 className="text-xl font-bold text-(--theme-text-primary)" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                            Notifications
                        </h1>
                        {unread > 0 && (
                            <p className="text-[12px] text-(--theme-text-muted) mt-0.5">
                                {unread} unread
                            </p>
                        )}
                    </div>
                    {unread > 0 && (
                        <button
                            onClick={markAllRead}
                            disabled={markingAll}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold border border-(--theme-border) bg-transparent cursor-pointer transition-all hover:border-(--theme-text-muted) disabled:opacity-50"
                            style={{ color: "var(--theme-text-muted)" }}>
                            {markingAll
                                ? <Loader2 className="w-3 h-3 animate-spin" />
                                : <CheckCheck className="w-3.5 h-3.5" />}
                            Mark all read
                        </button>
                    )}
                </div>

                {/* Filter tabs */}
                <div className="flex gap-1 p-1 rounded-xl mb-5" style={{ background: "var(--theme-input-bg)", border: "1px solid var(--theme-border)" }}>
                    {filters.map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className="flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer border-none"
                            style={filter === f
                                ? { background: accent, color: "#000" }
                                : { background: "transparent", color: "var(--theme-text-muted)" }}>
                            {f}
                            {f === "Unread" && unread > 0 && (
                                <span className="ml-1.5 text-[9px] px-1.5 py-0.5 rounded-full font-bold"
                                    style={{ background: filter === "Unread" ? "rgba(0,0,0,0.2)" : `${accent}20`, color: filter === "Unread" ? "#000" : accent }}>
                                    {unread}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* List */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-7 h-7 animate-spin" style={{ color: accent }} />
                    </div>
                ) : visible.length === 0 ? (
                    <div className="text-center py-20">
                        <Bell className="w-12 h-12 mx-auto mb-3 opacity-20" style={{ color: "var(--theme-text-muted)" }} />
                        <p className="text-[14px] font-semibold text-(--theme-text-secondary)">
                            {filter === "Unread" ? "All caught up!" : "No notifications yet"}
                        </p>
                        <p className="text-[12px] text-(--theme-text-muted) mt-1">
                            {filter === "Unread" ? "You have no unread notifications." : "Notifications will appear here."}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {visible.map(n => {
                            const meta = TYPE_META[n.type] ?? TYPE_META["info"];
                            const Wrapper = n.link ? Link : "div";
                            return (
                                <div
                                    key={n.id}
                                    className="group relative rounded-2xl border transition-all"
                                    style={{
                                        background: n.isRead ? "var(--theme-card)" : `${accent}06`,
                                        borderColor: n.isRead ? "var(--theme-border)" : `${accent}25`,
                                    }}>
                                    <Wrapper
                                        href={n.link ?? "#"}
                                        onClick={() => { if (!n.isRead) markOneRead(n.id); }}
                                        className="flex items-start gap-3.5 p-4 no-underline w-full cursor-pointer">

                                        {/* Icon */}
                                        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                                            style={{ background: `${meta.color}15`, color: meta.color }}>
                                            {meta.icon}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <p className="text-[13px] font-bold leading-snug"
                                                    style={{ color: n.isRead ? "var(--theme-text-secondary)" : "var(--theme-text-primary)" }}>
                                                    {n.title}
                                                </p>
                                                <span className="text-[10px] shrink-0 mt-0.5" style={{ color: "var(--theme-text-muted)" }}>
                                                    {timeAgo(n.createdAt)}
                                                </span>
                                            </div>
                                            <p className="text-[12px] mt-1 leading-relaxed" style={{ color: "var(--theme-text-muted)" }}>
                                                {n.message}
                                            </p>
                                        </div>

                                        {/* Unread dot */}
                                        {!n.isRead && (
                                            <div className="w-2 h-2 rounded-full shrink-0 mt-1.5" style={{ background: accent }} />
                                        )}
                                    </Wrapper>

                                    {/* Dismiss button */}
                                    <button
                                        onClick={() => dismiss(n.id, !n.isRead)}
                                        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-1 rounded-lg border-none bg-transparent cursor-pointer transition-all"
                                        style={{ color: "var(--theme-text-muted)" }}>
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
