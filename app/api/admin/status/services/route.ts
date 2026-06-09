import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

const DEFAULT_SERVICES = [
    { name: "Platform",     status: "operational", uptime: 100, latency: 0 },
    { name: "Database",     status: "operational", uptime: 100, latency: 0 },
    { name: "Storage API",  status: "operational", uptime: 100, latency: 0 },
    { name: "AI Matching",  status: "operational", uptime: 100, latency: 0 },
    { name: "Auth Service", status: "operational", uptime: 100, latency: 0 },
];

async function ensureServices() {
    const count = await prisma.systemService.count();
    if (count === 0) await prisma.systemService.createMany({ data: DEFAULT_SERVICES });
}

export async function GET() {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

    await ensureServices();
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
