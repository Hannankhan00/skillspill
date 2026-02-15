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
        ripple.style.cssText = `position:absolute;border-radius:50%;background:rgba(255,255,255,0.35);width:${size}px;height:${size}px;left:${x}px;top:${y}px;transform:scale(0);animation:ripple-expand 0.6s ease-out forwards;pointer-events:none;`;
        el.style.position = "relative";
        el.style.overflow = "hidden";
        el.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }, []);
}

/* ───────────── Icons ───────────── */
const IconUser = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>);
const IconMail = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>);
const IconAtSign = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" /></svg>);
const IconLock = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>);
const IconRadarScan = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" opacity="0.3" /><circle cx="12" cy="12" r="6" opacity="0.5" /><circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" /><line x1="12" y1="2" x2="12" y2="6" /></svg>);
const IconBroadcast = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" /><path d="M16.24 7.76a6 6 0 0 1 0 8.49" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /><path d="M7.76 16.24a6 6 0 0 1 0-8.49" /><path d="M4.93 19.07a10 10 0 0 1 0-14.14" /></svg>);
const IconCode = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>);
const IconPlus = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>);
const IconX = () => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>);
const IconGithub = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>);
const IconLink = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>);
const IconGlobe = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>);
const IconUpload = () => (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>);
const IconCheck = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>);
const IconArrowRight = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>);
const IconArrowLeft = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>);
const IconFileText = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>);
const IconTerminal = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" /></svg>);
const IconStar = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>);
const IconSend = () => (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>);

/* ───────────── Constants ───────────── */
const STEPS = [
    { id: "personal", label: "Personal" },
    { id: "skills", label: "Skills" },
    { id: "github", label: "GitHub" },
    { id: "portfolio", label: "Portfolio" },
    { id: "verify", label: "Finish" },
];

const POPULAR_SKILLS = ["JavaScript", "TypeScript", "Python", "React", "Next.js", "Node.js", "Rust", "Go", "Java", "C++", "C#", "Ruby", "PHP", "Swift", "Kotlin", "Docker", "Kubernetes", "AWS", "PostgreSQL", "MongoDB", "Redis", "GraphQL", "REST API", "Git", "Linux", "TensorFlow", "PyTorch", "Figma", "Solidity", "Web3"];

const EXPERIENCE_LEVELS = [
    { value: "junior", label: "Junior (0-2 yrs)", desc: "Learning the ropes" },
    { value: "mid", label: "Mid-Level (2-5 yrs)", desc: "Building expertise" },
    { value: "senior", label: "Senior (5-8 yrs)", desc: "Leading projects" },
    { value: "staff", label: "Staff+ (8+ yrs)", desc: "Shaping architecture" },
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
        for (let i = 0; i < 40; i++) particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, vx: (Math.random() - 0.5) * 0.2, vy: (Math.random() - 0.5) * 0.2, size: Math.random() * 1.5 + 0.5, opacity: Math.random() * 0.3 + 0.05 });
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p) => { p.x += p.vx; p.y += p.vy; if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0; if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0; ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fillStyle = `rgba(60, 249, 26, ${p.opacity})`; ctx.fill(); });
            for (let i = 0; i < particles.length; i++) for (let j = i + 1; j < particles.length; j++) { const dx = particles[i].x - particles[j].x; const dy = particles[i].y - particles[j].y; const dist = Math.sqrt(dx * dx + dy * dy); if (dist < 120) { ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y); ctx.strokeStyle = `rgba(60, 249, 26, ${0.03 * (1 - dist / 120)})`; ctx.lineWidth = 0.5; ctx.stroke(); } }
            animationId = requestAnimationFrame(draw);
        };
        draw();
        return () => { cancelAnimationFrame(animationId); window.removeEventListener("resize", resize); };
    }, []);
    return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-0" />;
}

/* ───────────── Form Types ───────────── */
interface FormData {
    fullName: string; email: string; username: string; password: string; confirmPassword: string;
    selectedSkills: string[]; customSkill: string; experienceLevel: string; bio: string;
    githubConnected: boolean; githubUsername: string; githubRepos: number; githubStars: number;
    portfolioUrl: string; linkedinUrl: string; resumeFile: File | null; projectLinks: string[];
    agreedToTerms: boolean; emailVerified: boolean;
}

