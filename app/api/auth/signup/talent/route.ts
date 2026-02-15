import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, createSession } from "@/lib/auth";
import { z } from "zod";

export const dynamic = "force-dynamic";

// ───────────── VALIDATION SCHEMA ─────────────
const TalentSchema = z.object({
    fullName: z.string().min(2),
    username: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(8),
    selectedSkills: z.array(z.string()).min(1),
    experienceLevel: z.string(),
    bio: z.string().optional(),
    githubConnected: z.boolean().optional(),
    githubUsername: z.string().optional().or(z.literal("")),
    githubRepos: z.number().optional(),
    githubStars: z.number().optional(),
    portfolioUrl: z.string().url().optional().or(z.literal("")),
    linkedinUrl: z.string().url().optional().or(z.literal("")),
    projectLinks: z.array(z.string().url().or(z.literal(""))).optional(),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Clean up empty strings in projectLinks
        if (body.projectLinks) {
            body.projectLinks = body.projectLinks.filter((l: string) => l && l.trim() !== "");
        }

        const result = TalentSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: "Invalid data", details: result.error.format() }, { status: 400 });
        }

        const {
            fullName, username, email, password, selectedSkills, experienceLevel, bio,
            githubConnected, githubUsername, githubRepos, githubStars,
            portfolioUrl, linkedinUrl, projectLinks
        } = result.data;

        // 1. Check if user exists
        const existing = await prisma.user.findFirst({
            where: {
                OR: [{ email }, { username }],
            },
        });

        if (existing) {
            if (existing.email === email) return NextResponse.json({ error: "Email already taken" }, { status: 409 });
            if (existing.username === username) return NextResponse.json({ error: "Username already taken" }, { status: 409 });
        }

        // 2. Hash Password
        const passwordHash = await hashPassword(password);

        // Map Experience Level String to Enum
        const levelMap: Record<string, "JUNIOR" | "MID" | "SENIOR" | "STAFF"> = {
            "junior": "JUNIOR",
            "mid": "MID",
            "senior": "SENIOR",
            "staff": "STAFF"
        };
        const expEnum = levelMap[experienceLevel] || "JUNIOR";

        // 3. Transaction: Create User -> Profile -> Skills -> Projects
        const user = await prisma.$transaction(async (tx) => {
            // Create User
            const newUser = await tx.user.create({
                data: {
                    email,
                    username,
                    fullName,
                    passwordHash,
                    role: "TALENT",
                },
            });

            // Create Talent Profile
            const profile = await tx.talentProfile.create({
                data: {
                    userId: newUser.id,
                    bio: bio || "",
                    experienceLevel: expEnum,
                    isAvailable: true,
                    githubConnected: githubConnected || false,
                    githubUsername: githubUsername || null,
                    githubRepos: githubRepos || 0,
                    githubStars: githubStars || 0,
                    portfolioUrl: portfolioUrl || null,
                    linkedinUrl: linkedinUrl || null,
                },
            });

            // Create Skills
            if (selectedSkills.length > 0) {
                await tx.talentSkill.createMany({
                    data: selectedSkills.map((skill) => ({
                        talentProfileId: profile.id,
                        skillName: skill,
                        isVerified: false,
                    })),
                });
            }

            // Create Projects
            if (projectLinks && projectLinks.length > 0) {
                await tx.talentProject.createMany({
                    data: projectLinks.map((url) => ({
                        talentProfileId: profile.id,
                        url: url || "",
                        title: "Portfolio Project", // Default title
                    })),
                });
            }

            return newUser;
        });

        // 4. Create Session (Cookie)
        await createSession(user.id, user.role);

        return NextResponse.json({ success: true, redirectTo: "/dashboard/talent" }, { status: 201 });

    } catch (error) {
        console.error("Talent Signup Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
