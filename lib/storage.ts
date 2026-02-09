import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// DigitalOcean Spaces (S3-compatible) configuration
const SPACES_REGION = process.env.SPACES_REGION || 'nyc3'
const SPACES_BUCKET = process.env.SPACES_BUCKET || 'lumina-docs'
const SPACES_ENDPOINT = process.env.SPACES_ENDPOINT || `https://${SPACES_REGION}.digitaloceanspaces.com`

const s3Client = new S3Client({
    endpoint: SPACES_ENDPOINT,
    region: SPACES_REGION,
    credentials: {
        accessKeyId: process.env.SPACES_ACCESS_KEY || '',
        secretAccessKey: process.env.SPACES_SECRET_KEY || '',
    },
    forcePathStyle: false,
})

// Allowed MIME types
const ALLOWED_MIME_TYPES = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB

/**
 * Validate a file before upload
 */
export function validateFile(mimeType: string, fileSize: number): { valid: boolean; error?: string } {
    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
        return { valid: false, error: `File type "${mimeType}" is not allowed. Accepted: PDF, JPG, PNG, WEBP, DOC, DOCX` }
    }
    if (fileSize > MAX_FILE_SIZE) {
        return { valid: false, error: `File size exceeds the 10 MB limit` }
    }
    return { valid: true }
}

/**
 * Build the storage key (path) for a document
 * Format: documents/{userId}/{category}/{timestamp}-{filename}
 */
export function buildStorageKey(userId: string, category: string, fileName: string): string {
    const timestamp = Date.now()
    const sanitized = fileName.replace(/[^a-zA-Z0-9._-]/g, '_')
    return `documents/${userId}/${category}/${timestamp}-${sanitized}`
}

/**
 * Generate a presigned URL for uploading a file directly to Spaces
 */
export async function getUploadUrl(storageKey: string, mimeType: string): Promise<string> {
    const command = new PutObjectCommand({
        Bucket: SPACES_BUCKET,
        Key: storageKey,
        ContentType: mimeType,
    })
    return getSignedUrl(s3Client, command, { expiresIn: 900 }) // 15 minutes
}

/**
 * Generate a presigned URL for downloading a file from Spaces
 */
export async function getDownloadUrl(storageKey: string, fileName: string): Promise<string> {
    const command = new GetObjectCommand({
        Bucket: SPACES_BUCKET,
        Key: storageKey,
        ResponseContentDisposition: `inline; filename="${fileName}"`,
    })
    return getSignedUrl(s3Client, command, { expiresIn: 900 }) // 15 minutes
}

/**
 * Upload file content directly (used for server-side uploads, e.g. admin uploading on behalf)
 */
export async function uploadFileToSpaces(
    storageKey: string,
    body: Buffer | Uint8Array,
    mimeType: string
): Promise<void> {
    const command = new PutObjectCommand({
        Bucket: SPACES_BUCKET,
        Key: storageKey,
        Body: body,
        ContentType: mimeType,
    })
    await s3Client.send(command)
}

/**
 * Delete a file from Spaces
 */
export async function deleteFileFromSpaces(storageKey: string): Promise<void> {
    const command = new DeleteObjectCommand({
        Bucket: SPACES_BUCKET,
        Key: storageKey,
    })
    await s3Client.send(command)
}
