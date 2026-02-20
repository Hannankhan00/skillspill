"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

/* ═══════════════════════════════════════════════════
   ICONS
   ═══════════════════════════════════════════════════ */
const IconShield = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
);
const IconUsers = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
);
const IconUserPlus = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" /></svg>
);
const IconDashboard = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
);
const IconBolt = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
);
const IconSearch = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
);
const IconChevDown = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
);
const IconCheck = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
);
const IconX = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
);
const IconLogout = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
);
const IconActivity = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
);
const IconEye = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
);
const IconEyeOff = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
);
const IconRefresh = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>
);

/* ═══════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════ */
interface User {
    id: string;
    email: string;
    username: string | null;
    fullName: string;
    role: "TALENT" | "RECRUITER" | "ADMIN";
    isActive: boolean;
    emailVerified: boolean;
    lastLoginAt: string | null;
    createdAt: string;
}

interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

/* ═══════════════════════════════════════════════════
   ROLE BADGE COMPONENT
   ═══════════════════════════════════════════════════ */
function RoleBadge({ role }: { role: string }) {
    const config: Record<string, { bg: string; text: string; border: string; glow: string }> = {
        ADMIN: { bg: "rgba(255,0,60,0.08)", text: "#FF003C", border: "rgba(255,0,60,0.2)", glow: "0 0 8px rgba(255,0,60,0.15)" },
        TALENT: { bg: "rgba(60,249,26,0.08)", text: "#3CF91A", border: "rgba(60,249,26,0.2)", glow: "0 0 8px rgba(60,249,26,0.15)" },
        RECRUITER: { bg: "rgba(168,85,247,0.08)", text: "#A855F7", border: "rgba(168,85,247,0.2)", glow: "0 0 8px rgba(168,85,247,0.15)" },
    };
    const c = config[role] || config.TALENT;
    return (
        <span
            className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-[1.5px] inline-flex items-center gap-1.5"
            style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}`, boxShadow: c.glow, fontFamily: "var(--font-jetbrains-mono), monospace" }}
        >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.text }} />
            {role}
        </span>
    );
}

/* ═══════════════════════════════════════════════════
   MAIN ADMIN PAGE
   ═══════════════════════════════════════════════════ */
export default function AdminPage() {
    const router = useRouter();
    const mono: React.CSSProperties = { fontFamily: "var(--font-jetbrains-mono, 'JetBrains Mono', monospace)" };

    // ── State ──
    const [activeTab, setActiveTab] = useState<"dashboard" | "users" | "create">("dashboard");
    const [users, setUsers] = useState<User[]>([]);
    const [pagination, setPagination] = useState<Pagination>({ total: 0, page: 1, limit: 20, totalPages: 0 });
    const [usersLoading, setUsersLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("");

    // Create form
    const [formData, setFormData] = useState({ fullName: "", email: "", password: "", role: "ADMIN" });
    const [showPassword, setShowPassword] = useState(false);
    const [creating, setCreating] = useState(false);
    const [formError, setFormError] = useState("");
    const [formSuccess, setFormSuccess] = useState("");

    // ── Fetch Users ──
    const fetchUsers = useCallback(async (page = 1) => {
        setUsersLoading(true);
        try {
            const params = new URLSearchParams({ page: String(page), limit: "20" });
            if (roleFilter) params.set("role", roleFilter);
            if (searchQuery) params.set("search", searchQuery);

            const res = await fetch(`/api/admin/users?${params}`);
            const data = await res.json();
            if (res.ok) {
                setUsers(data.users);
                setPagination(data.pagination);
            }
        } catch {
            console.error("Failed to fetch users");
        } finally {
            setUsersLoading(false);
        }
    }, [roleFilter, searchQuery]);

    useEffect(() => {
        if (activeTab === "users" || activeTab === "dashboard") {
            fetchUsers();
        }
    }, [activeTab, fetchUsers]);

    // ── Create User ──
    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError("");
        setFormSuccess("");

        if (!formData.fullName.trim()) { setFormError("Full name is required"); return; }
        if (!formData.email.trim()) { setFormError("Email is required"); return; }
        if (formData.password.length < 8) { setFormError("Password must be at least 8 characters"); return; }

        setCreating(true);
        try {
            const res = await fetch("/api/admin/create-user", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (!res.ok) {
                setFormError(data.error || "Failed to create user");
                return;
            }
            setFormSuccess(`✓ ${data.user.role} account created — ${data.user.email}`);
            setFormData({ fullName: "", email: "", password: "", role: "ADMIN" });
            // Refresh users
            fetchUsers();
        } catch {
            setFormError("Network error. Try again.");
        } finally {
            setCreating(false);
        }
    };

    // ── Toggle User Active Status ──
    const toggleActive = async (userId: string, currentStatus: boolean) => {
        try {
            const res = await fetch(`/api/admin/users/${userId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: !currentStatus }),
            });
            const data = await res.json();
            if (res.ok) {
                setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, isActive: !currentStatus } : u)));
            } else {
                alert(data.error || "Failed to update");
            }
        } catch {
            alert("Network error");
        }
    };

    // ── Stats ──
    const totalUsers = pagination.total;
    const adminCount = users.filter((u) => u.role === "ADMIN").length;
    const talentCount = users.filter((u) => u.role === "TALENT").length;
    const recruiterCount = users.filter((u) => u.role === "RECRUITER").length;
    const activeCount = users.filter((u) => u.isActive).length;

    // ── Sidebar Nav Items ──
    const navItems = [
        { key: "dashboard" as const, icon: <IconDashboard />, label: "Overview" },
        { key: "users" as const, icon: <IconUsers />, label: "User Management" },
        { key: "create" as const, icon: <IconUserPlus />, label: "Create Account" },
    ];

    return (
        <div className="flex h-screen overflow-hidden bg-[#060608] text-white">

            {/* ═══════════════ LEFT SIDEBAR ═══════════════ */}
            <aside className="hidden lg:flex flex-col w-[270px] shrink-0 border-r border-white/[0.06] p-4 gap-2 overflow-y-auto">

                {/* Brand */}
                <div className="rounded-2xl p-5 mb-3" style={{ background: "rgba(255,0,60,0.03)", border: "1px solid rgba(255,0,60,0.08)", backdropFilter: "blur(20px)" }}>
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{ background: "linear-gradient(135deg, #FF003C, #cc0030)", boxShadow: "0 0 16px rgba(255,0,60,0.35)" }}>
                            <IconBolt />
                        </div>
                        <div>
                            <div className="font-bold text-white text-sm">SkillSpill</div>
                            <div className="text-[10px] text-[#FF003C] uppercase tracking-[2px] font-semibold">Admin Console</div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex flex-col gap-1">
                        {navItems.map((item) => (
                            <button
                                key={item.key}
                                onClick={() => setActiveTab(item.key)}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border-none cursor-pointer w-full text-left
                                    ${activeTab === item.key
                                        ? "text-white shadow-[0_0_10px_rgba(255,0,60,0.3)]"
                                        : "bg-transparent text-[#888] hover:text-white hover:bg-white/5"
                                    }`}
                                style={activeTab === item.key ? { background: "#FF003C" } : {}}
                                id={`admin-nav-${item.key}`}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* System Status */}
                <div className="liquid-glass rounded-2xl p-4 mt-auto">
                    <div className="flex items-center gap-2 mb-3">
                        <IconShield />
                        <span className="text-xs font-bold text-[#FF003C] uppercase tracking-wider">System Status</span>
                    </div>
                    <div className="flex flex-col gap-2">
                        {[
                            { label: "Auth Gateway", status: "ONLINE", color: "#3CF91A" },
                            { label: "Database", status: "CONNECTED", color: "#3CF91A" },
                            { label: "Admin Module", status: "ACTIVE", color: "#FF003C" },
                        ].map((s) => (
                            <div key={s.label} className="flex items-center justify-between">
                                <span className="text-[10px] text-[#666]" style={mono}>{s.label}</span>
                                <span className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.color, boxShadow: `0 0 4px ${s.color}55` }} />
                                    <span className="text-[9px] font-bold uppercase tracking-wider" style={{ ...mono, color: s.color }}>{s.status}</span>
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Logout */}
                <form action="/api/auth/logout" method="POST" className="mt-2">
                    <button type="submit" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#FF003C] bg-transparent border border-[#FF003C]/20 cursor-pointer w-full hover:bg-[#FF003C]/10 transition-all" id="admin-logout">
                        <IconLogout />
                        <span>Disconnect</span>
                    </button>
                </form>
            </aside>

            {/* ═══════════════ MAIN CONTENT ═══════════════ */}
            <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6">

                {/* ── Top Bar ── */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                            <span className="w-1.5 h-7 bg-[#FF003C] rounded-full" />
                            {activeTab === "dashboard" && "Admin Overview"}
                            {activeTab === "users" && "User Management"}
                            {activeTab === "create" && "Create Account"}
                        </h1>
                        <p className="text-sm text-[#555] mt-1" style={mono}>
                            {activeTab === "dashboard" && "system_monitor :: role_control_panel"}
                            {activeTab === "users" && "user_registry :: browse + manage"}
                            {activeTab === "create" && "provision_account :: role_assignment"}
                        </p>
                    </div>

                    {/* Mobile nav */}
                    <div className="flex lg:hidden gap-2">
                        {navItems.map((item) => (
                            <button
                                key={item.key}
                                onClick={() => setActiveTab(item.key)}
                                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${activeTab === item.key
                                    ? "bg-[#FF003C] text-white border-[#FF003C]/50"
                                    : "bg-transparent text-[#555] border-white/10 hover:text-white"
                                    }`}
                            >
                                {item.icon}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ══════════════════════════════════════════
                   DASHBOARD TAB
                   ══════════════════════════════════════════ */}
                {activeTab === "dashboard" && (
                    <div className="flex flex-col gap-6">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { label: "Total Users", value: totalUsers, accent: "#FF003C", icon: <IconUsers /> },
                                { label: "Admins", value: adminCount, accent: "#FF003C", icon: <IconShield /> },
                                { label: "Talent", value: talentCount, accent: "#3CF91A", icon: <IconActivity /> },
                                { label: "Recruiters", value: recruiterCount, accent: "#A855F7", icon: <IconUsers /> },
                            ].map((stat) => (
                                <div key={stat.label} className="liquid-glass rounded-2xl p-5 group hover:border-white/10 transition-all">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-[10px] text-[#666] uppercase tracking-wider font-semibold" style={mono}>{stat.label}</span>
                                        <span style={{ color: `${stat.accent}55` }}>{stat.icon}</span>
                                    </div>
                                    <div className="text-3xl font-bold" style={{ color: stat.accent, ...mono }}>
                                        {stat.value}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button
                                onClick={() => setActiveTab("create")}
                                className="liquid-glass rounded-2xl p-6 flex items-center gap-4 border-none cursor-pointer text-left hover:border-[#FF003C]/20 transition-all group"
                                style={{ border: "1px solid rgba(255,255,255,0.06)" }}
                                id="admin-quick-create"
                            >
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #FF003C, #cc0030)", boxShadow: "0 0 16px rgba(255,0,60,0.25)" }}>
                                    <IconUserPlus />
                                </div>
                                <div>
                                    <div className="text-white font-bold text-sm group-hover:text-[#FF003C] transition-colors">Create New Account</div>
                                    <div className="text-[#666] text-xs mt-0.5">Provision ADMIN, TALENT, or RECRUITER</div>
                                </div>
                            </button>
                            <button
                                onClick={() => setActiveTab("users")}
                                className="liquid-glass rounded-2xl p-6 flex items-center gap-4 border-none cursor-pointer text-left hover:border-[#A855F7]/20 transition-all group"
                                style={{ border: "1px solid rgba(255,255,255,0.06)" }}
                                id="admin-quick-users"
                            >
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #A855F7, #7C3AED)", boxShadow: "0 0 16px rgba(168,85,247,0.25)" }}>
                                    <IconUsers />
                                </div>
                                <div>
                                    <div className="text-white font-bold text-sm group-hover:text-[#A855F7] transition-colors">Manage Users</div>
                                    <div className="text-[#666] text-xs mt-0.5">View, search, & modify accounts</div>
                                </div>
                            </button>
                        </div>

                        {/* Recent Users Table */}
                        <div className="liquid-glass rounded-2xl p-5 overflow-hidden">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                    <span className="w-1 h-4 bg-[#FF003C] rounded-full" />
                                    Recent Users
                                </h3>
                                <button onClick={() => fetchUsers()} className="text-[10px] text-[#FF003C] font-semibold hover:underline cursor-pointer bg-transparent border-none flex items-center gap-1">
                                    <IconRefresh /> Refresh
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left" style={mono}>
                                    <thead>
                                        <tr className="border-b border-white/[0.06]">
                                            <th className="text-[10px] text-[#555] uppercase tracking-wider py-3 px-2 font-semibold">User</th>
                                            <th className="text-[10px] text-[#555] uppercase tracking-wider py-3 px-2 font-semibold">Role</th>
                                            <th className="text-[10px] text-[#555] uppercase tracking-wider py-3 px-2 font-semibold hidden md:table-cell">Status</th>
                                            <th className="text-[10px] text-[#555] uppercase tracking-wider py-3 px-2 font-semibold hidden lg:table-cell">Joined</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.slice(0, 5).map((u) => (
                                            <tr key={u.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                                                <td className="py-3 px-2">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold text-white shrink-0" style={{ background: u.role === "ADMIN" ? "linear-gradient(135deg, #FF003C, #cc0030)" : u.role === "TALENT" ? "linear-gradient(135deg, #3CF91A, #2ecc16)" : "linear-gradient(135deg, #A855F7, #7C3AED)" }}>
                                                            {u.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm text-white font-semibold">{u.fullName}</div>
                                                            <div className="text-[10px] text-[#555]">{u.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-2"><RoleBadge role={u.role} /></td>
                                                <td className="py-3 px-2 hidden md:table-cell">
                                                    <span className={`text-[10px] font-bold uppercase tracking-wider ${u.isActive ? "text-[#3CF91A]" : "text-[#FF003C]"}`}>
                                                        {u.isActive ? "Active" : "Disabled"}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-2 hidden lg:table-cell">
                                                    <span className="text-[10px] text-[#555]">{new Date(u.createdAt).toLocaleDateString()}</span>
                                                </td>
                                            </tr>
                                        ))}
                                        {users.length === 0 && !usersLoading && (
                                            <tr><td colSpan={4} className="text-center text-[#555] py-8 text-sm">No users found</td></tr>
                                        )}
                                        {usersLoading && (
                                            <tr><td colSpan={4} className="text-center text-[#555] py-8 text-sm">
                                                <span className="inline-block w-4 h-4 border-2 border-[#FF003C]/30 border-t-[#FF003C] rounded-full animate-spin mr-2" />
                                                Loading...
                                            </td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* ══════════════════════════════════════════
                   USERS TAB
                   ══════════════════════════════════════════ */}
                {activeTab === "users" && (
                    <div className="flex flex-col gap-5">
                        {/* Search & Filters */}
                        <div className="rounded-2xl p-4 md:p-5" style={{ background: "rgba(255,0,60,0.02)", border: "1px solid rgba(255,0,60,0.08)", backdropFilter: "blur(20px)" }}>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="flex-1 flex items-center gap-3 bg-black/30 rounded-xl px-4 py-3 border border-white/5 focus-within:border-[#FF003C]/40 transition-colors">
                                    <IconSearch />
                                    <input
                                        type="text"
                                        placeholder="Search by name, email, or username..."
                                        className="flex-1 bg-transparent border-none outline-none text-white text-sm placeholder:text-[#555]"
                                        style={mono}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && fetchUsers()}
                                        id="admin-user-search"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <div className="relative">
                                        <select
                                            value={roleFilter}
                                            onChange={(e) => { setRoleFilter(e.target.value); }}
                                            className="appearance-none bg-black/30 border border-white/10 rounded-xl px-4 py-3 pr-8 text-white text-sm cursor-pointer outline-none focus:border-[#FF003C]/40 transition-colors"
                                            style={mono}
                                            id="admin-role-filter"
                                        >
                                            <option value="">All Roles</option>
                                            <option value="ADMIN">Admin</option>
                                            <option value="TALENT">Talent</option>
                                            <option value="RECRUITER">Recruiter</option>
                                        </select>
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] pointer-events-none"><IconChevDown /></span>
                                    </div>
                                    <button onClick={() => fetchUsers()} className="px-4 py-3 rounded-xl text-white font-bold text-sm border-none cursor-pointer transition-all hover:-translate-y-0.5" style={{ background: "#FF003C", boxShadow: "0 4px 20px rgba(255,0,60,0.25)" }} id="admin-search-btn">
                                        Search
                                    </button>
                                </div>
                            </div>

                            {/* Role Quick Filters */}
                            <div className="flex gap-2 mt-3 flex-wrap">
                                {[
                                    { label: "All", value: "", color: "#FF003C" },
                                    { label: "Admin", value: "ADMIN", color: "#FF003C" },
                                    { label: "Talent", value: "TALENT", color: "#3CF91A" },
                                    { label: "Recruiter", value: "RECRUITER", color: "#A855F7" },
                                ].map((tag) => (
                                    <button
                                        key={tag.value}
                                        onClick={() => { setRoleFilter(tag.value); setTimeout(() => fetchUsers(), 0); }}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border-none`}
                                        style={roleFilter === tag.value
                                            ? { background: tag.color, color: "#fff", boxShadow: `0 0 10px ${tag.color}40`, ...mono }
                                            : { background: "rgba(255,255,255,0.05)", color: "#888", ...mono }
                                        }
                                    >
                                        {tag.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Users Table */}
                        <div className="liquid-glass rounded-2xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left" style={mono}>
                                    <thead>
                                        <tr className="border-b border-white/[0.06]" style={{ background: "rgba(255,0,60,0.03)" }}>
                                            <th className="text-[10px] text-[#666] uppercase tracking-wider py-4 px-4 font-bold">User</th>
                                            <th className="text-[10px] text-[#666] uppercase tracking-wider py-4 px-4 font-bold">Role</th>
                                            <th className="text-[10px] text-[#666] uppercase tracking-wider py-4 px-4 font-bold hidden md:table-cell">Status</th>
                                            <th className="text-[10px] text-[#666] uppercase tracking-wider py-4 px-4 font-bold hidden lg:table-cell">Last Login</th>
                                            <th className="text-[10px] text-[#666] uppercase tracking-wider py-4 px-4 font-bold hidden lg:table-cell">Joined</th>
                                            <th className="text-[10px] text-[#666] uppercase tracking-wider py-4 px-4 font-bold text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((u) => (
                                            <tr key={u.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group">
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-lg flex items-center justify-center text-[10px] font-bold text-white shrink-0" style={{ background: u.role === "ADMIN" ? "linear-gradient(135deg, #FF003C, #cc0030)" : u.role === "TALENT" ? "linear-gradient(135deg, #3CF91A, #2ecc16)" : "linear-gradient(135deg, #A855F7, #7C3AED)" }}>
                                                            {u.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm text-white font-semibold">{u.fullName}</div>
                                                            <div className="text-[10px] text-[#555]">{u.email}</div>
                                                            {u.username && <div className="text-[9px] text-[#444]">@{u.username}</div>}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4"><RoleBadge role={u.role} /></td>
                                                <td className="py-4 px-4 hidden md:table-cell">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`w-2 h-2 rounded-full ${u.isActive ? "bg-[#3CF91A]" : "bg-[#FF003C]"}`} style={{ boxShadow: u.isActive ? "0 0 6px rgba(60,249,26,0.4)" : "0 0 6px rgba(255,0,60,0.4)" }} />
                                                        <span className={`text-[10px] font-bold uppercase tracking-wider ${u.isActive ? "text-[#3CF91A]" : "text-[#FF003C]"}`}>
                                                            {u.isActive ? "Active" : "Disabled"}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 hidden lg:table-cell">
                                                    <span className="text-[10px] text-[#555]">
                                                        {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString() : "Never"}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 hidden lg:table-cell">
                                                    <span className="text-[10px] text-[#555]">{new Date(u.createdAt).toLocaleDateString()}</span>
                                                </td>
                                                <td className="py-4 px-4 text-right">
                                                    <button
                                                        onClick={() => toggleActive(u.id, u.isActive)}
                                                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border cursor-pointer transition-all hover:-translate-y-0.5 ${u.isActive
                                                            ? "bg-[#FF003C]/10 border-[#FF003C]/20 text-[#FF003C] hover:bg-[#FF003C] hover:text-white"
                                                            : "bg-[#3CF91A]/10 border-[#3CF91A]/20 text-[#3CF91A] hover:bg-[#3CF91A] hover:text-black"
                                                            }`}
                                                        style={mono}
                                                    >
                                                        {u.isActive ? "Disable" : "Enable"}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {users.length === 0 && !usersLoading && (
                                            <tr><td colSpan={6} className="text-center text-[#555] py-12 text-sm">
                                                No users found matching your criteria
                                            </td></tr>
                                        )}
                                        {usersLoading && (
                                            <tr><td colSpan={6} className="text-center text-[#555] py-12 text-sm">
                                                <span className="inline-block w-5 h-5 border-2 border-[#FF003C]/30 border-t-[#FF003C] rounded-full animate-spin mr-2 align-middle" />
                                                Scanning user registry...
                                            </td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {pagination.totalPages > 1 && (
                                <div className="flex items-center justify-between px-4 py-4 border-t border-white/[0.06]">
                                    <span className="text-[10px] text-[#555]" style={mono}>
                                        Page {pagination.page} of {pagination.totalPages} — {pagination.total} total
                                    </span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => fetchUsers(pagination.page - 1)}
                                            disabled={pagination.page <= 1}
                                            className="px-3 py-1.5 rounded-lg text-xs bg-white/5 border border-white/10 text-[#888] cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:text-white hover:border-[#FF003C]/30 transition-all"
                                            style={mono}
                                        >
                                            ← Prev
                                        </button>
                                        <button
                                            onClick={() => fetchUsers(pagination.page + 1)}
                                            disabled={pagination.page >= pagination.totalPages}
                                            className="px-3 py-1.5 rounded-lg text-xs bg-white/5 border border-white/10 text-[#888] cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:text-white hover:border-[#FF003C]/30 transition-all"
                                            style={mono}
                                        >
                                            Next →
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ══════════════════════════════════════════
                   CREATE ACCOUNT TAB
                   ══════════════════════════════════════════ */}
                {activeTab === "create" && (
                    <div className="max-w-2xl mx-auto">
                        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,0,60,0.1)" }}>
                            {/* Top gradient line */}
                            <div className="h-[2px]" style={{ background: "linear-gradient(90deg, rgba(255,0,60,0.6), rgba(255,0,60,0.1) 50%, rgba(168,85,247,0.4))" }} />

                            <div className="bg-[#0c0c10]/90 backdrop-blur-2xl p-6 sm:p-8">

                                {/* Header */}
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #FF003C, #cc0030)", boxShadow: "0 0 16px rgba(255,0,60,0.3)" }}>
                                        <IconUserPlus />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-white">Provision New Account</h2>
                                        <p className="text-[10px] text-[#555] uppercase tracking-[2px]" style={mono}>admin_create :: role_assign</p>
                                    </div>
                                </div>

                                <div className="h-px bg-white/[0.06] my-5" />

                                <form onSubmit={handleCreate} className="flex flex-col gap-5">

                                    {/* Role Selector */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-[0.82rem] font-bold text-white tracking-wide">Account Role</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {[
                                                { value: "ADMIN", label: "Admin", color: "#FF003C", desc: "Full access" },
                                                { value: "TALENT", label: "Talent", color: "#3CF91A", desc: "Skill profiles" },
                                                { value: "RECRUITER", label: "Recruiter", color: "#A855F7", desc: "Hire talent" },
                                            ].map((r) => (
                                                <button
                                                    key={r.value}
                                                    type="button"
                                                    onClick={() => setFormData((p) => ({ ...p, role: r.value }))}
                                                    className="flex flex-col items-center gap-1 py-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:-translate-y-0.5"
                                                    style={
                                                        formData.role === r.value
                                                            ? { borderColor: `${r.color}80`, background: `${r.color}0D`, boxShadow: `0 0 20px ${r.color}15` }
                                                            : { borderColor: "rgba(255,255,255,0.06)", background: "transparent" }
                                                    }
                                                    id={`admin-create-role-${r.value.toLowerCase()}`}
                                                >
                                                    {formData.role === r.value && (
                                                        <span style={{ color: r.color }}><IconCheck /></span>
                                                    )}
                                                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: formData.role === r.value ? r.color : "#888", ...mono }}>
                                                        {r.label}
                                                    </span>
                                                    <span className="text-[9px] text-[#555]">{r.desc}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Full Name */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[0.82rem] font-bold text-white tracking-wide">Full Name</label>
                                        <div className="flex items-center bg-[#111118] border border-white/[0.06] rounded-lg focus-within:border-[#FF003C]/50 focus-within:shadow-[0_0_0_2px_rgba(255,0,60,0.08)] transition-all">
                                            <input
                                                type="text"
                                                className="flex-1 bg-transparent border-none text-white py-3 px-4 text-[0.85rem] outline-none placeholder:text-[#3a3a48]"
                                                style={mono}
                                                placeholder="John Doe"
                                                value={formData.fullName}
                                                onChange={(e) => { setFormData((p) => ({ ...p, fullName: e.target.value })); setFormError(""); }}
                                                id="admin-create-name"
                                            />
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[0.82rem] font-bold text-white tracking-wide">Email Address</label>
                                        <div className="flex items-center bg-[#111118] border border-white/[0.06] rounded-lg focus-within:border-[#FF003C]/50 focus-within:shadow-[0_0_0_2px_rgba(255,0,60,0.08)] transition-all">
                                            <input
                                                type="email"
                                                className="flex-1 bg-transparent border-none text-white py-3 px-4 text-[0.85rem] outline-none placeholder:text-[#3a3a48]"
                                                style={mono}
                                                placeholder="admin@skillspill.io"
                                                value={formData.email}
                                                onChange={(e) => { setFormData((p) => ({ ...p, email: e.target.value })); setFormError(""); }}
                                                id="admin-create-email"
                                                autoComplete="off"
                                            />
                                        </div>
                                    </div>

                                    {/* Password */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[0.82rem] font-bold text-white tracking-wide">Password</label>
                                        <div className="flex items-center bg-[#111118] border border-white/[0.06] rounded-lg focus-within:border-[#FF003C]/50 focus-within:shadow-[0_0_0_2px_rgba(255,0,60,0.08)] transition-all">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                className="flex-1 bg-transparent border-none text-white py-3 px-4 text-[0.85rem] outline-none placeholder:text-[#3a3a48]"
                                                style={mono}
                                                placeholder="Min 8 characters"
                                                value={formData.password}
                                                onChange={(e) => { setFormData((p) => ({ ...p, password: e.target.value })); setFormError(""); }}
                                                id="admin-create-password"
                                                autoComplete="new-password"
                                            />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="bg-transparent border-none text-[#3a3a48] pr-3.5 cursor-pointer hover:text-[#FF003C] transition-colors flex items-center" id="admin-toggle-pw">
                                                {showPassword ? <IconEyeOff /> : <IconEye />}
                                            </button>
                                        </div>
                                        {/* Password strength indicator */}
                                        {formData.password && (
                                            <div className="flex gap-1 mt-1">
                                                {[1, 2, 3, 4].map((level) => {
                                                    const strength = formData.password.length >= 12 ? 4 : formData.password.length >= 10 ? 3 : formData.password.length >= 8 ? 2 : 1;
                                                    const colors = ["#FF003C", "#F59E0B", "#3CF91A", "#3CF91A"];
                                                    return (
                                                        <div
                                                            key={level}
                                                            className="flex-1 h-1 rounded-full transition-all duration-300"
                                                            style={{ background: level <= strength ? colors[strength - 1] : "rgba(255,255,255,0.06)" }}
                                                        />
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>

                                    {/* Error */}
                                    {formError && (
                                        <div className="flex items-center gap-2 px-4 py-3 rounded-lg border text-[0.75rem]" style={{ background: "rgba(255,0,60,0.06)", borderColor: "rgba(255,0,60,0.12)", color: "#FF003C", ...mono }}>
                                            <IconX /> {formError}
                                        </div>
                                    )}

                                    {/* Success */}
                                    {formSuccess && (
                                        <div className="flex items-center gap-2 px-4 py-3 rounded-lg border text-[0.75rem]" style={{ background: "rgba(60,249,26,0.06)", borderColor: "rgba(60,249,26,0.12)", color: "#3CF91A", ...mono }}>
                                            <IconCheck /> {formSuccess}
                                        </div>
                                    )}

                                    {/* Submit */}
                                    <button
                                        type="submit"
                                        disabled={creating}
                                        className="w-full py-4 mt-2 text-white border-none rounded-full font-bold text-[0.8rem] uppercase tracking-[0.18em] cursor-pointer transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0"
                                        style={{
                                            background: "linear-gradient(135deg, #FF003C, #cc0030)",
                                            boxShadow: creating ? "none" : "0 4px 20px rgba(255,0,60,0.3)",
                                            ...mono,
                                        }}
                                        id="admin-create-submit"
                                    >
                                        {creating ? (
                                            <span className="inline-flex items-center gap-2">
                                                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Provisioning...
                                            </span>
                                        ) : (
                                            `CREATE ${formData.role} ACCOUNT`
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Info box */}
                        <div className="mt-4 rounded-xl p-4 flex items-start gap-3" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                            <span className="text-[#555] shrink-0 mt-0.5"><IconShield /></span>
                            <div>
                                <p className="text-xs text-[#666] leading-relaxed">
                                    Accounts created through this panel are <span className="text-[#FF003C] font-semibold">auto-verified</span> and immediately active.
                                    A unique username will be generated from the email address. The user can log in immediately with the credentials set here.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Footer Status ── */}
                <div className="flex items-center justify-center gap-5 sm:gap-8 py-8 mt-8">
                    {[
                        { color: "#FF003C", label: "ADMIN MODULE: ACTIVE" },
                        { color: "#3CF91A", label: "AUTH: SECURED" },
                        { color: "#A855F7", label: "ROLE_ENGINE: v1.0" },
                    ].map((s) => (
                        <div key={s.label} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: s.color, boxShadow: `0 0 4px ${s.color}55` }} />
                            <span className="text-[0.5rem] sm:text-[0.55rem] text-[#444] uppercase tracking-[0.15em] font-semibold" style={mono}>{s.label}</span>
                        </div>
                    ))}
                </div>
            </main>

            {/* ═══════════════ MOBILE BOTTOM NAV ═══════════════ */}
            <div className="fixed bottom-0 left-0 right-0 lg:hidden liquid-glass-surface border-t border-white/[0.06] z-50">
                <div className="flex items-center justify-around py-2 px-2 max-w-md mx-auto">
                    {navItems.map((item) => (
                        <button
                            key={item.key}
                            onClick={() => setActiveTab(item.key)}
                            className={`flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl border-none cursor-pointer transition-all
                                ${activeTab === item.key
                                    ? "text-[#FF003C] bg-[#FF003C]/10"
                                    : "text-[#555] bg-transparent hover:text-[#FF003C]"
                                }`}
                        >
                            {item.icon}
                            <span className="text-[9px] font-semibold tracking-wide">{item.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
