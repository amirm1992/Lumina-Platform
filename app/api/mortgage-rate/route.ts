import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// FRED series ID for 30-Year Fixed Rate Mortgage Average
const MORTGAGE_RATE_SERIES = 'MORTGAGE30US'
const SYSTEM_METRIC_KEY = 'MORTGAGE_RATE'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const history = searchParams.get('history')
    const apiKey = process.env.FRED_API_KEY

    // Fetch 1 year (approx 52 weeks) if history is requested, otherwise just latest
    const limit = history ? 52 : 1

    try {
        let rateData

        // 1. Try to fetch from FRED API if key is present
        if (apiKey) {
            const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${MORTGAGE_RATE_SERIES}&api_key=${apiKey}&file_type=json&sort_order=desc&limit=${limit}`

            const response = await fetch(url, {
                next: { revalidate: 3600 } // Cache for 1 hour
            })

            if (response.ok) {
                const data = await response.json()
                if (data.observations && data.observations.length > 0) {
                    // Process data
                    const latestObservation = data.observations[0]
                    const formattedData = data.observations.map((obs: { date: string, value: string }) => ({
                        date: obs.date,
                        rate: parseFloat(obs.value)
                    })).reverse()

                    rateData = {
                        rate: parseFloat(latestObservation.value),
                        date: latestObservation.date,
                        history: formattedData,
                        source: 'Federal Reserve Bank of St. Louis (FRED)',
                        fetchedAt: new Date().toISOString()
                    }

                    // 2. Cache successful fetch to DB (Best effort, with timeout)
                    try {
                        const upsertPromise = prisma.systemMetric.upsert({
                            where: { key: SYSTEM_METRIC_KEY },
                            update: { value: rateData as any },
                            create: {
                                key: SYSTEM_METRIC_KEY,
                                value: rateData as any
                            }
                        })

                        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Cache Write Timeout')), 1500))

                        // @ts-ignore
                        await Promise.race([upsertPromise, timeoutPromise])
                    } catch (dbError) {
                        console.warn('Failed to cache mortgage rate to DB (Non-critical):', dbError)
                    }
                }
            }
        }

        // 3. If no successful API fetch (key missing or API failed), try to load from DB
        if (!rateData) {
            console.warn('FRED API unavailable or key missing, attempting to load from DB cache...')
            try {
                // Race DB with Timeout to prevent hanging on localhost
                const dbCall = prisma.systemMetric.findUnique({ where: { key: SYSTEM_METRIC_KEY } })
                const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 2500))

                // @ts-ignore
                const cachedMetric = await Promise.race([dbCall, timeout])

                if (cachedMetric && cachedMetric.value) {
                    // Start with a clean object copy
                    rateData = JSON.parse(JSON.stringify(cachedMetric.value));

                    // Add flag to indicate cached data safely
                    if (rateData && typeof rateData === 'object') {
                        const rd = rateData as any;
                        rd.source = (rd.source || '') + ' (Cached)';
                        rd.isCached = true;
                    }
                }
            } catch (dbError) {
                console.error('Failed to load mortgage rate from DB:', dbError)
            }
        }

        // 4. If still no data, return Fallback
        // 4. If still no data (DB Down + API Down), return Emergency Last Known Good
        if (!rateData) {
            console.warn('DB and API unavailable. Using emergency hardcoded rate.')
            // Prevent error by returning last known stable rate (6.89%)
            rateData = {
                rate: 6.89,
                date: new Date().toISOString().split('T')[0],
                source: 'Emergency Fallback',
                isFallback: true,
                history: Array.from({ length: 30 }, (_, i) => ({
                    date: new Date(Date.now() - i * 7 * 86400000).toISOString().split('T')[0],
                    rate: 6.89 // Flat line representing last known state
                })).reverse()
            }
        }

        return NextResponse.json(rateData)

    } catch (error) {
        console.error('Unexpected error in mortgage rate API:', error)
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        )
    }
}
