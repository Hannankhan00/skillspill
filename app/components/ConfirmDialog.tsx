"use client";
import React, { useEffect } from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";

interface ConfirmDialogProps {
    isOpen: boolean;
    title?: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: "danger" | "warning";
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmDialog({
    isOpen,
    title = "Are you sure?",
    message,
    confirmLabel = "Delete",
    cancelLabel = "Cancel",
    variant = "danger",
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    // Close on Escape key
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onCancel(); };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [isOpen, onCancel]);

    if (!isOpen) return null;

    const accentColor = variant === "danger" ? "#EF4444" : "#F59E0B";
    const accentBg   = variant === "danger" ? "rgba(239,68,68,0.08)" : "rgba(245,158,11,0.08)";
    const accentBorder = variant === "danger" ? "rgba(239,68,68,0.2)" : "rgba(245,158,11,0.2)";
    const btnBg = variant === "danger"
        ? "linear-gradient(135deg,#EF4444,#DC2626)"
        : "linear-gradient(135deg,#F59E0B,#D97706)";

    return (
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(10px)" }}
            onClick={onCancel}
        >
            <div
                className="w-full max-w-sm rounded-2xl shadow-2xl animate-in zoom-in-95 fade-in duration-200 overflow-hidden"
                style={{
                    background: "var(--theme-card, #111)",
                    border: `1px solid ${accentBorder}`,
                    boxShadow: `0 0 40px ${accentColor}18, 0 25px 50px rgba(0,0,0,0.5)`,
                }}
                onClick={e => e.stopPropagation()}
            >
                {/* Top accent stripe */}
                <div className="h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)` }} />

                <div className="p-6">
                    {/* Icon + Title */}
                    <div className="flex items-center gap-4 mb-4">
                        <div
                            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                            style={{ background: accentBg, border: `1px solid ${accentBorder}` }}
                        >
                            {variant === "danger"
                                ? <Trash2 className="w-5 h-5" style={{ color: accentColor }} />
                                : <AlertTriangle className="w-5 h-5" style={{ color: accentColor }} />
                            }
                        </div>
                        <div>
                            <h3 className="text-[15px] font-bold" style={{ color: "var(--theme-text-primary, #fff)" }}>
                                {title}
                            </h3>
                            <p className="text-[11px] mt-0.5" style={{ color: "var(--theme-text-muted, #888)" }}>
                                This action cannot be undone.
                            </p>
                        </div>
                        <button
                            onClick={onCancel}
                            className="ml-auto p-1.5 rounded-lg border-none bg-transparent cursor-pointer transition-all hover:bg-white/10"
                            style={{ color: "var(--theme-text-muted, #888)" }}
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Message */}
                    <p className="text-[13px] leading-relaxed mb-6 px-1" style={{ color: "var(--theme-text-secondary, #aaa)" }}>
                        {message}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={onCancel}
                            className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold border cursor-pointer transition-all hover:bg-white/5"
                            style={{
                                background: "transparent",
                                borderColor: "var(--theme-border, #333)",
                                color: "var(--theme-text-primary, #fff)",
                            }}
                        >
                            {cancelLabel}
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 py-2.5 rounded-xl text-[13px] font-bold text-white border-none cursor-pointer transition-all hover:scale-[1.02] hover:opacity-90"
                            style={{ background: btnBg, boxShadow: `0 4px 15px ${accentColor}30` }}
                        >
                            {confirmLabel}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
