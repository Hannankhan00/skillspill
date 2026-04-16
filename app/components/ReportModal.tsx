"use client";

import React, { useState } from "react";

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    targetId: string;
    targetType: "POST" | "USER";
}

const PRESET_REASONS = [
    "Spam or misleading",
    "Inappropriate content or hate speech",
    "Harassment or bullying",
    "I just don't like it",
    "Other"
];

export default function ReportModal({ isOpen, onClose, targetId, targetType }: ReportModalProps) {
    const [selectedReason, setSelectedReason] = useState<string>("");
    const [customReason, setCustomReason] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        let finalReason = selectedReason;
        if (selectedReason === "Other" && customReason.trim()) {
            finalReason = customReason.trim();
        } else if (selectedReason !== "Other" && customReason.trim()) {
            finalReason = `${selectedReason} - ${customReason.trim()}`;
        }

        if (!finalReason) {
            alert("Please select or provide a reason for reporting.");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await fetch("/api/report", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    targetType,
                    targetId,
                    reason: finalReason,
                }),
            });
            if (res.ok) {
                alert(`Successfully reported the ${targetType.toLowerCase()}.`);
                onClose();
            } else {
                const data = await res.json();
                alert(data.error || "Failed to submit report.");
            }
        } catch {
            alert("Network error, please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-150 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl overflow-hidden bg-(--theme-card) border border-(--theme-border) shadow-xl animate-fade-in-up">
                
                <div className="flex items-center justify-between px-5 py-4 border-b border-(--theme-border)">
                    <h2 className="text-[16px] font-bold text-(--theme-text-primary)">
                        Report {targetType === "POST" ? "Post" : "Account"}
                    </h2>
                    <button 
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg flex items-center justify-center bg-transparent border-none text-(--theme-text-secondary) hover:bg-(--theme-input-bg) cursor-pointer transition-colors"
                    >
                        ✕
                    </button>
                </div>

                <div className="p-5 flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
                    <p className="text-[13px] text-(--theme-text-secondary)">
                        Please help us understand why you are reporting this {targetType.toLowerCase()}. Your report will be kept anonymous.
                    </p>

                    <div className="flex flex-col gap-2">
                        {PRESET_REASONS.map((reason) => (
                            <label key={reason} className="flex items-center gap-3 p-3 rounded-xl border border-(--theme-border) cursor-pointer transition-colors hover:bg-(--theme-input-bg)">
                                <input 
                                    type="radio" 
                                    name="reportReason" 
                                    className="accent-red-500 w-4 h-4 cursor-pointer"
                                    checked={selectedReason === reason}
                                    onChange={() => setSelectedReason(reason)}
                                />
                                <span className="text-[14px] text-(--theme-text-primary) font-medium">{reason}</span>
                            </label>
                        ))}
                    </div>

                    {(selectedReason === "Other" || selectedReason) && (
                        <div className="mt-2 animate-fade-in">
                            <label className="block text-[12px] font-bold mb-2 text-(--theme-text-secondary)">
                                {selectedReason === "Other" ? "Please specify your reason" : "Additional comments (optional)"}
                            </label>
                            <textarea 
                                value={customReason}
                                onChange={(e) => setCustomReason(e.target.value)}
                                placeholder="Write more details here..."
                                rows={3}
                                className="w-full p-3 rounded-xl bg-(--theme-input-bg) text-[14px] text-(--theme-text-primary) border border-(--theme-border) resize-none"
                            />
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-(--theme-border) flex gap-3">
                    <button 
                        onClick={onClose}
                        className="flex-1 py-2.5 rounded-xl font-bold text-[13px] bg-transparent border border-(--theme-border) text-(--theme-text-primary) cursor-pointer hover:bg-(--theme-input-bg) transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSubmit}
                        disabled={!selectedReason || isSubmitting || (selectedReason === "Other" && !customReason.trim())}
                        className="flex-1 py-2.5 rounded-xl font-bold text-[13px] border-none text-white cursor-pointer transition-all disabled:opacity-50"
                        style={{ background: "linear-gradient(135deg, #EF4444, #DC2626)", boxShadow: "0 0 15px rgba(239, 68, 68, 0.3)" }}
                    >
                        {isSubmitting ? "Submitting..." : "Submit Report"}
                    </button>
                </div>
            </div>
        </div>
    );
}
