"use client";

import React, { useState } from "react";
import { MessageSquare } from "lucide-react";

const accent = "#A855F7";

const conversations = [
    {
        id: 1, name: "Sarah Codes", role: "Full-Stack Engineer", initials: "SC", grad: "from-violet-500 to-purple-600",
        lastMessage: "Thanks! I'd love to schedule a technical round.", time: "10:42 AM", unread: 2, online: true
    },
    {
        id: 2, name: "Rust Wizard", role: "Systems Engineer", initials: "RW", grad: "from-orange-400 to-red-500",
        lastMessage: "I've completed the challenge you sent over.", time: "Yesterday", unread: 0, online: false
    },
    {
        id: 3, name: "Data Ninja", role: "Machine Learning", initials: "DN", grad: "from-blue-400 to-indigo-500",
        lastMessage: "Yes, I have experience with CUDA and PyTorch.", time: "Tuesday", unread: 0, online: true
    }
];

export default function RecruiterMessagesPage() {
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const activeConvo = conversations.find(c => c.id === selectedId);

    return (
        <div style={{ background: "var(--theme-bg)" }} className="min-h-full flex flex-col pt-0 sm:pt-4">
            <div className="max-w-[1200px] w-full mx-auto px-0 sm:px-6 pb-0 sm:pb-8 flex-1 flex flex-col h-[calc(100vh-14rem)] sm:h-[calc(100vh-8rem)] min-h-[500px]">

                <div className="flex bg-[var(--theme-card)] sm:rounded-2xl sm:border border-[var(--theme-border)] shadow-sm overflow-hidden h-full">

                    {/* SIDEBAR (List) */}
                    <div className={`${selectedId ? 'hidden sm:flex' : 'flex'} w-full sm:w-[320px] lg:w-[380px] flex-col border-r-0 sm:border-r border-[var(--theme-border-light)] shrink-0 h-full bg-[var(--theme-surface)]`}>
                        <div className="p-4 sm:p-5 border-b border-[var(--theme-border)]">
                            <h2 className="text-[18px] sm:text-[20px] font-bold text-[var(--theme-text-primary)]">Messages</h2>
                            <div className="mt-3 relative">
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 rotate-90" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                                <input
                                    type="text"
                                    placeholder="Search messages..."
                                    className="w-full pl-9 pr-3 py-2 sm:py-2.5 rounded-xl text-[12px] sm:text-[13px] bg-[var(--theme-input-bg)] border border-[var(--theme-border)] text-[var(--theme-text-primary)] outline-none focus:border-[#A855F7]/40 focus:ring-2 focus:ring-purple-50 transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-none h-full bg-[var(--theme-card)]">
                            {conversations.map(c => (
                                <div key={c.id} onClick={() => setSelectedId(c.id)}
                                    className={`flex items-start gap-3 p-4 cursor-pointer transition-all border-b border-[var(--theme-border-light)] hover:bg-[var(--theme-bg-secondary)]
                                        ${selectedId === c.id ? 'bg-[#A855F7]/5' : ''}`}>
                                    <div className="relative shrink-0">
                                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br ${c.grad} flex items-center justify-center text-white text-[12px] font-bold shadow-sm border border-[var(--theme-surface)]`}>
                                            {c.initials}
                                        </div>
                                        {c.online && <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-[var(--theme-card)]" />}
                                    </div>
                                    <div className="flex-1 min-w-0 pr-2">
                                        <div className="flex items-center justify-between mb-0.5">
                                            <p className={`text-[13px] sm:text-[14px] font-bold truncate ${c.unread ? 'text-[#A855F7]' : 'text-[var(--theme-text-primary)]'}`}>{c.name}</p>
                                            <span className="text-[10px] text-[var(--theme-text-muted)] shrink-0">{c.time}</span>
                                        </div>
                                        <p className={`text-[11px] sm:text-[12px] truncate ${c.unread ? 'font-semibold text-[var(--theme-text-secondary)]' : 'text-[var(--theme-text-muted)]'}`}>
                                            {c.lastMessage}
                                        </p>
                                    </div>
                                    {c.unread > 0 && (
                                        <div className="flex flex-col items-center justify-center h-full pt-1 shrink-0">
                                            <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white bg-red-500 shadow-sm">{c.unread}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* MAIN CHAT AREA */}
                    <div className={`${!selectedId ? 'hidden sm:flex' : 'flex'} flex-1 flex-col h-full bg-[var(--theme-bg)] pb-14 sm:pb-0`}>
                        {activeConvo ? (
                            <>
                                {/* CHAT HEADER */}
                                <div className="h-14 sm:h-16 border-b border-[var(--theme-border)] flex items-center justify-between px-4 sm:px-6 bg-[var(--theme-surface)] shrink-0 relative z-10 w-full top-0">
                                    <div className="flex items-center gap-3 min-w-0 w-full">
                                        <button onClick={() => setSelectedId(null)} className="sm:hidden p-1.5 -ml-1.5 mr-1 rounded-lg hover:bg-[var(--theme-input-bg)] transition-colors text-[var(--theme-text-muted)] cursor-pointer">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
                                        </button>

                                        <div className="relative shrink-0">
                                            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br ${activeConvo.grad} flex items-center justify-center text-white text-[10px] sm:text-[11px] font-bold shadow-sm border border-[var(--theme-surface)]`}>
                                                {activeConvo.initials}
                                            </div>
                                            {activeConvo.online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-[var(--theme-surface)]" />}
                                        </div>
                                        <div className="min-w-0 flex-1 pr-2">
                                            <p className="text-[13px] sm:text-[15px] font-bold text-[var(--theme-text-primary)] truncate">{activeConvo.name}</p>
                                            <p className="text-[10px] sm:text-[11px] text-[var(--theme-text-muted)] font-medium truncate">{activeConvo.role}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                                        <button className="hidden sm:block px-4 py-1.5 rounded-xl text-[11px] font-bold text-white border-none cursor-pointer transition-all hover:scale-105"
                                            style={{ background: `linear-gradient(135deg, ${accent}, #7C3AED)`, boxShadow: `0 0 10px ${accent}30` }}>
                                            View Profile
                                        </button>
                                        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--theme-text-muted)] hover:bg-[var(--theme-input-bg)] cursor-pointer bg-transparent border-none transition-all">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" /></svg>
                                        </button>
                                    </div>
                                </div>

                                {/* MSG LIST */}
                                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6 scrollbar-none w-full relative">

                                    <div className="flex justify-center border-b border-[var(--theme-border-light)] mt-4 mb-8">
                                        <span className="-mb-2.5 px-4 bg-[var(--theme-bg)] text-[10px] font-semibold text-[var(--theme-text-tertiary)] uppercase tracking-widest border border-[var(--theme-border-light)] rounded-full pb-[1px]">Today</span>
                                    </div>

                                    {/* Sender */}
                                    <div className="flex items-end gap-3 justify-end w-full pl-8 sm:pl-16">
                                        <div className="flex flex-col items-end">
                                            <div className="max-w-full px-4 py-2 sm:py-2.5 rounded-2xl rounded-br-sm text-[13px] sm:text-[14px] text-white shadow-sm"
                                                style={{ background: `linear-gradient(135deg, ${accent}, #7C3AED)` }}>
                                                Hi {activeConvo.name.split(' ')[0]}, amazing profile! We have a Senior Rust role that fits perfectly.
                                                Are you open to discussing it?
                                            </div>
                                            <span className="text-[9px] text-[var(--theme-text-tertiary)] font-medium mt-1 uppercase tracking-wider">10:41 AM · Seen</span>
                                        </div>
                                    </div>

                                    {/* Receiver */}
                                    <div className="flex items-end gap-3 w-full pr-8 sm:pr-16">
                                        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${activeConvo.grad} flex items-center justify-center text-white text-[9px] font-bold shadow-sm shrink-0`}>
                                            {activeConvo.initials}
                                        </div>
                                        <div className="flex flex-col items-start w-full min-w-0">
                                            <div className="max-w-full px-4 py-2 sm:py-2.5 rounded-2xl rounded-bl-sm text-[13px] sm:text-[14px] border border-[var(--theme-border)] bg-[var(--theme-card)] text-[var(--theme-text-primary)] shadow-sm break-words">
                                                {activeConvo.lastMessage}
                                            </div>
                                            <span className="text-[9px] text-[var(--theme-text-tertiary)] font-medium mt-1 uppercase tracking-wider">{activeConvo.time}</span>
                                        </div>
                                    </div>

                                </div>

                                {/* INPUT */}
                                <div className="flex-shrink-0 p-3 sm:p-5 border-t border-[var(--theme-border)] bg-[var(--theme-surface)] w-full">
                                    <div className="flex items-center gap-2 sm:gap-3 bg-[var(--theme-input-bg)] border border-[var(--theme-border)] rounded-full px-2 sm:px-3 py-1.5 focus-within:border-[#A855F7]/40 focus-within:ring-2 focus-within:ring-purple-50 transition-all">
                                        <button className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-[var(--theme-text-muted)] hover:bg-[#A855F7]/10 hover:text-[#A855F7] transition-colors shrink-0 bg-transparent border-none cursor-pointer">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>
                                        </button>
                                        <input
                                            type="text"
                                            placeholder="Type a message..."
                                            className="flex-1 bg-transparent border-none outline-none text-[13px] sm:text-[14px] text-[var(--theme-text-primary)] w-full py-2 placeholder:text-[var(--theme-text-tertiary)] focus:ring-0 focus:outline-none"
                                        />
                                        <button className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white shadow-md hover:scale-105 transition-all shrink-0 cursor-pointer border-none"
                                            style={{ background: `linear-gradient(135deg, ${accent}, #7C3AED)` }}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                                        </button>
                                    </div>
                                    <div className="hidden sm:flex items-center gap-4 mt-2 px-3 text-[10px] font-bold text-[var(--theme-text-tertiary)] uppercase tracking-wider">
                                        <span className="flex items-center gap-1.5 cursor-pointer hover:text-[#A855F7] transition-colors"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg> Add Image</span>
                                        <span className="flex items-center gap-1.5 cursor-pointer hover:text-[#A855F7] transition-colors"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg> Add Snippet</span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[var(--theme-bg)] text-center h-full">
                                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#A855F7]/10 flex items-center justify-center text-[30px] sm:text-[40px] mb-4 sm:mb-6 shadow-inset">
                                    <MessageSquare className="w-10 h-10 text-[#A855F7]" />
                                </div>
                                <h3 className="text-[18px] sm:text-[20px] font-bold text-[var(--theme-text-primary)] mb-2">Your Messages</h3>
                                <p className="text-[13px] sm:text-[14px] text-[var(--theme-text-muted)] max-w-[300px] leading-relaxed">Select an active conversation from the sidebar to start chatting with elite talent.</p>
                                <button className="mt-6 sm:mt-8 px-5 py-2.5 rounded-xl text-[12px] font-bold text-[#A855F7] bg-[#A855F7]/10 border border-[#A855F7]/30 hover:bg-[#A855F7]/20 transition-all cursor-pointer">
                                    Browse Talent
                                </button>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
