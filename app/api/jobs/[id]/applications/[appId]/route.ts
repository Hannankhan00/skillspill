import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notify } from "@/lib/notify";

// PATCH /api/jobs/[id]/applications/[appId] — recruiter updates application status
export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string; appId: string }> }
) {
    try {
        const session = await getSession();
        if (!session || !session.userId || session.role !== "RECRUITER") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id: bountyId, appId } = await params;

        const recruiterProfile = await prisma.recruiterProfile.findUnique({
            where: { userId: session.userId },
            select: { id: true },
        });
        if (!recruiterProfile) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        // Verify job belongs to recruiter
        const job = await prisma.bounty.findUnique({
            where: { id: bountyId },
            select: { recruiterProfileId: true },
        });
        if (!job || job.recruiterProfileId !== recruiterProfile.id) {
            return NextResponse.json({ error: "Not found or forbidden" }, { status: 404 });
        }

        const body = await req.json();
        const { status } = body;

        const validStatuses = ["PENDING", "REVIEWED", "SHORTLISTED", "REJECTED", "ACCEPTED"];
        if (!status || !validStatuses.includes(status)) {
            return NextResponse.json({ error: "Invalid status" }, { status: 400 });
        }

        const application = await prisma.bountyApplication.update({
            where: { id: appId },
            data: {
                status,
                reviewedAt: status !== "PENDING" ? new Date() : null,
            },
            include: {
                talentProfile: { select: { userId: true } },
                bounty: { select: { title: true } },
            },
        });

        // Notify talent of status change
        const statusMessages: Record<string, string> = {
            REVIEWED:    "Your application is under review.",
            SHORTLISTED: "Great news — you've been shortlisted!",
            ACCEPTED:    "Congratulations! Your application was accepted.",
            REJECTED:    "Your application was not selected this time.",
        };
        if (statusMessages[status] && application.talentProfile?.userId) {
            notify({
                userId: application.talentProfile.userId,
                title:  `Application ${status.charAt(0) + status.slice(1).toLowerCase()}`,
                message: `${statusMessages[status]} — "${application.bounty?.title}"`,
                type:   status === "ACCEPTED" ? "match" : status === "REJECTED" ? "alert" : "application",
                link:   `/talent/jobs/${bountyId}`,
            });
        }

        return NextResponse.json({ application });
    } catch (error) {
        console.error("PATCH /api/jobs/[id]/applications/[appId] error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
