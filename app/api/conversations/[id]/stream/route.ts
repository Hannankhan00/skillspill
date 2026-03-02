import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // Vercel Pro: 60s, Hobby: 10s (configurable)

// GET /api/conversations/[id]/stream
// Server-Sent Events — long-poll with a hard timeout so Vercel serverless can handle it.
// The client EventSource automatically reconnects when the timeout closes the connection.
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

            // Hard time limit: poll for up to 55 seconds then close.
            // EventSource on the client auto-reconnects immediately.
            // This makes it fully compatible with Vercel serverless (both Hobby and Pro).
            const POLL_INTERVAL_MS = 1500;
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
                    const where = lastSeenId
                        ? { conversationId, id: { gt: lastSeenId } }
                        : { conversationId };

                    const newMessages = await prisma.message.findMany({
                        where,
                        orderBy: { createdAt: "asc" },
                        include: {
                            sender: { select: { id: true, fullName: true, username: true } },
                        },
                    });

                    if (newMessages.length > 0) {
                        // Mark other person's messages as read
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
                } catch {
                    // DB error — close so client reconnects
                    isAborted = true;
                    break;
                }

                if (!isAborted) {
                    await new Promise<void>(resolve => {
                        const t = setTimeout(resolve, POLL_INTERVAL_MS);
                        // Cancel sleep early if request is aborted
                        req.signal.addEventListener("abort", () => {
                            clearTimeout(t);
                            resolve();
                        }, { once: true });
                    });
                }
            }

            // Send reconnect hint before closing so client knows to reconnect with updated afterId
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
