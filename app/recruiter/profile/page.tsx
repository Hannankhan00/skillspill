"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
    Building2, MapPin, Globe, Phone, Mail,
    Briefcase, Loader2, Link as LinkIcon, Heart, MessageSquare,
    Share2, Eye, Sparkles, Users, CheckCircle, Pencil, X,
} from "lucide-react";

const accent = "#A855F7";

/* ─── Tiny reusable input for the modal ─── */
function Field({
    label, value, onChange, type = "text", placeholder, textarea = false,
}: {
    label: string; value: string; onChange: (v: string) => void;
    type?: string; placeholder?: string; textarea?: boolean;
}) {
    const cls = "w-full px-3.5 py-2.5 rounded-xl text-[13px] outline-none transition-all focus:ring-2 focus:ring-[#A855F7]/20";
    const style: React.CSSProperties = {
        background: "var(--theme-input-bg)",
        border: "1px solid var(--theme-border)",
        color: "var(--theme-text-primary)",
    };
    return (
        <div>
            <label className="text-[10px] uppercase tracking-widest font-semibold block mb-1.5"
                style={{ color: "var(--theme-text-muted)" }}>{label}</label>
            {textarea
                ? <textarea value={value} onChange={e => onChange(e.target.value)}
                    placeholder={placeholder} rows={4}
                    className={`${cls} resize-none`} style={style} />
                : <input type={type} value={value} onChange={e => onChange(e.target.value)}
                    placeholder={placeholder} className={cls} style={style} />}
        </div>
    );
}

