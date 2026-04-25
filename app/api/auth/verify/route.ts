import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const token = url.searchParams.get("token");

        if (!token) {
            return NextResponse.redirect(new URL("/login?error=MissingVerificationToken", req.url));
        }

        // Find user with this token
        const user = await prisma.user.findUnique({
            where: { verificationToken: token },
        });

        if (!user) {
            return NextResponse.redirect(new URL("/login?error=InvalidVerificationToken", req.url));
        }

        // Check if token has expired
        if (user.verificationExpiresAt && new Date() > user.verificationExpiresAt) {
            return NextResponse.redirect(new URL("/login?error=ExpiredVerificationToken", req.url));
        }

        // Update user to verified
        await prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerified: true,
                verificationToken: null,
                verificationExpiresAt: null,
            },
        });

        // Redirect to login with success message
        return NextResponse.redirect(new URL("/login?verified=true", req.url));

    } catch (error) {
        console.error("Verification Error:", error);
        return NextResponse.redirect(new URL("/login?error=VerificationFailed", req.url));
    }
}
