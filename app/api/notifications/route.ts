import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET /api/notifications
// ?countOnly=true  → { unreadCount }
// otherwise        → { notifications, unreadCount }
export async function GET(req: Request) {
    try {
        const session = await getSession();
        if (!session?.userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const countOnly = searchParams.get("countOnly") === "true";

        const unreadCount = await prisma.notification.count({
            where: { userId: session.userId, isRead: false, deletedAt: null },
        });

        if (countOnly) {
            return NextResponse.json({ unreadCount });
        }

        const notifications = await prisma.notification.findMany({
            where: { userId: session.userId, deletedAt: null },
            orderBy: { createdAt: "desc" },
            take: 50,
        });

        return NextResponse.json({ notifications, unreadCount });
    } catch (error) {
        console.error("GET /api/notifications error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// PATCH /api/notifications — mark all as read
export async function PATCH() {
    try {
        const session = await getSession();
        if (!session?.userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await prisma.notification.updateMany({
            where: { userId: session.userId, isRead: false, deletedAt: null },
            data: { isRead: true, readAt: new Date() },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("PATCH /api/notifications error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
