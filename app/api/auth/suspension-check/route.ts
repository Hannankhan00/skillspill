import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Lightweight endpoint used by middleware to check suspension status
export async function GET() {
    try {
        const session = await getSession();

        if (!session) {
            return NextResponse.json({ suspended: false }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.userId },
            select: { isActive: true },
        });

        if (!user) {
            return NextResponse.json({ suspended: false }, { status: 404 });
        }

        return NextResponse.json({ suspended: !user.isActive });
    } catch (error) {
        console.error("Suspension Check Error:", error);
        // On error, allow access (don't lock users out due to errors)
        return NextResponse.json({ suspended: false }, { status: 500 });
    }
}
