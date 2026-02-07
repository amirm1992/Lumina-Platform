import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
    const healthCheck = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        database: 'unknown',
        error: null as string | null
    }

    try {
        // Test database connection with a simple query
        const result = await prisma.$queryRaw`SELECT 1 as test`
        healthCheck.database = 'connected'
    } catch (error) {
        healthCheck.status = 'degraded'
        healthCheck.database = 'error'
        healthCheck.error = error instanceof Error ? error.message : 'Unknown database error'
        console.error('Health check database error:', error)
    }

    return NextResponse.json(healthCheck, {
        status: healthCheck.status === 'ok' ? 200 : 503
    })
}
