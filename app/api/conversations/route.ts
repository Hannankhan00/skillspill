import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/conversations — list all conversations for the current user
export async function GET() {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const convos = await prisma.conversation.findMany({
            where: {
                OR: [
                    { userAId: session.userId },
                    { userBId: session.userId },
                ],
            },
            include: {
                userA: { select: { id: true, fullName: true, username: true, role: true, avatarUrl: true } },
                userB: { select: { id: true, fullName: true, username: true, role: true, avatarUrl: true } },
                messages: {
                    orderBy: { createdAt: "desc" },
                    take: 1,
                    select: { content: true, createdAt: true, senderId: true, isRead: true },
                },
            },
            orderBy: { lastAt: "desc" },
        });

        // Get unread counts for each conversation in one query
        const unreadCounts = await prisma.message.groupBy({
            by: ["conversationId"],
            where: {
                conversation: {
                    OR: [
                        { userAId: session.userId },
                        { userBId: session.userId },
                    ],
                },
                senderId: { not: session.userId },
                isRead: false,
            },
            _count: { id: true },
        });

        const unreadMap = new Map(unreadCounts.map(u => [u.conversationId, u._count.id]));

        // Normalize: "other" user is whichever is not the current user
        const result = convos.map(c => {
            const other = c.userAId === session.userId ? c.userB : c.userA;
            const lastMsg = c.messages[0] ?? null;
            const unread = unreadMap.get(c.id) ?? 0;
            return {
                id: c.id,
                other,
                lastMessage: lastMsg?.content ?? null,
                lastAt: lastMsg?.createdAt ?? c.createdAt,
                lastSenderId: lastMsg?.senderId ?? null,
                lastIsRead: lastMsg?.isRead ?? false,
                unread,
            };
        });

        return NextResponse.json({ conversations: result });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

// POST /api/conversations — get or create conversation with another user
export async function POST(req: Request) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { targetUserId } = await req.json();
        if (!targetUserId) return NextResponse.json({ error: "targetUserId required" }, { status: 400 });
        if (targetUserId === session.userId) return NextResponse.json({ error: "Cannot message yourself" }, { status: 400 });

        // Ensure stable ordering (userAId < userBId alphabetically)
        const [userAId, userBId] = [session.userId, targetUserId].sort();

        const convo = await prisma.conversation.upsert({
            where: { userAId_userBId: { userAId, userBId } },
            create: { userAId, userBId },
            update: {},
            include: {
                userA: { select: { id: true, fullName: true, username: true, role: true, avatarUrl: true } },
                userB: { select: { id: true, fullName: true, username: true, role: true, avatarUrl: true } },
            },
        });

        return NextResponse.json({ conversation: convo });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
