import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const [talentCount, recruiterCount] = await Promise.all([
            prisma.user.count({ where: { role: "TALENT", isActive: true } }),
            prisma.user.count({ where: { role: "RECRUITER", isActive: true } }),
        ]);

        return NextResponse.json({ talentCount, recruiterCount });
    } catch {
        return NextResponse.json({ talentCount: 0, recruiterCount: 0 }, { status: 500 });
    }
}
