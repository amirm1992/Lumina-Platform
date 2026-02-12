const { Pool } = require('pg')
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

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
})

const NEW_FIELDS = [
    'ssn_encrypted',
    'consent_soft_pull',
    'consent_signed_at',
    'consent_signed_name',
    'consent_ip_address'
]

async function main() {
    try {
        console.log('Checking applications table for new fields...')
        const res = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'applications'
            AND column_name = ANY($1)
        `, [NEW_FIELDS])

        const existingFields = res.rows.map(r => r.column_name)
        const missingFields = NEW_FIELDS.filter(f => !existingFields.includes(f))

        if (missingFields.length === 0) {
            console.log('SUCCESS: All new fields exist in DB.')
        } else {
            console.log('FAILURE: Missing fields in DB:', missingFields.join(', '))
        }

        console.log('Existing fields details:', res.rows)

    } catch (err) {
        console.error('ERROR:', err)
    } finally {
        await pool.end()
    }
}

main()
