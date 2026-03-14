"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
    Building2, MapPin, Globe, Phone, Mail,
    Briefcase, Loader2, Link as LinkIcon, Heart, MessageSquare,
    Share2, Eye, Sparkles, Users, CheckCircle, Pencil, X,
    Camera, Upload, Trash, Shield
} from "lucide-react";
import { compressImageClient } from "@/lib/client-compress";

const accent = "#A855F7";

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
                {icon && <span style={{ color: "#A855F7" }}>{icon}</span>}
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
                    onFocus={e => e.currentTarget.style.boxShadow = "0 0 0 2px rgba(168,85,247,0.15), inset 0 1px 3px rgba(0,0,0,0.1)"}
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
                    onFocus={e => e.currentTarget.style.boxShadow = "0 0 0 2px rgba(168,85,247,0.15), inset 0 1px 3px rgba(0,0,0,0.1)"}
                    onBlur={e => e.currentTarget.style.boxShadow = "inset 0 1px 3px rgba(0,0,0,0.1)"} />}
        </div>
    );
}

export default function RecruiterProfilePage() {
    const [userData, setUserData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("Spills");
    const tabs = ["Spills", "Jobs"];

    /* ── Edit modal ── */
    const [showEdit, setShowEdit] = useState(false);
    const [form, setForm] = useState({
        companyName: "", companyWebsite: "", companySize: "",
        addressLine1: "", addressLine2: "", city: "", state: "", postalCode: "", country: "",
        bio: "", phone: "",
    });
    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [editTab, setEditTab] = useState<"basic" | "address" | "contact">("basic");

    const [showAvatarMenu, setShowAvatarMenu] = useState(false);
    const [avatarUploading, setAvatarUploading] = useState(false);
    const [toastMessage, setToastMessage] = useState<{ type: "success" | "error", text: string } | null>(null);

    const showToast = (type: "success" | "error", text: string) => {
        setToastMessage({ type, text });
        setTimeout(() => setToastMessage(null), 4000);
    };

    /* ── Fetch profile ── */
    const loadProfile = () => {
        fetch("/api/user/profile")
            .then(r => r.json())
            .then(d => {
                if (d.user) {
                    setUserData(d.user);
                    const rp = d.user.recruiterProfile || {};
                    setForm({
                        companyName: rp.companyName || "",
                        companyWebsite: rp.companyWebsite || "",
                        companySize: rp.companySize || "",
                        addressLine1: rp.addressLine1 || "",
                        addressLine2: rp.addressLine2 || "",
                        city: rp.city || "",
                        state: rp.state || "",
                        postalCode: rp.postalCode || "",
                        country: rp.country || "",
                        bio: rp.bio || "",
                        phone: rp.phone || "",
                    });
                }
                setIsLoading(false);
            })
            .catch(() => setIsLoading(false));
    };

    useEffect(() => { loadProfile(); }, []);

    /* Close modal on backdrop click */
    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === overlayRef.current) setShowEdit(false);
    };

    /* Save */
    const handleSave = async () => {
        setSaving(true);
        setSaveMsg(null);
        const res = await fetch("/api/user/profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                fullName: form.companyName, // Company account — display name = company name
                recruiterProfile: {
                    companyName: form.companyName || "Unknown",
                    companyWebsite: form.companyWebsite || null,
                    companySize: form.companySize || null,
                    addressLine1: form.addressLine1 || null,
                    addressLine2: form.addressLine2 || null,
                    city: form.city || null,
                    state: form.state || null,
                    postalCode: form.postalCode || null,
                    country: form.country || null,
                    bio: form.bio || null,
                    phone: form.phone || null,
                }
            }),
        });
        const data = await res.json();
        setSaving(false);
        if (res.ok && data.success) {
            setSaveMsg({ type: "ok", text: "Profile updated!" });
            // Refresh displayed data
            setUserData((prev: any) => ({
                ...prev,
                fullName: form.companyName,
                recruiterProfile: { ...prev.recruiterProfile, ...form },
            }));
            setTimeout(() => { setSaveMsg(null); setShowEdit(false); }, 1200);
        } else {
            setSaveMsg({ type: "err", text: data.error || "Failed to save. Try again." });
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
            // Unlink from DB, you could optionally call DELETE on your BLOB
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

    /* ─── Loading / Error states ─── */
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
                <p className="text-[13px] text-[var(--theme-text-muted)]">We couldn't load your profile.</p>
            </div>
        );
    }

    const { fullName, username, email, recruiterProfile, spills, avatarUrl } = userData;
    const { bio, companyName, companyWebsite, city, state, country, phone, industries } = recruiterProfile || {};
    const displayLocation = [city, state, country].filter(Boolean).join(", ");
    const bounties = recruiterProfile?.bounties ?? [];
    const initials = fullName
        ? fullName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
        : "??";
    const displayTitle = companyName || "Company Profile";

    return (
        <div style={{ background: "var(--theme-bg)" }} className="min-h-full">
            {toastMessage && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-5 fade-in duration-300">
                    <div className={`px-4 py-3 rounded-xl shadow-2xl border flex items-center gap-3 ${
                        toastMessage.type === "success" 
                            ? "bg-purple-500/10 border-purple-500/30 text-purple-500" 
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
                            <div className="absolute top-0 left-0 w-full h-32 opacity-20 pointer-events-none"
                                style={{ background: `radial-gradient(circle at top left, ${accent}, transparent 70%)` }} />
                            
                            <div className="flex items-center gap-3 mb-8 relative z-10">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg"
                                    style={{ background: `linear-gradient(135deg, ${accent}20, ${accent}10)`, border: `1px solid ${accent}30` }}>
                                    <Pencil className="w-5 h-5" style={{ color: accent }} />
                                </div>
                                <div className="hidden sm:block">
                                    <h2 className="text-[16px] font-bold text-[var(--theme-text-primary)] tracking-wide">Edit Company</h2>
                                    <p className="text-[11px] text-[var(--theme-text-muted)] font-medium mt-0.5">Customize your appearance</p>
                                </div>
                            </div>

                            <nav className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 hide-scrollbar relative z-10">
                                <button onClick={() => setEditTab("basic")}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-semibold transition-all whitespace-nowrap sm:whitespace-normal cursor-pointer border ${
                                        editTab === "basic" 
                                        ? "bg-black/20 text-white" 
                                        : "bg-transparent border-transparent text-[var(--theme-text-muted)] hover:bg-[var(--theme-bg-secondary)] hover:text-[var(--theme-text-primary)]"
                                    }`}
                                    style={editTab === "basic" ? { borderColor: `${accent}40`, boxShadow: `inset 0 0 20px ${accent}10` } : {}}>
                                    <Building2 className="w-4 h-4" style={{ color: editTab === "basic" ? accent : "inherit" }} />
                                    Company Info
                                </button>
                                <button onClick={() => setEditTab("address")}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-semibold transition-all whitespace-nowrap sm:whitespace-normal cursor-pointer border ${
                                        editTab === "address" 
                                        ? "bg-black/20 text-white" 
                                        : "bg-transparent border-transparent text-[var(--theme-text-muted)] hover:bg-[var(--theme-bg-secondary)] hover:text-[var(--theme-text-primary)]"
                                    }`}
                                    style={editTab === "address" ? { borderColor: `${accent}40`, boxShadow: `inset 0 0 20px ${accent}10` } : {}}>
                                    <MapPin className="w-4 h-4" style={{ color: editTab === "address" ? accent : "inherit" }} />
                                    Address Details
                                </button>
                                <button onClick={() => setEditTab("contact")}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-semibold transition-all whitespace-nowrap sm:whitespace-normal cursor-pointer border ${
                                        editTab === "contact" 
                                        ? "bg-black/20 text-white" 
                                        : "bg-transparent border-transparent text-[var(--theme-text-muted)] hover:bg-[var(--theme-bg-secondary)] hover:text-[var(--theme-text-primary)]"
                                    }`}
                                    style={editTab === "contact" ? { borderColor: `${accent}40`, boxShadow: `inset 0 0 20px ${accent}10` } : {}}>
                                    <Phone className="w-4 h-4" style={{ color: editTab === "contact" ? accent : "inherit" }} />
                                    Contact Info
                                </button>
                            </nav>

                            <div className="mt-auto hidden sm:block relative z-10">
                                <div className="p-4 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-bg-secondary)]">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Shield className="w-4 h-4" style={{ color: accent }} />
                                        <p className="text-[11px] font-bold text-[var(--theme-text-primary)]">Profile Tips</p>
                                    </div>
                                    <p className="text-[10px] text-[var(--theme-text-muted)] leading-relaxed">
                                        A complete profile helps talent understand your company culture and location. Updating these details improves matchmaking.
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
                                    {editTab === "basic" ? "Editing Company Details" : editTab === "address" ? "Updating Location Info" : "Managing Contact Info"}
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
                                                <Field label="Company Name *" value={form.companyName}
                                                    onChange={v => setForm(f => ({ ...f, companyName: v }))}
                                                    placeholder="e.g. NastecSol"
                                                    icon={<Building2 className="w-3 h-3" />} />
                                            </div>
                                            <div>
                                                <Field label="Company Website" value={form.companyWebsite}
                                                    onChange={v => setForm(f => ({ ...f, companyWebsite: v }))}
                                                    placeholder="https://yourcompany.com"
                                                    icon={<Globe className="w-3 h-3" />} />
                                            </div>
                                            <div>
                                                <label className="text-[10px] uppercase tracking-widest font-semibold mb-1.5 flex items-center gap-1.5"
                                                    style={{ color: "var(--theme-text-muted)" }}>
                                                    <Users className="w-3 h-3" style={{ color: accent }} />
                                                    Company Size
                                                </label>
                                                <select value={form.companySize}
                                                    onChange={e => setForm(f => ({ ...f, companySize: e.target.value }))}
                                                    className="w-full px-3.5 py-2.5 rounded-xl text-[13px] outline-none transition-all cursor-pointer"
                                                    style={{ background: "var(--theme-input-bg)", border: "1px solid var(--theme-border)", color: "var(--theme-text-primary)", boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)" }}>
                                                    <option value="">Select size...</option>
                                                    <option value="1-10">1–10 employees</option>
                                                    <option value="11-50">11–50 employees</option>
                                                    <option value="51-200">51–200 employees</option>
                                                    <option value="201-500">201–500 employees</option>
                                                    <option value="501-1000">501–1000 employees</option>
                                                    <option value="1001+">1001+ employees</option>
                                                </select>
                                            </div>
                                            <div className="sm:col-span-2">
                                                <Field label="Company Bio" value={form.bio}
                                                    onChange={v => setForm(f => ({ ...f, bio: v }))}
                                                    placeholder="Describe your company, culture, and what makes it great..."
                                                    textarea
                                                    icon={<Sparkles className="w-3 h-3" />} />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {editTab === "address" && (
                                    <div className="space-y-5 animate-in slide-in-from-right-4 fade-in duration-300">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <div className="sm:col-span-2">
                                                <Field label="Address Line 1" value={form.addressLine1}
                                                    onChange={v => setForm(f => ({ ...f, addressLine1: v }))}
                                                    placeholder="Street address, P.O. box" />
                                            </div>
                                            <div className="sm:col-span-2">
                                                <Field label="Address Line 2" value={form.addressLine2}
                                                    onChange={v => setForm(f => ({ ...f, addressLine2: v }))}
                                                    placeholder="Apartment, suite, unit (optional)" />
                                            </div>
                                            <Field label="City" value={form.city}
                                                onChange={v => setForm(f => ({ ...f, city: v }))}
                                                placeholder="e.g. Karachi" />
                                            <Field label="State / Province" value={form.state}
                                                onChange={v => setForm(f => ({ ...f, state: v }))}
                                                placeholder="e.g. Sindh" />
                                            <Field label="Postal Code" value={form.postalCode}
                                                onChange={v => setForm(f => ({ ...f, postalCode: v }))}
                                                placeholder="e.g. 75500" />
                                            <Field label="Country" value={form.country}
                                                onChange={v => setForm(f => ({ ...f, country: v }))}
                                                placeholder="e.g. Pakistan" />
                                        </div>
                                    </div>
                                )}

                                {editTab === "contact" && (
                                    <div className="space-y-5 animate-in slide-in-from-right-4 fade-in duration-300">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <Field label="Company Phone" value={form.phone}
                                                onChange={v => setForm(f => ({ ...f, phone: v }))}
                                                placeholder="+92 300 1234567"
                                                icon={<Phone className="w-3 h-3" />} />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Footer Actions */}
                            <div className="px-6 py-4 border-t border-[var(--theme-border)] bg-[var(--theme-bg)] flex items-center justify-between z-10">
                                <p className="text-[10px] text-[var(--theme-text-muted)] hidden sm:block font-mono">
                                    {"// company.save()"}
                                </p>
                                <div className="flex items-center gap-3 w-full sm:w-auto">
                                    <button onClick={() => setShowEdit(false)}
                                        className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-[13px] font-medium border cursor-pointer transition-all hover:bg-[var(--theme-bg-secondary)]"
                                        style={{ background: "transparent", borderColor: "var(--theme-border)", color: "var(--theme-text-primary)" }}>
                                        Cancel
                                    </button>
                                    <button onClick={handleSave} disabled={saving}
                                        className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-[13px] font-bold text-white border-none cursor-pointer transition-all hover:scale-105 disabled:opacity-60 flex items-center justify-center gap-2 shadow-xl"
                                        style={{ background: `linear-gradient(135deg, ${accent}, #7C3AED)`, boxShadow: saving ? "none" : `0 4px 20px ${accent}40` }}>
                                        {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : <><CheckCircle className="w-4 h-4" /> Save Changes</>}
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            )}

            {/* ── COVER BANNER ── */}
            <div className="relative">
                <div className="h-32 sm:h-44 lg:h-52 w-full bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10"
                        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fff' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
                    />
                    <div className="absolute right-4 sm:right-8 top-4 sm:top-6 text-white/20 font-mono text-[10px] sm:text-xs hidden sm:block text-right">
                        <p>{"// company.profile"}</p>
                        <p>{`const company = "${companyName || "SkillSpill"}";`}</p>
                        <p>{`const hiring = true;`}</p>
                    </div>
                </div>

                {/* Avatar */}
                <div className="max-w-[900px] mx-auto px-4 sm:px-6">
                    <div className="relative -mt-12 sm:-mt-16 flex items-end gap-4">
                        {/* Interactive Avatar Container */}
                        <div className="relative group shrink-0">
                            <div 
                                onClick={() => setShowAvatarMenu(prev => !prev)}
                                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold border-4 border-[var(--theme-bg)] shadow-xl shrink-0 cursor-pointer overflow-hidden relative">
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
                            </div>
                            <p className="text-[13px] text-[var(--theme-text-muted)] mt-0.5">{displayTitle}</p>
                            <p className="text-[11px] font-medium flex items-center gap-1 mt-1" style={{ color: accent }}>
                                <Sparkles className="w-3 h-3" /> Company Profile
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
                <p className="text-[12px] text-[var(--theme-text-muted)]">{displayTitle}</p>
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
                            No bio yet.{" "}
                            <button onClick={() => setShowEdit(true)} className="border-none bg-transparent cursor-pointer font-medium underline" style={{ color: accent }}>
                                Add one
                            </button>
                        </p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 mt-4 text-[12px] font-medium">
                        {displayLocation && (
                            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-card)]" style={{ color: accent }}>
                                <MapPin className="w-3.5 h-3.5" />
                                {displayLocation}
                            </span>
                        )}
                        {companyName && (
                            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[var(--theme-border)] bg-[var(--theme-card)] text-[var(--theme-text-secondary)]">
                                <Building2 className="w-3.5 h-3.5" style={{ color: accent }} />
                                {companyName}
                            </span>
                        )}
                        {email && (
                            <a href={`mailto:${email}`} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:opacity-80 transition-colors bg-[var(--theme-card)] border border-[var(--theme-border)] no-underline text-[var(--theme-text-secondary)]">
                                <Mail className="w-3.5 h-3.5" /> <span className="hidden sm:inline">{email}</span>
                            </a>
                        )}
                        {phone && (
                            <a href={`tel:${phone}`} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:opacity-80 transition-colors bg-[var(--theme-card)] border border-[var(--theme-border)] no-underline text-[var(--theme-text-secondary)]">
                                <Phone className="w-3.5 h-3.5" /> <span className="hidden sm:inline">{phone}</span>
                            </a>
                        )}
                        {companyWebsite && (
                            <a href={companyWebsite.startsWith("http") ? companyWebsite : `https://${companyWebsite}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:opacity-80 transition-colors bg-[var(--theme-card)] border border-[var(--theme-border)] no-underline text-[var(--theme-text-secondary)]">
                                <Globe className="w-3.5 h-3.5" style={{ color: accent }} /> <span className="hidden sm:inline">Website</span>
                            </a>
                        )}
                    </div>
                </div>

                {/* Stats / Actions row */}
                <div className="flex items-center gap-3 sm:gap-6 mt-4 sm:mt-5 pb-4 border-b border-[var(--theme-border)]">
                    <div className="text-center">
                        <p className="text-sm sm:text-lg font-bold text-[var(--theme-text-primary)]">{bounties?.length || 0}</p>
                        <p className="text-[9px] sm:text-[10px] text-[var(--theme-text-muted)] uppercase tracking-wider">Bounties</p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm sm:text-lg font-bold text-[var(--theme-text-primary)]">{spills?.length || 0}</p>
                        <p className="text-[9px] sm:text-[10px] text-[var(--theme-text-muted)] uppercase tracking-wider">Spills</p>
                    </div>
                    <div className="ml-auto flex gap-2">
                        {/* ✏️  Opens modal — no navigation */}
                        <button
                            onClick={() => setShowEdit(true)}
                            className="flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-xl text-[11px] sm:text-[12px] font-bold text-white border-none cursor-pointer transition-all hover:scale-105"
                            style={{ background: `linear-gradient(135deg, ${accent}, #7C3AED)`, boxShadow: `0 0 15px ${accent}40` }}>
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
                                ${activeTab === tab ? "border-[#A855F7] text-[#A855F7]" : "border-transparent text-[var(--theme-text-muted)] hover:text-[var(--theme-text-tertiary)]"}`}>
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="mt-5 space-y-5">



                    {/* ── JOBS / BOUNTIES TAB ── */}
                    {activeTab === "Jobs" && (
                        <div className="space-y-4">
                            {bounties && bounties.length > 0 ? (
                                bounties.map((bounty: any) => (
                                    <div key={bounty.id}
                                        className="rounded-2xl border bg-[var(--theme-card)] p-4 sm:p-5 transition-all"
                                        style={{ borderColor: "var(--theme-border)" }}
                                        onMouseEnter={e => (e.currentTarget.style.borderColor = `${accent}40`)}
                                        onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--theme-border)")}>
                                        <div className="flex items-start justify-between gap-3 flex-wrap">
                                            <div>
                                                <h3 className="text-[14px] font-bold text-[var(--theme-text-primary)] mb-1">{bounty.title}</h3>
                                                {bounty.description && (
                                                    <p className="text-[12px] text-[var(--theme-text-secondary)] leading-relaxed mb-2 line-clamp-2">{bounty.description}</p>
                                                )}
                                                <div className="flex flex-wrap gap-2 text-[10px] text-[var(--theme-text-muted)]">
                                                    {bounty.reward && (
                                                        <span className="font-bold text-[11px]" style={{ color: accent }}>${bounty.reward?.toLocaleString()}</span>
                                                    )}
                                                    {bounty.skills?.slice(0, 4).map((s: any) => (
                                                        <span key={s.skillName} className="px-2 py-0.5 rounded-md font-medium"
                                                            style={{ background: "var(--theme-input-bg)", border: "1px solid var(--theme-border-light)", color: "var(--theme-text-secondary)" }}>
                                                            {s.skillName}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full shrink-0 ${bounty.status === "OPEN" ? "bg-green-500/10 text-green-500 border border-green-500/20" : "text-[var(--theme-text-muted)]"}`}
                                                style={bounty.status !== "OPEN" ? { background: "var(--theme-input-bg)", border: "1px solid var(--theme-border-light)" } : {}}>
                                                {bounty.status}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm p-8 text-center flex flex-col items-center">
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3" style={{ background: `${accent}15` }}>
                                        <Briefcase className="w-5 h-5" style={{ color: accent }} />
                                    </div>
                                    <h3 className="text-[14px] font-bold text-[var(--theme-text-primary)] mb-1">No Active Jobs</h3>
                                    <p className="text-[12px] text-[var(--theme-text-muted)] mb-3">You haven&apos;t posted any bounties yet.</p>
                                    <Link href="/recruiter/jobs"
                                        className="px-4 py-2 rounded-xl text-[12px] font-bold text-white no-underline transition-all hover:scale-105"
                                        style={{ background: `linear-gradient(135deg, ${accent}, #7C3AED)` }}>
                                        Post a Bounty
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── SPILLS TAB ── */}
                    {activeTab === "Spills" && (
                        <div className="space-y-4">
                            {spills && spills.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {spills.map((spill: { id: string; content?: string; createdAt: string; code?: string; codeLang?: string; tags?: string; likes?: number; comments?: number; shares?: number; views?: number }) => (
                                        <div key={spill.id}
                                            className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm overflow-hidden flex flex-col transition-all"
                                            onMouseEnter={e => (e.currentTarget.style.borderColor = `${accent}40`)}
                                            onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--theme-border)")}>
                                            <div className="p-4 sm:p-5 flex-1">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white text-[9px] font-bold shrink-0">
                                                        {initials}
                                                    </div>
                                                    <div>
                                                        <p className="text-[12px] font-bold text-[var(--theme-text-primary)]">@{username}</p>
                                                        <p className="text-[9px] text-[var(--theme-text-muted)]">{new Date(spill.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <p className="text-[12px] text-[var(--theme-text-secondary)] leading-relaxed mb-3 line-clamp-4">{spill.content}</p>
                                                {spill.code && (
                                                    <div className="rounded-xl bg-[#0D1117] border border-[var(--theme-code-border)] overflow-hidden mb-3">
                                                        <pre className="px-3 py-3 text-[10px] text-green-400 font-mono overflow-hidden h-20 relative" style={{ margin: 0 }}>
                                                            <code>{spill.code}</code>
                                                            <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#0D1117] to-transparent pointer-events-none" />
                                                        </pre>
                                                    </div>
                                                )}
                                                {spill.tags && (
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {spill.tags.split(",").slice(0, 3).map((tag: string) => (
                                                            <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full font-medium"
                                                                style={{ background: `${accent}15`, color: accent }}>
                                                                #{tag.trim()}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="px-4 py-3 border-t border-[var(--theme-border-light)] flex flex-wrap items-center gap-4 text-[11px] text-[var(--theme-text-muted)]"
                                                style={{ background: "var(--theme-bg-secondary)" }}>
                                                <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" /> {spill.likes}</span>
                                                <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" /> {spill.comments}</span>
                                                <span className="flex items-center gap-1"><Share2 className="w-3.5 h-3.5" /> {spill.shares}</span>
                                                <span className="flex items-center gap-1 ml-auto"><Eye className="w-3.5 h-3.5" /> {spill.views}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm p-8 text-center flex flex-col items-center">
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3" style={{ background: `${accent}15` }}>
                                        <MessageSquare className="w-5 h-5" style={{ color: accent }} />
                                    </div>
                                    <h3 className="text-[14px] font-bold text-[var(--theme-text-primary)] mb-1">No Spills Yet</h3>
                                    <p className="text-[12px] text-[var(--theme-text-muted)] mb-3">Share your hiring insights and company culture.</p>
                                    <Link href="/recruiter/spills"
                                        className="px-4 py-2 rounded-xl text-[12px] font-bold text-white no-underline transition-all hover:scale-105"
                                        style={{ background: `linear-gradient(135deg, ${accent}, #7C3AED)` }}>
                                        Create a Spill
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
