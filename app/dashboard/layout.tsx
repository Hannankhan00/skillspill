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
        <div className="min-h-screen bg-[#060608] text-white font-mono">
            <nav className="border-b border-white/10 p-4 flex justify-between items-center">
                <span className="font-bold text-[#A855F7] tracking-wider">SKILLSPILL // TERMINAL</span>
                <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-500 uppercase">{session.role} :: {session.userId.slice(-6)}</span>
                    <form action="/api/auth/logout" method="POST">
                        <button type="submit" className="text-xs text-red-500 hover:text-red-400 uppercase font-bold tracking-wide">Disconnect</button>
                    </form>
                </div>
            </nav>
            <main className="p-6">{children}</main>
        </div>
    );
}
