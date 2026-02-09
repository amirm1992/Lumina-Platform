import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import { getDownloadUrl } from '@/lib/storage'

// GET /api/documents/[id]/download — get a signed download URL for the client's own file
export async function GET(
    _req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = params

        const doc = await prisma.document.findUnique({ where: { id } })

        if (!doc) {
            return NextResponse.json({ error: 'Document not found' }, { status: 404 })
        }

        // Strict user-level isolation: clients can only download their own files
        if (doc.userId !== userId) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const url = await getDownloadUrl(doc.storageKey, doc.fileName)

        return NextResponse.json({ url })
    } catch (error) {
        console.error('GET /api/documents/[id]/download error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
