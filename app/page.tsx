"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/* ───────────── Ripple Hook ───────────── */
function useRipple() {
  const onRipple = useCallback((e: React.MouseEvent<HTMLElement>) => {
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
  return onRipple;
}

/* ───────────── Icons ───────────── */
const IconCode = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
);
const IconBriefcase = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x={2} y={7} width={20} height={14} rx={2} ry={2} /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
);
const IconSearch = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
);
const IconSparkle = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z" /></svg>
);
const IconGithub = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>
);
const IconShare = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>
);
const IconSettings = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
);
const IconTerminal = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" /></svg>
);
const IconArrowRight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
);
const IconChevronDown = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
);
const IconMenu = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
);
const IconX = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
);

/* ───────────── Particles ───────────── */
interface Particle { x: number; y: number; vx: number; vy: number; size: number; opacity: number; }

function ParticlesCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animationId: number;
    const particles: Particle[] = [];
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize(); window.addEventListener("resize", resize);
    for (let i = 0; i < 60; i++) particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3, size: Math.random() * 2 + 0.5, opacity: Math.random() * 0.5 + 0.1 });
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => { p.x += p.vx; p.y += p.vy; if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0; if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0; ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fillStyle = `rgba(60, 249, 26, ${p.opacity})`; ctx.fill(); });
      for (let i = 0; i < particles.length; i++) for (let j = i + 1; j < particles.length; j++) { const dx = particles[i].x - particles[j].x; const dy = particles[i].y - particles[j].y; const dist = Math.sqrt(dx * dx + dy * dy); if (dist < 150) { ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y); ctx.strokeStyle = `rgba(60, 249, 26, ${0.04 * (1 - dist / 150)})`; ctx.lineWidth = 0.5; ctx.stroke(); } }
      animationId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animationId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-0" />;
}

/* ───────────── Typing Effect ───────────── */
function useTypingEffect(text: string, speed = 60, delay = 500) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setStarted(true), delay); return () => clearTimeout(t); }, [delay]);
  useEffect(() => { if (!started) return; if (displayed.length < text.length) { const t = setTimeout(() => setDisplayed(text.slice(0, displayed.length + 1)), speed); return () => clearTimeout(t); } }, [displayed, started, text, speed]);
  return displayed;
}

/* ───────────── Skill Tag ───────────── */
function SkillTag({ label, delay }: { label: string; delay: number }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), delay); return () => clearTimeout(t); }, [delay]);
  return (
    <span className={`border border-[#3CF91A]/30 bg-[#3CF91A]/5 px-3 py-1.5 rounded text-sm text-[#3CF91A]/80 transition-all duration-500 hover:border-[#3CF91A] hover:text-[#3CF91A] hover:shadow-[0_0_10px_rgba(60,249,26,0.2)] cursor-default ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`} style={{ fontFamily: "var(--font-jetbrains-mono), monospace", transitionDelay: `${delay}ms` }}>
      {label}
    </span>
  );
}

