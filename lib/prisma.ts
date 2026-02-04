import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
    connectionPool: Pool | undefined
}

// Create connection pool
function getPool() {
    if (!globalForPrisma.connectionPool) {
        globalForPrisma.connectionPool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false }
        })
    }
    return globalForPrisma.connectionPool
}

// Create Prisma client with adapter
function createPrismaClient() {
    const pool = getPool()
    const adapter = new PrismaPg(pool)
    return new PrismaClient({
        adapter,
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma
}

export default prisma
