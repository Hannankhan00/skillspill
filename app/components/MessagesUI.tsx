"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { MessageSquare, Send, ArrowLeft, Loader2 } from "lucide-react";

interface OtherUser {
    id: string;
    fullName: string;
    username: string;
    role: string;
}

interface Conversation {
    id: string;
    other: OtherUser;
    lastMessage: string | null;
    lastAt: string;
    unread: number;
}

interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    content: string;
    isRead: boolean;
    createdAt: string;
    sender: { id: string; fullName: string; username: string };
}

function getInitials(name: string) {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
}

function gradientFor(role: string) {
    if (role === "RECRUITER") return "from-purple-400 to-violet-600";
    return "from-emerald-400 to-teal-600";
}

function formatTime(iso: string) {
    const date = new Date(iso);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffDays === 0) return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return date.toLocaleDateString([], { weekday: "short" });
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

export default function MessagesUI({ accent }: { accent: string }) {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeConvoId, setActiveConvoId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [draft, setDraft] = useState("");
    const [loadingConvos, setLoadingConvos] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [sending, setSending] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Fetch current user ID
    useEffect(() => {
        fetch("/api/user/profile")
            .then(r => r.json())
            .then(d => setCurrentUserId(d.user?.id ?? null));
    }, []);

    // Load conversations
    const loadConversations = useCallback(async () => {
        try {
            const res = await fetch("/api/conversations");
            const data = await res.json();
            if (data.conversations) setConversations(data.conversations);
        } catch { /* ignore */ } finally {
            setLoadingConvos(false);
        }
    }, []);

    useEffect(() => { loadConversations(); }, [loadConversations]);

    // Handle ?with=userId param to auto-start a conversation
    useEffect(() => {
        const withUserId = searchParams.get("with");
        if (!withUserId) return;
        fetch("/api/conversations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ targetUserId: withUserId }),
        })
            .then(r => r.json())
            .then(d => {
                if (d.conversation) {
                    loadConversations();
                    setActiveConvoId(d.conversation.id);
                }
            });
        // Clear param
        router.replace(window.location.pathname);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    // Load messages for active conversation
    const loadMessages = useCallback(async (convoId: string) => {
        setLoadingMessages(true);
        try {
            const res = await fetch(`/api/conversations/${convoId}/messages`);
            const data = await res.json();
            if (data.messages) setMessages(data.messages);
        } catch { /* ignore */ } finally {
            setLoadingMessages(false);
        }
    }, []);

    useEffect(() => {
        if (!activeConvoId) { setMessages([]); return; }
        loadMessages(activeConvoId);

        // Poll for new messages every 3s
        pollRef.current = setInterval(() => loadMessages(activeConvoId), 3000);
        return () => { if (pollRef.current) clearInterval(pollRef.current); };
    }, [activeConvoId, loadMessages]);

    // Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = async () => {
        if (!draft.trim() || !activeConvoId || sending) return;
        setSending(true);
        const optimistic: Message = {
            id: `tmp-${Date.now()}`,
            conversationId: activeConvoId,
            senderId: currentUserId ?? "",
            content: draft.trim(),
            isRead: false,
            createdAt: new Date().toISOString(),
            sender: { id: currentUserId ?? "", fullName: "You", username: "you" },
        };
        setMessages(prev => [...prev, optimistic]);
        setDraft("");
        try {
            const res = await fetch(`/api/conversations/${activeConvoId}/messages`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: optimistic.content }),
            });
            const data = await res.json();
            if (data.message) {
                setMessages(prev => prev.map(m => m.id === optimistic.id ? data.message : m));
                setConversations(prev => prev.map(c =>
                    c.id === activeConvoId ? { ...c, lastMessage: data.message.content, lastAt: data.message.createdAt } : c
                ));
            }
        } catch { /* ignore */ }
        setSending(false);
    };

    const activeConvo = conversations.find(c => c.id === activeConvoId);

    return (
        <div className="h-full flex" style={{ background: "var(--theme-card)" }}>

            {/* SIDEBAR */}
            <div className={`${activeConvoId ? "hidden sm:flex" : "flex"} w-full sm:w-[300px] lg:w-[340px] flex-col shrink-0 border-r border-[var(--theme-border)]`}
                style={{ background: "var(--theme-surface)" }}>
                <div className="p-4 border-b border-[var(--theme-border)] shrink-0">
                    <h2 className="text-[17px] font-bold text-[var(--theme-text-primary)]">Messages</h2>
                    <div className="mt-2.5 relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                        <input type="text" placeholder="Search conversations..." className="w-full pl-8 pr-3 py-2 rounded-xl text-[12px] outline-none transition-all"
                            style={{ background: "var(--theme-input-bg)", border: "1px solid var(--theme-border)", color: "var(--theme-text-primary)" }} />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto scrollbar-none">
                    {loadingConvos ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-6 h-6 animate-spin" style={{ color: accent }} />
                        </div>
                    ) : conversations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                            <MessageSquare className="w-10 h-10 mb-3" style={{ color: accent, opacity: 0.4 }} />
                            <p className="text-[13px] font-medium text-[var(--theme-text-muted)]">No conversations yet</p>
                            <p className="text-[11px] text-[var(--theme-text-muted)] mt-1">Start a chat from the Talent Search or profile pages</p>
                        </div>
                    ) : (
                        conversations.map(c => (
                            <button key={c.id} onClick={() => setActiveConvoId(c.id)}
                                className={`w-full flex items-start gap-3 p-4 text-left transition-all border-b border-[var(--theme-border-light)] cursor-pointer border-none ${activeConvoId === c.id ? "opacity-100" : ""}`}
                                style={{ background: activeConvoId === c.id ? `${accent}10` : "transparent" }}>
                                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradientFor(c.other.role)} flex items-center justify-center text-white text-[11px] font-bold shrink-0`}>
                                    {getInitials(c.other.fullName)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-0.5">
                                        <p className="text-[13px] font-semibold text-[var(--theme-text-primary)] truncate">{c.other.fullName}</p>
                                        <span className="text-[10px] text-[var(--theme-text-muted)] shrink-0 ml-2">{formatTime(c.lastAt)}</span>
                                    </div>
                                    <p className="text-[11px] text-[var(--theme-text-muted)] truncate">{c.lastMessage ?? "Start the conversation"}</p>
                                    <p className="text-[10px] mt-0.5" style={{ color: accent }}>@{c.other.username} · {c.other.role.toLowerCase()}</p>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* CHAT AREA */}
            <div className={`${!activeConvoId ? "hidden sm:flex" : "flex"} flex-1 flex-col min-w-0`}
                style={{ background: "var(--theme-bg)" }}>

                {activeConvo ? (
                    <>
                        {/* Chat Header */}
                        <div className="shrink-0 h-14 flex items-center justify-between px-4 border-b border-[var(--theme-border)]"
                            style={{ background: "var(--theme-surface)" }}>
                            <div className="flex items-center gap-3">
                                <button onClick={() => setActiveConvoId(null)}
                                    className="sm:hidden p-1.5 -ml-1 rounded-lg cursor-pointer bg-transparent border-none text-[var(--theme-text-muted)]">
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                                <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${gradientFor(activeConvo.other.role)} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>
                                    {getInitials(activeConvo.other.fullName)}
                                </div>
                                <div>
                                    <p className="text-[13px] font-bold text-[var(--theme-text-primary)]">{activeConvo.other.fullName}</p>
                                    <p className="text-[10px] text-[var(--theme-text-muted)]">@{activeConvo.other.username} · {activeConvo.other.role.toLowerCase()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 scrollbar-none">
                            {loadingMessages ? (
                                <div className="flex items-center justify-center h-full">
                                    <Loader2 className="w-6 h-6 animate-spin" style={{ color: accent }} />
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <p className="text-[13px] text-[var(--theme-text-muted)]">No messages yet.</p>
                                    <p className="text-[11px] text-[var(--theme-text-muted)] mt-1">Say hello! 👋</p>
                                </div>
                            ) : (
                                messages.map(msg => {
                                    const isMine = msg.senderId === currentUserId;
                                    return (
                                        <div key={msg.id} className={`flex items-end gap-2.5 ${isMine ? "justify-end" : "justify-start"}`}>
                                            {!isMine && (
                                                <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${gradientFor(activeConvo.other.role)} flex items-center justify-center text-white text-[9px] font-bold shrink-0 mb-1`}>
                                                    {getInitials(activeConvo.other.fullName)}
                                                </div>
                                            )}
                                            <div className={`flex flex-col ${isMine ? "items-end" : "items-start"} max-w-[70%]`}>
                                                <div className={`px-3.5 py-2 rounded-2xl text-[13px] leading-relaxed ${isMine ? "rounded-br-sm text-white" : "rounded-bl-sm text-[var(--theme-text-primary)] border border-[var(--theme-border)]"}`}
                                                    style={isMine ? { background: `linear-gradient(135deg, ${accent}, ${accent}cc)` } : { background: "var(--theme-card)" }}>
                                                    {msg.content}
                                                </div>
                                                <span className="text-[9px] text-[var(--theme-text-muted)] mt-0.5 px-1">{formatTime(msg.createdAt)}</span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="shrink-0 p-3 sm:p-4 border-t border-[var(--theme-border)]"
                            style={{ background: "var(--theme-surface)" }}>
                            <form onSubmit={e => { e.preventDefault(); sendMessage(); }}
                                className="flex items-center gap-2 px-3 py-2 rounded-2xl border border-[var(--theme-border)] transition-all focus-within:border-[var(--focus-border)]"
                                style={{ background: "var(--theme-input-bg)" }}>
                                <input
                                    type="text"
                                    value={draft}
                                    onChange={e => setDraft(e.target.value)}
                                    onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())}
                                    placeholder="Type a message..."
                                    className="flex-1 bg-transparent border-none outline-none text-[13px] text-[var(--theme-text-primary)] placeholder:text-[var(--theme-text-muted)]"
                                />
                                <button type="submit" disabled={!draft.trim() || sending}
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-white border-none cursor-pointer transition-all hover:scale-105 disabled:opacity-40 shrink-0"
                                    style={{ background: `linear-gradient(135deg, ${accent}, ${accent}aa)` }}>
                                    {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                            style={{ background: `${accent}15` }}>
                            <MessageSquare className="w-8 h-8" style={{ color: accent }} />
                        </div>
                        <h3 className="text-[16px] font-bold text-[var(--theme-text-primary)] mb-1">Your Messages</h3>
                        <p className="text-[12px] text-[var(--theme-text-muted)] max-w-[260px] leading-relaxed">
                            Select a conversation or start a new one from the Talent Search or profile pages.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
