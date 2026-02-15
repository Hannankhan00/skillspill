import React from "react";

export default function RecruiterDashboard() {
    return (
        <div className="flex flex-col gap-6 font-mono">
            <h1 className="text-2xl text-[#A855F7] font-bold uppercase tracking-widest">[RECRUITER_TERMINAL_ONLINE]</h1>
            <p className="text-gray-400">Manage your bounties and applications.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="border border-[#A855F7]/20 p-6 rounded bg-[#A855F7]/[0.02] shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                    <h3 className="text-[#A855F7] font-bold mb-2 uppercase tracking-wide">Active Bounties</h3>
                    <span className="text-4xl font-bold text-white">0</span>
                </div>
                <div className="border border-white/10 p-6 rounded bg-white/[0.02]">
                    <h3 className="text-[#3CF91A] font-bold mb-2 uppercase tracking-wide">Candidate Applications</h3>
                    <span className="text-4xl font-bold text-white">0</span>
                </div>
            </div>

            <div className="mt-8 border-t border-white/10 pt-4">
                <button className="bg-[#A855F7] text-white px-6 py-2 rounded font-bold uppercase tracking-widest text-sm hover:bg-[#9333ea] transition-all">Create New Bounty</button>
            </div>
        </div>
    );
}
