"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { MessageSquare, Send, ArrowLeft, Loader2 } from "lucide-react";

interface OtherUser {
    id: string;
    fullName: string;
    username: string;
    role: string;
    avatarUrl?: string | null;
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
    attachmentUrl?: string;
    attachmentType?: string;
    isRead: boolean;
    createdAt: string;
    sender: { id: string; fullName: string; username: string; avatarUrl?: string | null };
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
    const [sseConnected, setSseConnected] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    // Attachment State
    const [attachment, setAttachment] = useState<{ url: string; type: string } | null>(null);
    const [uploadingAttr, setUploadingAttr] = useState(false);
    const [showAttachMenu, setShowAttachMenu] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const attachMenuRef = useRef<HTMLDivElement>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    // Keep latest messages in a ref so SSE handler can read them without stale closures
    const messagesRef = useRef<Message[]>([]);
    const eventSourceRef = useRef<EventSource | null>(null);
    const activeConvoIdRef = useRef<string | null>(null);

    // Sync ref with state
    useEffect(() => { messagesRef.current = messages; }, [messages]);
    useEffect(() => { activeConvoIdRef.current = activeConvoId; }, [activeConvoId]);

    // Close attach dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (attachMenuRef.current && !attachMenuRef.current.contains(e.target as Node)) {
                setShowAttachMenu(false);
            }
        };
        if (showAttachMenu) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showAttachMenu]);

    // Fetch current user ID once
    useEffect(() => {
        fetch("/api/user/profile")
            .then(r => r.json())
            .then(d => setCurrentUserId(d.user?.id ?? null));
    }, []);

    // Load conversation list
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
        router.replace(window.location.pathname);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    // ── SSE connection management ──────────────────────────────────────────────
    useEffect(() => {
        // Close any existing SSE connection immediately
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
            setSseConnected(false);
        }

        if (!activeConvoId) {
            setMessages([]);
            return;
        }

        let cancelled = false;

        // Step 1: load the initial snapshot first, then open SSE with the exact afterId
        setLoadingMessages(true);
        fetch(`/api/conversations/${activeConvoId}/messages`)
            .then(r => r.json())
            .then(d => {
                if (cancelled) return;
                const initial: Message[] = d.messages ?? [];
                setMessages(initial);
                messagesRef.current = initial;

                // Step 2: open SSE starting AFTER the last message we already have
                const lastId = initial[initial.length - 1]?.id ?? null;
                openSSEFor(activeConvoId, lastId);
            })
            .finally(() => { if (!cancelled) setLoadingMessages(false); });

        return () => {
            cancelled = true;
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
                eventSourceRef.current = null;
            }
            setSseConnected(false);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeConvoId]);

    // Extracted so reconnect logic can call it too
    function openSSEFor(convoId: string, afterId: string | null) {
        const param = afterId ? `?afterId=${afterId}` : "";
        const es = new EventSource(`/api/conversations/${convoId}/stream${param}`);
        eventSourceRef.current = es;

        es.addEventListener("connected", () => setSseConnected(true));

        es.addEventListener("messages", (e: MessageEvent) => {
            const newMsgs: Message[] = JSON.parse(e.data);
            if (!newMsgs.length) return;

            setMessages(prev => {
                const existingIds = new Set(prev.map(m => m.id));
                // Only add messages from OTHER users — our own messages come via
                // the optimistic path and POST confirmation, never via SSE.
                const incoming = newMsgs.filter(m =>
                    m.senderId !== currentUserId && !existingIds.has(m.id)
                );
                if (!incoming.length) return prev;
                return [...prev, ...incoming];
            });

            // Update sidebar preview
            const last = newMsgs[newMsgs.length - 1];
            setConversations(prev => prev.map(c =>
                c.id === convoId ? { ...c, lastMessage: last.content, lastAt: last.createdAt } : c
            ));
        });

        // Server sends this before closing after 55s — reconnect immediately with latest cursor
        es.addEventListener("reconnect", (e: MessageEvent) => {
            const { lastSeenId } = JSON.parse(e.data) as { lastSeenId: string | null };
            es.close();
            setSseConnected(false);
            if (activeConvoIdRef.current === convoId) {
                // Reconnect immediately — no delay needed, this is a clean planned close
                const latestId = messagesRef.current[messagesRef.current.length - 1]?.id ?? lastSeenId;
                openSSEFor(convoId, latestId);
            }
        });

        es.onerror = () => {
            es.close();
            setSseConnected(false);
            // Reconnect after 2s on unexpected error
            if (activeConvoIdRef.current === convoId) {
                const lastId = messagesRef.current[messagesRef.current.length - 1]?.id ?? null;
                setTimeout(() => openSSEFor(convoId, lastId), 2000);
            }
        };
    }

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // ── Send message ──────────────────────────────────────────────────────────
    const sendMessage = async () => {
        if ((!draft.trim() && !attachment) || !activeConvoId || sending) return;
        const content = draft.trim();
        const finalAttachment = attachment;
        
        setSending(true);
        setDraft("");
        setAttachment(null); // clear staging

        // Optimistic message (shown immediately)
        const optimisticId = `tmp-${Date.now()}`;
        const optimistic = {
            id: optimisticId,
            conversationId: activeConvoId,
            senderId: currentUserId ?? "",
            content,
            attachmentUrl: finalAttachment?.url,
            attachmentType: finalAttachment?.type,
            isRead: false,
            createdAt: new Date().toISOString(),
            sender: { id: currentUserId ?? "", fullName: "You", username: "you" },
        } as Message;
        setMessages(prev => [...prev, optimistic]);

        try {
            const res = await fetch(`/api/conversations/${activeConvoId}/messages`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content, attachmentUrl: finalAttachment?.url, attachmentType: finalAttachment?.type }),
            });
            const data = await res.json();
            if (data.message) {
                // Replace optimistic with real message
                setMessages(prev => prev.map(m => m.id === optimisticId ? data.message : m));
                setConversations(prev => prev.map(c =>
                    c.id === activeConvoId ? { ...c, lastMessage: content || "Sent an attachment", lastAt: data.message.createdAt } : c
                ));
            }
        } catch {
            // Remove optimistic on failure
            setMessages(prev => prev.filter(m => m.id !== optimisticId));
            setDraft(content); 
            setAttachment(finalAttachment);
        }
        setSending(false);
        inputRef.current?.focus();
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingAttr(true);
        const fd = new FormData();
        fd.append("file", file);
        fd.append("category", "messages");
        fd.append("folder", "messages");

        try {
            const res = await fetch("/api/upload", { method: "POST", body: fd });
            const data = await res.json();
            if (res.ok && data.url) {
                let type = "document";
                if (file.type.startsWith("image/")) type = "image";
                else if (file.type.startsWith("video/")) type = "video";
                else if (file.type.startsWith("audio/")) type = "audio";

                setAttachment({ url: data.url, type });
            }
        } catch (err) {
            console.error("Upload error", err);
        } finally {
            setUploadingAttr(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleAttachClick = (type: string) => {
        setShowAttachMenu(false);
        if (!fileInputRef.current) return;

        fileInputRef.current.removeAttribute('capture');
        
        if (type === 'document') {
            fileInputRef.current.accept = "*/*";
            fileInputRef.current.click();
        } else if (type === 'media') {
            fileInputRef.current.accept = "image/*,video/*";
            fileInputRef.current.click();
        } else if (type === 'camera') {
            fileInputRef.current.accept = "image/*,video/*";
            fileInputRef.current.setAttribute('capture', 'environment');
            fileInputRef.current.click();
        } else if (type === 'audio') {
            fileInputRef.current.accept = "audio/*";
            fileInputRef.current.click();
        }
        // Other types (Poll, Contact, etc) can just close the menu for now as placeholders
    };

    const activeConvo = conversations.find(c => c.id === activeConvoId);

    return (
        <div className="h-full flex" style={{ background: "var(--theme-card)" }}>

            {/* ── SIDEBAR ─────────────────────────────────────────────────────── */}
            <div className={`${activeConvoId ? "hidden sm:flex" : "flex"} w-full sm:w-[290px] lg:w-[320px] flex-col shrink-0 border-r border-[var(--theme-border)]`}
                style={{ background: "var(--theme-surface)" }}>

                <div className="p-4 border-b border-[var(--theme-border)] shrink-0">
                    <h2 className="text-[17px] font-bold text-[var(--theme-text-primary)]">Messages</h2>
                    <div className="mt-2.5 relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input type="text" placeholder="Search conversations..."
                            className="w-full pl-8 pr-3 py-2 rounded-xl text-[12px] outline-none transition-all"
                            style={{ background: "var(--theme-input-bg)", border: "1px solid var(--theme-border)", color: "var(--theme-text-primary)" }} />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto scrollbar-none">
                    {loadingConvos ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-5 h-5 animate-spin" style={{ color: accent }} />
                        </div>
                    ) : conversations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 px-5 text-center">
                            <MessageSquare className="w-9 h-9 mb-3" style={{ color: accent, opacity: 0.35 }} />
                            <p className="text-[13px] font-medium text-[var(--theme-text-muted)]">No conversations yet</p>
                            <p className="text-[11px] text-[var(--theme-text-muted)] mt-1 leading-relaxed">
                                Start a chat from the Talent Search or a profile page
                            </p>
                        </div>
                    ) : (
                        conversations.map(c => (
                            <button key={c.id} onClick={() => setActiveConvoId(c.id)}
                                className="w-full flex items-start gap-3 p-3.5 text-left border-b border-[var(--theme-border-light)] cursor-pointer border-none transition-colors"
                                style={{ background: activeConvoId === c.id ? `${accent}12` : "transparent" }}>
                                {c.other.avatarUrl ? (
                                    <img src={c.other.avatarUrl} alt={c.other.fullName} className="w-10 h-10 rounded-full object-cover shrink-0" />
                                ) : (
                                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradientFor(c.other.role)} flex items-center justify-center text-white text-[11px] font-bold shrink-0`}>
                                        {getInitials(c.other.fullName)}
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-0.5">
                                        <p className="text-[13px] font-semibold text-[var(--theme-text-primary)] truncate">{c.other.fullName}</p>
                                        <span className="text-[10px] text-[var(--theme-text-muted)] shrink-0 ml-2">{formatTime(c.lastAt)}</span>
                                    </div>
                                    <p className="text-[11px] text-[var(--theme-text-muted)] truncate">{c.lastMessage ?? "Say hello 👋"}</p>
                                    <p className="text-[10px] mt-0.5 font-medium" style={{ color: `${accent}99` }}>
                                        @{c.other.username} · {c.other.role.toLowerCase()}
                                    </p>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* ── CHAT AREA ────────────────────────────────────────────────────── */}
            <div className={`${!activeConvoId ? "hidden sm:flex" : "flex"} flex-1 flex-col min-w-0`}
                style={{ background: "var(--theme-bg)" }}>

                {activeConvo ? (
                    <>
                        {/* Header */}
                        <div className="shrink-0 h-14 flex items-center justify-between px-4 border-b border-[var(--theme-border)]"
                            style={{ background: "var(--theme-surface)" }}>
                            <div className="flex items-center gap-3">
                                <button onClick={() => setActiveConvoId(null)}
                                    className="sm:hidden p-1.5 -ml-1 rounded-lg cursor-pointer bg-transparent border-none text-[var(--theme-text-muted)]">
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                                {activeConvo.other.avatarUrl ? (
                                    <img src={activeConvo.other.avatarUrl} alt={activeConvo.other.fullName} className="w-9 h-9 rounded-full object-cover shrink-0 border border-black/10" />
                                ) : (
                                    <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${gradientFor(activeConvo.other.role)} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>
                                        {getInitials(activeConvo.other.fullName)}
                                    </div>
                                )}
                                <div>
                                    <p className="text-[13px] font-bold text-[var(--theme-text-primary)]">{activeConvo.other.fullName}</p>
                                    <div className="flex items-center gap-1.5">
                                        <p className="text-[10px] text-[var(--theme-text-muted)]">@{activeConvo.other.username}</p>
                                        {/* SSE connection indicator */}
                                        <span className={`w-1.5 h-1.5 rounded-full transition-colors ${sseConnected ? "bg-green-500" : "bg-yellow-500 animate-pulse"}`} />
                                        <p className="text-[10px] text-[var(--theme-text-muted)]">{sseConnected ? "Connected" : "Connecting…"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 scrollbar-none">
                            {loadingMessages ? (
                                <div className="flex items-center justify-center h-full">
                                    <Loader2 className="w-5 h-5 animate-spin" style={{ color: accent }} />
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center pb-8">
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                                        style={{ background: `${accent}15` }}>
                                        <MessageSquare className="w-6 h-6" style={{ color: accent }} />
                                    </div>
                                    <p className="text-[13px] font-medium text-[var(--theme-text-muted)]">No messages yet</p>
                                    <p className="text-[11px] text-[var(--theme-text-muted)] mt-1">Say hello 👋</p>
                                </div>
                            ) : (
                                messages.map((msg, i) => {
                                    const isMine = msg.senderId === currentUserId;
                                    const isOptimistic = msg.id.startsWith("tmp-");
                                    // Show date separator
                                    const showDate = i === 0 || new Date(msg.createdAt).toDateString() !== new Date(messages[i - 1].createdAt).toDateString();

                                    return (
                                        <React.Fragment key={msg.id}>
                                            {showDate && (
                                                <div className="flex justify-center my-2">
                                                    <span className="text-[10px] font-semibold px-3 py-0.5 rounded-full uppercase tracking-widest"
                                                        style={{ background: "var(--theme-input-bg)", color: "var(--theme-text-muted)", border: "1px solid var(--theme-border-light)" }}>
                                                        {new Date(msg.createdAt).toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })}
                                                    </span>
                                                </div>
                                            )}
                                            <div className={`flex items-end gap-2.5 ${isMine ? "justify-end" : "justify-start"}`}>
                                                {!isMine && (
                                                    msg.sender.avatarUrl ? (
                                                        <img src={msg.sender.avatarUrl} alt={msg.sender.fullName} className="w-7 h-7 rounded-full object-cover shrink-0 mb-1" />
                                                    ) : (
                                                        <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${gradientFor(activeConvo.other.role)} flex items-center justify-center text-white text-[9px] font-bold shrink-0 mb-1`}>
                                                            {getInitials(activeConvo.other.fullName)}
                                                        </div>
                                                    )
                                                )}
                                                <div className={`flex flex-col ${isMine ? "items-end" : "items-start"} max-w-[85%] sm:max-w-[72%]`}>
                                                    <div className={`px-3.5 py-2 leading-relaxed break-words ${isMine ? "rounded-2xl rounded-br-sm text-[14px] sm:text-[13px] text-white" : "rounded-2xl rounded-bl-sm text-[14px] sm:text-[13px] text-[var(--theme-text-primary)] border border-[var(--theme-border)]"} ${isOptimistic ? "opacity-70" : ""}`}
                                                        style={isMine ? { background: `linear-gradient(135deg, ${accent}, ${accent}bb)` } : { background: "var(--theme-card)" }}>
                                                        
                                                        {/* Attachment renderer */}
                                                        {msg.attachmentUrl && (
                                                            <div className="mb-2 max-w-full rounded-lg overflow-hidden border border-black/10">
                                                                {msg.attachmentType === "image" ? (
                                                                    <img src={msg.attachmentUrl} alt="Attachment" className="max-w-full max-h-64 object-contain" />
                                                                ) : msg.attachmentType === "video" ? (
                                                                    <video src={msg.attachmentUrl} controls className="max-w-full max-h-64 rounded-lg" />
                                                                ) : (
                                                                    <a href={msg.attachmentUrl} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 px-3 py-2 ${isMine ? "text-white hover:text-white/80" : "text-[var(--theme-text-primary)] hover:text-[var(--theme-text-secondary)] "} underline break-all text-[12px]`}>
                                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                                                                        View Document
                                                                    </a>
                                                                )}
                                                            </div>
                                                        )}
                                                        {msg.content}
                                                    </div>
                                                    <span className="text-[9px] text-[var(--theme-text-muted)] mt-0.5 px-1 flex items-center gap-1">
                                                        {formatTime(msg.createdAt)}
                                                        {isMine && !isOptimistic && (
                                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                                {msg.isRead
                                                                    ? <><polyline points="1 12 5 16 12 8" /><polyline points="9 12 13 16 20 8" /></>
                                                                    : <polyline points="4 12 9 17 20 6" />}
                                                            </svg>
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="shrink-0 p-3 sm:p-4 border-t border-[var(--theme-border)] relative"
                            style={{ background: "var(--theme-surface)" }}>
                            
                            {/* WhatsApp-Style Attachment Menu */}
                            {showAttachMenu && (
                                <div ref={attachMenuRef} className="absolute bottom-[calc(100%-8px)] left-4 mb-2 z-50 rounded-2xl shadow-2xl p-2 w-[220px] animate-in slide-in-from-bottom-2 fade-in duration-200"
                                    style={{ background: "#20232b", border: "1px solid rgba(255,255,255,0.05)" }}>
                                    <div className="flex flex-col gap-1">
                                        <button onClick={() => handleAttachClick('document')} className="flex items-center gap-3 w-full p-2 rounded-xl border-none cursor-pointer bg-transparent hover:bg-white/5 transition-colors text-left group">
                                            <div className="w-8 h-8 rounded-full bg-[#5F66CD] flex items-center justify-center shrink-0">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                                            </div>
                                            <span className="text-[14px] font-medium text-white group-hover:text-white/90">Document</span>
                                        </button>
                                        <button onClick={() => handleAttachClick('media')} className="flex items-center gap-3 w-full p-2 rounded-xl border-none cursor-pointer bg-transparent hover:bg-white/5 transition-colors text-left group">
                                            <div className="w-8 h-8 rounded-full bg-[#007AFF] flex items-center justify-center shrink-0">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                                            </div>
                                            <span className="text-[14px] font-medium text-white group-hover:text-white/90">Photos & videos</span>
                                        </button>
                                        <button onClick={() => handleAttachClick('camera')} className="flex items-center gap-3 w-full p-2 rounded-xl border-none cursor-pointer bg-transparent hover:bg-white/5 transition-colors text-left group">
                                            <div className="w-8 h-8 rounded-full bg-[#FF2D55] flex items-center justify-center shrink-0">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>
                                            </div>
                                            <span className="text-[14px] font-medium text-white group-hover:text-white/90">Camera</span>
                                        </button>
                                        <button onClick={() => handleAttachClick('audio')} className="flex items-center gap-3 w-full p-2 rounded-xl border-none cursor-pointer bg-transparent hover:bg-white/5 transition-colors text-left group">
                                            <div className="w-8 h-8 rounded-full bg-[#FF9500] flex items-center justify-center shrink-0">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M3 18v-6a9 9 0 0 1 18 0v6" /><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" /></svg>
                                            </div>
                                            <span className="text-[14px] font-medium text-white group-hover:text-white/90">Audio</span>
                                        </button>
                                        <button onClick={() => handleAttachClick('contact')} className="flex items-center gap-3 w-full p-2 rounded-xl border-none cursor-pointer bg-transparent hover:bg-white/5 transition-colors text-left group">
                                            <div className="w-8 h-8 rounded-full bg-[#00C7BE] flex items-center justify-center shrink-0">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                            </div>
                                            <span className="text-[14px] font-medium text-white group-hover:text-white/90">Contact</span>
                                        </button>
                                        <button onClick={() => handleAttachClick('poll')} className="flex items-center gap-3 w-full p-2 rounded-xl border-none cursor-pointer bg-transparent hover:bg-white/5 transition-colors text-left group">
                                            <div className="w-8 h-8 rounded-full bg-[#FFCC00] flex items-center justify-center shrink-0">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
                                            </div>
                                            <span className="text-[14px] font-medium text-white group-hover:text-white/90">Poll</span>
                                        </button>
                                        <button onClick={() => handleAttachClick('event')} className="flex items-center gap-3 w-full p-2 rounded-xl border-none cursor-pointer bg-transparent hover:bg-white/5 transition-colors text-left group">
                                            <div className="w-8 h-8 rounded-full bg-[#FF2D55] flex items-center justify-center shrink-0">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                                            </div>
                                            <span className="text-[14px] font-medium text-white group-hover:text-white/90">Event</span>
                                        </button>
                                        <button onClick={() => handleAttachClick('sticker')} className="flex items-center gap-3 w-full p-2 rounded-xl border-none cursor-pointer bg-transparent hover:bg-white/5 transition-colors text-left group">
                                            <div className="w-8 h-8 rounded-full bg-[#00C7BE] flex items-center justify-center shrink-0">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M12 22a10 10 0 1 1 10-10c0 5.52-4.48 10-10 10z" /><circle cx="9" cy="9" r="1" /><circle cx="15" cy="9" r="1" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><path d="M21.5 21.5L19 19" /></svg>
                                            </div>
                                            <span className="text-[14px] font-medium text-white group-hover:text-white/90">New sticker</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                            
                            {/* Staged Attachment Preview */}
                            {attachment && (
                                <div className="mb-3 px-3 py-2 rounded-xl flex items-center justify-between border" style={{ background: "var(--theme-card)", borderColor: "var(--theme-border)" }}>
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${accent}15`, color: accent }}>
                                            {attachment.type === "image" ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg> : 
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>}
                                        </div>
                                        <div>
                                            <p className="text-[12px] font-semibold text-[var(--theme-text-primary)]">Attached File</p>
                                            <p className="text-[10px] text-[var(--theme-text-muted)] uppercase tracking-wider">{attachment.type}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setAttachment(null)} className="p-1.5 rounded-full hover:bg-[var(--theme-bg-secondary)] text-[var(--theme-text-muted)] cursor-pointer border-none bg-transparent">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                    </button>
                                </div>
                            )}

                            <form onSubmit={e => { e.preventDefault(); sendMessage(); }}
                                className="flex items-center gap-2 px-3 py-2 rounded-2xl border transition-all"
                                style={{ background: "var(--theme-input-bg)", border: `1px solid var(--theme-border)` }}>
                                
                                <button type="button" onClick={() => setShowAttachMenu(!showAttachMenu)} disabled={uploadingAttr} className={`p-1.5 rounded-full cursor-pointer border-none bg-transparent transition-colors ${showAttachMenu ? "text-[--theme-text-primary]" : "text-[var(--theme-text-muted)] hover:bg-[var(--theme-bg-secondary)]"}`}>
                                    {uploadingAttr ? <Loader2 className="w-4 h-4 animate-spin" /> : 
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: showAttachMenu ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }}>
                                        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                                    </svg>}
                                </button>
                                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />

                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={draft}
                                    onChange={e => setDraft(e.target.value)}
                                    // Make sure text ends up >=16px on mobile (so Safari does not zoom)
                                    className="flex-1 bg-transparent border-none outline-none text-[16px] sm:text-[13px] placeholder:text-[var(--theme-text-muted)] py-1"
                                    placeholder="Type a message…"
                                    autoComplete="off"
                                    style={{ color: "var(--theme-text-primary)" }}
                                />
                                <button type="submit" disabled={(!draft.trim() && !attachment) || sending}
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-white border-none cursor-pointer transition-all hover:scale-105 active:scale-95 disabled:opacity-40 shrink-0"
                                    style={{ background: draft.trim() || attachment ? `linear-gradient(135deg, ${accent}, ${accent}aa)` : "var(--theme-border)" }}>
                                    {sending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
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
                        <p className="text-[12px] text-[var(--theme-text-muted)] max-w-[240px] leading-relaxed">
                            Select a conversation or start a new one from any profile or search page.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
