import { NextRequest, NextResponse } from 'next/server'
import { isUserAdmin } from '@/utils/admin/api'
import prisma from '@/lib/prisma'
import { mapDocument } from '@/lib/mappers'

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

        const where: { userId?: string; applicationId?: string } = {}
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
