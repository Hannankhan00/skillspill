/**
 * Server-side image compression using Sharp.
 *
 * Compression strategy:
 *  - Resize to max 1920px (Full HD) maintaining aspect ratio
 *  - Convert to JPEG at 85% quality with progressive loading
 *  - Preserve PNG/WebP when those formats are input (re-compress them)
 *  - Skip non-image files (PDFs, videos, etc.) — pass them through
 *
 * Expected results:
 *  - 4MB JPEG photo → ~400KB
 *  - 2MB PNG screenshot → ~300KB
 */

import sharp from "sharp";

// ─── Constants ───
const MAX_DIMENSION = 1920; // Full HD cap
const JPEG_QUALITY = 85;
const PNG_QUALITY = 85; // compression level mapped internally
const WEBP_QUALITY = 85;

// Mime types that can be compressed
const COMPRESSIBLE_TYPES = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/tiff",
    "image/bmp",
    "image/avif",
]);

export interface CompressResult {
    buffer: Uint8Array;
    mimeType: string;
    width: number;
    height: number;
    originalSize: number;
    compressedSize: number;
}

/**
 * Compress an image buffer on the server side using Sharp.
 *
 * @param input - raw file buffer
 * @param mimeType - original MIME type of the file
 * @returns compressed buffer with metadata, or the original if not compressible
 */
export async function compressImage(
    input: Uint8Array,
    mimeType: string
): Promise<CompressResult> {
    const originalSize = input.length;

    // ── Not an image we can compress? Return as-is ──
    if (!COMPRESSIBLE_TYPES.has(mimeType)) {
        return {
            buffer: input,
            mimeType,
            width: 0,
            height: 0,
            originalSize,
            compressedSize: originalSize,
        };
    }

    // ── Build the Sharp pipeline ──
    let pipeline = sharp(input, { animated: false })
        .rotate() // auto-rotate based on EXIF
        .resize({
            width: MAX_DIMENSION,
            height: MAX_DIMENSION,
            fit: "inside", // maintain aspect ratio, never upscale
            withoutEnlargement: true,
        });

    // ── Choose output format based on input type ──
    let outputMime: string;

    if (mimeType === "image/png") {
        // Keep as PNG but re-compress
        pipeline = pipeline.png({
            quality: PNG_QUALITY,
            compressionLevel: 9, // max compression
            adaptiveFiltering: true,
            palette: true, // quantize to 256 colors if it helps
        });
        outputMime = "image/png";
    } else if (mimeType === "image/webp") {
        // Keep as WebP but re-compress
        pipeline = pipeline.webp({
            quality: WEBP_QUALITY,
            effort: 6, // higher = slower + smaller
        });
        outputMime = "image/webp";
    } else {
        // Everything else (JPEG, GIF, TIFF, BMP, AVIF) → progressive JPEG
        pipeline = pipeline.jpeg({
            quality: JPEG_QUALITY,
            progressive: true,
            mozjpeg: true, // use mozjpeg encoder for smaller output
        });
        outputMime = "image/jpeg";
    }

    const outputBuffer = await pipeline.toBuffer();
    const metadata = await sharp(outputBuffer).metadata();

    return {
        buffer: outputBuffer,
        mimeType: outputMime,
        width: metadata.width || 0,
        height: metadata.height || 0,
        originalSize,
        compressedSize: outputBuffer.length,
    };
}

/**
 * Returns a new filename with the correct extension after compression.
 */
export function getCompressedFileName(
    originalName: string,
    outputMime: string
): string {
    const baseName = originalName.replace(/\.[^.]+$/, "");
    const extMap: Record<string, string> = {
        "image/jpeg": ".jpg",
        "image/png": ".png",
        "image/webp": ".webp",
    };
    return baseName + (extMap[outputMime] || ".jpg");
}
