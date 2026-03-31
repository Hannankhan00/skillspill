import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { targetType, targetId, reason } = await req.json();

        if (!targetType || !targetId || !reason) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const report = await prisma.report.create({
            data: {
                reporterId: session.userId,
                targetType,
                targetId,
                reason,
            },
        });

        return NextResponse.json({ success: true, report }, { status: 201 });
    } catch (error) {
        console.error("Report Post error:", error);
        return NextResponse.json({ error: "Failed to submit report" }, { status: 500 });
    }
}
