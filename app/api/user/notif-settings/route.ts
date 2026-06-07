import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const DEFAULTS = {
    newApplications: true,
    spillInteractions: true,
    jobUpdates: true,
    emailNotifications: true,
};

export async function GET() {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: { notifSettings: true },
    });

    const settings = user?.notifSettings ? JSON.parse(user.notifSettings) : DEFAULTS;
    return NextResponse.json({ settings: { ...DEFAULTS, ...settings } });
}

export async function POST(req: NextRequest) {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const allowed = ["newApplications", "spillInteractions", "jobUpdates", "emailNotifications"];
    const patch: Record<string, boolean> = {};
    for (const key of allowed) {
        if (typeof body[key] === "boolean") patch[key] = body[key];
    }

    const user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: { notifSettings: true },
    });
    const current = user?.notifSettings ? JSON.parse(user.notifSettings) : DEFAULTS;
    const merged = { ...DEFAULTS, ...current, ...patch };

    await prisma.user.update({
        where: { id: session.userId },
        data: { notifSettings: JSON.stringify(merged) },
    });

    return NextResponse.json({ success: true, settings: merged });
}
