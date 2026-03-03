import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// GET /api/recruiters/[id] — public recruiter profile (any logged-in user can view)
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { id } = await params;

        const recruiter = await prisma.user.findUnique({
            where: { id, role: "RECRUITER" },
            select: {
                id: true,
                fullName: true,
                username: true,
                email: true,
                createdAt: true,
                spills: {
                    where: { status: "published" },
                    orderBy: { createdAt: "desc" },
                    select: {
                        id: true,
                        content: true,
                        code: true,
                        codeLang: true,
                        tags: true,
                        likes: true,
                        comments: true,
                        shares: true,
                        views: true,
                        createdAt: true,
                    },
                },
                recruiterProfile: {
                    select: {
                        bio: true,
                        companyWebsite: true,
                        companySize: true,
                        addressLine1: true,
                        addressLine2: true,
                        city: true,
                        state: true,
                        postalCode: true,
                        country: true,
                        industries: { select: { industryName: true } },
                        bounties: {
                            where: { status: "OPEN" },
                            orderBy: { createdAt: "desc" },
                            select: {
                                id: true,
                                title: true,
                                description: true,
                                reward: true,
                                status: true,
                                createdAt: true,
                                skills: { select: { skillName: true } },
                            },
                        },
                    },
                },
            },
        });

        if (!recruiter) return NextResponse.json({ error: "Recruiter not found" }, { status: 404 });

        return NextResponse.json({ recruiter });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
