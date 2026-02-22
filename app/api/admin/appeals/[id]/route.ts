import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();

        if (!session || session.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const { id } = await params;
        const body = await req.json();

        const { status, adminResponse } = body;

        if (!status || !["APPROVED", "REJECTED"].includes(status)) {
            return NextResponse.json(
                { error: "Status must be APPROVED or REJECTED" },
                { status: 400 }
            );
        }

        const appeal = await prisma.appeal.findUnique({
            where: { id },
        });

        if (!appeal) {
            return NextResponse.json({ error: "Appeal not found" }, { status: 404 });
        }

        const updatedAppeal = await prisma.appeal.update({
            where: { id },
            data: {
                status,
                adminResponse: adminResponse || null,
                reviewedAt: new Date(),
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        username: true,
                        fullName: true,
                        role: true,
                        isActive: true,
                    },
                },
            },
        });

        // If appeal is approved, re-enable the user account
        if (status === "APPROVED") {
            await prisma.user.update({
                where: { id: appeal.userId },
                data: { isActive: true },
            });
        }

        return NextResponse.json({ success: true, appeal: updatedAppeal });
    } catch (error) {
        console.error("Admin Update Appeal Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
