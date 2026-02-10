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

async function main() {
    try {
        console.log('Checking applications table structure...')
        const res = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'applications'
            AND column_name = 'property_state'
        `)
        if (res.rows.length > 0) {
            console.log('SUCCESS: Column exists:', res.rows[0])
        } else {
            console.log('FAILURE: Column property_state NOT FOUND in applications table.')
            const allCols = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'applications'")
            console.log('All columns:', allCols.rows.map(r => r.column_name).join(', '))
        }
    } catch (err) {
        console.error('ERROR:', err)
    } finally {
        await pool.end()
    }
}

main()
