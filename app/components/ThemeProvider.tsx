"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: "light",
    toggleTheme: () => { },
});

export function useTheme() {
    return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>("light");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const stored = localStorage.getItem("skillspill-theme") as Theme | null;
        if (stored === "dark" || stored === "light") {
            setTheme(stored);
            document.documentElement.classList.toggle("dark", stored === "dark");
        } else {
            // Default to light
            setTheme("light");
            document.documentElement.classList.remove("dark");
        }
    }, []);

    const toggleTheme = useCallback(() => {
        setTheme(prev => {
            const next = prev === "light" ? "dark" : "light";
            localStorage.setItem("skillspill-theme", next);
            document.documentElement.classList.toggle("dark", next === "dark");
            return next;
        });
    }, []);

    // Prevent hydration mismatch flash
    if (!mounted) {
        return <>{children}</>;
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

/* ═══════════════════════════════════════════════
   Animated Theme Toggle Switch
   ═══════════════════════════════════════════════ */
export function ThemeToggle({ size = "md" }: { size?: "sm" | "md" }) {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";

    const dims = size === "sm"
        ? { w: 44, h: 24, knob: 18, travel: 20, icon: 10 }
        : { w: 52, h: 28, knob: 22, travel: 24, icon: 12 };

    return (
        <button
            onClick={toggleTheme}
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
            className="relative rounded-full cursor-pointer border-none transition-all duration-500 ease-in-out focus:outline-none"
            style={{
                width: dims.w,
                height: dims.h,
                background: isDark
                    ? "linear-gradient(135deg, #1E293B, #0F172A)"
                    : "linear-gradient(135deg, #BFDBFE, #93C5FD)",
                boxShadow: isDark
                    ? "inset 0 1px 3px rgba(0,0,0,0.4), 0 0 12px rgba(99,102,241,0.15)"
                    : "inset 0 1px 3px rgba(0,0,0,0.1), 0 0 12px rgba(250,204,21,0.2)",
            }}
        >
            {/* Stars (dark mode) */}
            <span
                className="absolute transition-all duration-500"
                style={{
                    top: 5, left: isDark ? dims.w - 18 : dims.w - 14,
                    opacity: isDark ? 1 : 0,
                    transform: isDark ? "scale(1)" : "scale(0.5)",
                }}
            >
                <svg width="6" height="6" viewBox="0 0 10 10" fill="#FDE68A">
                    <circle cx="2" cy="3" r="1" /><circle cx="7" cy="2" r="0.7" /><circle cx="5" cy="6" r="0.8" />
                </svg>
            </span>

            {/* Knob / Sun-Moon */}
            <span
                className="absolute top-1/2 rounded-full transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                style={{
                    width: dims.knob,
                    height: dims.knob,
                    transform: `translateY(-50%) translateX(${isDark ? dims.travel : 2}px)`,
                    background: isDark
                        ? "#E2E8F0"
                        : "linear-gradient(135deg, #FDE68A, #FBBF24)",
                    boxShadow: isDark
                        ? "inset -3px -1px 0 #94A3B8, 0 2px 8px rgba(0,0,0,0.3)"
                        : "0 2px 8px rgba(250,204,21,0.4), 0 0 20px rgba(250,204,21,0.15)",
                }}
            >
                {/* Sun rays (light mode) */}
                <span
                    className="absolute inset-0 flex items-center justify-center transition-all duration-500"
                    style={{ opacity: isDark ? 0 : 1, transform: isDark ? "rotate(-90deg) scale(0.5)" : "rotate(0deg) scale(1)" }}
                >
                    <svg width={dims.icon} height={dims.icon} viewBox="0 0 24 24" fill="none" stroke="#B45309" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="4" />
                        <line x1="12" y1="2" x2="12" y2="5" /><line x1="12" y1="19" x2="12" y2="22" />
                        <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" /><line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
                        <line x1="2" y1="12" x2="5" y2="12" /><line x1="19" y1="12" x2="22" y2="12" />
                        <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" /><line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
                    </svg>
                </span>
            </span>
        </button>
    );
}
