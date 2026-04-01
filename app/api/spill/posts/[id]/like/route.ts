import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// ─── POST /api/spill/posts/[id]/like — Toggle like ───
// Uses an interactive transaction to avoid race conditions.
// The unique constraint on (postId, userId) prevents duplicate likes,
// and the count is always derived from the atomic increment/decrement
// result rather than a stale read.
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { id } = await params;

        // Use an interactive transaction so the check + write + count update
        // are serialized per-row, preventing double-likes and negative counts.
        const result = await prisma.$transaction(async (tx) => {
            // Lock the post row first (the subsequent update will hold the lock)
            const post = await tx.spillPost.findUnique({ where: { id } });
            if (!post) throw new Error("NOT_FOUND");

            const existing = await tx.spillLike.findUnique({
                where: { postId_userId: { postId: id, userId: session.userId } },
            });

            if (existing) {
                // Unlike — delete the like row, then decrement (floored at 0)
                await tx.spillLike.delete({ where: { id: existing.id } });
                const updated = await tx.spillPost.update({
                    where: { id },
                    data: { likesCount: { decrement: 1 } },
                    select: { likesCount: true },
                });
                // Floor at 0 — if something drifted negative, correct it
                if (updated.likesCount < 0) {
                    const corrected = await tx.spillPost.update({
                        where: { id },
                        data: { likesCount: 0 },
                        select: { likesCount: true },
                    });
                    return { liked: false, likesCount: corrected.likesCount };
                }
                return { liked: false, likesCount: updated.likesCount };
            } else {
                // Like — create the like row, then increment
                await tx.spillLike.create({
                    data: { postId: id, userId: session.userId },
                });
                const updated = await tx.spillPost.update({
                    where: { id },
                    data: { likesCount: { increment: 1 } },
                    select: { likesCount: true },
                });
                return { liked: true, likesCount: updated.likesCount };
            }
        });

        return NextResponse.json(result);
    } catch (error: any) {
        if (error?.message === "NOT_FOUND") {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }
        console.error("Like error:", error);
        return NextResponse.json({ error: "Failed to toggle like" }, { status: 500 });
    }
}
