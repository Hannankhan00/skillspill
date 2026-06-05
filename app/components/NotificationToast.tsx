"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import {
    Bell, FileText, Sparkles, MessageSquare, Rocket,
    AlertTriangle, UserPlus, MessageCircle, X,
} from "lucide-react";

export interface ToastNotification {
    id: string;
    title: string;
    message: string;
    type: string;
    link?: string | null;
    createdAt: string;
}

interface ToastItemProps {
    toast: ToastNotification;
    onDismiss: (id: string) => void;
    accentColor: string;
}

const TYPE_META: Record<string, { icon: React.ReactNode; color: string }> = {
    application: { icon: <FileText className="w-4 h-4" />,       color: "#3B82F6" },
    match:       { icon: <Sparkles className="w-4 h-4" />,       color: "#3CF91A" },
    message:     { icon: <MessageSquare className="w-4 h-4" />,  color: "#8B5CF6" },
    system:      { icon: <Rocket className="w-4 h-4" />,         color: "#F59E0B" },
    alert:       { icon: <AlertTriangle className="w-4 h-4" />,  color: "#EF4444" },
    follow:      { icon: <UserPlus className="w-4 h-4" />,       color: "#EC4899" },
    comment:     { icon: <MessageCircle className="w-4 h-4" />,  color: "#06B6D4" },
    info:        { icon: <Bell className="w-4 h-4" />,           color: "#9CA3AF" },
};

function ToastItem({ toast, onDismiss, accentColor }: ToastItemProps) {
    const meta = TYPE_META[toast.type] ?? TYPE_META["info"];
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        timerRef.current = setTimeout(() => onDismiss(toast.id), 5000);
        return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }, [toast.id, onDismiss]);

    const inner = (
        <div className="flex items-start gap-3 flex-1 min-w-0">
            <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: `${meta.color}20`, color: meta.color }}
            >
                {meta.icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[12px] font-bold leading-snug truncate" style={{ color: "var(--theme-text-primary)" }}>
                    {toast.title}
                </p>
                <p className="text-[11px] mt-0.5 leading-relaxed line-clamp-2" style={{ color: "var(--theme-text-muted)" }}>
                    {toast.message}
                </p>
            </div>
        </div>
    );

    return (
        <div
            className="toast-slide-in flex items-start gap-2 p-3 pr-2 rounded-2xl shadow-xl w-[320px] max-w-[calc(100vw-2rem)]"
            style={{
                background: "var(--theme-surface)",
                border: `1px solid ${meta.color}30`,
                boxShadow: `0 8px 32px rgba(0,0,0,0.25), 0 0 0 1px ${meta.color}15`,
            }}
        >
            {toast.link ? (
                <Link href={toast.link} className="flex-1 min-w-0 no-underline" onClick={() => onDismiss(toast.id)}>
                    {inner}
                </Link>
            ) : (
                <div className="flex-1 min-w-0">{inner}</div>
            )}

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl overflow-hidden">
                <div
                    className="h-full toast-progress"
                    style={{ background: meta.color }}
                />
            </div>

            <button
                onClick={() => onDismiss(toast.id)}
                className="shrink-0 w-6 h-6 flex items-center justify-center rounded-lg bg-transparent border-none cursor-pointer transition-all hover:bg-white/10 mt-0.5"
                style={{ color: "var(--theme-text-muted)" }}
            >
                <X className="w-3.5 h-3.5" />
            </button>
        </div>
    );
}

interface NotificationToastContainerProps {
    toasts: ToastNotification[];
    onDismiss: (id: string) => void;
    accentColor?: string;
}

export function NotificationToastContainer({
    toasts,
    onDismiss,
    accentColor = "#3CF91A",
}: NotificationToastContainerProps) {
    if (toasts.length === 0) return null;

    return (
        <>
            <style>{`
                @keyframes toastSlideIn {
                    from { transform: translateX(110%); opacity: 0; }
                    to   { transform: translateX(0);    opacity: 1; }
                }
                @keyframes toastProgress {
                    from { width: 100%; }
                    to   { width: 0%;   }
                }
                .toast-slide-in {
                    animation: toastSlideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                    position: relative;
                    overflow: hidden;
                }
                .toast-progress {
                    animation: toastProgress 5s linear forwards;
                }
            `}</style>
            <div
                className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 items-end pointer-events-none"
                aria-live="polite"
            >
                {toasts.map(t => (
                    <div key={t.id} className="pointer-events-auto">
                        <ToastItem toast={t} onDismiss={onDismiss} accentColor={accentColor} />
                    </div>
                ))}
            </div>
        </>
    );
}
