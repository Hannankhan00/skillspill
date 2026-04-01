import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// ─── PATCH /api/admin/reports/[id] — Update report status ───
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        if (!session || session.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { id } = await params;
        const { status } = await req.json();

        if (!status || !["PENDING", "RESOLVED", "DISMISSED"].includes(status)) {
            return NextResponse.json({ error: "Invalid status" }, { status: 400 });
        }

        const report = await prisma.report.update({
            where: { id },
            data: { status },
        });

        return NextResponse.json({ report });
    } catch (error) {
        console.error("Update report error:", error);
        return NextResponse.json({ error: "Failed to update report" }, { status: 500 });
    }
}
