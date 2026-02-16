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
const IconLock = (props: any) => (<svg {...props} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>);
const IconRadarScan = (props: any) => (<svg {...props} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" opacity="0.3" /><circle cx="12" cy="12" r="6" opacity="0.5" /><circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" /><line x1="12" y1="2" x2="12" y2="6" /></svg>);
const IconBroadcast = (props: any) => (<svg {...props} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" /><path d="M16.24 7.76a6 6 0 0 1 0 8.49" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /><path d="M7.76 16.24a6 6 0 0 1 0-8.49" /><path d="M4.93 19.07a10 10 0 0 1 0-14.14" /></svg>);
const IconCode = (props: any) => (<svg {...props} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>);
const IconX = (props: any) => (<svg {...props} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>);
const IconGithub = (props: any) => (<svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>);
const IconLink = (props: any) => (<svg {...props} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>);
const IconGlobe = (props: any) => (<svg {...props} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>);
const IconUpload = (props: any) => (<svg {...props} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>);
const IconCheck = (props: any) => (<svg {...props} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>);
const IconArrowRight = (props: any) => (<svg {...props} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>);
const IconArrowLeft = (props: any) => (<svg {...props} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>);
const IconStar = (props: any) => (<svg {...props} width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>);
const IconBolt = (props: any) => (<svg {...props} width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>);

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
        for (let i = 0; i < 35; i++) particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, vx: (Math.random() - 0.5) * 0.15, vy: (Math.random() - 0.5) * 0.15, size: Math.random() * 1.2 + 0.4, opacity: Math.random() * 0.2 + 0.03 });
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p) => { p.x += p.vx; p.y += p.vy; if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0; if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0; ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fillStyle = `rgba(60, 249, 26, ${p.opacity})`; ctx.fill(); });
            for (let i = 0; i < particles.length; i++) for (let j = i + 1; j < particles.length; j++) { const dx = particles[i].x - particles[j].x; const dy = particles[i].y - particles[j].y; const dist = Math.sqrt(dx * dx + dy * dy); if (dist < 100) { ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y); ctx.strokeStyle = `rgba(60, 249, 26, ${0.02 * (1 - dist / 100)})`; ctx.lineWidth = 0.5; ctx.stroke(); } }
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

const mono = { fontFamily: "var(--font-jetbrains-mono), monospace" };

