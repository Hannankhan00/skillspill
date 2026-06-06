"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
    Bell, FileText, Sparkles, MessageSquare, Rocket, AlertTriangle,
    CheckCheck, Loader2, UserPlus, MessageCircle, Heart, X,
} from "lucide-react";

export interface IncomingNotif {
    id: string;
    title: string;
    message: string;
    type: string;
    link: string | null;
    createdAt: string;
}

interface Notif extends IncomingNotif {
    isRead: boolean;
}

const TYPE_META: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
    application: { icon: <FileText className="w-5 h-5" />,      color: "#3B82F6", bg: "#3B82F618" },
    match:       { icon: <Sparkles className="w-5 h-5" />,      color: "#A855F7", bg: "#A855F718" },
    message:     { icon: <MessageSquare className="w-5 h-5" />, color: "#06B6D4", bg: "#06B6D418" },
    system:      { icon: <Rocket className="w-5 h-5" />,        color: "#F59E0B", bg: "#F59E0B18" },
    alert:       { icon: <AlertTriangle className="w-5 h-5" />, color: "#EF4444", bg: "#EF444418" },
    follow:      { icon: <UserPlus className="w-5 h-5" />,      color: "#EC4899", bg: "#EC489918" },
    comment:     { icon: <MessageCircle className="w-5 h-5" />, color: "#8B5CF6", bg: "#8B5CF618" },
    like:        { icon: <Heart className="w-5 h-5" />,         color: "#EF4444", bg: "#EF444418" },
    info:        { icon: <Bell className="w-5 h-5" />,          color: "#6B7280", bg: "#6B728018" },
};

