"use client";

import { useState, useEffect, useRef } from "react";

/* ───────────────────── Inline SVG Icons ───────────────────── */
const IconCode = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

const IconBriefcase = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x={2} y={7} width={20} height={14} rx={2} ry={2} />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const IconSearch = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const IconSparkle = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z" />
  </svg>
);

const IconGithub = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const IconShare = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

const IconSettings = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const IconTerminal = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" />
  </svg>
);

const IconArrowRight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

const IconChevronDown = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

/* ───────────────────── Animated Particles Background ───────────────────── */
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

function ParticlesCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const particles: Particle[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Create particles
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(60, 249, 26, ${p.opacity})`;
        ctx.fill();
      });

      // Draw faint connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(60, 249, 26, ${0.04 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animationId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}

/* ───────────────────── Typing Effect Hook ───────────────────── */
function useTypingEffect(text: string, speed = 60, delay = 500) {
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    if (displayed.length < text.length) {
      const timer = setTimeout(() => {
        setDisplayed(text.slice(0, displayed.length + 1));
      }, speed);
      return () => clearTimeout(timer);
    }
  }, [displayed, started, text, speed]);

  return displayed;
}

/* ───────────────────── Skill Tag Component ───────────────────── */
interface SkillTagProps {
  label: string;
  delay: number;
}

function SkillTag({ label, delay }: SkillTagProps) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <span
      className={`skill-tag ${visible ? "skill-tag-visible" : ""}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {label}
    </span>
  );
}

/* ───────────────────── Stat Counter ───────────────────── */
interface AnimatedStatProps {
  target: number;
  label: string;
  suffix?: string;
}

