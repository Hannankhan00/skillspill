import React from "react";

export default function TalentDashboard() {
    return (
        <div className="flex flex-col gap-6 font-mono">
            <h1 className="text-2xl text-[#3CF91A] font-bold uppercase tracking-widest">[TALENT_GRID_ACCESS_GRANTED]</h1>
            <p className="text-gray-400">Welcome to the SkillSpill network. Your profile is active and visible to recruiters.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="border border-[#3CF91A]/20 p-6 rounded bg-[#3CF91A]/[0.02] shadow-[0_0_15px_rgba(60,249,26,0.1)]">
                    <h3 className="text-[#3CF91A] font-bold mb-2 uppercase tracking-wide">Pending Bounties</h3>
                    <span className="text-4xl font-bold text-white">0</span>
                </div>
                <div className="border border-white/10 p-6 rounded bg-white/[0.02]">
                    <h3 className="text-[#A855F7] font-bold mb-2 uppercase tracking-wide">Profile Views</h3>
                    <span className="text-4xl font-bold text-white">0</span>
                </div>
            </div>

            <div className="mt-8 border-t border-white/10 pt-4">
                <p className="text-xs text-gray-500">System Status: ONLINE</p>
            </div>
        </div>
    );
}
