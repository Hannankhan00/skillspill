import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/jobs/[id] — get single job detail
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getSession();
        if (!session || !session.userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        const job = await prisma.bounty.findUnique({
            where: { id },
            include: {
                skills: true,
                _count: { select: { applications: true } },
                recruiterProfile: {
                    select: {
                        companyName: true,
                        companyWebsite: true,
                        companySize: true,
                        city: true,
                        country: true,
                        bio: true,
                        user: { select: { avatarUrl: true, fullName: true } },
                    },
                },
            },
        });

        if (!job) {
            return NextResponse.json({ error: "Job not found" }, { status: 404 });
        }

        // Check if current talent has applied
        let hasApplied = false;
        let applicationStatus: string | null = null;
        if (session.role === "TALENT") {
            const tp = await prisma.talentProfile.findUnique({
                where: { userId: session.userId },
                select: { id: true },
            });
            if (tp) {
                const app = await prisma.bountyApplication.findUnique({
                    where: { bountyId_talentProfileId: { bountyId: id, talentProfileId: tp.id } },
                    select: { status: true },
                });
                if (app) {
                    hasApplied = true;
                    applicationStatus = app.status;
                }
            }
        }

        return NextResponse.json({ job: { ...job, hasApplied, applicationStatus } });
    } catch (error) {
        console.error("GET /api/jobs/[id] error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// PATCH /api/jobs/[id] — recruiter updates their job
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getSession();
        if (!session || !session.userId || session.role !== "RECRUITER") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const recruiterProfile = await prisma.recruiterProfile.findUnique({
            where: { userId: session.userId },
            select: { id: true },
        });
        if (!recruiterProfile) {
            return NextResponse.json({ error: "Recruiter profile not found" }, { status: 404 });
        }

        const existing = await prisma.bounty.findUnique({ where: { id }, select: { recruiterProfileId: true } });
        if (!existing || existing.recruiterProfileId !== recruiterProfile.id) {
            return NextResponse.json({ error: "Not found or forbidden" }, { status: 404 });
        }

        const body = await req.json();
        const { title, description, requirements, reward, currency, deadline, maxApplicants, isRemote, location, status, skills } = body;

        const job = await prisma.$transaction(async (tx) => {
            const updated = await tx.bounty.update({
                where: { id },
                data: {
                    ...(title !== undefined && { title: title.trim() }),
                    ...(description !== undefined && { description: description.trim() }),
                    ...(requirements !== undefined && { requirements: requirements?.trim() || null }),
                    ...(reward !== undefined && { reward: reward ? Number(reward) : null }),
                    ...(currency !== undefined && { currency }),
                    ...(deadline !== undefined && { deadline: deadline ? new Date(deadline) : null }),
                    ...(maxApplicants !== undefined && { maxApplicants: maxApplicants ? Number(maxApplicants) : null }),
                    ...(isRemote !== undefined && { isRemote: Boolean(isRemote) }),
                    ...(location !== undefined && { location: location?.trim() || null }),
                    ...(status !== undefined && { status }),
                },
            });

            if (Array.isArray(skills)) {
                await tx.bountySkill.deleteMany({ where: { bountyId: id } });
                if (skills.length > 0) {
                    await tx.bountySkill.createMany({
                        data: skills
                            .map((s: string) => s.trim())
                            .filter(Boolean)
                            .map((skillName: string) => ({ bountyId: id, skillName })),
                        skipDuplicates: true,
                    });
                }
            }
            return updated;
        });

        const full = await prisma.bounty.findUnique({
            where: { id },
            include: { skills: true, _count: { select: { applications: true } } },
        });

        return NextResponse.json({ job: full });
    } catch (error) {
        console.error("PATCH /api/jobs/[id] error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// DELETE /api/jobs/[id] — recruiter deletes their job
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getSession();
        if (!session || !session.userId || session.role !== "RECRUITER") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const recruiterProfile = await prisma.recruiterProfile.findUnique({
            where: { userId: session.userId },
            select: { id: true },
        });
        if (!recruiterProfile) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        const existing = await prisma.bounty.findUnique({ where: { id }, select: { recruiterProfileId: true } });
        if (!existing || existing.recruiterProfileId !== recruiterProfile.id) {
            return NextResponse.json({ error: "Not found or forbidden" }, { status: 404 });
        }

        await prisma.bounty.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE /api/jobs/[id] error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
