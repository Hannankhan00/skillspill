"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

/* ───────────── Ripple Hook ───────────── */
function useRipple() {
    return useCallback((e: React.MouseEvent<HTMLElement>) => {
        const el = e.currentTarget;
        const rect = el.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 2;
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        const span = document.createElement("span");
        span.style.cssText = `position:absolute;border-radius:50%;background:rgba(255,255,255,0.3);width:${size}px;height:${size}px;left:${x}px;top:${y}px;transform:scale(0);animation:ripple-expand 0.6s ease-out forwards;pointer-events:none;`;
        el.style.position = "relative";
        el.style.overflow = "hidden";
        el.appendChild(span);
        setTimeout(() => span.remove(), 600);
    }, []);
}

/* ───────────── Icons ───────────── */
const IconAt = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" /></svg>
);
const IconLockClosed = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
);
const IconLockOpen = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 9.9-1" /></svg>
);
const IconBolt = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
);
const IconGoogle = () => (
    <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
);
const IconGithub = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>
);
const IconLinkedin = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
);

/* ───────────── Particles (green + purple) ───────────── */
interface Particle { x: number; y: number; vx: number; vy: number; size: number; opacity: number; color: string; }
function ParticlesCanvas() {
    const ref = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const c = ref.current; if (!c) return;
        const ctx = c.getContext("2d"); if (!ctx) return;
        let raf: number; const pts: Particle[] = [];
        const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight; };
        resize(); window.addEventListener("resize", resize);
        for (let i = 0; i < 40; i++) {
            const g = Math.random() > 0.5;
            pts.push({ x: Math.random() * c.width, y: Math.random() * c.height, vx: (Math.random() - 0.5) * 0.12, vy: (Math.random() - 0.5) * 0.12, size: Math.random() * 1.2 + 0.3, opacity: Math.random() * 0.15 + 0.03, color: g ? "60,249,26" : "168,85,247" });
        }
        const draw = () => {
            ctx.clearRect(0, 0, c.width, c.height);
            pts.forEach((p) => { p.x += p.vx; p.y += p.vy; if (p.x < 0) p.x = c.width; if (p.x > c.width) p.x = 0; if (p.y < 0) p.y = c.height; if (p.y > c.height) p.y = 0; ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fillStyle = `rgba(${p.color},${p.opacity})`; ctx.fill(); });
            for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) { const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y, d = Math.sqrt(dx * dx + dy * dy); if (d < 100) { ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.strokeStyle = `rgba(255,255,255,${0.012 * (1 - d / 100)})`; ctx.lineWidth = 0.4; ctx.stroke(); } }
            raf = requestAnimationFrame(draw);
        };
        draw();
        return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
    }, []);
    return <canvas ref={ref} className="fixed inset-0 w-full h-full pointer-events-none z-0" />;
}

/* ═══════════════════════════════════════════════════════════
   LOGIN PAGE
   ═══════════════════════════════════════════════════════════ */
