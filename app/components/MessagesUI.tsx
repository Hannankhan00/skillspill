"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { MessageSquare, Send, ArrowLeft, Loader2, Wifi, WifiOff } from "lucide-react";
import { useSocket } from "@/lib/use-socket";

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
    lastSenderId: string | null;
    lastIsRead: boolean;
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

// ── Helpers ───────────────────────────────────────────────────────────────────

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

// ── Tick icons ─────────────────────────────────────────────────────────────────
function TickIcon({ isRead, isOptimistic }: { isRead: boolean; isOptimistic: boolean }) {
    if (isOptimistic) {
        return (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ opacity: 0.5 }}>
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
        );
    }
    if (isRead) {
        return (
            <svg width="16" height="12" viewBox="0 0 28 16" fill="none">
                <polyline points="1 8 5 12 12 4" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <polyline points="9 8 13 12 20 4" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        );
    }
    return (
        <svg width="16" height="12" viewBox="0 0 28 16" fill="none">
            <polyline points="1 8 5 12 12 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.5" />
            <polyline points="9 8 13 12 20 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.5" />
        </svg>
    );
}

export default function MessagesUI({ accent }: { accent: string }) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { socket, connected } = useSocket();

    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeConvoId, setActiveConvoId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [draft, setDraft] = useState("");
    const [loadingConvos, setLoadingConvos] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [sending, setSending] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());

    // Attachment State
    const [attachment, setAttachment] = useState<{ url: string; type: string } | null>(null);
    const [uploadingAttr, setUploadingAttr] = useState(false);
    const [showAttachMenu, setShowAttachMenu] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const attachMenuRef = useRef<HTMLDivElement>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const activeConvoIdRef = useRef<string | null>(null);
    const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isTypingRef = useRef(false);

    useEffect(() => { activeConvoIdRef.current = activeConvoId; }, [activeConvoId]);

    // ── Mobile keyboard ───────────────────────────────────────────────────────
    useEffect(() => {
        const vv = window.visualViewport;
        if (!vv) return;
        const onResize = () => {
            const keyboardH = window.innerHeight - vv.height;
            document.documentElement.style.setProperty("--keyboard-h", `${keyboardH}px`);
        };
        vv.addEventListener("resize", onResize);
        vv.addEventListener("scroll", onResize);
        onResize();
        return () => { vv.removeEventListener("resize", onResize); vv.removeEventListener("scroll", onResize); };
    }, []);

    // ── Close attach dropdown on outside click ────────────────────────────────
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (attachMenuRef.current && !attachMenuRef.current.contains(e.target as Node)) {
                setShowAttachMenu(false);
            }
        };
        if (showAttachMenu) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showAttachMenu]);

    // ── Fetch current user ────────────────────────────────────────────────────
    useEffect(() => {
        fetch("/api/user/profile")
            .then(r => r.json())
            .then(d => setCurrentUserId(d.user?.id ?? null));
    }, []);

    // ── Load conversation list ────────────────────────────────────────────────
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

    // ── Handle ?with=userId param ─────────────────────────────────────────────
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

    // ── Socket.io event listeners ─────────────────────────────────────────────
    useEffect(() => {
        if (!socket) return;

        // New message received (from the conversation room broadcast)
        const onNewMessage = (msg: Message) => {
            // Only process if it belongs to the active conversation
            if (msg.conversationId !== activeConvoIdRef.current) return;

            setMessages(prev => {
                // If it's our own message replacing an optimistic one, skip (handled in sendMessage)
                const exists = prev.some(m => m.id === msg.id);
                if (exists) return prev;
                return [...prev, msg];
            });

            // Mark as read immediately (we are in the conversation)
            if (msg.senderId !== currentUserId) {
                socket.emit("mark_read", msg.conversationId);
            }
        };

        // Sidebar update from personal room (notifies us about other conversations)
        const onConvoUpdated = (data: {
            conversationId: string;
            lastMessage: string;
            lastAt: string;
            lastSenderId: string;
            lastIsRead: boolean;
        }) => {
            setConversations(prev => prev.map(c => {
                if (c.id !== data.conversationId) return c;
                const isActive = data.conversationId === activeConvoIdRef.current;
                return {
                    ...c,
                    lastMessage: data.lastMessage,
                    lastAt: data.lastAt,
                    lastSenderId: data.lastSenderId,
                    lastIsRead: data.lastIsRead,
                    unread: isActive ? 0 : c.unread + 1,
                };
            }));
        };

        // Read receipts — our messages were read by the other person
        const onMessagesRead = (data: { conversationId: string; readIds: string[] }) => {
            const readSet = new Set(data.readIds);
            setMessages(prev => prev.map(m => readSet.has(m.id) ? { ...m, isRead: true } : m));
            setConversations(prev => prev.map(c => {
                if (c.id !== data.conversationId) return c;
                return c.lastSenderId === currentUserId ? { ...c, lastIsRead: true } : c;
            }));
        };

        // Typing indicators
        const onUserTyping = (data: { userId: string; conversationId: string }) => {
            if (data.conversationId !== activeConvoIdRef.current) return;
            if (data.userId === currentUserId) return;
            setTypingUsers(prev => new Set([...prev, data.userId]));
        };

        const onUserStopTyping = (data: { userId: string; conversationId: string }) => {
            setTypingUsers(prev => {
                const next = new Set(prev);
                next.delete(data.userId);
                return next;
            });
        };

        socket.on("new_message", onNewMessage);
        socket.on("conversation_updated", onConvoUpdated);
        socket.on("messages_read", onMessagesRead);
        socket.on("user_typing", onUserTyping);
        socket.on("user_stop_typing", onUserStopTyping);

        return () => {
            socket.off("new_message", onNewMessage);
            socket.off("conversation_updated", onConvoUpdated);
            socket.off("messages_read", onMessagesRead);
            socket.off("user_typing", onUserTyping);
            socket.off("user_stop_typing", onUserStopTyping);
        };
    }, [socket, currentUserId]);

    // ── Join / leave conversation room ────────────────────────────────────────
    useEffect(() => {
        if (!socket) return;

        // Leave previous room handled implicitly by joining new one,
        // but we explicitly track to leave on cleanup
        let prevConvoId: string | null = null;

        if (activeConvoId) {
            // Load messages from REST
            setLoadingMessages(true);
            setMessages([]);
            fetch(`/api/conversations/${activeConvoId}/messages`)
                .then(r => r.json())
                .then(d => {
                    setMessages(d.messages ?? []);
                    // Mark incoming as read
                    socket.emit("mark_read", activeConvoId);
                })
                .finally(() => setLoadingMessages(false));

            // Join the Socket.io room
            socket.emit("join_conversation", activeConvoId);
            prevConvoId = activeConvoId;

            // Clear unread badge for this convo
            setConversations(prev => prev.map(c => c.id === activeConvoId ? { ...c, unread: 0 } : c));
        } else {
            setMessages([]);
        }

        return () => {
            if (prevConvoId) {
                socket.emit("leave_conversation", prevConvoId);
            }
            setTypingUsers(new Set());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeConvoId, socket]);

    // ── Scroll to bottom ──────────────────────────────────────────────────────
    const isFirstLoad = useRef(true);
    useEffect(() => {
        if (!messagesEndRef.current) return;
        messagesEndRef.current.scrollIntoView({ behavior: isFirstLoad.current ? "instant" : "smooth" });
        isFirstLoad.current = false;
    }, [messages]);

    useEffect(() => { isFirstLoad.current = true; }, [activeConvoId]);

    // ── Send message ──────────────────────────────────────────────────────────
    const sendMessage = async () => {
        if ((!draft.trim() && !attachment) || !activeConvoId || sending || !socket) return;
        const content = draft.trim();
        const finalAttachment = attachment;

        setSending(true);
        setDraft("");
        setAttachment(null);

        // Stop typing signal
        if (isTypingRef.current) {
            socket.emit("stop_typing", activeConvoId);
            isTypingRef.current = false;
        }

        // Optimistic message (local only, will be replaced by server echo)
        const optimisticId = `tmp-${Date.now()}`;
        const optimistic: Message = {
            id: optimisticId,
            conversationId: activeConvoId,
            senderId: currentUserId ?? "",
            content,
            attachmentUrl: finalAttachment?.url,
            attachmentType: finalAttachment?.type,
            isRead: false,
            createdAt: new Date().toISOString(),
            sender: { id: currentUserId ?? "", fullName: "You", username: "you" },
        };
        setMessages(prev => [...prev, optimistic]);

        // Update sidebar instantly
        setConversations(prev => prev.map(c =>
            c.id === activeConvoId
                ? { ...c, lastMessage: content || "Sent an attachment", lastAt: optimistic.createdAt, lastSenderId: currentUserId, lastIsRead: false }
                : c
        ));

        // Emit via socket — server will broadcast new_message to all in room
        socket.emit("send_message", {
            conversationId: activeConvoId,
            content,
            attachmentUrl: finalAttachment?.url,
            attachmentType: finalAttachment?.type,
        });

        // Listen once for the server-confirmed message to replace optimistic
        const onNewMessage = (msg: Message) => {
            if (msg.conversationId !== activeConvoId || msg.senderId !== currentUserId) return;
            setMessages(prev => {
                // Replace the optimistic entry with real one
                const idx = prev.findIndex(m => m.id === optimisticId);
                if (idx === -1) return prev;
                const next = [...prev];
                next[idx] = msg;
                return next;
            });
            socket.off("new_message", onNewMessage);
        };
        socket.on("new_message", onNewMessage);

        // Fallback: remove optimistic listener after 10s to avoid leaks
        setTimeout(() => socket.off("new_message", onNewMessage), 10000);

        setSending(false);
        inputRef.current?.focus();
    };

    // ── Typing indicator ──────────────────────────────────────────────────────
    const handleDraftChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDraft(e.target.value);
        if (!socket || !activeConvoId) return;

        if (!isTypingRef.current) {
            socket.emit("typing", activeConvoId);
            isTypingRef.current = true;
        }

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            socket.emit("stop_typing", activeConvoId);
            isTypingRef.current = false;
        }, 2000);
    };

    // ── File upload ───────────────────────────────────────────────────────────
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
        fileInputRef.current.removeAttribute("capture");
        if (type === "document") {
            fileInputRef.current.accept = "*/*";
            fileInputRef.current.click();
        } else if (type === "media") {
            fileInputRef.current.accept = "image/*,video/*";
            fileInputRef.current.click();
        } else if (type === "camera") {
            fileInputRef.current.accept = "image/*,video/*";
            fileInputRef.current.setAttribute("capture", "environment");
            fileInputRef.current.click();
        } else if (type === "audio") {
            fileInputRef.current.accept = "audio/*";
            fileInputRef.current.click();
        }
    };

    const activeConvo = conversations.find(c => c.id === activeConvoId);

    return (
        <div
            className="h-full flex"
            style={{
                background: "var(--theme-card)",
                paddingBottom: "var(--keyboard-h, 0px)",
                transition: "padding-bottom 0.18s ease",
            }}
        >
            {/* ── SIDEBAR ─────────────────────────────────────────────────────── */}
            <div
                className={`${activeConvoId ? "hidden sm:flex" : "flex"} w-full sm:w-[290px] lg:w-[320px] flex-col shrink-0 border-r border-[var(--theme-border)]`}
                style={{ background: "var(--theme-surface)" }}
            >
                <div className="p-4 border-b border-[var(--theme-border)] shrink-0">
                    <div className="flex items-center justify-between mb-2.5">
                        <h2 className="text-[17px] font-bold text-[var(--theme-text-primary)]">Messages</h2>
                        {/* Connection status pill */}
                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-semibold"
                            style={{ background: connected ? "rgba(34,197,94,0.12)" : "rgba(234,179,8,0.12)", color: connected ? "#22c55e" : "#eab308" }}>
                            {connected
                                ? <><Wifi className="w-3 h-3" /> Live</>
                                : <><WifiOff className="w-3 h-3" /> Connecting…</>
                            }
                        </div>
                    </div>
                    <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input type="text" placeholder="Search conversations…"
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
                                style={{ background: activeConvoId === c.id ? `${accent}12` : "transparent" }}
                            >
                                {/* Avatar */}
                                <div className="relative shrink-0">
                                    {c.other.avatarUrl ? (
                                        <img src={c.other.avatarUrl} alt={c.other.fullName} className="w-10 h-10 rounded-full object-cover" />
                                    ) : (
                                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradientFor(c.other.role)} flex items-center justify-center text-white text-[11px] font-bold`}>
                                            {getInitials(c.other.fullName)}
                                        </div>
                                    )}
                                    {c.unread > 0 && (
                                        <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 rounded-full text-[9px] font-bold text-white flex items-center justify-center px-1"
                                            style={{ background: accent }}>
                                            {c.unread > 99 ? "99+" : c.unread}
                                        </span>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-0.5">
                                        <p className={`text-[13px] truncate ${c.unread > 0 ? "font-bold text-[var(--theme-text-primary)]" : "font-semibold text-[var(--theme-text-primary)]"}`}>
                                            {c.other.fullName}
                                        </p>
                                        <span className="text-[10px] text-[var(--theme-text-muted)] shrink-0 ml-2">{formatTime(c.lastAt)}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {c.lastSenderId === currentUserId && c.lastMessage && (
                                            <span className="shrink-0 flex items-center" style={{ color: "var(--theme-text-muted)" }}>
                                                <TickIcon isRead={c.lastIsRead} isOptimistic={false} />
                                            </span>
                                        )}
                                        <p className={`text-[11px] truncate ${c.unread > 0 ? "font-semibold text-[var(--theme-text-primary)]" : "text-[var(--theme-text-muted)]"}`}>
                                            {c.lastMessage ?? "Say hello 👋"}
                                        </p>
                                    </div>
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
            <div
                className={`${!activeConvoId ? "hidden sm:flex" : "flex"} flex-1 flex-col min-w-0`}
                style={{ background: "var(--theme-bg)" }}
            >
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
                                    <img src={activeConvo.other.avatarUrl} alt={activeConvo.other.fullName}
                                        className="w-9 h-9 rounded-full object-cover shrink-0 border border-black/10" />
                                ) : (
                                    <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${gradientFor(activeConvo.other.role)} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>
                                        {getInitials(activeConvo.other.fullName)}
                                    </div>
                                )}
                                <div>
                                    <p className="text-[13px] font-bold text-[var(--theme-text-primary)]">{activeConvo.other.fullName}</p>
                                    <div className="flex items-center gap-1.5">
                                        <p className="text-[10px] text-[var(--theme-text-muted)]">@{activeConvo.other.username}</p>
                                        {typingUsers.size > 0 ? (
                                            <span className="text-[10px] italic" style={{ color: accent }}>
                                                typing…
                                            </span>
                                        ) : (
                                            <>
                                                <span className={`w-1.5 h-1.5 rounded-full transition-colors ${connected ? "bg-green-500" : "bg-yellow-500 animate-pulse"}`} />
                                                <p className="text-[10px] text-[var(--theme-text-muted)]">{connected ? "Connected" : "Reconnecting…"}</p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div
                            ref={messagesContainerRef}
                            className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-1 scrollbar-none"
                            style={{ overflowAnchor: "none" }}
                        >
                            {loadingMessages ? (
                                <div className="flex items-center justify-center h-full">
                                    <Loader2 className="w-5 h-5 animate-spin" style={{ color: accent }} />
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center pb-8">
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3" style={{ background: `${accent}15` }}>
                                        <MessageSquare className="w-6 h-6" style={{ color: accent }} />
                                    </div>
                                    <p className="text-[13px] font-medium text-[var(--theme-text-muted)]">No messages yet</p>
                                    <p className="text-[11px] text-[var(--theme-text-muted)] mt-1">Say hello 👋</p>
                                </div>
                            ) : (
                                messages.map((msg, i) => {
                                    const isMine = msg.senderId === currentUserId;
                                    const isOptimistic = msg.id.startsWith("tmp-");

                                    const prevMsg = messages[i - 1];
                                    const nextMsg = messages[i + 1];
                                    const showDate = i === 0 || new Date(msg.createdAt).toDateString() !== new Date(messages[i - 1].createdAt).toDateString();
                                    const sameAsPrev = prevMsg && prevMsg.senderId === msg.senderId && !showDate;
                                    const sameAsNext = nextMsg && nextMsg.senderId === msg.senderId &&
                                        new Date(nextMsg.createdAt).toDateString() === new Date(msg.createdAt).toDateString();

                                    const getBubbleRadius = () => {
                                        if (isMine) {
                                            if (!sameAsPrev && sameAsNext) return "20px 20px 6px 20px";
                                            if (sameAsPrev && sameAsNext) return "20px 6px 6px 20px";
                                            if (sameAsPrev && !sameAsNext) return "20px 6px 20px 20px";
                                            return "20px 20px 6px 20px";
                                        } else {
                                            if (!sameAsPrev && sameAsNext) return "20px 20px 20px 6px";
                                            if (sameAsPrev && sameAsNext) return "6px 20px 20px 6px";
                                            if (sameAsPrev && !sameAsNext) return "6px 20px 20px 20px";
                                            return "20px 20px 20px 6px";
                                        }
                                    };

                                    return (
                                        <React.Fragment key={msg.id}>
                                            {showDate && (
                                                <div className="flex justify-center my-3">
                                                    <span className="text-[10px] font-semibold px-3 py-0.5 rounded-full uppercase tracking-widest"
                                                        style={{ background: "var(--theme-input-bg)", color: "var(--theme-text-muted)", border: "1px solid var(--theme-border-light)" }}>
                                                        {new Date(msg.createdAt).toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })}
                                                    </span>
                                                </div>
                                            )}
                                            <div className={`flex items-end gap-2 ${isMine ? "justify-end" : "justify-start"} ${sameAsPrev && !showDate ? "mt-0.5" : "mt-2"}`}>
                                                {!isMine && (
                                                    <div className="w-7 shrink-0 mb-1">
                                                        {!sameAsNext ? (
                                                            msg.sender.avatarUrl ? (
                                                                <img src={msg.sender.avatarUrl} alt={msg.sender.fullName} className="w-7 h-7 rounded-full object-cover" />
                                                            ) : (
                                                                <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${gradientFor(activeConvo.other.role)} flex items-center justify-center text-white text-[9px] font-bold`}>
                                                                    {getInitials(activeConvo.other.fullName)}
                                                                </div>
                                                            )
                                                        ) : null}
                                                    </div>
                                                )}
                                                <div className={`flex flex-col ${isMine ? "items-end" : "items-start"} max-w-[82%] sm:max-w-[68%]`}>
                                                    <div
                                                        className={`px-3.5 py-2.5 leading-relaxed break-words text-[14px] sm:text-[13px] ${isOptimistic ? "opacity-70" : ""}`}
                                                        style={{
                                                            borderRadius: getBubbleRadius(),
                                                            ...(isMine
                                                                ? { background: `linear-gradient(135deg, ${accent}, ${accent}bb)`, color: "#fff" }
                                                                : { background: "var(--theme-card)", color: "var(--theme-text-primary)", border: "1px solid var(--theme-border)" }
                                                            ),
                                                        }}
                                                    >
                                                        {msg.attachmentUrl && (
                                                            <div className="mb-2 max-w-full rounded-lg overflow-hidden border border-black/10">
                                                                {msg.attachmentType === "image" ? (
                                                                    <img src={msg.attachmentUrl} alt="Attachment" className="max-w-full max-h-64 object-contain" />
                                                                ) : msg.attachmentType === "video" ? (
                                                                    <video src={msg.attachmentUrl} controls className="max-w-full max-h-64 rounded-lg" />
                                                                ) : (
                                                                    <a href={msg.attachmentUrl} target="_blank" rel="noopener noreferrer"
                                                                        className={`flex items-center gap-2 px-3 py-2 ${isMine ? "text-white hover:text-white/80" : "text-[var(--theme-text-primary)]"} underline break-all text-[12px]`}>
                                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
                                                                        </svg>
                                                                        View Document
                                                                    </a>
                                                                )}
                                                            </div>
                                                        )}
                                                        {msg.content}
                                                    </div>

                                                    {(!sameAsNext || i === messages.length - 1) && (
                                                        <div className={`flex items-center gap-1 mt-0.5 px-1 ${isMine ? "flex-row-reverse" : "flex-row"}`}>
                                                            <span className="text-[9px] text-[var(--theme-text-muted)]">
                                                                {formatTime(msg.createdAt)}
                                                            </span>
                                                            {isMine && (
                                                                <TickIcon isRead={msg.isRead} isOptimistic={isOptimistic} />
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    );
                                })
                            )}
                            {/* Typing bubble */}
                            {typingUsers.size > 0 && (
                                <div className="flex items-end gap-2 justify-start mt-2">
                                    <div className="w-7 shrink-0 mb-1">
                                        {activeConvo.other.avatarUrl ? (
                                            <img src={activeConvo.other.avatarUrl} alt={activeConvo.other.fullName} className="w-7 h-7 rounded-full object-cover" />
                                        ) : (
                                            <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${gradientFor(activeConvo.other.role)} flex items-center justify-center text-white text-[9px] font-bold`}>
                                                {getInitials(activeConvo.other.fullName)}
                                            </div>
                                        )}
                                    </div>
                                    <div className="px-4 py-3 rounded-[20px_20px_20px_6px] flex items-center gap-1"
                                        style={{ background: "var(--theme-card)", border: "1px solid var(--theme-border)" }}>
                                        {[0, 1, 2].map(i => (
                                            <span key={i} className="w-1.5 h-1.5 rounded-full animate-bounce"
                                                style={{ background: "var(--theme-text-muted)", animationDelay: `${i * 0.15}s` }} />
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} style={{ overflowAnchor: "auto" }} />
                        </div>

                        {/* Input bar */}
                        <div
                            className="shrink-0 border-t border-[var(--theme-border)] relative"
                            style={{ background: "var(--theme-surface)" }}
                        >
                            {/* Attach Menu */}
                            {showAttachMenu && (
                                <div ref={attachMenuRef}
                                    className="absolute bottom-full left-0 right-0 sm:left-4 sm:right-auto mb-1 z-50 rounded-2xl shadow-2xl p-2 sm:w-[220px]"
                                    style={{ background: "#20232b", border: "1px solid rgba(255,255,255,0.05)", marginBottom: "8px" }}>
                                    <div className="flex flex-col gap-1">
                                        {[
                                            { type: "document", label: "Document", color: "#5F66CD", icon: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></> },
                                            { type: "media", label: "Photos & Videos", color: "#007AFF", icon: <><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></> },
                                            { type: "camera", label: "Camera", color: "#FF2D55", icon: <><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></> },
                                            { type: "audio", label: "Audio", color: "#FF9500", icon: <><path d="M3 18v-6a9 9 0 0 1 18 0v6" /><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" /></> },
                                        ].map(item => (
                                            <button key={item.type} onClick={() => handleAttachClick(item.type)}
                                                className="flex items-center gap-3 w-full p-2.5 rounded-xl border-none cursor-pointer bg-transparent hover:bg-white/5 transition-colors text-left">
                                                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: item.color }}>
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                        {item.icon}
                                                    </svg>
                                                </div>
                                                <span className="text-[14px] font-medium text-white">{item.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Attachment Preview */}
                            {attachment && (
                                <div className="mx-3 mt-3 px-3 py-2 rounded-xl flex items-center justify-between border"
                                    style={{ background: "var(--theme-card)", borderColor: "var(--theme-border)" }}>
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${accent}15`, color: accent }}>
                                            {attachment.type === "image"
                                                ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                                                : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                                            }
                                        </div>
                                        <div>
                                            <p className="text-[12px] font-semibold text-[var(--theme-text-primary)]">Attached File</p>
                                            <p className="text-[10px] text-[var(--theme-text-muted)] uppercase tracking-wider">{attachment.type}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setAttachment(null)}
                                        className="p-1.5 rounded-full hover:bg-[var(--theme-bg-secondary)] text-[var(--theme-text-muted)] cursor-pointer border-none bg-transparent">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                    </button>
                                </div>
                            )}

                            <form
                                onSubmit={e => { e.preventDefault(); sendMessage(); }}
                                className="flex items-center gap-2 mx-3 my-3 px-3 py-2 rounded-2xl border transition-all"
                                style={{ background: "var(--theme-input-bg)", border: `1px solid var(--theme-border)` }}
                            >
                                <button type="button" onClick={() => setShowAttachMenu(!showAttachMenu)} disabled={uploadingAttr}
                                    className={`p-1.5 rounded-full cursor-pointer border-none bg-transparent transition-colors ${showAttachMenu ? "text-[--theme-text-primary]" : "text-[var(--theme-text-muted)] hover:bg-[var(--theme-bg-secondary)]"}`}>
                                    {uploadingAttr ? <Loader2 className="w-4 h-4 animate-spin" /> :
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
                                            style={{ transform: showAttachMenu ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>
                                            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                                        </svg>}
                                </button>
                                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />

                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={draft}
                                    onChange={handleDraftChange}
                                    onFocus={() => {
                                        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 350);
                                    }}
                                    className="flex-1 bg-transparent border-none outline-none text-[16px] sm:text-[13px] placeholder:text-[var(--theme-text-muted)] py-1"
                                    placeholder="Type a message…"
                                    autoComplete="off"
                                    style={{ color: "var(--theme-text-primary)" }}
                                />
                                <button type="submit" disabled={(!draft.trim() && !attachment) || sending || !connected}
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-white border-none cursor-pointer transition-all hover:scale-105 active:scale-95 disabled:opacity-40 shrink-0"
                                    style={{ background: (draft.trim() || attachment) && connected ? `linear-gradient(135deg, ${accent}, ${accent}aa)` : "var(--theme-border)" }}>
                                    {sending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: `${accent}15` }}>
                            <MessageSquare className="w-8 h-8" style={{ color: accent }} />
                        </div>
                        <h3 className="text-[16px] font-bold text-[var(--theme-text-primary)] mb-1">Your Messages</h3>
                        <p className="text-[12px] text-[var(--theme-text-muted)] max-w-[240px] leading-relaxed">
                            Select a conversation or start a new one from any profile or search page.
                        </p>
                        {/* Live indicator */}
                        <div className="mt-4 flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-medium"
                            style={{ background: connected ? "rgba(34,197,94,0.1)" : "rgba(234,179,8,0.1)", color: connected ? "#22c55e" : "#eab308" }}>
                            <span className={`w-1.5 h-1.5 rounded-full ${connected ? "bg-green-500" : "bg-yellow-500 animate-pulse"}`} />
                            {connected ? "Socket.io Connected" : "Connecting to server…"}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
