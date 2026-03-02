import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET — list all work experience for the logged-in talent
export async function GET() {
    const session = await getSession();
    if (!session || session.role !== "TALENT") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const profile = await prisma.talentProfile.findUnique({
        where: { userId: session.userId },
        select: { id: true, workExperience: { orderBy: [{ isCurrent: "desc" }, { startDate: "desc" }] } },
    });

    return NextResponse.json({ workExperience: profile?.workExperience ?? [] });
}

// POST — add a new work experience entry
export async function POST(req: Request) {
    const session = await getSession();
    if (!session || session.role !== "TALENT") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { companyName, role, startDate, endDate, isCurrent, description } = await req.json();
    if (!companyName || !role || !startDate) {
        return NextResponse.json({ error: "Company, role and start date are required" }, { status: 400 });
    }

    // Ensure profile exists
    const profile = await prisma.talentProfile.upsert({
        where: { userId: session.userId },
        create: { userId: session.userId },
        update: {},
        select: { id: true },
    });

    // If isCurrent, clear any other isCurrent flags
    if (isCurrent) {
        await prisma.talentWorkExperience.updateMany({
            where: { talentProfileId: profile.id, isCurrent: true },
            data: { isCurrent: false },
        });
    }

    const entry = await prisma.talentWorkExperience.create({
        data: {
            talentProfileId: profile.id,
            companyName: companyName.trim(),
            role: role.trim(),
            startDate: new Date(startDate),
            endDate: isCurrent ? null : (endDate ? new Date(endDate) : null),
            isCurrent: isCurrent ?? false,
            description: description?.trim() || null,
        },
    });

    return NextResponse.json({ entry });
}
