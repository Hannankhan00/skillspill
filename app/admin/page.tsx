"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

/* ═══════════════════════════════════════════
   DESIGN TOKENS
   ═══════════════════════════════════════════ */
const T = {
    bg: "#102122",
    sidebar: "#0c1a1b",
    card: "#162a2b",
    cardBorder: "#1e3536",
    admin: "#0DD5E7",
    talent: "#39FF14",
    recruiter: "#7B2FFF",
    danger: "#E8294A",
    textPrimary: "#F0F0F0",
    textSecondary: "#6B8A8C",
};

const mono: React.CSSProperties = { fontFamily: "var(--font-jetbrains-mono, 'JetBrains Mono', monospace)" };
const sans: React.CSSProperties = { fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)" };

/* ═══════════════════════════════════════════
   SVG ICONS (inline, no deps)
   ═══════════════════════════════════════════ */
const I = {
    bolt: (s = 18) => <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>,
    grid: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>,
    users: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
    userPlus: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" /></svg>,
    shield: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
    activity: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>,
    heart: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>,
    search: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
    logout: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>,
    calendar: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
    download: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>,
    eye: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>,
    eyeOff: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>,
    check: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>,
    x: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
    chevDown: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>,
    arrowUp: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 15 12 9 6 15" /></svg>,
    arrowDown: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>,
    server: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" /><rect x="2" y="14" width="20" height="8" rx="2" /><line x1="6" y1="6" x2="6.01" y2="6" /><line x1="6" y1="18" x2="6.01" y2="18" /></svg>,
};

/* ═══════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════ */
interface User { id: string; email: string; username: string | null; fullName: string; role: "TALENT" | "RECRUITER" | "ADMIN"; isActive: boolean; emailVerified: boolean; lastLoginAt: string | null; createdAt: string; }
interface Pagination { total: number; page: number; limit: number; totalPages: number; }

/* ═══════════════════════════════════════════
   ROLE BADGE
   ═══════════════════════════════════════════ */
