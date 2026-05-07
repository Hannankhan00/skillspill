import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { sendEmail } from "@/lib/mail";
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
    githubAccessToken: z.string().optional(),
    githubId: z.string().optional(),
    sharePrivateRepos: z.boolean().optional(),
    resumeUrl: z.string().url().optional().or(z.literal("")),
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
            portfolioUrl, linkedinUrl, projectLinks, githubAccessToken, githubId, sharePrivateRepos, resumeUrl
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

        // Generate 6-digit OTP (valid for 10 minutes)
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

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
                    githubId: githubId || null,
                    role: "TALENT",
                    verificationToken,
                    verificationExpiresAt,
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
                    githubAccessToken: githubAccessToken || null,
                    sharePrivateRepos: sharePrivateRepos || false,
                    portfolioUrl: portfolioUrl || null,
                    linkedinUrl: linkedinUrl || null,
                    resumeUrl: resumeUrl || null,
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

        // 4. Send OTP Email
        try {
            await sendEmail({
                to: email,
                subject: "Your SkillSpill Verification Code",
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 8px;">
                        <h2 style="color: #3CF91A; text-align: center; letter-spacing: 2px;">SKILLSPILL</h2>
                        <p style="font-size: 16px; color: #ccc; text-align: center;">Welcome, ${fullName}! Enter this code to verify your account.</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <div style="display: inline-block; background: #111; border: 2px solid #3CF91A; border-radius: 8px; padding: 16px 32px;">
                                <span style="font-size: 36px; font-weight: bold; letter-spacing: 12px; color: #3CF91A; font-family: monospace;">${verificationToken}</span>
                            </div>
                        </div>
                        <p style="font-size: 14px; color: #666; text-align: center;">This code expires in <strong style="color: #ccc;">10 minutes</strong>.</p>
                        <hr style="border: none; border-top: 1px solid #222; margin: 20px 0;" />
                        <p style="font-size: 12px; color: #444; text-align: center;">If you didn't sign up for SkillSpill, ignore this email.</p>
                    </div>
                `,
            });
        } catch (mailErr) {
            console.error("Failed to send verification email:", mailErr);
        }

        // No session created, user needs to verify first
        return NextResponse.json({ success: true, redirectTo: "/verify-request" }, { status: 201 });

    } catch (error) {
        console.error("Talent Signup Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
