import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// GET /api/conversations/[id]/stream
// Server-Sent Events — long-poll with a hard timeout so Vercel serverless can handle it.
// Poll interval: 800ms (down from 1500ms) for near-instant feel.
// Also emits `read` events when the other user reads your messages.
export async function GET(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    const session = await getSession();
    if (!session) return new Response("Unauthorized", { status: 401 });

    const { id: conversationId } = await context.params;

    const convo = await prisma.conversation.findUnique({ where: { id: conversationId } });
    if (!convo || (convo.userAId !== session.userId && convo.userBId !== session.userId)) {
        return new Response("Not found", { status: 404 });
    }

    const url = new URL(req.url);
    const afterId = url.searchParams.get("afterId");

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
        async start(controller) {
            const send = (event: string, data: unknown) => {
                try {
                    controller.enqueue(
                        encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
                    );
                } catch { /* client disconnected */ }
            };

            send("connected", { conversationId });

            const POLL_INTERVAL_MS = 800;     // Fast — WhatsApp-like feel
            const MAX_DURATION_MS = 55_000;
            const started = Date.now();

            let lastSeenId = afterId ?? null;
            let isAborted = false;

            req.signal.addEventListener("abort", () => {
                isAborted = true;
                try { controller.close(); } catch { /* already closed */ }
            });

            while (!isAborted && Date.now() - started < MAX_DURATION_MS) {
                try {
                    // ── 1. Push new messages from either user ──────────────────
                    const where = lastSeenId
                        ? { conversationId, id: { gt: lastSeenId } }
                        : { conversationId };

                    const newMessages = await prisma.message.findMany({
                        where,
                        orderBy: { createdAt: "asc" },
                        include: {
                            sender: { select: { id: true, fullName: true, username: true, avatarUrl: true } },
                        },
                    });

                    if (newMessages.length > 0) {
                        // Mark other person's messages as read (we are the viewer)
                        type MsgRow = { id: string; senderId: string; isRead: boolean };
                        const unreadIds: string[] = (newMessages as MsgRow[])
                            .filter(msg => msg.senderId !== session.userId && !msg.isRead)
                            .map(msg => msg.id);

                        if (unreadIds.length) {
                            await prisma.message.updateMany({
                                where: { id: { in: unreadIds } },
                                data: { isRead: true },
                            });
                        }

                        send("messages", newMessages);
                        lastSeenId = newMessages[newMessages.length - 1].id;
                    }

                    // ── 2. Check if OUR messages got read by the other user ──
                    // Find any of OUR sent messages that just became isRead=true.
                    // We can't track "what changed" without extra state, so we just
                    // emit the IDs of all our read messages so the client can update ticks.
                    const myReadMsgs = await prisma.message.findMany({
                        where: { conversationId, senderId: session.userId, isRead: true },
                        select: { id: true },
                        orderBy: { createdAt: "asc" },
                    });
                    if (myReadMsgs.length > 0) {
                        send("read_receipts", { readIds: myReadMsgs.map(m => m.id) });
                    }

                } catch {
                    isAborted = true;
                    break;
                }

                if (!isAborted) {
                    await new Promise<void>(resolve => {
                        const t = setTimeout(resolve, POLL_INTERVAL_MS);
                        req.signal.addEventListener("abort", () => {
                            clearTimeout(t);
                            resolve();
                        }, { once: true });
                    });
                }
            }

            if (!isAborted) {
                send("reconnect", { lastSeenId });
            }

            try { controller.close(); } catch { /* already closed */ }
        },
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream; charset=utf-8",
            "Cache-Control": "no-cache, no-transform",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    });
}
