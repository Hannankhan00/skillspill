const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const httpServer = createServer((req, res) => {
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
    });

    const io = new Server(httpServer, {
        cors: { origin: "*", methods: ["GET", "POST"] },
        // Allow socket.io to co-exist with Next.js on the same port
        path: "/socket.io",
    });

    io.on("connection", (socket) => {
        // ── Identify user ───────────────────────────────────────────────────────
        socket.on("identify", (userId) => {
            socket.data.userId = userId;
            // Join a personal room so we can send events to a specific user
            socket.join(`user:${userId}`);
        });

        // ── Join / leave conversation rooms ────────────────────────────────────
        socket.on("join-conversation", (conversationId) => {
            socket.join(`convo:${conversationId}`);
        });

        socket.on("leave-conversation", (conversationId) => {
            socket.leave(`convo:${conversationId}`);
        });

        // ── New message — broadcast to the other participants in the room ───────
        // Client sends this AFTER persisting the message via the REST API.
        // Payload: { conversationId: string, message: Message, recipientId: string }
        socket.on("new-message", ({ conversationId, message, recipientId }) => {
            if (!conversationId || !message) return;
            // Broadcast to everyone in the conversation room except the sender
            socket.to(`convo:${conversationId}`).emit("message", message);
            // Also deliver to the recipient's personal room — this ensures delivery
            // even when the recipient hasn't opened this specific conversation yet.
            if (recipientId) {
                socket.to(`user:${recipientId}`).emit("message", message);
            }
        });

        // ── Read receipt — notify the original sender ───────────────────────────
        // Payload: { conversationId: string, readIds: string[] }
        socket.on("read-receipt", ({ conversationId, readIds }) => {
            if (!conversationId || !readIds?.length) return;
            socket.to(`convo:${conversationId}`).emit("read-receipt", { readIds });
        });

        // ── Typing indicator ────────────────────────────────────────────────────
        // Payload: { conversationId: string, isTyping: boolean }
        socket.on("typing", ({ conversationId, isTyping }) => {
            if (!conversationId) return;
            socket.to(`convo:${conversationId}`).emit("typing", {
                userId: socket.data.userId,
                isTyping,
            });
        });

        socket.on("disconnect", () => {
            // Cleanup is automatic — socket.io removes rooms on disconnect
        });
    });

    httpServer
        .once("error", (err) => {
            console.error(err);
            process.exit(1);
        })
        .listen(port, () => {
            console.log(`> Ready on http://${hostname}:${port}`);
        });
});
