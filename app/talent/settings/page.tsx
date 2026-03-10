"use client";

import React, { useState, useEffect } from "react";
import { compressImageClient } from "@/lib/client-compress";

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

function EyeIcon() {
    return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>;
}

function BriefcaseIconSm() {
    return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>;
}

function UserIcon() {
    return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
}

const settingsTabs = [
    { key: "profile", label: "Profile", icon: <UserIcon />, desc: "Edit your info" },
    { key: "security", label: "Security", icon: <ShieldIcon />, desc: "Account safety" },
    { key: "privacy", label: "Privacy", icon: <EyeIcon />, desc: "Profile visibility" },
    { key: "experience", label: "Experience", icon: <BriefcaseIconSm />, desc: "Work history" },
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
                background: enabled ? '#3CF91A' : 'var(--theme-input-bg)',
                boxShadow: enabled ? '0 0 12px rgba(60, 249, 26, 0.3)' : 'none',
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
                className="w-full px-3.5 py-2.5 rounded-xl text-[13px] outline-none transition-all focus:ring-2 focus:ring-[#3CF91A]/20"
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

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("profile");

    /* ── Profile ── */
    type Project = { url: string; title: string; description: string };
    const [profileForm, setProfileForm] = useState({
        fullName: "", bio: "", experienceLevel: "", isAvailable: true,
        portfolioUrl: "", linkedinUrl: "", githubUsername: "", resumeUrl: "",
    });
    const [skillInput, setSkillInput] = useState("");
    const [skills, setSkills] = useState<string[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [profileLoaded, setProfileLoaded] = useState(false);
    const [savingProfile, setSavingProfile] = useState(false);
    const [profileMsg, setProfileMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
    const [avatarUrl, setAvatarUrl] = useState("");
    const [avatarUploading, setAvatarUploading] = useState(false);

    // Privacy state — populated from the same profile fetch
    const [showEmail, setShowEmail] = useState(false);
    const [showPhone, setShowPhone] = useState(false);
    const [showSocials, setShowSocials] = useState(true);
    const [contactEmail, setContactEmail] = useState("");
    const [contactPhone, setContactPhone] = useState("");
    const [isSavingPrivacy, setIsSavingPrivacy] = useState(false);
    const [sharePrivateRepos, setSharePrivateRepos] = useState(false);
    const [githubConnecting, setGithubConnecting] = useState(false);
    const [isDeletingAccount, setIsDeletingAccount] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        fetch("/api/user/profile")
            .then(r => r.json())
            .then(d => {
                if (!d.user) return;
                const u = d.user;
                const tp = u.talentProfile || {};
                setAvatarUrl(u.avatarUrl || "");
                setProfileForm({
                    fullName: u.fullName || "",
                    bio: tp.bio || "",
                    experienceLevel: tp.experienceLevel || "",
                    isAvailable: tp.isAvailable ?? true,
                    portfolioUrl: tp.portfolioUrl || "",
                    linkedinUrl: tp.linkedinUrl || "",
                    githubUsername: tp.githubUsername || "",
                    resumeUrl: tp.resumeUrl || "",
                });
                setSkills(tp.skills?.map((s: any) => s.skillName) || []);
                setProjects(tp.projectLinks?.map((p: any) => ({ url: p.url, title: p.title || "", description: p.description || "" })) || []);
                // Also populate privacy fields from the same fetch
                setShowEmail(tp.showEmail ?? false);
                setShowPhone(tp.showPhone ?? false);
                setShowSocials(tp.showSocials ?? true);
                setContactEmail(tp.contactEmail || "");
                setContactPhone(tp.contactPhone || "");
                setGithubConnected(tp.githubConnected ?? false);
                setSharePrivateRepos(tp.sharePrivateRepos ?? false);
                setProfileLoaded(true);
            })
            .catch(() => { });
    }, []);

    const addSkill = () => {
        const s = skillInput.trim();
        if (s && !skills.includes(s)) setSkills(prev => [...prev, s]);
        setSkillInput("");
    };

    const removeSkill = (s: string) => setSkills(prev => prev.filter(x => x !== s));

    const addProject = () => setProjects(prev => [...prev, { url: "", title: "", description: "" }]);
    const removeProject = (i: number) => setProjects(prev => prev.filter((_, idx) => idx !== i));
    const updateProject = (i: number, field: keyof Project, val: string) =>
        setProjects(prev => prev.map((p, idx) => idx === i ? { ...p, [field]: val } : p));

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
        if (!allowedTypes.includes(file.type)) {
            alert("Only JPEG, PNG, WebP, or GIF images are allowed.");
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            alert("Image must be under 10MB.");
            return;
        }
        setAvatarUploading(true);
        try {
            // Client-side compression first (Canvas API)
            const compressed = await compressImageClient(file);
            const fd = new FormData();
            fd.append("file", compressed);
            fd.append("category", "avatars");
            fd.append("folder", "avatars");
            if (avatarUrl) fd.append("oldFileUrl", avatarUrl);
            const res = await fetch("/api/upload", { method: "POST", body: fd });
            const data = await res.json();
            if (res.ok && data.url) {
                setAvatarUrl(data.url);
                // Immediately save to database
                await fetch("/api/user/profile", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ avatarUrl: data.url }),
                });
                setProfileMsg({ type: "ok", text: "Profile picture updated!" });
                setTimeout(() => setProfileMsg(null), 4000);
            } else {
                alert(data.error || "Upload failed.");
            }
        } catch {
            alert("Network error during upload.");
        } finally {
            setAvatarUploading(false);
        }
    };

    const saveProfile = async () => {
        setSavingProfile(true);
        setProfileMsg(null);
        const res = await fetch("/api/user/profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                fullName: profileForm.fullName,
                avatarUrl: avatarUrl || null,
                talentProfile: {
                    bio: profileForm.bio,
                    experienceLevel: profileForm.experienceLevel || null,
                    isAvailable: profileForm.isAvailable,
                    portfolioUrl: profileForm.portfolioUrl || null,
                    linkedinUrl: profileForm.linkedinUrl || null,
                    githubUsername: profileForm.githubUsername || null,
                    resumeUrl: profileForm.resumeUrl || null,
                    skills,
                    projectLinks: projects.filter(p => p.url.trim()),
                },
            }),
        });
        const data = await res.json();
        setSavingProfile(false);
        setProfileMsg(res.ok && data.success
            ? { type: "ok", text: "Profile saved successfully!" }
            : { type: "err", text: data.error || "Failed to save. Try again." });
        setTimeout(() => setProfileMsg(null), 4000);
    };

    /* Security */
    const [twoFA, setTwoFA] = useState(false);
    const [sessionAlerts, setSessionAlerts] = useState(true);

    /* Notifications */
    const [notifBounty, setNotifBounty] = useState(true);
    const [notifSpill, setNotifSpill] = useState(true);
    const [notifJob, setNotifJob] = useState(false);
    const [notifEmail, setNotifEmail] = useState(true);
    const [notifPush, setNotifPush] = useState(false);

    /* Connections */
    const [githubConnected, setGithubConnected] = useState(false);
    const [linkedinConnected, setLinkedinConnected] = useState(false);

    const connectGithub = () => {
        const width = 600;
        const height = 700;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;
        const features = `width=${width},height=${height},left=${left},top=${top},status=no,menubar=no,toolbar=no,scrollbars=yes`;

        const popup = window.open(`/api/auth/github?action=connect&sharePrivate=${sharePrivateRepos}`, "github_oauth", features);

        const messageListener = async (event: MessageEvent) => {
            if (event.origin !== window.location.origin) return;
            if (event.data.type === "GITHUB_CONNECTED") {
                window.removeEventListener("message", messageListener);
                setGithubConnecting(true);
                const { username, githubId, accessToken } = event.data.payload;

                const res = await fetch("/api/user/profile", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        githubId,
                        talentProfile: {
                            githubConnected: true,
                            githubUsername: username,
                            githubAccessToken: accessToken,
                            sharePrivateRepos
                        }
                    })
                });

                setGithubConnecting(false);
                if (res.ok) {
                    setGithubConnected(true);
                    setProfileForm(f => ({ ...f, githubUsername: username }));
                }
            }
        };
        window.addEventListener("message", messageListener);
    };

    const disconnectGithub = async () => {
        if (!confirm("Are you sure you want to disconnect your GitHub account?")) return;
        setGithubConnecting(true);
        const res = await fetch("/api/user/profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                githubId: null,
                talentProfile: {
                    githubConnected: false,
                    githubUsername: null,
                    githubAccessToken: null,
                    sharePrivateRepos: false
                }
            })
        });
        setGithubConnecting(false);
        if (res.ok) {
            setGithubConnected(false);
            setSharePrivateRepos(false);
            setProfileForm(f => ({ ...f, githubUsername: "" }));
        }
    };

    /* ── Work Experience ── */
    type WorkExp = {
        id: string; companyName: string; role: string;
        startDate: string; endDate: string | null; isCurrent: boolean; description: string | null;
    };
    const [experiences, setExperiences] = useState<WorkExp[]>([]);
    const [loadingExp, setLoadingExp] = useState(false);
    const [showExpForm, setShowExpForm] = useState(false);
    const [editingExp, setEditingExp] = useState<WorkExp | null>(null);
    const [expForm, setExpForm] = useState({ companyName: "", role: "", startDate: "", endDate: "", isCurrent: false, description: "" });
    const [savingExp, setSavingExp] = useState(false);

    useEffect(() => {
        if (activeTab !== "experience") return;
        setLoadingExp(true);
        fetch("/api/talent/work-experience")
            .then(r => r.json())
            .then(d => setExperiences(d.workExperience ?? []))
            .finally(() => setLoadingExp(false));
    }, [activeTab]);

    const openAddForm = () => {
        setEditingExp(null);
        setExpForm({ companyName: "", role: "", startDate: "", endDate: "", isCurrent: false, description: "" });
        setShowExpForm(true);
    };

    const openEditForm = (exp: WorkExp) => {
        setEditingExp(exp);
        setExpForm({
            companyName: exp.companyName,
            role: exp.role,
            startDate: exp.startDate.slice(0, 10),
            endDate: exp.endDate ? exp.endDate.slice(0, 10) : "",
            isCurrent: exp.isCurrent,
            description: exp.description ?? "",
        });
        setShowExpForm(true);
    };

    const saveExperience = async () => {
        if (!expForm.companyName || !expForm.role || !expForm.startDate) return;
        setSavingExp(true);
        const url = editingExp ? `/api/talent/work-experience/${editingExp.id}` : "/api/talent/work-experience";
        const method = editingExp ? "PATCH" : "POST";
        const res = await fetch(url, {
            method, headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...expForm, endDate: expForm.isCurrent ? null : (expForm.endDate || null) }),
        });
        const data = await res.json();
        if (data.entry) {
            if (editingExp) {
                setExperiences(prev => prev.map(e => e.id === editingExp.id ? data.entry : e));
            } else {
                setExperiences(prev => [data.entry, ...prev]);
            }
            setShowExpForm(false);
        }
        setSavingExp(false);
    };

    const deleteExperience = async (id: string) => {
        if (!confirm("Remove this work experience?")) return;
        await fetch(`/api/talent/work-experience/${id}`, { method: "DELETE" });
        setExperiences(prev => prev.filter(e => e.id !== id));
    };

    const formatDateRange = (exp: WorkExp) => {
        const fmt = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", year: "numeric" });
        return `${fmt(exp.startDate)} – ${exp.isCurrent ? "Present" : exp.endDate ? fmt(exp.endDate) : ""}`;
    };

    const savePrivacySettings = async () => {
        setIsSavingPrivacy(true);
        try {
            const res = await fetch("/api/user/profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    talentProfile: {
                        showEmail,
                        showPhone,
                        showSocials,
                        contactEmail,
                        contactPhone,
                    }
                })
            });
            if (res.ok) {
                alert("Privacy settings saved successfully!");
            } else {
                alert("Failed to save privacy settings.");
            }
        } catch (error) {
            console.error(error);
            alert("Error saving settings.");
        } finally {
            setIsSavingPrivacy(false);
        }
    };

    const confirmDeleteAccount = async () => {
        try {
            setIsDeletingAccount(true);
            const res = await fetch("/api/user/profile", {
                method: "DELETE"
            });

            if (res.ok) {
                // Also call logout to clear any frontend cookies just in case
                await fetch("/api/auth/logout", { method: "POST" });
                window.location.href = "/signup/talent";
            } else {
                const data = await res.json();
                alert(`Error deleting account: ${data.error || 'Unknown error'}`);
                setIsDeletingAccount(false);
                setShowDeleteModal(false);
            }
        } catch (err: any) {
            alert(`Network error deleting account: ${err.message}`);
            setIsDeletingAccount(false);
            setShowDeleteModal(false);
        }
    };

    return (
        <div className="min-h-full" style={{ background: 'var(--theme-bg)' }}>
            <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-5">

                {/*  Header  */}
                <div className="mb-6">
                    <h1 className="text-2xl lg:text-3xl font-bold tracking-tight" style={{ color: 'var(--theme-text-primary)', fontFamily: 'var(--font-space-grotesk)' }}>
                        Settings
                    </h1>
                    <p className="text-[13px] mt-1" style={{ color: 'var(--theme-text-muted)' }}>
                        Configure your SkillSpill experience. <span className="text-[#3CF91A] font-semibold">Make it yours.</span>
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
                                                    background: '#3CF91A',
                                                    color: '#000',
                                                    boxShadow: '0 4px 15px rgba(60, 249, 26, 0.3)',
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

                            {/*  Profile  */}
                            {activeTab === "profile" && (
                                <div className="p-6 space-y-6">
                                    <Section title="Public Profile" desc="This information appears on your profile and in search results">

                                        {!profileLoaded ? (
                                            <div className="text-center py-8 text-[12px]" style={{ color: 'var(--theme-text-muted)' }}>Loading your profile...</div>
                                        ) : (
                                            <div className="space-y-5">
                                                {/* Success / Error banner */}
                                                {profileMsg && (
                                                    <div className="rounded-xl px-4 py-3 text-[12px] font-medium"
                                                        style={{
                                                            background: profileMsg.type === "ok" ? '#3CF91A10' : 'rgba(239,68,68,0.08)',
                                                            border: `1px solid ${profileMsg.type === "ok" ? '#3CF91A30' : 'rgba(239,68,68,0.2)'}`,
                                                            color: profileMsg.type === "ok" ? '#3CF91A' : '#EF4444',
                                                        }}>
                                                        {profileMsg.text}
                                                    </div>
                                                )}

                                                {/* Profile Picture */}
                                                <div className="flex items-center gap-5 pb-5" style={{ borderBottom: '1px solid var(--theme-border-light)' }}>
                                                    <div className="relative group">
                                                        <input
                                                            type="file"
                                                            accept="image/jpeg,image/png,image/webp,image/gif"
                                                            id="avatar-upload"
                                                            className="hidden"
                                                            onChange={handleAvatarUpload}
                                                        />
                                                        <div
                                                            onClick={() => !avatarUploading && document.getElementById('avatar-upload')?.click()}
                                                            className="w-20 h-20 rounded-full flex items-center justify-center cursor-pointer overflow-hidden border-2 transition-all relative"
                                                            style={{
                                                                borderColor: avatarUrl ? '#3CF91A40' : 'var(--theme-border)',
                                                                background: avatarUrl ? 'transparent' : 'var(--theme-input-bg)',
                                                            }}
                                                        >
                                                            {avatarUrl ? (
                                                                <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <span className="text-2xl font-bold" style={{ color: 'var(--theme-text-muted)' }}>
                                                                    {profileForm.fullName ? profileForm.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '??'}
                                                                </span>
                                                            )}
                                                            {/* Hover overlay */}
                                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
                                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                                                                    <circle cx="12" cy="13" r="4" />
                                                                </svg>
                                                            </div>
                                                            {avatarUploading && (
                                                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-full">
                                                                    <div className="w-6 h-6 border-2 border-[#3CF91A] border-t-transparent rounded-full animate-spin" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="text-[13px] font-semibold" style={{ color: 'var(--theme-text-primary)' }}>Profile Picture</p>
                                                        <p className="text-[11px] mt-0.5" style={{ color: 'var(--theme-text-muted)' }}>Click to upload. JPEG, PNG, WebP or GIF. Max 10MB. Auto-compressed.</p>
                                                        {avatarUrl && (
                                                            <button
                                                                onClick={async () => {
                                                                    if (!confirm('Remove your profile picture?')) return;
                                                                    setAvatarUrl('');
                                                                    await fetch('/api/user/profile', {
                                                                        method: 'POST',
                                                                        headers: { 'Content-Type': 'application/json' },
                                                                        body: JSON.stringify({ avatarUrl: null }),
                                                                    });
                                                                    setProfileMsg({ type: 'ok', text: 'Profile picture removed.' });
                                                                    setTimeout(() => setProfileMsg(null), 4000);
                                                                }}
                                                                className="text-[10px] mt-1.5 font-medium cursor-pointer bg-transparent border-none p-0"
                                                                style={{ color: '#EF4444' }}
                                                            >
                                                                Remove photo
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Basic info */}
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <InputField label="Display Name" value={profileForm.fullName}
                                                        onChange={v => setProfileForm(f => ({ ...f, fullName: v }))}
                                                        placeholder="e.g. Alex Kim" />
                                                    <div>
                                                        <label className="text-[10px] uppercase tracking-widest font-semibold block mb-1.5" style={{ color: 'var(--theme-text-muted)' }}>
                                                            Experience Level
                                                        </label>
                                                        <select value={profileForm.experienceLevel}
                                                            onChange={e => setProfileForm(f => ({ ...f, experienceLevel: e.target.value }))}
                                                            className="w-full px-3.5 py-2.5 rounded-xl text-[13px] outline-none transition-all focus:ring-2 focus:ring-[#3CF91A]/20"
                                                            style={{ background: 'var(--theme-input-bg)', border: '1px solid var(--theme-border)', color: 'var(--theme-text-primary)' }}>
                                                            <option value="">Select level...</option>
                                                            <option value="JUNIOR">Junior</option>
                                                            <option value="MID">Mid</option>
                                                            <option value="SENIOR">Senior</option>
                                                            <option value="STAFF">Staff</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                {/* Bio */}
                                                <div>
                                                    <label className="text-[10px] uppercase tracking-widest font-semibold block mb-1.5" style={{ color: 'var(--theme-text-muted)' }}>Bio</label>
                                                    <textarea value={profileForm.bio}
                                                        onChange={e => setProfileForm(f => ({ ...f, bio: e.target.value }))}
                                                        rows={4}
                                                        placeholder="Tell companies about yourself, your passions, and what you build..."
                                                        className="w-full px-3.5 py-2.5 rounded-xl text-[13px] outline-none resize-none focus:ring-2 focus:ring-[#3CF91A]/20"
                                                        style={{ background: 'var(--theme-input-bg)', border: '1px solid var(--theme-border)', color: 'var(--theme-text-primary)' }}
                                                    />
                                                </div>

                                                {/* Availability */}
                                                <ToggleRow label="Open to Work" desc="Show the 'Open to Work' badge on your profile and in search results"
                                                    enabled={profileForm.isAvailable}
                                                    onToggle={() => setProfileForm(f => ({ ...f, isAvailable: !f.isAvailable }))} />

                                                {/* Links */}
                                                <div>
                                                    <h3 className="text-[11px] uppercase tracking-widest font-semibold mb-3" style={{ color: 'var(--theme-text-muted)' }}>Links & Socials</h3>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        <InputField label="Portfolio URL" value={profileForm.portfolioUrl}
                                                            onChange={v => setProfileForm(f => ({ ...f, portfolioUrl: v }))}
                                                            placeholder="https://yourportfolio.dev" />
                                                        <InputField label="LinkedIn URL" value={profileForm.linkedinUrl}
                                                            onChange={v => setProfileForm(f => ({ ...f, linkedinUrl: v }))}
                                                            placeholder="https://linkedin.com/in/you" />
                                                        <InputField label="GitHub Username" value={profileForm.githubUsername}
                                                            onChange={v => setProfileForm(f => ({ ...f, githubUsername: v }))}
                                                            placeholder="e.g. ghost-protocol" />
                                                        <div>
                                                            <label className="text-[10px] uppercase tracking-widest font-semibold block mb-1.5" style={{ color: 'var(--theme-text-muted)' }}>
                                                                Resume (PDF)
                                                            </label>
                                                            <div className="flex items-center gap-2">
                                                                <input
                                                                    type="file"
                                                                    accept=".pdf,application/pdf"
                                                                    id="resume-upload-settings"
                                                                    className="hidden"
                                                                    onChange={async (e) => {
                                                                        const file = e.target.files?.[0];
                                                                        if (!file) return;
                                                                        if (file.type !== "application/pdf") { alert("Only PDF files are allowed."); return; }
                                                                        if (file.size > 10 * 1024 * 1024) { alert("File must be under 10MB."); return; }

                                                                        setProfileForm(f => ({ ...f, resumeUrl: "uploading..." }));
                                                                        try {
                                                                            const fd = new FormData();
                                                                            fd.append("file", file);
                                                                            fd.append("category", "resumes");
                                                                            fd.append("folder", "resumes");
                                                                            if (profileForm.resumeUrl && profileForm.resumeUrl !== "uploading...") {
                                                                                fd.append("oldFileUrl", profileForm.resumeUrl);
                                                                            }
                                                                            const res = await fetch("/api/upload", { method: "POST", body: fd });
                                                                            const data = await res.json();
                                                                            if (res.ok && data.url) {
                                                                                setProfileForm(f => ({ ...f, resumeUrl: data.url }));
                                                                            } else {
                                                                                setProfileForm(f => ({ ...f, resumeUrl: "" }));
                                                                                alert(data.error || "Upload failed.");
                                                                            }
                                                                        } catch {
                                                                            setProfileForm(f => ({ ...f, resumeUrl: "" }));
                                                                            alert("Network error during upload.");
                                                                        }
                                                                    }}
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => document.getElementById("resume-upload-settings")?.click()}
                                                                    disabled={profileForm.resumeUrl === "uploading..."}
                                                                    className="w-full px-3.5 py-2.5 rounded-xl text-[13px] outline-none transition-all text-left flex items-center justify-between gap-2 cursor-pointer border-none"
                                                                    style={{
                                                                        background: 'var(--theme-input-bg)',
                                                                        border: '1px solid var(--theme-border)',
                                                                        color: profileForm.resumeUrl && profileForm.resumeUrl !== "uploading..."
                                                                            ? '#3CF91A'
                                                                            : 'var(--theme-text-muted)',
                                                                    }}
                                                                >
                                                                    <span className="truncate">
                                                                        {profileForm.resumeUrl === "uploading..."
                                                                            ? "⏳ Uploading..."
                                                                            : profileForm.resumeUrl
                                                                                ? "✅ Resume uploaded"
                                                                                : "Click to upload PDF"}
                                                                    </span>
                                                                    <span className="text-[10px] shrink-0 opacity-60">
                                                                        {profileForm.resumeUrl && profileForm.resumeUrl !== "uploading..." ? "Replace" : "Browse"}
                                                                    </span>
                                                                </button>
                                                            </div>
                                                            {profileForm.resumeUrl && profileForm.resumeUrl !== "uploading..." && (
                                                                <a href={profileForm.resumeUrl} target="_blank" rel="noopener noreferrer"
                                                                    className="text-[10px] mt-1 inline-block hover:underline"
                                                                    style={{ color: '#3CF91A' }}>
                                                                    View uploaded resume ↗
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Skills */}
                                                <div>
                                                    <h3 className="text-[11px] uppercase tracking-widest font-semibold mb-3" style={{ color: 'var(--theme-text-muted)' }}>Skills</h3>
                                                    {/* Tag input */}
                                                    <div className="flex gap-2 mb-3">
                                                        <input
                                                            value={skillInput}
                                                            onChange={e => setSkillInput(e.target.value)}
                                                            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                                                            placeholder="Type a skill and press Enter"
                                                            className="flex-1 px-3.5 py-2.5 rounded-xl text-[13px] outline-none focus:ring-2 focus:ring-[#3CF91A]/20"
                                                            style={{ background: 'var(--theme-input-bg)', border: '1px solid var(--theme-border)', color: 'var(--theme-text-primary)' }}
                                                        />
                                                        <button onClick={addSkill}
                                                            className="px-4 py-2.5 rounded-xl text-[12px] font-bold text-black border-none cursor-pointer transition-all hover:scale-105"
                                                            style={{ background: '#3CF91A' }}>
                                                            Add
                                                        </button>
                                                    </div>
                                                    {skills.length > 0 ? (
                                                        <div className="flex flex-wrap gap-2">
                                                            {skills.map(s => (
                                                                <span key={s} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium"
                                                                    style={{ background: '#3CF91A10', color: '#3CF91A', border: '1px solid #3CF91A25' }}>
                                                                    {s}
                                                                    <button onClick={() => removeSkill(s)} className="border-none bg-transparent cursor-pointer text-[10px] leading-none opacity-70 hover:opacity-100 p-0"
                                                                        style={{ color: '#3CF91A' }}>✕</button>
                                                                </span>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <p className="text-[11px]" style={{ color: 'var(--theme-text-muted)' }}>No skills added yet. Type above and press Enter or Add.</p>
                                                    )}
                                                </div>

                                                {/* Project Links */}
                                                <div>
                                                    <div className="flex items-center justify-between mb-3">
                                                        <h3 className="text-[11px] uppercase tracking-widest font-semibold" style={{ color: 'var(--theme-text-muted)' }}>Project Links</h3>
                                                        <button onClick={addProject}
                                                            className="text-[11px] font-bold px-3 py-1.5 rounded-lg border-none cursor-pointer transition-all hover:scale-105"
                                                            style={{ background: '#3CF91A15', color: '#3CF91A' }}>
                                                            + Add Project
                                                        </button>
                                                    </div>
                                                    {projects.length === 0 ? (
                                                        <p className="text-[11px]" style={{ color: 'var(--theme-text-muted)' }}>No projects added. Click "Add Project" to showcase your work.</p>
                                                    ) : (
                                                        <div className="space-y-3">
                                                            {projects.map((p, i) => (
                                                                <div key={i} className="rounded-xl p-4 relative space-y-2"
                                                                    style={{ background: 'var(--theme-bg)', border: '1px solid var(--theme-border)' }}>
                                                                    <button onClick={() => removeProject(i)}
                                                                        className="absolute top-3 right-3 p-1 rounded-lg border-none cursor-pointer"
                                                                        style={{ background: 'rgba(239,68,68,0.08)', color: '#EF4444' }}>
                                                                        <TrashIcon />
                                                                    </button>
                                                                    <InputField label="URL *" value={p.url}
                                                                        onChange={v => updateProject(i, 'url', v)}
                                                                        placeholder="https://github.com/you/project" />
                                                                    <InputField label="Title" value={p.title}
                                                                        onChange={v => updateProject(i, 'title', v)}
                                                                        placeholder="e.g. My Awesome App" />
                                                                    <div>
                                                                        <label className="text-[10px] uppercase tracking-widest font-semibold block mb-1.5" style={{ color: 'var(--theme-text-muted)' }}>Description</label>
                                                                        <textarea value={p.description}
                                                                            onChange={e => updateProject(i, 'description', e.target.value)}
                                                                            rows={2}
                                                                            placeholder="Brief description of the project..."
                                                                            className="w-full px-3.5 py-2.5 rounded-xl text-[13px] outline-none resize-none focus:ring-2 focus:ring-[#3CF91A]/20"
                                                                            style={{ background: 'var(--theme-input-bg)', border: '1px solid var(--theme-border)', color: 'var(--theme-text-primary)' }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Save button */}
                                                <div className="pt-4 border-t border-[var(--theme-border-light)] flex justify-end">
                                                    <button onClick={saveProfile} disabled={savingProfile}
                                                        className="px-6 py-2.5 rounded-xl text-[12px] font-bold text-black border-none cursor-pointer transition-all hover:scale-105 disabled:opacity-60"
                                                        style={{ background: '#3CF91A', boxShadow: savingProfile ? 'none' : '0 4px 15px rgba(60,249,26,0.3)' }}>
                                                        {savingProfile ? "Saving..." : "Save Profile"}
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
                                    <Section title="Security & Privacy" desc="Protect your SkillSpill account">
                                        {/* Password */}
                                        <div className="rounded-xl p-4 space-y-3" style={{ background: 'var(--theme-bg)', border: '1px solid var(--theme-border)' }}>
                                            <h3 className="text-[13px] font-semibold" style={{ color: 'var(--theme-text-primary)' }}>Change Password</h3>
                                            <InputField label="" value="" onChange={() => { }} type="password" placeholder="Current password" />
                                            <InputField label="" value="" onChange={() => { }} type="password" placeholder="New password" />
                                            <InputField label="" value="" onChange={() => { }} type="password" placeholder="Confirm new password" />
                                            <button
                                                className="px-4 py-2 rounded-xl text-[11px] font-bold text-black border-none cursor-pointer hover:shadow-md transition-all"
                                                style={{ background: '#3CF91A' }}
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
                                        <button
                                            onClick={() => setShowDeleteModal(true)}
                                            disabled={isDeletingAccount}
                                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-bold text-red-500 cursor-pointer transition-all hover:shadow-md border-none disabled:opacity-50"
                                            style={{ background: 'rgba(239, 68, 68, 0.1)' }}
                                        >
                                            <TrashIcon />
                                            {isDeletingAccount ? "Deleting..." : "Delete Account"}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/*  Privacy  */}
                            {activeTab === "privacy" && (
                                <div className="p-6 space-y-6">
                                    <Section title="Privacy & Visibility" desc="Manage what companies can see on your public profile">

                                        <div>
                                            <h3 className="text-[11px] uppercase tracking-widest font-semibold mb-2 mt-4" style={{ color: 'var(--theme-text-muted)' }}>Contact Information</h3>
                                            <div className="space-y-4 mb-6">
                                                <InputField label="Public Contact Email" value={contactEmail} onChange={setContactEmail} type="email" placeholder="e.g. hello@myportfolio.com" />
                                                <ToggleRow label="Show Email on Profile" desc="Allow companies to see your contact email in your profile overview" enabled={showEmail} onToggle={() => setShowEmail(!showEmail)} />

                                                <InputField label="Public Contact Phone" value={contactPhone} onChange={setContactPhone} type="tel" placeholder="e.g. +1 234 567 8900" />
                                                <ToggleRow label="Show Phone on Profile" desc="Allow companies to see your phone number" enabled={showPhone} onToggle={() => setShowPhone(!showPhone)} />
                                            </div>

                                            <h3 className="text-[11px] uppercase tracking-widest font-semibold mb-2 mt-6" style={{ color: 'var(--theme-text-muted)' }}>Social Links</h3>
                                            <ToggleRow label="Show Social & Project Links" desc="Display links like GitHub, LinkedIn, and Portfolio on your profile" enabled={showSocials} onToggle={() => setShowSocials(!showSocials)} />
                                        </div>

                                        <div className="pt-4 mt-6 border-t border-[var(--theme-border-light)] flex justify-end">
                                            <button
                                                onClick={savePrivacySettings}
                                                disabled={isSavingPrivacy}
                                                className="px-6 py-2.5 rounded-xl text-[12px] font-bold text-black border-none cursor-pointer transition-all hover:scale-105"
                                                style={{ background: '#3CF91A', opacity: isSavingPrivacy ? 0.7 : 1 }}
                                            >
                                                {isSavingPrivacy ? "Saving..." : "Save Privacy Settings"}
                                            </button>
                                        </div>
                                    </Section>
                                </div>
                            )}

                            {/*  Experience  */}
                            {activeTab === "experience" && (
                                <div className="p-6 space-y-6">
                                    <Section title="Work Experience" desc="Your career history — shown on your profile just like LinkedIn">

                                        {/* Add button */}
                                        {!showExpForm && (
                                            <button onClick={openAddForm}
                                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-bold text-black border-none cursor-pointer transition-all hover:scale-105"
                                                style={{ background: '#3CF91A', boxShadow: '0 4px 15px rgba(60,249,26,0.3)' }}>
                                                + Add Experience
                                            </button>
                                        )}

                                        {/* Inline Add/Edit form */}
                                        {showExpForm && (
                                            <div className="rounded-2xl p-5 space-y-4 border" style={{ background: 'var(--theme-bg)', borderColor: 'var(--theme-border)' }}>
                                                <h3 className="text-[13px] font-bold" style={{ color: 'var(--theme-text-primary)' }}>
                                                    {editingExp ? "Edit Experience" : "Add Experience"}
                                                </h3>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <InputField label="Company Name" value={expForm.companyName}
                                                        onChange={v => setExpForm(f => ({ ...f, companyName: v }))}
                                                        placeholder="e.g. NastecSol" />
                                                    <InputField label="Your Role / Title" value={expForm.role}
                                                        onChange={v => setExpForm(f => ({ ...f, role: v }))}
                                                        placeholder="e.g. CEO, HR Manager, SWE" />
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <InputField label="Start Date" value={expForm.startDate} type="date"
                                                        onChange={v => setExpForm(f => ({ ...f, startDate: v }))} />
                                                    {!expForm.isCurrent && (
                                                        <InputField label="End Date" value={expForm.endDate} type="date"
                                                            onChange={v => setExpForm(f => ({ ...f, endDate: v }))} />
                                                    )}
                                                </div>
                                                {/* isCurrent toggle */}
                                                <div className="flex items-center gap-3">
                                                    <Toggle enabled={expForm.isCurrent}
                                                        onToggle={() => setExpForm(f => ({ ...f, isCurrent: !f.isCurrent, endDate: "" }))} />
                                                    <span className="text-[12px] font-medium" style={{ color: 'var(--theme-text-secondary)' }}>
                                                        I currently work here
                                                    </span>
                                                </div>
                                                {/* Description */}
                                                <div>
                                                    <label className="text-[10px] uppercase tracking-widest font-semibold block mb-1.5" style={{ color: 'var(--theme-text-muted)' }}>
                                                        Description (optional)
                                                    </label>
                                                    <textarea
                                                        value={expForm.description}
                                                        onChange={e => setExpForm(f => ({ ...f, description: e.target.value }))}
                                                        rows={3}
                                                        placeholder="Briefly describe your role and key achievements..."
                                                        className="w-full px-3.5 py-2.5 rounded-xl text-[13px] outline-none resize-none focus:ring-2 focus:ring-[#3CF91A]/20"
                                                        style={{ background: 'var(--theme-input-bg)', border: '1px solid var(--theme-border)', color: 'var(--theme-text-primary)' }}
                                                    />
                                                </div>
                                                <div className="flex gap-3 pt-1">
                                                    <button onClick={saveExperience} disabled={savingExp || !expForm.companyName || !expForm.role || !expForm.startDate}
                                                        className="px-5 py-2.5 rounded-xl text-[12px] font-bold text-black border-none cursor-pointer transition-all hover:scale-105 disabled:opacity-50"
                                                        style={{ background: '#3CF91A' }}>
                                                        {savingExp ? "Saving..." : editingExp ? "Save Changes" : "Add"}
                                                    </button>
                                                    <button onClick={() => setShowExpForm(false)}
                                                        className="px-5 py-2.5 rounded-xl text-[12px] font-medium border-none cursor-pointer transition-all hover:opacity-80"
                                                        style={{ background: 'var(--theme-input-bg)', color: 'var(--theme-text-muted)', border: '1px solid var(--theme-border)' }}>
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Experience list */}
                                        {loadingExp ? (
                                            <div className="text-center py-8 text-[12px]" style={{ color: 'var(--theme-text-muted)' }}>Loading...</div>
                                        ) : experiences.length === 0 ? (
                                            <div className="rounded-2xl border border-dashed p-8 text-center" style={{ borderColor: 'var(--theme-border)' }}>
                                                <p className="text-[13px] font-medium" style={{ color: 'var(--theme-text-muted)' }}>No work experience added yet.</p>
                                                <p className="text-[11px] mt-1" style={{ color: 'var(--theme-text-muted)' }}>Add your current and past roles — they'll appear on your profile.</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {experiences.map((exp) => (
                                                    <div key={exp.id} className="rounded-2xl border p-4 flex gap-4 group transition-all"
                                                        style={{ background: 'var(--theme-bg)', borderColor: 'var(--theme-border)' }}
                                                        onMouseEnter={e => (e.currentTarget.style.borderColor = '#3CF91A33')}
                                                        onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--theme-border)')}>
                                                        {/* Company initial badge */}
                                                        <div className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center text-[13px] font-bold text-white bg-gradient-to-br from-[#3CF91A] to-[#00C853]" style={{ color: '#000' }}>
                                                            {exp.companyName[0].toUpperCase()}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-start justify-between gap-2">
                                                                <div>
                                                                    <p className="text-[13px] font-bold" style={{ color: 'var(--theme-text-primary)' }}>{exp.role}</p>
                                                                    <p className="text-[12px] font-medium" style={{ color: 'var(--theme-text-secondary)' }}>{exp.companyName}</p>
                                                                    <p className="text-[10px] mt-0.5" style={{ color: 'var(--theme-text-muted)' }}>{formatDateRange(exp)}</p>
                                                                </div>
                                                                <div className="flex gap-1.5 shrink-0">
                                                                    {exp.isCurrent && (
                                                                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                                                                            style={{ background: '#3CF91A15', color: '#3CF91A', border: '1px solid #3CF91A30' }}>
                                                                            Current
                                                                        </span>
                                                                    )}
                                                                    <button onClick={() => openEditForm(exp)} title="Edit"
                                                                        className="p-1.5 rounded-lg border-none cursor-pointer text-[10px] transition-all hover:opacity-80"
                                                                        style={{ background: 'var(--theme-input-bg)', color: 'var(--theme-text-muted)' }}>
                                                                        ✏️
                                                                    </button>
                                                                    <button onClick={() => deleteExperience(exp.id)} title="Remove"
                                                                        className="p-1.5 rounded-lg border-none cursor-pointer transition-all hover:opacity-80"
                                                                        style={{ background: 'rgba(239,68,68,0.08)', color: '#EF4444' }}>
                                                                        <TrashIcon />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            {exp.description && (
                                                                <p className="text-[11px] mt-2 leading-relaxed" style={{ color: 'var(--theme-text-muted)' }}>{exp.description}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </Section>
                                </div>
                            )}


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

                            {/*  Connections  */}
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
                                                        <p className="text-[11px]" style={{ color: githubConnected ? '#3CF91A' : 'var(--theme-text-muted)' }}>
                                                            {githubConnected ? `Connected as ${profileForm.githubUsername}` : "Not connected"}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={githubConnected ? disconnectGithub : connectGithub}
                                                    disabled={githubConnecting}
                                                    className="px-4 py-2 rounded-xl text-[11px] font-bold cursor-pointer transition-all border-none disabled:opacity-50"
                                                    style={githubConnected
                                                        ? { background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }
                                                        : { background: '#3CF91A', color: '#000', boxShadow: '0 4px 15px rgba(60, 249, 26, 0.3)' }
                                                    }
                                                >
                                                    {githubConnecting ? "Wait..." : githubConnected ? "Disconnect" : "Connect"}
                                                </button>
                                            </div>
                                            {!githubConnected && (
                                                <div className="flex items-center gap-2 mt-2 ml-1">
                                                    <input
                                                        type="checkbox"
                                                        id="sharePrivate"
                                                        checked={sharePrivateRepos}
                                                        onChange={(e) => setSharePrivateRepos(e.target.checked)}
                                                        className="w-4 h-4 rounded border-[var(--theme-border)] bg-[var(--theme-input-bg)] text-[#3CF91A] focus:ring-[#3CF91A]/20 cursor-pointer"
                                                    />
                                                    <label htmlFor="sharePrivate" className="text-[12px] text-[var(--theme-text-secondary)] cursor-pointer select-none">
                                                        Share private repositories for evaluation
                                                    </label>
                                                </div>
                                            )}
                                            {githubConnected && (
                                                <p className="text-[11px] ml-2 mt-1" style={{ color: 'var(--theme-text-muted)' }}>
                                                    Private repos are currently {sharePrivateRepos ? "shared" : "hidden"}. To change this, disconnect and reconnect.
                                                </p>
                                            )}

                                            {/* LinkedIn */}
                                            <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'var(--theme-bg)', border: '1px solid var(--theme-border)' }}>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-[#0A66C2]/10 flex items-center justify-center">
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="#0A66C2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                                                    </div>
                                                    <div>
                                                        <p className="text-[13px] font-semibold" style={{ color: 'var(--theme-text-primary)' }}>LinkedIn</p>
                                                        <p className="text-[11px]" style={{ color: linkedinConnected ? '#3CF91A' : 'var(--theme-text-muted)' }}>
                                                            {linkedinConnected ? " Connected" : "Not connected"}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => setLinkedinConnected(!linkedinConnected)}
                                                    className="px-4 py-2 rounded-xl text-[11px] font-bold cursor-pointer transition-all border-none"
                                                    style={linkedinConnected
                                                        ? { background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }
                                                        : { background: '#3CF91A', color: '#000', boxShadow: '0 4px 15px rgba(60, 249, 26, 0.3)' }
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
                                                    className="px-4 py-2 rounded-xl text-[11px] font-bold cursor-pointer transition-all border-none text-black"
                                                    style={{ background: '#3CF91A', boxShadow: '0 4px 15px rgba(60, 249, 26, 0.3)' }}
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

            {/* Delete Account Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isDeletingAccount && setShowDeleteModal(false)}></div>
                    <div className="relative bg-[var(--theme-card)] border border-[var(--theme-border)] rounded-2xl p-6 max-w-sm w-full shadow-2xl min-h-[50px] animate-in fade-in zoom-in-95 duration-200">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }}>
                            <TrashIcon />
                        </div>
                        <h3 className="text-lg font-bold text-center mb-2" style={{ color: 'var(--theme-text-primary)' }}>Delete Account?</h3>
                        <p className="text-sm text-center mb-6 leading-relaxed" style={{ color: 'var(--theme-text-muted)' }}>
                            Are you absolutely sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                disabled={isDeletingAccount}
                                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold border cursor-pointer hover:opacity-80 transition-all disabled:opacity-50"
                                style={{ borderColor: 'var(--theme-border)', background: 'var(--theme-bg)', color: 'var(--theme-text-secondary)' }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDeleteAccount}
                                disabled={isDeletingAccount}
                                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-white border-none cursor-pointer hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center"
                                style={{ background: '#EF4444' }}
                            >
                                {isDeletingAccount ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
