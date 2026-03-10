import {
    BlobServiceClient,
    StorageSharedKeyCredential,
    generateBlobSASQueryParameters,
    BlobSASPermissions,
    SASProtocol,
} from "@azure/storage-blob";

// ─── Environment Variables ───
const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME!;
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY!;
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || "uploads";

// ─── Validate Configuration ───
function validateConfig() {
    if (!accountName || !accountKey) {
        throw new Error(
            "Azure Storage is not configured. Please set AZURE_STORAGE_ACCOUNT_NAME and AZURE_STORAGE_ACCOUNT_KEY in .env"
        );
    }
}

// ─── Create Blob Service Client ───
function getBlobServiceClient(): BlobServiceClient {
    validateConfig();
    const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);
    return new BlobServiceClient(
        `https://${accountName}.blob.core.windows.net`,
        sharedKeyCredential
    );
}

// ─── Ensure Container Exists ───
async function ensureContainer() {
    const blobServiceClient = getBlobServiceClient();
    const containerClient = blobServiceClient.getContainerClient(containerName);
    await containerClient.createIfNotExists({
        access: "blob", // public read access for blobs
    });
    return containerClient;
}

// ─── Allowed file types ───
const ALLOWED_MIME_TYPES: Record<string, string[]> = {
    resumes: ["application/pdf"],
    avatars: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    images: ["image/jpeg", "image/png", "image/webp", "image/gif", "image/bmp", "image/tiff", "image/avif"],
    videos: ["video/mp4", "video/webm", "video/quicktime", "video/x-msvideo", "video/x-matroska"],
    documents: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
    media: [
        // images
        "image/jpeg", "image/png", "image/webp", "image/gif", "image/bmp", "image/tiff", "image/avif",
        // videos
        "video/mp4", "video/webm", "video/quicktime", "video/x-msvideo", "video/x-matroska",
    ],
};

const MAX_FILE_SIZES: Record<string, number> = {
    resumes: 10 * 1024 * 1024,    // 10 MB
    avatars: 10 * 1024 * 1024,    // 10 MB (pre-compression — Sharp will shrink it)
    images: 20 * 1024 * 1024,     // 20 MB (pre-compression)
    videos: 100 * 1024 * 1024,    // 100 MB (no compression)
    documents: 20 * 1024 * 1024,  // 20 MB
    media: 100 * 1024 * 1024,     // 100 MB (covers both images & videos)
};

// ─── Upload File to Azure Blob Storage ───
export async function uploadToAzure(
    file: Uint8Array,
    fileName: string,
    mimeType: string,
    folder: string = "general"
): Promise<{ url: string; blobName: string }> {
    const containerClient = await ensureContainer();

    // Generate a unique blob name with folder structure
    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
    const blobName = `${folder}/${timestamp}-${sanitizedFileName}`;

    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadData(file, {
        blobHTTPHeaders: {
            blobContentType: mimeType,
            blobCacheControl: "public, max-age=31536000", // Cache for 1 year
        },
    });

    return {
        url: blockBlobClient.url,
        blobName,
    };
}

// ─── Delete File from Azure Blob Storage ───
export async function deleteFromAzure(blobName: string): Promise<boolean> {
    try {
        const containerClient = await ensureContainer();
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        await blockBlobClient.deleteIfExists();
        return true;
    } catch (error) {
        console.error("Error deleting blob:", error);
        return false;
    }
}

// ─── Generate SAS URL (for temporary access to private blobs) ───
export async function generateSasUrl(
    blobName: string,
    expiresInMinutes: number = 60
): Promise<string> {
    validateConfig();
    const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);

    const sasToken = generateBlobSASQueryParameters(
        {
            containerName,
            blobName,
            permissions: BlobSASPermissions.parse("r"), // Read-only
            startsOn: new Date(),
            expiresOn: new Date(Date.now() + expiresInMinutes * 60 * 1000),
            protocol: SASProtocol.Https,
        },
        sharedKeyCredential
    ).toString();

    return `https://${accountName}.blob.core.windows.net/${containerName}/${blobName}?${sasToken}`;
}

// ─── Validate Upload ───
export function validateUpload(
    mimeType: string,
    fileSize: number,
    category: string = "documents"
): { valid: boolean; error?: string } {
    const allowedTypes = ALLOWED_MIME_TYPES[category] || ALLOWED_MIME_TYPES.documents;
    const maxSize = MAX_FILE_SIZES[category] || MAX_FILE_SIZES.documents;

    if (!allowedTypes.includes(mimeType)) {
        return {
            valid: false,
            error: `Invalid file type. Allowed types: ${allowedTypes.join(", ")}`,
        };
    }

    if (fileSize > maxSize) {
        const maxMB = Math.round(maxSize / (1024 * 1024));
        return {
            valid: false,
            error: `File too large. Maximum size: ${maxMB}MB`,
        };
    }

    return { valid: true };
}

// ─── Extract blob name from URL ───
export function getBlobNameFromUrl(url: string): string | null {
    try {
        const urlObj = new URL(url);
        // URL format: https://{account}.blob.core.windows.net/{container}/{blobName}
        const pathParts = urlObj.pathname.split("/");
        // Remove empty first element and container name
        pathParts.shift(); // remove empty string
        pathParts.shift(); // remove container name
        return pathParts.join("/");
    } catch {
        return null;
    }
}
