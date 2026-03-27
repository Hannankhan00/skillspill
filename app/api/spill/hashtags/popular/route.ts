import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// ─── GET /api/spill/hashtags/popular — Popular hashtag suggestions ───
export async function GET(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const query = searchParams.get("q") || "";

        let where: any = {};
        if (query) {
            where.tag = { contains: query.toLowerCase() };
        }

        const hashtags = await prisma.spillHashtag.findMany({
            where,
            orderBy: { useCount: "desc" },
            take: 15,
        });

        const response = NextResponse.json({ hashtags });
        response.headers.set("Cache-Control", "s-maxage=30, stale-while-revalidate=60");
        return response;
    } catch (error) {
        console.error("Hashtags error:", error);
        return NextResponse.json({ error: "Failed to fetch hashtags" }, { status: 500 });
    }
}