/* REUSABLE UI COMPONENTS */
const InputField = ({ label, icon: Icon, value, onChange, type = "text", placeholder, error, rightElement }: any) => (
    <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 text-[10px] font-bold text-[#3CF91A] uppercase tracking-wider" style={mono}>
            <Icon className="w-3 h-3" /> {label}
        </label>
        <div className={`relative group`}>
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full bg-[#111] border rounded-lg px-4 py-3.5 text-sm text-white focus:outline-none focus:bg-[#151515] transition-all font-mono placeholder:text-white/20 ${error ? 'border-[#FF003C]' : 'border-white/10 group-hover:border-white/20 focus:border-[#3CF91A]'}`}
                style={mono}
            />
            {rightElement && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {rightElement}
                </div>
            )}
        </div>
        {error && <span className="text-[10px] text-[#FF003C] font-mono">{error}</span>}
    </div>
);

/* ═══════════════════════ MAIN PAGE ═══════════════════════ */
export default function TalentSignup() {
    const router = useRouter();
    const ripple = useRipple();
    const [currentStep, setCurrentStep] = useState(0);
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

    // Aesthetic Colors
    const COLOR_ACCENT = "#3CF91A";

    const updateForm = (field: keyof FormData, value: FormData[keyof FormData]) => {
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
            if (!formData.fullName.trim()) e.fullName = "Required";
            if (!formData.email.trim()) e.email = "Required";
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = "Invalid";
            if (!formData.username.trim()) e.username = "Required";
            else if (formData.username.length < 3) e.username = "Min 3 chars";
            if (!formData.password) e.password = "Required";
            else if (formData.password.length < 8) e.password = "Min 8 chars";
            if (formData.password !== formData.confirmPassword) e.confirmPassword = "Mismatch";
        }
        if (currentStep === 1) {
            if (formData.selectedSkills.length === 0) e.skills = "Select at least one";
            if (!formData.experienceLevel) e.experienceLevel = "Required";
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



    /* ═══════ STEPS ═══════ */
    const renderPersonalInfo = () => (
        <div className="flex flex-col gap-6 animate-in slide-in-from-right-4 fade-in duration-300">
            <div className="mb-2">
                <h2 className="text-2xl font-bold text-white mb-1">Initialize <span className="text-[#3CF91A]">Profile</span></h2>
                <p className="text-xs text-[#666]" style={mono}>Phase 1: Sync your core identity with the network.</p>
            </div>

            <InputField label="Full Name" icon={IconUser} value={formData.fullName} onChange={(e: any) => updateForm("fullName", e.target.value)} placeholder="John 'Zero' Doe" error={errors.fullName} />
            <InputField label="Secure Email" icon={IconMail} value={formData.email} onChange={(e: any) => updateForm("email", e.target.value)} placeholder="identity@mesh.net" error={errors.email} />
            <InputField label="Hacker Alias" icon={IconAtSign} value={formData.username} onChange={(e: any) => updateForm("username", e.target.value)} placeholder="neophyte_42" error={errors.username} />

            <div className="grid grid-cols-2 gap-4">
                <InputField
                    label="Password"
                    icon={IconLock}
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e: any) => updateForm("password", e.target.value)}
                    placeholder="••••••••"
                    error={errors.password}
                    rightElement={<button onClick={() => setShowPassword(!showPassword)} type="button" className="text-[#555] hover:text-[#3CF91A]">{showPassword ? <IconBroadcast /> : <IconRadarScan />}</button>}
                />
                <InputField
                    label="Confirm"
                    icon={IconLock}
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e: any) => updateForm("confirmPassword", e.target.value)}
                    placeholder="••••••••"
                    error={errors.confirmPassword}
                    rightElement={<button onClick={() => setShowConfirmPassword(!showConfirmPassword)} type="button" className="text-[#555] hover:text-[#3CF91A]">{showConfirmPassword ? <IconBroadcast /> : <IconRadarScan />}</button>}
                />
            </div>
        </div>
    );

    const renderSkills = () => (
        <div className="flex flex-col gap-6 animate-in slide-in-from-right-4 fade-in duration-300">
            <div className="mb-2">
                <h2 className="text-2xl font-bold text-white mb-1">Skill <span className="text-[#3CF91A]">Matrix</span></h2>
                <p className="text-xs text-[#666]" style={mono}>Phase 2: Define your technical capabilities.</p>
            </div>

            <div className="flex flex-col gap-3">
                <label className="text-[10px] font-bold text-[#3CF91A] uppercase tracking-wider flex items-center gap-2" style={mono}><IconStar /> Experience Level</label>
                <div className="grid grid-cols-2 gap-2">
                    {EXPERIENCE_LEVELS.map((l) => (
                        <button key={l.value} onClick={() => updateForm("experienceLevel", l.value)}
                            className={`p-3 rounded-lg border text-left transition-all ${formData.experienceLevel === l.value ? "border-[#3CF91A] bg-[#3CF91A]/5" : "border-white/10 hover:border-white/20 bg-[#111]"}`}>
                            <div className="text-xs font-bold text-white mb-0.5" style={mono}>{l.label}</div>
                            <div className="text-[10px] text-[#666]">{l.desc}</div>
                        </button>
                    ))}
                </div>
                {errors.experienceLevel && <span className="text-[10px] text-[#FF003C]" style={mono}>{errors.experienceLevel}</span>}
            </div>

            <div className="flex flex-col gap-3">
                <label className="text-[10px] font-bold text-[#3CF91A] uppercase tracking-wider flex items-center gap-2" style={mono}><IconCode /> Stack Declaration</label>
                <div className="flex flex-wrap gap-1.5 p-3 rounded-xl border border-white/10 bg-[#111] min-h-[100px]">
                    {formData.selectedSkills.map(s => (
                        <span key={s} className="px-2 py-1 rounded bg-[#3CF91A]/10 border border-[#3CF91A]/30 text-[#3CF91A] text-[10px] font-mono flex items-center gap-1">
                            {s} <button onClick={() => toggleSkill(s)} className="hover:text-white"><IconX /></button>
                        </span>
                    ))}
                    <input
                        type="text"
                        value={formData.customSkill}
                        onChange={(e) => updateForm("customSkill", e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addCustomSkill()}
                        placeholder="Add skill..."
                        className="bg-transparent outline-none text-xs text-white font-mono placeholder:text-[#444] min-w-[80px]"
                    />
                </div>
                <div className="flex flex-wrap gap-1.5 mt-1">
                    {POPULAR_SKILLS.slice(0, 8).map(s => (
                        <button key={s} onClick={() => toggleSkill(s)} className={`px-2 py-1 rounded text-[10px] font-mono border transition-all ${formData.selectedSkills.includes(s) ? 'border-[#3CF91A] text-[#3CF91A]' : 'border-white/5 text-[#555] hover:border-white/20'}`}>
                            {s}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderGithub = () => (
        <div className="flex flex-col gap-6 animate-in slide-in-from-right-4 fade-in duration-300">
            <div className="mb-2">
                <h2 className="text-2xl font-bold text-white mb-1">Source <span className="text-[#3CF91A]">Sync</span></h2>
                <p className="text-xs text-[#666]" style={mono}>Phase 3: Verify proof of work via GitHub.</p>
            </div>

            {!formData.githubConnected ? (
                <div className="flex flex-col items-center justify-center p-8 border border-white/10 rounded-xl bg-[#111] gap-4">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/50"><IconGithub /></div>
                    <div className="text-center">
                        <h3 className="text-white font-bold mb-1">Connect Repository</h3>
                        <p className="text-xs text-[#666] max-w-[250px] mx-auto">We analyze your commits to generate your skill verification badge.</p>
                    </div>
                    <button onClick={simulateGithubConnect} className="px-6 py-2 bg-white text-black font-bold text-xs uppercase tracking-wider roundedHover hover:bg-[#3CF91A] transition-colors rounded">
                        Connect GitHub Account
                    </button>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4 p-4 border border-[#3CF91A]/30 bg-[#3CF91A]/5 rounded-xl">
                        <IconGithub />
                        <div>
                            <div className="text-[#3CF91A] font-bold text-sm">@{formData.githubUsername}</div>
                            <div className="text-xs text-[#666]">Connected successfully</div>
                        </div>
                        <div className="ml-auto text-[#3CF91A]"><IconCheck /></div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <div className="p-3 bg-[#111] border border-white/10 rounded-lg text-center">
                            <div className="text-xl font-bold text-white mb-1">{formData.githubRepos}</div>
                            <div className="text-[9px] uppercase tracking-widest text-[#555]">Repos</div>
                        </div>
                        <div className="p-3 bg-[#111] border border-white/10 rounded-lg text-center">
                            <div className="text-xl font-bold text-white mb-1">{formData.githubStars}</div>
                            <div className="text-[9px] uppercase tracking-widest text-[#555]">Stars</div>
                        </div>
                        <div className="p-3 bg-[#111] border border-white/10 rounded-lg text-center">
                            <div className="text-xl font-bold text-white mb-1">A+</div>
                            <div className="text-[9px] uppercase tracking-widest text-[#555]">Score</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    const renderPortfolio = () => (
        <div className="flex flex-col gap-6 animate-in slide-in-from-right-4 fade-in duration-300">
            <div className="mb-2">
                <h2 className="text-2xl font-bold text-white mb-1">External <span className="text-[#3CF91A]">Links</span></h2>
                <p className="text-xs text-[#666]" style={mono}>Phase 4: Showcase your digital footprint.</p>
            </div>

            <InputField label="Portfolio URL" icon={IconGlobe} value={formData.portfolioUrl} onChange={(e: any) => updateForm("portfolioUrl", e.target.value)} placeholder="https://..." />
            <InputField label="LinkedIn" icon={IconLink} value={formData.linkedinUrl} onChange={(e: any) => updateForm("linkedinUrl", e.target.value)} placeholder="https://linkedin.com/in/..." />

            <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-[10px] font-bold text-[#3CF91A] uppercase tracking-wider" style={mono}>
                    <IconUpload className="w-3 h-3" /> Resume
                </label>
                <div className="h-24 border border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center text-xs text-[#555] hover:border-[#3CF91A]/50 hover:bg-[#3CF91A]/5 transition-all cursor-pointer">
                    <span className="text-[#3CF91A] font-bold mb-1">Upload PDF</span>
                    <span>Max 10MB</span>
                </div>
            </div>
        </div>
    );

    const renderVerify = () => (
        <div className="flex flex-col gap-6 animate-in slide-in-from-right-4 fade-in duration-300">
            <div className="mb-2">
                <h2 className="text-2xl font-bold text-white mb-1">Final <span className="text-[#3CF91A]">Exec</span></h2>
                <p className="text-xs text-[#666]" style={mono}>Phase 5: Confirm and initialize.</p>
            </div>

            <div className="flex flex-col items-center justify-center py-6 gap-4">
                <p className="text-sm text-[#888]">Verification code sent to <span className="text-white">{formData.email}</span></p>
                <div className="flex gap-2">
                    {verificationCode.map((d, i) => (
                        <input key={i} ref={el => { codeRefs.current[i] = el; }}
                            maxLength={1}
                            value={d}
                            onChange={(e) => handleVerificationInput(i, e.target.value)}
                            onKeyDown={(e) => handleVerificationKeyDown(i, e)}
                            className="w-10 h-14 bg-[#111] border border-white/20 rounded text-center text-xl font-mono text-[#3CF91A] focus:border-[#3CF91A] outline-none"
                        />
                    ))}
                </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-[#111] border border-white/10 rounded-xl">
                <input type="checkbox" className="mt-1 accent-[#3CF91A]" checked={formData.agreedToTerms} onChange={e => updateForm("agreedToTerms", e.target.checked)} />
                <div className="text-xs text-[#666] leading-relaxed">
                    I agree to the <span className="text-white">Terms of Protocol</span> and <span className="text-white">Neural Data Policy</span>. I understand my code will be analyzed by the network.
                </div>
            </div>
        </div>
    );

    const stepRenderers = [renderPersonalInfo, renderSkills, renderGithub, renderPortfolio, renderVerify];

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-[#3CF91A]/30 flex flex-col items-center relative overflow-y-auto scrollbar-talent">
            <ParticlesCanvas />

            {/* Header */}
            <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-4 bg-black/50 backdrop-blur-md border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 bg-[#3CF91A] rotate-45 transform shadow-[0_0_8px_#3CF91A]"></div>
                    <span className="text-white font-bold text-lg tracking-wide">SkillSpill</span>
                </div>
                <div className="flex items-center gap-8">
                    <a href="/login" className="text-xs font-mono text-[#888] hover:text-white transition-colors tracking-widest uppercase">Sign In</a>
                    <a href="#" className="text-xs font-mono text-[#888] hover:text-white transition-colors tracking-widest uppercase">Help</a>
                </div>
            </header>

            {/* Background Gradients */}
            <div className="fixed top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#3CF91A]/[0.03] rounded-full blur-[100px] pointer-events-none" />
            <div className="fixed bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#3CF91A]/[0.02] rounded-full blur-[100px] pointer-events-none" />

            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-br from-[#3CF91A]/10 via-transparent to-transparent opacity-40 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-full h-[500px] bg-gradient-to-tl from-[#00B8FF]/10 via-transparent to-transparent opacity-30 pointer-events-none" />

            {/* Main Container */}
            <main className="relative z-10 w-full max-w-2xl px-6 py-8 flex flex-col gap-6 pt-32 pb-20">

                {/* 1. Progress Panel */}
                <div className="border border-white/10 bg-[#0A0A0A] rounded-2xl p-6 relative overflow-hidden">
                    <div className="flex justify-between items-start mb-2 relative z-10">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-[#3CF91A] tracking-[0.2em] uppercase font-bold font-mono mb-1">Registration Flow</span>
                            <h1 className="text-2xl font-bold tracking-tight text-white">{STEPS[currentStep].label}</h1>
                        </div>
                        <span className="text-3xl font-mono font-bold text-[#3CF91A] opacity-20">{Math.round(progressPercent)}%</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-1 bg-white/5 rounded-full mt-4 overflow-hidden relative z-10">
                        <div className="h-full bg-[#3CF91A] shadow-[0_0_15px_#3CF91A] transition-all duration-500 ease-out" style={{ width: `${progressPercent}%` }} />
                    </div>
                </div>

                {/* 2. Navigation Tabs */}
                <div className="grid grid-cols-5 gap-2">
                    {STEPS.map((step, i) => (
                        <button
                            key={step.id}
                            onClick={() => i <= currentStep && goToStep(i)}
                            disabled={i > currentStep}
                            className={`
                                py-3 px-2 rounded-lg border text-[9px] sm:text-[10px] uppercase tracking-widest font-mono transition-all duration-300
                                ${i === currentStep
                                    ? "border-[#3CF91A] text-[#3CF91A] bg-[#3CF91A]/10 shadow-[0_0_15px_rgba(60,249,26,0.1)]"
                                    : i < currentStep
                                        ? "border-[#3CF91A]/40 text-[#3CF91A]/60 hover:text-[#3CF91A] hover:border-[#3CF91A]"
                                        : "border-white/5 text-white/20 cursor-not-allowed bg-[#050505]"
                                }
                            `}
                        >
                            {step.label}
                        </button>
                    ))}
                </div>

                {/* 3. Main Form Panel */}
                <div className="border border-white/10 bg-[#0A0A0A]/90 backdrop-blur-xl rounded-2xl p-6 sm:p-8 min-h-[460px] relative shadow-2xl">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#3CF91A]/30 to-transparent"></div>
                    {stepRenderers[currentStep]()}
                </div>

                {/* 4. Controls */}
                <div className="flex flex-col items-center mt-8 gap-4">
                    <button
                        onClick={currentStep === STEPS.length - 1 ? async () => {
                            setSubmitLoading(true); setSubmitError("");
                            try {
                                const res = await fetch("/api/auth/signup/talent", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
                                const data = await res.json();
                                if (!res.ok) { setSubmitError(data.errors ? Object.values(data.errors).join(", ") : (data.error || "Signup failed")); return; }
                                router.push("/dashboard");
                            } catch { setSubmitError("Network connection failed."); }
                            finally { setSubmitLoading(false); }
                        } : nextStep}
                        disabled={currentStep === STEPS.length - 1 && (!formData.agreedToTerms || submitLoading)}
                        className={`
                            relative group overflow-hidden w-full sm:w-[320px] bg-[#3CF91A] text-black font-bold h-14 rounded-xl uppercase tracking-widest 
                            hover:shadow-[0_0_30px_rgba(60,249,26,0.4)] hover:scale-[1.02] transition-all duration-300
                            disabled:opacity-50 disabled:shadow-none disabled:scale-100 disabled:cursor-not-allowed
                            flex items-center justify-center gap-3 text-sm
                        `}
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            {submitLoading ? "INITIALIZING..." : (
                                currentStep === STEPS.length - 1 ? <>COMPLETE REGISTRATION <IconBolt /></> : <>NEXT: {STEPS[currentStep + 1]?.label} <IconArrowRight /></>
                            )}
                        </span>
                        {/* Shine effect */}
                        <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:left-[100%] transition-all duration-700 ease-in-out"></div>
                    </button>

                    <button
                        onClick={currentStep > 0 ? prevStep : () => router.push("/")}
                        className="text-[#666] hover:text-white text-xs uppercase tracking-widest font-mono transition-colors py-2 border-b border-transparent hover:border-white/20"
                    >
                        {currentStep > 0 ? "Go Back" : "Cancel Registration"}
                    </button>
                </div>
                {submitError && <div className="text-[#FF003C] text-xs text-center font-mono mt-4">{submitError}</div>}

            </main>
        </div>
    );
}
