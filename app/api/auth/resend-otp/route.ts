import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mail";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: "Email is required." }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            // Don't reveal whether the email exists
            return NextResponse.json({ success: true });
        }

        if (user.emailVerified) {
            return NextResponse.json({ error: "This account is already verified." }, { status: 400 });
        }

        // Generate a fresh OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        await prisma.user.update({
            where: { id: user.id },
            data: { verificationToken: otp, verificationExpiresAt: expiresAt },
        });

        const accentColor = user.role === "RECRUITER" ? "#A855F7" : "#3CF91A";
        const displayName = user.fullName || email;

        try {
            await sendEmail({
                to: email,
                subject: "Your new SkillSpill Verification Code",
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 8px;">
                        <h2 style="color: ${accentColor}; text-align: center; letter-spacing: 2px;">SKILLSPILL</h2>
                        <p style="font-size: 16px; color: #ccc; text-align: center;">Hi ${displayName}, here is your new verification code.</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <div style="display: inline-block; background: #111; border: 2px solid ${accentColor}; border-radius: 8px; padding: 16px 32px;">
                                <span style="font-size: 36px; font-weight: bold; letter-spacing: 12px; color: ${accentColor}; font-family: monospace;">${otp}</span>
                            </div>
                        </div>
                        <p style="font-size: 14px; color: #666; text-align: center;">This code expires in <strong style="color: #ccc;">10 minutes</strong>.</p>
                        <hr style="border: none; border-top: 1px solid #222; margin: 20px 0;" />
                        <p style="font-size: 12px; color: #444; text-align: center;">If you didn't request this, ignore this email.</p>
                    </div>
                `,
            });
        } catch (mailErr) {
            console.error("Failed to resend OTP:", mailErr);
            return NextResponse.json({ error: "Failed to send email. Please try again." }, { status: 500 });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Resend OTP Error:", error);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
