import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
    const healthCheck = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        database: 'unknown',
    }

    try {
        await prisma.$queryRaw`SELECT 1 as test`
        healthCheck.database = 'connected'
    } catch (error) {
        healthCheck.status = 'degraded'
        healthCheck.database = 'error'
        // Don't leak database error details to public endpoint
        console.error('Health check database error:', error)
    }

    return NextResponse.json(healthCheck, {
        status: healthCheck.status === 'ok' ? 200 : 503
    })
}
