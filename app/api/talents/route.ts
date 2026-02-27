import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getSession();
        // Allow recruiters and admins to query talents
        if (!session || (session.role !== "RECRUITER" && session.role !== "ADMIN")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const talents = await prisma.user.findMany({
            where: {
                role: "TALENT",
                isActive: true,
            },
            select: {
                id: true,
                fullName: true,
                username: true,
                email: true,
                talentProfile: {
                    select: {
                        bio: true,
                        experienceLevel: true,
                        isAvailable: true,
                        skills: {
                            select: {
                                skillName: true,
                                isVerified: true,
                            }
                        }
                    }
                }
            }
        });

        return NextResponse.json({ talents });
    } catch (error) {
        console.error("Error fetching talents:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
