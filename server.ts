import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server as SocketIOServer } from "socket.io";
import { jwtVerify } from "jose";
import { parse as parseCookie } from "cookie";
import { PrismaClient } from "@prisma/client";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const prisma = new PrismaClient();
const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || "your-jwt-secret");

// ── Verify JWT from cookie ────────────────────────────────────────────────────
async function verifyToken(token: string): Promise<{ userId: string; role: string } | null> {
    try {
        const { payload } = await jwtVerify(token, SECRET_KEY, { algorithms: ["HS256"] });
        return payload as { userId: string; role: string };
    } catch {
        return null;
    }
}

app.prepare().then(() => {
    const httpServer = createServer((req, res) => {
        const parsedUrl = parse(req.url!, true);
        handle(req, res, parsedUrl);
    });

    const io = new SocketIOServer(httpServer, {
        path: "/api/socket",
        addTrailingSlash: false,
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    // ── Auth middleware ────────────────────────────────────────────────────────
    io.use(async (socket, next) => {
        try {
            const cookieHeader = socket.handshake.headers.cookie ?? "";
            const cookies = parseCookie(cookieHeader);
            const sessionToken = cookies["session"];

            if (!sessionToken) {
                return next(new Error("Unauthorized: no session cookie"));
            }

            const payload = await verifyToken(sessionToken);
            if (!payload) {
                return next(new Error("Unauthorized: invalid session"));
            }

            socket.data.userId = payload.userId;
            socket.data.role = payload.role;
            next();
        } catch (err) {
            next(new Error("Auth error"));
        }
    });

    // ── Connection handler ────────────────────────────────────────────────────
    io.on("connection", (socket) => {
        const userId: string = socket.data.userId;
        console.log(`[socket.io] connected: ${userId} (${socket.id})`);

        // Join personal room so we can send targeted events
        socket.join(`user:${userId}`);

        // ── Join a conversation room ──────────────────────────────────────────
        socket.on("join_conversation", async (conversationId: string) => {
            try {
                const convo = await prisma.conversation.findUnique({ where: { id: conversationId } });
                if (!convo || (convo.userAId !== userId && convo.userBId !== userId)) {
                    socket.emit("error", { message: "Conversation not found or access denied" });
                    return;
                }
                socket.join(`convo:${conversationId}`);
                socket.emit("joined", { conversationId });
            } catch (err) {
                console.error("[socket.io] join_conversation error:", err);
            }
        });

        // ── Leave a conversation room ─────────────────────────────────────────
        socket.on("leave_conversation", (conversationId: string) => {
            socket.leave(`convo:${conversationId}`);
        });

        // ── Send a message ────────────────────────────────────────────────────
        socket.on("send_message", async (data: {
            conversationId: string;
            content: string;
            attachmentUrl?: string;
            attachmentType?: string;
        }) => {
            try {
                const { conversationId, content, attachmentUrl, attachmentType } = data;

                if (!content?.trim() && !attachmentUrl) {
                    socket.emit("error", { message: "Content or attachment required" });
                    return;
                }

                const convo = await prisma.conversation.findUnique({ where: { id: conversationId } });
                if (!convo || (convo.userAId !== userId && convo.userBId !== userId)) {
                    socket.emit("error", { message: "Conversation not found" });
                    return;
                }

                // Save to database
                const message = await prisma.message.create({
                    data: {
                        conversationId,
                        senderId: userId,
                        content: content?.trim() || "",
                        attachmentUrl,
                        attachmentType,
                    },
                    include: {
                        sender: { select: { id: true, fullName: true, username: true, avatarUrl: true } },
                    },
                });

                // Update conversation metadata
                await prisma.conversation.update({
                    where: { id: conversationId },
                    data: {
                        lastMessage: content?.trim() || "Sent an attachment",
                        lastAt: new Date(),
                    },
                });

                // Broadcast to everyone in the conversation room (including sender)
                io.to(`convo:${conversationId}`).emit("new_message", message);

                // Also notify the other user's personal room (for sidebar updates even if not in chat)
                const otherUserId = convo.userAId === userId ? convo.userBId : convo.userAId;
                io.to(`user:${otherUserId}`).emit("conversation_updated", {
                    conversationId,
                    lastMessage: message.content || "Sent an attachment",
                    lastAt: message.createdAt,
                    lastSenderId: userId,
                    lastIsRead: false,
                });

            } catch (err) {
                console.error("[socket.io] send_message error:", err);
                socket.emit("error", { message: "Failed to send message" });
            }
        });

        // ── Mark messages as read ─────────────────────────────────────────────
        socket.on("mark_read", async (conversationId: string) => {
            try {
                const updated = await prisma.message.findMany({
                    where: { conversationId, senderId: { not: userId }, isRead: false },
                    select: { id: true, senderId: true },
                });

                if (!updated.length) return;

                // Group by sender
                const ids = updated.map(m => m.id);
                await prisma.message.updateMany({
                    where: { id: { in: ids } },
                    data: { isRead: true },
                });

                // Notify the original senders that their messages were read
                const senderIds = [...new Set(updated.map(m => m.senderId))];
                for (const senderId of senderIds) {
                    const senderMsgIds = updated.filter(m => m.senderId === senderId).map(m => m.id);
                    io.to(`user:${senderId}`).emit("messages_read", {
                        conversationId,
                        readIds: senderMsgIds,
                    });
                }
            } catch (err) {
                console.error("[socket.io] mark_read error:", err);
            }
        });

        // ── Typing indicator ──────────────────────────────────────────────────
        socket.on("typing", (conversationId: string) => {
            socket.to(`convo:${conversationId}`).emit("user_typing", { userId, conversationId });
        });

        socket.on("stop_typing", (conversationId: string) => {
            socket.to(`convo:${conversationId}`).emit("user_stop_typing", { userId, conversationId });
        });

        socket.on("disconnect", () => {
            console.log(`[socket.io] disconnected: ${userId} (${socket.id})`);
        });
    });

    // Make io accessible to API routes via global
    (global as unknown as Record<string, unknown>).io = io;

    const PORT = parseInt(process.env.PORT || "3000", 10);
    httpServer.listen(PORT, () => {
        console.log(`> Ready on http://localhost:${PORT}`);
        console.log(`> Socket.io listening on /api/socket`);
    });
});
