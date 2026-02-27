import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await getSession();
        if (!session || !session.userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.userId },
            include: {
                talentProfile: {
                    include: {
                        skills: true,
                        projectLinks: true,
                    }
                },
                recruiterProfile: {
                    include: {
                        industries: true,
                    }
                }
            }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ user });
    } catch (error) {
        console.error("Error fetching profile:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getSession();
        if (!session || !session.userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await req.json();

        // Exclude specific fields and nested objects from the top-level update
        const { id, role, passwordHash, createdAt, updatedAt, talentProfile, recruiterProfile, ...updateData } = data;

        // Start a transaction for user updates + profile-specific updates
        const result = await prisma.$transaction(async (tx) => {

            // 1. Update Core User Entity
            // Filter core user keys explicitly if needed, but for now we expect mapped inputs
            // We use 'email', 'fullName' provided directly on the top-level update object if changed
            const updatedUser = await tx.user.update({
                where: { id: session.userId },
                data: {
                    fullName: data.fullName,
                    email: data.email,
                }
            });

            // 2. Update Role-Specific Profiles
            if (session.role === "TALENT" && data.talentProfile) {
                // If there is an existing profile update it, otherwise create one
                await tx.talentProfile.upsert({
                    where: { userId: session.userId },
                    update: {
                        bio: data.talentProfile.bio,
                        // map other specific talent fields
                        portfolioUrl: data.talentProfile.portfolioUrl,
                        linkedinUrl: data.talentProfile.linkedinUrl,
                        githubUsername: data.talentProfile.githubUsername,
                    },
                    create: {
                        userId: session.userId,
                        bio: data.talentProfile.bio,
                        portfolioUrl: data.talentProfile.portfolioUrl,
                        linkedinUrl: data.talentProfile.linkedinUrl,
                        githubUsername: data.talentProfile.githubUsername,
                    }
                });
            } else if (session.role === "RECRUITER" && data.recruiterProfile) {
                await tx.recruiterProfile.upsert({
                    where: { userId: session.userId },
                    update: {
                        jobTitle: data.recruiterProfile.jobTitle,
                        companyName: data.recruiterProfile.companyName,
                        companyWebsite: data.recruiterProfile.companyWebsite,
                        companySize: data.recruiterProfile.companySize,
                        location: data.recruiterProfile.location,
                        country: data.recruiterProfile.country,
                        phone: data.recruiterProfile.phone,
                        bio: data.recruiterProfile.bio,
                    },
                    create: {
                        userId: session.userId,
                        companyName: data.recruiterProfile.companyName || "Unknown",
                        jobTitle: data.recruiterProfile.jobTitle,
                        companyWebsite: data.recruiterProfile.companyWebsite,
                        companySize: data.recruiterProfile.companySize,
                        location: data.recruiterProfile.location,
                        country: data.recruiterProfile.country,
                        phone: data.recruiterProfile.phone,
                        bio: data.recruiterProfile.bio,
                    }
                });
            }

            return updatedUser;
        });

        return NextResponse.json({ success: true, user: result });
    } catch (error) {
        console.error("Error updating profile:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
