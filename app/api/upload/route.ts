import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import {
    uploadToAzure,
    validateUpload,
    deleteFromAzure,
    getBlobNameFromUrl,
} from "@/lib/azure-storage";
import {
    compressImage,
    getCompressedFileName,
} from "@/lib/compress";

// ─── Helpers ───

function isImageMime(mime: string): boolean {
    return mime.startsWith("image/");
}

function isVideoMime(mime: string): boolean {
    return mime.startsWith("video/");
}

// ─── POST: Upload a file ───
export async function POST(req: NextRequest) {
    try {
        // 1. Authenticate
        const session = await getSession();
        if (!session || !session.userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 2. Parse multipart form data
        const formData = await req.formData();
        const file = formData.get("file") as File | null;
        const category = (formData.get("category") as string) || "documents";
        const folder =
            (formData.get("folder") as string) || `users/${session.userId}`;
        const oldFileUrl = formData.get("oldFileUrl") as string | null;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // 3. Validate file type & size
        const validation = validateUpload(file.type, file.size, category);
        if (!validation.valid) {
            return NextResponse.json({ error: validation.error }, { status: 400 });
        }

        // 4. Convert File → Buffer
        const arrayBuffer = await file.arrayBuffer();
        let buffer: Uint8Array = Buffer.from(new Uint8Array(arrayBuffer));
        let finalMimeType = file.type;
        let finalFileName = file.name;

        // 5. Compression pipeline
        //    Images  → compress with Sharp (resize + quality + format)
        //    Videos  → pass through as-is (no server compression)
        //    Others  → pass through as-is

        let compressionInfo: {
            originalSize: number;
            compressedSize: number;
            wasCompressed: boolean;
        } = {
            originalSize: file.size,
            compressedSize: file.size,
            wasCompressed: false,
        };

        if (isImageMime(file.type)) {
            // ── Server-side image compression via Sharp ──
            const result = await compressImage(buffer, file.type);

            buffer = result.buffer;
            finalMimeType = result.mimeType;
            finalFileName = getCompressedFileName(file.name, result.mimeType);

            compressionInfo = {
                originalSize: result.originalSize,
                compressedSize: result.compressedSize,
                wasCompressed: result.compressedSize < result.originalSize,
            };

            console.log(
                `[Upload] Image compressed: ${(result.originalSize / 1024).toFixed(0)}KB → ${(result.compressedSize / 1024).toFixed(0)}KB ` +
                `(${Math.round((1 - result.compressedSize / result.originalSize) * 100)}% reduction) ` +
                `${result.width}x${result.height}`
            );
        } else if (isVideoMime(file.type)) {
            // ── Videos: no compression, just validate the 100MB cap ──
            const maxVideoSize = 100 * 1024 * 1024;
            if (file.size > maxVideoSize) {
                return NextResponse.json(
                    {
                        error: `Video is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maximum is 100MB.`,
                    },
                    { status: 400 }
                );
            }
            console.log(
                `[Upload] Video uploaded as-is: ${(file.size / (1024 * 1024)).toFixed(1)}MB`
            );
        }

        // 6. Upload to Azure Blob Storage
        const result = await uploadToAzure(
            buffer,
            finalFileName,
            finalMimeType,
            folder
        );

        // 7. Delete old file if replacing (non-blocking)
        if (oldFileUrl) {
            const oldBlobName = getBlobNameFromUrl(oldFileUrl);
            if (oldBlobName) {
                deleteFromAzure(oldBlobName).catch((err) =>
                    console.error("Failed to delete old file:", err)
                );
            }
        }

        // 8. Return the result
        return NextResponse.json({
            success: true,
            url: result.url,
            blobName: result.blobName,
            fileName: finalFileName,
            fileSize: buffer.length,
            mimeType: finalMimeType,
            compression: compressionInfo,
        });
    } catch (error: any) {
        console.error("Upload error:", error);

        if (error.message?.includes("Azure Storage is not configured")) {
            return NextResponse.json(
                {
                    error:
                        "Cloud storage is not configured. Please contact the administrator.",
                },
                { status: 503 }
            );
        }

        return NextResponse.json(
            { error: "Failed to upload file. Please try again." },
            { status: 500 }
        );
    }
}

// ─── DELETE: Remove a file ───
export async function DELETE(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session || !session.userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { url } = await req.json();
        if (!url) {
            return NextResponse.json(
                { error: "No file URL provided" },
                { status: 400 }
            );
        }

        // Security: only allow deleting files in the user's own folder
        const blobName = getBlobNameFromUrl(url);
        if (!blobName || !blobName.includes(`users/${session.userId}`)) {
            return NextResponse.json(
                { error: "Unauthorized to delete this file" },
                { status: 403 }
            );
        }

        const deleted = await deleteFromAzure(blobName);

        return NextResponse.json({ success: deleted });
    } catch (error) {
        console.error("Delete error:", error);
        return NextResponse.json(
            { error: "Failed to delete file" },
            { status: 500 }
        );
    }
}