/* ═══════════════════════ MAIN PAGE ═══════════════════════ */
export default function TalentSignup() {
    const router = useRouter();
    const ripple = useRipple();
    const [currentStep, setCurrentStep] = useState(0);
    const [direction, setDirection] = useState(1);
    const [animating, setAnimating] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const [formData, setFormData] = useState<FormData>({
        fullName: "", email: "", username: "", password: "", confirmPassword: "",
        selectedSkills: [], customSkill: "", experienceLevel: "", bio: "",
        githubConnected: false, githubUsername: "", githubRepos: 0, githubStars: 0,
        portfolioUrl: "", linkedinUrl: "", resumeFile: null, projectLinks: [""],
        agreedToTerms: false, emailVerified: false,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
    const codeRefs = useRef<(HTMLInputElement | null)[]>([]);

    const mono = { fontFamily: "var(--font-jetbrains-mono), monospace" };

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
            if (!formData.username.trim()) e.username = "Username is required";
            else if (formData.username.length < 3) e.username = "Min 3 characters";
            if (!formData.password) e.password = "Password is required";
            else if (formData.password.length < 8) e.password = "Min 8 characters";
            if (formData.password !== formData.confirmPassword) e.confirmPassword = "Passwords do not match";
        }
        if (currentStep === 1) {
            if (formData.selectedSkills.length === 0) e.skills = "Select at least one skill";
            if (!formData.experienceLevel) e.experienceLevel = "Select your experience level";
        }
        setErrors(e); return Object.keys(e).length === 0;
    };

    const toggleSkill = (skill: string) => {
        setFormData((prev) => ({ ...prev, selectedSkills: prev.selectedSkills.includes(skill) ? prev.selectedSkills.filter((s) => s !== skill) : [...prev.selectedSkills, skill] }));
        if (errors.skills) setErrors((prev) => { const n = { ...prev }; delete n.skills; return n; });
    };

    const addCustomSkill = () => { const s = formData.customSkill.trim(); if (s && !formData.selectedSkills.includes(s)) setFormData((prev) => ({ ...prev, selectedSkills: [...prev.selectedSkills, s], customSkill: "" })); };

    const simulateGithubConnect = () => { updateForm("githubConnected", true); updateForm("githubUsername", formData.username || "dev_user"); updateForm("githubRepos", 47); updateForm("githubStars", 234); };

    const addProjectLink = () => setFormData((prev) => ({ ...prev, projectLinks: [...prev.projectLinks, ""] }));
    const updateProjectLink = (i: number, v: string) => setFormData((prev) => { const l = [...prev.projectLinks]; l[i] = v; return { ...prev, projectLinks: l }; });
    const removeProjectLink = (i: number) => setFormData((prev) => ({ ...prev, projectLinks: prev.projectLinks.filter((_, idx) => idx !== i) }));

    const handleVerificationInput = (i: number, v: string) => { if (v.length > 1) v = v.slice(-1); if (v && !/^\d$/.test(v)) return; const c = [...verificationCode]; c[i] = v; setVerificationCode(c); if (v && i < 5) codeRefs.current[i + 1]?.focus(); };
    const handleVerificationKeyDown = (i: number, e: React.KeyboardEvent) => { if (e.key === "Backspace" && !verificationCode[i] && i > 0) codeRefs.current[i - 1]?.focus(); };

    const progressPercent = ((currentStep + 1) / STEPS.length) * 100;

    /* ── Reusable terminal input wrapper ── */
    const inputBox = (hasError: boolean) =>
        `input-terminal flex items-center rounded-lg transition-all ${hasError ? "input-terminal-error" : ""}`;

    const inputCls = "flex-1 min-w-0 bg-transparent border-none text-white py-3 px-4 text-[0.95rem] outline-none placeholder:text-[#555]";

    /* Label component */
    const Label = ({ icon, text, optional }: { icon: React.ReactNode; text: string; optional?: boolean }) => (
        <label className="flex items-center gap-1.5 text-xs font-semibold text-[#3CF91A]/70 uppercase tracking-wider" style={mono}>
            {icon} {text} {optional && <span className="font-normal text-[#555] normal-case tracking-normal">(optional)</span>}
        </label>
    );

    /* ═══════ STEPS ═══════ */

    const renderPersonalInfo = () => (
        <div className="flex flex-col gap-6" key="personal">
            <div className="mb-2">
                <h2 className="text-2xl font-bold mb-1">Initialize <span className="text-[#3CF91A]">Profile</span></h2>
                <p className="text-sm text-[#888]">Phase 1: Sync your core identity with the SkillSpill network.</p>
            </div>

            <div className="flex flex-col gap-2">
                <Label icon={<IconUser />} text="Full Name" />
                <div className={inputBox(!!errors.fullName)}>
                    <input type="text" className={inputCls} style={mono} placeholder="John 'Zero' Doe" value={formData.fullName} onChange={(e) => updateForm("fullName", e.target.value)} id="input-fullname" />
                </div>
                {errors.fullName && <span className="text-xs text-[#FF003C]" style={mono}>{errors.fullName}</span>}
            </div>

            <div className="flex flex-col gap-2">
                <Label icon={<IconMail />} text="Secure Email" />
                <div className={inputBox(!!errors.email)}>
                    <input type="email" className={inputCls} style={mono} placeholder="identity@mesh.net" value={formData.email} onChange={(e) => updateForm("email", e.target.value)} id="input-email" />
                </div>
                {errors.email && <span className="text-xs text-[#FF003C]" style={mono}>{errors.email}</span>}
            </div>

            <div className="flex flex-col gap-2">
                <Label icon={<IconAtSign />} text="Hacker Alias" />
                <div className={inputBox(!!errors.username)}>
                    <span className="pl-4 text-[#3CF91A] font-semibold text-[0.95rem]" style={mono}>@</span>
                    <input type="text" className={`${inputCls} pl-1`} style={mono} placeholder="neophyte_42" value={formData.username} onChange={(e) => updateForm("username", e.target.value)} id="input-username" />
                </div>
                {errors.username && <span className="text-xs text-[#FF003C]" style={mono}>{errors.username}</span>}
                <span className="text-xs text-[#555]">This will be your unique identifier across the platform.</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                    <Label icon={<IconLock />} text="Password" />
                    <div className={inputBox(!!errors.password)}>
                        <input type={showPassword ? "text" : "password"} className={inputCls} style={mono} placeholder="••••••••••" value={formData.password} onChange={(e) => updateForm("password", e.target.value)} id="input-password" />
                        <button type="button" className="bg-transparent border-none text-[#555] px-3 py-2 cursor-pointer hover:text-[#3CF91A] transition-colors flex items-center" onClick={() => setShowPassword(!showPassword)} id="toggle-password">
                            {showPassword ? <IconBroadcast /> : <IconRadarScan />}
                        </button>
                    </div>
                    {errors.password && <span className="text-xs text-[#FF003C]" style={mono}>{errors.password}</span>}
                </div>
                <div className="flex flex-col gap-2">
                    <Label icon={<IconLock />} text="Confirm" />
                    <div className={inputBox(!!errors.confirmPassword)}>
                        <input type={showConfirmPassword ? "text" : "password"} className={inputCls} style={mono} placeholder="••••••••••" value={formData.confirmPassword} onChange={(e) => updateForm("confirmPassword", e.target.value)} id="input-confirm-password" />
                        <button type="button" className="bg-transparent border-none text-[#555] px-3 py-2 cursor-pointer hover:text-[#3CF91A] transition-colors flex items-center" onClick={() => setShowConfirmPassword(!showConfirmPassword)} id="toggle-confirm-password">
                            {showConfirmPassword ? <IconBroadcast /> : <IconRadarScan />}
                        </button>
                    </div>
                    {errors.confirmPassword && <span className="text-xs text-[#FF003C]" style={mono}>{errors.confirmPassword}</span>}
                </div>
            </div>
        </div>
    );

    const renderSkills = () => (
        <div className="flex flex-col gap-6" key="skills">
            <div className="mb-2">
                <h2 className="text-2xl font-bold mb-1">Skill <span className="text-[#3CF91A]">Assessment</span></h2>
                <p className="text-sm text-[#888]">Phase 2: Declare your tech stack. Our AI will verify against your code.</p>
            </div>

            <div className="flex flex-col gap-2">
                <Label icon={<IconStar />} text="Experience Level" />
                {errors.experienceLevel && <span className="text-xs text-[#FF003C]" style={mono}>{errors.experienceLevel}</span>}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {EXPERIENCE_LEVELS.map((l) => (
                        <button key={l.value} onClick={(e) => { ripple(e); updateForm("experienceLevel", l.value); }} className={`rounded-xl p-4 text-left cursor-pointer transition-all duration-200 flex flex-col gap-1 border ${formData.experienceLevel === l.value ? "border-[#3CF91A] bg-[#3CF91A]/[0.08] shadow-[0_0_15px_rgba(60,249,26,0.15)]" : "border-white/10 bg-white/[0.03] hover:border-[#3CF91A]/30"}`} id={`exp-${l.value}`}>
                            <span className={`text-sm font-bold ${formData.experienceLevel === l.value ? "text-[#3CF91A]" : "text-white"}`}>{l.label}</span>
                            <span className="text-xs text-[#888]">{l.desc}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <Label icon={<IconCode />} text="Tech Stack" />
                {errors.skills && <span className="text-xs text-[#FF003C]" style={mono}>{errors.skills}</span>}

                {formData.selectedSkills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {formData.selectedSkills.map((s) => (
                            <span key={s} className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-[#3CF91A]/15 border border-[#3CF91A]/50 text-[#3CF91A] text-xs shadow-[0_0_8px_rgba(60,249,26,0.1)]" style={mono}>
                                {s}
                                <button className="bg-transparent border-none text-inherit cursor-pointer p-0 opacity-60 hover:opacity-100 flex items-center" onClick={() => toggleSkill(s)}><IconX /></button>
                            </span>
                        ))}
                    </div>
                )}

                <div className="flex gap-2">
                    <div className={`${inputBox(false)} flex-1`}>
                        <input type="text" className={inputCls} style={mono} placeholder="Add custom skill..." value={formData.customSkill} onChange={(e) => updateForm("customSkill", e.target.value)} onKeyDown={(e) => e.key === "Enter" && addCustomSkill()} id="input-custom-skill" />
                    </div>
                    <button onClick={(e) => { ripple(e); addCustomSkill(); }} className="w-10 h-10 flex items-center justify-center bg-[#3CF91A]/10 border border-[#3CF91A]/40 rounded-lg text-[#3CF91A] cursor-pointer hover:bg-[#3CF91A]/20 hover:shadow-[0_0_10px_rgba(60,249,26,0.2)] transition-all shrink-0" id="btn-add-skill"><IconPlus /></button>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-2">
                    {POPULAR_SKILLS.map((s) => (
                        <button key={s} onClick={(e) => { ripple(e); toggleSkill(s); }} className={`inline-flex items-center px-3 py-1.5 rounded text-xs border cursor-pointer transition-all duration-200 ${formData.selectedSkills.includes(s) ? "bg-[#3CF91A]/15 border-[#3CF91A]/50 text-[#3CF91A] shadow-[0_0_8px_rgba(60,249,26,0.1)]" : "bg-white/[0.03] border-white/10 text-[#888] hover:border-[#3CF91A]/30 hover:text-[#3CF91A]/80"}`} style={mono} id={`skill-${s.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}>
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <Label icon={<IconFileText />} text="Bio" optional />
                <div className={inputBox(false)}>
                    <textarea className={`${inputCls} resize-y min-h-20 leading-relaxed`} placeholder="Tell us about your coding journey..." value={formData.bio} onChange={(e) => updateForm("bio", e.target.value)} rows={3} id="input-bio" />
                </div>
                <span className="text-xs text-[#555]" style={mono}>{formData.bio.length}/300</span>
            </div>
        </div>
    );

    const renderGithub = () => (
        <div className="flex flex-col gap-6" key="github">
            <div className="mb-2">
                <h2 className="text-2xl font-bold mb-1">GitHub <span className="text-[#3CF91A]">Sync</span></h2>
                <p className="text-sm text-[#888]">Phase 3: Connect your GitHub to let our AI verify your real coding skills.</p>
            </div>

            {!formData.githubConnected ? (
                <div className="flex flex-col items-center text-center gap-5 py-4">
                    <div className="w-[70px] h-[70px] rounded-full bg-white/5 border border-[#3CF91A]/20 flex items-center justify-center text-white animate-glow-pulse"><IconGithub /></div>
                    <h3 className="text-xl font-bold">Link Your <span className="text-[#3CF91A]">Repository Hub</span></h3>
                    <p className="text-[#888] text-sm max-w-[400px] leading-relaxed">We analyze your public repos, contribution patterns, and code quality to build your verified skill matrix.</p>
                    <ul className="list-none p-0 m-0 flex flex-col gap-2.5 text-left w-full max-w-[380px]">
                        {["Repository analysis & language detection", "Contribution frequency & consistency tracking", "Code quality scoring via AI", "Open source contribution recognition"].map((t) => (
                            <li key={t} className="flex items-center gap-2.5 text-[#aaa] text-sm"><span className="text-[#3CF91A] shrink-0"><IconCheck /></span> {t}</li>
                        ))}
                    </ul>
                    <button onClick={(e) => { ripple(e); simulateGithubConnect(); }} className="flex items-center gap-3 px-8 py-3.5 bg-[#24292e] text-white border border-white/15 rounded-xl font-bold cursor-pointer hover:bg-[#2d3339] hover:border-[#3CF91A]/30 hover:-translate-y-0.5 transition-all" id="btn-connect-github">
                        <span className="w-5 h-5"><IconGithub /></span> Connect GitHub Account
                    </button>
                    <button onClick={(e) => { ripple(e); goToStep(3); }} className="bg-transparent border-none text-[#555] text-sm cursor-pointer hover:text-[#3CF91A] transition-colors p-2" id="btn-skip-github">Skip for now →</button>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-5">
                    <div className="flex items-center gap-4 text-left w-full">
                        <div className="w-[50px] h-[50px] rounded-full bg-[#3CF91A]/10 border-2 border-[#3CF91A] flex items-center justify-center text-[#3CF91A] shrink-0 shadow-neon-green">
                            <span className="w-[22px] h-[22px]"><IconGithub /></span>
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-[#3CF91A] flex items-center gap-2 m-0">
                                <span className="w-2 h-2 rounded-full bg-[#3CF91A] shadow-[0_0_6px_rgba(60,249,26,0.8)]" />
                                Connected Successfully
                            </h3>
                            <p className="text-[#888] text-sm mt-0.5" style={mono}>@{formData.githubUsername}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 w-full">
                        {[{ n: formData.githubRepos, l: "Repos" }, { n: formData.githubStars, l: "Stars" }, { n: "1.2k", l: "Commits" }].map((s) => (
                            <div key={s.l} className="glass-card rounded-xl p-4 flex flex-col items-center gap-1">
                                <span className="text-2xl font-extrabold text-[#3CF91A] drop-shadow-[0_0_8px_rgba(60,249,26,0.4)]" style={mono}>{s.n}</span>
                                <span className="text-[0.65rem] text-[#888] uppercase tracking-wider">{s.l}</span>
                            </div>
                        ))}
                    </div>

                    <div className="w-full">
                        <div className="w-full h-[3px] bg-white/[0.08] rounded overflow-hidden mb-3">
                            <div className="w-3/5 h-full bg-gradient-to-r from-[#3CF91A] to-[#A855F7] rounded animate-scanning-pulse" />
                        </div>
                        <span className="text-xs text-[#888] flex items-center gap-1.5" style={mono}><IconTerminal /> AI analysis queued — completing after registration</span>
                    </div>
                </div>
            )}
        </div>
    );

    const renderPortfolio = () => (
        <div className="flex flex-col gap-6" key="portfolio">
            <div className="mb-2">
                <h2 className="text-2xl font-bold mb-1">Portfolio <span className="text-[#3CF91A]">Hub</span></h2>
                <p className="text-sm text-[#888]">Phase 4: Showcase your best work and external presence.</p>
            </div>

            <div className="flex flex-col gap-2">
                <Label icon={<IconGlobe />} text="Portfolio Website" optional />
                <div className={inputBox(false)}><input type="url" className={inputCls} style={mono} placeholder="https://your-portfolio.dev" value={formData.portfolioUrl} onChange={(e) => updateForm("portfolioUrl", e.target.value)} id="input-portfolio" /></div>
            </div>

            <div className="flex flex-col gap-2">
                <Label icon={<IconLink />} text="LinkedIn" optional />
                <div className={inputBox(false)}><input type="url" className={inputCls} style={mono} placeholder="https://linkedin.com/in/your-profile" value={formData.linkedinUrl} onChange={(e) => updateForm("linkedinUrl", e.target.value)} id="input-linkedin" /></div>
            </div>

            <div className="flex flex-col gap-2">
                <Label icon={<IconCode />} text="Project Links" optional />
                {formData.projectLinks.map((link, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                        <div className={`${inputBox(false)} flex-1`}><input type="url" className={inputCls} style={mono} placeholder={`https://project-${i + 1}.example.com`} value={link} onChange={(e) => updateProjectLink(i, e.target.value)} id={`input-project-${i}`} /></div>
                        {formData.projectLinks.length > 1 && (
                            <button onClick={(e) => { ripple(e); removeProjectLink(i); }} className="w-10 h-10 flex items-center justify-center bg-[#FF003C]/10 border border-[#FF003C]/40 rounded-lg text-[#FF003C] cursor-pointer hover:bg-[#FF003C]/20 transition-all shrink-0"><IconX /></button>
                        )}
                    </div>
                ))}
                {formData.projectLinks.length < 5 && (
                    <button onClick={(e) => { ripple(e); addProjectLink(); }} className="flex items-center gap-1.5 py-2 bg-transparent border-none text-[#3CF91A] text-sm font-semibold cursor-pointer hover:opacity-80 transition-opacity" id="btn-add-project"><IconPlus /> Add another project</button>
                )}
            </div>

            <div className="flex flex-col gap-2">
                <Label icon={<IconUpload />} text="Resume / CV" optional />
                <div className="flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-[#3CF91A]/20 rounded-xl bg-[#3CF91A]/[0.02] cursor-pointer text-[#555] hover:border-[#3CF91A]/50 hover:bg-[#3CF91A]/[0.04] hover:shadow-[0_0_20px_rgba(60,249,26,0.05)] transition-all" id="upload-resume">
                    <IconUpload />
                    <p className="text-sm text-[#aaa] m-0">Drag & drop your file here, or <span className="text-[#3CF91A] underline">browse</span></p>
                    <p className="text-xs text-[#555] m-0">PDF, DOC up to 10MB</p>
                </div>
            </div>
        </div>
    );

    const renderVerification = () => (
        <div className="flex flex-col gap-6" key="verify">
            <div className="mb-2">
                <h2 className="text-2xl font-bold mb-1">Final <span className="text-[#3CF91A]">Verification</span></h2>
                <p className="text-sm text-[#888]">Verify your identity and activate your profile.</p>
            </div>

            <div className="flex flex-col items-center text-center gap-4 py-6">
                <div className="w-12 h-12 rounded-full bg-[#3CF91A]/10 border border-[#3CF91A]/30 flex items-center justify-center text-[#3CF91A] animate-glow-pulse"><IconMail /></div>
                <h3 className="text-lg font-bold m-0">Email <span className="text-[#3CF91A]">Verification</span></h3>
                <p className="text-sm text-[#888] m-0">We&apos;ve sent a 6-digit code to <strong className="text-[#3CF91A]">{formData.email || "your email"}</strong></p>

                <div className="flex gap-2 sm:gap-2.5 justify-center" id="verification-code">
                    {verificationCode.map((digit, i) => (
                        <input key={i} ref={(el) => { codeRefs.current[i] = el; }} type="text" inputMode="numeric" maxLength={1}
                            className="w-10 h-12 sm:w-11 sm:h-13 text-center text-xl font-bold bg-white/5 border border-[#3CF91A]/20 rounded-lg text-[#3CF91A] outline-none focus:border-[#3CF91A] focus:shadow-[0_0_10px_rgba(60,249,26,0.2)] transition-all"
                            style={mono} value={digit} onChange={(e) => handleVerificationInput(i, e.target.value)} onKeyDown={(e) => handleVerificationKeyDown(i, e)} id={`code-${i}`} />
                    ))}
                </div>
                <button onClick={ripple} className="bg-transparent border-none text-[#555] text-sm cursor-pointer" id="btn-resend-code">Didn&apos;t receive code? <span className="text-[#3CF91A] font-semibold">Resend</span></button>
            </div>

            {/* Summary */}
            <div className="glass-card rounded-xl p-5">
                <h3 className="text-xs font-bold text-[#3CF91A]/60 uppercase tracking-wider flex items-center gap-2 mb-4" style={mono}><IconTerminal /> Registration Summary</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                        { l: "Name", v: formData.fullName || "—" },
                        { l: "Username", v: `@${formData.username || "—"}` },
                        { l: "Email", v: formData.email || "—" },
                        { l: "Experience", v: EXPERIENCE_LEVELS.find((lv) => lv.value === formData.experienceLevel)?.label || "—" },
                        { l: "Skills", v: `${formData.selectedSkills.length} selected` },
                        { l: "GitHub", v: formData.githubConnected ? "Connected" : "Not connected" },
                    ].map((item) => (
                        <div key={item.l} className="flex flex-col gap-0.5">
                            <span className="text-[0.65rem] text-[#555] uppercase tracking-wider" style={mono}>{item.l}</span>
                            <span className="text-sm text-white flex items-center gap-1">
                                {item.l === "GitHub" && formData.githubConnected && <span className="w-2 h-2 rounded-full bg-[#3CF91A] shadow-[0_0_6px_rgba(60,249,26,0.8)]" />}
                                {item.v}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 cursor-pointer text-sm text-[#888] leading-relaxed" id="terms-checkbox">
                <input type="checkbox" className="hidden peer" checked={formData.agreedToTerms} onChange={(e) => updateForm("agreedToTerms", e.target.checked)} />
                <span className="w-[18px] h-[18px] border border-[#3CF91A]/30 rounded shrink-0 mt-0.5 transition-all peer-checked:bg-[#3CF91A] peer-checked:border-[#3CF91A] peer-checked:shadow-[0_0_8px_rgba(60,249,26,0.3)] relative after:content-['✓'] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:text-black after:text-[0.65rem] after:font-black after:opacity-0 peer-checked:after:opacity-100" />
                <span>I agree to the <a href="#" className="text-[#3CF91A] underline">Terms of Service</a> and <a href="#" className="text-[#3CF91A] underline">Privacy Policy</a></span>
            </label>
        </div>
    );

    const stepRenderers = [renderPersonalInfo, renderSkills, renderGithub, renderPortfolio, renderVerification];

    return (
        <div className="relative w-full min-h-screen overflow-hidden">
            <style>{`@keyframes ripple-expand { to { transform: scale(1); opacity: 0; } }`}</style>
            <ParticlesCanvas />

            {/* ─── NAVBAR ─── */}
            <nav className="fixed top-0 left-0 w-full h-20 z-50 flex items-center justify-center px-4 md:px-8 bg-[#050505]/90 backdrop-blur-xl border-b border-[#3CF91A]/10" id="signup-nav">
                <div className="w-full max-w-[1200px] flex items-center justify-between">
                    <a href="/" className="flex items-center gap-2 no-underline font-bold text-xl text-white" id="logo">
                        <span className="text-[#3CF91A] text-2xl drop-shadow-[0_0_8px_rgba(60,249,26,0.5)]">◆</span>
                        <span>SkillSpill</span>
                    </a>
                    <div className="flex items-center gap-4">
                        <a href="/login" className="text-white no-underline font-semibold text-sm border border-white/10 px-4 py-2 rounded-lg hover:border-[#3CF91A]/50 hover:text-[#3CF91A] transition-all" id="btn-signin">Sign In</a>
                        <a href="#" className="text-[#888] no-underline font-semibold text-sm hover:text-[#3CF91A] transition-colors" id="btn-help">Help</a>
                    </div>
                </div>
            </nav>

            {/* ─── MAIN ─── */}
            <main className="relative z-10 flex justify-center pt-28 pb-16 px-3 sm:px-6 min-h-screen">
                <div className="w-full max-w-[640px] flex flex-col gap-6">

                    {/* Progress Header */}
                    <div className="glass-card flex items-center justify-between p-4 sm:p-5 rounded-xl" id="progress-header">
                        <div className="flex-1 min-w-0">
                            <span className="text-[0.65rem] text-[#3CF91A]/50 uppercase tracking-[2px]" style={mono}>Registration Flow</span>
                            <h3 className="text-lg font-bold mt-1 mb-3">{STEPS[currentStep].label}</h3>
                            <div className="w-full h-[3px] bg-white/[0.08] rounded overflow-hidden">
                                <div className="h-full bg-[#3CF91A] rounded shadow-[0_0_8px_rgba(60,249,26,0.4)] transition-all duration-500" style={{ width: `${progressPercent}%` }} />
                            </div>
                        </div>
                        <span className="text-sm text-[#3CF91A] font-bold whitespace-nowrap ml-6 drop-shadow-[0_0_8px_rgba(60,249,26,0.3)]" style={mono}>{Math.round(progressPercent)}%</span>
                    </div>

                    {/* Step Indicators */}
                    <div className="flex gap-2 overflow-x-auto" id="step-indicators" style={{ scrollbarWidth: "none" }}>
                        {STEPS.map((step, i) => (
                            <button key={step.id} onClick={(e) => { if (i <= currentStep) { ripple(e); goToStep(i); } }}
                                className={`flex-1 min-w-[60px] shrink-0 py-2.5 px-2 rounded-lg text-center cursor-pointer transition-all duration-200 border ${i === currentStep ? "border-[#3CF91A] bg-[#3CF91A]/[0.08] shadow-[0_0_10px_rgba(60,249,26,0.15)]" : i < currentStep ? "border-[#3CF91A]/30 bg-[#3CF91A]/[0.04]" : "border-white/10 bg-white/[0.03] opacity-40 cursor-not-allowed"}`}
                                disabled={i > currentStep} id={`step-nav-${step.id}`}>
                                <span className={`text-[0.6rem] font-bold tracking-wider ${i === currentStep ? "text-[#3CF91A] drop-shadow-[0_0_4px_rgba(60,249,26,0.5)]" : i < currentStep ? "text-[#3CF91A]/60" : "text-[#555]"}`} style={mono}>{step.label.toUpperCase()}</span>
                            </button>
                        ))}
                    </div>

                    {/* Step Content Panel */}
                    <div className="glass-card rounded-2xl p-5 sm:p-8 overflow-hidden" id="step-panel">
                        <div className={`transition-all duration-300 ${animating ? (direction > 0 ? "-translate-x-[30px] opacity-0" : "translate-x-[30px] opacity-0") : "translate-x-0 opacity-100"}`}>
                            {stepRenderers[currentStep]()}
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex flex-col gap-3" id="step-nav-buttons">
                        {currentStep === STEPS.length - 1 ? (
                            <>
                                <button onClick={async (e) => {
                                    ripple(e); setSubmitLoading(true); setSubmitError("");
                                    try { const res = await fetch("/api/auth/signup/talent", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) }); const data = await res.json(); if (!res.ok) { setSubmitError(data.errors ? Object.values(data.errors).join(", ") : (data.error || "Signup failed")); return; } router.push("/dashboard"); } catch { setSubmitError("Network error. Please try again."); } finally { setSubmitLoading(false); }
                                }} className="flex items-center justify-center gap-2 py-3.5 px-8 bg-[#3CF91A] text-black border-none rounded-xl font-bold text-[0.95rem] cursor-pointer hover:-translate-y-0.5 shadow-neon-green hover:shadow-neon-green-strong transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none w-full" disabled={!formData.agreedToTerms || submitLoading} id="btn-submit-registration">
                                    {submitLoading ? <span className="animate-spin-custom inline-block w-5 h-5 border-2 border-current border-t-transparent rounded-full" /> : <><IconSend /> Complete Registration</>}
                                </button>
                                {submitError && <p className="text-[#FF003C] text-xs text-center" style={mono}>{submitError}</p>}
                            </>
                        ) : (
                            <button onClick={(e) => { ripple(e); nextStep(); }} className="flex items-center justify-center gap-2 py-3.5 px-8 bg-[#3CF91A] text-black border-none rounded-xl font-bold text-[0.95rem] cursor-pointer hover:-translate-y-0.5 shadow-neon-green hover:shadow-neon-green-strong transition-all w-full" id="btn-next-step">
                                Next: {STEPS[currentStep + 1]?.label.toUpperCase()} <IconArrowRight />
                            </button>
                        )}

                        {currentStep > 0 && (
                            <button onClick={(e) => { ripple(e); prevStep(); }} className="flex items-center justify-center gap-1.5 py-3 bg-transparent border border-[#3CF91A]/20 rounded-xl text-[#888] font-semibold text-sm cursor-pointer hover:border-[#3CF91A]/50 hover:text-[#3CF91A] transition-all w-full" id="btn-prev-step"><IconArrowLeft /> Back</button>
                        )}

                        {currentStep === 0 && (
                            <a href="/" className="flex items-center justify-center gap-1.5 py-3 bg-transparent border border-white/10 rounded-xl text-[#888] font-semibold text-sm hover:border-[#3CF91A]/30 hover:text-[#3CF91A] transition-all w-full no-underline" id="btn-cancel-registration">Cancel Registration</a>
                        )}
                    </div>
                </div>
            </main>

            <footer className="relative z-10 py-8 text-center" id="signup-footer">
                <p className="text-[#555] text-xs" style={mono}>© 2026 SKILLSPILL INC. PROTOCOL ACTIVE.</p>
            </footer>
        </div>
    );
}
