import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const incidents = await prisma.statusIncident.findMany({
        include: { updates: { orderBy: { createdAt: "desc" } } },
        orderBy: { createdAt: "desc" },
        take: 50,
    });
    return NextResponse.json({ incidents });
}

export async function POST(req: NextRequest) {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const { title, description, severity, affectedServices } = await req.json();
    if (!title || !description) return NextResponse.json({ error: "Title and description required" }, { status: 400 });

    const incident = await prisma.statusIncident.create({
        data: {
            title,
            description,
            severity: severity || "minor",
            status: "investigating",
            affectedServices: affectedServices ? JSON.stringify(affectedServices) : null,
            updates: {
                create: {
                    message: description,
                    status: "investigating",
                },
            },
        },
        include: { updates: { orderBy: { createdAt: "desc" } } },
    });
    return NextResponse.json({ incident });
}
