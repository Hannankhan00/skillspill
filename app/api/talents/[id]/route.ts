import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getSession();
        // Allow recruiters and admins to query talents
        if (!session || (session.role !== "RECRUITER" && session.role !== "ADMIN")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const resolvedParams = await params;
        const talentId = resolvedParams.id;

        const talent = await prisma.user.findUnique({
            where: {
                id: talentId,
                role: "TALENT",
            },
            select: {
                id: true,
                fullName: true,
                username: true,
                email: true,
                talentProfile: {
                    select: {
                        bio: true,
                        experienceLevel: true,
                        portfolioUrl: true,
                        linkedinUrl: true,
                        resumeUrl: true,
                        githubUsername: true,
                        githubConnected: true,
                        githubRepos: true,
                        githubStars: true,
                        isAvailable: true,
                        skills: {
                            select: {
                                skillName: true,
                                isVerified: true,
                            }
                        },
                        projectLinks: {
                            select: {
                                title: true,
                                url: true,
                                description: true,
                            }
                        }
                    }
                }
            }
        });

        if (!talent) {
            return NextResponse.json({ error: "Talent not found" }, { status: 404 });
        }

        return NextResponse.json({ talent });
    } catch (error) {
        console.error("Error fetching talent:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
