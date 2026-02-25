"use client";

import React, { useState } from "react";
import Link from "next/link";

const accent = "#A855F7";

const notifications = [
    {
        id: 1, type: "application", icon: "📄", title: "New Application",
        message: "Sarah Codes applied to your Senior Rust Systems Engineer bounty.",
        time: "2 hours ago", read: false,
        actionLink: "/recruiter/applications"
    },
    {
        id: 2, type: "match", icon: "✨", title: "High Match Found",
        message: "We found a 96% match for your Full-Stack Lead position. Invite them to apply!",
        time: "5 hours ago", read: false,
        actionLink: "/recruiter/search"
    },
    {
        id: 3, type: "spill", icon: "💬", title: "New Comment",
        message: "David_Dev commented on your recent hiring insights spill.",
        time: "1 day ago", read: true,
        actionLink: "/recruiter/spills"
    },
    {
        id: 4, type: "system", icon: "🚀", title: "Bounty Published",
        message: "Your ML Engineer bounty is now live and being matched with candidates.",
        time: "2 days ago", read: true,
        actionLink: "/recruiter/bounties"
    },
    {
        id: 5, type: "alert", icon: "⚠️", title: "Bounty Expiring Soon",
        message: "Your DevOps/SRE bounty expires in 5 days. Consider boosting it.",
        time: "3 days ago", read: true,
        actionLink: "/recruiter/bounties"
    }
];

export default function RecruiterNotificationsPage() {
    const [activeTab, setActiveTab] = useState("All");
    const [notifs, setNotifs] = useState(notifications);

    const markAllRead = () => {
        setNotifs(notifs.map(n => ({ ...n, read: true })));
    };

    const toggleRead = (id: number) => {
        setNotifs(notifs.map(n => n.id === id ? { ...n, read: !n.read } : n));
    };

    const tabs = ["All", "Unread"];

    const filteredNotifs = activeTab === "All" ? notifs : notifs.filter(n => !n.read);
    const unreadCount = notifs.filter(n => !n.read).length;

    return (
        <div style={{ background: "var(--theme-bg)" }} className="min-h-full">
            <div className="max-w-[800px] mx-auto px-4 sm:px-6 py-4 pb-24 lg:pb-8">

                {/* HEADER */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 sm:mb-6">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-[var(--theme-text-primary)]">Notifications</h1>
                        <p className="text-[12px] sm:text-[13px] text-[var(--theme-text-muted)] mt-0.5 sm:mt-1">Stay updated on your bounties, matches, and network.</p>
                    </div>
                </div>

                {/* TABS & ACTIONS */}
                <div className="flex items-center justify-between mb-4 border-b border-[var(--theme-border)] pb-0">
                    <div className="flex gap-2 lg:gap-3 overflow-x-auto scrollbar-none pb-0">
                        {tabs.map(tab => {
                            const count = tab === "All" ? notifs.length : unreadCount;
                            return (
                                <button key={tab} onClick={() => setActiveTab(tab)}
                                    className={`px-3 sm:px-5 py-2.5 sm:py-3 text-[11px] sm:text-[13px] font-semibold border-b-2 transition-all cursor-pointer bg-transparent whitespace-nowrap flex items-center gap-1.5
                                        ${activeTab === tab ? "border-purple-500 text-[#A855F7]" : "border-transparent text-[var(--theme-text-muted)] hover:text-[var(--theme-text-tertiary)]"}`}>
                                    {tab}
                                    <span className={`text-[8px] sm:text-[9px] px-1.5 py-0.5 rounded-full font-bold
                                        ${activeTab === tab ? "bg-[#A855F7]/20 text-[#A855F7]" : "bg-[var(--theme-input-bg)] text-[var(--theme-text-muted)]"}`}>
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                    {unreadCount > 0 && (
                        <button onClick={markAllRead} className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-[9px] sm:text-[11px] font-bold bg-[var(--theme-input-bg)] text-[var(--theme-text-secondary)] border border-[var(--theme-border-light)] hover:bg-[var(--theme-bg-secondary)] hover:text-[var(--theme-text-primary)] transition-all cursor-pointer shrink-0 mb-1">
                            Mark Read
                        </button>
                    )}
                </div>

                {/* NOTIFICATIONS LIST */}
                <div className="space-y-3 sm:space-y-4">
                    {filteredNotifs.map(notif => (
                        <div key={notif.id}
                            className={`rounded-2xl border bg-[var(--theme-card)] shadow-sm p-4 sm:p-5 flex flex-col sm:flex-row gap-3 sm:gap-4 transition-all hover:bg-[var(--theme-bg-secondary)] relative
                            ${!notif.read ? "border-[#A855F7]/40 ring-1 ring-[#A855F7]/20" : "border-[var(--theme-border)]"}`}>

                            {!notif.read && (
                                <div className="absolute top-4 sm:top-5 right-4 sm:right-5 w-2.5 h-2.5 rounded-full bg-[#A855F7] shadow-[0_0_8px_rgba(168,85,247,0.5)]"></div>
                            )}

                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-[16px] sm:text-[20px] shrink-0 font-bold bg-[var(--theme-input-bg)] border border-[var(--theme-border-light)] shadow-inner"
                                style={!notif.read ? { background: `linear-gradient(135deg, ${accent}30, ${accent}10)`, color: accent, borderColor: `${accent}40` } : {}}>
                                {notif.icon}
                            </div>

                            <div className="flex-1 min-w-0 pr-6 sm:pr-8">
                                <div className="flex items-center gap-2 mb-1 sm:mb-1.5">
                                    <p className={`text-[13px] sm:text-[15px] font-bold ${!notif.read ? 'text-[var(--theme-text-primary)]' : 'text-[var(--theme-text-secondary)]'}`}>
                                        {notif.title}
                                    </p>
                                </div>
                                <p className={`text-[12px] sm:text-[13px] leading-relaxed mb-2 sm:mb-3 
                                    ${!notif.read ? 'text-[var(--theme-text-secondary)] font-medium' : 'text-[var(--theme-text-muted)]'}`}>
                                    {notif.message}
                                </p>

                                <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-2">
                                    <span className="text-[10px] sm:text-[11px] font-bold text-[var(--theme-text-tertiary)] uppercase tracking-widest">{notif.time}</span>

                                    <Link href={notif.actionLink} className="text-[10px] sm:text-[11px] font-bold text-[#A855F7] hover:underline cursor-pointer bg-transparent border-none flex items-center gap-1">
                                        View Details <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
                                    </Link>

                                    <button onClick={() => toggleRead(notif.id)} className="text-[10px] sm:text-[11px] font-medium text-[var(--theme-text-muted)] hover:text-[var(--theme-text-primary)] cursor-pointer bg-transparent border-none ml-auto sm:ml-0">
                                        {notif.read ? "Mark Unread" : "Mark Read"}
                                    </button>
                                </div>
                            </div>

                        </div>
                    ))}

                    {filteredNotifs.length === 0 && (
                        <div className="py-12 sm:py-16 text-center rounded-2xl border-2 border-dashed border-[var(--theme-border)]">
                            <div className="w-16 h-16 rounded-full bg-[#A855F7]/10 flex items-center justify-center text-[24px] mb-4 mx-auto border border-[#A855F7]/20 shadow-inner">📭</div>
                            <p className="text-[13px] sm:text-[15px] font-bold text-[var(--theme-text-secondary)]">All caught up!</p>
                            <p className="text-[11px] sm:text-[12px] mt-1 text-[var(--theme-text-muted)]">You have no {activeTab === "Unread" ? "unread " : ""}notifications.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
