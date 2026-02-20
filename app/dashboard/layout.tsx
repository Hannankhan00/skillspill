import React from "react";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();
    if (!session) {
        redirect("/login");
    }

    return (
        <div className="h-screen overflow-hidden bg-[#0B0F1A] text-white flex flex-col">
            {/* Top Bar */}
            <header className="shrink-0 h-14 flex items-center justify-between px-6 border-b border-white/[0.06] bg-[#0B0F1A]/80 backdrop-blur-xl z-50">
                <div className="flex items-center gap-2.5">
                    <span className="text-[#A855F7] text-lg font-bold drop-shadow-[0_0_6px_rgba(168,85,247,0.4)]">◆</span>
                    <span className="font-semibold text-[15px] text-white/90 tracking-tight">SkillSpill</span>
                    <span className="text-[10px] text-[#A855F7]/60 font-medium uppercase tracking-widest ml-1 hidden sm:inline">Recruiter</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-[11px] text-white/30 hidden sm:inline" style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>
                        {session.role} · {session.userId.slice(-6)}
                    </span>
                    <form action="/api/auth/logout" method="POST">
                        <button
                            type="submit"
                            className="text-[11px] text-white/30 hover:text-red-400 transition-colors font-medium cursor-pointer bg-transparent border-none"
                        >
                            Sign Out
                        </button>
                    </form>
                </div>
            </header>
            <main className="flex-1 overflow-hidden">{children}</main>
        </div>
    );
}
