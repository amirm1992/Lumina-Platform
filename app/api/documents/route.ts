import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import type { Document, DocumentCategory } from '@/types/database'

function mapDocument(d: any): Document {
    return {
        id: d.id,
        user_id: d.userId,
        application_id: d.applicationId,
        category: d.category as DocumentCategory,
        file_name: d.fileName,
        storage_key: d.storageKey,
        file_size: d.fileSize,
        mime_type: d.mimeType,
        uploaded_by: d.uploadedBy as 'client' | 'admin',
        uploaded_by_name: d.uploadedByName,
        status: d.status as Document['status'],
        admin_notes: d.adminNotes,
        created_at: d.createdAt?.toISOString() || new Date().toISOString(),
        updated_at: d.updatedAt?.toISOString() || new Date().toISOString(),
    }
}

// GET /api/documents — get current user's documents
export async function GET() {
    try {
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const docs = await prisma.document.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        })

        return NextResponse.json({ documents: docs.map(mapDocument) })
    } catch (error) {
        console.error('GET /api/documents error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
