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
const IconUser = (props: any) => (<svg {...props} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>);
const IconMail = (props: any) => (<svg {...props} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>);
const IconAtSign = (props: any) => (<svg {...props} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" /></svg>);
const IconBriefcase = (props: any) => (<svg {...props} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>);
const IconLock = (props: any) => (<svg {...props} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>);
const IconRadarScan = (props: any) => (<svg {...props} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" opacity="0.3" /><circle cx="12" cy="12" r="6" opacity="0.5" /><circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" /><line x1="12" y1="2" x2="12" y2="6" /></svg>);
const IconBroadcast = (props: any) => (<svg {...props} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" /><path d="M16.24 7.76a6 6 0 0 1 0 8.49" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /><path d="M7.76 16.24a6 6 0 0 1 0-8.49" /><path d="M4.93 19.07a10 10 0 0 1 0-14.14" /></svg>);
const IconBuilding = (props: any) => (<svg {...props} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01" /><path d="M16 6h.01" /><path d="M8 10h.01" /><path d="M16 10h.01" /><path d="M8 14h.01" /><path d="M16 14h.01" /><path d="M8 18h.01" /><path d="M16 18h.01" /></svg>);
const IconGlobe = (props: any) => (<svg {...props} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>);
const IconUsers = (props: any) => (<svg {...props} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>);
const IconPhone = (props: any) => (<svg {...props} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.59 12 19.79 19.79 0 0 1 1.08 3.05 2 2 0 0 1 3.05 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16z" /></svg>);
const IconMapPin = (props: any) => (<svg {...props} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>);
const IconArrowRight = (props: any) => (<svg {...props} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>);
const IconArrowLeft = (props: any) => (<svg {...props} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>);
const IconX = (props: any) => (<svg {...props} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>);
const IconStar = (props: any) => (<svg {...props} width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>);
const IconBolt = (props: any) => (<svg {...props} width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>);
const IconGrid = (props: any) => (<svg {...props} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>);

/* ───────────── Constants ───────────── */
const STEPS = [
    { id: "account", label: "Account" },
    { id: "company", label: "Company" },
    { id: "confirm", label: "Confirm" },
];

const INDUSTRIES = [
    "Fintech", "Healthcare", "E-commerce", "AI/ML", "Blockchain", "SaaS", "EdTech", "Cybersecurity", "Gaming", "Logistics", "GreenTech", "AdTech"
];

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
interface RecruiterFormData {
    companyName: string; email: string; password: string; confirmPassword: string;
    companyWebsite: string; companyPhone: string; companySize: string;
    addressLine1: string; addressLine2: string; city: string;
    state: string; postalCode: string; country: string;
    industry: string[];
    agreedToTerms: boolean;
}

/* ═══════════════════════ MAIN PAGE ═══════════════════════ */
const mono = { fontFamily: "var(--font-jetbrains-mono), monospace" };

/* REUSABLE UI COMPONENTS */
const InputField = ({ label, icon: Icon, value, onChange, type = "text", placeholder, error, rightElement }: any) => (
    <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 text-[10px] font-bold text-secondary uppercase tracking-wider" style={mono}>
            <Icon className="w-3 h-3" /> {label}
        </label>
        <div className={`relative group`}>
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full bg-[#111] border rounded-lg px-4 py-3.5 text-sm text-white focus:outline-none focus:bg-[#151515] transition-all font-mono placeholder:text-white/20 ${error ? 'border-danger' : 'border-white/10 group-hover:border-white/20 focus:border-[#A855F7]'}`}
                style={mono}
            />
            {rightElement && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {rightElement}
                </div>
            )}
        </div>
        {error && <span className="text-[10px] text-danger font-mono">{error}</span>}
    </div>
);
export default function RecruiterSignup() {
    const router = useRouter();
    const ripple = useRipple();
    const [currentStep, setCurrentStep] = useState(0);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const [formData, setFormData] = useState<RecruiterFormData>({
        companyName: "", email: "", password: "", confirmPassword: "",
        companyWebsite: "", companyPhone: "", companySize: "",
        addressLine1: "", addressLine2: "", city: "",
        state: "", postalCode: "", country: "",
        industry: [],
        agreedToTerms: false
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // OTP stage — shown after successful form submission
    const [otpStage, setOtpStage] = useState(false);
    const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
    const [otpLoading, setOtpLoading] = useState(false);
    const [otpError, setOtpError] = useState("");
    const [resendCooldown, setResendCooldown] = useState(0);
    const [resendLoading, setResendLoading] = useState(false);
    const codeRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (resendCooldown <= 0) return;
        const t = setTimeout(() => setResendCooldown(c => c - 1), 1000);
        return () => clearTimeout(t);
    }, [resendCooldown]);


    const COLOR_ACCENT = "#A855F7"; // Purple for Company

    const updateForm = (field: keyof RecruiterFormData, value: RecruiterFormData[keyof RecruiterFormData]) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
    };

    const goToStep = (step: number) => {
        setCurrentStep(step);
    };

    const nextStep = () => { if (validateCurrentStep()) goToStep(Math.min(currentStep + 1, STEPS.length - 1)); };
    const prevStep = () => { goToStep(Math.max(currentStep - 1, 0)); };

    const validateCurrentStep = () => {
        const e: Record<string, string> = {};
        if (currentStep === 0) {
            if (!formData.companyName.trim()) e.companyName = "Required";
            if (!formData.email.trim()) e.email = "Required";
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = "Invalid email";
            // Website: if provided, must be a valid URL
            if (formData.companyWebsite.trim()) {
                try { new URL(formData.companyWebsite.startsWith("http") ? formData.companyWebsite : `https://${formData.companyWebsite}`); }
                catch { e.companyWebsite = "Please enter a valid website URL (e.g. https://company.com)"; }
            }
            if (!formData.password) e.password = "Required";
            else if (formData.password.length < 8) e.password = "Min 8 chars";
            if (formData.password !== formData.confirmPassword) e.confirmPassword = "Mismatch";
        }
        if (currentStep === 1) {
            if (formData.industry.length === 0) e.industry = "Select at least one";
        }
        setErrors(e); return Object.keys(e).length === 0;
    };

    const toggleIndustry = (ind: string) => {
        setFormData((prev) => ({ ...prev, industry: prev.industry.includes(ind) ? prev.industry.filter((i) => i !== ind) : [...prev.industry, ind] }));
        if (errors.industry) setErrors((prev) => { const n = { ...prev }; delete n.industry; return n; });
    };

    const progressPercent = ((currentStep + 1) / STEPS.length) * 100;

    const handleOtpInput = (i: number, v: string) => { if (v.length > 1) v = v.slice(-1); if (v && !/^\d$/.test(v)) return; const c = [...otpCode]; c[i] = v; setOtpCode(c); setOtpError(""); if (v && i < 5) codeRefs.current[i + 1]?.focus(); };
    const handleOtpKeyDown = (i: number, e: React.KeyboardEvent) => { if (e.key === "Backspace" && !otpCode[i] && i > 0) codeRefs.current[i - 1]?.focus(); };

    const handleVerifyOtp = async () => {
        const otp = otpCode.join("");
        if (otp.length < 6) { setOtpError("Please enter all 6 digits."); return; }
        setOtpLoading(true); setOtpError("");
        try {
            const res = await fetch("/api/auth/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: formData.email, otp }) });
            const data = await res.json();
            if (!res.ok) { setOtpError(data.error || "Verification failed."); return; }
            router.push("/login?verified=true");
        } catch { setOtpError("Network error. Please try again."); }
        finally { setOtpLoading(false); }
    };

    const handleResendOtp = async () => {
        setResendLoading(true); setOtpError("");
        try {
            const res = await fetch("/api/auth/resend-otp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: formData.email }) });
            const data = await res.json();
            if (!res.ok) { setOtpError(data.error || "Failed to resend code."); return; }
            setOtpCode(["", "", "", "", "", ""]); setResendCooldown(60); codeRefs.current[0]?.focus();
        } catch { setOtpError("Network error. Please try again."); }
        finally { setResendLoading(false); }
    };

    /* ═══════ STEPS ═══════ */
    const renderAccount = () => (
        <div className="flex flex-col gap-6 animate-in slide-in-from-right-4 fade-in duration-300">
            <div className="mb-2">
                <h2 className="text-2xl font-bold text-white mb-1">Company <span className="text-[#A855F7]">Account</span></h2>
                <p className="text-xs text-[#666]" style={mono}>Phase 1: Register your company credentials.</p>
            </div>

            <InputField label="Company Name" icon={IconBuilding} value={formData.companyName} onChange={(e: any) => updateForm("companyName", e.target.value)} placeholder="e.g. SkillSpill" error={errors.companyName} />
            <InputField label="Company Email" icon={IconMail} value={formData.email} onChange={(e: any) => updateForm("email", e.target.value)} placeholder="contact@company.com" error={errors.email} />
            <InputField label="Website" icon={IconGlobe} value={formData.companyWebsite} onChange={(e: any) => updateForm("companyWebsite", e.target.value)} placeholder="https://company.com" error={errors.companyWebsite} />

            <div className="grid grid-cols-2 gap-4">
                <InputField
                    label="Password"
                    icon={IconLock}
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e: any) => updateForm("password", e.target.value)}
                    placeholder="••••••••"
                    error={errors.password}
                    rightElement={<button onClick={() => setShowPassword(!showPassword)} type="button" className="text-[#555] hover:text-[#A855F7]">{showPassword ? <IconBroadcast /> : <IconRadarScan />}</button>}
                />
                <InputField
                    label="Confirm"
                    icon={IconLock}
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e: any) => updateForm("confirmPassword", e.target.value)}
                    placeholder="••••••••"
                    error={errors.confirmPassword}
                    rightElement={<button onClick={() => setShowConfirmPassword(!showConfirmPassword)} type="button" className="text-[#555] hover:text-[#A855F7]">{showConfirmPassword ? <IconBroadcast /> : <IconRadarScan />}</button>}
                />
            </div>
        </div>
    );

    const renderCompany = () => (
        <div className="flex flex-col gap-6 animate-in slide-in-from-right-4 fade-in duration-300">
            <div className="mb-2">
                <h2 className="text-2xl font-bold text-white mb-1">Company <span className="text-[#A855F7]">Details</span></h2>
                <p className="text-xs text-[#666]" style={mono}>Phase 2: Tell us about your organization.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <InputField label="Phone" icon={IconPhone} value={formData.companyPhone} onChange={(e: any) => updateForm("companyPhone", e.target.value)} placeholder="+92 300 1234567" />
                <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-[#A855F7] uppercase tracking-wider flex items-center gap-2" style={mono}><IconUsers /> Company Size</label>
                    <select value={formData.companySize} onChange={(e) => updateForm("companySize", e.target.value)}
                        className="w-full bg-[#111] border border-white/10 rounded-lg px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#A855F7] font-mono appearance-none" style={mono}>
                        <option value="" disabled>Select Size</option>
                        <option value="1-10">1–10 Employees</option>
                        <option value="11-50">11–50 Employees</option>
                        <option value="51-200">51–200 Employees</option>
                        <option value="201-1000">201–1000 Employees</option>
                        <option value="1000+">1000+ Employees</option>
                    </select>
                </div>
            </div>

            {/* Structured Address */}
            <div>
                <label className="text-[10px] font-bold text-[#A855F7] uppercase tracking-wider flex items-center gap-2 mb-3" style={mono}><IconMapPin /> Company Address</label>
                <div className="flex flex-col gap-3">
                    <InputField label="Address Line 1" icon={IconMapPin} value={formData.addressLine1} onChange={(e: any) => updateForm("addressLine1", e.target.value)} placeholder="Street address, P.O. box" />
                    <InputField label="Address Line 2" icon={IconMapPin} value={formData.addressLine2} onChange={(e: any) => updateForm("addressLine2", e.target.value)} placeholder="Apartment, suite, unit (optional)" />
                    <div className="grid grid-cols-2 gap-3">
                        <InputField label="City" icon={IconMapPin} value={formData.city} onChange={(e: any) => updateForm("city", e.target.value)} placeholder="e.g. Karachi" />
                        <InputField label="State / Province" icon={IconMapPin} value={formData.state} onChange={(e: any) => updateForm("state", e.target.value)} placeholder="e.g. Sindh" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <InputField label="Postal Code" icon={IconMapPin} value={formData.postalCode} onChange={(e: any) => updateForm("postalCode", e.target.value)} placeholder="e.g. 75500" />
                        <InputField label="Country" icon={IconMapPin} value={formData.country} onChange={(e: any) => updateForm("country", e.target.value)} placeholder="e.g. Pakistan" />
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <label className="text-[10px] font-bold text-[#A855F7] uppercase tracking-wider flex items-center gap-2" style={mono}><IconGrid /> Industry Sectors</label>
                <div className="flex flex-wrap gap-2">
                    {INDUSTRIES.map(ind => (
                        <button key={ind} onClick={() => toggleIndustry(ind)} className={`px-3 py-1.5 rounded-lg text-[10px] font-mono border transition-all ${formData.industry.includes(ind) ? 'border-[#A855F7] text-[#A855F7] bg-[#A855F7]/10' : 'border-white/5 text-[#555] hover:border-white/20 bg-[#111]'}`}>
                            {ind}
                        </button>
                    ))}
                </div>
                {errors.industry && <span className="text-[10px] text-[#FF003C]" style={mono}>{errors.industry}</span>}
            </div>
        </div>
    );

    const renderConfirm = () => (
        <div className="flex flex-col gap-6 animate-in slide-in-from-right-4 fade-in duration-300">
            <div className="mb-2">
                <h2 className="text-2xl font-bold text-white mb-1">Final <span className="text-[#A855F7]">Review</span></h2>
                <p className="text-xs text-[#666]" style={mono}>Phase 3: Confirm details to proceed.</p>
            </div>

            <div className="p-4 bg-[#111] border border-white/10 rounded-xl space-y-3">
                {[{ label: "Company", value: formData.companyName },
                { label: "Email", value: formData.email },
                { label: "Website", value: formData.companyWebsite },
                { label: "Phone", value: formData.companyPhone },
                { label: "Address", value: [formData.addressLine1, formData.addressLine2, formData.city, formData.state, formData.postalCode, formData.country].filter(Boolean).join(", ") },
                { label: "Industries", value: formData.industry.join(", ") },
                ].filter(r => r.value).map((row, i, arr) => (
                    <div key={row.label} className={`flex justify-between items-start gap-3 ${i < arr.length - 1 ? "pb-3 border-b border-white/5" : ""}`}>
                        <span className="text-xs text-[#666] shrink-0">{row.label}</span>
                        <span className="text-sm font-bold text-white text-right">{row.value}</span>
                    </div>
                ))}
            </div>

            <div className="flex items-start gap-3 p-4 bg-[#111] border border-white/10 rounded-xl">
                <input type="checkbox" className="mt-1 accent-[#A855F7]" checked={formData.agreedToTerms} onChange={e => updateForm("agreedToTerms", e.target.checked)} />
                <div className="text-xs text-[#666] leading-relaxed">
                    I agree to the <span className="text-white">Terms of Assignment</span> and <span className="text-white">Talent Acquisition Policy</span>. I verify that I represent a legitimate organization.
                </div>
            </div>
        </div>
    );

    const renderOtpStage = () => (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300">
            <div className="mb-2 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#A855F7]/10 border border-[#A855F7]/40 flex items-center justify-center">
                    <IconMail className="w-7 h-7 text-[#A855F7]" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-1">Verify <span className="text-[#A855F7]">Email</span></h2>
                <p className="text-xs text-[#666]" style={mono}>Enter the 6-digit code sent to</p>
                <p className="text-sm text-white mt-1 font-mono">{formData.email}</p>
            </div>

            <div className="flex justify-center gap-2">
                {otpCode.map((d, i) => (
                    <input
                        key={i}
                        ref={el => { codeRefs.current[i] = el; }}
                        maxLength={1}
                        value={d}
                        onChange={(e) => handleOtpInput(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        onPaste={(e) => {
                            e.preventDefault();
                            const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
                            const newCode = [...otpCode];
                            pasted.split("").forEach((ch, idx) => { if (idx < 6) newCode[idx] = ch; });
                            setOtpCode(newCode);
                            setOtpError("");
                            codeRefs.current[Math.min(pasted.length, 5)]?.focus();
                        }}
                        className="w-12 h-16 bg-[#111] border border-white/20 rounded-lg text-center text-2xl font-mono text-[#A855F7] focus:border-[#A855F7] focus:shadow-[0_0_10px_rgba(168,85,247,0.2)] outline-none transition-all"
                    />
                ))}
            </div>

            {otpError && <p className="text-[#FF003C] text-xs text-center font-mono">{otpError}</p>}

            <button
                onClick={handleVerifyOtp}
                disabled={otpLoading}
                className="w-full bg-[#A855F7] text-white font-bold h-14 rounded-xl uppercase tracking-widest hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
            >
                {otpLoading ? "VERIFYING..." : "VERIFY & ACTIVATE"}
            </button>

            <div className="text-center">
                <p className="text-xs text-[#555] mb-2">Didn't receive the code?</p>
                <button
                    onClick={handleResendOtp}
                    disabled={resendCooldown > 0 || resendLoading}
                    className="text-xs font-mono text-[#A855F7] hover:underline disabled:text-[#555] disabled:no-underline disabled:cursor-not-allowed transition-colors"
                >
                    {resendLoading ? "Sending..." : resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Code"}
                </button>
            </div>
        </div>
    );

    const stepRenderers = [renderAccount, renderCompany, renderConfirm];

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-[#A855F7]/30 flex flex-col items-center relative overflow-y-auto scrollbar-recruiter">
            <ParticlesCanvas />

            {/* Header */}
            <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-4 bg-black/50 backdrop-blur-md border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 bg-[#A855F7] rotate-45 transform shadow-[0_0_8px_#A855F7]"></div>
                    <span className="text-white font-bold text-lg tracking-wide">SkillSpill</span>
                </div>
                <div className="flex items-center gap-8">
                    <a href="/login" className="text-xs font-mono text-[#888] hover:text-white transition-colors tracking-widest uppercase">Sign In</a>
                    <a href="#" className="text-xs font-mono text-[#888] hover:text-white transition-colors tracking-widest uppercase">Help</a>
                </div>
            </header>

            <div className="absolute top-0 left-0 w-full h-[500px] bg-linear-to-br from-[#A855F7]/10 via-transparent to-transparent opacity-40 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-full h-[500px] bg-linear-to-tl from-[#00D2FF]/10 via-transparent to-transparent opacity-30 pointer-events-none" />

            {/* Background Gradients */}
            <div className="fixed top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#A855F7]/[0.03] rounded-full blur-[100px] pointer-events-none" />
            <div className="fixed bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#A855F7]/[0.02] rounded-full blur-[100px] pointer-events-none" />

            {/* Main Container */}
            <main className="relative z-10 w-full max-w-2xl px-6 py-8 flex flex-col gap-6 pt-32 pb-20">

                {/* 1. Progress Panel */}
                <div className="border border-white/10 bg-[#0A0A0A] rounded-2xl p-6 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-2 relative z-10">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-[#A855F7] tracking-[0.2em] uppercase font-bold font-mono mb-1">Company Onboarding</span>
                            <h1 className="text-2xl font-bold tracking-tight text-white">
                                {otpStage ? "Verify Email" : STEPS[currentStep].label}
                            </h1>
                        </div>
                        <span className="text-3xl font-mono font-bold text-[#A855F7] opacity-20">
                            {otpStage ? "100%" : `${Math.round(progressPercent)}%`}
                        </span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full mt-4 overflow-hidden relative z-10">
                        <div className="h-full bg-[#A855F7] shadow-[0_0_15px_#A855F7] transition-all duration-500 ease-out" style={{ width: otpStage ? "100%" : `${progressPercent}%` }} />
                    </div>
                </div>

                {/* 2. Navigation Tabs — hidden during OTP stage */}
                {!otpStage && (
                    <div className="grid grid-cols-3 gap-2">
                        {STEPS.map((step, i) => (
                            <button
                                key={step.id}
                                onClick={() => i <= currentStep && goToStep(i)}
                                disabled={i > currentStep}
                                className={`
                                    py-3 px-2 rounded-lg border text-[9px] sm:text-[10px] uppercase tracking-widest font-mono transition-all duration-300
                                    ${i === currentStep
                                        ? "border-[#A855F7] text-[#A855F7] bg-[#A855F7]/10 shadow-[0_0_15px_rgba(168,85,247,0.1)]"
                                        : i < currentStep
                                            ? "border-[#A855F7]/40 text-[#A855F7]/60 hover:text-[#A855F7] hover:border-[#A855F7]"
                                            : "border-white/5 text-white/20 cursor-not-allowed bg-[#050505]"
                                    }
                                `}
                            >
                                {step.label}
                            </button>
                        ))}
                    </div>
                )}

                {/* 3. Main Form Panel */}
                <div className="border border-white/10 bg-[#0A0A0A]/90 backdrop-blur-xl rounded-2xl p-6 sm:p-8 min-h-[460px] relative shadow-2xl">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-linear-to-r from-transparent via-[#A855F7]/30 to-transparent"></div>
                    {otpStage ? renderOtpStage() : stepRenderers[currentStep]()}
                </div>

                {/* 4. Controls — hidden during OTP stage */}
                {!otpStage && (
                    <div className="flex flex-col items-center mt-8 gap-4">
                        <button
                            onClick={currentStep === STEPS.length - 1 ? async () => {
                                setSubmitLoading(true); setSubmitError("");
                                try {
                                    const res = await fetch("/api/auth/signup/recruiter", {
                                        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
                                            companyName: formData.companyName,
                                            email: formData.email,
                                            password: formData.password,
                                            companyWebsite: formData.companyWebsite,
                                            companyPhone: formData.companyPhone,
                                            companySize: formData.companySize,
                                            addressLine1: formData.addressLine1,
                                            addressLine2: formData.addressLine2,
                                            city: formData.city,
                                            state: formData.state,
                                            postalCode: formData.postalCode,
                                            country: formData.country,
                                            industry: formData.industry,
                                        })
                                    });
                                    const data = await res.json();
                                    if (!res.ok) { setSubmitError(data.errors ? Object.values(data.errors).join(", ") : (data.error || "Signup failed")); return; }
                                    setOtpStage(true);
                                    setResendCooldown(60);
                                } catch { setSubmitError("Network connection failed."); }
                                finally { setSubmitLoading(false); }
                            } : nextStep}
                            disabled={currentStep === STEPS.length - 1 && (!formData.agreedToTerms || submitLoading)}
                            className={`
                                relative group overflow-hidden w-full sm:w-[320px] bg-[#A855F7] text-white font-bold h-14 rounded-xl uppercase tracking-widest
                                hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:scale-[1.02] transition-all duration-300
                                disabled:opacity-50 disabled:shadow-none disabled:scale-100 disabled:cursor-not-allowed
                                flex items-center justify-center gap-3 text-sm
                            `}
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                {submitLoading ? "INITIALIZING..." : (
                                    currentStep === STEPS.length - 1 ? <>COMPLETE REGISTRATION <IconBolt /></> : <>NEXT: {STEPS[currentStep + 1]?.label} <IconArrowRight /></>
                                )}
                            </span>
                            <div className="absolute top-0 -left-[100%] w-full h-full bg-linear-to-r from-transparent via-white/40 to-transparent group-hover:left-[100%] transition-all duration-700 ease-in-out"></div>
                        </button>

                        <button
                            onClick={currentStep > 0 ? prevStep : () => router.push("/")}
                            className="text-[#666] hover:text-white text-xs uppercase tracking-widest font-mono transition-colors py-2 border-b border-transparent hover:border-white/20"
                        >
                            {currentStep > 0 ? "Go Back" : "Cancel Registration"}
                        </button>
                    </div>
                )}
                {!otpStage && submitError && <div className="text-[#FF003C] text-xs text-center font-mono mt-4">{submitError}</div>}

            </main>
        </div>
    );
}
