"use client";

import React, { useState, useEffect } from "react";

const accent = "#A855F7";

/*  Icons  */
function ShieldIcon() {
    return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
}
function BellIcon() {
    return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>;
}
function LinkIcon() {
    return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>;
}
function TrashIcon() {
    return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>;
}
function BuildingIcon() {
    return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 3v18M15 3v18M3 9h18M3 15h18" /></svg>;
}

const settingsTabs = [
    { key: "company", label: "Company", icon: <BuildingIcon />, desc: "Company profile" },
    { key: "security", label: "Security", icon: <ShieldIcon />, desc: "Account safety" },
    { key: "notifications", label: "Notifications", icon: <BellIcon />, desc: "Alert preferences" },
    { key: "connections", label: "Connections", icon: <LinkIcon />, desc: "Linked accounts" },
];

/*  Toggle Switch  */
function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
    return (
        <button
            onClick={onToggle}
            className="relative w-11 h-6 rounded-full transition-all duration-300 cursor-pointer border-none shrink-0"
            style={{
                background: enabled ? accent : 'var(--theme-input-bg)',
                boxShadow: enabled ? `0 0 12px ${accent}50` : 'none',
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

/*  Section Wrapper  */
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

/*  Input Field  */
function InputField({ label, value, onChange, type = "text", mono = false, placeholder }: {
    label: string; value: string; onChange: (v: string) => void; type?: string; mono?: boolean; placeholder?: string;
}) {
    return (
        <div>
            {label && (
                <label className="text-[10px] uppercase tracking-widest font-semibold block mb-1.5" style={{ color: 'var(--theme-text-muted)' }}>
                    {label}
                </label>
            )}
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={`w-full px-3.5 py-2.5 rounded-xl text-[13px] outline-none transition-all focus:ring-2 focus:ring-[${accent}]/20`}
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

/*  Toggle Row  */
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

export default function RecruiterSettingsPage() {
    const [activeTab, setActiveTab] = useState("company");

    /* ── Company Profile ── */
    const [companyForm, setCompanyForm] = useState({
        fullName: "", jobTitle: "", companyName: "", companyWebsite: "",
        companySize: "", location: "", country: "", bio: "",
    });
    const [companyLoaded, setCompanyLoaded] = useState(false);
    const [savingCompany, setSavingCompany] = useState(false);
    const [companyMsg, setCompanyMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

    useEffect(() => {
        fetch("/api/user/profile")
            .then(r => r.json())
            .then(d => {
                if (!d.user) return;
                const u = d.user;
                const rp = u.recruiterProfile || {};
                setCompanyForm({
                    fullName: u.fullName || "",
                    jobTitle: rp.jobTitle || "",
                    companyName: rp.companyName || "",
                    companyWebsite: rp.companyWebsite || "",
                    companySize: rp.companySize || "",
                    location: rp.location || "",
                    country: rp.country || "",
                    bio: rp.bio || "",
                });
                setCompanyLoaded(true);
            })
            .catch(() => { });
    }, []);

    const saveCompany = async () => {
        setSavingCompany(true);
        setCompanyMsg(null);
        const res = await fetch("/api/user/profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                fullName: companyForm.fullName,
                recruiterProfile: {
                    jobTitle: companyForm.jobTitle || null,
                    companyName: companyForm.companyName || "Unknown",
                    companyWebsite: companyForm.companyWebsite || null,
                    companySize: companyForm.companySize || null,
                    location: companyForm.location || null,
                    country: companyForm.country || null,
                    bio: companyForm.bio || null,
                },
            }),
        });
        const data = await res.json();
        setSavingCompany(false);
        setCompanyMsg(res.ok && data.success
            ? { type: "ok", text: "Profile saved successfully!" }
            : { type: "err", text: data.error || "Failed to save. Try again." });
        setTimeout(() => setCompanyMsg(null), 4000);
    };

    /* Security */
    const [twoFA, setTwoFA] = useState(false);
    const [sessionAlerts, setSessionAlerts] = useState(true);

    /* Notifications */
    const [notifApplication, setNotifApplication] = useState(true);
    const [notifSpill, setNotifSpill] = useState(true);
    const [notifJob, setNotifJob] = useState(true);
    const [notifEmail, setNotifEmail] = useState(true);
    const [notifPush, setNotifPush] = useState(false);

    /* Connections */
    const [githubConnected, setGithubConnected] = useState(false);
    const [linkedinConnected, setLinkedinConnected] = useState(true);

    return (
        <div className="min-h-full" style={{ background: 'var(--theme-bg)' }}>
            <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-4 pb-24 lg:pb-8">

                {/*  Header  */}
                <div className="mb-6">
                    <h1 className="text-2xl lg:text-3xl font-bold tracking-tight" style={{ color: 'var(--theme-text-primary)', fontFamily: 'var(--font-space-grotesk)' }}>
                        Settings
                    </h1>
                    <p className="text-[13px] mt-1" style={{ color: 'var(--theme-text-muted)' }}>
                        Configure your company experience. <span style={{ color: accent }} className="font-semibold">Fine-tune your workflow.</span>
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/*  Sidebar Tabs  */}
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
                                                    background: accent,
                                                    color: '#fff',
                                                    boxShadow: `0 4px 15px ${accent}50`,
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

                    {/*  Content Area  */}
                    <div className="flex-1 min-w-0">
                        <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--theme-card)', borderColor: 'var(--theme-border)' }}>

                            {/*  Company Profile  */}
                            {activeTab === "company" && (
                                <div className="p-6 space-y-6">
                                    <Section title="Company Profile" desc="This information appears publicly on your company profile and in search results">
                                        {!companyLoaded ? (
                                            <div className="text-center py-8 text-[12px]" style={{ color: 'var(--theme-text-muted)' }}>Loading your profile...</div>
                                        ) : (
                                            <div className="space-y-5">
                                                {companyMsg && (
                                                    <div className="rounded-xl px-4 py-3 text-[12px] font-medium"
                                                        style={{
                                                            background: companyMsg.type === "ok" ? `${accent}10` : 'rgba(239,68,68,0.08)',
                                                            border: `1px solid ${companyMsg.type === "ok" ? `${accent}30` : 'rgba(239,68,68,0.2)'}`,
                                                            color: companyMsg.type === "ok" ? accent : '#EF4444',
                                                        }}>
                                                        {companyMsg.text}
                                                    </div>
                                                )}

                                                {/* Identity */}
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <InputField label="Your Full Name" value={companyForm.fullName}
                                                        onChange={v => setCompanyForm(f => ({ ...f, fullName: v }))}
                                                        placeholder="e.g. Sarah Khan" />
                                                    <InputField label="Your Job Title" value={companyForm.jobTitle}
                                                        onChange={v => setCompanyForm(f => ({ ...f, jobTitle: v }))}
                                                        placeholder="e.g. Head of Talent, CTO, HR Manager" />
                                                </div>

                                                {/* Company */}
                                                <div>
                                                    <h3 className="text-[11px] uppercase tracking-widest font-semibold mb-3" style={{ color: 'var(--theme-text-muted)' }}>Company Info</h3>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        <InputField label="Company Name *" value={companyForm.companyName}
                                                            onChange={v => setCompanyForm(f => ({ ...f, companyName: v }))}
                                                            placeholder="e.g. NastecSol" />
                                                        <InputField label="Company Website" value={companyForm.companyWebsite}
                                                            onChange={v => setCompanyForm(f => ({ ...f, companyWebsite: v }))}
                                                            placeholder="https://yourcompany.com" />
                                                        <div>
                                                            <label className="text-[10px] uppercase tracking-widest font-semibold block mb-1.5" style={{ color: 'var(--theme-text-muted)' }}>
                                                                Company Size
                                                            </label>
                                                            <select value={companyForm.companySize}
                                                                onChange={e => setCompanyForm(f => ({ ...f, companySize: e.target.value }))}
                                                                className="w-full px-3.5 py-2.5 rounded-xl text-[13px] outline-none"
                                                                style={{ background: 'var(--theme-input-bg)', border: '1px solid var(--theme-border)', color: 'var(--theme-text-primary)' }}>
                                                                <option value="">Select size...</option>
                                                                <option value="1-10">1–10 employees</option>
                                                                <option value="11-50">11–50 employees</option>
                                                                <option value="51-200">51–200 employees</option>
                                                                <option value="201-500">201–500 employees</option>
                                                                <option value="501-1000">501–1000 employees</option>
                                                                <option value="1001+">1001+ employees</option>
                                                            </select>
                                                        </div>
                                                        <InputField label="Location / City" value={companyForm.location}
                                                            onChange={v => setCompanyForm(f => ({ ...f, location: v }))}
                                                            placeholder="e.g. Karachi, London" />
                                                        <InputField label="Country" value={companyForm.country}
                                                            onChange={v => setCompanyForm(f => ({ ...f, country: v }))}
                                                            placeholder="e.g. Pakistan" />
                                                    </div>
                                                </div>

                                                {/* Bio */}
                                                <div>
                                                    <label className="text-[10px] uppercase tracking-widest font-semibold block mb-1.5" style={{ color: 'var(--theme-text-muted)' }}>Company Bio</label>
                                                    <textarea value={companyForm.bio}
                                                        onChange={e => setCompanyForm(f => ({ ...f, bio: e.target.value }))}
                                                        rows={4}
                                                        placeholder="Describe your company, culture, and what makes it a great place to work..."
                                                        className="w-full px-3.5 py-2.5 rounded-xl text-[13px] outline-none resize-none"
                                                        style={{ background: 'var(--theme-input-bg)', border: '1px solid var(--theme-border)', color: 'var(--theme-text-primary)' }}
                                                    />
                                                </div>

                                                {/* Save */}
                                                <div className="pt-4 border-t border-[var(--theme-border-light)] flex justify-end">
                                                    <button onClick={saveCompany} disabled={savingCompany}
                                                        className="px-6 py-2.5 rounded-xl text-[12px] font-bold text-white border-none cursor-pointer transition-all hover:scale-105 disabled:opacity-60"
                                                        style={{ background: accent, boxShadow: savingCompany ? 'none' : `0 4px 15px ${accent}50` }}>
                                                        {savingCompany ? "Saving..." : "Save Profile"}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </Section>
                                </div>
                            )}

                            {/*  Security  */}
                            {activeTab === "security" && (
                                <div className="p-6 space-y-6">
                                    <Section title="Security & Privacy" desc="Protect your SkillSpill company account">
                                        {/* Password */}
                                        <div className="rounded-xl p-4 space-y-3" style={{ background: 'var(--theme-bg)', border: '1px solid var(--theme-border)' }}>
                                            <h3 className="text-[13px] font-semibold" style={{ color: 'var(--theme-text-primary)' }}>Change Password</h3>
                                            <InputField label="" value="" onChange={() => { }} type="password" placeholder="Current password" />
                                            <InputField label="" value="" onChange={() => { }} type="password" placeholder="New password" />
                                            <InputField label="" value="" onChange={() => { }} type="password" placeholder="Confirm new password" />
                                            <button
                                                className="px-4 py-2 rounded-xl text-[11px] font-bold text-white border-none cursor-pointer hover:shadow-md transition-all"
                                                style={{ background: accent }}
                                            >
                                                Update Password
                                            </button>
                                        </div>

                                        <ToggleRow label="Two-Factor Authentication" desc="Add an extra layer of security to your account" enabled={twoFA} onToggle={() => setTwoFA(!twoFA)} />
                                        <ToggleRow label="Session Alerts" desc="Get notified when someone logs in from a new device" enabled={sessionAlerts} onToggle={() => setSessionAlerts(!sessionAlerts)} />
                                    </Section>

                                    {/* Danger Zone */}
                                    <div className="rounded-xl p-4" style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.15)' }}>
                                        <h3 className="text-[13px] font-semibold text-red-500 mb-1"> Danger Zone</h3>
                                        <p className="text-[11px] mb-3" style={{ color: 'var(--theme-text-muted)' }}>Once deleted, your account cannot be recovered.</p>
                                        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-bold text-red-500 cursor-pointer transition-all hover:shadow-md border-none" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
                                            <TrashIcon />
                                            Delete Account
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/*  Notifications  */}
                            {activeTab === "notifications" && (
                                <div className="p-6 space-y-6">
                                    <Section title="Notifications" desc="Choose what alerts you want to receive">
                                        <div>
                                            <h3 className="text-[11px] uppercase tracking-widest font-semibold mb-2" style={{ color: 'var(--theme-text-muted)' }}>Activity</h3>
                                            <ToggleRow label="New Applications" desc="When candidates apply to your jobs" enabled={notifApplication} onToggle={() => setNotifApplication(!notifApplication)} />
                                            <ToggleRow label="Spill Interactions" desc="Likes, comments, and shares on your spills" enabled={notifSpill} onToggle={() => setNotifSpill(!notifSpill)} />
                                            <ToggleRow label="Job Updates" desc="Status changes on your posted jobs" enabled={notifJob} onToggle={() => setNotifJob(!notifJob)} />
                                        </div>

                                        <div>
                                            <h3 className="text-[11px] uppercase tracking-widest font-semibold mb-2" style={{ color: 'var(--theme-text-muted)' }}>Delivery</h3>
                                            <ToggleRow label="Email Notifications" desc="Receive notifications via email" enabled={notifEmail} onToggle={() => setNotifEmail(!notifEmail)} />
                                            <ToggleRow label="Push Notifications" desc="Browser push notifications" enabled={notifPush} onToggle={() => setNotifPush(!notifPush)} />
                                        </div>
                                    </Section>
                                </div>
                            )}

                            {/*  Connections  */}
                            {activeTab === "connections" && (
                                <div className="p-6 space-y-6">
                                    <Section title="Connections" desc="Link external accounts to enhance your company profile">
                                        <div className="space-y-3">
                                            {/* GitHub */}
                                            <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'var(--theme-bg)', border: '1px solid var(--theme-border)' }}>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--theme-input-bg)' }}>
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--theme-text-primary)' }}><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" /></svg>
                                                    </div>
                                                    <div>
                                                        <p className="text-[13px] font-semibold" style={{ color: 'var(--theme-text-primary)' }}>GitHub</p>
                                                        <p className="text-[11px]" style={{ color: githubConnected ? accent : 'var(--theme-text-muted)' }}>
                                                            {githubConnected ? " Connected" : "Not connected"}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => setGithubConnected(!githubConnected)}
                                                    className="px-4 py-2 rounded-xl text-[11px] font-bold cursor-pointer transition-all border-none"
                                                    style={githubConnected
                                                        ? { background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }
                                                        : { background: accent, color: '#fff', boxShadow: `0 4px 15px ${accent}50` }
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
                                                        <p className="text-[11px]" style={{ color: linkedinConnected ? accent : 'var(--theme-text-muted)' }}>
                                                            {linkedinConnected ? " Connected" : "Not connected"}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => setLinkedinConnected(!linkedinConnected)}
                                                    className="px-4 py-2 rounded-xl text-[11px] font-bold cursor-pointer transition-all border-none"
                                                    style={linkedinConnected
                                                        ? { background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }
                                                        : { background: accent, color: '#fff', boxShadow: `0 4px 15px ${accent}50` }
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
                                                    style={{ background: accent, boxShadow: `0 4px 15px ${accent}50` }}
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
