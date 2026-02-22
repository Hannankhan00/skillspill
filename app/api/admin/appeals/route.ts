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
        const status = searchParams.get("status") || undefined;
        const search = searchParams.get("search") || undefined;

        const where: Record<string, unknown> = {};

        if (status && ["PENDING", "APPROVED", "REJECTED"].includes(status)) {
            where.status = status;
        }

        if (search) {
            where.user = {
                OR: [
                    { email: { contains: search } },
                    { fullName: { contains: search } },
                    { username: { contains: search } },
                ],
            };
        }

        const [appeals, total] = await Promise.all([
            prisma.appeal.findMany({
                where,
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            username: true,
                            fullName: true,
                            role: true,
                            isActive: true,
                            avatarUrl: true,
                            createdAt: true,
                        },
                    },
                },
                orderBy: { createdAt: "desc" },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.appeal.count({ where }),
        ]);

        return NextResponse.json({
            appeals,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error("Admin Appeals List Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