/* ───────────── Animated Stat ───────────── */
function AnimatedStat({ target, label, suffix = "" }: { target: number; label: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const counted = useRef(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !counted.current) {
        counted.current = true;
        const dur = 2000; const start = performance.now();
        const animate = (now: number) => { const p = Math.min((now - start) / dur, 1); setCount(Math.floor((1 - Math.pow(2, -10 * p)) * target)); if (p < 1) requestAnimationFrame(animate); };
        requestAnimationFrame(animate);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);
  return (
    <div ref={ref} className="text-center">
      <span className="block text-4xl sm:text-5xl font-extrabold text-[#3CF91A] mb-2 tabular-nums drop-shadow-[0_0_15px_rgba(60,249,26,0.4)]" style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>
        {count.toLocaleString()}{suffix}
      </span>
      <span className="text-[#888] uppercase tracking-[3px] text-xs">{label}</span>
    </div>
  );
}

/* ═══════════════════════ MAIN PAGE ═══════════════════════ */
export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchPlaceholder = useTypingEffect("e.g. React developer with Rust experience...", 40, 1800);
  const ripple = useRipple();

  useEffect(() => { const fn = () => setScrolled(window.scrollY > 30); window.addEventListener("scroll", fn); return () => window.removeEventListener("scroll", fn); }, []);

  const skills = ["Python", "Rust", "React", "TypeScript", "Solidity", "Go", "Next.js"];

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Ripple keyframe injected once */}
      <style>{`@keyframes ripple-expand { to { transform: scale(1); opacity: 0; } }`}</style>
      <ParticlesCanvas />

      {/* ───── NAVBAR ───── */}
      <nav className={`fixed top-0 left-0 w-full h-20 z-50 flex items-center justify-center px-4 md:px-8 transition-all duration-300 ${scrolled ? "bg-[#050505]/90 backdrop-blur-xl border-b border-[#3CF91A]/10" : ""}`} id="main-nav">
        <div className="w-full max-w-[1200px] flex items-center justify-between">
          <a href="/" className="flex items-center no-underline" id="logo">
            <img src="/assets/logo 2.png" alt="SkillSpill" className="h-12" />
          </a>

          <div className="hidden md:flex gap-8">
            {["Find Talent", "Post Job", "How it works"].map((t) => (
              <a key={t} href={`#${t.toLowerCase().replace(/ /g, "-")}`} className="text-[#888] no-underline text-sm font-semibold uppercase tracking-wide hover:text-[#3CF91A] transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-[#3CF91A] after:transition-all hover:after:w-full">{t}</a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <a href="/login" className="text-white no-underline font-semibold text-sm border border-white/10 px-4 py-2 rounded-lg hover:border-[#3CF91A]/50 hover:text-[#3CF91A] transition-all">Log In</a>
            <button onClick={ripple} className="bg-[#3CF91A] text-black px-5 py-2.5 rounded-lg no-underline font-bold text-sm hover:-translate-y-0.5 shadow-neon-green hover:shadow-neon-green-strong transition-all border-none cursor-pointer">
              <a href="#path" className="no-underline text-black">Sign Up</a>
            </button>
          </div>

          <button className="md:hidden bg-transparent border border-[#3CF91A]/30 rounded-lg p-1.5 text-[#3CF91A] cursor-pointer z-[60]" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle menu">
            {isMobileMenuOpen ? <IconX /> : <IconMenu />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu-overlay fixed inset-0 bg-[#050505]/95 backdrop-blur-2xl z-[55] flex flex-col justify-center items-center ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
          <div className="flex flex-col items-center gap-8">
            {["Find Talent", "Post Job", "How it works"].map((t) => (
              <a key={t} href={`#${t.toLowerCase().replace(/ /g, "-")}`} className="text-2xl font-bold text-[#888] no-underline hover:text-[#3CF91A] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>{t}</a>
            ))}
            <div className="w-12 h-px bg-[#3CF91A]/20 my-4" />
            <a href="/login" className="text-2xl font-bold text-[#888] no-underline hover:text-[#3CF91A] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>Log In</a>
            <button onClick={(e) => { ripple(e); setIsMobileMenuOpen(false); }} className="bg-[#3CF91A] text-black px-8 py-3 rounded-lg font-bold text-lg border-none cursor-pointer shadow-neon-green mt-4">
              <a href="#path" className="text-black no-underline">Sign Up</a>
            </button>
          </div>
        </div>
      </nav>

      {/* ───── HERO ───── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center pt-20 px-4 z-10 box-border" id="hero">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(60,249,26,0.12)_0%,transparent_70%)] pointer-events-none -z-10" />
        <div className="absolute top-[20%] right-[20%] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(168,85,247,0.08)_0%,transparent_70%)] pointer-events-none -z-10" />

        <div className="w-full max-w-[800px] flex flex-col items-center box-border">
          {/* Small badge */}



          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4rem] font-bold leading-tight mb-6 tracking-tight" id="hero-title">
            Don&apos;t Show Your Degree.
            <br />
            <span className="text-gradient-hero animate-shine">Spill Your Skills.</span>
          </h1>

          <p className="text-lg md:text-xl text-[#999] max-w-[800px] mb-8 leading-relaxed" id="hero-subtitle">
            The first talent marketplace powered 100% by <span className="text-white/80">GitHub code analysis</span>.
            <br />
            We verify actual <span className="text-white/80">coding capability</span>, not resume keywords.
          </p>

          {/* Search Bar */}
          <div className="flex justify-center w-full mb-8" id="hero-search">
            <div className="input-terminal flex items-center rounded-xl p-2 w-full max-w-[500px] sm:flex-row flex-col gap-2 sm:gap-0">
              <span className="ml-3 text-[#3CF91A]/50 hidden sm:block"><IconSearch /></span>
              <input
                type="text"
                className="flex-1 min-w-0 bg-transparent border-none text-white px-3 py-1 text-sm outline-none placeholder:text-[#555] w-full sm:w-auto"
                style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}
                placeholder={searchPlaceholder + "│"}
                id="search-input"
                suppressHydrationWarning
                onChange={(e) => console.log(e.target.value)}
              />
              <button onClick={(e) => { ripple(e); alert("Search functionality coming soon!"); }} className="bg-[#3CF91A] text-black border-none px-4 py-2.5 rounded-lg font-bold flex items-center gap-1.5 cursor-pointer hover:shadow-neon-green-strong transition-all whitespace-nowrap shrink-0 text-sm w-full sm:w-auto justify-center" id="btn-scan">
                <IconSparkle /> Scan with AI
              </button>
            </div>
          </div>

          {/* Skill Tags */}
          <div className="flex gap-2 flex-wrap justify-center max-w-[700px]" id="skill-tags">
            {skills.map((s, i) => <SkillTag key={s} label={s} delay={2200 + i * 120} />)}
          </div>
        </div>

        <div className="absolute bottom-8 flex flex-col items-center gap-2 text-[#3CF91A]/40 text-xs uppercase tracking-widest animate-bounce-soft">
          <span>Explore</span><IconChevronDown />
        </div>
      </section>

      {/* ───── CHOOSE YOUR PATH ───── */}
      <section className="relative py-20 md:py-32 px-6 text-center z-10" id="path">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your <span className="text-white/80">Path</span></h2>
        <p className="text-[#888] mb-12 md:mb-16">The future of career evolution starts with a single decision.</p>

        <div className="flex justify-center gap-6 flex-wrap" id="path-cards">
          {/* Talent Card */}
          <div className="glass-card rounded-2xl p-8 md:p-12 w-full max-w-[400px] text-center flex flex-col items-center transition-all duration-300 hover:-translate-y-2.5 hover:border-[#3CF91A]/50 hover:shadow-neon-green group" id="card-talent">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 bg-[#3CF91A]/10 text-[#3CF91A] border border-[#3CF91A]/20 group-hover:shadow-[0_0_20px_rgba(60,249,26,0.3)] transition-all">
              <IconCode />
            </div>
            <h3 className="text-xl font-bold mb-3 text-[#3CF91A]">Talent</h3>
            <p className="text-[#999] mb-6 leading-relaxed flex-grow">Master your craft, build your legacy, and connect with visionary projects.</p>
            <a href="/signup/talent" onClick={(e) => ripple(e as unknown as React.MouseEvent<HTMLElement>)} className="bg-[#3CF91A] text-black px-6 py-3 rounded-lg font-bold flex items-center gap-2 cursor-pointer hover:shadow-neon-green-strong transition-all no-underline">
              I&apos;m Talent <IconArrowRight />
            </a>
          </div>

          {/* Recruiter Card */}
          <div className="glass-card-purple rounded-2xl p-8 md:p-12 w-full max-w-[400px] text-center flex flex-col items-center transition-all duration-300 hover:-translate-y-2.5 hover:border-[#A855F7]/50 hover:shadow-neon-purple group" id="card-recruiter">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 bg-[#A855F7]/10 text-[#A855F7] border border-[#A855F7]/20 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all">
              <IconBriefcase />
            </div>
            <h3 className="text-xl font-bold mb-3 text-[#A855F7]">Recruiter</h3>
            <p className="text-[#999] mb-6 leading-relaxed flex-grow">Find the architects of tomorrow. Streamline your hiring with AI intelligence.</p>
            <a href="/signup/recruiter" onClick={(e) => ripple(e as unknown as React.MouseEvent<HTMLElement>)} className="bg-[#A855F7] text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 cursor-pointer hover:shadow-neon-purple transition-all no-underline hover:bg-[#9333ea]">
              I&apos;m Hiring <IconArrowRight />
            </a>
          </div>
        </div>
      </section>

      {/* ───── HOW IT WORKS ───── */}
      <section className="py-20 md:py-32 px-6 max-w-[1200px] mx-auto" id="how-it-works">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">How It <span className="text-white/80">Works</span></h2>
          <p className="text-[#888] max-w-2xl mx-auto text-lg leading-relaxed">Three steps to the future of hiring. No resumes, just code.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-[2]">
          {[
            { num: "01", icon: <IconGithub />, title: "Connect GitHub", desc: "Link your GitHub profile and let our AI analyze your actual codebase, contributions, and coding patterns." },
            { num: "02", icon: <IconSparkle />, title: "AI Skill Matrix", desc: "We generate a verified skill matrix from real code — no self-assessed ratings, no keyword stuffing." },
            { num: "03", icon: <IconTerminal />, title: "Get Matched", desc: "Recruiters find talent by actual capability. Developers get matched to roles that fit their real skills." },
          ].map((step) => (
            <div key={step.num} className="bg-white/5 border border-white/10 p-8 rounded-2xl relative overflow-hidden group hover:border-[#3CF91A]/50 hover:bg-white/[0.07] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(60,249,26,0.1)]">
              {/* Background Accent */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#3CF91A]/5 rounded-bl-[80px] -mr-4 -mt-4 transition-all group-hover:bg-[#3CF91A]/10 pointer-events-none" />

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 rounded-xl bg-black/40 border border-[#3CF91A]/20 flex items-center justify-center text-[#3CF91A] group-hover:scale-110 group-hover:border-[#3CF91A] transition-all duration-300 shadow-[0_0_15px_rgba(60,249,26,0.1)]">
                    {step.icon}
                  </div>
                  <span className="text-4xl font-bold text-white/5 font-mono group-hover:text-[#3CF91A]/20 transition-colors cursor-default" style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>{step.num}</span>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#3CF91A] transition-colors">{step.title}</h3>
                <p className="text-[#999] text-sm leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ───── STATS ───── */}
      <section className="py-16 md:py-24 px-6 border-t border-b border-[#3CF91A]/10 bg-[#3CF91A]/[0.02]" id="stats">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-[1200px] mx-auto text-center">
          <AnimatedStat target={12400} label="Verified Devs" suffix="+" />
          <AnimatedStat target={3200} label="Companies" suffix="+" />
          <AnimatedStat target={98} label="Accuracy" suffix="%" />
          <AnimatedStat target={50} label="Skills Tracked" suffix="+" />
        </div>
      </section>

      {/* ───── FOOTER ───── */}
      <footer className="py-12 md:py-16 px-6 text-center" id="footer">
        <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-8 mb-8">
          {["PRIVACY POLICY", "TERMS OF SERVICE", "SYSTEM STATUS"].map((t) => (
            <a key={t} href="#" className="text-[#555] no-underline text-xs hover:text-[#3CF91A] transition-colors">{t}</a>
          ))}
        </div>
        <div className="flex justify-center gap-3 mb-8">
          {[<IconShare key="s" />, <IconSettings key="st" />, <IconTerminal key="t" />].map((icon, i) => (
            <button key={i} onClick={ripple} className="bg-white/5 border border-white/10 w-10 h-10 rounded-full text-[#888] flex items-center justify-center cursor-pointer hover:bg-[#3CF91A] hover:text-black hover:border-[#3CF91A] hover:shadow-neon-green transition-all">{icon}</button>
          ))}
        </div>
        <div className="flex justify-center mb-4"><img src="/assets/logo 2.png" alt="SkillSpill" className="h-8 opacity-40" /></div>
        <p className="text-[#555] text-xs" style={{ fontFamily: "var(--font-jetbrains-mono), monospace" }}>© 2026 SKILLSPILL INC.</p>
      </footer>
    </div>
  );
}
