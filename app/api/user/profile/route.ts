import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

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
                        workExperience: { orderBy: [{ isCurrent: "desc" }, { startDate: "desc" }] },
                    }
                },
                recruiterProfile: {
                    include: {
                        industries: true,
                        bounties: {
                            orderBy: { createdAt: "desc" },
                            include: { skills: true },
                            take: 20,
                        },
                    }
                },
                spills: {
                    orderBy: { createdAt: "desc" },
                    take: 20,
                },
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
        const { id, role, passwordHash, createdAt, updatedAt, talentProfile, recruiterProfile, githubId, ...updateData } = data;

        // Start a transaction for user updates + profile-specific updates
        const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {

            // 1. Update Core User Entity
            // Filter core user keys explicitly if needed, but for now we expect mapped inputs
            // We use 'email', 'fullName' provided directly on the top-level update object if changed
            const updatedUser = await tx.user.update({
                where: { id: session.userId },
                data: {
                    fullName: data.fullName,
                    email: data.email,
                    githubId: data.githubId !== undefined ? data.githubId : undefined,
                    avatarUrl: data.avatarUrl !== undefined ? data.avatarUrl : undefined,
                }
            });

            // 2. Update Role-Specific Profiles
            if (session.role === "TALENT" && data.talentProfile) {
                const tp = data.talentProfile;

                const profile = await tx.talentProfile.upsert({
                    where: { userId: session.userId },
                    update: {
                        bio: tp.bio !== undefined ? tp.bio : undefined,
                        experienceLevel: tp.experienceLevel !== undefined ? tp.experienceLevel : undefined,
                        isAvailable: tp.isAvailable !== undefined ? tp.isAvailable : undefined,
                        portfolioUrl: tp.portfolioUrl !== undefined ? tp.portfolioUrl : undefined,
                        linkedinUrl: tp.linkedinUrl !== undefined ? tp.linkedinUrl : undefined,
                        githubUsername: tp.githubUsername !== undefined ? tp.githubUsername : undefined,
                        githubConnected: tp.githubConnected !== undefined ? tp.githubConnected : undefined,
                        githubAccessToken: tp.githubAccessToken !== undefined ? tp.githubAccessToken : undefined,
                        sharePrivateRepos: tp.sharePrivateRepos !== undefined ? tp.sharePrivateRepos : undefined,
                        resumeUrl: tp.resumeUrl !== undefined ? tp.resumeUrl : undefined,
                        contactEmail: tp.contactEmail !== undefined ? tp.contactEmail : undefined,
                        contactPhone: tp.contactPhone !== undefined ? tp.contactPhone : undefined,
                        showEmail: tp.showEmail !== undefined ? tp.showEmail : undefined,
                        showPhone: tp.showPhone !== undefined ? tp.showPhone : undefined,
                        showSocials: tp.showSocials !== undefined ? tp.showSocials : undefined,
                    },
                    create: {
                        userId: session.userId,
                        bio: tp.bio,
                        experienceLevel: tp.experienceLevel,
                        isAvailable: tp.isAvailable ?? true,
                        portfolioUrl: tp.portfolioUrl,
                        linkedinUrl: tp.linkedinUrl,
                        githubUsername: tp.githubUsername,
                        githubConnected: tp.githubConnected ?? false,
                        githubAccessToken: tp.githubAccessToken,
                        sharePrivateRepos: tp.sharePrivateRepos ?? false,
                        resumeUrl: tp.resumeUrl,
                        contactEmail: tp.contactEmail,
                        contactPhone: tp.contactPhone,
                        showEmail: tp.showEmail ?? false,
                        showPhone: tp.showPhone ?? false,
                        showSocials: tp.showSocials ?? true,
                    },
                    select: { id: true },
                });

                // Replace skills if provided
                if (Array.isArray(tp.skills)) {
                    await tx.talentSkill.deleteMany({ where: { talentProfileId: profile.id } });
                    if (tp.skills.length > 0) {
                        await tx.talentSkill.createMany({
                            data: tp.skills.map((s: string) => ({
                                talentProfileId: profile.id,
                                skillName: s.trim(),
                            })),
                            skipDuplicates: true,
                        });
                    }
                }

                // Replace projectLinks if provided
                if (Array.isArray(tp.projectLinks)) {
                    await tx.talentProject.deleteMany({ where: { talentProfileId: profile.id } });
                    if (tp.projectLinks.length > 0) {
                        await tx.talentProject.createMany({
                            data: tp.projectLinks
                                .filter((p: any) => p.url?.trim())
                                .map((p: any) => ({
                                    talentProfileId: profile.id,
                                    url: p.url.trim(),
                                    title: p.title?.trim() || null,
                                    description: p.description?.trim() || null,
                                })),
                        });
                    }
                }
            } else if (session.role === "RECRUITER" && data.recruiterProfile) {
                await tx.recruiterProfile.upsert({
                    where: { userId: session.userId },
                    update: {
                        companyName: data.recruiterProfile.companyName,
                        companyWebsite: data.recruiterProfile.companyWebsite,
                        companySize: data.recruiterProfile.companySize,
                        addressLine1: data.recruiterProfile.addressLine1,
                        addressLine2: data.recruiterProfile.addressLine2,
                        city: data.recruiterProfile.city,
                        state: data.recruiterProfile.state,
                        postalCode: data.recruiterProfile.postalCode,
                        country: data.recruiterProfile.country,
                        phone: data.recruiterProfile.phone,
                        bio: data.recruiterProfile.bio,
                    },
                    create: {
                        userId: session.userId,
                        companyName: data.recruiterProfile.companyName || "Unknown",
                        companyWebsite: data.recruiterProfile.companyWebsite,
                        companySize: data.recruiterProfile.companySize,
                        addressLine1: data.recruiterProfile.addressLine1,
                        addressLine2: data.recruiterProfile.addressLine2,
                        city: data.recruiterProfile.city,
                        state: data.recruiterProfile.state,
                        postalCode: data.recruiterProfile.postalCode,
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

export async function DELETE() {
    try {
        const session = await getSession();
        if (!session || !session.userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Deleting the user should cascade delete their talentProfile, recruiterProfile, sessions, etc. based on schema cascade settings,
        // but if cascade is not fully configured, we may need to manually delete some dependent records first. 
        // Based on typical Prisma setups, let's try to delete the user directly (or cascade manually if needed).
        // Let's delete the user explicitly.

        await prisma.user.delete({
            where: { id: session.userId }
        });

        return NextResponse.json({ success: true, message: "Account deleted successfully" });
    } catch (error) {
        console.error("Error deleting account:", error);
        return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
    }
}
