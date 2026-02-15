import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, createSession } from "@/lib/auth";
import { z } from "zod";

export const dynamic = "force-dynamic";

// ───────────── VALIDATION SCHEMA ─────────────
const RecruiterSchema = z.object({
    fullName: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    jobTitle: z.string().optional(),
    companyName: z.string().min(2),
    companyWebsite: z.string().url().optional().or(z.literal("")),
    companySize: z.string().optional(),
    location: z.string().optional(),
    industry: z.array(z.string()).optional(),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const result = RecruiterSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: "Invalid data", details: result.error.format() }, { status: 400 });
        }

        const { fullName, email, password, jobTitle, companyName, companyWebsite, companySize, location, industry } = result.data;

        // 1. Check if user exists
        const existing = await prisma.user.findUnique({
            where: { email },
        });

        if (existing) {
            return NextResponse.json({ error: "Email already taken" }, { status: 409 });
        }

        // Generate a username from email (e.g., "john.doe" from "john.doe@company.com")
        // Ensure it's unique by appending random bytes if needed, but for now simple split
        let baseUsername = email.split("@")[0];
        let username = baseUsername;
        let counter = 1;
        while (await prisma.user.findUnique({ where: { username } })) {
            username = `${baseUsername}${counter}`;
            counter++;
        }

        // 2. Hash Password
        const passwordHash = await hashPassword(password);

        // 3. Transaction: Create User -> Profile -> Industries
        const user = await prisma.$transaction(async (tx) => {
            // Create User
            const newUser = await tx.user.create({
                data: {
                    email,
                    username,
                    fullName,
                    passwordHash,
                    role: "RECRUITER",
                },
            });

            // Create Recruiter Profile
            const profile = await tx.recruiterProfile.create({
                data: {
                    userId: newUser.id,
                    jobTitle,
                    companyName,
                    companyWebsite: companyWebsite || null,
                    companySize,
                    location,
                },
            });

            // Create Industries (if any)
            if (industry && industry.length > 0) {
                await tx.recruiterIndustry.createMany({
                    data: industry.map((ind) => ({
                        recruiterProfileId: profile.id,
                        industryName: ind,
                    })),
                });
            }

            return newUser;
        });

        // 4. Create Session
        await createSession(user.id, user.role);

        return NextResponse.json({ success: true, redirectTo: "/dashboard/recruiter" }, { status: 201 });

    } catch (error) {
        console.error("Recruiter Signup Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
