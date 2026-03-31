"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
    Sparkles, CheckCircle, Github, Linkedin, Briefcase, FileText,
    Loader2, Link as LinkIcon, Phone, Mail, Heart, MessageSquare,
    Eye, Share2, Zap, ExternalLink, Star, Camera, Upload, Trash, X, Pencil, Shield, Plus, Lock, HeartOff, Video, Code2, MessageSquareOff
} from "lucide-react";
import { compressImageClient } from "@/lib/client-compress";
import PostComposer from "@/app/feed/components/PostComposer";
import PostCard from "@/app/feed/components/PostCard";
import { CoverBanner, CoverBannerSelector } from "@/app/components/CoverBanners";

const accent = "#3CF91A";

/* ─── Shared Spill Grid Tile (Instagram Style) ─── */
function SpillGridTile({ spill, accent, avatarUrl, initials, username, onClick }: any) {
    const mediaArray = spill.media || [];
    const hasImage = mediaArray.length > 0;
    const hasVideo = !hasImage && !!spill.videoUrl;
    const hasCode = !hasImage && !hasVideo && !!spill.code;
    const isText = !hasImage && !hasVideo && !hasCode;
    
    return (
        <div 
            onClick={() => onClick?.(spill)}
            className="relative aspect-square bg-[#1a1a1a] overflow-hidden group cursor-pointer border border-[var(--theme-border)]">
            {/* If it's an image */}
            {hasImage && (
                <img src={mediaArray[0].url} alt="Post preview" className="w-full h-full object-cover" />
            )}
            
            {/* If it's a video */}
            {hasVideo && (
                <div className="w-full h-full bg-black flex items-center justify-center relative">
                    <video src={spill.videoUrl} className="w-full h-full object-cover opacity-80" muted playsInline />
                    <div className="absolute top-2 right-2 p-1 rounded-full bg-black/50 backdrop-blur-sm">
                        <Video size={12} color="white" />
                    </div>
                </div>
            )}

            {/* If it's code */}
            {hasCode && (
                <div className="w-full h-full bg-[#0D1117] p-2 flex flex-col items-center justify-center text-center">
                    <Code2 size={24} className="mb-2" style={{ color: "var(--theme-text-muted)" }} />
                    <p className="text-[10px] font-mono text-[var(--theme-text-muted)] truncate max-w-full px-2">
                        {spill.codeLang || "code"}
                    </p>
                </div>
            )}

            {/* If it's purely text or hashtags */}
            {isText && (
                <div className="w-full h-full p-3 flex flex-col justify-center bg-[var(--theme-card)] text-center">
                    <p className="text-[11px] text-[var(--theme-text-primary)] line-clamp-3 leading-snug items-center justify-center break-words">
                        {spill.caption || (spill.hashtags && spill.hashtags.length > 0 ? `#${spill.hashtags[0]}` : "Text post")}
                    </p>
                </div>
            )}

            {/* Hover Overlay with Likes & Comments */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white">
                <div className="flex items-center gap-1.5 font-bold text-[13px]">
                    {spill.hideLikes ? <HeartOff size={16} fill="currentColor" /> : <Heart size={16} fill="currentColor" />}
                    <span>{spill.hideLikes ? "-" : (spill.likes || 0)}</span>
                </div>
                <div className="flex items-center gap-1.5 font-bold text-[13px]">
                    {spill.commentsOff ? <MessageSquareOff size={16} fill="currentColor" /> : <MessageSquare size={16} fill="currentColor" />}
                    <span>{spill.commentsOff ? "-" : (spill.comments || 0)}</span>
                </div>
            </div>
        </div>
    );
}

/* ─── Styled input for the modal ─── */
function Field({
    label, value, onChange, type = "text", placeholder, textarea = false, icon,
}: {
    label: string; value: string; onChange: (v: string) => void;
    type?: string; placeholder?: string; textarea?: boolean; icon?: React.ReactNode;
}) {
    return (
        <div>
            <label className="text-[10px] uppercase tracking-widest font-semibold mb-1.5 flex items-center gap-1.5"
                style={{ color: "var(--theme-text-muted)" }}>
                {icon && <span style={{ color: "#3CF91A" }}>{icon}</span>}
                {label}
            </label>
            {textarea
                ? <textarea value={value} onChange={e => onChange(e.target.value)}
                    placeholder={placeholder} rows={3}
                    className="w-full px-3.5 py-2.5 rounded-xl text-[13px] outline-none transition-all resize-none"
                    style={{
                        background: "var(--theme-input-bg)",
                        border: "1px solid var(--theme-border)",
                        color: "var(--theme-text-primary)",
                        boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
                    }}
                    onFocus={e => e.currentTarget.style.boxShadow = "0 0 0 2px rgba(60,249,26,0.15), inset 0 1px 3px rgba(0,0,0,0.1)"}
                    onBlur={e => e.currentTarget.style.boxShadow = "inset 0 1px 3px rgba(0,0,0,0.1)"} />
                : <input type={type} value={value} onChange={e => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full px-3.5 py-2.5 rounded-xl text-[13px] outline-none transition-all"
                    style={{
                        background: "var(--theme-input-bg)",
                        border: "1px solid var(--theme-border)",
                        color: "var(--theme-text-primary)",
                        boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
                    }}
                    onFocus={e => e.currentTarget.style.boxShadow = "0 0 0 2px rgba(60,249,26,0.15), inset 0 1px 3px rgba(0,0,0,0.1)"}
                    onBlur={e => e.currentTarget.style.boxShadow = "inset 0 1px 3px rgba(0,0,0,0.1)"} />}
        </div>
    );
}

/* ─── Custom toggle switch ─── */
function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
    return (
        <label className="flex items-center gap-2.5 cursor-pointer group">
            <div
                onClick={() => onChange(!checked)}
                className="relative w-9 h-5 rounded-full transition-all duration-200"
                style={{
                    background: checked ? "linear-gradient(135deg, #3CF91A, #10B981)" : "var(--theme-input-bg)",
                    border: checked ? "1px solid #3CF91A40" : "1px solid var(--theme-border)",
                    boxShadow: checked ? "0 0 8px rgba(60,249,26,0.3)" : "none",
                }}>
                <div
                    className="absolute top-0.5 w-4 h-4 rounded-full transition-all duration-200 shadow-sm"
                    style={{
                        left: checked ? "17px" : "2px",
                        background: checked ? "#fff" : "var(--theme-text-muted)",
                    }} />
            </div>
            <span className="text-[11px] font-medium text-[var(--theme-text-secondary)] group-hover:text-[var(--theme-text-primary)] transition-colors">{label}</span>
        </label>
    );
}

export default function TalentProfilePage() {
    const [userData, setUserData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [githubData, setGithubData] = useState<any>(null);
    const [isLoadingGithub, setIsLoadingGithub] = useState(false);
    const [activeTab, setActiveTab] = useState("Spills");
    const tabs = ["Spills", "Experience", "Projects", "GitHub", "Skills"];
    const [composerOpen, setComposerOpen] = useState(false);
    const [selectedSpill, setSelectedSpill] = useState<any>(null);
    
    const [showAvatarMenu, setShowAvatarMenu] = useState(false);
    const [avatarUploading, setAvatarUploading] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [toastMessage, setToastMessage] = useState<{ type: "success" | "error", text: string } | null>(null);

    /* ── Cover edit ── */
    const [showCoverMenu, setShowCoverMenu] = useState(false);
    const [selectedCoverId, setSelectedCoverId] = useState("2");
    const [coverSaving, setCoverSaving] = useState(false);

    /* ── Edit modal ── */
    const [showEdit, setShowEdit] = useState(false);
    const [form, setForm] = useState({
        fullName: "", bio: "", experienceLevel: "",
        contactEmail: "", contactPhone: "",
        linkedinUrl: "", portfolioUrl: "",
        showEmail: false, showPhone: false, showSocials: true,
        isAvailable: true,
    });
    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const [editTab, setEditTab] = useState<"basic" | "contact" | "privacy">("basic");

    const showToast = (type: "success" | "error", text: string) => {
        setToastMessage({ type, text });
        setTimeout(() => setToastMessage(null), 4000);
    };

    useEffect(() => {
        fetch("/api/user/profile")
            .then(r => r.json())
            .then(d => {
                if (d.user) {
                    // API returns 'spillPosts', normalise to 'spills'
                    const user = { ...d.user, spills: d.user.spillPosts ?? d.user.spills ?? [] };
                    setUserData(user);
                    setSelectedCoverId(user.coverUrl || "1");
                    const tp = user.talentProfile || {};
                    setForm({
                        fullName: user.fullName || "",
                        bio: tp.bio || "",
                        experienceLevel: tp.experienceLevel || "",
                        contactEmail: tp.contactEmail || "",
                        contactPhone: tp.contactPhone || "",
                        linkedinUrl: tp.linkedinUrl || "",
                        portfolioUrl: tp.portfolioUrl || "",
                        showEmail: tp.showEmail ?? false,
                        showPhone: tp.showPhone ?? false,
                        showSocials: tp.showSocials ?? true,
                        isAvailable: tp.isAvailable ?? true,
                    });
                }
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        if (userData?.talentProfile?.githubConnected) {
            setIsLoadingGithub(true);
            fetch("/api/user/github").then(r => r.json()).then(d => {
                if (!d.error) setGithubData(d);
                setIsLoadingGithub(false);
            }).catch(() => setIsLoadingGithub(false));
        }
    }, [userData]);

    /* Close modal on backdrop click */
    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === overlayRef.current) setShowEdit(false);
    };

    /* Save profile via modal */
    const handleProfileSave = async () => {
        setSaving(true);
        setSaveMsg(null);
        try {
            const res = await fetch("/api/user/profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fullName: form.fullName,
                    talentProfile: {
                        bio: form.bio || null,
                        experienceLevel: form.experienceLevel || null,
                        contactEmail: form.contactEmail || null,
                        contactPhone: form.contactPhone || null,
                        linkedinUrl: form.linkedinUrl || null,
                        portfolioUrl: form.portfolioUrl || null,
                        showEmail: form.showEmail,
                        showPhone: form.showPhone,
                        showSocials: form.showSocials,
                        isAvailable: form.isAvailable,
                    },
                }),
            });
            const data = await res.json();
            setSaving(false);
            if (res.ok && data.success) {
                setSaveMsg({ type: "ok", text: "Profile updated!" });
                setUserData((prev: any) => ({
                    ...prev,
                    fullName: form.fullName,
                    talentProfile: {
                        ...prev.talentProfile,
                        bio: form.bio,
                        experienceLevel: form.experienceLevel,
                        contactEmail: form.contactEmail,
                        contactPhone: form.contactPhone,
                        linkedinUrl: form.linkedinUrl,
                        portfolioUrl: form.portfolioUrl,
                        showEmail: form.showEmail,
                        showPhone: form.showPhone,
                        showSocials: form.showSocials,
                        isAvailable: form.isAvailable,
                    },
                }));
                setTimeout(() => { setSaveMsg(null); setShowEdit(false); }, 1200);
            } else {
                setSaveMsg({ type: "err", text: data.error || "Failed to save. Try again." });
            }
        } catch {
            setSaving(false);
            setSaveMsg({ type: "err", text: "Network error. Try again." });
        }
    };

    /* Avatar Handlers */
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setAvatarUploading(true);
            const processedFile = await compressImageClient(file);
            const fd = new FormData();
            fd.append("file", processedFile);
            fd.append("category", "avatars");
            fd.append("folder", "avatars");
            
            const res = await fetch("/api/upload", { method: "POST", body: fd });
            const data = await res.json();
            
            if (res.ok && data.url) {
                // Save URL in DB
                await fetch("/api/user/profile", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ avatarUrl: data.url })
                });
                setUserData((prev: any) => ({ ...prev, avatarUrl: data.url }));
                showToast("success", "Profile picture updated!");
            } else {
                showToast("error", data.error || "Upload failed");
            }
        } catch (error) {
            console.error("Avatar upload failed:", error);
            showToast("error", "Upload failed. Check console for details.");
        } finally {
            setAvatarUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleRemoveAvatar = async () => {
        if (!userData?.avatarUrl) return;
        setAvatarUploading(true);
        try {
            await fetch("/api/user/profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ avatarUrl: "" })
            });
            setUserData((prev: any) => ({ ...prev, avatarUrl: "" }));
            showToast("success", "Profile picture removed!");
        } catch (err) {
            console.error("Failed to remove avatar", err);
            showToast("error", "Failed to remove avatar");
        } finally {
            setAvatarUploading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-full p-20">
                <Loader2 className="w-10 h-10 animate-spin mb-4" style={{ color: accent }} />
                <p className="text-[13px] text-[var(--theme-text-muted)] font-medium">Loading your profile...</p>
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-full p-20">
                <h3 className="text-lg font-bold text-red-400 mb-2">Profile Not Found</h3>
                <p className="text-[13px] text-[var(--theme-text-muted)]">Could not load your profile data.</p>
            </div>
        );
    }

    const { fullName, username, email, spills, avatarUrl } = userData;
    const {
        bio, experienceLevel, isAvailable, skills, projectLinks, workExperience,
        githubUsername, githubConnected, githubRepos, githubStars,
        linkedinUrl, portfolioUrl, resumeUrl,
        contactEmail, contactPhone, showEmail, showPhone, showSocials,
    } = userData.talentProfile || {};

    const initials = fullName
        ? fullName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
        : "??";

    const currentJob = workExperience?.find((w: any) => w.isCurrent);
    const displayRole = currentJob
        ? `${currentJob.role} at ${currentJob.companyName}`
        : null;

    const fmtDate = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", year: "numeric" });

    return (
        <div style={{ background: "var(--theme-bg)" }} className="min-h-full">
            {toastMessage && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-5 fade-in duration-300">
                    <div className={`px-4 py-3 rounded-xl shadow-2xl border flex items-center gap-3 ${
                        toastMessage.type === "success" 
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500" 
                            : "bg-red-500/10 border-red-500/30 text-red-500"
                    }`} style={{ backdropFilter: "blur(12px)" }}>
                        {toastMessage.type === "success" ? <CheckCircle className="w-5 h-5" /> : <X className="w-5 h-5" />}
                        <p className="text-sm font-semibold">{toastMessage.text}</p>
                    </div>
                </div>
            )}

            {/* ══ EDIT PROFILE MODAL ══ */}
            {showEdit && (
                <div
                    ref={overlayRef}
                    onClick={handleOverlayClick}
                    className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-300"
                    style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(12px)" }}>
                    <div
                        className="w-full max-w-4xl rounded-2xl overflow-hidden relative flex flex-col sm:flex-row max-h-[85vh] sm:min-h-[600px] shadow-2xl animate-in zoom-in-95 duration-300"
                        style={{
                            background: "var(--theme-card)",
                            border: `1px solid ${accent}30`,
                            boxShadow: `0 0 40px ${accent}15, 0 30px 60px rgba(0,0,0,0.5)`,
                        }}>
                        
                        {/* ── Close Button (Mobile Absolute) ── */}
                        <button onClick={() => setShowEdit(false)}
                            className="absolute top-4 right-4 sm:hidden p-2 rounded-xl z-50 text-[var(--theme-text-muted)] bg-[var(--theme-bg-secondary)] border border-[var(--theme-border)]">
                            <X className="w-4 h-4" />
                        </button>

                        {/* ── Sidebar Navigation ── */}
                        <div className="w-full sm:w-1/3 border-b sm:border-b-0 sm:border-r border-[var(--theme-border)] bg-[var(--theme-bg)]/50 p-6 flex flex-col relative overflow-hidden">
                            {/* Decorative gradient orb */}
                            <div className="absolute -top-32 -left-32 w-64 h-64 rounded-full pointer-events-none blur-[80px] opacity-40"
                                style={{ background: accent }} />
                            
                            <div className="flex items-center gap-3 mb-8 relative z-10">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg"
                                    style={{ background: `linear-gradient(135deg, ${accent}20, ${accent}10)`, border: `1px solid ${accent}30` }}>
                                    <Pencil className="w-5 h-5" style={{ color: accent }} />
                                </div>
                                <div className="hidden sm:block">
                                    <h2 className="text-[16px] font-bold text-[var(--theme-text-primary)] tracking-wide">Edit Profile</h2>
                                    <p className="text-[11px] text-[var(--theme-text-muted)] font-medium mt-0.5">Customize your appearance</p>
                                </div>
                            </div>

                            <nav className="flex flex-wrap sm:flex-col gap-2 relative z-10 w-full mb-1 sm:mb-0">
                                <button onClick={() => setEditTab("basic")}
                                    className={`flex-1 min-w-[90px] sm:flex-none flex flex-col sm:flex-row items-center sm:justify-start gap-1.5 sm:gap-3 px-2 sm:px-4 py-2 sm:py-3 rounded-xl text-[10px] sm:text-[13px] font-semibold transition-all cursor-pointer border text-center sm:text-left ${
                                        editTab === "basic" 
                                        ? "bg-black/20 text-white" 
                                        : "bg-transparent border-transparent text-[var(--theme-text-muted)] hover:bg-[var(--theme-bg-secondary)] hover:text-[var(--theme-text-primary)]"
                                    }`}
                                    style={editTab === "basic" ? { borderColor: `${accent}40`, boxShadow: `inset 0 0 20px ${accent}10` } : {}}>
                                    <Sparkles className="w-4 h-4 shrink-0" style={{ color: editTab === "basic" ? accent : "inherit" }} />
                                    Basic Info
                                </button>
                                <button onClick={() => setEditTab("contact")}
                                    className={`flex-1 min-w-[90px] sm:flex-none flex flex-col sm:flex-row items-center sm:justify-start gap-1.5 sm:gap-3 px-2 sm:px-4 py-2 sm:py-3 rounded-xl text-[10px] sm:text-[13px] font-semibold transition-all cursor-pointer border text-center sm:text-left ${
                                        editTab === "contact" 
                                        ? "bg-black/20 text-white" 
                                        : "bg-transparent border-transparent text-[var(--theme-text-muted)] hover:bg-[var(--theme-bg-secondary)] hover:text-[var(--theme-text-primary)]"
                                    }`}
                                    style={editTab === "contact" ? { borderColor: `${accent}40`, boxShadow: `inset 0 0 20px ${accent}10` } : {}}>
                                    <Mail className="w-4 h-4 shrink-0" style={{ color: editTab === "contact" ? accent : "inherit" }} />
                                    Contact
                                </button>
                                <button onClick={() => setEditTab("privacy")}
                                    className={`flex-1 min-w-[90px] sm:flex-none flex flex-col sm:flex-row items-center sm:justify-start gap-1.5 sm:gap-3 px-2 sm:px-4 py-2 sm:py-3 rounded-xl text-[10px] sm:text-[13px] font-semibold transition-all cursor-pointer border text-center sm:text-left ${
                                        editTab === "privacy" 
                                        ? "bg-black/20 text-white" 
                                        : "bg-transparent border-transparent text-[var(--theme-text-muted)] hover:bg-[var(--theme-bg-secondary)] hover:text-[var(--theme-text-primary)]"
                                    }`}
                                    style={editTab === "privacy" ? { borderColor: `${accent}40`, boxShadow: `inset 0 0 20px ${accent}10` } : {}}>
                                    <Eye className="w-4 h-4 shrink-0" style={{ color: editTab === "privacy" ? accent : "inherit" }} />
                                    Visibility
                                </button>
                            </nav>

                            <div className="mt-auto hidden sm:block relative z-10">
                                <div className="p-4 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-bg-secondary)]">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Shield className="w-4 h-4" style={{ color: accent }} />
                                        <p className="text-[11px] font-bold text-[var(--theme-text-primary)]">Profile Tips</p>
                                    </div>
                                    <p className="text-[10px] text-[var(--theme-text-muted)] leading-relaxed">
                                        Keep your links updated and write a compelling bio to attract more opportunities. Check the Privacy tab to manage what others see.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* ── Main Content Area ── */}
                        <div className="w-full sm:w-2/3 flex flex-col h-full bg-[var(--theme-bg)] relative">
                            
                            {/* Header (Desktop) */}
                            <div className="hidden sm:flex items-center justify-between px-8 py-5 border-b border-[var(--theme-border)]">
                                <p className="text-[13px] text-[var(--theme-text-muted)] font-mono flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: accent }} />
                                    {editTab === "basic" ? "Editing Basic Information" : editTab === "contact" ? "Editing Contact Details" : "Adjusting Visibility"}
                                </p>
                                <button onClick={() => setShowEdit(false)}
                                    className="p-2 rounded-xl border cursor-pointer transition-all hover:scale-110 hover:rotate-90 duration-200"
                                    style={{ background: "var(--theme-bg-secondary)", borderColor: "var(--theme-border)", color: "var(--theme-text-muted)" }}>
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Scrollable Form Content */}
                            <div className="p-6 sm:p-8 overflow-y-auto flex-1 custom-scrollbar">
                                {saveMsg && (
                                    <div className="rounded-xl px-4 py-3 text-[12px] font-semibold flex items-center gap-2 mb-6"
                                        style={{
                                            background: saveMsg.type === "ok" ? `${accent}08` : "rgba(239,68,68,0.06)",
                                            border: `1px solid ${saveMsg.type === "ok" ? `${accent}30` : "rgba(239,68,68,0.2)"}`,
                                            color: saveMsg.type === "ok" ? accent : "#EF4444",
                                        }}>
                                        {saveMsg.type === "ok" ? <CheckCircle className="w-4 h-4 shrink-0" /> : <X className="w-4 h-4 shrink-0" />}
                                        {saveMsg.text}
                                    </div>
                                )}

                                {editTab === "basic" && (
                                    <div className="space-y-5 animate-in slide-in-from-right-4 fade-in duration-300">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <div className="sm:col-span-2">
                                                <Field label="Full Name *" value={form.fullName}
                                                    onChange={v => setForm(f => ({ ...f, fullName: v }))}
                                                    placeholder="e.g. John Doe" />
                                            </div>
                                            <div className="sm:col-span-2">
                                                <Field label="Bio" value={form.bio}
                                                    onChange={v => setForm(f => ({ ...f, bio: v }))}
                                                    placeholder="Tell us about yourself, your skills, and what you're looking for..."
                                                    textarea />
                                            </div>
                                            <div>
                                                <label className="text-[10px] uppercase tracking-widest font-semibold mb-1.5 flex items-center gap-1.5"
                                                    style={{ color: "var(--theme-text-muted)" }}>
                                                    <Zap className="w-3 h-3" style={{ color: accent }} />
                                                    Experience Level
                                                </label>
                                                <select value={form.experienceLevel}
                                                    onChange={e => setForm(f => ({ ...f, experienceLevel: e.target.value }))}
                                                    className="w-full px-3.5 py-2.5 rounded-xl text-[13px] outline-none transition-all cursor-pointer"
                                                    style={{ background: "var(--theme-input-bg)", border: "1px solid var(--theme-border)", color: "var(--theme-text-primary)", boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)" }}>
                                                    <option value="">Select...</option>
                                                    <option value="JUNIOR">Junior</option>
                                                    <option value="MID">Mid-Level</option>
                                                    <option value="SENIOR">Senior</option>
                                                    <option value="LEAD">Lead</option>
                                                    <option value="PRINCIPAL">Principal</option>
                                                </select>
                                            </div>
                                            <div className="flex items-center justify-center sm:justify-start pt-5 sm:pt-6">
                                                <Toggle checked={form.isAvailable}
                                                    onChange={v => setForm(f => ({ ...f, isAvailable: v }))}
                                                    label="Open to Work" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {editTab === "contact" && (
                                    <div className="space-y-5 animate-in slide-in-from-right-4 fade-in duration-300">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <Field label="Contact Email" value={form.contactEmail}
                                                onChange={v => setForm(f => ({ ...f, contactEmail: v }))}
                                                placeholder="you@example.com" type="email"
                                                icon={<Mail className="w-3 h-3" />} />
                                            <Field label="Contact Phone" value={form.contactPhone}
                                                onChange={v => setForm(f => ({ ...f, contactPhone: v }))}
                                                placeholder="+92 300 1234567"
                                                icon={<Phone className="w-3 h-3" />} />
                                            <Field label="LinkedIn URL" value={form.linkedinUrl}
                                                onChange={v => setForm(f => ({ ...f, linkedinUrl: v }))}
                                                placeholder="https://linkedin.com/in/you"
                                                icon={<Linkedin className="w-3 h-3" />} />
                                            <Field label="Portfolio URL" value={form.portfolioUrl}
                                                onChange={v => setForm(f => ({ ...f, portfolioUrl: v }))}
                                                placeholder="https://yourportfolio.com"
                                                icon={<ExternalLink className="w-3 h-3" />} />
                                        </div>
                                    </div>
                                )}

                                {editTab === "privacy" && (
                                    <div className="space-y-5 animate-in slide-in-from-right-4 fade-in duration-300">
                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="p-4 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-bg-secondary)] flex items-center justify-between">
                                                <div>
                                                    <h4 className="text-[13px] font-bold text-[var(--theme-text-primary)]">Public Email</h4>
                                                    <p className="text-[11px] text-[var(--theme-text-muted)] mt-0.5">Show your email address on your profile</p>
                                                </div>
                                                <Toggle checked={form.showEmail} onChange={v => setForm(f => ({ ...f, showEmail: v }))} label="" />
                                            </div>
                                            <div className="p-4 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-bg-secondary)] flex items-center justify-between">
                                                <div>
                                                    <h4 className="text-[13px] font-bold text-[var(--theme-text-primary)]">Public Phone</h4>
                                                    <p className="text-[11px] text-[var(--theme-text-muted)] mt-0.5">Show your phone number on your profile</p>
                                                </div>
                                                <Toggle checked={form.showPhone} onChange={v => setForm(f => ({ ...f, showPhone: v }))} label="" />
                                            </div>
                                            <div className="p-4 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-bg-secondary)] flex items-center justify-between">
                                                <div>
                                                    <h4 className="text-[13px] font-bold text-[var(--theme-text-primary)]">Public Socials</h4>
                                                    <p className="text-[11px] text-[var(--theme-text-muted)] mt-0.5">Display links to LinkedIn, GitHub, etc.</p>
                                                </div>
                                                <Toggle checked={form.showSocials} onChange={v => setForm(f => ({ ...f, showSocials: v }))} label="" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Footer Actions */}
                            <div className="px-6 py-4 border-t border-[var(--theme-border)] bg-[var(--theme-bg)] flex items-center justify-between z-10">
                                <p className="text-[10px] text-[var(--theme-text-muted)] hidden sm:block font-mono">
                                    {"// profile.save()"}
                                </p>
                                <div className="flex items-center gap-3 w-full sm:w-auto">
                                    <button onClick={() => setShowEdit(false)}
                                        className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-[13px] font-medium border cursor-pointer transition-all hover:bg-[var(--theme-bg-secondary)]"
                                        style={{ background: "transparent", borderColor: "var(--theme-border)", color: "var(--theme-text-primary)" }}>
                                        Cancel
                                    </button>
                                    <button onClick={handleProfileSave} disabled={saving}
                                        className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-[13px] font-bold text-black border-none cursor-pointer transition-all hover:scale-105 disabled:opacity-60 flex items-center justify-center gap-2 shadow-xl"
                                        style={{ background: `linear-gradient(135deg, ${accent}, #10B981)`, boxShadow: saving ? "none" : `0 4px 20px ${accent}40` }}>
                                        {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><CheckCircle className="w-4 h-4" /> Save Changes</>}
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            )}

            {/* ── COVER BANNER ── */}
            <div className="relative group/cover">
                <div className="h-32 sm:h-44 lg:h-52 w-full relative overflow-hidden">
                    <CoverBanner coverId={showCoverMenu ? selectedCoverId : (userData?.coverUrl || "1")}>
                        <div className="absolute right-4 sm:right-8 top-4 sm:top-6 text-white/20 font-mono text-[10px] sm:text-xs hidden sm:block text-right">
                            <p>{"// talent.profile"}</p>
                            <p>{`const username = "${username}";`}</p>
                            <p>{`const isAvailable = ${isAvailable ?? true};`}</p>
                        </div>
                        {/* Edit Cover Button */}
                        <button 
                            onClick={() => setShowCoverMenu(true)} 
                            className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 bg-black/50 hover:bg-black/70 backdrop-blur text-white px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-2 opacity-0 group-hover/cover:opacity-100 transition-opacity z-10"
                        >
                            <Pencil className="w-3.5 h-3.5" /> Edit Cover
                        </button>
                    </CoverBanner>
                </div>
                
                {coverSaving && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
                        <Loader2 className="w-6 h-6 animate-spin text-[#3CF91A]" />
                    </div>
                )}

                {/* Cover Selector Drawer/Modal */}
                {showCoverMenu && (
                    <CoverBannerSelector
                        selectedId={selectedCoverId}
                        onSelect={setSelectedCoverId}
                        onSave={async () => {
                            setCoverSaving(true);
                            setShowCoverMenu(false);
                            try {
                                const res = await fetch("/api/user/profile", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ coverUrl: selectedCoverId })
                                });
                                if (res.ok) {
                                    setUserData((prev: any) => ({...prev, coverUrl: selectedCoverId}));
                                    showToast("success", "Cover banner updated!");
                                }
                            } catch (e) {
                                showToast("error", "Failed to update cover.");
                            }
                            setCoverSaving(false);
                        }}
                        onCancel={() => {
                            setShowCoverMenu(false);
                            setSelectedCoverId(userData?.coverUrl || "1");
                        }}
                        accent={accent}
                    />
                )}

                {/* Avatar */}
                <div className="max-w-[900px] mx-auto px-4 sm:px-6">
                    <div className="relative -mt-12 sm:-mt-16 flex items-end gap-4">
                        {/* Interactive Avatar Container */}
                        <div className="relative group shrink-0">
                            <div 
                                onClick={() => setShowAvatarMenu(prev => !prev)}
                                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-black text-2xl sm:text-3xl font-bold border-4 border-[var(--theme-bg)] shadow-xl cursor-pointer overflow-hidden relative">
                                {avatarUrl ? (
                                    <img src={avatarUrl} alt={fullName} className="w-full h-full object-cover" />
                                ) : (
                                    initials
                                )}
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-white opacity-80" />
                                </div>
                                {avatarUploading && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                        <Loader2 className="w-6 h-6 animate-spin text-white" />
                                    </div>
                                )}
                            </div>
                            
                            {/* Dropdown Menu */}
                            {showAvatarMenu && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setShowAvatarMenu(false)} />
                                    <div className="absolute top-full left-0 translate-x-0 sm:left-1/2 sm:-translate-x-1/2 mt-2 w-48 rounded-xl shadow-xl border border-[var(--theme-border)] bg-[var(--theme-card)] z-50 overflow-hidden text-sm animate-in fade-in zoom-in duration-200" onClick={(e) => e.stopPropagation()}>
                                        <div className="p-1 flex flex-col">
                                            <button onClick={() => { setShowAvatarMenu(false); fileInputRef.current?.click(); }}
                                                className="w-full text-left px-4 py-2 hover:bg-[var(--theme-bg-secondary)] text-[var(--theme-text-primary)] rounded-lg transition-colors flex items-center gap-2 border-none bg-transparent cursor-pointer">
                                                <Upload className="w-4 h-4" /> Upload Photo
                                            </button>
                                            {(avatarUrl && avatarUrl !== "") && (
                                                <button onClick={() => { setShowAvatarMenu(false); handleRemoveAvatar(); }}
                                                    className="w-full text-left px-4 py-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors flex items-center gap-2 border-none bg-transparent cursor-pointer mt-1">
                                                    <Trash className="w-4 h-4" /> Remove Photo
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} />

                        <div className="pb-1 sm:pb-2 min-w-0 hidden sm:block">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-xl sm:text-2xl font-bold text-[var(--theme-text-primary)]">{fullName}</h1>
                                <span className="text-[12px] font-medium text-[var(--theme-text-muted)]">@{username}</span>
                                {isAvailable !== false && (
                                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 uppercase tracking-widest border border-green-500/20">
                                        Open to Work
                                    </span>
                                )}
                            </div>
                            {displayRole && <p className="text-[13px] text-[var(--theme-text-muted)] mt-0.5">{displayRole}</p>}
                            <p className="text-[11px] font-medium flex items-center gap-1 mt-1" style={{ color: accent }}>
                                <Sparkles className="w-3 h-3" /> Talent Profile
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile name */}
            <div className="sm:hidden px-4 mt-3">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h1 className="text-lg font-bold text-[var(--theme-text-primary)]">{fullName}</h1>
                    <span className="text-[11px] font-medium text-[var(--theme-text-muted)]">@{username}</span>
                </div>
                {displayRole && <p className="text-[12px] text-[var(--theme-text-muted)]">{displayRole}</p>}
                {isAvailable !== false && (
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 uppercase tracking-widest border border-green-500/20 inline-block mt-1">
                        Open to Work
                    </span>
                )}
            </div>

            {/* ── MAIN CONTENT ── */}
            <div className="max-w-[900px] mx-auto px-4 sm:px-6 pb-24 lg:pb-8">

                {/* Bio & Social Links */}
                <div className="mt-4 sm:mt-6">
                    {bio ? (
                        <p className="text-[13px] sm:text-[14px] text-[var(--theme-text-primary)] leading-relaxed whitespace-pre-wrap max-w-3xl">
                            {bio}
                        </p>
                    ) : (
                        <p className="text-[13px] text-[var(--theme-text-muted)] italic">
                            No bio added yet. Go to Settings → Privacy to add one.
                        </p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 mt-4 text-[12px] font-medium">
                        {currentJob && (
                            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-card)]" style={{ color: accent }}>
                                <Briefcase className="w-3.5 h-3.5" />
                                {currentJob.role} at {currentJob.companyName}
                            </span>
                        )}
                        {experienceLevel && (
                            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-card)] text-[var(--theme-text-secondary)]">
                                <Zap className="w-3.5 h-3.5 text-yellow-500" />
                                {experienceLevel.charAt(0) + experienceLevel.slice(1).toLowerCase()} Level
                            </span>
                        )}
                        {showEmail && contactEmail && (
                            <a href={`mailto:${contactEmail}`} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:opacity-80 transition-colors bg-[var(--theme-card)] border border-[var(--theme-border)] no-underline text-[var(--theme-text-secondary)]">
                                <Mail className="w-3.5 h-3.5" /> <span className="hidden sm:inline">{contactEmail}</span>
                            </a>
                        )}
                        {showPhone && contactPhone && (
                            <a href={`tel:${contactPhone}`} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:opacity-80 transition-colors bg-[var(--theme-card)] border border-[var(--theme-border)] no-underline text-[var(--theme-text-secondary)]">
                                <Phone className="w-3.5 h-3.5" /> <span className="hidden sm:inline">{contactPhone}</span>
                            </a>
                        )}
                        {showSocials && githubUsername && (
                            <a href={`https://github.com/${githubUsername}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:opacity-80 transition-colors bg-[var(--theme-card)] border border-[var(--theme-border)] no-underline text-[var(--theme-text-secondary)]">
                                <Github className="w-3.5 h-3.5" /> <span className="hidden sm:inline">@{githubUsername}</span>
                            </a>
                        )}
                        {showSocials && linkedinUrl && (
                            <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:opacity-80 transition-colors bg-[var(--theme-card)] border border-[var(--theme-border)] no-underline text-[var(--theme-text-secondary)]">
                                <Linkedin className="w-3.5 h-3.5 text-blue-500" /> <span className="hidden sm:inline">LinkedIn</span>
                            </a>
                        )}
                        {showSocials && portfolioUrl && (
                            <a href={portfolioUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:opacity-80 transition-colors bg-[var(--theme-card)] border border-[var(--theme-border)] no-underline text-[var(--theme-text-secondary)]">
                                <ExternalLink className="w-3.5 h-3.5 text-purple-500" /> <span className="hidden sm:inline">Portfolio</span>
                            </a>
                        )}
                    </div>
                </div>

                {/* Stats / Actions row */}
                <div className="flex items-center gap-3 sm:gap-6 mt-4 sm:mt-5 pb-4 border-b border-[var(--theme-border)]">
                    <div className="text-center">
                        <p className="text-sm sm:text-lg font-bold text-[var(--theme-text-primary)]">{userData?._count?.following || 0}</p>
                        <p className="text-[9px] sm:text-[10px] text-[var(--theme-text-muted)] uppercase tracking-wider">Following</p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm sm:text-lg font-bold text-[var(--theme-text-primary)]">{userData?._count?.followers || 0}</p>
                        <p className="text-[9px] sm:text-[10px] text-[var(--theme-text-muted)] uppercase tracking-wider">Followers</p>
                    </div>
                    {githubConnected && (
                        <div className="text-center">
                            <p className="text-sm sm:text-lg font-bold text-[var(--theme-text-primary)]">{githubRepos || 0}</p>
                            <p className="text-[9px] sm:text-[10px] text-[var(--theme-text-muted)] uppercase tracking-wider">Repos</p>
                        </div>
                    )}
                    <div className="text-center">
                        <p className="text-sm sm:text-lg font-bold text-[var(--theme-text-primary)]">{spills?.length || 0}</p>
                        <p className="text-[9px] sm:text-[10px] text-[var(--theme-text-muted)] uppercase tracking-wider">Spills</p>
                    </div>
                    <div className="ml-auto flex gap-2">
                        <button
                            onClick={() => setShowEdit(true)}
                            className="flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-xl text-[11px] sm:text-[12px] font-bold text-black border-none cursor-pointer transition-all hover:scale-105"
                            style={{ background: accent, boxShadow: `0 0 15px ${accent}40` }}>
                            <Pencil className="w-3.5 h-3.5" />
                            Edit Profile
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-0 mt-0 border-b border-[var(--theme-border)] overflow-x-auto scrollbar-none">
                    {tabs.map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)}
                            className={`px-4 sm:px-6 py-3 text-[12px] sm:text-[13px] font-semibold border-b-2 transition-all cursor-pointer bg-transparent whitespace-nowrap
                                ${activeTab === tab ? "border-[#3CF91A] text-[#3CF91A]" : "border-transparent text-[var(--theme-text-muted)] hover:text-[var(--theme-text-tertiary)]"}`}>
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="mt-5 space-y-5">



                    {/* ── EXPERIENCE TAB ── */}
                    {activeTab === "Experience" && (
                        <div className="space-y-3">
                            {workExperience && workExperience.length > 0 ? (
                                <>
                                    {workExperience.map((exp: any) => (
                                        <div key={exp.id}
                                            className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] p-4 sm:p-5 flex gap-4 hover:border-[#3CF91A]/30 transition-all"
                                            onMouseEnter={e => (e.currentTarget.style.borderColor = `${accent}40`)}
                                            onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--theme-border)")}>
                                            <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-[#3CF91A] to-[#10B981] flex items-center justify-center text-[13px] font-bold" style={{ color: "#000" }}>
                                                {exp.companyName[0].toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start gap-2 justify-between flex-wrap">
                                                    <div>
                                                        <p className="text-[13px] font-bold text-[var(--theme-text-primary)]">{exp.role}</p>
                                                        <p className="text-[12px] font-medium" style={{ color: accent }}>{exp.companyName}</p>
                                                        <p className="text-[10px] mt-0.5 text-[var(--theme-text-muted)]">
                                                            {fmtDate(exp.startDate)} – {exp.isCurrent ? "Present" : exp.endDate ? fmtDate(exp.endDate) : ""}
                                                        </p>
                                                    </div>
                                                    {exp.isCurrent && (
                                                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0"
                                                            style={{ background: `${accent}15`, color: accent, border: `1px solid ${accent}30` }}>
                                                            Current
                                                        </span>
                                                    )}
                                                </div>
                                                {exp.description && (
                                                    <p className="text-[12px] text-[var(--theme-text-muted)] mt-2 leading-relaxed">{exp.description}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    <div className="pt-2">
                                        <button
                                            onClick={() => setShowEdit(true)}
                                            className="inline-flex items-center gap-1.5 text-[11px] font-medium transition-all hover:opacity-80 border-none bg-transparent cursor-pointer"
                                            style={{ color: accent }}>
                                            <Pencil className="w-3 h-3" />
                                            <span>Edit Profile Info</span>
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="rounded-2xl border border-dashed border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm p-8 text-center flex flex-col items-center">
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3" style={{ background: `${accent}10` }}>
                                        <Briefcase className="w-5 h-5" style={{ color: accent }} />
                                    </div>
                                    <h3 className="text-[14px] font-bold text-[var(--theme-text-primary)] mb-1">No Work Experience Yet</h3>
                                    <p className="text-[12px] text-[var(--theme-text-muted)] mb-3">Add your current and past roles — they'll appear here and on your public profile.</p>
                                    <button
                                        onClick={() => setShowEdit(true)}
                                        className="px-4 py-2 rounded-xl text-[12px] font-bold text-black border-none cursor-pointer transition-all hover:scale-105"
                                        style={{ background: accent }}>
                                        Edit Profile
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── SKILLS TAB ── */}
                    {activeTab === "Skills" && (
                        <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm p-4 sm:p-5">
                            <h2 className="text-[14px] font-bold text-[var(--theme-text-primary)] mb-4 flex items-center gap-2">
                                <Zap className="w-4 h-4 text-[#3CF91A]" /> Professional Skills
                            </h2>
                            {skills && skills.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {skills.map((skill: any) => (
                                        <span key={skill.skillName}
                                            className="px-3 py-1.5 rounded-lg text-[11px] sm:text-[12px] font-medium bg-[var(--theme-input-bg)] text-[var(--theme-text-secondary)] border border-[var(--theme-border-light)] shadow-sm flex items-center gap-1.5 hover:border-[#3CF91A]/30 transition-colors">
                                            {skill.isVerified && <CheckCircle className="w-3 h-3 text-[#3CF91A]" />}
                                            {skill.skillName}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <p className="text-[12px] text-[var(--theme-text-muted)] mb-2">No skills added yet.</p>
                                    <button onClick={() => setShowEdit(true)} className="text-[11px] font-medium border-none bg-transparent cursor-pointer" style={{ color: accent }}>
                                        Edit Profile
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── PROJECTS TAB ── */}
                    {activeTab === "Projects" && (
                        <div className="space-y-4">
                            {projectLinks && projectLinks.length > 0 ? (
                                projectLinks.map((project: any, i: number) => (
                                    <div key={i}
                                        className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm p-4 sm:p-5 transition-all"
                                        onMouseEnter={e => (e.currentTarget.style.borderColor = `${accent}40`)}
                                        onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--theme-border)")}>
                                        <h3 className="text-[14px] font-bold text-[var(--theme-text-primary)] mb-1">{project.title || "Project Link"}</h3>
                                        {project.description && (
                                            <p className="text-[12px] text-[var(--theme-text-secondary)] mb-3 leading-relaxed">{project.description}</p>
                                        )}
                                        <a href={project.url} target="_blank" rel="noopener noreferrer"
                                            className="text-[11px] font-medium flex items-center gap-1 no-underline hover:underline"
                                            style={{ color: accent }}>
                                            <LinkIcon className="w-3 h-3" /> View Project
                                        </a>
                                    </div>
                                ))
                            ) : (
                                <div className="rounded-2xl border border-dashed border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm p-8 text-center flex flex-col items-center">
                                    <div className="w-12 h-12 rounded-full bg-[var(--theme-bg-secondary)] flex items-center justify-center mb-3">
                                        <Briefcase className="w-5 h-5 text-[var(--theme-text-muted)]" />
                                    </div>
                                    <h3 className="text-[14px] font-bold text-[var(--theme-text-primary)] mb-1">No Projects Yet</h3>
                                    <p className="text-[12px] text-[var(--theme-text-muted)]">Add spotlight projects from your profile settings.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── GITHUB TAB ── */}
                    {activeTab === "GitHub" && (
                        <div className="space-y-4">
                            {isLoadingGithub ? (
                                <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-[#3CF91A]" /></div>
                            ) : githubData ? (
                                <>
                                    {/* ── GitHub Profile Card ── */}
                                    {githubData.githubProfile && (
                                        <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm p-4 sm:p-5">
                                            <div className="flex items-start gap-4">
                                                <img
                                                    src={githubData.githubProfile.avatarUrl}
                                                    alt="GitHub Avatar"
                                                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 shrink-0"
                                                    style={{ borderColor: `${accent}40` }}
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                                        <h2 className="text-[15px] font-bold text-[var(--theme-text-primary)]">@{githubData.githubUsername}</h2>
                                                        <a href={githubData.githubProfile.htmlUrl} target="_blank" rel="noopener noreferrer"
                                                            className="flex items-center gap-1 text-[10px] font-medium no-underline px-2 py-0.5 rounded-full transition-all hover:opacity-80"
                                                            style={{ background: `${accent}15`, color: accent }}>
                                                            <ExternalLink className="w-3 h-3" /> View on GitHub
                                                        </a>
                                                    </div>
                                                    {githubData.githubProfile.bio && (
                                                        <p className="text-[12px] text-[var(--theme-text-muted)] mb-2 line-clamp-2">{githubData.githubProfile.bio}</p>
                                                    )}
                                                    <div className="flex items-center gap-4 text-[11px] text-[var(--theme-text-secondary)]">
                                                        <span><strong style={{ color: 'var(--theme-text-primary)' }}>{githubData.githubProfile.followers}</strong> followers</span>
                                                        <span><strong style={{ color: 'var(--theme-text-primary)' }}>{githubData.githubProfile.following}</strong> following</span>
                                                        <span><strong style={{ color: 'var(--theme-text-primary)' }}>{githubData.totalRepos}</strong> repos</span>
                                                        <span><strong style={{ color: accent }}>{githubData.totalStars}</strong> <Star className="w-3 h-3 inline" /></span>
                                                    </div>
                                                    <p className="text-[10px] text-[var(--theme-text-muted)] mt-1.5">
                                                        Member since {new Date(githubData.githubProfile.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* ── Top Languages ── */}
                                    <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm p-4 sm:p-5">
                                        <h2 className="text-[14px] font-bold text-[var(--theme-text-primary)] mb-4 flex items-center gap-2">
                                            <Github className="w-4 h-4 text-[#3CF91A]" /> Top Languages
                                        </h2>
                                        {Object.keys(githubData.languageStats).length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {Object.entries(githubData.languageStats)
                                                    .sort(([, a], [, b]) => (b as number) - (a as number))
                                                    .map(([lang, count]) => (
                                                        <span key={lang} className="px-3 py-1.5 rounded-lg text-[11px] sm:text-[12px] font-medium bg-[var(--theme-input-bg)] text-[var(--theme-text-secondary)] border border-[var(--theme-border-light)] flex items-center gap-1.5">
                                                            <span className="w-2 h-2 rounded-full bg-[#3CF91A]"></span>
                                                            {lang} <span className="text-[#3CF91A] font-bold">{count as number}</span>
                                                        </span>
                                                    ))}
                                            </div>
                                        ) : (
                                            <p className="text-[12px] text-[var(--theme-text-muted)]">No language data available.</p>
                                        )}
                                    </div>

                                    {/* ── Repositories ── */}
                                    <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm p-4 sm:p-5">
                                        <h2 className="text-[14px] font-bold text-[var(--theme-text-primary)] mb-4 flex items-center gap-2">
                                            <Github className="w-4 h-4 text-[#3CF91A]" /> Repositories {githubData.sharePrivateRepos && <span className="text-[10px] bg-[#3CF91A]/10 text-[#3CF91A] px-2 py-0.5 rounded-full ml-2">Includes Private</span>}
                                        </h2>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {githubData.repos.map((repo: any) => (
                                                <a key={repo.id} href={repo.html_url} target="_blank" rel="noopener noreferrer" className="p-4 rounded-xl border border-[var(--theme-border-light)] bg-[var(--theme-bg-secondary)] hover:border-[#3CF91A]/40 transition-all no-underline block flex flex-col break-inside-avoid">
                                                    <h3 className="text-[13px] font-bold text-[var(--theme-text-primary)] mb-1 flex items-center justify-between">
                                                        <span className="truncate pr-2">{repo.name}</span>
                                                        {repo.private && <span className="text-[9px] bg-red-500/10 text-red-500 px-2 py-0.5 rounded-full border border-red-500/20 shrink-0">Private</span>}
                                                    </h3>
                                                    <p className="text-[11px] text-[var(--theme-text-muted)] mb-3 line-clamp-2 flex-grow">{repo.description || "No description"}</p>
                                                    <div className="flex items-center gap-3 text-[10px] text-[var(--theme-text-secondary)] mt-auto pt-2 border-t border-[var(--theme-border-light)]">
                                                        {repo.language && <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#3CF91A]"></span>{repo.language}</span>}
                                                        <span className="flex items-center gap-1"><Star className="w-3 h-3 text-[var(--theme-text-muted)]" /> {repo.stargazers_count}</span>
                                                        {repo.forks_count > 0 && <span className="flex items-center gap-1">🔱 {repo.forks_count}</span>}
                                                        <span className="flex items-center gap-1 ml-auto text-[var(--theme-text-muted)]">{new Date(repo.updated_at).toLocaleDateString()}</span>
                                                    </div>
                                                </a>
                                            ))}
                                        </div>
                                    </div>

                                    {/* ── Recent Activity ── */}
                                    {githubData.recentActivity && githubData.recentActivity.length > 0 && (
                                        <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm p-4 sm:p-5">
                                            <h2 className="text-[14px] font-bold text-[var(--theme-text-primary)] mb-4 flex items-center gap-2">
                                                <Zap className="w-4 h-4 text-[#3CF91A]" /> Recent Activity
                                            </h2>
                                            <div className="space-y-2 max-h-[300px] overflow-y-auto">
                                                {githubData.recentActivity.slice(0, 15).map((event: any, i: number) => {
                                                    const typeMap: Record<string, string> = {
                                                        PushEvent: "Pushed to",
                                                        CreateEvent: "Created",
                                                        PullRequestEvent: "PR on",
                                                        IssuesEvent: "Issue on",
                                                        WatchEvent: "Starred",
                                                        ForkEvent: "Forked",
                                                        DeleteEvent: "Deleted in",
                                                        IssueCommentEvent: "Commented on",
                                                        PullRequestReviewEvent: "Reviewed PR on",
                                                    };
                                                    const label = typeMap[event.type] || event.type.replace("Event", "");
                                                    return (
                                                        <div key={i} className="flex items-center gap-3 py-2 border-b border-[var(--theme-border-light)] last:border-b-0">
                                                            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: accent }}></div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-[12px] text-[var(--theme-text-secondary)] truncate">
                                                                    <span className="font-semibold text-[var(--theme-text-primary)]">{label}</span>{" "}
                                                                    <span className="font-mono text-[11px]" style={{ color: accent }}>{event.repo}</span>
                                                                </p>
                                                            </div>
                                                            <span className="text-[10px] text-[var(--theme-text-muted)] shrink-0">
                                                                {new Date(event.createdAt).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {/* ── ACHIEVEMENTS (Gamification) ── */}
                                    <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm p-4 sm:p-5">
                                        <h2 className="text-[14px] font-bold text-[var(--theme-text-primary)] mb-4 flex items-center gap-2">
                                            <Sparkles className="w-4 h-4 text-[#3CF91A]" /> GitHub Achievements
                                        </h2>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            {/* Badge 1: Connected */}
                                            <div className="flex flex-col items-center justify-center p-3 rounded-xl border border-[#3CF91A]/30 bg-[#3CF91A]/5 text-center">
                                                <div className="w-10 h-10 rounded-full bg-[#3CF91A]/20 text-[#3CF91A] flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(60,249,26,0.3)]">
                                                    <Github className="w-5 h-5" />
                                                </div>
                                                <span className="text-[11px] font-bold text-[var(--theme-text-primary)]">Verified Hacker</span>
                                                <span className="text-[9px] text-[var(--theme-text-muted)] mt-0.5">Linked GitHub</span>
                                            </div>

                                            {/* Badge 2: Polyglot */}
                                            <div className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${Object.keys(githubData.languageStats).length >= 3 ? 'border-purple-500/30 bg-purple-500/5' : 'border-[var(--theme-border)] bg-[var(--theme-bg-secondary)] opacity-50 grayscale'}`}>
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${Object.keys(githubData.languageStats).length >= 3 ? 'bg-purple-500/20 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.3)]' : 'bg-[var(--theme-input-bg)] text-[var(--theme-text-muted)]'}`}>
                                                    <FileText className="w-5 h-5" />
                                                </div>
                                                <span className="text-[11px] font-bold text-[var(--theme-text-primary)]">Polyglot</span>
                                                <span className="text-[9px] text-[var(--theme-text-muted)] mt-0.5">3+ Languages</span>
                                            </div>

                                            {/* Badge 3: Stargazer */}
                                            <div className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${(githubData.totalStars || 0) >= 10 ? 'border-yellow-500/30 bg-yellow-500/5' : 'border-[var(--theme-border)] bg-[var(--theme-bg-secondary)] opacity-50 grayscale'}`}>
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${(githubData.totalStars || 0) >= 10 ? 'bg-yellow-500/20 text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)]' : 'bg-[var(--theme-input-bg)] text-[var(--theme-text-muted)]'}`}>
                                                    <Star className="w-5 h-5" />
                                                </div>
                                                <span className="text-[11px] font-bold text-[var(--theme-text-primary)]">Stargazer</span>
                                                <span className="text-[9px] text-[var(--theme-text-muted)] mt-0.5">10+ Total Stars</span>
                                            </div>

                                            {/* Badge 4: Deep Contributor */}
                                            <div className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${(githubData.totalRepos || 0) >= 10 ? 'border-blue-500/30 bg-blue-500/5' : 'border-[var(--theme-border)] bg-[var(--theme-bg-secondary)] opacity-50 grayscale'}`}>
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${(githubData.totalRepos || 0) >= 10 ? 'bg-blue-500/20 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'bg-[var(--theme-input-bg)] text-[var(--theme-text-muted)]'}`}>
                                                    <Briefcase className="w-5 h-5" />
                                                </div>
                                                <span className="text-[11px] font-bold text-[var(--theme-text-primary)]">Archivist</span>
                                                <span className="text-[9px] text-[var(--theme-text-muted)] mt-0.5">10+ Repositories</span>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="rounded-2xl border border-dashed border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm p-8 text-center flex flex-col items-center">
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3" style={{ background: `${accent}10` }}>
                                        <Github className="w-5 h-5" style={{ color: accent }} />
                                    </div>
                                    <h3 className="text-[14px] font-bold text-[var(--theme-text-primary)] mb-1">No GitHub Data</h3>
                                    <p className="text-[12px] text-[var(--theme-text-muted)] mb-3">Connect your account in settings to display your source code activities.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── SPILLS TAB ── */}
                    {activeTab === "Spills" && (
                        <div>
                            {spills && spills.length > 0 ? (
                                <>
                                    {/* Header row */}
                                    <div className="flex items-center justify-between mb-4">
                                        <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--theme-text-muted)" }}>
                                            {spills.length} Spill{spills.length !== 1 ? "s" : ""}
                                        </p>
                                        <button
                                            onClick={() => setComposerOpen(true)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-black border-none cursor-pointer transition-all hover:scale-105"
                                            style={{ background: accent, boxShadow: `0 0 10px ${accent}40` }}>
                                            <Plus className="w-3 h-3" /> New Spill
                                        </button>
                                    </div>

                                    {/* Instagram-style 3-col grid */}
                                    <div className="grid grid-cols-3 gap-0.5">
                                        {spills.map((spill: any, idx: number) => (
                                            <SpillGridTile
                                                key={spill.id ?? idx}
                                                spill={spill}
                                                accent={accent}
                                                avatarUrl={avatarUrl}
                                                initials={initials}
                                                username={username}
                                                onClick={setSelectedSpill}
                                            />
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="rounded-2xl border border-dashed border-[var(--theme-border)] bg-[var(--theme-card)] p-12 text-center flex flex-col items-center">
                                    <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: `${accent}10` }}>
                                        <MessageSquare className="w-7 h-7" style={{ color: accent }} />
                                    </div>
                                    <h3 className="text-[15px] font-bold text-[var(--theme-text-primary)] mb-1">No Spills Yet</h3>
                                    <p className="text-[12px] text-[var(--theme-text-muted)] mb-5 max-w-xs">Share your thoughts, code snippets, or insights with the community.</p>
                                    <button
                                        onClick={() => setComposerOpen(true)}
                                        className="px-5 py-2.5 rounded-xl text-[12px] font-bold text-black border-none cursor-pointer transition-all hover:scale-105"
                                        style={{ background: accent, boxShadow: `0 0 15px ${accent}40` }}>
                                        Create your first Spill
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </div>

            {/* ── Post Composer Modal ── */}
            {composerOpen && (
                <PostComposer
                    userData={{ ...userData, role: "TALENT" }}
                    onClose={() => setComposerOpen(false)}
                    onPostCreated={(newPost: any) => {
                        setUserData((prev: any) => ({
                            ...prev,
                            spills: [newPost, ...(prev.spills || [])],
                        }));
                        setComposerOpen(false);
                    }}
                />
            )}

            {/* ── Post Preview Modal ── */}
            {selectedSpill && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedSpill(null)} />
                    <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl z-10 custom-scrollbar">
                        <button 
                            onClick={() => setSelectedSpill(null)} 
                            className="absolute top-4 right-4 z-[70] w-8 h-8 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors border-none cursor-pointer shadow-md">
                            <X size={16} />
                        </button>
                        <PostCard
                            post={{ ...selectedSpill, user: { ...userData, role: "TALENT" } }}
                            currentUserId={userData.id}
                            currentUserRole="TALENT"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