function AnimatedStat({ target, label, suffix = "" }: AnimatedStatProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const counted = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true;
          // let start = 0; // Unused
          const duration = 2000;
          const startTime = performance.now();
          const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // easeOutExpo
            const eased = 1 - Math.pow(2, -10 * progress);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="stat-item">
      <span className="stat-number">
        {count.toLocaleString()}
        {suffix}
      </span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

/* ───────────────────── Ripple Effect Hook ───────────────────── */
function useRipple() {
  useEffect(() => {
    const selectors = '.btn-primary, .btn-secondary, .btn-signup, .search-btn, .footer-icon-btn';

    function handleClick(e: MouseEvent) {
      const btn = e.currentTarget as HTMLElement;
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const size = Math.max(rect.width, rect.height) * 2.5;

      const ripple = document.createElement('span');
      ripple.className = 'ripple-effect';
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${x - size / 2}px`;
      ripple.style.top = `${y - size / 2}px`;

      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    }

    const buttons = document.querySelectorAll(selectors);
    buttons.forEach(btn => {
      // safe casting since we know these are elements
      (btn as HTMLElement).style.position = 'relative';
      (btn as HTMLElement).style.overflow = 'hidden';
      btn.addEventListener('click', handleClick as EventListener);
    });

    return () => {
      buttons.forEach(btn => btn.removeEventListener('click', handleClick as EventListener));
    };
  }, []);
}

/* ═══════════════════════ MAIN PAGE ═══════════════════════ */
export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const searchPlaceholder = useTypingEffect(
    "e.g. React developer with Rust experience...",
    40,
    1800
  );

  useRipple();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const skills = ["Python", "Rust", "React", "TypeScript", "Solidity", "Go", "Next.js"];

  return (
    <div className="landing-root">
      <ParticlesCanvas />

      {/* ───── NAVBAR ───── */}
      <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`} id="main-nav">
        <div className="navbar-inner">
          <a href="/" className="nav-logo" id="logo">
            <span className="logo-icon">◆</span>
            <span className="logo-text">SkillSpill</span>
          </a>

          <div className="nav-links">
            <a href="#how-it-works" className="nav-link" id="nav-how">Find Talent</a>
            <a href="#path" className="nav-link" id="nav-post">Post Job</a>
            <a href="#stats" className="nav-link" id="nav-works">How it works</a>
          </div>

          <div className="nav-auth">
            <a href="/login" className="btn-login" id="btn-login">Log In</a>
            <a href="#path" className="btn-signup" id="btn-signup">Sign Up</a>
          </div>
        </div>
      </nav>

      {/* ───── HERO SECTION ───── */}
      <section className="hero-section" id="hero">
        {/* Radial glow behind hero */}
        <div className="hero-glow" />
        <div className="hero-glow-secondary" />

        <div className="hero-content">
          <h1 className="hero-title" id="hero-title">
            Don&apos;t Show Your Degree.
            <br />
            <span className="hero-title-accent">Spill Your Skills.</span>
          </h1>

          <p className="hero-subtitle" id="hero-subtitle">
            The first talent marketplace powered 100% by GitHub code analysis.
            <br />
            We verify actual coding capability, not resume keywords.
          </p>

          {/* Search Bar */}
          <div className="search-container" id="hero-search">
            <div className="search-bar">
              <IconSearch />
              <input
                type="text"
                className="search-input"
                placeholder={searchPlaceholder + "│"}
                readOnly
                id="search-input"
                suppressHydrationWarning
              />
              <button className="search-btn" id="btn-scan">
                <IconSparkle />
                Scan with AI
              </button>
            </div>
          </div>

          {/* Skill Tags */}
          <div className="skill-tags-row" id="skill-tags">
            {skills.map((s, i) => (
              <SkillTag key={s} label={s} delay={2200 + i * 120} />
            ))}
          </div>
        </div>

        {/* scroll indicator */}
        <div className="scroll-indicator" id="scroll-indicator">
          <span>Explore</span>
          <IconChevronDown />
        </div>
      </section>

      {/* ───── CHOOSE YOUR PATH ───── */}
      <section className="path-section" id="path">
        <div className="path-glow" />
        <h2 className="section-title" id="path-title">Choose Your Path</h2>
        <p className="section-subtitle" id="path-subtitle">
          The future of career evolution starts with a single decision.
        </p>

        <div className="path-cards" id="path-cards">
          {/* Talent Card */}
          <div className="path-card talent-card" id="card-talent">
            <div className="card-icon-wrapper talent-icon-bg">
              <IconCode />
            </div>
            <h3 className="card-title">Talent</h3>
            <p className="card-desc">
              Master your craft, build your
              legacy, and connect with
              visionary projects.
            </p>
            <a href="/signup/talent" className="btn-primary" id="btn-talent" style={{ textDecoration: 'none' }}>
              I&apos;m Talent
              <IconArrowRight />
            </a>
          </div>

          {/* Recruiter Card */}
          <div className="path-card recruiter-card" id="card-recruiter">
            <div className="card-icon-wrapper recruiter-icon-bg">
              <IconBriefcase />
            </div>
            <h3 className="card-title">Recruiter</h3>
            <p className="card-desc">
              Find the architects of tomorrow. Streamline your
              hiring with AI intelligence.
            </p>
            <a href="/signup/recruiter" className="btn-secondary" id="btn-recruiter" style={{ textDecoration: 'none' }}>
              I&apos;m Hiring
              <IconArrowRight />
            </a>
          </div>
        </div>
      </section>

      {/* ───── HOW IT WORKS ───── */}
      <section className="how-section" id="how-it-works">
        <h2 className="section-title">How It Works</h2>
        <p className="section-subtitle">Three steps to the future of hiring.</p>

        <div className="steps-grid" id="steps-grid">
          <div className="step-card" id="step-1">
            <div className="step-number">01</div>
            <div className="step-icon-wrap"><IconGithub /></div>
            <h3 className="step-title">Connect GitHub</h3>
            <p className="step-desc">
              Link your GitHub profile and let our AI analyze your actual codebase, contributions, and coding patterns.
            </p>
          </div>

          <div className="step-connector" />

          <div className="step-card" id="step-2">
            <div className="step-number">02</div>
            <div className="step-icon-wrap"><IconSparkle /></div>
            <h3 className="step-title">AI Skill Matrix</h3>
            <p className="step-desc">
              We generate a verified skill matrix from real code — no self-assessed ratings, no keyword stuffing.
            </p>
          </div>

          <div className="step-connector" />

          <div className="step-card" id="step-3">
            <div className="step-number">03</div>
            <div className="step-icon-wrap"><IconTerminal /></div>
            <h3 className="step-title">Get Matched</h3>
            <p className="step-desc">
              Recruiters find talent by actual capability. Developers get matched to roles that fit their real skills.
            </p>
          </div>
        </div>
      </section>

      {/* ───── STATS ───── */}
      <section className="stats-section" id="stats">
        <div className="stats-grid">
          <AnimatedStat target={12400} label="Developers Verified" suffix="+" />
          <AnimatedStat target={3200} label="Companies Hiring" suffix="+" />
          <AnimatedStat target={98} label="Match Accuracy" suffix="%" />
          <AnimatedStat target={50} label="Tech Skills Tracked" suffix="+" />
        </div>
      </section>

      {/* ───── FOOTER ───── */}
      <footer className="footer" id="footer">
        <div className="footer-links">
          <a href="#" className="footer-link">PRIVACY POLICY</a>
          <a href="#" className="footer-link">TERMS OF SERVICE</a>
          <a href="#" className="footer-link">SYSTEM STATUS</a>
        </div>

        <div className="footer-icons">
          <button className="footer-icon-btn" aria-label="Share"><IconShare /></button>
          <button className="footer-icon-btn" aria-label="Settings"><IconSettings /></button>
          <button className="footer-icon-btn" aria-label="Terminal"><IconTerminal /></button>
        </div>

        <p className="footer-copy" id="footer-copy">
          © 2026 SKILLSPILL INC. PROTOCOL ACTIVE.
        </p>
      </footer>
    </div>
  );
}
