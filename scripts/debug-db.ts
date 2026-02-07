import { Pool } from 'pg'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

async function check(name: string, config: any) {
    console.log(`\n🧪 Testing: ${name}`)
    const pool = new Pool({
        ...config,
        connectionTimeoutMillis: 5000,
    })
    try {
        const client = await pool.connect()
        console.log('   ✅ Connected!')
        const res = await client.query('SELECT version()')
        console.log(`   📝 Version: ${res.rows[0].version}`)
        client.release()
        return true
    } catch (error: any) {
        console.log(`   ❌ Failed: ${error.message}`)
        if (error.code) console.log(`   Code: ${error.code}`)
        return false
    } finally {
        await pool.end()
    }
}

async function main() {
    const dbUrl = process.env.DATABASE_URL
    if (!dbUrl) process.exit(1)

    // Clean URL for manual config
    const urlObj = new URL(dbUrl)
    const dbUrlNoParams = dbUrl.split('?')[0]

    // 1. Current Code Strategy
    await check('Current lib/prisma.ts Strategy', {
        connectionString: dbUrl,
        ssl: { rejectUnauthorized: false }
    })

    // 2. CA Cert Strategy (if file exists)
    const caPath = path.resolve(process.cwd(), 'ca-certificate.crt')
    if (fs.existsSync(caPath)) {
        const ca = fs.readFileSync(caPath).toString()
        await check('With CA Cert + rejectUnauthorized: true', {
            connectionString: dbUrlNoParams, // use clean URL to avoid conflict
            ssl: {
                rejectUnauthorized: true,
                ca: ca,
            }
        })
    } else {
        console.log('\n⚠️ ca-certificate.crt not found, skipping CA test')
    }

    // 3. Simple SSL (allow self-signed implicit)
    await check('Simple SSL (ssl: true)', {
        connectionString: dbUrlNoParams,
        ssl: true // usually defaults to rejectUnauthorized: false in older pg, but let's see
    })

    // 4. No Params in URL, Explicit config
    await check('Explicit Config (User/Pass/Host)', {
        user: urlObj.username,
        password: urlObj.password,
        host: urlObj.hostname,
        port: parseInt(urlObj.port),
        database: urlObj.pathname.substring(1), // remove leading slash
        ssl: { rejectUnauthorized: false }
    })
}

main().catch(console.error)
