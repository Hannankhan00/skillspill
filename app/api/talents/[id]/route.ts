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
                spillPosts: {
                    where: { status: "published" },
                    orderBy: { createdAt: "desc" },
                    select: {
                        id: true,
                        caption: true,
                        code: true,
                        codeLang: true,
                        hashtags: true,
                        postType: true,
                        likesCount: true,
                        commentsCount: true,
                        repostsCount: true,
                        viewsCount: true,
                        createdAt: true,
                    }
                },
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
                        contactEmail: true,
                        contactPhone: true,
                        showEmail: true,
                        showPhone: true,
                        showSocials: true,
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
                        },
                        workExperience: {
                            orderBy: [{ isCurrent: "desc" }, { startDate: "desc" }],
                            select: {
                                id: true,
                                companyName: true,
                                role: true,
                                startDate: true,
                                endDate: true,
                                isCurrent: true,
                                description: true,
                            }
                        }
                    }
                },
                followers: {
                    where: { followerId: session.userId },
                    select: { id: true }
                }
            }
        });

        if (!talent) {
            return NextResponse.json({ error: "Talent not found" }, { status: 404 });
        }

        const talentAny = talent as any;
        const isFollowing = talentAny.followers && talentAny.followers.length > 0;
        const formattedTalent = { ...talentAny, isFollowing, followers: undefined };

        return NextResponse.json({ talent: formattedTalent });
    } catch (error) {
        console.error("Error fetching talent:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
