import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notify } from "@/lib/notify";

// POST /api/jobs/[id]/apply — talent submits application
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getSession();
        if (!session || !session.userId || session.role !== "TALENT") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id: bountyId } = await params;

        const job = await prisma.bounty.findUnique({
            where: { id: bountyId },
            select: {
                id: true, title: true, status: true, maxApplicants: true,
                _count: { select: { applications: true } },
                recruiterProfile: { select: { userId: true } },
            },
        });

        if (!job) {
            return NextResponse.json({ error: "Job not found" }, { status: 404 });
        }
        if (job.status !== "OPEN") {
            return NextResponse.json({ error: "This job is no longer accepting applications" }, { status: 400 });
        }
        if (job.maxApplicants && job._count.applications >= job.maxApplicants) {
            return NextResponse.json({ error: "This job has reached its maximum number of applicants" }, { status: 400 });
        }

        const talentProfile = await prisma.talentProfile.findUnique({
            where: { userId: session.userId },
            select: { id: true },
        });
        if (!talentProfile) {
            return NextResponse.json({ error: "Talent profile not found" }, { status: 404 });
        }

        const { coverLetter, submissionUrl } = await req.json();

        // Check if already applied
        const existing = await prisma.bountyApplication.findUnique({
            where: { bountyId_talentProfileId: { bountyId, talentProfileId: talentProfile.id } },
        });
        if (existing) {
            return NextResponse.json({ error: "You have already applied to this job" }, { status: 409 });
        }

        const application = await prisma.bountyApplication.create({
            data: {
                bountyId,
                talentProfileId: talentProfile.id,
                coverLetter: coverLetter?.trim() || null,
                submissionUrl: submissionUrl?.trim() || null,
                status: "PENDING",
            },
        });

        // Notify talent that their application was submitted
        notify({
            userId: session.userId,
            title: "Application Submitted",
            message: `Your application for "${job.title}" has been submitted successfully.`,
            type: "application",
            link: `/talent/jobs/${bountyId}`,
        });

        // Notify recruiter of new applicant
        if (job.recruiterProfile?.userId) {
            const talentUser = await prisma.user.findUnique({
                where: { id: session.userId },
                select: { fullName: true },
            });
            notify({
                userId: job.recruiterProfile.userId,
                title: "New Application",
                message: `${talentUser?.fullName ?? "A candidate"} applied to your job "${job.title}".`,
                type: "application",
                link: `/recruiter/jobs`,
            });
        }

        return NextResponse.json({ application }, { status: 201 });
    } catch (error) {
        console.error("POST /api/jobs/[id]/apply error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// GET /api/jobs/[id]/apply — recruiter lists applications for their job
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getSession();
        if (!session || !session.userId || session.role !== "RECRUITER") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id: bountyId } = await params;

        const recruiterProfile = await prisma.recruiterProfile.findUnique({
            where: { userId: session.userId },
            select: { id: true },
        });
        if (!recruiterProfile) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        const job = await prisma.bounty.findUnique({
            where: { id: bountyId },
            select: { recruiterProfileId: true },
        });
        if (!job || job.recruiterProfileId !== recruiterProfile.id) {
            return NextResponse.json({ error: "Not found or forbidden" }, { status: 404 });
        }

        const applications = await prisma.bountyApplication.findMany({
            where: { bountyId },
            orderBy: { appliedAt: "desc" },
            include: {
                talentProfile: {
                    include: {
                        user: { select: { fullName: true, avatarUrl: true, email: true } },
                        skills: true,
                    },
                },
            },
        });

        return NextResponse.json({ applications });
    } catch (error) {
        console.error("GET /api/jobs/[id]/apply error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
