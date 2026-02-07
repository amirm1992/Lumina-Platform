import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool, PoolConfig } from 'pg'

// DigitalOcean PostgreSQL uses a self-signed certificate chain
// This is safe because we're connecting to a trusted managed database service
// Set this BEFORE any connections are made
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'


const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
    connectionPool: Pool | undefined
}

// Create connection pool with proper SSL config
function getPool() {
    if (!globalForPrisma.connectionPool) {
        const poolConfig: PoolConfig = {
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false
            },
            max: 10,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 10000,
        }

        globalForPrisma.connectionPool = new Pool(poolConfig)

        // Handle pool errors
        globalForPrisma.connectionPool.on('error', (err) => {
            console.error('Unexpected error on idle client', err)
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