function timeAgo(iso: string) {
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return "Just now";
    if (m < 60) return `${m}m`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h`;
    const d = Math.floor(h / 24);
    if (d < 7) return `${d}d`;
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function groupByTime(notifs: Notif[]) {
    const now = Date.now();
    const groups: { label: string; items: Notif[] }[] = [
        { label: "New",       items: [] },
        { label: "Today",     items: [] },
        { label: "This Week", items: [] },
        { label: "Earlier",   items: [] },
    ];
    for (const n of notifs) {
        const h = (now - new Date(n.createdAt).getTime()) / 3_600_000;
        if (!n.isRead && h < 24)  groups[0].items.push(n);
        else if (h < 24)          groups[1].items.push(n);
        else if (h < 168)         groups[2].items.push(n);
        else                      groups[3].items.push(n);
    }
    return groups.filter(g => g.items.length > 0);
}

interface Props {
    open: boolean;
    onClose: () => void;
    accent: string;
    newNotif?: IncomingNotif | null;
    onUnreadChange: (count: number) => void;
}

export function NotificationPanel({ open, onClose, accent, newNotif, onUnreadChange }: Props) {
    const router = useRouter();
    const [notifs, setNotifs]         = useState<Notif[]>([]);
    const [loading, setLoading]       = useState(false);
    const [unread, setUnread]         = useState(0);
    const [markingAll, setMarkingAll] = useState(false);
    const [fetched, setFetched]       = useState(false);

    // Fetch once on first open
    useEffect(() => {
        if (!open || fetched) return;
        setLoading(true);
        fetch("/api/notifications")
            .then(r => r.json())
            .then(d => {
                setNotifs(d.notifications ?? []);
                const count = d.unreadCount ?? 0;
                setUnread(count);
                onUnreadChange(count);
                setFetched(true);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [open, fetched, onUnreadChange]);

    // Prepend real-time notification when panel is open
    useEffect(() => {
        if (!newNotif || !open) return;
        setNotifs(prev => [{ ...newNotif, isRead: false }, ...prev]);
        setUnread(prev => { const next = prev + 1; onUnreadChange(next); return next; });
    }, [newNotif]); // eslint-disable-line react-hooks/exhaustive-deps

    // Lock scroll when panel is open
    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [open]);

    const markAllRead = async () => {
        setMarkingAll(true);
        await fetch("/api/notifications", { method: "PATCH" });
        setNotifs(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnread(0);
        onUnreadChange(0);
        setMarkingAll(false);
    };

    const markOneRead = useCallback(async (id: string) => {
        await fetch(`/api/notifications/${id}`, { method: "PATCH" });
        setNotifs(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        setUnread(prev => { const next = Math.max(0, prev - 1); onUnreadChange(next); return next; });
    }, [onUnreadChange]);

    const dismiss = async (id: string, wasUnread: boolean, e: React.MouseEvent) => {
        e.stopPropagation();
        await fetch(`/api/notifications/${id}`, { method: "DELETE" });
        setNotifs(prev => prev.filter(n => n.id !== id));
        if (wasUnread) setUnread(prev => { const next = Math.max(0, prev - 1); onUnreadChange(next); return next; });
    };

    const handleClick = (n: Notif) => {
        if (!n.isRead) markOneRead(n.id);
        if (n.link) { onClose(); router.push(n.link); }
    };

    const groups = groupByTime(notifs);

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-[60] transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(2px)" }}
                onClick={onClose}
            />

            {/* Panel */}
            <div
                className={`fixed top-0 right-0 h-full z-[70] flex flex-col transition-transform duration-300 ease-in-out w-full sm:w-[380px]`}
                style={{
                    transform: open ? "translateX(0)" : "translateX(100%)",
                    background: "var(--theme-bg)",
                    borderLeft: "1px solid var(--theme-border)",
                    boxShadow: open ? "-8px 0 32px rgba(0,0,0,0.25)" : "none",
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 shrink-0" style={{ borderBottom: "1px solid var(--theme-border)" }}>
                    <div>
                        <h2 className="text-[17px] font-bold" style={{ color: "var(--theme-text-primary)" }}>Notifications</h2>
                        {unread > 0 && (
                            <p className="text-[11px] mt-0.5" style={{ color: "var(--theme-text-muted)" }}>{unread} new</p>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        {unread > 0 && (
                            <button
                                onClick={markAllRead}
                                disabled={markingAll}
                                className="flex items-center gap-1.5 text-[11px] font-semibold cursor-pointer bg-transparent border-none disabled:opacity-50 transition-opacity"
                                style={{ color: accent }}
                            >
                                {markingAll ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCheck className="w-3.5 h-3.5" />}
                                Mark all read
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer border-none transition-all hover:bg-(--theme-input-bg)"
                            style={{ background: "transparent", color: "var(--theme-text-muted)" }}
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Scrollable list */}
                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-6 h-6 animate-spin" style={{ color: accent }} />
                        </div>
                    ) : notifs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
                            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-3" style={{ background: `${accent}18` }}>
                                <Bell className="w-6 h-6" style={{ color: accent }} />
                            </div>
                            <p className="text-[15px] font-bold mb-1" style={{ color: "var(--theme-text-primary)" }}>No notifications yet</p>
                            <p className="text-[12px]" style={{ color: "var(--theme-text-muted)" }}>Activity will show up here.</p>
                        </div>
                    ) : (
                        groups.map(group => (
                            <div key={group.label}>
                                <p className="px-5 pt-4 pb-1.5 text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--theme-text-muted)" }}>
                                    {group.label}
                                </p>
                                {group.items.map(n => {
                                    const meta = TYPE_META[n.type] ?? TYPE_META["info"];
                                    return (
                                        <div
                                            key={n.id}
                                            className="relative group cursor-pointer"
                                            style={!n.isRead ? { background: `${accent}07` } : {}}
                                            onClick={() => handleClick(n)}
                                        >
                                            {!n.isRead && (
                                                <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r-sm" style={{ background: accent }} />
                                            )}
                                            <div className="flex items-center gap-3.5 px-5 py-3.5 hover:bg-(--theme-bg-secondary) transition-colors">
                                                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: meta.bg, color: meta.color }}>
                                                    {meta.icon}
                                                </div>
                                                <div className="flex-1 min-w-0 pr-5">
                                                    <p className="text-[13px] leading-snug line-clamp-1"
                                                        style={{ color: "var(--theme-text-primary)", fontWeight: n.isRead ? 400 : 600 }}>
                                                        {n.title}
                                                    </p>
                                                    <p className="text-[12px] mt-0.5 leading-snug line-clamp-2" style={{ color: "var(--theme-text-muted)" }}>
                                                        {n.message}
                                                    </p>
                                                    <p className="text-[10px] mt-1 font-medium" style={{ color: !n.isRead ? accent : "var(--theme-text-muted)" }}>
                                                        {timeAgo(n.createdAt)}
                                                    </p>
                                                </div>
                                                {!n.isRead && (
                                                    <div className="w-2 h-2 rounded-full shrink-0" style={{ background: accent }} />
                                                )}
                                            </div>
                                            <button
                                                onClick={e => dismiss(n.id, !n.isRead, e)}
                                                className="absolute right-3.5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 w-6 h-6 rounded-full flex items-center justify-center border-none cursor-pointer transition-all"
                                                style={{ background: "var(--theme-input-bg)", color: "var(--theme-text-muted)" }}
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    );
                                })}
                                <div className="mx-5 my-1" style={{ borderTop: "1px solid var(--theme-border-light)" }} />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}
