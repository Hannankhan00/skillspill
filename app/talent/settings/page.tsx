"use client";

import React, { useState } from "react";
import { useTheme, ThemeToggle } from "../../components/ThemeProvider";

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
function CheckIcon() {
    return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>;
}

const settingsTabs = [
    { key: "profile", label: "Profile", icon: <UserIcon />, desc: "Your identity" },
    { key: "security", label: "Security", icon: <ShieldIcon />, desc: "Account safety" },
    { key: "notifications", label: "Notifications", icon: <BellIcon />, desc: "Alert preferences" },
    { key: "appearance", label: "Appearance", icon: <PaletteIcon />, desc: "Look & feel" },
    { key: "connections", label: "Connections", icon: <LinkIcon />, desc: "Linked accounts" },
];

/* ── Toggle Switch ── */
function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
    return (
        <button
            onClick={onToggle}
            className="relative w-11 h-6 rounded-full transition-all duration-300 cursor-pointer border-none shrink-0"
            style={{
                background: enabled ? '#10B981' : 'var(--theme-input-bg)',
                boxShadow: enabled ? '0 0 12px rgba(16, 185, 129, 0.3)' : 'none',
                border: enabled ? 'none' : '1px solid var(--theme-border)',
            }}
        >
            <span
                className="absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white transition-all duration-300"
                style={{
                    left: enabled ? '23px' : '3px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                }}
            />
        </button>
    );
}

/* ── Section Wrapper ── */
function Section({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
    return (
        <div className="space-y-5">
            <div className="pb-4" style={{ borderBottom: '1px solid var(--theme-border)' }}>
                <h2 className="text-lg font-bold" style={{ color: 'var(--theme-text-primary)' }}>{title}</h2>
                <p className="text-[12px] mt-0.5" style={{ color: 'var(--theme-text-muted)' }}>{desc}</p>
            </div>
            {children}
        </div>
    );
}

/* ── Input Field ── */
function InputField({ label, value, onChange, type = "text", mono = false, placeholder }: {
    label: string; value: string; onChange: (v: string) => void; type?: string; mono?: boolean; placeholder?: string;
}) {
    return (
        <div>
            <label className="text-[10px] uppercase tracking-widest font-semibold block mb-1.5" style={{ color: 'var(--theme-text-muted)' }}>
                {label}
            </label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full px-3.5 py-2.5 rounded-xl text-[13px] outline-none transition-all focus:ring-2 focus:ring-emerald-200"
                style={{
                    background: 'var(--theme-input-bg)',
                    border: '1px solid var(--theme-border)',
                    color: 'var(--theme-text-primary)',
                    fontFamily: mono ? 'var(--font-jetbrains-mono)' : 'inherit',
                }}
            />
        </div>
    );
}

/* ── Toggle Row ── */
function ToggleRow({ label, desc, enabled, onToggle }: { label: string; desc: string; enabled: boolean; onToggle: () => void }) {
    return (
        <div className="flex items-center justify-between py-3.5" style={{ borderBottom: '1px solid var(--theme-border-light)' }}>
            <div>
                <p className="text-[13px] font-semibold" style={{ color: 'var(--theme-text-primary)' }}>{label}</p>
                <p className="text-[11px] mt-0.5" style={{ color: 'var(--theme-text-muted)' }}>{desc}</p>
            </div>
            <Toggle enabled={enabled} onToggle={onToggle} />
        </div>
    );
}

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("profile");
    const { theme, toggleTheme } = useTheme();

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
    const [accentColor, setAccentColor] = useState("#10B981");
    const [codeFont, setCodeFont] = useState("JetBrains Mono");
    const [compactMode, setCompactMode] = useState(false);

    /* Connections */
    const [githubConnected, setGithubConnected] = useState(true);
    const [linkedinConnected, setLinkedinConnected] = useState(false);

    const accentOptions = [
        { color: "#10B981", label: "Emerald" },
        { color: "#3B82F6", label: "Blue" },
        { color: "#8B5CF6", label: "Purple" },
        { color: "#F59E0B", label: "Amber" },
        { color: "#EF4444", label: "Red" },
        { color: "#EC4899", label: "Pink" },
    ];

    return (
        <div className="min-h-full" style={{ background: 'var(--theme-bg)' }}>
            <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-5">

                {/* ── Header ── */}
                <div className="mb-6">
                    <h1 className="text-2xl lg:text-3xl font-bold tracking-tight" style={{ color: 'var(--theme-text-primary)', fontFamily: 'var(--font-space-grotesk)' }}>
                        ⚙️ Settings
                    </h1>
                    <p className="text-[13px] mt-1" style={{ color: 'var(--theme-text-muted)' }}>
                        Configure your SkillSpill experience. <span className="text-emerald-500 font-semibold">Make it yours.</span>
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* ── Sidebar Tabs ── */}
                    <div className="w-full lg:w-[220px] shrink-0">
                        <div className="rounded-2xl border p-2 lg:sticky lg:top-6" style={{ background: 'var(--theme-card)', borderColor: 'var(--theme-border)' }}>
                            <nav className="flex lg:flex-col gap-1 overflow-x-auto pb-1 lg:pb-0">
                                {settingsTabs.map((tab) => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key)}
                                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[12px] font-medium transition-all duration-200 border-none cursor-pointer whitespace-nowrap text-left w-full"
                                        style={
                                            activeTab === tab.key
                                                ? {
                                                    background: '#10B981',
                                                    color: '#fff',
                                                    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
                                                }
                                                : {
                                                    background: 'transparent',
                                                    color: 'var(--theme-text-muted)',
                                                }
                                        }
                                    >
                                        <span className="shrink-0">{tab.icon}</span>
                                        <div className="hidden lg:block">
                                            <span className="block">{tab.label}</span>
                                            <span className="text-[9px] opacity-60">{tab.desc}</span>
                                        </div>
                                        <span className="lg:hidden">{tab.label}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* ── Content Area ── */}
                    <div className="flex-1 min-w-0">
                        <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--theme-card)', borderColor: 'var(--theme-border)' }}>

                            {/* ═══ Profile ═══ */}
                            {activeTab === "profile" && (
                                <div className="p-6 space-y-6">
                                    <Section title="Profile Information" desc="Manage how you appear on SkillSpill">
                                        {/* Avatar */}
                                        <div className="flex items-center gap-4">
                                            <div
                                                className="w-16 h-16 rounded-2xl flex items-center justify-center text-lg font-bold text-white"
                                                style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}
                                            >
                                                GP
                                            </div>
                                            <div>
                                                <button
                                                    className="text-[12px] px-4 py-2 rounded-xl font-semibold transition-all cursor-pointer border-none hover:shadow-md"
                                                    style={{ background: 'var(--theme-input-bg)', color: 'var(--theme-text-secondary)', border: '1px solid var(--theme-border)' }}
                                                >
                                                    Change Avatar
                                                </button>
                                                <p className="text-[10px] mt-1.5" style={{ color: 'var(--theme-text-muted)' }}>PNG, JPG or GIF. Max 2MB.</p>
                                            </div>
                                        </div>

                                        {/* Fields */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <InputField label="Display Name" value={displayName} onChange={setDisplayName} mono />
                                            <InputField label="Email" value={email} onChange={setEmail} type="email" mono />
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase tracking-widest font-semibold block mb-1.5" style={{ color: 'var(--theme-text-muted)' }}>Bio</label>
                                            <textarea
                                                value={bio}
                                                onChange={(e) => setBio(e.target.value)}
                                                rows={3}
                                                className="w-full px-3.5 py-2.5 rounded-xl text-[13px] outline-none transition-all resize-none focus:ring-2 focus:ring-emerald-200"
                                                style={{ background: 'var(--theme-input-bg)', border: '1px solid var(--theme-border)', color: 'var(--theme-text-primary)' }}
                                            />
                                        </div>
                                        <InputField label="Portfolio URL" value={portfolioUrl} onChange={setPortfolioUrl} type="url" mono />
                                    </Section>

                                    <div className="flex items-center gap-3 pt-2">
                                        <button
                                            className="px-5 py-2.5 rounded-xl text-[12px] font-bold text-white border-none cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
                                            style={{ background: '#10B981', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)' }}
                                        >
                                            Save Changes
                                        </button>
                                        <button
                                            className="px-5 py-2.5 rounded-xl text-[12px] font-medium bg-transparent cursor-pointer transition-all"
                                            style={{ color: 'var(--theme-text-muted)', border: '1px solid var(--theme-border)' }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* ═══ Security ═══ */}
                            {activeTab === "security" && (
                                <div className="p-6 space-y-6">
                                    <Section title="Security & Privacy" desc="Protect your SkillSpill account">
                                        {/* Password */}
                                        <div className="rounded-xl p-4 space-y-3" style={{ background: 'var(--theme-bg)', border: '1px solid var(--theme-border)' }}>
                                            <h3 className="text-[13px] font-semibold" style={{ color: 'var(--theme-text-primary)' }}>Change Password</h3>
                                            <InputField label="" value="" onChange={() => { }} type="password" placeholder="Current password" />
                                            <InputField label="" value="" onChange={() => { }} type="password" placeholder="New password" />
                                            <InputField label="" value="" onChange={() => { }} type="password" placeholder="Confirm new password" />
                                            <button
                                                className="px-4 py-2 rounded-xl text-[11px] font-bold text-white border-none cursor-pointer hover:shadow-md transition-all"
                                                style={{ background: '#10B981' }}
                                            >
                                                Update Password
                                            </button>
                                        </div>

                                        <ToggleRow label="Two-Factor Authentication" desc="Add an extra layer of security to your account" enabled={twoFA} onToggle={() => setTwoFA(!twoFA)} />
                                        <ToggleRow label="Session Alerts" desc="Get notified when someone logs in from a new device" enabled={sessionAlerts} onToggle={() => setSessionAlerts(!sessionAlerts)} />
                                    </Section>

                                    {/* Danger Zone */}
                                    <div className="rounded-xl p-4" style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.15)' }}>
                                        <h3 className="text-[13px] font-semibold text-red-500 mb-1">⚠️ Danger Zone</h3>
                                        <p className="text-[11px] mb-3" style={{ color: 'var(--theme-text-muted)' }}>Once deleted, your account cannot be recovered.</p>
                                        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-bold text-red-500 cursor-pointer transition-all hover:shadow-md border-none" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
                                            <TrashIcon />
                                            Delete Account
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* ═══ Notifications ═══ */}
                            {activeTab === "notifications" && (
                                <div className="p-6 space-y-6">
                                    <Section title="Notifications" desc="Choose what alerts you want to receive">
                                        <div>
                                            <h3 className="text-[11px] uppercase tracking-widest font-semibold mb-2" style={{ color: 'var(--theme-text-muted)' }}>Activity</h3>
                                            <ToggleRow label="Bounty Updates" desc="When bounties you applied to change status" enabled={notifBounty} onToggle={() => setNotifBounty(!notifBounty)} />
                                            <ToggleRow label="Spill Interactions" desc="Likes, comments, and shares on your spills" enabled={notifSpill} onToggle={() => setNotifSpill(!notifSpill)} />
                                            <ToggleRow label="Job Recommendations" desc="New jobs matching your skill profile" enabled={notifJob} onToggle={() => setNotifJob(!notifJob)} />
                                        </div>

                                        <div>
                                            <h3 className="text-[11px] uppercase tracking-widest font-semibold mb-2" style={{ color: 'var(--theme-text-muted)' }}>Delivery</h3>
                                            <ToggleRow label="Email Notifications" desc="Receive notifications via email" enabled={notifEmail} onToggle={() => setNotifEmail(!notifEmail)} />
                                            <ToggleRow label="Push Notifications" desc="Browser push notifications" enabled={notifPush} onToggle={() => setNotifPush(!notifPush)} />
                                        </div>
                                    </Section>
                                </div>
                            )}

                            {/* ═══ Appearance ═══ */}
                            {activeTab === "appearance" && (
                                <div className="p-6 space-y-6">
                                    <Section title="Appearance" desc="Customize the look and feel of SkillSpill">
                                        {/* Theme Toggle — wired to actual ThemeProvider */}
                                        <div>
                                            <label className="text-[10px] uppercase tracking-widest font-semibold block mb-3" style={{ color: 'var(--theme-text-muted)' }}>Theme</label>
                                            <div className="flex items-center gap-4 p-4 rounded-xl" style={{ background: 'var(--theme-bg)', border: '1px solid var(--theme-border)' }}>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[20px]">☀️</span>
                                                    <div>
                                                        <p className="text-[13px] font-semibold" style={{ color: 'var(--theme-text-primary)' }}>
                                                            {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
                                                        </p>
                                                        <p className="text-[11px]" style={{ color: 'var(--theme-text-muted)' }}>
                                                            {theme === 'light' ? 'Clean and bright interface' : 'Easy on the eyes at night'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="ml-auto">
                                                    <ThemeToggle />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Accent Color */}
                                        <div>
                                            <label className="text-[10px] uppercase tracking-widest font-semibold block mb-3" style={{ color: 'var(--theme-text-muted)' }}>Accent Color</label>
                                            <div className="flex gap-3">
                                                {accentOptions.map((opt) => (
                                                    <button
                                                        key={opt.color}
                                                        onClick={() => setAccentColor(opt.color)}
                                                        className="w-10 h-10 rounded-xl transition-all duration-200 cursor-pointer border-2 flex items-center justify-center"
                                                        style={{
                                                            background: opt.color,
                                                            borderColor: accentColor === opt.color ? 'var(--theme-text-primary)' : 'transparent',
                                                            boxShadow: accentColor === opt.color ? `0 4px 15px ${opt.color}50` : 'none',
                                                            transform: accentColor === opt.color ? 'scale(1.1)' : 'scale(1)',
                                                        }}
                                                        title={opt.label}
                                                    >
                                                        {accentColor === opt.color && (
                                                            <span className="text-white"><CheckIcon /></span>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Code Font */}
                                        <div>
                                            <label className="text-[10px] uppercase tracking-widest font-semibold block mb-3" style={{ color: 'var(--theme-text-muted)' }}>Code Font</label>
                                            <div className="flex gap-2 flex-wrap">
                                                {["JetBrains Mono", "Fira Code", "Source Code Pro", "Cascadia Code"].map((font) => (
                                                    <button
                                                        key={font}
                                                        onClick={() => setCodeFont(font)}
                                                        className="px-4 py-2.5 rounded-xl text-[12px] transition-all duration-200 cursor-pointer border-none"
                                                        style={{
                                                            fontFamily: `"${font}", monospace`,
                                                            background: codeFont === font ? '#10B981' : 'var(--theme-input-bg)',
                                                            color: codeFont === font ? '#fff' : 'var(--theme-text-secondary)',
                                                            border: codeFont === font ? 'none' : '1px solid var(--theme-border)',
                                                            boxShadow: codeFont === font ? '0 4px 15px rgba(16, 185, 129, 0.3)' : 'none',
                                                        }}
                                                    >
                                                        {font}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <ToggleRow label="Compact Mode" desc="Reduce spacing for a denser layout" enabled={compactMode} onToggle={() => setCompactMode(!compactMode)} />
                                    </Section>
                                </div>
                            )}

                            {/* ═══ Connections ═══ */}
                            {activeTab === "connections" && (
                                <div className="p-6 space-y-6">
                                    <Section title="Connections" desc="Link external accounts to boost your SkillSpill profile">
                                        <div className="space-y-3">
                                            {/* GitHub */}
                                            <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'var(--theme-bg)', border: '1px solid var(--theme-border)' }}>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--theme-input-bg)' }}>
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--theme-text-primary)' }}><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" /></svg>
                                                    </div>
                                                    <div>
                                                        <p className="text-[13px] font-semibold" style={{ color: 'var(--theme-text-primary)' }}>GitHub</p>
                                                        <p className="text-[11px]" style={{ color: githubConnected ? '#10B981' : 'var(--theme-text-muted)' }}>
                                                            {githubConnected ? "✓ Connected as ghost-protocol" : "Not connected"}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => setGithubConnected(!githubConnected)}
                                                    className="px-4 py-2 rounded-xl text-[11px] font-bold cursor-pointer transition-all border-none"
                                                    style={githubConnected
                                                        ? { background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }
                                                        : { background: '#10B981', color: '#fff', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)' }
                                                    }
                                                >
                                                    {githubConnected ? "Disconnect" : "Connect"}
                                                </button>
                                            </div>

                                            {/* LinkedIn */}
                                            <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'var(--theme-bg)', border: '1px solid var(--theme-border)' }}>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-[#0A66C2]/10 flex items-center justify-center">
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="#0A66C2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                                                    </div>
                                                    <div>
                                                        <p className="text-[13px] font-semibold" style={{ color: 'var(--theme-text-primary)' }}>LinkedIn</p>
                                                        <p className="text-[11px]" style={{ color: linkedinConnected ? '#10B981' : 'var(--theme-text-muted)' }}>
                                                            {linkedinConnected ? "✓ Connected" : "Not connected"}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => setLinkedinConnected(!linkedinConnected)}
                                                    className="px-4 py-2 rounded-xl text-[11px] font-bold cursor-pointer transition-all border-none"
                                                    style={linkedinConnected
                                                        ? { background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }
                                                        : { background: '#10B981', color: '#fff', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)' }
                                                    }
                                                >
                                                    {linkedinConnected ? "Disconnect" : "Connect"}
                                                </button>
                                            </div>

                                            {/* Discord */}
                                            <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'var(--theme-bg)', border: '1px solid var(--theme-border)' }}>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-[#5865F2]/10 flex items-center justify-center">
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="#5865F2"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" /></svg>
                                                    </div>
                                                    <div>
                                                        <p className="text-[13px] font-semibold" style={{ color: 'var(--theme-text-primary)' }}>Discord</p>
                                                        <p className="text-[11px]" style={{ color: 'var(--theme-text-muted)' }}>Not connected</p>
                                                    </div>
                                                </div>
                                                <button
                                                    className="px-4 py-2 rounded-xl text-[11px] font-bold cursor-pointer transition-all border-none text-white"
                                                    style={{ background: '#10B981', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)' }}
                                                >
                                                    Connect
                                                </button>
                                            </div>
                                        </div>
                                    </Section>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