export default function LoginPage() {
    const router = useRouter();
    const ripple = useRipple();
    const [tab, setTab] = useState<"login" | "signup">("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const mono: React.CSSProperties = { fontFamily: "var(--font-jetbrains-mono, 'JetBrains Mono', monospace)" };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault(); setError("");
        if (!email.trim()) { setError("Quantum address required"); return; }
        if (!password) { setError("Access key required"); return; }
        setLoading(true);
        try {
            const res = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
            const data = await res.json();
            if (!res.ok) { setError(data.error || "Authentication failed"); return; }
            router.push(data.redirectTo || "/dashboard");
        } catch { setError("Neural link interrupted. Retry."); } finally { setLoading(false); }
    };

    return (
        <div className="relative w-full min-h-svh flex flex-col bg-[#060608]">
            <style>{`@keyframes ripple-expand{to{transform:scale(1);opacity:0}}`}</style>
            <ParticlesCanvas />

            {/* ── Ambient blobs ── */}
            <div className="fixed top-0 left-0 w-[55vw] h-[60vh] bg-[radial-gradient(ellipse_at_20%_30%,rgba(60,249,26,0.045)_0%,transparent_70%)] pointer-events-none" />
            <div className="fixed bottom-0 right-0 w-[55vw] h-[60vh] bg-[radial-gradient(ellipse_at_80%_70%,rgba(168,85,247,0.05)_0%,transparent_70%)] pointer-events-none" />

            {/* ══════════════ CENTERED CONTENT ══════════════ */}
            <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-12">

                {/* ── Logo ── */}
                <a href="/" className="flex items-center gap-2.5 mb-7 cursor-pointer hover:opacity-90 transition-opacity" id="login-logo">
                    <div className="w-9 h-9 rounded-lg bg-[#A855F7] flex items-center justify-center text-white shadow-[0_0_16px_rgba(168,85,247,0.35)]">
                        <IconBolt />
                    </div>
                    <span className="text-[1.35rem] font-bold text-white tracking-tight">SkillSpill</span>
                </a>

                {/* ── Card ── */}
                <div className="w-full max-w-[480px] rounded-2xl overflow-hidden" id="login-card">
                    {/* Top gradient border line */}
                    <div className="h-[2px] bg-gradient-to-r from-[#3CF91A]/40 via-[#3CF91A]/10 to-[#A855F7]/30" />

                    <div className="border border-t-0 border-white/[0.06] rounded-b-2xl bg-[#0c0c10]/90 backdrop-blur-2xl">
                        <div className="px-5 pt-5 pb-6 sm:px-8 sm:pt-7 sm:pb-8">

                            {/* ── Tab Toggle ── */}
                            <div className="flex bg-[#15151f] rounded-full p-[3px] mb-7" id="login-tabs">
                                <button onClick={(e) => { ripple(e); setTab("login"); }}
                                    className={`flex-1 py-2.5 rounded-full text-[0.8rem] font-bold tracking-wide cursor-pointer border-none transition-all duration-300 ${tab === "login" ? "bg-[#A855F7] text-white shadow-[0_2px_12px_rgba(168,85,247,0.3)]" : "bg-transparent text-[#555] hover:text-[#888]"}`}
                                    id="tab-login">Login</button>
                                <button onClick={(e) => { ripple(e); setTab("signup"); }}
                                    className={`flex-1 py-2.5 rounded-full text-[0.8rem] font-bold tracking-wide cursor-pointer border-none transition-all duration-300 ${tab === "signup" ? "bg-[#A855F7] text-white shadow-[0_2px_12px_rgba(168,85,247,0.3)]" : "bg-transparent text-[#555] hover:text-[#888]"}`}
                                    id="tab-signup">Sign Up</button>
                            </div>

                            {/* ════════ LOGIN VIEW ════════ */}
                            {tab === "login" && (
                                <form onSubmit={submit} className="flex flex-col gap-5">
                                    {/* Email */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[0.82rem] font-bold text-white tracking-wide">Quantum Address (Email)</label>
                                        <div className={`flex items-center bg-[#111118] border rounded-lg transition-all duration-200 focus-within:border-[#A855F7]/50 focus-within:shadow-[0_0_0_2px_rgba(168,85,247,0.08)] ${error && !email ? "border-[#FF003C]/40" : "border-white/[0.06]"}`}>
                                            <input type="email" className="flex-1 bg-transparent border-none text-white py-3 px-4 text-[0.85rem] outline-none placeholder:text-[#3a3a48]" style={mono} placeholder="name@domain.future" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} id="login-email" autoComplete="email" />
                                            <span className="pr-3.5 text-[#3a3a48]"><IconAt /></span>
                                        </div>
                                    </div>

                                    {/* Password */}
                                    <div className="flex flex-col gap-1.5">
                                        <div className="flex items-center justify-between">
                                            <label className="text-[0.82rem] font-bold text-white tracking-wide">Access Key</label>
                                            <a href="/forgot-password" className="text-[0.7rem] text-[#A855F7] no-underline hover:text-[#c084fc] transition-colors font-semibold tracking-wide" id="login-forgot">Lost Key?</a>
                                        </div>
                                        <div className={`flex items-center bg-[#111118] border rounded-lg transition-all duration-200 focus-within:border-[#A855F7]/50 focus-within:shadow-[0_0_0_2px_rgba(168,85,247,0.08)] ${error && !password ? "border-[#FF003C]/40" : "border-white/[0.06]"}`}>
                                            <input type={showPw ? "text" : "password"} className="flex-1 bg-transparent border-none text-white py-3 px-4 text-[0.85rem] outline-none placeholder:text-[#3a3a48]" style={mono} placeholder="••••••••••••" value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} id="login-password" autoComplete="current-password" />
                                            <button type="button" onClick={() => setShowPw(!showPw)} className="bg-transparent border-none text-[#3a3a48] pr-3.5 cursor-pointer hover:text-[#A855F7] transition-colors flex items-center" id="login-toggle-pw">
                                                {showPw ? <IconLockOpen /> : <IconLockClosed />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Error */}
                                    {error && (
                                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#FF003C]/[0.06] border border-[#FF003C]/[0.12] text-[#FF003C] text-[0.72rem]" style={mono}>
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#FF003C] shrink-0" />{error}
                                        </div>
                                    )}

                                    {/* Submit */}
                                    <button type="submit" onClick={ripple} disabled={loading}
                                        className="w-full py-3.5 mt-1 bg-gradient-to-r from-[#9333ea] to-[#A855F7] text-white border-none rounded-full font-bold text-[0.8rem] uppercase tracking-[0.18em] cursor-pointer transition-all duration-300 shadow-[0_4px_20px_rgba(168,85,247,0.25)] hover:shadow-[0_4px_30px_rgba(168,85,247,0.4)] hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none"
                                        style={mono} id="login-submit">
                                        {loading ? <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "ENTER THE SPILL"}
                                    </button>
                                </form>
                            )}

                            {/* ════════ SIGN UP VIEW ════════ */}
                            {tab === "signup" && (
                                <div className="flex flex-col items-center gap-7 py-4">
                                    <p className="text-[#777] text-[0.85rem] tracking-wide m-0">Choose your role to get started:</p>
                                    <div className="flex gap-3 w-full">
                                        <a href="/signup/talent" onClick={(e) => ripple(e as unknown as React.MouseEvent<HTMLElement>)}
                                            className="flex-1 flex items-center justify-center py-3.5 rounded-lg border-2 border-[#3CF91A]/30 bg-[#3CF91A]/[0.03] text-[#3CF91A] font-bold text-[0.75rem] uppercase tracking-[0.18em] no-underline cursor-pointer transition-all duration-300 hover:border-[#3CF91A]/70 hover:bg-[#3CF91A]/[0.06] hover:shadow-[0_0_20px_rgba(60,249,26,0.1)] hover:-translate-y-0.5"
                                            style={mono} id="signup-role-talent">
                                            I&apos;M TALENT
                                        </a>
                                        <a href="/signup/recruiter" onClick={(e) => ripple(e as unknown as React.MouseEvent<HTMLElement>)}
                                            className="flex-1 flex items-center justify-center py-3.5 rounded-lg border-2 border-[#A855F7]/30 bg-[#A855F7]/[0.03] text-[#A855F7] font-bold text-[0.75rem] uppercase tracking-[0.18em] no-underline cursor-pointer transition-all duration-300 hover:border-[#A855F7]/70 hover:bg-[#A855F7]/[0.06] hover:shadow-[0_0_20px_rgba(168,85,247,0.1)] hover:-translate-y-0.5"
                                            style={mono} id="signup-role-recruiter">
                                            I&apos;M HIRING
                                        </a>
                                    </div>
                                </div>
                            )}

                            {/* ════════ Below-form area (login only) ════════ */}
                            {tab === "login" && (
                                <>
                                    {/* Divider */}
                                    <div className="flex items-center gap-3 mt-6 mb-5">
                                        <div className="flex-1 h-px bg-white/[0.05]" />
                                        <span className="text-[0.55rem] text-[#444] uppercase tracking-[0.2em] font-semibold" style={mono}>Neural Link Sync</span>
                                        <div className="flex-1 h-px bg-white/[0.05]" />
                                    </div>

                                    {/* Social */}
                                    <div className="flex justify-center gap-3" id="login-social">
                                        {[
                                            { icon: <IconGoogle />, id: "google", label: "Google" },
                                            { icon: <IconGithub />, id: "github", label: "GitHub" },
                                            { icon: <IconLinkedin />, id: "linkedin", label: "LinkedIn" },
                                        ].map((s) => (
                                            <button key={s.id} onClick={ripple} aria-label={`Sign in with ${s.label}`}
                                                className="w-12 h-12 rounded-lg bg-[#111118] border border-white/[0.06] flex items-center justify-center text-[#666] cursor-pointer transition-all duration-200 hover:border-[#A855F7]/30 hover:text-white hover:bg-[#A855F7]/[0.05]"
                                                id={`login-social-${s.id}`}>
                                                {s.icon}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Terms */}
                                    <p className="text-center text-[0.65rem] text-[#444] mt-5 mb-0 leading-relaxed">
                                        By entering, you accept our{" "}
                                        <a href="#" className="text-[#A855F7] no-underline hover:underline font-semibold">Protocols</a>{" "}
                                        &amp;{" "}
                                        <a href="#" className="text-[#A855F7] no-underline hover:underline font-semibold">Neural Security Policy</a>
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* ══════════════ STATUS BAR ══════════════ */}
            <footer className="relative z-10 flex items-center justify-center gap-5 sm:gap-8 py-5 px-4" id="login-footer">
                {[
                    { color: "#3CF91A", label: "GATEWAY: STABLE" },
                    { color: "#A855F7", label: "ENCRYPTION: QUANTUM V4" },
                    { color: "#A855F7", label: "NODES: GLOBAL: 01" },
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
