import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const services = await prisma.systemService.findMany({ orderBy: { name: "asc" } });
    return NextResponse.json({ services });
}

export async function PATCH(req: NextRequest) {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    const { id, status, uptime, latency } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const service = await prisma.systemService.update({
        where: { id },
        data: {
            ...(status !== undefined && { status }),
            ...(uptime !== undefined && { uptime: parseFloat(uptime) }),
            ...(latency !== undefined && { latency: parseInt(latency) }),
        },
    });
    return NextResponse.json({ service });
}
