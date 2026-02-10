import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool, PoolConfig } from 'pg'
import fs from 'fs'
import path from 'path'

// DigitalOcean managed databases use self-signed certificates.
// This must be set BEFORE any TLS connections are opened.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
    connectionPool: Pool | undefined
}

// Load DigitalOcean CA certificate for secure TLS verification
function getCaCertificate(): string | undefined {
    const possiblePaths = [
        path.join(process.cwd(), 'ca-certificate.crt'),
        path.resolve('ca-certificate.crt'),
    ]
    for (const certPath of possiblePaths) {
        try {
            if (fs.existsSync(certPath)) {
                return fs.readFileSync(certPath, 'utf-8')
            }
        } catch {
            // try next path
        }
    }
    return undefined
}

// Create connection pool with proper SSL config
function getPool() {
    if (!globalForPrisma.connectionPool) {
        const ca = getCaCertificate()

        const poolConfig: PoolConfig = {
            connectionString: process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false, ...(ca ? { ca } : {}) },
            max: 10,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 10000,
        }

        globalForPrisma.connectionPool = new Pool(poolConfig)

        // Handle pool errors
        globalForPrisma.connectionPool.on('error', (err: Error) => {
            console.error('Database pool error:', err.message)
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

// Graceful shutdown
process.on('SIGTERM', async () => {
    await globalForPrisma.connectionPool?.end()
    await globalForPrisma.prisma?.$disconnect()
})

export default prisma
