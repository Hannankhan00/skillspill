import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import pusher from "@/lib/pusher";

// GET /api/conversations/[id]/messages
export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { id } = await context.params;

        const convo = await prisma.conversation.findUnique({ where: { id } });
        if (!convo || (convo.userAId !== session.userId && convo.userBId !== session.userId)) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        const messages = await prisma.message.findMany({
            where: { conversationId: id },
            orderBy: { createdAt: "asc" },
            include: { sender: { select: { id: true, fullName: true, username: true, avatarUrl: true } } },
        });

        // Mark messages from other as read
        await prisma.message.updateMany({
            where: { conversationId: id, senderId: { not: session.userId }, isRead: false },
            data: { isRead: true },
        });

        return NextResponse.json({ messages });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

// POST /api/conversations/[id]/messages
export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { id } = await context.params;
        const { content, attachmentUrl, attachmentType } = await req.json();
        
        if (!content?.trim() && !attachmentUrl) {
            return NextResponse.json({ error: "Content or attachment required" }, { status: 400 });
        }

        const convo = await prisma.conversation.findUnique({ where: { id } });
        if (!convo || (convo.userAId !== session.userId && convo.userBId !== session.userId)) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        const message = await prisma.message.create({
            data: { 
                conversationId: id, 
                senderId: session.userId, 
                content: content?.trim() || "",
                attachmentUrl,
                attachmentType
            },
            include: { sender: { select: { id: true, fullName: true, username: true, avatarUrl: true } } },
        });

        // Update conversation's lastMessage + lastAt
        await prisma.conversation.update({
            where: { id },
            data: { lastMessage: content?.trim() || "Sent an attachment", lastAt: new Date() },
        });

        // Determine the recipient (the other participant in this conversation)
        const recipientId = convo.userAId === session.userId ? convo.userBId : convo.userAId;

        // Trigger real-time delivery via Pusher — fire-and-forget, never block the response.
        // Two channels:
        //   1. conversation channel  → updates the open chat window for the recipient
        //   2. personal user channel → notifies the recipient's sidebar (even if they haven't opened this chat)
        pusher.trigger(
            [`conversation-${id}`, `user-${recipientId}`],
            "new-message",
            message
        ).catch(() => {/* non-critical — client will see message on next fetch */});

        return NextResponse.json({ message });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
