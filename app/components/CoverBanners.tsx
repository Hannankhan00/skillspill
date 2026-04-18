import React from 'react';

// Centralised definition of animated cover banners
// Slots 1-2: Purple & Green theme colours. Slot 3: Binary code. Rest: animations.
export const coverPresets = [
    { id: "1", name: "Purple Nebula", type: "css", className: "bg-linear-to-r from-violet-600 via-purple-600 to-indigo-600 animate-[gradient_8s_ease_infinite] bg-[length:200%_200%]" },
    { id: "2", name: "Green Pulse", type: "css", className: "bg-linear-to-r from-[#3CF91A] via-teal-500 to-[#3CF91A] animate-[gradient_5s_linear_infinite] bg-[length:200%_auto]" },
    { id: "3", name: "Binary Matrix", type: "css", className: "bg-[#050B14] relative overflow-hidden", isMatrix: true },
    { id: "4", name: "Neon Particles", type: "css", className: "bg-[#110e1a] relative overflow-hidden", isParticles: true },
    { id: "5", name: "Starfield", type: "css", className: "bg-[#060312] relative overflow-hidden", isStars: true },
    { id: "6", name: "Toxic Glow", type: "css", className: "bg-black relative overflow-hidden", isGlow: true },
    { id: "7", name: "Circuit Grid", type: "css", className: "bg-[#020b08] relative overflow-hidden", isCircuit: true },
    { id: "8", name: "Digital Rain", type: "css", className: "bg-[#000] relative overflow-hidden", isDigitalRain: true }
];

export function CoverBanner({ coverId, children }: { coverId?: string, children?: React.ReactNode }) {
    const preset = coverPresets.find(p => p.id === coverId || p.className === coverId) || coverPresets[0];

    return (
        <div className={`absolute inset-0 w-full h-full ${preset.className}`}>

            {/* ── Binary Matrix ── */}
            {preset.isMatrix && (
                <div className="absolute inset-0 opacity-40 pointer-events-none flex gap-6 px-4 font-mono text-[10px] sm:text-xs text-[#3CF91A] overflow-hidden leading-tight">
                    {[15, 20, 12, 18, 14].map((len, col) => (
                        <div key={col} className="flex flex-col gap-1.5" style={{ animation: `scrollCol ${len}s linear infinite`, animationDelay: `${col * -3}s` }}>
                            {Array.from({ length: 30 }).map((_, i) => (
                                <span key={i}>{((col * 31 + i * 7) % 256).toString(2).padStart(8, '0')}</span>
                            ))}
                        </div>
                    ))}
                </div>
            )}

            {/* ── Neon Particles ── */}
            {preset.isParticles && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[
                        { x: 10, y: 20, s: 5, c: '#3CF91A', d: 6 },
                        { x: 80, y: 60, s: 4, c: '#a855f7', d: 8 },
                        { x: 30, y: 70, s: 3, c: '#3CF91A', d: 10 },
                        { x: 60, y: 15, s: 6, c: '#a855f7', d: 7 },
                        { x: 50, y: 40, s: 4, c: '#3CF91A', d: 12 },
                        { x: 90, y: 80, s: 3, c: '#a855f7', d: 9 },
                        { x: 15, y: 50, s: 5, c: '#3CF91A', d: 11 },
                        { x: 70, y: 30, s: 4, c: '#a855f7', d: 6 },
                        { x: 40, y: 85, s: 3, c: '#3CF91A', d: 14 },
                        { x: 55, y: 55, s: 5, c: '#a855f7', d: 8 },
                        { x: 25, y: 35, s: 4, c: '#3CF91A', d: 10 },
                        { x: 75, y: 75, s: 6, c: '#a855f7', d: 7 },
                    ].map((p, i) => (
                        <div key={i} className="absolute rounded-full" style={{
                            width: p.s + 'px', height: p.s + 'px',
                            backgroundColor: p.c,
                            top: p.y + '%', left: p.x + '%',
                            boxShadow: `0 0 12px ${p.c}`,
                            animation: `float ${p.d}s ease-in-out infinite alternate`,
                            animationDelay: `-${i * 0.8}s`,
                        }} />
                    ))}
                </div>
            )}

            {/* ── Starfield ── */}
            {preset.isStars && (
                <>
                    <div className="absolute inset-0 pointer-events-none opacity-60" style={{ backgroundImage: 'radial-gradient(circle, #a855f7 1.5px, transparent 1px)', backgroundSize: '32px 32px', animation: 'starsMove 40s linear infinite' }} />
                    <div className="absolute inset-0 pointer-events-none opacity-30" style={{ backgroundImage: 'radial-gradient(circle, #3CF91A 1px, transparent 1px)', backgroundSize: '48px 48px', animation: 'starsMove 60s linear infinite reverse' }} />
                </>
            )}

            {/* ── Toxic Glow ── */}
            {preset.isGlow && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute w-72 h-72 bg-[#3CF91A] rounded-full blur-[100px] opacity-50" style={{ top: '-25%', left: '-10%', animation: 'pulseSlow 6s ease-in-out infinite' }} />
                    <div className="absolute w-64 h-64 bg-purple-700 rounded-full blur-[90px] opacity-50" style={{ bottom: '-25%', right: '5%', animation: 'pulseSlow 6s ease-in-out 2s infinite' }} />
                    <div className="absolute w-40 h-40 bg-teal-500 rounded-full blur-[80px] opacity-40" style={{ top: '20%', left: '40%', animation: 'pulseSlow 6s ease-in-out 1s infinite' }} />
                </div>
            )}

            {/* ── Circuit Grid ── */}
            {preset.isCircuit && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'linear-gradient(#3CF91A 1px, transparent 1px), linear-gradient(90deg, #3CF91A 1px, transparent 1px)',
                        backgroundSize: '30px 30px',
                        animation: 'gridPulse 4s ease-in-out infinite alternate',
                    }} />
                    <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-black" />
                </div>
            )}

            {/* ── Digital Rain ── */}
            {preset.isDigitalRain && (
                <div className="absolute inset-0 flex items-start overflow-hidden pointer-events-none font-mono text-[9px] sm:text-[11px] text-purple-500 font-bold tracking-widest leading-none">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center opacity-40" style={{
                            animation: `fall ${2 + (i % 5)}s linear ${(i * 0.3) % 2}s infinite`,
                        }}>
                            {Array.from({ length: 15 }).map((_, j) => (
                                <span key={j} className={j === 14 ? 'text-[#3CF91A]' : ''}>
                                    {String.fromCharCode(0x30A0 + ((i * 17 + j * 13) % 96))}
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
            )}



            {children}

            <style>{`
                @keyframes gradient {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                @keyframes scrollCol {
                    0% { transform: translateY(-40%); }
                    100% { transform: translateY(10%); }
                }
                @keyframes float {
                    0% { transform: translate(0, 0); }
                    100% { transform: translate(20px, -20px); }
                }
                @keyframes starsMove {
                    from { background-position: 0 0; }
                    to { background-position: -500px 500px; }
                }
                @keyframes pulseSlow {
                    0%, 100% { transform: scale(1); opacity: 0.4; }
                    50% { transform: scale(1.15); opacity: 0.7; }
                }
                @keyframes gridPulse {
                    0% { opacity: 0.08; }
                    100% { opacity: 0.3; }
                }
                @keyframes fall {
                    0% { transform: translateY(-100%); opacity: 0; }
                    10% { opacity: 0.5; }
                    90% { opacity: 0.5; }
                    100% { transform: translateY(100vh); opacity: 0; }
                }
            `}</style>
        </div>
    );
}

