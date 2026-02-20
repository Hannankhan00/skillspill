import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        const session = await getSession();

        if (!session || session.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");
        const role = searchParams.get("role") || undefined;
        const search = searchParams.get("search") || undefined;

        const where: Record<string, unknown> = {};

        if (role && ["TALENT", "RECRUITER", "ADMIN"].includes(role)) {
            where.role = role;
        }

        if (search) {
            where.OR = [
                { email: { contains: search } },
                { fullName: { contains: search } },
                { username: { contains: search } },
            ];
        }

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                select: {
                    id: true,
                    email: true,
                    username: true,
                    fullName: true,
                    role: true,
                    isActive: true,
                    emailVerified: true,
                    lastLoginAt: true,
                    createdAt: true,
                },
                orderBy: { createdAt: "desc" },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.user.count({ where }),
        ]);

        return NextResponse.json({
            users,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Admin Users List Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
