import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { uploadToAzure, validateUpload } from "@/lib/azure-storage";

// ─── POST /api/spill/media/upload — Upload images to Azure ───
export async function POST(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const formData = await req.formData();
        const files = formData.getAll("files") as File[];

        if (!files || files.length === 0) {
            return NextResponse.json({ error: "No files provided" }, { status: 400 });
        }

        if (files.length > 10) {
            return NextResponse.json({ error: "Maximum 10 files" }, { status: 400 });
        }

        const urls: string[] = [];

        for (const file of files) {
            const validation = validateUpload(file.type, file.size, "images");
            if (!validation.valid) {
                return NextResponse.json({ error: validation.error }, { status: 400 });
            }

            const buffer = new Uint8Array(await file.arrayBuffer());
            const folder = `spill/images/${session.userId}`;
            const result = await uploadToAzure(buffer, file.name, file.type, folder);
            urls.push(result.url);
        }

        return NextResponse.json({ urls });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Failed to upload files" }, { status: 500 });
    }
}
