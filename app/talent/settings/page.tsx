"use client";

import React, { useState } from "react";

/* ── Icons ── */
function UserIcon() {
    return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
}
function ShieldIcon() {
    return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
}
function BellIcon() {
    return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>;
}
function PaletteIcon() {
    return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r="0.5" fill="currentColor" /><circle cx="17.5" cy="10.5" r="0.5" fill="currentColor" /><circle cx="8.5" cy="7.5" r="0.5" fill="currentColor" /><circle cx="6.5" cy="12.5" r="0.5" fill="currentColor" /><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" /></svg>;
}
function LinkIcon() {
    return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>;
}
function TrashIcon() {
    return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>;
}

const settingsTabs = [
    { key: "profile", label: "Profile", icon: <UserIcon /> },
    { key: "security", label: "Security", icon: <ShieldIcon /> },
    { key: "notifications", label: "Notifications", icon: <BellIcon /> },
    { key: "appearance", label: "Appearance", icon: <PaletteIcon /> },
    { key: "connections", label: "Connections", icon: <LinkIcon /> },
];

/* ── Toggle Switch ── */
function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
    return (
        <button
            onClick={onToggle}
            className={`relative w-10 h-5 rounded-full transition-all duration-300 cursor-pointer border-none ${enabled ? "bg-[#3CF91A]" : "bg-white/10"
                }`}
            style={enabled ? { boxShadow: "0 0 12px #3CF91A40" } : {}}
        >
            <span
                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-300 ${enabled ? "left-[22px]" : "left-0.5"
                    }`}
                style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }}
            />
        </button>
    );
}

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("profile");

    /* Profile states */
    const [displayName, setDisplayName] = useState("Ghost_Protocol");
    const [email, setEmail] = useState("ghost@skillspill.dev");
    const [bio, setBio] = useState("Systems architect. Rust enthusiast. Building the future of developer tooling.");
    const [portfolioUrl, setPortfolioUrl] = useState("https://ghostprotocol.dev");

    /* Security */
    const [twoFA, setTwoFA] = useState(false);
    const [sessionAlerts, setSessionAlerts] = useState(true);

    /* Notifications */
    const [notifBounty, setNotifBounty] = useState(true);
    const [notifSpill, setNotifSpill] = useState(true);
    const [notifJob, setNotifJob] = useState(false);
    const [notifEmail, setNotifEmail] = useState(true);
    const [notifPush, setNotifPush] = useState(false);

    /* Appearance */
    const [theme, setTheme] = useState<"dark" | "light" | "system">("dark");
    const [accentColor, setAccentColor] = useState("#3CF91A");
    const [codeFont, setCodeFont] = useState("JetBrains Mono");
    const [compactMode, setCompactMode] = useState(false);

    /* Connections */
    const [githubConnected, setGithubConnected] = useState(true);
    const [linkedinConnected, setLinkedinConnected] = useState(false);

    const accentOptions = ["#3CF91A", "#00D2FF", "#A855F7", "#FF9F43", "#FF003C", "#FFD700"];

    return (
        <div className="min-h-full bg-[#050505]">
            {/* Header */}
            <div className="border-b border-white/[0.06] bg-[#0A0A0A]/60 backdrop-blur-sm">
                <div className="max-w-[1400px] mx-auto px-6 py-5">
                    <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                        Settings
                    </h1>
                    <p className="text-[12px] text-white/40 mt-1" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>
                        Configure your SkillSpill experience. <span className="text-[#3CF91A]">Make it yours.</span>
                    </p>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-6 py-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar Tabs */}
                    <div className="w-full lg:w-[220px] shrink-0">
                        <nav className="flex lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0">
                            {settingsTabs.map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-[12px] font-medium transition-all duration-200 border-none cursor-pointer whitespace-nowrap ${activeTab === tab.key
                                            ? "bg-[#3CF91A] text-black"
                                            : "bg-transparent text-white/40 hover:text-white/60 hover:bg-white/[0.04]"
                                        }`}
                                    style={
                                        activeTab === tab.key
                                            ? { boxShadow: "0 0 20px #3CF91A40" }
                                            : {}
                                    }
                                >
                                    {tab.icon}
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 min-w-0">
                        <div className="rounded-xl border border-white/[0.06] bg-[#0A0A0A] overflow-hidden">
                            {/* ── Profile Settings ── */}
                            {activeTab === "profile" && (
                                <div className="p-6 space-y-6">
                                    <div>
                                        <h2 className="text-base font-bold text-white mb-1">Profile Information</h2>
                                        <p className="text-[11px] text-white/30">Manage how you appear on SkillSpill</p>
                                    </div>

                                    {/* Avatar */}
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold"
                                            style={{
                                                background: "linear-gradient(135deg, #3CF91A30, #3CF91A10)",
                                                border: "2px solid #3CF91A40",
                                                color: "#3CF91A",
                                            }}
                                        >
                                            GP
                                        </div>
                                        <div>
                                            <button className="text-[11px] px-3 py-1.5 rounded-lg font-semibold bg-white/[0.06] text-white/60 hover:text-white hover:bg-white/[0.1] transition-colors border border-white/[0.08] cursor-pointer">
                                                Change Avatar
                                            </button>
                                            <p className="text-[10px] text-white/20 mt-1">PNG, JPG. Max 2MB.</p>
                                        </div>
                                    </div>

                                    {/* Fields */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] uppercase tracking-widest text-white/30 font-semibold block mb-1.5">Display Name</label>
                                            <input
                                                type="text"
                                                value={displayName}
                                                onChange={(e) => setDisplayName(e.target.value)}
                                                className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-[13px] text-white focus:border-[#3CF91A]/40 focus:outline-none transition-colors"
                                                style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase tracking-widest text-white/30 font-semibold block mb-1.5">Email</label>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-[13px] text-white focus:border-[#3CF91A]/40 focus:outline-none transition-colors"
                                                style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase tracking-widest text-white/30 font-semibold block mb-1.5">Bio</label>
                                        <textarea
                                            value={bio}
                                            onChange={(e) => setBio(e.target.value)}
                                            rows={3}
                                            className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-[13px] text-white focus:border-[#3CF91A]/40 focus:outline-none transition-colors resize-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase tracking-widest text-white/30 font-semibold block mb-1.5">Portfolio URL</label>
                                        <input
                                            type="url"
                                            value={portfolioUrl}
                                            onChange={(e) => setPortfolioUrl(e.target.value)}
                                            className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-[13px] text-white focus:border-[#3CF91A]/40 focus:outline-none transition-colors"
                                            style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                                        />
                                    </div>

                                    <div className="flex items-center gap-3 pt-2">
                                        <button
                                            className="px-5 py-2.5 rounded-lg text-[12px] font-bold text-black border-none cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                                            style={{ background: "#3CF91A", boxShadow: "0 0 15px #3CF91A40" }}
                                        >
                                            Save Changes
                                        </button>
                                        <button className="px-5 py-2.5 rounded-lg text-[12px] font-medium text-white/40 bg-transparent border border-white/[0.08] hover:text-white/60 hover:border-white/[0.15] transition-colors cursor-pointer">
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* ── Security Settings ── */}
                            {activeTab === "security" && (
                                <div className="p-6 space-y-6">
                                    <div>
                                        <h2 className="text-base font-bold text-white mb-1">Security & Privacy</h2>
                                        <p className="text-[11px] text-white/30">Protect your SkillSpill account</p>
                                    </div>

                                    {/* Password */}
                                    <div className="rounded-lg border border-white/[0.06] p-4 space-y-3">
                                        <h3 className="text-[13px] font-semibold text-white/80">Change Password</h3>
                                        <input type="password" placeholder="Current password" className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-[13px] text-white focus:border-[#3CF91A]/40 focus:outline-none transition-colors placeholder-white/20" />
                                        <input type="password" placeholder="New password" className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-[13px] text-white focus:border-[#3CF91A]/40 focus:outline-none transition-colors placeholder-white/20" />
                                        <input type="password" placeholder="Confirm new password" className="w-full px-3.5 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-[13px] text-white focus:border-[#3CF91A]/40 focus:outline-none transition-colors placeholder-white/20" />
                                        <button className="px-4 py-2 rounded-lg text-[11px] font-bold text-black bg-[#3CF91A] border-none cursor-pointer hover:scale-[1.02] transition-all">
                                            Update Password
                                        </button>
                                    </div>

                                    {/* Toggles */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between py-3 border-b border-white/[0.04]">
                                            <div>
                                                <p className="text-[13px] font-semibold text-white/80">Two-Factor Authentication</p>
                                                <p className="text-[10px] text-white/30 mt-0.5">Add an extra layer of security</p>
                                            </div>
                                            <Toggle enabled={twoFA} onToggle={() => setTwoFA(!twoFA)} />
                                        </div>
                                        <div className="flex items-center justify-between py-3 border-b border-white/[0.04]">
                                            <div>
                                                <p className="text-[13px] font-semibold text-white/80">Session Alerts</p>
                                                <p className="text-[10px] text-white/30 mt-0.5">Get notified of new login sessions</p>
                                            </div>
                                            <Toggle enabled={sessionAlerts} onToggle={() => setSessionAlerts(!sessionAlerts)} />
                                        </div>
                                    </div>

                                    {/* Danger Zone */}
                                    <div className="rounded-lg border border-[#FF003C]/20 p-4 bg-[#FF003C]/[0.03]">
                                        <h3 className="text-[13px] font-semibold text-[#FF003C] mb-1">Danger Zone</h3>
                                        <p className="text-[10px] text-white/30 mb-3">Once deleted, your account cannot be recovered.</p>
                                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-[11px] font-bold text-[#FF003C] bg-[#FF003C]/10 border border-[#FF003C]/20 cursor-pointer hover:bg-[#FF003C]/20 transition-colors">
                                            <TrashIcon />
                                            Delete Account
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* ── Notification Settings ── */}
                            {activeTab === "notifications" && (
                                <div className="p-6 space-y-6">
                                    <div>
                                        <h2 className="text-base font-bold text-white mb-1">Notifications</h2>
                                        <p className="text-[11px] text-white/30">Choose what alerts you want to receive</p>
                                    </div>

                                    <div>
                                        <h3 className="text-[11px] uppercase tracking-widest text-white/30 font-semibold mb-3">Activity</h3>
                                        <div className="space-y-1">
                                            {[
                                                { label: "Bounty Updates", desc: "When bounties you applied to change status", state: notifBounty, toggle: () => setNotifBounty(!notifBounty) },
                                                { label: "Spill Interactions", desc: "Likes, comments, and shares on your spills", state: notifSpill, toggle: () => setNotifSpill(!notifSpill) },
                                                { label: "Job Recommendations", desc: "New jobs matching your skill profile", state: notifJob, toggle: () => setNotifJob(!notifJob) },
                                            ].map((item) => (
                                                <div key={item.label} className="flex items-center justify-between py-3 border-b border-white/[0.04]">
                                                    <div>
                                                        <p className="text-[13px] font-semibold text-white/80">{item.label}</p>
                                                        <p className="text-[10px] text-white/30 mt-0.5">{item.desc}</p>
                                                    </div>
                                                    <Toggle enabled={item.state} onToggle={item.toggle} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-[11px] uppercase tracking-widest text-white/30 font-semibold mb-3">Delivery</h3>
                                        <div className="space-y-1">
                                            {[
                                                { label: "Email Notifications", desc: "Receive notifications via email", state: notifEmail, toggle: () => setNotifEmail(!notifEmail) },
                                                { label: "Push Notifications", desc: "Browser push notifications", state: notifPush, toggle: () => setNotifPush(!notifPush) },
                                            ].map((item) => (
                                                <div key={item.label} className="flex items-center justify-between py-3 border-b border-white/[0.04]">
                                                    <div>
                                                        <p className="text-[13px] font-semibold text-white/80">{item.label}</p>
                                                        <p className="text-[10px] text-white/30 mt-0.5">{item.desc}</p>
                                                    </div>
                                                    <Toggle enabled={item.state} onToggle={item.toggle} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ── Appearance Settings ── */}
                            {activeTab === "appearance" && (
                                <div className="p-6 space-y-6">
                                    <div>
                                        <h2 className="text-base font-bold text-white mb-1">Appearance</h2>
                                        <p className="text-[11px] text-white/30">Customize the look and feel</p>
                                    </div>

                                    {/* Theme */}
                                    <div>
                                        <label className="text-[10px] uppercase tracking-widest text-white/30 font-semibold block mb-2">Theme</label>
                                        <div className="flex gap-2">
                                            {(["dark", "light", "system"] as const).map((t) => (
                                                <button
                                                    key={t}
                                                    onClick={() => setTheme(t)}
                                                    className={`px-4 py-2.5 rounded-lg text-[11px] font-semibold capitalize transition-all duration-200 border cursor-pointer ${theme === t
                                                            ? "bg-[#3CF91A] text-black border-[#3CF91A]"
                                                            : "bg-transparent text-white/40 border-white/[0.08] hover:text-white/60"
                                                        }`}
                                                    style={theme === t ? { boxShadow: "0 0 15px #3CF91A30" } : {}}
                                                >
                                                    {t}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Accent Color */}
                                    <div>
                                        <label className="text-[10px] uppercase tracking-widest text-white/30 font-semibold block mb-2">Accent Color</label>
                                        <div className="flex gap-2.5">
                                            {accentOptions.map((color) => (
                                                <button
                                                    key={color}
                                                    onClick={() => setAccentColor(color)}
                                                    className="w-8 h-8 rounded-full transition-all duration-200 cursor-pointer border-2"
                                                    style={{
                                                        background: color,
                                                        borderColor: accentColor === color ? "white" : "transparent",
                                                        boxShadow: accentColor === color ? `0 0 12px ${color}60` : "none",
                                                        transform: accentColor === color ? "scale(1.15)" : "scale(1)",
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Code Font */}
                                    <div>
                                        <label className="text-[10px] uppercase tracking-widest text-white/30 font-semibold block mb-2">Code Font</label>
                                        <div className="flex gap-2 flex-wrap">
                                            {["JetBrains Mono", "Fira Code", "Source Code Pro", "Cascadia Code"].map((font) => (
                                                <button
                                                    key={font}
                                                    onClick={() => setCodeFont(font)}
                                                    className={`px-3.5 py-2 rounded-lg text-[11px] transition-all duration-200 border cursor-pointer ${codeFont === font
                                                            ? "bg-white/10 text-white border-white/20"
                                                            : "bg-transparent text-white/30 border-white/[0.06] hover:text-white/50"
                                                        }`}
                                                    style={{ fontFamily: `"${font}", monospace` }}
                                                >
                                                    {font}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Compact Mode */}
                                    <div className="flex items-center justify-between py-3 border-t border-white/[0.04]">
                                        <div>
                                            <p className="text-[13px] font-semibold text-white/80">Compact Mode</p>
                                            <p className="text-[10px] text-white/30 mt-0.5">Reduce spacing for a denser layout</p>
                                        </div>
                                        <Toggle enabled={compactMode} onToggle={() => setCompactMode(!compactMode)} />
                                    </div>
                                </div>
                            )}

                            {/* ── Connections Settings ── */}
                            {activeTab === "connections" && (
                                <div className="p-6 space-y-6">
                                    <div>
                                        <h2 className="text-base font-bold text-white mb-1">Connections</h2>
                                        <p className="text-[11px] text-white/30">Link external accounts to SkillSpill</p>
                                    </div>

                                    <div className="space-y-3">
                                        {/* GitHub */}
                                        <div className="flex items-center justify-between p-4 rounded-lg border border-white/[0.06] bg-white/[0.02]">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-white/[0.06] flex items-center justify-center">
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" /></svg>
                                                </div>
                                                <div>
                                                    <p className="text-[13px] font-semibold text-white/80">GitHub</p>
                                                    <p className="text-[10px] text-white/30">
                                                        {githubConnected ? "Connected as ghost-protocol" : "Not connected"}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setGithubConnected(!githubConnected)}
                                                className={`px-3.5 py-1.5 rounded-lg text-[11px] font-bold border cursor-pointer transition-all ${githubConnected
                                                        ? "bg-[#FF003C]/10 text-[#FF003C] border-[#FF003C]/20 hover:bg-[#FF003C]/20"
                                                        : "bg-[#3CF91A] text-black border-[#3CF91A] hover:scale-[1.02]"
                                                    }`}
                                                style={!githubConnected ? { boxShadow: "0 0 12px #3CF91A30" } : {}}
                                            >
                                                {githubConnected ? "Disconnect" : "Connect"}
                                            </button>
                                        </div>

                                        {/* LinkedIn */}
                                        <div className="flex items-center justify-between p-4 rounded-lg border border-white/[0.06] bg-white/[0.02]">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-[#0A66C2]/10 flex items-center justify-center">
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#0A66C2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                                                </div>
                                                <div>
                                                    <p className="text-[13px] font-semibold text-white/80">LinkedIn</p>
                                                    <p className="text-[10px] text-white/30">
                                                        {linkedinConnected ? "Connected" : "Not connected"}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setLinkedinConnected(!linkedinConnected)}
                                                className={`px-3.5 py-1.5 rounded-lg text-[11px] font-bold border cursor-pointer transition-all ${linkedinConnected
                                                        ? "bg-[#FF003C]/10 text-[#FF003C] border-[#FF003C]/20 hover:bg-[#FF003C]/20"
                                                        : "bg-[#3CF91A] text-black border-[#3CF91A] hover:scale-[1.02]"
                                                    }`}
                                                style={!linkedinConnected ? { boxShadow: "0 0 12px #3CF91A30" } : {}}
                                            >
                                                {linkedinConnected ? "Disconnect" : "Connect"}
                                            </button>
                                        </div>

                                        {/* Discord */}
                                        <div className="flex items-center justify-between p-4 rounded-lg border border-white/[0.06] bg-white/[0.02]">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-[#5865F2]/10 flex items-center justify-center">
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#5865F2"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" /></svg>
                                                </div>
                                                <div>
                                                    <p className="text-[13px] font-semibold text-white/80">Discord</p>
                                                    <p className="text-[10px] text-white/30">Not connected</p>
                                                </div>
                                            </div>
                                            <button className="px-3.5 py-1.5 rounded-lg text-[11px] font-bold bg-[#3CF91A] text-black border border-[#3CF91A] cursor-pointer hover:scale-[1.02] transition-all" style={{ boxShadow: "0 0 12px #3CF91A30" }}>
                                                Connect
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
