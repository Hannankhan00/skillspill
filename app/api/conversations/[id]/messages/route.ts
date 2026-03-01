import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
            include: { sender: { select: { id: true, fullName: true, username: true } } },
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
        const { content } = await req.json();
        if (!content?.trim()) return NextResponse.json({ error: "Content required" }, { status: 400 });

        const convo = await prisma.conversation.findUnique({ where: { id } });
        if (!convo || (convo.userAId !== session.userId && convo.userBId !== session.userId)) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        const message = await prisma.message.create({
            data: { conversationId: id, senderId: session.userId, content: content.trim() },
            include: { sender: { select: { id: true, fullName: true, username: true } } },
        });

        // Update conversation's lastMessage + lastAt
        await prisma.conversation.update({
            where: { id },
            data: { lastMessage: content.trim(), lastAt: new Date() },
        });

        return NextResponse.json({ message });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
