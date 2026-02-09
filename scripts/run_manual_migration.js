const fs = require('fs')
const path = require('path')
const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
const { Pool } = require('pg')

// NOTE: Use the CA certificate for secure TLS in production.
// Only disable TLS verification for local development when CA cert is unavailable.
if (process.env.NODE_ENV !== 'production' && !process.env.CA_CERT_PATH) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
    console.warn('⚠️  TLS verification disabled (development only)')
}

// Manually parse .env and .env.local
function loadEnv() {
    const files = ['.env', '.env.local']
    let loaded = false

    for (const file of files) {
        try {
            const envPath = path.join(process.cwd(), file)
            if (fs.existsSync(envPath)) {
                console.log(`Loading environment from ${file}...`)
                const content = fs.readFileSync(envPath, 'utf8')
                const lines = content.split('\n')
                for (const line of lines) {
                    const match = line.match(/^([^=]+)=(.*)$/)
                    if (match) {
                        const key = match[1].trim()
                        let value = match[2].trim()
                        // Remove quotes if present
                        if (value.startsWith('"') && value.endsWith('"')) {
                            value = value.slice(1, -1)
                        }
                        if (!process.env[key]) {
                            process.env[key] = value
                        }
                    }
                }
                loaded = true
            }
        } catch (e) {
            console.error(`Failed to load ${file}:`, e)
        }
    }
    return loaded
}

loadEnv()

async function main() {
    console.log('Running manual migration with pg adapter...')

    const connectionString = process.env.DATABASE_URL
    console.log('DB URL found:', !!connectionString ? 'Yes' : 'No')

    if (!connectionString) {
        console.error('ERROR: DATABASE_URL is still missing. Checked .env and .env.local')
        process.exit(1)
    }

    const pool = new Pool({
        connectionString,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 10000
    })

    const adapter = new PrismaPg(pool)
    const prisma = new PrismaClient({ adapter })

    try {
        await prisma.$executeRawUnsafe(`ALTER TABLE "lender_offers" ADD COLUMN IF NOT EXISTS "loan_type" TEXT;`)
        console.log(' - Added loan_type')
        await prisma.$executeRawUnsafe(`ALTER TABLE "lender_offers" ADD COLUMN IF NOT EXISTS "points" DECIMAL(65,30);`)
        console.log(' - Added points')
        await prisma.$executeRawUnsafe(`ALTER TABLE "lender_offers" ADD COLUMN IF NOT EXISTS "origination_fee" DECIMAL(65,30);`)
        console.log(' - Added origination_fee')
        await prisma.$executeRawUnsafe(`ALTER TABLE "lender_offers" ADD COLUMN IF NOT EXISTS "rate_lock_days" INTEGER;`)
        console.log(' - Added rate_lock_days')
        await prisma.$executeRawUnsafe(`ALTER TABLE "lender_offers" ADD COLUMN IF NOT EXISTS "rate_lock_expires" DATE;`)
        console.log(' - Added rate_lock_expires')
        await prisma.$executeRawUnsafe(`ALTER TABLE "lender_offers" ADD COLUMN IF NOT EXISTS "source" TEXT DEFAULT 'manual';`)
        console.log(' - Added source')
        await prisma.$executeRawUnsafe(`ALTER TABLE "lender_offers" ADD COLUMN IF NOT EXISTS "external_id" TEXT;`)
        console.log(' - Added external_id')
        console.log('Migration completed successfully.')
    } catch (e) {
        console.error('Migration failed:', e)
    } finally {
        await prisma.$disconnect()
        await pool.end()
    }
}

main()
