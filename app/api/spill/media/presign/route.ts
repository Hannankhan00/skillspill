import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { generateSasUrl } from "@/lib/azure-storage";

// ─── GET /api/spill/media/presign — Get presigned URL for video upload ───
export async function GET(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const fileName = searchParams.get("fileName");
        const fileType = searchParams.get("fileType");

        if (!fileName || !fileType) {
            return NextResponse.json({ error: "fileName and fileType required" }, { status: 400 });
        }

        const allowedVideoTypes = ["video/mp4", "video/quicktime", "video/webm"];
        if (!allowedVideoTypes.includes(fileType)) {
            return NextResponse.json({ error: "Invalid video type" }, { status: 400 });
        }

        const timestamp = Date.now();
        const sanitizedName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
        const blobName = `spill/videos/${session.userId}/${timestamp}-${sanitizedName}`;

        // Generate SAS URL with write permissions (60 min expiry)
        const sasUrl = await generateSasUrl(blobName, 60);

        return NextResponse.json({
            uploadUrl: sasUrl,
            publicUrl: `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/${process.env.AZURE_STORAGE_CONTAINER_NAME}/${blobName}`,
            blobName,
        });
    } catch (error) {
        console.error("Presign error:", error);
        return NextResponse.json({ error: "Failed to generate presigned URL" }, { status: 500 });
    }
}
