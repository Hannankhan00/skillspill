import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const DEFAULT_SERVICES = [
    { name: "Platform", status: "operational", uptime: 100, latency: 0 },
    { name: "Database", status: "operational", uptime: 100, latency: 0 },
    { name: "Storage API", status: "operational", uptime: 100, latency: 0 },
    { name: "AI Matching", status: "operational", uptime: 100, latency: 0 },
    { name: "Auth Service", status: "operational", uptime: 100, latency: 0 },
];

async function ensureServices() {
    const count = await prisma.systemService.count();
    if (count === 0) {
        await prisma.systemService.createMany({ data: DEFAULT_SERVICES });
    }
}

export async function GET() {
    try {
        await ensureServices();

        const [services, activeIncidents, recentResolved] = await Promise.all([
            prisma.systemService.findMany({ orderBy: { name: "asc" } }),
            prisma.statusIncident.findMany({
                where: { status: { not: "resolved" } },
                include: { updates: { orderBy: { createdAt: "desc" }, take: 5 } },
                orderBy: { createdAt: "desc" },
            }),
            prisma.statusIncident.findMany({
                where: {
                    status: "resolved",
                    resolvedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
                },
                include: { updates: { orderBy: { createdAt: "desc" }, take: 3 } },
                orderBy: { resolvedAt: "desc" },
                take: 10,
            }),
        ]);

        const hasOutage = services.some((s) => s.status === "outage") || activeIncidents.some((i) => i.severity === "critical");
        const hasDegraded = services.some((s) => s.status === "degraded") || activeIncidents.some((i) => i.severity === "major");
        const overallStatus = hasOutage ? "outage" : hasDegraded ? "degraded" : "operational";

        return NextResponse.json({ overallStatus, services, activeIncidents, recentResolved });
    } catch (error) {
        console.error("Status API Error:", error);
        return NextResponse.json({ error: "Failed to fetch status" }, { status: 500 });
    }
}
