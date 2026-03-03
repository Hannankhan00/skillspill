import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, createSession } from "@/lib/auth";
import { z } from "zod";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

// ───────────── VALIDATION SCHEMA ─────────────
const RecruiterSchema = z.object({
    companyName: z.string().min(2),
    username: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(8),
    companyWebsite: z.string().url().optional().or(z.literal("")),
    companyPhone: z.string().optional(),
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

        const { companyName, username, email, password, companyWebsite, companyPhone, companySize, location, industry } = result.data;

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

        // 3. Transaction: Create User -> Profile -> Industries
        const user = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            // Create User
            const newUser = await tx.user.create({
                data: {
                    email,
                    username,
                    fullName: companyName, // Company account: use company name as display name
                    passwordHash,
                    role: "RECRUITER",
                },
            });

            // Create Recruiter Profile
            const profile = await tx.recruiterProfile.create({
                data: {
                    userId: newUser.id,
                    companyName,
                    companyWebsite: companyWebsite || null,
                    companySize,
                    location,
                    phone: companyPhone || null,
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

        return NextResponse.json({ success: true, redirectTo: "/recruiter/profile?welcome=true" }, { status: 201 });

    } catch (error) {
        console.error("Recruiter Signup Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
