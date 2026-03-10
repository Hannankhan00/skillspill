/**
 * Client-side image compression using the browser Canvas API.
 *
 * This runs IN THE BROWSER before the file is sent to the server,
 * giving us a "double compression" pipeline:
 *   Client (Canvas) → Server (Sharp) → Azure
 *
 * Strategy:
 *  - Resize to max 1920px (Full HD) maintaining aspect ratio
 *  - Convert to JPEG at 0.85 quality via canvas.toBlob()
 *  - Preserve PNG transparency by keeping PNG format for those files
 *  - Skip non-image files (PDFs, videos) — return them as-is
 *
 * Expected results:
 *  - 4MB JPEG → ~800KB after client + ~400KB after server
 *  - 2MB PNG → ~500KB after client + ~300KB after server
 */

const MAX_DIMENSION = 1920;
const JPEG_QUALITY = 0.85;
const PNG_QUALITY = 0.92; // higher for PNG to preserve detail

// Image types we can compress client-side
const COMPRESSIBLE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/bmp",
    "image/tiff",
];

/**
 * Compress an image File in the browser using the Canvas API.
 *
 * @param file - the File object from a file input
 * @param maxDim - max width or height (default 1920)
 * @returns a new compressed File object (or the original if not compressible)
 */
export async function compressImageClient(
    file: File,
    maxDim: number = MAX_DIMENSION
): Promise<File> {
    // Skip non-images
    if (!COMPRESSIBLE_TYPES.includes(file.type)) {
        return file;
    }

    return new Promise((resolve) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(url);

            // ── Calculate new dimensions ──
            let { width, height } = img;

            if (width <= maxDim && height <= maxDim && file.size < 500 * 1024) {
                // Already small enough — skip compression
                resolve(file);
                return;
            }

            if (width > maxDim || height > maxDim) {
                const ratio = Math.min(maxDim / width, maxDim / height);
                width = Math.round(width * ratio);
                height = Math.round(height * ratio);
            }

            // ── Draw on canvas ──
            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");

            if (!ctx) {
                resolve(file); // canvas not available (shouldn't happen)
                return;
            }

            ctx.drawImage(img, 0, 0, width, height);

            // ── Choose output format ──
            // Keep PNG for PNG inputs (to preserve transparency)
            const isPng = file.type === "image/png";
            const outputType = isPng ? "image/png" : "image/jpeg";
            const quality = isPng ? PNG_QUALITY : JPEG_QUALITY;

            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        resolve(file);
                        return;
                    }

                    // If our "compressed" version is somehow larger, use original
                    if (blob.size >= file.size) {
                        resolve(file);
                        return;
                    }

                    // Build a new File with the correct extension
                    const ext = isPng ? ".png" : ".jpg";
                    const baseName = file.name.replace(/\.[^.]+$/, "");
                    const newFile = new File([blob], `${baseName}${ext}`, {
                        type: outputType,
                        lastModified: Date.now(),
                    });

                    resolve(newFile);
                },
                outputType,
                quality
            );
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            resolve(file); // fall back to original on error
        };

        img.src = url;
    });
}

/**
 * Compress a video File client-side.
 * Videos are NOT compressed — we only validate size.
 *
 * @param file - Video file
 * @param maxSizeMB - Maximum allowed size in MB (default 100)
 * @returns the original file, or throws if too large
 */
export function validateVideoClient(
    file: File,
    maxSizeMB: number = 100
): { valid: boolean; error?: string } {
    const maxBytes = maxSizeMB * 1024 * 1024;

    if (file.size > maxBytes) {
        return {
            valid: false,
            error: `Video is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maximum is ${maxSizeMB}MB.`,
        };
    }

    return { valid: true };
}

/**
 * Check if a file is an image type.
 */
export function isImageFile(file: File): boolean {
    return COMPRESSIBLE_TYPES.includes(file.type);
}

/**
 * Check if a file is a video type.
 */
export function isVideoFile(file: File): boolean {
    return file.type.startsWith("video/");
}
