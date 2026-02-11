import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import { validateFile, buildStorageKey, getUploadUrl, uploadFileToSpaces } from '@/lib/storage'
import type { DocumentCategory } from '@/types/database'
import { sendAdminDocumentUploadedEmail } from '@/utils/email/send-email'

// POST /api/documents/upload
// Two modes:
//   1. JSON body with { category, fileName, mimeType, fileSize } → returns presigned upload URL
//   2. FormData with file → direct server-side upload
export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await currentUser()
        const uploaderName = user
            ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.emailAddresses[0]?.emailAddress || 'Client'
            : 'Client'

        const contentType = req.headers.get('content-type') || ''

        // Mode 1: FormData (direct upload)
        if (contentType.includes('multipart/form-data')) {
            const formData = await req.formData()
            const file = formData.get('file') as File | null
            const category = (formData.get('category') as string) || 'other'
            const applicationId = formData.get('applicationId') as string | null

            if (!file) {
                return NextResponse.json({ error: 'No file provided' }, { status: 400 })
            }

            const validation = validateFile(file.type, file.size)
            if (!validation.valid) {
                return NextResponse.json({ error: validation.error }, { status: 400 })
            }

            const storageKey = buildStorageKey(userId, category, file.name)
            const buffer = Buffer.from(await file.arrayBuffer())

            await uploadFileToSpaces(storageKey, buffer, file.type)

            const doc = await prisma.document.create({
                data: {
                    userId,
                    applicationId: applicationId || null,
                    category,
                    fileName: file.name,
                    storageKey,
                    fileSize: file.size,
                    mimeType: file.type,
                    uploadedBy: 'client',
                    uploadedByName: uploaderName,
                    status: 'pending_review',
                },
            })

            // Notify admin of new upload (non-blocking)
            try {
                await sendAdminDocumentUploadedEmail({
                    uploaderName: uploaderName,
                    uploaderEmail: user?.emailAddresses[0]?.emailAddress,
                    documentName: file.name,
                    category,
                    applicationId: applicationId,
                })
            } catch (emailErr) {
                console.error('Admin doc upload email warning:', emailErr)
            }

            return NextResponse.json({
                document: {
                    id: doc.id,
                    category: doc.category,
                    file_name: doc.fileName,
                    status: doc.status,
                    uploaded_by: doc.uploadedBy,
                    created_at: doc.createdAt.toISOString(),
                },
            })
        }

        // Mode 2: JSON body → return presigned URL for client-side upload
        const body = await req.json()
        const { category, fileName, mimeType, fileSize, applicationId } = body as {
            category: DocumentCategory
            fileName: string
            mimeType: string
            fileSize: number
            applicationId?: string
        }

        if (!category || !fileName || !mimeType || !fileSize) {
            return NextResponse.json({ error: 'Missing required fields: category, fileName, mimeType, fileSize' }, { status: 400 })
        }

        const validation = validateFile(mimeType, fileSize)
        if (!validation.valid) {
            return NextResponse.json({ error: validation.error }, { status: 400 })
        }

        const storageKey = buildStorageKey(userId, category, fileName)
        const uploadUrl = await getUploadUrl(storageKey, mimeType)

        // Create the DB record now (file will be uploaded directly by client)
        const doc = await prisma.document.create({
            data: {
                userId,
                applicationId: applicationId || null,
                category,
                fileName,
                storageKey,
                fileSize,
                mimeType,
                uploadedBy: 'client',
                uploadedByName: uploaderName,
                status: 'pending_review',
            },
        })

        // Notify admin of new upload (non-blocking)
        try {
            await sendAdminDocumentUploadedEmail({
                uploaderName: uploaderName,
                uploaderEmail: user?.emailAddresses[0]?.emailAddress,
                documentName: fileName,
                category,
                applicationId: applicationId,
            })
        } catch (emailErr) {
            console.error('Admin doc upload email warning:', emailErr)
        }

        return NextResponse.json({
            uploadUrl,
            document: {
                id: doc.id,
                category: doc.category,
                file_name: doc.fileName,
                storage_key: doc.storageKey,
                status: doc.status,
                created_at: doc.createdAt.toISOString(),
            },
        })
    } catch (error) {
        console.error('POST /api/documents/upload error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
