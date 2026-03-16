import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, context: { params: Promise<{ targetUserId: string }> }) {
    try {
        const session = await getSession();
        if (!session || !session.userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { targetUserId } = await context.params;

        if (session.userId === targetUserId) {
            return NextResponse.json({ error: "You cannot follow yourself" }, { status: 400 });
        }

        // Check if follow exists
        const existingFollow = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: session.userId,
                    followingId: targetUserId
                }
            }
        });

        if (existingFollow) {
            return NextResponse.json({ error: "Already following this user" }, { status: 400 });
        }

        // Create follow
        const follow = await prisma.follow.create({
            data: {
                followerId: session.userId,
                followingId: targetUserId
            }
        });

        // Also potentially send a notification here but omit for now to keep it simple

        return NextResponse.json({ success: true, follow });
    } catch (error) {
        console.error("Error following user:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: Request, context: { params: Promise<{ targetUserId: string }> }) {
    try {
        const session = await getSession();
        if (!session || !session.userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { targetUserId } = await context.params;

        // Delete follow
        await prisma.follow.delete({
            where: {
                followerId_followingId: {
                    followerId: session.userId,
                    followingId: targetUserId
                }
            }
        });

        return NextResponse.json({ success: true, message: "Unfollowed successfully" });
    } catch (error: any) {
        if (error.code === 'P2025') { 
            return NextResponse.json({ error: "Follow record not found" }, { status: 404 });
        }
        console.error("Error unfollowing user:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