export default function RecruiterProfilePage() {
    const [userData, setUserData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("Overview");
    const tabs = ["Overview", "Jobs", "Spills"];

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

    const { fullName, username, email, recruiterProfile, spills } = userData;
    const { bio, companyName, companyWebsite, city, state, country, phone, industries } = recruiterProfile || {};
    const displayLocation = [city, state, country].filter(Boolean).join(", ");
    const bounties = recruiterProfile?.bounties ?? [];
    const initials = fullName
        ? fullName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
        : "??";
    const displayTitle = companyName || "Company Profile";

    return (
        <div style={{ background: "var(--theme-bg)" }} className="min-h-full">

            {/* ══ EDIT PROFILE MODAL ══ */}
            {showEdit && (
                <div
                    ref={overlayRef}
                    onClick={handleOverlayClick}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}>
                    <div
                        className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl"
                        style={{ background: "var(--theme-card)", border: "1px solid var(--theme-border)" }}>

                        {/* Modal header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--theme-border)]">
                            <div>
                                <h2 className="text-[15px] font-bold text-[var(--theme-text-primary)]">Edit Profile</h2>
                                <p className="text-[11px] text-[var(--theme-text-muted)]">Updates appear on your public profile instantly</p>
                            </div>
                            <button onClick={() => setShowEdit(false)}
                                className="p-1.5 rounded-lg border-none cursor-pointer transition-colors"
                                style={{ background: "var(--theme-bg-secondary)", color: "var(--theme-text-muted)" }}>
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Body — scrollable */}
                        <div className="p-5 space-y-4 overflow-y-auto max-h-[70vh]">

                            {/* Banner */}
                            {saveMsg && (
                                <div className="rounded-xl px-4 py-2.5 text-[12px] font-medium"
                                    style={{
                                        background: saveMsg.type === "ok" ? `${accent}10` : "rgba(239,68,68,0.08)",
                                        border: `1px solid ${saveMsg.type === "ok" ? `${accent}30` : "rgba(239,68,68,0.2)"}`,
                                        color: saveMsg.type === "ok" ? accent : "#EF4444",
                                    }}>
                                    {saveMsg.text}
                                </div>
                            )}

                            {/* Company core */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <Field label="Company Name *" value={form.companyName}
                                    onChange={v => setForm(f => ({ ...f, companyName: v }))}
                                    placeholder="e.g. NastecSol" />
                                <Field label="Company Website" value={form.companyWebsite}
                                    onChange={v => setForm(f => ({ ...f, companyWebsite: v }))}
                                    placeholder="https://yourcompany.com" />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                    <label className="text-[10px] uppercase tracking-widest font-semibold block mb-1.5"
                                        style={{ color: "var(--theme-text-muted)" }}>Company Size</label>
                                    <select value={form.companySize}
                                        onChange={e => setForm(f => ({ ...f, companySize: e.target.value }))}
                                        className="w-full px-3.5 py-2.5 rounded-xl text-[13px] outline-none"
                                        style={{ background: "var(--theme-input-bg)", border: "1px solid var(--theme-border)", color: "var(--theme-text-primary)" }}>
                                        <option value="">Size...</option>
                                        <option value="1-10">1–10</option>
                                        <option value="11-50">11–50</option>
                                        <option value="51-200">51–200</option>
                                        <option value="201-500">201–500</option>
                                        <option value="501-1000">501–1000</option>
                                        <option value="1001+">1001+</option>
                                    </select>
                                    <div className="col-span-1 sm:col-span-2 mt-2">
                                        <h4 className="text-[12px] font-bold text-[var(--theme-text-primary)] mb-2 flex items-center gap-2 border-b border-[var(--theme-border-light)] pb-2">
                                            <MapPin className="w-4 h-4" style={{ color: accent }} />
                                            Company Address
                                        </h4>
                                    </div>
                                    <Field label="Address Line 1" value={form.addressLine1}
                                        onChange={v => setForm(f => ({ ...f, addressLine1: v }))}
                                        placeholder="Street address, P.O. box" />
                                    <Field label="Address Line 2" value={form.addressLine2}
                                        onChange={v => setForm(f => ({ ...f, addressLine2: v }))}
                                        placeholder="Apartment, suite, unit (optional)" />
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

                                <Field label="Company Phone" value={form.phone}
                                    onChange={v => setForm(f => ({ ...f, phone: v }))}
                                    placeholder="+92 300 1234567" />

                                {/* Bio */}
                                <Field label="Company Bio" value={form.bio}
                                    onChange={v => setForm(f => ({ ...f, bio: v }))}
                                    placeholder="Describe your company, culture, and what makes it great..."
                                    textarea />
                            </div>

                            {/* Footer */}
                            <div className="px-5 py-4 border-t border-[var(--theme-border)] flex items-center justify-end gap-2">
                                <button onClick={() => setShowEdit(false)}
                                    className="px-4 py-2 rounded-xl text-[12px] font-medium border-none cursor-pointer"
                                    style={{ background: "var(--theme-bg-secondary)", color: "var(--theme-text-muted)" }}>
                                    Cancel
                                </button>
                                <button onClick={handleSave} disabled={saving}
                                    className="px-5 py-2 rounded-xl text-[12px] font-bold text-white border-none cursor-pointer transition-all hover:scale-105 disabled:opacity-60"
                                    style={{ background: `linear-gradient(135deg, ${accent}, #7C3AED)`, boxShadow: saving ? "none" : `0 4px 15px ${accent}50` }}>
                                    {saving ? "Saving..." : "Save Changes"}
                                </button>
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
                        <p>{"// recruiter.profile"}</p>
                        <p>{`const company = "${companyName || "SkillSpill"}";`}</p>
                        <p>{`const hiring = true;`}</p>
                    </div>
                </div>

                {/* Avatar */}
                <div className="max-w-[900px] mx-auto px-4 sm:px-6">
                    <div className="relative -mt-12 sm:-mt-16 flex items-end gap-4">
                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold border-4 border-[var(--theme-bg)] shadow-xl shrink-0">
                            {initials}
                        </div>
                        <div className="pb-1 sm:pb-2 min-w-0 hidden sm:block">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-xl sm:text-2xl font-bold text-[var(--theme-text-primary)]">{fullName}</h1>
                                <span className="text-[12px] font-medium text-[var(--theme-text-muted)]">@{username}</span>
                            </div>
                            <p className="text-[13px] text-[var(--theme-text-muted)] mt-0.5">{displayTitle}</p>
                            <p className="text-[11px] font-medium flex items-center gap-1 mt-1" style={{ color: accent }}>
                                <Sparkles className="w-3 h-3" /> Recruiter Profile
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

                    {/* ── OVERVIEW TAB ── */}
                    {activeTab === "Overview" && (
                        <>
                            {/* About */}
                            <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm p-4 sm:p-5">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <h2 className="text-[14px] font-bold text-[var(--theme-text-primary)]">About</h2>
                                    <button onClick={() => setShowEdit(true)}
                                        className="flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-lg border-none cursor-pointer transition-colors"
                                        style={{ background: `${accent}10`, color: accent }}>
                                        <Pencil className="w-3 h-3" /> Edit
                                    </button>
                                </div>
                                <p className="text-[13px] text-[var(--theme-text-tertiary)] leading-relaxed whitespace-pre-wrap">
                                    {bio || (
                                        <span className="italic text-[var(--theme-text-muted)]">
                                            No bio yet.{" "}
                                            <button onClick={() => setShowEdit(true)} className="border-none bg-transparent cursor-pointer font-medium underline" style={{ color: accent }}>
                                                Add one
                                            </button>
                                        </span>
                                    )}
                                </p>
                                <div className="flex flex-wrap gap-3 mt-4 text-[11px] text-[var(--theme-text-muted)] pt-3 border-t border-[var(--theme-border-light)]">
                                    {displayLocation && (
                                        <span className="flex items-center gap-1.5">
                                            <MapPin className="w-3.5 h-3.5" />
                                            {displayLocation}
                                        </span>
                                    )}
                                    {companyName && (
                                        <span className="flex items-center gap-1.5 font-medium" style={{ color: accent }}>
                                            <Building2 className="w-3.5 h-3.5" />
                                            {companyName}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Contact & Links */}
                            <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm p-4 sm:p-5">
                                <h2 className="text-[14px] font-bold text-[var(--theme-text-primary)] mb-3 flex items-center gap-2">
                                    <LinkIcon className="w-4 h-4" /> Contact & Links
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {email && (
                                        <a href={`mailto:${email}`}
                                            className="flex items-center gap-3 p-3 rounded-xl hover:opacity-80 transition-colors border group no-underline"
                                            style={{ background: "var(--theme-bg-secondary)", borderColor: "var(--theme-border-light)" }}
                                            onMouseEnter={e => (e.currentTarget.style.borderColor = `${accent}40`)}
                                            onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--theme-border-light)")}>
                                            <Mail className="w-5 h-5 text-[var(--theme-text-secondary)]" />
                                            <div>
                                                <p className="text-[12px] font-bold text-[var(--theme-text-primary)]">Email</p>
                                                <p className="text-[10px] text-[var(--theme-text-muted)]">{email}</p>
                                            </div>
                                        </a>
                                    )}
                                    {phone && (
                                        <a href={`tel:${phone}`}
                                            className="flex items-center gap-3 p-3 rounded-xl hover:opacity-80 transition-colors border group no-underline"
                                            style={{ background: "var(--theme-bg-secondary)", borderColor: "var(--theme-border-light)" }}
                                            onMouseEnter={e => (e.currentTarget.style.borderColor = `${accent}40`)}
                                            onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--theme-border-light)")}>
                                            <Phone className="w-5 h-5 text-[var(--theme-text-secondary)]" />
                                            <div>
                                                <p className="text-[12px] font-bold text-[var(--theme-text-primary)]">Phone</p>
                                                <p className="text-[10px] text-[var(--theme-text-muted)]">{phone}</p>
                                            </div>
                                        </a>
                                    )}
                                    {companyWebsite && (
                                        <a href={companyWebsite.startsWith("http") ? companyWebsite : `https://${companyWebsite}`}
                                            target="_blank" rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-3 rounded-xl hover:opacity-80 transition-colors border group no-underline"
                                            style={{ background: "var(--theme-bg-secondary)", borderColor: "var(--theme-border-light)" }}
                                            onMouseEnter={e => (e.currentTarget.style.borderColor = `${accent}40`)}
                                            onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--theme-border-light)")}>
                                            <Globe className="w-5 h-5 text-[var(--theme-text-secondary)]" />
                                            <div>
                                                <p className="text-[12px] font-bold text-[var(--theme-text-primary)]">Website</p>
                                                <p className="text-[10px] text-[var(--theme-text-muted)]">{companyWebsite.replace(/^https?:\/\//, "")}</p>
                                            </div>
                                        </a>
                                    )}
                                    {!email && !phone && !companyWebsite && (
                                        <p className="text-[12px] text-[var(--theme-text-muted)] col-span-2">
                                            No contact info yet.{" "}
                                            <button onClick={() => setShowEdit(true)} className="border-none bg-transparent cursor-pointer font-medium underline" style={{ color: accent }}>
                                                Add some
                                            </button>
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Industries */}
                            {industries && industries.length > 0 && (
                                <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm p-4 sm:p-5">
                                    <h2 className="text-[14px] font-bold text-[var(--theme-text-primary)] mb-3 flex items-center gap-2">
                                        <Users className="w-4 h-4" style={{ color: accent }} /> Industries & Specialties
                                    </h2>
                                    <div className="flex flex-wrap gap-2">
                                        {industries.map((ind: any) => (
                                            <span key={ind.id || ind.industryName}
                                                className="px-3 py-1.5 rounded-lg text-[11px] sm:text-[12px] font-medium border flex items-center gap-1.5"
                                                style={{ background: "var(--theme-input-bg)", borderColor: "var(--theme-border-light)", color: "var(--theme-text-secondary)" }}>
                                                <CheckCircle className="w-3 h-3" style={{ color: accent }} />
                                                {ind.industryName}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}

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
