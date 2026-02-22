import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Get suspension info for the currently logged-in user
export async function GET() {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.userId },
            select: {
                id: true,
                fullName: true,
                email: true,
                isActive: true,
                suspensionReason: true,
                appeals: {
                    orderBy: { createdAt: "desc" },
                    take: 5,
                    select: {
                        id: true,
                        reason: true,
                        status: true,
                        adminResponse: true,
                        createdAt: true,
                        reviewedAt: true,
                    },
                },
            },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ user });
    } catch (error) {
        console.error("Suspension Info Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
