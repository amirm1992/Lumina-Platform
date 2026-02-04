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

                    // 2. Cache successful fetch to DB
                    try {
                        await prisma.systemMetric.upsert({
                            where: { key: SYSTEM_METRIC_KEY },
                            update: { value: rateData as any },
                            create: {
                                key: SYSTEM_METRIC_KEY,
                                value: rateData as any
                            }
                        })
                    } catch (dbError) {
                        console.error('Failed to cache mortgage rate to DB:', dbError)
                    }
                }
            }
        }

        // 3. If no successful API fetch (key missing or API failed), try to load from DB
        if (!rateData) {
            console.warn('FRED API unavailable or key missing, attempting to load from DB cache...')
            try {
                const cachedMetric = await prisma.systemMetric.findUnique({
                    where: { key: SYSTEM_METRIC_KEY }
                })

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
        if (!rateData) {
            console.warn('No data available in DB/API. Returning hardcoded fallback.')
            const mockHistory = Array.from({ length: 12 }, (_, i) => ({
                date: new Date(Date.now() - (11 - i) * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                rate: 6.5 + Math.random() * 0.5 - 0.25
            }))

            rateData = {
                rate: 6.89,
                date: new Date().toISOString().split('T')[0],
                history: mockHistory,
                source: 'Fallback (System)',
                description: '30-Year Fixed Rate Mortgage Average (Fallback)',
                isFallback: true
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
