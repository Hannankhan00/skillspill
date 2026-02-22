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

        // Prevent admin from deactivating themselves
        if (id === session.userId && body.isActive === false) {
            return NextResponse.json(
                { error: "Cannot deactivate your own account" },
                { status: 400 }
            );
        }

        const allowedFields: Record<string, unknown> = {};
        if (typeof body.isActive === "boolean") {
            allowedFields.isActive = body.isActive;
            if (body.isActive === false) {
                // Require suspension reason when disabling
                if (!body.suspensionReason || typeof body.suspensionReason !== "string" || body.suspensionReason.trim().length === 0) {
                    return NextResponse.json(
                        { error: "Suspension reason is required when disabling a user" },
                        { status: 400 }
                    );
                }
                allowedFields.suspensionReason = body.suspensionReason.trim();
            } else {
                // Clear suspension reason when re-enabling
                allowedFields.suspensionReason = null;
            }
        }
        if (typeof body.role === "string" && ["ADMIN", "TALENT", "RECRUITER"].includes(body.role)) {
            // Prevent admin from demoting themselves
            if (id === session.userId && body.role !== "ADMIN") {
                return NextResponse.json(
                    { error: "Cannot change your own role" },
                    { status: 400 }
                );
            }
            allowedFields.role = body.role;
        }

        if (Object.keys(allowedFields).length === 0) {
            return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: allowedFields,
            select: {
                id: true,
                email: true,
                username: true,
                fullName: true,
                role: true,
                isActive: true,
            },
        });

        return NextResponse.json({ success: true, user: updatedUser });
    } catch (error) {
        console.error("Admin Update User Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
