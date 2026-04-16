import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/jobs
// Talent: paginated list of OPEN jobs
// Recruiter: their own job postings
export async function GET(req: Request) {
    try {
        const session = await getSession();
        if (!session || !session.userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const cursor = searchParams.get("cursor");
        const limit = Math.min(Number(searchParams.get("limit") || "20"), 50);
        const search = searchParams.get("search") || "";
        const isRemote = searchParams.get("remote"); // "true" | "false" | null
        const skills = searchParams.get("skills"); // comma-separated
        const status = searchParams.get("status"); // OPEN | IN_PROGRESS | COMPLETED | CANCELLED

        if (session.role === "RECRUITER") {
            // Return recruiter's own jobs
            const recruiterProfile = await prisma.recruiterProfile.findUnique({
                where: { userId: session.userId },
                select: { id: true },
            });
            if (!recruiterProfile) {
                return NextResponse.json({ jobs: [], hasMore: false });
            }

            const where: any = { recruiterProfileId: recruiterProfile.id };
            if (status) where.status = status;
            if (search) {
                where.OR = [
                    { title: { contains: search } },
                    { description: { contains: search } },
                ];
            }

            const jobs = await prisma.bounty.findMany({
                where,
                orderBy: { createdAt: "desc" },
                take: limit + 1,
                ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
                include: {
                    skills: true,
                    _count: { select: { applications: true } },
                },
            });

            const hasMore = jobs.length > limit;
            const items = hasMore ? jobs.slice(0, limit) : jobs;
            return NextResponse.json({
                jobs: items,
                hasMore,
                nextCursor: hasMore ? items[items.length - 1].id : null,
            });
        }

        // Talent: browse OPEN jobs
        const where: any = { status: "OPEN" };
        if (search) {
            where.OR = [
                { title: { contains: search } },
                { description: { contains: search } },
                { skills: { some: { skillName: { contains: search } } } },
            ];
        }
        if (isRemote === "true") where.isRemote = true;
        if (isRemote === "false") where.isRemote = false;
        if (skills) {
            const skillList = skills.split(",").map(s => s.trim()).filter(Boolean);
            if (skillList.length > 0) {
                where.skills = { some: { skillName: { in: skillList } } };
            }
        }

        const jobs = await prisma.bounty.findMany({
            where,
            orderBy: { createdAt: "desc" },
            take: limit + 1,
            ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
            include: {
                skills: true,
                _count: { select: { applications: true } },
                recruiterProfile: {
                    select: {
                        companyName: true,
                        companySize: true,
                        user: { select: { avatarUrl: true, fullName: true } },
                    },
                },
            },
        });

        // Check if current talent has applied to any of these
        let appliedIds: Set<string> = new Set();
        if (session.role === "TALENT") {
            const tp = await prisma.talentProfile.findUnique({
                where: { userId: session.userId },
                select: { id: true },
            });
            if (tp) {
                const applications = await prisma.bountyApplication.findMany({
                    where: {
                        talentProfileId: tp.id,
                        bountyId: { in: jobs.map(j => j.id) },
                    },
                    select: { bountyId: true },
                });
                appliedIds = new Set(applications.map(a => a.bountyId));
            }
        }

        const hasMore = jobs.length > limit;
        const items = hasMore ? jobs.slice(0, limit) : jobs;
        return NextResponse.json({
            jobs: items.map(j => ({ ...j, hasApplied: appliedIds.has(j.id) })),
            hasMore,
            nextCursor: hasMore ? items[items.length - 1].id : null,
        });
    } catch (error) {
        console.error("GET /api/jobs error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// POST /api/jobs — recruiter creates a job
export async function POST(req: Request) {
    try {
        const session = await getSession();
        if (!session || !session.userId || session.role !== "RECRUITER") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const recruiterProfile = await prisma.recruiterProfile.findUnique({
            where: { userId: session.userId },
            select: { id: true },
        });
        if (!recruiterProfile) {
            return NextResponse.json({ error: "Recruiter profile not found" }, { status: 404 });
        }

        const body = await req.json();
        const { title, description, requirements, reward, currency, deadline, maxApplicants, isRemote, location, skills } = body;

        if (!title?.trim() || !description?.trim()) {
            return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
        }

        const job = await prisma.bounty.create({
            data: {
                recruiterProfileId: recruiterProfile.id,
                title: title.trim(),
                description: description.trim(),
                requirements: requirements?.trim() || null,
                reward: reward ? Number(reward) : null,
                currency: currency || "USD",
                status: "OPEN",
                deadline: deadline ? new Date(deadline) : null,
                maxApplicants: maxApplicants ? Number(maxApplicants) : null,
                isRemote: Boolean(isRemote ?? true),
                location: location?.trim() || null,
                skills: Array.isArray(skills) && skills.length > 0 ? {
                    create: skills
                        .map((s: string) => s.trim())
                        .filter(Boolean)
                        .map((skillName: string) => ({ skillName })),
                } : undefined,
            },
            include: {
                skills: true,
                _count: { select: { applications: true } },
            },
        });

        return NextResponse.json({ job }, { status: 201 });
    } catch (error) {
        console.error("POST /api/jobs error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
