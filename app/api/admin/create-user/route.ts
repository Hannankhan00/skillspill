import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, getSession } from "@/lib/auth";
import { z } from "zod";

export const dynamic = "force-dynamic";

const CreateAdminSchema = z.object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    role: z.enum(["ADMIN", "TALENT", "RECRUITER"], {
        error: "Role must be ADMIN, TALENT, or RECRUITER",
    }),
});

export async function POST(req: NextRequest) {
    try {
        // 1. Verify the caller is an ADMIN
        const session = await getSession();

        if (!session || session.role !== "ADMIN") {
            return NextResponse.json(
                { error: "Unauthorized — ADMIN access required" },
                { status: 403 }
            );
        }

        // 2. Parse & validate body
        const body = await req.json();
        const result = CreateAdminSchema.safeParse(body);

        if (!result.success) {
            const errors = result.error.issues.map((i) => i.message).join(", ");
            return NextResponse.json({ error: errors }, { status: 400 });
        }

        const { fullName, email, password, role } = result.data;

        // 3. Check if email already exists
        const existing = await prisma.user.findUnique({
            where: { email },
        });

        if (existing) {
            return NextResponse.json(
                { error: "Email already registered" },
                { status: 409 }
            );
        }

        // 4. Generate unique username
        let baseUsername = email.split("@")[0];
        let username = baseUsername;
        let counter = 1;
        while (await prisma.user.findUnique({ where: { username } })) {
            username = `${baseUsername}${counter}`;
            counter++;
        }

        // 5. Hash password & create user
        const passwordHash = await hashPassword(password);

        const newUser = await prisma.user.create({
            data: {
                email,
                username,
                fullName,
                passwordHash,
                role,
                emailVerified: true, // Admin-created accounts auto-verified
                isActive: true,
            },
            select: {
                id: true,
                email: true,
                username: true,
                fullName: true,
                role: true,
                createdAt: true,
            },
        });

        return NextResponse.json(
            {
                success: true,
                message: `${role} account created successfully`,
                user: newUser,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Admin Create User Error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
