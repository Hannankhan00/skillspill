import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

// User submits an appeal for their suspended account
export async function POST(req: NextRequest) {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { reason } = body;

        if (!reason || typeof reason !== "string" || reason.trim().length === 0) {
            return NextResponse.json(
                { error: "Appeal reason is required" },
                { status: 400 }
            );
        }

        if (reason.trim().length < 20) {
            return NextResponse.json(
                { error: "Please provide a more detailed appeal reason (at least 20 characters)" },
                { status: 400 }
            );
        }

        // Check if user is actually suspended
        const user = await prisma.user.findUnique({
            where: { id: session.userId },
            select: { isActive: true },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (user.isActive) {
            return NextResponse.json(
                { error: "Your account is not suspended" },
                { status: 400 }
            );
        }

        // Check if there's already a pending appeal
        const existingPending = await prisma.appeal.findFirst({
            where: {
                userId: session.userId,
                status: "PENDING",
            },
        });

        if (existingPending) {
            return NextResponse.json(
                { error: "You already have a pending appeal. Please wait for it to be reviewed." },
                { status: 400 }
            );
        }

        // Create the appeal
        const appeal = await prisma.appeal.create({
            data: {
                userId: session.userId,
                reason: reason.trim(),
                status: "PENDING",
            },
        });

        return NextResponse.json({ success: true, appeal }, { status: 201 });
    } catch (error) {
        console.error("Submit Appeal Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
