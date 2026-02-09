import { NextRequest, NextResponse } from 'next/server'
import { isUserAdmin } from '@/utils/admin/api'
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

// GET /api/admin/documents?userId=xxx or ?applicationId=xxx
export async function GET(req: NextRequest) {
    try {
        const admin = await isUserAdmin()
        if (!admin) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const { searchParams } = new URL(req.url)
        const userId = searchParams.get('userId')
        const applicationId = searchParams.get('applicationId')

        if (!userId && !applicationId) {
            return NextResponse.json({ error: 'Provide userId or applicationId query param' }, { status: 400 })
        }

        const where: any = {}
        if (userId) where.userId = userId
        if (applicationId) where.applicationId = applicationId

        const docs = await prisma.document.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        })

        return NextResponse.json({ documents: docs.map(mapDocument) })
    } catch (error) {
        console.error('GET /api/admin/documents error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
