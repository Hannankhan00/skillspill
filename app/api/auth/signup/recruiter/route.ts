import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { sendEmail } from "@/lib/mail";
import { z } from "zod";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

// ───────────── VALIDATION SCHEMA ─────────────
const RecruiterSchema = z.object({
    companyName: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    companyWebsite: z.string().url().optional().or(z.literal("")),
    companyPhone: z.string().optional(),
    companySize: z.string().optional(),
    addressLine1: z.string().optional(),
    addressLine2: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().optional(),
    industry: z.array(z.string()).optional(),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const result = RecruiterSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: "Invalid data", details: result.error.format() }, { status: 400 });
        }

        const { companyName, email, password, companyWebsite, companyPhone, companySize,
            addressLine1, addressLine2, city, state, postalCode, country, industry } = result.data;

        // Auto-generate unique username from company name
        const baseUsername = companyName.toLowerCase().replace(/[^a-z0-9]/g, "_").replace(/_+/g, "_").slice(0, 20);
        let username = baseUsername;
        let suffix = 1;
        while (await prisma.user.findUnique({ where: { username } })) {
            username = `${baseUsername}_${suffix++}`;
        }

        // 1. Check uniqueness
        const existingEmail = await prisma.user.findUnique({ where: { email } });
        if (existingEmail) return NextResponse.json({ error: "Email already taken" }, { status: 409 });

        const existingCompany = await prisma.recruiterProfile.findUnique({ where: { companyName } });
        if (existingCompany) return NextResponse.json({ error: "A company with this name already exists. If you work there, ask your company admin to add you." }, { status: 409 });


        // 2. Hash Password
        const passwordHash = await hashPassword(password);

        // Generate 6-digit OTP (valid for 10 minutes)
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

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
                    verificationToken,
                    verificationExpiresAt,
                },
            });

            // Create Recruiter Profile
            const profile = await tx.recruiterProfile.create({
                data: {
                    userId: newUser.id,
                    companyName,
                    companyWebsite: companyWebsite || null,
                    companySize,
                    addressLine1: addressLine1 || null,
                    addressLine2: addressLine2 || null,
                    city: city || null,
                    state: state || null,
                    postalCode: postalCode || null,
                    country: country || null,
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

        // 4. Send OTP Email
        try {
            await sendEmail({
                to: email,
                subject: "Your SkillSpill Verification Code",
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 8px;">
                        <h2 style="color: #A855F7; text-align: center; letter-spacing: 2px;">SKILLSPILL</h2>
                        <p style="font-size: 16px; color: #ccc; text-align: center;">Welcome, ${companyName}! Enter this code to verify your recruiter account.</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <div style="display: inline-block; background: #111; border: 2px solid #A855F7; border-radius: 8px; padding: 16px 32px;">
                                <span style="font-size: 36px; font-weight: bold; letter-spacing: 12px; color: #A855F7; font-family: monospace;">${verificationToken}</span>
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
        console.error("Recruiter Signup Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