export function CoverBannerSelector({ selectedId, onSelect, onSave, onCancel, accent = "#3CF91A" }: { selectedId: string, onSelect: (id: string) => void, onSave: () => void, onCancel: () => void, accent?: string }) {
    return (
        <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 bg-(--theme-card) p-4 rounded-2xl border border-(--theme-border) shadow-2xl z-100 w-[300px] animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <h3 className="text-[13px] font-bold text-(--theme-text-primary) mb-3">Edit Cover Art</h3>
            <div className="grid grid-cols-4 gap-2 mb-4">
                {coverPresets.map(preset => {
                    const isSelected = selectedId === preset.id || selectedId === preset.className;
                    return (
                        <div key={preset.id}
                            onClick={() => onSelect(preset.id)}
                            className="h-12 rounded-xl cursor-pointer relative overflow-hidden transition-all duration-200 border-2"
                            style={{
                                borderColor: isSelected ? accent : 'transparent',
                                transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                            }}
                            title={preset.name}
                        >
                            <div className={`absolute inset-0 w-full h-full ${preset.className}`} />
                            {isSelected && (
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-10">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            <div className="flex gap-2">
                <button onClick={onCancel} className="flex-1 py-2 rounded-xl text-[11px] font-bold text-(--theme-text-primary) bg-(--theme-input-bg) hover:bg-(--theme-border) border-none cursor-pointer transition-colors">Cancel</button>
                <button onClick={onSave} className="flex-1 py-2 rounded-xl text-[11px] font-bold text-black border-none cursor-pointer transition-transform hover:scale-105" style={{ background: accent }}>Save</button>
            </div>
        </div>
    );
}
