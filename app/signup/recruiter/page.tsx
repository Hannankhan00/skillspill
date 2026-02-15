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
        const ripple = document.createElement("span");
        ripple.style.cssText = `position:absolute;border-radius:50%;background:rgba(255,255,255,0.3);width:${size}px;height:${size}px;left:${x}px;top:${y}px;transform:scale(0);animation:ripple-expand 0.6s ease-out forwards;pointer-events:none;`;
        el.style.position = "relative";
        el.style.overflow = "hidden";
        el.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }, []);
}

/* ───────────── Icons ───────────── */
const IconUser = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>);
const IconMail = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>);
const IconLock = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>);
const IconRadarScan = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" opacity="0.3" /><circle cx="12" cy="12" r="6" opacity="0.5" /><circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" /><line x1="12" y1="2" x2="12" y2="6" /></svg>);
const IconBroadcast = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" /><path d="M16.24 7.76a6 6 0 0 1 0 8.49" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /><path d="M7.76 16.24a6 6 0 0 1 0-8.49" /><path d="M4.93 19.07a10 10 0 0 1 0-14.14" /></svg>);
const IconBuilding = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01" /></svg>);
const IconGlobe = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>);
const IconBriefcase = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>);
const IconUsers = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>);
const IconTerminal = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" /></svg>);
const IconSend = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>);
const IconArrowRight = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>);
const IconArrowLeft = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>);
const IconBolt = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>);
const IconMapPin = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>);

/* ───────────── Constants ───────────── */
const STEPS = [
    { id: "account", label: "Account" },
    { id: "company", label: "Company" },
    { id: "verify", label: "Finish" },
];

const COMPANY_SIZES = ["1-10", "11-50", "51-200", "201-1000", "1000+"];
const INDUSTRIES = ["SaaS", "FinTech", "HealthTech", "EdTech", "E-commerce", "AI / ML", "Web3 / Crypto", "Gaming", "DevTools", "Cybersecurity", "Cloud", "Consulting", "Media", "Social"];

/* ───────────── Particles ───────────── */
interface Particle { x: number; y: number; vx: number; vy: number; size: number; opacity: number; }
function ParticlesCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = canvasRef.current; if (!canvas) return;
        const ctx = canvas.getContext("2d"); if (!ctx) return;
        let animationId: number; const particles: Particle[] = [];
        const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
        resize(); window.addEventListener("resize", resize);
        for (let i = 0; i < 35; i++) particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, vx: (Math.random() - 0.5) * 0.15, vy: (Math.random() - 0.5) * 0.15, size: Math.random() * 1.2 + 0.4, opacity: Math.random() * 0.2 + 0.03 });
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p) => { p.x += p.vx; p.y += p.vy; if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0; if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0; ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fillStyle = `rgba(168, 85, 247, ${p.opacity})`; ctx.fill(); });
            for (let i = 0; i < particles.length; i++) for (let j = i + 1; j < particles.length; j++) { const dx = particles[i].x - particles[j].x; const dy = particles[i].y - particles[j].y; const dist = Math.sqrt(dx * dx + dy * dy); if (dist < 100) { ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y); ctx.strokeStyle = `rgba(168, 85, 247, ${0.02 * (1 - dist / 100)})`; ctx.lineWidth = 0.5; ctx.stroke(); } }
            animationId = requestAnimationFrame(draw);
        };
        draw();
        return () => { cancelAnimationFrame(animationId); window.removeEventListener("resize", resize); };
    }, []);
    return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-0" />;
}

/* ───────────── Form Types ───────────── */
interface FormData {
    fullName: string; email: string; password: string; confirmPassword: string; jobTitle: string;
    companyName: string; companySize: string; companyWebsite: string; industry: string[]; location: string;
    agreedToTerms: boolean;
}

