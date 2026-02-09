import { NextRequest, NextResponse } from 'next/server'
import { isUserAdmin } from '@/utils/admin/api'
import prisma from '@/lib/prisma'
import { getDownloadUrl, deleteFileFromSpaces } from '@/lib/storage'

// GET /api/admin/documents/[id] — get signed download URL (admin can download any doc)
export async function GET(
    _req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const admin = await isUserAdmin()
        if (!admin) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const { id } = params
        const doc = await prisma.document.findUnique({ where: { id } })

        if (!doc) {
            return NextResponse.json({ error: 'Document not found' }, { status: 404 })
        }

        const url = await getDownloadUrl(doc.storageKey, doc.fileName)
        return NextResponse.json({ url })
    } catch (error) {
        console.error('GET /api/admin/documents/[id] error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// PATCH /api/admin/documents/[id] — update status or admin notes
export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const admin = await isUserAdmin()
        if (!admin) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const { id } = params
        const body = await req.json()
        const { status, adminNotes } = body as { status?: string; adminNotes?: string }

        const updateData: any = {}
        if (status) updateData.status = status
        if (adminNotes !== undefined) updateData.adminNotes = adminNotes

        const doc = await prisma.document.update({
            where: { id },
            data: updateData,
        })

        return NextResponse.json({
            document: {
                id: doc.id,
                status: doc.status,
                admin_notes: doc.adminNotes,
                updated_at: doc.updatedAt.toISOString(),
            },
        })
    } catch (error) {
        console.error('PATCH /api/admin/documents/[id] error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// DELETE /api/admin/documents/[id] — delete document + file from storage
export async function DELETE(
    _req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const admin = await isUserAdmin()
        if (!admin) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const { id } = params
        const doc = await prisma.document.findUnique({ where: { id } })

        if (!doc) {
            return NextResponse.json({ error: 'Document not found' }, { status: 404 })
        }

        // Delete from storage first, then DB
        try {
            await deleteFileFromSpaces(doc.storageKey)
        } catch (storageErr) {
            console.error('Failed to delete from storage (proceeding with DB delete):', storageErr)
        }

        await prisma.document.delete({ where: { id } })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('DELETE /api/admin/documents/[id] error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
