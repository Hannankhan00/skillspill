"use client";

/* ═══════════════════════════════════════════════
   S K I L L S P I L L  —  L O G O
   Theme-aware text logo: "Skill" adapts to theme,
   "Spill" stays accent green.
   ═══════════════════════════════════════════════ */

interface LogoProps {
    height?: number;          // controls font-size scaling
    className?: string;
    accentColor?: string;     // defaults to #3CF91A
}

export default function Logo({ height = 36, className = "", accentColor = "#3CF91A" }: LogoProps) {
    // Scale font size relative to the height (h-9 = 36px → ~20px font)
    const fontSize = Math.round(height * 0.56);

    return (
        <span
            className={`inline-flex items-center select-none ${className}`}
            style={{
                fontFamily: "var(--font-space-grotesk), sans-serif",
                fontSize,
                fontWeight: 800,
                letterSpacing: "-0.02em",
                lineHeight: 1,
                height,
            }}
        >
            <span style={{ color: "var(--theme-text-primary)" }}>Skill</span>
            <span style={{ color: accentColor }}>Spill</span>
        </span>
    );
}
