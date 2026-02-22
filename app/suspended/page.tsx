"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

/* ───────────── Particles ───────────── */
interface Particle { x: number; y: number; vx: number; vy: number; size: number; opacity: number; color: string; }
function ParticlesCanvas() {
    const ref = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const c = ref.current; if (!c) return;
        const ctx = c.getContext("2d"); if (!ctx) return;
        let raf: number; const pts: Particle[] = [];
        const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight; };
        resize(); window.addEventListener("resize", resize);
        for (let i = 0; i < 30; i++) {
            pts.push({ x: Math.random() * c.width, y: Math.random() * c.height, vx: (Math.random() - 0.5) * 0.08, vy: (Math.random() - 0.5) * 0.08, size: Math.random() * 1 + 0.3, opacity: Math.random() * 0.1 + 0.02, color: "232,41,74" });
        }
        const draw = () => {
            ctx.clearRect(0, 0, c.width, c.height);
            pts.forEach((p) => { p.x += p.vx; p.y += p.vy; if (p.x < 0) p.x = c.width; if (p.x > c.width) p.x = 0; if (p.y < 0) p.y = c.height; if (p.y > c.height) p.y = 0; ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fillStyle = `rgba(${p.color},${p.opacity})`; ctx.fill(); });
            for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) { const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y, d = Math.sqrt(dx * dx + dy * dy); if (d < 120) { ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.strokeStyle = `rgba(232,41,74,${0.015 * (1 - d / 120)})`; ctx.lineWidth = 0.4; ctx.stroke(); } }
            raf = requestAnimationFrame(draw);
        };
        draw();
        return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
    }, []);
    return <canvas ref={ref} className="fixed inset-0 w-full h-full pointer-events-none z-0" />;
}

/* ───────────── Icons ───────────── */
const IconShield = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <line x1="9" y1="9" x2="15" y2="15" /><line x1="15" y1="9" x2="9" y2="15" />
    </svg>
);
const IconBolt = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
);
const IconSend = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
);
const IconClock = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
);
const IconCheck = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
);
const IconX = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
);
const IconLogout = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
);

/* ───────────── Types ───────────── */
interface AppealItem {
    id: string;
    reason: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    adminResponse: string | null;
    createdAt: string;
    reviewedAt: string | null;
}

interface SuspensionData {
    id: string;
    fullName: string;
    email: string;
    isActive: boolean;
    suspensionReason: string | null;
    appeals: AppealItem[];
}

/* ═══════════════════════════════════════════════════════════
   SUSPENDED PAGE
   ═══════════════════════════════════════════════════════════ */
