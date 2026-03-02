import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PATCH — edit a work experience entry
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session || session.role !== "TALENT") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const { companyName, role, startDate, endDate, isCurrent, description } = await req.json();

    // Verify ownership via relation
    const existing = await prisma.talentWorkExperience.findUnique({
        where: { id },
        include: { talentProfile: { select: { userId: true } } },
    });
    if (!existing || existing.talentProfile.userId !== session.userId) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (isCurrent) {
        await prisma.talentWorkExperience.updateMany({
            where: { talentProfileId: existing.talentProfileId, isCurrent: true, id: { not: id } },
            data: { isCurrent: false },
        });
    }

    const updated = await prisma.talentWorkExperience.update({
        where: { id },
        data: {
            companyName: companyName?.trim(),
            role: role?.trim(),
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: isCurrent ? null : (endDate ? new Date(endDate) : null),
            isCurrent: isCurrent ?? existing.isCurrent,
            description: description?.trim() || null,
        },
    });

    return NextResponse.json({ entry: updated });
}

// DELETE — remove a work experience entry
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session || session.role !== "TALENT") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const existing = await prisma.talentWorkExperience.findUnique({
        where: { id },
        include: { talentProfile: { select: { userId: true } } },
    });
    if (!existing || existing.talentProfile.userId !== session.userId) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.talentWorkExperience.delete({ where: { id } });
    return NextResponse.json({ success: true });
}
