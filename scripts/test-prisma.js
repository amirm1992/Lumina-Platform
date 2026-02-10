const { PrismaClient } = require('@prisma/client')
// Hardcoded connection or load from .env.local
const fs = require('fs')
const path = require('path')

function loadEnv() {
    const envPath = path.join(process.cwd(), '.env.local')
    if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf8')
        content.split('\n').forEach(line => {
            const [key, ...valueParts] = line.split('=')
            if (key && valueParts.length > 0) {
                process.env[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '')
            }
        })
    }
}

loadEnv()

const prisma = new PrismaClient()

async function main() {
    try {
        console.log('Fetching applications...')
        const apps = await prisma.application.findMany({
            take: 5,
            include: { lenderOffers: true }
        })
        console.log('SUCCESS: Fetched', apps.length, 'applications')
        if (apps.length > 0) {
            console.log('Application keys:', Object.keys(apps[0]))
            console.log('PropertyState value:', apps[0].propertyState)
            console.log('LenderOffers count:', apps[0].lenderOffers?.length)
        }
    } catch (err) {
        console.error('ERROR:', err)
        process.exit(1)
    } finally {
        await prisma.$disconnect()
    }
}

main()
