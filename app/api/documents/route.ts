import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import { mapDocument } from '@/lib/mappers'

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