/* ═══════════════════════ MAIN PAGE ═══════════════════════ */
export default function RecruiterSignup() {
    const router = useRouter();
    const ripple = useRipple();
    const [currentStep, setCurrentStep] = useState(0);
    const [direction, setDirection] = useState(1);
    const [animating, setAnimating] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const [formData, setFormData] = useState<FormData>({
        fullName: "", email: "", password: "", confirmPassword: "", jobTitle: "",
        companyName: "", companySize: "", companyWebsite: "", industry: [], location: "",
        agreedToTerms: false,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
    const codeRefs = useRef<(HTMLInputElement | null)[]>([]);

    const mono = { fontFamily: "var(--font-jetbrains-mono), monospace" };

    /* Accent color constant for easy reference */
    const A = "#A855F7";

    const cardCls = `bg-[#0D0D12]/80 backdrop-blur-xl border border-white/[0.07] rounded-2xl shadow-[0_0_80px_rgba(168,85,247,0.04),0_4px_30px_rgba(0,0,0,0.5)]`;
    const inputWrap = (hasError: boolean) =>
        `flex items-center bg-[#1A1A24] border rounded-xl transition-all duration-200 focus-within:border-[${A}]/50 focus-within:shadow-[0_0_0_3px_rgba(168,85,247,0.08)] ${hasError ? "border-[#FF003C]/50" : "border-white/[0.07]"}`;
    const inputCls = "flex-1 min-w-0 bg-transparent border-none text-white py-3 px-4 text-sm outline-none placeholder:text-[#444]";

    const updateForm = (field: keyof FormData, value: FormData[keyof FormData]) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
    };

    const goToStep = (step: number) => {
        if (animating) return;
        setDirection(step > currentStep ? 1 : -1);
        setAnimating(true);
        setTimeout(() => { setCurrentStep(step); setAnimating(false); }, 300);
    };

    const nextStep = () => { if (validateCurrentStep()) goToStep(Math.min(currentStep + 1, STEPS.length - 1)); };
    const prevStep = () => { goToStep(Math.max(currentStep - 1, 0)); };

    const validateCurrentStep = () => {
        const e: Record<string, string> = {};
        if (currentStep === 0) {
            if (!formData.fullName.trim()) e.fullName = "Full name is required";
            if (!formData.email.trim()) e.email = "Email is required";
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = "Invalid email format";
            if (!formData.password) e.password = "Password is required";
            else if (formData.password.length < 8) e.password = "Min 8 characters";
            if (formData.password !== formData.confirmPassword) e.confirmPassword = "Passwords do not match";
            if (!formData.jobTitle.trim()) e.jobTitle = "Job title required";
        }
        if (currentStep === 1) {
            if (!formData.companyName.trim()) e.companyName = "Company name required";
            if (!formData.companySize) e.companySize = "Company size required";
        }
        setErrors(e); return Object.keys(e).length === 0;
    };

    const toggleIndustry = (ind: string) => {
        setFormData((prev) => ({ ...prev, industry: prev.industry.includes(ind) ? prev.industry.filter((i) => i !== ind) : [...prev.industry, ind] }));
    };

    const handleVerificationInput = (i: number, v: string) => { if (v.length > 1) v = v.slice(-1); if (v && !/^\d$/.test(v)) return; const c = [...verificationCode]; c[i] = v; setVerificationCode(c); if (v && i < 5) codeRefs.current[i + 1]?.focus(); };
    const handleVerificationKeyDown = (i: number, e: React.KeyboardEvent) => { if (e.key === "Backspace" && !verificationCode[i] && i > 0) codeRefs.current[i - 1]?.focus(); };

    const progressPercent = ((currentStep + 1) / STEPS.length) * 100;

    /* ═══════ STEPS ═══════ */
    const renderAccount = () => (
        <div className="flex flex-col gap-5" key="account">
            <div className="mb-1">
                <h2 className="text-xl font-bold text-white mb-1">Create Your <span className="text-[#A855F7]">Account</span></h2>
                <p className="text-xs text-[#666]" style={mono}>Set up your recruiter profile on the SkillSpill network.</p>
            </div>
            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-white flex items-center gap-1.5"><IconUser /> Full Name</label>
                <div className={inputWrap(!!errors.fullName)}><input type="text" className={inputCls} style={mono} placeholder="Jane Smith" value={formData.fullName} onChange={(e) => updateForm("fullName", e.target.value)} id="input-fullname" /></div>
                {errors.fullName && <span className="text-xs text-[#FF003C]" style={mono}>{errors.fullName}</span>}
            </div>
            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-white flex items-center gap-1.5"><IconMail /> Work Email</label>
                <div className={inputWrap(!!errors.email)}><input type="email" className={inputCls} style={mono} placeholder="jane@company.future" value={formData.email} onChange={(e) => updateForm("email", e.target.value)} id="input-email" /></div>
                {errors.email && <span className="text-xs text-[#FF003C]" style={mono}>{errors.email}</span>}
            </div>
            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-white flex items-center gap-1.5"><IconBriefcase /> Job Title</label>
                <div className={inputWrap(!!errors.jobTitle)}><input type="text" className={inputCls} style={mono} placeholder="Head of Engineering" value={formData.jobTitle} onChange={(e) => updateForm("jobTitle", e.target.value)} id="input-jobtitle" /></div>
                {errors.jobTitle && <span className="text-xs text-[#FF003C]" style={mono}>{errors.jobTitle}</span>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-bold text-white flex items-center gap-1.5"><IconLock /> Password</label>
                    <div className={inputWrap(!!errors.password)}>
                        <input type={showPassword ? "text" : "password"} className={inputCls} style={mono} placeholder="••••••••••" value={formData.password} onChange={(e) => updateForm("password", e.target.value)} id="input-password" />
                        <button type="button" className="bg-transparent border-none text-[#555] px-3 py-2 cursor-pointer hover:text-[#A855F7] transition-colors flex items-center" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <IconBroadcast /> : <IconRadarScan />}</button>
                    </div>
                    {errors.password && <span className="text-xs text-[#FF003C]" style={mono}>{errors.password}</span>}
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-bold text-white flex items-center gap-1.5"><IconLock /> Confirm</label>
                    <div className={inputWrap(!!errors.confirmPassword)}>
                        <input type={showConfirmPassword ? "text" : "password"} className={inputCls} style={mono} placeholder="••••••••••" value={formData.confirmPassword} onChange={(e) => updateForm("confirmPassword", e.target.value)} id="input-confirm-password" />
                        <button type="button" className="bg-transparent border-none text-[#555] px-3 py-2 cursor-pointer hover:text-[#A855F7] transition-colors flex items-center" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>{showConfirmPassword ? <IconBroadcast /> : <IconRadarScan />}</button>
                    </div>
                    {errors.confirmPassword && <span className="text-xs text-[#FF003C]" style={mono}>{errors.confirmPassword}</span>}
                </div>
            </div>
        </div>
    );

    const renderCompany = () => (
        <div className="flex flex-col gap-5" key="company">
            <div className="mb-1">
                <h2 className="text-xl font-bold text-white mb-1">Company <span className="text-[#A855F7]">Details</span></h2>
                <p className="text-xs text-[#666]" style={mono}>Tell us about your organization to match you with the best talent.</p>
            </div>
            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-white flex items-center gap-1.5"><IconBuilding /> Company Name</label>
                <div className={inputWrap(!!errors.companyName)}><input type="text" className={inputCls} style={mono} placeholder="Acme Corp" value={formData.companyName} onChange={(e) => updateForm("companyName", e.target.value)} id="input-company" /></div>
                {errors.companyName && <span className="text-xs text-[#FF003C]" style={mono}>{errors.companyName}</span>}
            </div>
            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-white flex items-center gap-1.5"><IconGlobe /> Company Website <span className="font-normal text-[#555] text-xs">(optional)</span></label>
                <div className={inputWrap(false)}><input type="url" className={inputCls} style={mono} placeholder="https://acme.corp" value={formData.companyWebsite} onChange={(e) => updateForm("companyWebsite", e.target.value)} id="input-website" /></div>
            </div>
            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-white flex items-center gap-1.5"><IconMapPin /> Location <span className="font-normal text-[#555] text-xs">(optional)</span></label>
                <div className={inputWrap(false)}><input type="text" className={inputCls} style={mono} placeholder="San Francisco, CA / Remote" value={formData.location} onChange={(e) => updateForm("location", e.target.value)} id="input-location" /></div>
            </div>
            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-white flex items-center gap-1.5"><IconUsers /> Company Size</label>
                {errors.companySize && <span className="text-xs text-[#FF003C]" style={mono}>{errors.companySize}</span>}
                <div className="flex flex-wrap gap-2">
                    {COMPANY_SIZES.map((size) => (
                        <button key={size} onClick={(e) => { ripple(e); updateForm("companySize", size); }}
                            className={`px-4 py-2.5 rounded-xl text-sm font-bold cursor-pointer transition-all duration-200 border ${formData.companySize === size ? "border-[#A855F7]/50 bg-[#A855F7]/[0.06] text-[#A855F7] shadow-[0_0_12px_rgba(168,85,247,0.1)]" : "border-white/[0.07] bg-[#1A1A24] text-[#666] hover:border-[#A855F7]/30"}`}
                            style={mono}>{size}</button>
                    ))}
                </div>
            </div>
            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-white flex items-center gap-1.5"><IconBriefcase /> Industry <span className="font-normal text-[#555] text-xs">(optional)</span></label>
                <div className="flex flex-wrap gap-1.5">
                    {INDUSTRIES.map((ind) => (
                        <button key={ind} onClick={(e) => { ripple(e); toggleIndustry(ind); }}
                            className={`px-2.5 py-1 rounded text-xs border cursor-pointer transition-all duration-200 ${formData.industry.includes(ind) ? "bg-[#A855F7]/10 border-[#A855F7]/40 text-[#A855F7]" : "bg-[#1A1A24] border-white/[0.07] text-[#666] hover:border-[#A855F7]/30 hover:text-[#A855F7]/80"}`} style={mono}>
                            {ind}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderVerification = () => (
        <div className="flex flex-col gap-5" key="verify">
            <div className="mb-1">
                <h2 className="text-xl font-bold text-white mb-1">Verify Your <span className="text-[#A855F7]">Email</span></h2>
                <p className="text-xs text-[#666]" style={mono}>Verify your identity and activate your recruiter account.</p>
            </div>
            <div className="flex flex-col items-center text-center gap-3 py-4">
                <div className="w-12 h-12 rounded-xl bg-[#A855F7]/10 border border-[#A855F7]/25 flex items-center justify-center text-[#A855F7]"><IconMail /></div>
                <h3 className="text-lg font-bold text-white m-0">Email <span className="text-[#A855F7]">Verification</span></h3>
                <p className="text-sm text-[#666] m-0">We&apos;ve sent a 6-digit code to <strong className="text-[#A855F7]">{formData.email || "your email"}</strong></p>
                <div className="flex gap-2 justify-center mt-2" id="verification-code">
                    {verificationCode.map((digit, i) => (
                        <input key={i} ref={(el) => { codeRefs.current[i] = el; }} type="text" inputMode="numeric" maxLength={1}
                            className="w-11 h-14 text-center text-xl font-bold bg-[#1A1A24] border border-white/[0.07] rounded-xl text-[#A855F7] outline-none focus:border-[#A855F7]/50 focus:shadow-[0_0_0_3px_rgba(168,85,247,0.08)] transition-all"
                            style={mono} value={digit} onChange={(e) => handleVerificationInput(i, e.target.value)} onKeyDown={(e) => handleVerificationKeyDown(i, e)} />
                    ))}
                </div>
                <button onClick={ripple} className="bg-transparent border-none text-[#555] text-sm cursor-pointer">Didn&apos;t receive code? <span className="text-[#A855F7] font-semibold">Resend</span></button>
            </div>
            {/* Summary */}
            <div className="bg-[#1A1A24] border border-white/[0.07] rounded-xl p-5">
                <h3 className="text-xs font-bold text-[#A855F7]/60 uppercase tracking-wider flex items-center gap-2 mb-3" style={mono}><IconTerminal /> Registration Summary</h3>
                <div className="grid grid-cols-2 gap-2">
                    {[
                        { l: "Name", v: formData.fullName || "—" },
                        { l: "Job Title", v: formData.jobTitle || "—" },
                        { l: "Email", v: formData.email || "—" },
                        { l: "Company", v: formData.companyName || "—" },
                        { l: "Size", v: formData.companySize || "—" },
                        { l: "Industry", v: formData.industry.length > 0 ? formData.industry.join(", ") : "—" },
                    ].map((item) => (
                        <div key={item.l} className="flex flex-col">
                            <span className="text-[0.6rem] text-[#555] uppercase tracking-wider" style={mono}>{item.l}</span>
                            <span className="text-sm text-white truncate">{item.v}</span>
                        </div>
                    ))}
                </div>
            </div>
            <label className="flex items-start gap-2.5 cursor-pointer text-sm text-[#888] leading-relaxed">
                <input type="checkbox" className="hidden peer" checked={formData.agreedToTerms} onChange={(e) => updateForm("agreedToTerms", e.target.checked)} />
                <span className="w-[16px] h-[16px] border border-[#A855F7]/30 rounded shrink-0 mt-0.5 transition-all peer-checked:bg-[#A855F7] peer-checked:border-[#A855F7] relative after:content-['✓'] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:text-white after:text-[0.6rem] after:font-black after:opacity-0 peer-checked:after:opacity-100" />
                <span>I agree to the <a href="#" className="text-[#A855F7] underline">Terms of Service</a> and <a href="#" className="text-[#A855F7] underline">Privacy Policy</a></span>
            </label>
        </div>
    );

    const stepRenderers = [renderAccount, renderCompany, renderVerification];

    return (
        <div className="relative w-full min-h-screen overflow-hidden flex flex-col items-center px-4 py-10">
            <style>{`@keyframes ripple-expand { to { transform: scale(1); opacity: 0; } }`}</style>
            <ParticlesCanvas />

            {/* Ambient purple glows */}
            <div className="fixed top-[15%] left-[20%] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(168,85,247,0.05)_0%,transparent_70%)] pointer-events-none" />
            <div className="fixed bottom-[10%] right-[15%] w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(168,85,247,0.04)_0%,transparent_70%)] pointer-events-none" />

            {/* ─── LOGO ─── */}
            <div className="relative z-10 flex items-center gap-3 mb-8 mt-4" id="rec-signup-logo">
                <div className="w-10 h-10 rounded-xl bg-[#A855F7] flex items-center justify-center text-white shadow-[0_0_20px_rgba(168,85,247,0.4),0_0_60px_rgba(168,85,247,0.15)]">
                    <IconBolt />
                </div>
                <span className="text-2xl font-bold text-white tracking-tight">SkillSpill</span>
            </div>

            {/* ─── MAIN CARD ─── */}
            <div className={`relative z-10 w-full max-w-[520px] ${cardCls}`} id="rec-signup-card">
                <div className="p-6 sm:p-8">

                    {/* Progress bar */}
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[0.6rem] text-[#A855F7]/50 uppercase tracking-[2px]" style={mono}>Recruiter Registration</span>
                        <span className="text-xs text-[#A855F7] font-bold" style={mono}>{Math.round(progressPercent)}%</span>
                    </div>
                    <div className="w-full h-[3px] bg-white/[0.06] rounded overflow-hidden mb-5">
                        <div className="h-full bg-[#A855F7] rounded shadow-[0_0_8px_rgba(168,85,247,0.4)] transition-all duration-500" style={{ width: `${progressPercent}%` }} />
                    </div>

                    {/* Step Indicators */}
                    <div className="flex bg-[#1A1A24] rounded-full p-1 mb-6" id="rec-step-tabs">
                        {STEPS.map((step, i) => (
                            <button key={step.id} onClick={(e) => { if (i <= currentStep) { ripple(e); goToStep(i); } }} disabled={i > currentStep}
                                className={`flex-1 py-2 rounded-full text-[0.65rem] font-bold transition-all duration-300 cursor-pointer border-none uppercase tracking-wider ${i === currentStep ? "bg-[#A855F7] text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]" : i < currentStep ? "bg-transparent text-[#A855F7]/60 hover:text-[#A855F7]" : "bg-transparent text-[#444] cursor-not-allowed"}`}
                                style={mono} id={`step-nav-${step.id}`}>
                                {step.label}
                            </button>
                        ))}
                    </div>

                    {/* Step Content */}
                    <div className={`transition-all duration-300 ${animating ? (direction > 0 ? "-translate-x-[30px] opacity-0" : "translate-x-[30px] opacity-0") : "translate-x-0 opacity-100"}`}>
                        {stepRenderers[currentStep]()}
                    </div>
                </div>
            </div>

            {/* ─── NAV BUTTONS ─── */}
            <div className="relative z-10 w-full max-w-[520px] flex flex-col gap-3 mt-5" id="rec-step-nav-buttons">
                {currentStep === STEPS.length - 1 ? (
                    <>
                        <button onClick={async (e) => {
                            ripple(e); setSubmitLoading(true); setSubmitError("");
                            try { const res = await fetch("/api/auth/signup/recruiter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) }); const data = await res.json(); if (!res.ok) { setSubmitError(data.errors ? Object.values(data.errors).join(", ") : (data.error || "Signup failed")); return; } router.push("/dashboard"); } catch { setSubmitError("Network error. Please try again."); } finally { setSubmitLoading(false); }
                        }} className="w-full py-4 bg-gradient-to-r from-[#A855F7] to-[#9333ea] text-white border-none rounded-full font-bold text-sm uppercase tracking-[0.15em] cursor-pointer transition-all duration-300 shadow-[0_4px_25px_rgba(168,85,247,0.3)] hover:shadow-[0_4px_35px_rgba(168,85,247,0.5)] hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none flex items-center justify-center gap-2" disabled={!formData.agreedToTerms || submitLoading} id="btn-submit">
                            {submitLoading ? <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><IconSend /> COMPLETE REGISTRATION</>}
                        </button>
                        {submitError && <p className="text-[#FF003C] text-xs text-center" style={mono}>{submitError}</p>}
                    </>
                ) : (
                    <button onClick={(e) => { ripple(e); nextStep(); }} className="w-full py-4 bg-gradient-to-r from-[#A855F7] to-[#9333ea] text-white border-none rounded-full font-bold text-sm uppercase tracking-[0.15em] cursor-pointer transition-all duration-300 shadow-[0_4px_25px_rgba(168,85,247,0.3)] hover:shadow-[0_4px_35px_rgba(168,85,247,0.5)] hover:-translate-y-0.5 flex items-center justify-center gap-2" id="btn-next">
                        Next: {STEPS[currentStep + 1]?.label.toUpperCase()} <IconArrowRight />
                    </button>
                )}
                {currentStep > 0 && (
                    <button onClick={(e) => { ripple(e); prevStep(); }} className="bg-transparent border-none text-[#555] text-sm cursor-pointer tracking-wide flex items-center justify-center gap-1.5 no-underline hover:text-white transition-colors py-2" id="btn-prev"><IconArrowLeft /> Back</button>
                )}
                {currentStep === 0 && (
                    <a href="/login" className="text-center bg-transparent text-[#555] text-sm cursor-pointer tracking-wide no-underline hover:text-white transition-colors py-2">Cancel Registration</a>
                )}
            </div>

            {/* Bottom glow line */}
            <div className="relative z-10 mt-10 w-full max-w-[300px] h-px bg-gradient-to-r from-transparent via-[#A855F7]/20 to-transparent" />
        </div>
    );
}