function RoleBadge({ role }: { role: string }) {
    const c: Record<string, string> = { ADMIN: T.admin, TALENT: T.talent, RECRUITER: T.recruiter };
    const color = c[role] || T.admin;
    return (
        <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-[1.5px] inline-flex items-center gap-1.5"
            style={{ background: `${color}15`, color, border: `1px solid ${color}25`, ...mono }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />{role}
        </span>
    );
}

/* ═══════════════════════════════════════════
   CHART SVG (Platform Vitality)
   ═══════════════════════════════════════════ */
function VitalityChart() {
    const path = "M0,120 C40,100 60,110 100,80 C140,50 160,90 200,60 C240,30 260,70 300,40 C340,10 360,50 400,30 C440,50 480,20 520,45 C560,70 600,30 640,50 C680,70 720,40 760,60 C800,80 820,50 860,70";
    const areaPath = path + " L860,180 L0,180 Z";
    return (
        <svg viewBox="0 0 860 180" className="w-full h-full" preserveAspectRatio="none">
            <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={T.admin} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={T.admin} stopOpacity="0.02" />
                </linearGradient>
            </defs>
            <path d={areaPath} fill="url(#chartGrad)" />
            <path d={path} fill="none" stroke={T.admin} strokeWidth="2.5" strokeLinecap="round" />
            {/* Glow line */}
            <path d={path} fill="none" stroke={T.admin} strokeWidth="6" strokeLinecap="round" opacity="0.15" />
        </svg>
    );
}

/* ═══════════════════════════════════════════
   PROGRESS BAR
   ═══════════════════════════════════════════ */
function ProgressBar({ value, color, label, metric }: { value: number; color: string; label: string; metric: string }) {
    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: T.textSecondary, ...mono }}>{label}</span>
                <span className="text-[10px] font-bold" style={{ color, ...mono }}>{metric}</span>
            </div>
            <div className="w-full h-1.5 rounded-full" style={{ background: `${T.cardBorder}` }}>
                <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${value}%`, background: color, boxShadow: `0 0 8px ${color}50` }} />
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════
   MAIN ADMIN PAGE
   ═══════════════════════════════════════════ */
export default function AdminPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"dashboard" | "users">("dashboard");
    const [users, setUsers] = useState<User[]>([]);
    const [pagination, setPagination] = useState<Pagination>({ total: 0, page: 1, limit: 20, totalPages: 0 });
    const [usersLoading, setUsersLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("");

    const fetchUsers = useCallback(async (page = 1) => {
        setUsersLoading(true);
        try {
            const params = new URLSearchParams({ page: String(page), limit: "20" });
            if (roleFilter) params.set("role", roleFilter);
            if (searchQuery) params.set("search", searchQuery);
            const res = await fetch(`/api/admin/users?${params}`);
            const data = await res.json();
            if (res.ok) { setUsers(data.users); setPagination(data.pagination); }
        } catch { console.error("Failed to fetch users"); }
        finally { setUsersLoading(false); }
    }, [roleFilter, searchQuery]);

    useEffect(() => { if (activeTab === "users" || activeTab === "dashboard") fetchUsers(); }, [activeTab, fetchUsers]);



    const toggleActive = async (userId: string, cur: boolean) => {
        try {
            const res = await fetch(`/api/admin/users/${userId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isActive: !cur }) });
            const data = await res.json();
            if (res.ok) setUsers((p) => p.map((u) => u.id === userId ? { ...u, isActive: !cur } : u));
            else alert(data.error || "Failed");
        } catch { alert("Network error"); }
    };

    const totalUsers = pagination.total;
    const adminCount = users.filter((u) => u.role === "ADMIN").length;
    const talentCount = users.filter((u) => u.role === "TALENT").length;
    const recruiterCount = users.filter((u) => u.role === "RECRUITER").length;
    const roleColor = (r: string) => r === "ADMIN" ? T.admin : r === "TALENT" ? T.talent : T.recruiter;

    const navItems = [
        { key: "dashboard" as const, icon: I.grid(), label: "Overview" },
        { key: "users" as const, icon: I.users(), label: "User Management" },
    ];

    const timeLabels = ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "23:59"];
    const logLines = [
        { type: "OK", color: T.talent, text: "Node-04 synced with global cluster." },
        { type: "INFO", color: T.admin, text: "Session refresh executed for admin." },
        { type: "WARN", color: "#F59E0B", text: `Unauthorized API attempt from 192.168.${Math.floor(Math.random() * 255)}.x` },
    ];

    return (
        // Outer glow container
        <div className="h-screen w-screen p-1.5" style={{ background: `linear-gradient(135deg, ${T.admin}40, ${T.recruiter}40, ${T.admin}40)` }}>
            <div className="flex h-full w-full rounded-2xl overflow-hidden" style={{ background: T.bg }}>

                {/* ═══════════ SIDEBAR ═══════════ */}
                <aside className="hidden lg:flex flex-col w-[200px] shrink-0 border-r" style={{ background: T.sidebar, borderColor: T.cardBorder }}>
                    {/* Logo */}
                    <div className="px-5 pt-5 pb-4 flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: T.admin, boxShadow: `0 0 16px ${T.admin}40` }}>
                            {I.bolt(16)}
                        </div>
                        <div>
                            <div className="text-[13px] font-bold" style={{ color: T.textPrimary, ...sans }}>SkillSpill</div>
                            <div className="text-[8px] uppercase tracking-[2px] font-bold" style={{ color: T.admin, ...mono }}>Admin Nexus</div>
                        </div>
                    </div>

                    {/* Nav */}
                    <nav className="flex flex-col gap-1 px-3 py-2 flex-1">
                        {navItems.map((item) => (
                            <button key={item.key} onClick={() => setActiveTab(item.key)}
                                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200 border-none cursor-pointer w-full text-left"
                                style={{ ...sans, ...(activeTab === item.key ? { background: `${T.admin}20`, color: T.admin } : { background: "transparent", color: T.textSecondary }) }}
                                id={`admin-nav-${item.key}`}>
                                {item.icon}<span>{item.label}</span>
                            </button>
                        ))}
                        <button className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] font-medium border-none cursor-default w-full text-left"
                            style={{ ...sans, background: "transparent", color: T.textSecondary }}>
                            {I.server()}<span>System Health</span>
                        </button>
                    </nav>

                    {/* System Uptime */}
                    <div className="px-5 pb-3">
                        <div className="text-[9px] uppercase tracking-[1.5px] mb-1" style={{ color: T.textSecondary, ...mono }}>System Uptime</div>
                        <div className="text-xl font-bold" style={{ color: T.admin, ...mono }}>99.998%</div>
                    </div>

                    {/* Terminate */}
                    <div className="px-3 pb-4">
                        <button onClick={async () => { await fetch("/api/auth/logout", { method: "POST" }); router.push("/login"); }}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-semibold w-full border-none cursor-pointer transition-all"
                            style={{ background: "transparent", color: T.danger, ...sans }} id="admin-logout">
                            {I.logout()}<span>Terminate Session</span>
                        </button>
                    </div>
                </aside>

                {/* ═══════════ MAIN ═══════════ */}
                <main className="flex-1 overflow-y-auto">
                    {/* Top header bar */}
                    <div className="flex items-center justify-between px-6 md:px-8 py-5 border-b" style={{ borderColor: T.cardBorder }}>
                        <div>
                            <h1 className="text-xl font-bold" style={{ color: T.textPrimary, ...sans }}>
                                {activeTab === "dashboard" ? "Executive Dashboard" : "User Management"}
                            </h1>
                            <p className="text-[12px] mt-0.5" style={{ color: T.textSecondary, ...sans }}>
                                {activeTab === "dashboard" ? "Real-time platform vitality and administrative control." : "Browse, search, and manage user accounts."}
                            </p>
                        </div>
                        <div className="hidden sm:flex items-center gap-2">
                            <button className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-[11px] font-semibold border cursor-pointer"
                                style={{ background: "transparent", borderColor: T.cardBorder, color: T.textSecondary, ...mono }}>
                                {I.calendar()}<span>Last 24 Hours</span>
                            </button>
                            <button className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-[11px] font-bold border-none cursor-pointer"
                                style={{ background: T.admin, color: "#0a1415", ...mono }}>
                                {I.download()}<span>Export Intelligence</span>
                            </button>
                        </div>
                        {/* Mobile nav */}
                        <div className="flex lg:hidden gap-1.5">
                            {navItems.map((item) => (
                                <button key={item.key} onClick={() => setActiveTab(item.key)}
                                    className="p-2 rounded-lg border cursor-pointer transition-all"
                                    style={activeTab === item.key ? { background: `${T.admin}20`, color: T.admin, borderColor: `${T.admin}40` } : { background: "transparent", color: T.textSecondary, borderColor: T.cardBorder }}>
                                    {item.icon}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="px-6 md:px-8 py-6">

                        {/* ══════════ DASHBOARD TAB ══════════ */}
                        {activeTab === "dashboard" && (
                            <div className="flex flex-col gap-5">
                                {/* Platform Vitality Chart */}
                                <div className="rounded-xl p-5 pb-2" style={{ background: T.card, border: `1px solid ${T.cardBorder}` }}>
                                    <div className="flex items-start justify-between mb-1">
                                        <div>
                                            <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: T.textPrimary, ...sans }}>
                                                {I.activity()} Platform Vitality
                                            </h3>
                                            <p className="text-[11px] mt-0.5" style={{ color: T.textSecondary, ...sans }}>Active global connections &amp; throughput</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold" style={{ color: T.admin, ...mono }}>{totalUsers > 0 ? `${totalUsers}` : "—"}</div>
                                            <div className="text-[10px] font-bold flex items-center gap-0.5 justify-end" style={{ color: T.talent, ...mono }}>
                                                {I.arrowUp()} +12.5%
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-[160px] -mx-2 mt-2"><VitalityChart /></div>
                                    <div className="flex justify-between mt-1 px-1">
                                        {timeLabels.map((t) => <span key={t} className="text-[9px]" style={{ color: T.textSecondary, ...mono }}>{t}</span>)}
                                    </div>
                                </div>

                                {/* Stat Cards */}
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    {[
                                        { label: "Total Users", value: totalUsers, delta: "+18%", up: true, color: T.admin },
                                        { label: "Admins", value: adminCount, delta: "+5%", up: true, color: T.admin },
                                        { label: "Talent", value: talentCount, delta: "+8%", up: true, color: T.talent },
                                        { label: "Recruiters", value: recruiterCount, delta: "+12%", up: true, color: T.recruiter },
                                    ].map((s) => (
                                        <div key={s.label} className="rounded-xl p-5" style={{ background: T.card, border: `1px solid ${T.cardBorder}` }}>
                                            <div className="text-[10px] uppercase tracking-[1.5px] font-bold mb-3" style={{ color: T.textSecondary, ...mono }}>{s.label}</div>
                                            <div className="flex items-end justify-between">
                                                <div className="text-2xl font-bold" style={{ color: T.textPrimary, ...mono }}>{s.value}</div>
                                                <span className="text-[10px] font-bold flex items-center gap-0.5" style={{ color: s.up ? T.talent : T.danger, ...mono }}>
                                                    {s.up ? I.arrowUp() : I.arrowDown()} {s.delta}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Bottom row: Recent Users + System Health */}
                                <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
                                    {/* Recent Users (3 cols) */}
                                    <div className="lg:col-span-3 rounded-xl" style={{ background: T.card, border: `1px solid ${T.cardBorder}` }}>
                                        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: T.cardBorder }}>
                                            <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: T.textPrimary, ...sans }}>
                                                {I.activity()} Recent Users
                                            </h3>
                                            <span className="px-2 py-0.5 rounded text-[9px] font-bold" style={{ background: `${T.admin}15`, color: T.admin, ...mono }}>
                                                {users.length} USERS
                                            </span>
                                        </div>
                                        <div className="divide-y" style={{ borderColor: T.cardBorder }}>
                                            {users.slice(0, 4).map((u) => (
                                                <div key={u.id} className="flex items-center justify-between px-5 py-3.5 transition-all hover:bg-white/[0.02]">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-lg flex items-center justify-center text-[10px] font-bold text-white" style={{ background: roleColor(u.role), ...mono }}>
                                                            {u.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className="text-[13px] font-medium" style={{ color: T.textPrimary, ...sans }}>{u.fullName}</div>
                                                            <div className="text-[10px]" style={{ color: T.textSecondary, ...mono }}>
                                                                Joined {new Date(u.createdAt).toLocaleDateString()} • @{u.username || u.email.split("@")[0]}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <RoleBadge role={u.role} />
                                                        <button onClick={() => toggleActive(u.id, u.isActive)}
                                                            className="px-2.5 py-1 rounded text-[9px] font-bold uppercase border cursor-pointer transition-all"
                                                            style={u.isActive
                                                                ? { background: `${T.talent}15`, borderColor: `${T.talent}30`, color: T.talent, ...mono }
                                                                : { background: `${T.danger}15`, borderColor: `${T.danger}30`, color: T.danger, ...mono }
                                                            }>{u.isActive ? "Active" : "Disabled"}</button>
                                                    </div>
                                                </div>
                                            ))}
                                            {users.length === 0 && !usersLoading && (
                                                <div className="text-center py-10 text-sm" style={{ color: T.textSecondary }}>No users found</div>
                                            )}
                                            {usersLoading && (
                                                <div className="text-center py-10 text-sm" style={{ color: T.textSecondary }}>
                                                    <span className="inline-block w-4 h-4 border-2 rounded-full animate-spin mr-2 align-middle" style={{ borderColor: `${T.admin}30`, borderTopColor: T.admin }} />Loading...
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* System Health (2 cols) */}
                                    <div className="lg:col-span-2 rounded-xl" style={{ background: T.card, border: `1px solid ${T.cardBorder}` }}>
                                        <div className="px-5 py-4 border-b" style={{ borderColor: T.cardBorder }}>
                                            <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: T.textPrimary, ...sans }}>{I.server()} System Health</h3>
                                        </div>
                                        <div className="p-5 flex flex-col gap-4">
                                            <ProgressBar label="Mainframe Load" value={24} color={T.admin} metric="24%" />
                                            <ProgressBar label="Database Latency" value={8} color={T.talent} metric="12ms" />
                                            <ProgressBar label="Storage API" value={68} color={T.recruiter} metric="68%" />
                                        </div>
                                        <div className="px-5 pb-5">
                                            <div className="text-[9px] uppercase tracking-[1.5px] font-bold mb-2.5" style={{ color: T.textSecondary, ...mono }}>Live Log Stream</div>
                                            <div className="flex flex-col gap-1.5 rounded-lg p-3" style={{ background: T.sidebar }}>
                                                {logLines.map((l, i) => (
                                                    <div key={i} className="text-[10px] leading-relaxed" style={{ ...mono }}>
                                                        <span className="font-bold" style={{ color: l.color }}>[{l.type}]</span>{" "}
                                                        <span style={{ color: T.textSecondary }}>{l.text}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ══════════ USERS TAB ══════════ */}
                        {activeTab === "users" && (
                            <div className="flex flex-col gap-5">
                                <div className="rounded-xl p-5" style={{ background: T.card, border: `1px solid ${T.cardBorder}` }}>
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <div className="flex-1 flex items-center gap-3 rounded-lg px-4 py-2.5" style={{ background: T.bg, border: `1px solid ${T.cardBorder}` }}>
                                            {I.search()}
                                            <input type="text" placeholder="Search by name, email, or username..." value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && fetchUsers()}
                                                className="flex-1 bg-transparent border-none outline-none text-sm" style={{ color: T.textPrimary, ...mono }} id="admin-user-search" />
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="relative">
                                                <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} id="admin-role-filter"
                                                    className="appearance-none rounded-lg px-4 py-2.5 pr-8 text-sm cursor-pointer outline-none"
                                                    style={{ background: T.bg, border: `1px solid ${T.cardBorder}`, color: T.textPrimary, ...mono }}>
                                                    <option value="">All Roles</option><option value="ADMIN">Admin</option><option value="TALENT">Talent</option><option value="RECRUITER">Recruiter</option>
                                                </select>
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: T.textSecondary }}>{I.chevDown()}</span>
                                            </div>
                                            <button onClick={() => fetchUsers()} className="px-5 py-2.5 rounded-lg text-sm font-bold border-none cursor-pointer" style={{ background: T.admin, color: "#0a1415", ...mono }} id="admin-search-btn">Search</button>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 mt-3 flex-wrap">
                                        {[{ l: "All", v: "", c: T.admin }, { l: "Admin", v: "ADMIN", c: T.admin }, { l: "Talent", v: "TALENT", c: T.talent }, { l: "Recruiter", v: "RECRUITER", c: T.recruiter }].map((tag) => (
                                            <button key={tag.v} onClick={() => { setRoleFilter(tag.v); setTimeout(() => fetchUsers(), 0); }}
                                                className="px-3 py-1.5 rounded-md text-[11px] font-bold border-none cursor-pointer transition-all"
                                                style={roleFilter === tag.v ? { background: tag.c, color: "#0a1415", ...mono } : { background: T.cardBorder, color: T.textSecondary, ...mono }}>{tag.l}</button>
                                        ))}
                                    </div>
                                </div>
                                <div className="rounded-xl overflow-hidden" style={{ background: T.card, border: `1px solid ${T.cardBorder}` }}>
                                    <table className="w-full text-left">
                                        <thead><tr style={{ borderBottom: `1px solid ${T.cardBorder}` }}>
                                            {["User", "Role", "Status", "Last Login", "Joined", "Actions"].map((h, i) => (
                                                <th key={h} className={`text-[10px] uppercase tracking-[1.5px] font-bold py-3.5 px-5 ${i >= 3 && i < 5 ? "hidden lg:table-cell" : ""} ${i === 5 ? "text-right" : ""}`}
                                                    style={{ color: T.textSecondary, ...mono }}>{h}</th>
                                            ))}
                                        </tr></thead>
                                        <tbody>
                                            {users.map((u) => (
                                                <tr key={u.id} className="group transition-all" style={{ borderBottom: `1px solid ${T.cardBorder}20` }}>
                                                    <td className="py-3.5 px-5 group-hover:bg-white/[0.02]">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-[10px] font-bold text-white shrink-0" style={{ background: roleColor(u.role), ...mono }}>
                                                                {u.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <div className="text-[13px] font-medium" style={{ color: T.textPrimary, ...sans }}>{u.fullName}</div>
                                                                <div className="text-[10px]" style={{ color: T.textSecondary, ...mono }}>{u.email}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-3.5 px-5 group-hover:bg-white/[0.02]"><RoleBadge role={u.role} /></td>
                                                    <td className="py-3.5 px-5 group-hover:bg-white/[0.02]">
                                                        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: u.isActive ? T.talent : "#555", ...mono }}>{u.isActive ? "Active" : "Disabled"}</span>
                                                    </td>
                                                    <td className="py-3.5 px-5 hidden lg:table-cell group-hover:bg-white/[0.02]"><span className="text-[10px]" style={{ color: T.textSecondary, ...mono }}>{u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString() : "Never"}</span></td>
                                                    <td className="py-3.5 px-5 hidden lg:table-cell group-hover:bg-white/[0.02]"><span className="text-[10px]" style={{ color: T.textSecondary, ...mono }}>{new Date(u.createdAt).toLocaleDateString()}</span></td>
                                                    <td className="py-3.5 px-5 text-right group-hover:bg-white/[0.02]">
                                                        <button onClick={() => toggleActive(u.id, u.isActive)}
                                                            className="px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider border cursor-pointer transition-all"
                                                            style={u.isActive ? { background: `${T.danger}15`, borderColor: `${T.danger}30`, color: T.danger, ...mono } : { background: `${T.talent}15`, borderColor: `${T.talent}30`, color: T.talent, ...mono }}>
                                                            {u.isActive ? "Disable" : "Enable"}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {users.length === 0 && !usersLoading && <tr><td colSpan={6} className="text-center py-12 text-sm" style={{ color: T.textSecondary }}>No users found</td></tr>}
                                            {usersLoading && <tr><td colSpan={6} className="text-center py-12 text-sm" style={{ color: T.textSecondary }}>
                                                <span className="inline-block w-4 h-4 border-2 rounded-full animate-spin mr-2 align-middle" style={{ borderColor: `${T.admin}30`, borderTopColor: T.admin }} />Loading...
                                            </td></tr>}
                                        </tbody>
                                    </table>
                                    {pagination.totalPages > 1 && (
                                        <div className="flex items-center justify-between px-5 py-3 border-t" style={{ borderColor: T.cardBorder }}>
                                            <span className="text-[10px]" style={{ color: T.textSecondary, ...mono }}>Page {pagination.page}/{pagination.totalPages}</span>
                                            <div className="flex gap-2">
                                                <button onClick={() => fetchUsers(pagination.page - 1)} disabled={pagination.page <= 1} className="px-3 py-1.5 rounded-md text-xs border cursor-pointer disabled:opacity-30" style={{ background: "transparent", borderColor: T.cardBorder, color: T.textSecondary, ...mono }}>← Prev</button>
                                                <button onClick={() => fetchUsers(pagination.page + 1)} disabled={pagination.page >= pagination.totalPages} className="px-3 py-1.5 rounded-md text-xs border cursor-pointer disabled:opacity-30" style={{ background: "transparent", borderColor: T.cardBorder, color: T.textSecondary, ...mono }}>Next →</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}


                    </div>
                </main>
            </div>

            {/* Mobile bottom nav */}
            <div className="fixed bottom-0 left-0 right-0 lg:hidden border-t z-50" style={{ background: T.sidebar, borderColor: T.cardBorder }}>
                <div className="flex items-center justify-around py-2 max-w-md mx-auto">
                    {navItems.map((item) => (
                        <button key={item.key} onClick={() => setActiveTab(item.key)}
                            className="flex flex-col items-center gap-0.5 py-2 px-3 rounded-lg border-none cursor-pointer transition-all"
                            style={activeTab === item.key ? { color: T.admin, background: `${T.admin}15` } : { color: T.textSecondary, background: "transparent" }}>
                            {item.icon}<span className="text-[9px] font-semibold">{item.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
