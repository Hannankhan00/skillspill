import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createSession } from "@/lib/auth";
import { z } from "zod";

export const dynamic = "force-dynamic";

const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const result = LoginSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: "Invalid input" }, { status: 400 });
        }

        const { email, password } = result.data;

        // 1. Find user
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // 2. Verify Password
        const isValid = await verifyPassword(password, user.passwordHash);

        if (!isValid) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // 3. Check if account is suspended
        if (!user.isActive) {
            // Still create session so user can see suspension page and appeal
            await createSession(user.id, user.role);
            return NextResponse.json({ success: true, redirectTo: "/suspended" }, { status: 200 });
        }

        // 4. Create Session
        await createSession(user.id, user.role);

        // 5. Update Last Login
        await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
        });

        // 6. Determine Redirect
        let redirectTo = "/dashboard";
        if (user.role === "TALENT") redirectTo = "/dashboard/talent";
        else if (user.role === "RECRUITER") redirectTo = "/dashboard/recruiter";
        else if (user.role === "ADMIN") redirectTo = "/admin";

        return NextResponse.json({ success: true, redirectTo }, { status: 200 });

    } catch (error) {
        console.error("Login Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
