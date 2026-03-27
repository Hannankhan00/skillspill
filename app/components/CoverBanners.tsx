import React from 'react';

// Centralised definition of animated cover banners
export const coverPresets = [
    { id: "1", name: "Solid Dark", type: "css", className: "bg-slate-900" },
    { id: "2", name: "Purple Nebula", type: "css", className: "bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 animate-[gradient_8s_ease_infinite] bg-[length:200%_200%]" },
    { id: "3", name: "Cyber Matrix", type: "css", className: "bg-gradient-to-b from-[#0D1117] to-[#041a0b] relative overflow-hidden", isMatrix: true },
    { id: "4", name: "Ocean Waves", type: "css", className: "bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-700 animate-[gradient_6s_ease_infinite] bg-[length:200%_200%]" },
    { id: "5", name: "Lava Flow", type: "css", className: "bg-gradient-to-bl from-rose-500 via-red-600 to-orange-600 animate-[gradient_4s_ease_infinite] bg-[length:150%_150%]" },
    { id: "6", name: "Starry Night", type: "css", className: "bg-[#0b0c10] relative overflow-hidden", isStars: true },
    { id: "7", name: "Cyber Flow", type: "css", className: "bg-gradient-to-r from-[#3CF91A] via-teal-500 to-[#3CF91A] animate-[gradient_5s_linear_infinite] bg-[length:200%_auto]" },
    { id: "8", name: "Deep Galaxy", type: "css", className: "bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-800 via-violet-900 to-slate-900" }
];

export function CoverBanner({ coverId, children }: { coverId?: string, children?: React.ReactNode }) {
    const preset = coverPresets.find(p => p.id === coverId || p.className === coverId) || coverPresets[1]; // fallback to index 1

    return (
        <div className={`absolute inset-0 w-full h-full ${preset.className}`}>
            {preset.isMatrix && (
                <div className="absolute inset-0 opacity-20 pointer-events-none flex flex-col justify-center items-start pl-8 text-[#3CF91A] font-mono text-xs overflow-hidden">
                   <div className="animate-[scroll_20s_linear_infinite] whitespace-pre" style={{ animation: 'scroll 20s linear infinite' }}>
                      {`01010100 01100001 01101100 01100101\n01101110 01110100 00100000\n01010011 01110000 01101001 01101100\n01101100 00100000 00111010 00101001\n`}
                      {`const System = { init: () => true };\nwhile(true) {\n  System.init();\n}\n`}
                      {`01010100 01100001 01101100 01100101\n01101110 01110100 00100000\n01010011 01110000 01101001 01101100\n01101100 00100000 00111010 00101001\n`}
                   </div>
                </div>
            )}
            {preset.isStars && (
                <div className="absolute inset-0 pointer-events-none opacity-50" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '24px 24px', animation: 'starsMove 60s linear infinite' }} />
            )}
            {/* The base pattern overlay */}
            <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fff' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
            />
            {children}
            {/* Add common keyframes if not defined */}
            <style>{`
                @keyframes scroll {
                    0% { transform: translateY(0); }
                    100% { transform: translateY(-50%); }
                }
                @keyframes starsMove {
                    from { background-position: 0 0; }
                    to { background-position: -500px 500px; }
                }
            `}</style>
        </div>
    );
}

export function CoverBannerSelector({ selectedId, onSelect, onSave, onCancel, accent = "#3CF91A" }: { selectedId: string, onSelect: (id: string) => void, onSave: () => void, onCancel: () => void, accent?: string }) {
    return (
        <div className="absolute top-4 left-4 bg-[var(--theme-card)] p-4 rounded-2xl border border-[var(--theme-border)] shadow-2xl z-50 w-[300px] animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <h3 className="text-[13px] font-bold text-[var(--theme-text-primary)] mb-3">Edit Cover Art</h3>
            <div className="grid grid-cols-4 gap-2 mb-4">
                {coverPresets.map(preset => {
                    const isSelected = selectedId === preset.id || selectedId === preset.className;
                    return (
                        <div key={preset.id}
                            onClick={() => onSelect(preset.id)}
                            className="h-12 rounded-xl cursor-pointer relative overflow-hidden transition-all duration-200 border-2"
                            style={{
                                borderColor: isSelected ? accent : 'transparent',
                                transform: isSelected ? 'scale(1.05)' : 'scale(1)'
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
                <button onClick={onCancel} className="flex-1 py-2 rounded-xl text-[11px] font-bold text-[var(--theme-text-primary)] bg-[var(--theme-input-bg)] hover:bg-[var(--theme-border)] border-none cursor-pointer transition-colors">Cancel</button>
                <button onClick={onSave} className="flex-1 py-2 rounded-xl text-[11px] font-bold text-black border-none cursor-pointer transition-transform hover:scale-105" style={{ background: accent }}>Save</button>
            </div>
        </div>
    );
}

