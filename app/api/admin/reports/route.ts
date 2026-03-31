import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session || session.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const reports = await prisma.report.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                reporter: {
                    select: { id: true, fullName: true, email: true, role: true }
                }
            }
        });

        return NextResponse.json({ reports }, { status: 200 });
    } catch (error) {
        console.error("Fetch reports error:", error);
        return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 });
    }
}
