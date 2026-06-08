import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notify } from "@/lib/notify";

export const dynamic = "force-dynamic";

// GET /api/recruiter/applications — all applications across recruiter's jobs
export async function GET(req: Request) {
    try {
        const session = await getSession();
        if (!session || session.role !== "RECRUITER") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const statusFilter = searchParams.get("status"); // PENDING | REVIEWED | SHORTLISTED | REJECTED | ACCEPTED

        const recruiterProfile = await prisma.recruiterProfile.findUnique({
            where: { userId: session.userId },
            select: { id: true },
        });
        if (!recruiterProfile) {
            return NextResponse.json({ applications: [] });
        }

        const where: any = {
            bounty: { recruiterProfileId: recruiterProfile.id },
        };
        if (statusFilter) where.status = statusFilter;

        const applications = await prisma.bountyApplication.findMany({
            where,
            orderBy: { appliedAt: "desc" },
            include: {
                bounty: {
                    select: { id: true, title: true, reward: true, currency: true },
                },
                talentProfile: {
                    select: {
                        experienceLevel: true,
                        githubScore: true,
                        skills: { select: { skillName: true }, take: 4 },
                        user: {
                            select: {
                                id: true,
                                fullName: true,
                                username: true,
                                avatarUrl: true,
                            },
                        },
                    },
                },
            },
        });

        return NextResponse.json({ applications });
    } catch (error) {
        console.error("GET /api/recruiter/applications error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// PATCH /api/recruiter/applications — update application status
// body: { applicationId, status }
export async function PATCH(req: Request) {
    try {
        const session = await getSession();
        if (!session || session.role !== "RECRUITER") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const recruiterProfile = await prisma.recruiterProfile.findUnique({
            where: { userId: session.userId },
            select: { id: true },
        });
        if (!recruiterProfile) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        const { applicationId, status } = await req.json();
        const validStatuses = ["PENDING", "REVIEWED", "SHORTLISTED", "REJECTED", "ACCEPTED"];
        if (!applicationId || !status || !validStatuses.includes(status)) {
            return NextResponse.json({ error: "Invalid request" }, { status: 400 });
        }

        // Verify ownership
        const app = await prisma.bountyApplication.findUnique({
            where: { id: applicationId },
            include: { bounty: { select: { recruiterProfileId: true, id: true, title: true } } },
        });
        if (!app || app.bounty.recruiterProfileId !== recruiterProfile.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const updated = await prisma.bountyApplication.update({
            where: { id: applicationId },
            data: { status, reviewedAt: status !== "PENDING" ? new Date() : null },
            include: { talentProfile: { select: { userId: true } } },
        });

        const statusMessages: Record<string, string> = {
            REVIEWED: "Your application is under review.",
            SHORTLISTED: "Great news — you've been shortlisted!",
            ACCEPTED: "Congratulations! Your application was accepted.",
            REJECTED: "Your application was not selected this time.",
        };
        if (statusMessages[status] && updated.talentProfile?.userId) {
            notify({
                userId: updated.talentProfile.userId,
                title: `Application ${status.charAt(0) + status.slice(1).toLowerCase()}`,
                message: `${statusMessages[status]} — "${app.bounty.title}"`,
                type: status === "ACCEPTED" ? "match" : status === "REJECTED" ? "alert" : "application",
                link: `/talent/jobs/${app.bounty.id}`,
            });
        }

        return NextResponse.json({ application: updated });
    } catch (error) {
        console.error("PATCH /api/recruiter/applications error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