export default function SuspendedPage() {
    const router = useRouter();
    const mono: React.CSSProperties = { fontFamily: "var(--font-jetbrains-mono, 'JetBrains Mono', monospace)" };
    const sans: React.CSSProperties = { fontFamily: "var(--font-dm-sans, 'DM Sans', sans-serif)" };

    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState<SuspensionData | null>(null);
    const [appealReason, setAppealReason] = useState("");
    const [appealLoading, setAppealLoading] = useState(false);
    const [appealError, setAppealError] = useState("");
    const [appealSuccess, setAppealSuccess] = useState(false);
    const [showAppealForm, setShowAppealForm] = useState(false);

    const fetchSuspensionData = useCallback(async () => {
        try {
            const res = await fetch("/api/auth/suspension");
            const data = await res.json();
            if (res.ok) {
                // If user is not suspended, redirect them to dashboard
                if (data.user.isActive) {
                    router.push("/dashboard");
                    return;
                }
                setUserData(data.user);
            } else {
                router.push("/login");
            }
        } catch {
            router.push("/login");
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => { fetchSuspensionData(); }, [fetchSuspensionData]);

    const submitAppeal = async (e: React.FormEvent) => {
        e.preventDefault();
        setAppealError("");
        setAppealSuccess(false);

        if (appealReason.trim().length < 20) {
            setAppealError("Please provide a detailed reason (at least 20 characters).");
            return;
        }

        setAppealLoading(true);
        try {
            const res = await fetch("/api/appeals", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reason: appealReason.trim() }),
            });
            const data = await res.json();
            if (res.ok) {
                setAppealSuccess(true);
                setAppealReason("");
                setShowAppealForm(false);
                fetchSuspensionData();
            } else {
                setAppealError(data.error || "Failed to submit appeal");
            }
        } catch {
            setAppealError("Network error. Please try again.");
        } finally {
            setAppealLoading(false);
        }
    };

    const handleLogout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/login");
    };

    const hasPendingAppeal = userData?.appeals.some((a) => a.status === "PENDING");

    if (loading) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center bg-[#060608]">
                <div className="flex flex-col items-center gap-3">
                    <span className="inline-block w-6 h-6 border-2 rounded-full animate-spin" style={{ borderColor: "#E8294A30", borderTopColor: "#E8294A" }} />
                    <span className="text-[12px] text-[#555]" style={mono}>Loading suspension data...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full min-h-screen flex flex-col bg-[#060608]">
            <ParticlesCanvas />

            {/* Ambient blobs */}
            <div className="fixed top-0 left-0 w-[55vw] h-[60vh] bg-[radial-gradient(ellipse_at_20%_30%,rgba(232,41,74,0.04)_0%,transparent_70%)] pointer-events-none" />
            <div className="fixed bottom-0 right-0 w-[55vw] h-[60vh] bg-[radial-gradient(ellipse_at_80%_70%,rgba(232,41,74,0.03)_0%,transparent_70%)] pointer-events-none" />

            {/* Top bar */}
            <header className="relative z-10 flex items-center justify-between px-6 py-4">
                <a href="/" className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition-opacity" id="suspended-logo">
                    <div className="w-8 h-8 rounded-lg bg-[#E8294A] flex items-center justify-center text-white shadow-[0_0_16px_rgba(232,41,74,0.35)]">
                        <IconBolt />
                    </div>
                    <span className="text-[1.1rem] font-bold text-white tracking-tight">SkillSpill</span>
                </a>
                <button onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-semibold border-none cursor-pointer transition-all hover:bg-white/5"
                    style={{ background: "transparent", color: "#666", ...mono }} id="suspended-logout">
                    <IconLogout /> Sign Out
                </button>
            </header>

            {/* Main content */}
            <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8">
                <div className="w-full max-w-[560px] flex flex-col items-center">

                    {/* Shield Icon */}
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
                        style={{ background: "rgba(232,41,74,0.08)", border: "1px solid rgba(232,41,74,0.15)", color: "#E8294A", boxShadow: "0 0 40px rgba(232,41,74,0.1)" }}>
                        <IconShield />
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 text-center" style={sans}>
                        Account Suspended
                    </h1>
                    <p className="text-[13px] text-[#666] text-center mb-6" style={sans}>
                        Hey <span className="text-[#999] font-medium">{userData?.fullName}</span>, your account has been suspended by an administrator.
                    </p>

                    {/* Suspension Reason Card */}
                    <div className="w-full rounded-2xl overflow-hidden mb-5" style={{ border: "1px solid rgba(232,41,74,0.15)" }}>
                        {/* Top danger stripe */}
                        <div className="h-[2px]" style={{ background: "linear-gradient(90deg, transparent, #E8294A, transparent)" }} />
                        <div className="bg-[#0c0c10]/90 backdrop-blur-2xl p-6">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="w-2 h-2 rounded-full bg-[#E8294A]" style={{ boxShadow: "0 0 6px #E8294A" }} />
                                <span className="text-[10px] uppercase tracking-[2px] font-bold text-[#E8294A]" style={mono}>Suspension Reason</span>
                            </div>
                            <p className="text-[14px] leading-relaxed text-[#ccc]" style={sans}>
                                {userData?.suspensionReason || "No reason provided by the administrator."}
                            </p>
                            <div className="flex items-center gap-1.5 mt-4 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                                <span className="text-[10px] text-[#444]" style={mono}>Account: {userData?.email}</span>
                            </div>
                        </div>
                    </div>

                    {/* Appeal History */}
                    {userData?.appeals && userData.appeals.length > 0 && (
                        <div className="w-full rounded-2xl overflow-hidden mb-5" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
                            <div className="bg-[#0c0c10]/90 backdrop-blur-2xl p-6">
                                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2" style={sans}>
                                    <IconClock /> Appeal History
                                </h3>
                                <div className="flex flex-col gap-3">
                                    {userData.appeals.map((appeal) => {
                                        const statusColor = appeal.status === "PENDING" ? "#F59E0B" : appeal.status === "APPROVED" ? "#39FF14" : "#E8294A";
                                        const statusIcon = appeal.status === "PENDING" ? <IconClock /> : appeal.status === "APPROVED" ? <IconCheck /> : <IconX />;
                                        return (
                                            <div key={appeal.id} className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                                                <div className="flex items-start justify-between gap-3 mb-2">
                                                    <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-[1.5px] inline-flex items-center gap-1"
                                                        style={{ background: `${statusColor}15`, color: statusColor, border: `1px solid ${statusColor}25`, ...mono }}>
                                                        {statusIcon} {appeal.status}
                                                    </span>
                                                    <span className="text-[10px] text-[#555] shrink-0" style={mono}>
                                                        {new Date(appeal.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="text-[12px] text-[#aaa] leading-relaxed mb-0" style={sans}>{appeal.reason}</p>
                                                {appeal.adminResponse && (
                                                    <div className="mt-3 p-3 rounded-lg" style={{ background: "rgba(255,255,255,0.03)", borderLeft: `2px solid ${statusColor}` }}>
                                                        <div className="text-[9px] uppercase tracking-[1.5px] font-bold mb-1" style={{ color: "#666", ...mono }}>Admin Response</div>
                                                        <p className="text-[12px] text-[#999] leading-relaxed mb-0" style={sans}>{appeal.adminResponse}</p>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Appeal Success Message */}
                    {appealSuccess && (
                        <div className="w-full flex items-center gap-2 px-4 py-3 rounded-xl mb-4"
                            style={{ background: "rgba(57,255,20,0.06)", border: "1px solid rgba(57,255,20,0.15)" }}>
                            <IconCheck />
                            <span className="text-[12px] text-[#39FF14] font-medium" style={sans}>Your appeal has been submitted successfully. You&apos;ll be notified once it&apos;s reviewed.</span>
                        </div>
                    )}

                    {/* Submit Appeal Section */}
                    {!hasPendingAppeal && !showAppealForm && (
                        <button onClick={() => { setShowAppealForm(true); setAppealSuccess(false); }}
                            className="w-full py-3.5 rounded-xl text-[13px] font-bold border-none cursor-pointer transition-all duration-300 hover:-translate-y-0.5"
                            style={{ background: "linear-gradient(135deg, #A855F7, #7C3AED)", color: "#fff", boxShadow: "0 4px 20px rgba(168,85,247,0.25)", ...mono }}
                            id="start-appeal-btn">
                            ⚡ SUBMIT AN APPEAL
                        </button>
                    )}

                    {hasPendingAppeal && !showAppealForm && (
                        <div className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl"
                            style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.15)" }}>
                            <IconClock />
                            <span className="text-[12px] text-[#F59E0B] font-medium" style={sans}>
                                Your appeal is pending review. Please wait for an administrator to respond.
                            </span>
                        </div>
                    )}

                    {/* Appeal Form */}
                    {showAppealForm && (
                        <div className="w-full rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(168,85,247,0.2)" }}>
                            <div className="h-[2px]" style={{ background: "linear-gradient(90deg, transparent, #A855F7, transparent)" }} />
                            <div className="bg-[#0c0c10]/90 backdrop-blur-2xl p-6">
                                <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2" style={sans}>
                                    <IconSend /> Submit Your Appeal
                                </h3>
                                <p className="text-[11px] text-[#555] mb-4" style={sans}>
                                    Explain why your account should be reinstated. Be detailed and specific.
                                </p>
                                <form onSubmit={submitAppeal} className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] uppercase tracking-[1.5px] font-bold text-[#666]" style={mono}>Appeal Reason</label>
                                        <textarea value={appealReason} onChange={(e) => { setAppealReason(e.target.value); setAppealError(""); }}
                                            placeholder="Describe why your suspension should be lifted. Include any relevant context or evidence..."
                                            rows={5}
                                            className="w-full p-4 rounded-xl text-[13px] leading-relaxed resize-none outline-none transition-all duration-200 focus:ring-1 focus:ring-[#A855F7]/30"
                                            style={{ background: "#111118", color: "#ccc", border: "1px solid rgba(255,255,255,0.06)", ...sans }}
                                            id="appeal-reason-input" />
                                        <span className="text-[10px] text-right" style={{ color: appealReason.length >= 20 ? "#39FF14" : "#555", ...mono }}>
                                            {appealReason.length}/20 min characters
                                        </span>
                                    </div>

                                    {appealError && (
                                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: "rgba(232,41,74,0.06)", border: "1px solid rgba(232,41,74,0.12)" }}>
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#E8294A] shrink-0" />
                                            <span className="text-[11px] text-[#E8294A]" style={mono}>{appealError}</span>
                                        </div>
                                    )}

                                    <div className="flex gap-3">
                                        <button type="button" onClick={() => { setShowAppealForm(false); setAppealError(""); }}
                                            className="flex-1 py-3 rounded-xl text-[12px] font-bold border cursor-pointer transition-all hover:bg-white/5"
                                            style={{ background: "transparent", borderColor: "rgba(255,255,255,0.08)", color: "#666", ...mono }}
                                            id="cancel-appeal-btn">
                                            Cancel
                                        </button>
                                        <button type="submit" disabled={appealLoading || appealReason.trim().length < 20}
                                            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[12px] font-bold border-none cursor-pointer transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0"
                                            style={{ background: "linear-gradient(135deg, #A855F7, #7C3AED)", color: "#fff", boxShadow: "0 4px 15px rgba(168,85,247,0.2)", ...mono }}
                                            id="submit-appeal-btn">
                                            {appealLoading ? <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><IconSend /> Submit Appeal</>}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Status bar */}
            <footer className="relative z-10 flex items-center justify-center gap-5 sm:gap-8 py-5 px-4" id="suspended-footer">
                {[
                    { color: "#E8294A", label: "ACCOUNT: SUSPENDED" },
                    { color: "#F59E0B", label: "APPEAL: AVAILABLE" },
                    { color: "#555", label: "ACCESS: RESTRICTED" },
                ].map((s) => (
                    <div key={s.label} className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: s.color, boxShadow: `0 0 4px ${s.color}55` }} />
                        <span className="text-[0.5rem] sm:text-[0.55rem] text-[#444] uppercase tracking-[0.15em] font-semibold" style={mono}>{s.label}</span>
                    </div>
                ))}
            </footer>
        </div>
    );
}
