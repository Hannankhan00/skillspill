import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    try {
        const { email, otp } = await req.json();

        if (!email || !otp) {
            return NextResponse.json({ error: "Email and OTP are required." }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || user.verificationToken !== otp) {
            return NextResponse.json({ error: "Invalid verification code." }, { status: 400 });
        }

        if (user.verificationExpiresAt && new Date() > user.verificationExpiresAt) {
            return NextResponse.json({ error: "Code has expired. Please request a new one." }, { status: 400 });
        }

        await prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerified: true,
                verificationToken: null,
                verificationExpiresAt: null,
            },
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Verification Error:", error);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
