import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// GET /api/conversations/[id]/stream
// Server-Sent Events stream — pushes new messages to the client as they arrive
export async function GET(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    const session = await getSession();
    if (!session) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { id: conversationId } = await context.params;

    // Verify the user belongs to this conversation
    const convo = await prisma.conversation.findUnique({ where: { id: conversationId } });
    if (!convo || (convo.userAId !== session.userId && convo.userBId !== session.userId)) {
        return new Response("Not found", { status: 404 });
    }

    // Get the lastId cursor from query param (client sends the ID of the last message it has)
    const url = new URL(req.url);
    const afterId = url.searchParams.get("afterId") ?? null;

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
        async start(controller) {

            // Helper to send an SSE event
            const send = (event: string, data: unknown) => {
                try {
                    controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
                } catch {
                    // connection closed
                }
            };

            // Send a heartbeat to confirm connection
            send("connected", { conversationId });

            let lastSeenId = afterId;
            let active = true;

            // Cleanup on client disconnect
            req.signal.addEventListener("abort", () => {
                active = false;
                try { controller.close(); } catch { /* already closed */ }
            });

            // Poll for new messages on the SERVER side — 1 DB query every 1.5s per open chat
            // Far more efficient than the client making full HTTP round-trips every 3s
            while (active) {
                try {
                    const where = lastSeenId
                        ? { conversationId, id: { gt: lastSeenId } }
                        : { conversationId };

                    const newMessages = await prisma.message.findMany({
                        where,
                        orderBy: { createdAt: "asc" },
                        include: { sender: { select: { id: true, fullName: true, username: true } } },
                    });

                    if (newMessages.length > 0) {
                        // Mark messages from the other person as read
                        const unreadIds = newMessages
                            .filter(m => m.senderId !== session.userId && !m.isRead)
                            .map(m => m.id);

                        if (unreadIds.length > 0) {
                            await prisma.message.updateMany({
                                where: { id: { in: unreadIds } },
                                data: { isRead: true },
                            });
                        }

                        send("messages", newMessages);
                        lastSeenId = newMessages[newMessages.length - 1].id;
                    }

                    // Wait 1.5 seconds before next check
                    await new Promise(r => setTimeout(r, 1500));
                } catch {
                    active = false;
                    try { controller.close(); } catch { /* ignore */ }
                    break;
                }
            }
        },
    });

    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache, no-transform",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    });
}
