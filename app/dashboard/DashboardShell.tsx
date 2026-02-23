"use client";

import React from "react";

export default function DashboardShell({
    role,
    userId,
    children,
}: {
    role: string;
    userId: string;
    children: React.ReactNode;
}) {
    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
        } catch {
            // ignore fetch errors
        }
        window.location.href = "/login";
    };

    return (
        <div className="h-screen overflow-hidden bg-[#0B0F1A] text-white flex flex-col">
            {/* Top Bar */}
            <header className="shrink-0 h-14 flex items-center justify-between px-6 border-b border-white/[0.06] bg-[#0B0F1A]/80 backdrop-blur-xl z-50">
                <div className="flex items-center gap-2.5">
                    <img src="/assets/logo 2.png" alt="SkillSpill" className="h-10" />
                    <span className="text-[10px] text-[#A855F7]/60 font-medium uppercase tracking-widest ml-1 hidden sm:inline">Recruiter</span>
                </div>
                <div className="flex items-center gap-3">
                    <span
                        className="text-[11px] text-white/30 hidden sm:inline"
                        style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
                    >
                        {role} · {userId.slice(-6)}
                    </span>
                    <button
                        onClick={handleLogout}
                        className="text-[11px] text-white/30 hover:text-red-400 transition-colors font-medium cursor-pointer bg-transparent border-none"
                    >
                        Sign Out
                    </button>
                </div>
            </header>
            <main className="flex-1 overflow-hidden">{children}</main>
        </div>
    );
}
