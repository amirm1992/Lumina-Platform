import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { isUserAdmin } from '@/utils/admin/api'
import prisma from '@/lib/prisma'
import { validateFile, buildStorageKey, uploadFileToSpaces } from '@/lib/storage'

// POST /api/admin/documents/upload — admin uploads on behalf of a client
// Expects FormData: file, userId, category, applicationId (optional)
export async function POST(req: NextRequest) {
    try {
        const admin = await isUserAdmin()
        if (!admin) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const user = await currentUser()
        const adminName = user
            ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.emailAddresses[0]?.emailAddress || 'Admin'
            : 'Admin'

        const formData = await req.formData()
        const file = formData.get('file') as File | null
        const targetUserId = formData.get('userId') as string | null
        const category = (formData.get('category') as string) || 'other'
        const applicationId = formData.get('applicationId') as string | null

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 })
        }
        if (!targetUserId) {
            return NextResponse.json({ error: 'userId is required' }, { status: 400 })
        }

        const validation = validateFile(file.type, file.size)
        if (!validation.valid) {
            return NextResponse.json({ error: validation.error }, { status: 400 })
        }

        // Store under the CLIENT's userId folder for isolation
        const storageKey = buildStorageKey(targetUserId, category, file.name)
        const buffer = Buffer.from(await file.arrayBuffer())

        await uploadFileToSpaces(storageKey, buffer, file.type)

        const doc = await prisma.document.create({
            data: {
                userId: targetUserId,
                applicationId: applicationId || null,
                category,
                fileName: file.name,
                storageKey,
                fileSize: file.size,
                mimeType: file.type,
                uploadedBy: 'admin',
                uploadedByName: adminName,
                status: 'approved', // Admin-uploaded docs are auto-approved
            },
        })

        return NextResponse.json({
            document: {
                id: doc.id,
                category: doc.category,
                file_name: doc.fileName,
                status: doc.status,
                uploaded_by: doc.uploadedBy,
                uploaded_by_name: doc.uploadedByName,
                created_at: doc.createdAt.toISOString(),
            },
        })
    } catch (error) {
        console.error('POST /api/admin/documents/upload error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
