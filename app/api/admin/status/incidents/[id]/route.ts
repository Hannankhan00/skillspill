import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const { status, updateMessage, severity, affectedServices } = await req.json();
    const { id } = params;

    const data: Record<string, unknown> = {};
    if (severity) data.severity = severity;
    if (affectedServices !== undefined) data.affectedServices = JSON.stringify(affectedServices);
    if (status) {
        data.status = status;
        if (status === "resolved") data.resolvedAt = new Date();
    }

    const updates = updateMessage
        ? { create: { message: updateMessage, status: status || "investigating" } }
        : undefined;

    const incident = await prisma.statusIncident.update({
        where: { id },
        data: { ...data, ...(updates && { updates }) },
        include: { updates: { orderBy: { createdAt: "desc" } } },
    });

    return NextResponse.json({ incident });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    await prisma.statusIncident.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
}
