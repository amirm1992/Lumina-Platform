import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { FINANCIAL_DEFAULTS } from '@/lib/constants'

// FRED series ID for 30-Year Fixed Rate Mortgage Average
const MORTGAGE_RATE_SERIES = 'MORTGAGE30US'
const SYSTEM_METRIC_KEY = 'MORTGAGE_RATE'
const CACHE_WRITE_TIMEOUT_MS = 1500
const DB_READ_TIMEOUT_MS = 2500

interface RateDataPoint {
    date: string
    rate: number
}

interface MortgageRateResponse {
    rate: number
    date: string
    history: RateDataPoint[]
    source: string
    fetchedAt?: string
    isCached?: boolean
    isFallback?: boolean
}

/** Race a promise against a timeout; returns the promise result or rejects on timeout. */
function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
    return Promise.race([
        promise,
        new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms)
        ),
    ])
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const history = searchParams.get('history')
    const apiKey = process.env.FRED_API_KEY

    const limit = history ? 52 : 1

    try {
        let rateData: MortgageRateResponse | null = null

        // 1. Try FRED API if key is present
        if (apiKey) {
            const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${MORTGAGE_RATE_SERIES}&api_key=${apiKey}&file_type=json&sort_order=desc&limit=${limit}`

            const response = await fetch(url, {
                next: { revalidate: 3600 },
            })

            if (response.ok) {
                const data = await response.json()
                const observations: Array<{ date: string; value: string }> = data.observations ?? []

                if (observations.length > 0) {
                    const latestObservation = observations[0]
                    const formattedData: RateDataPoint[] = observations
                        .map((obs) => ({ date: obs.date, rate: parseFloat(obs.value) }))
                        .reverse()

                    rateData = {
                        rate: parseFloat(latestObservation.value),
                        date: latestObservation.date,
                        history: formattedData,
                        source: 'Federal Reserve Bank of St. Louis (FRED)',
                        fetchedAt: new Date().toISOString(),
                    }

                    // 2. Best-effort cache to DB
                    try {
                        await withTimeout(
                            prisma.systemMetric.upsert({
                                where: { key: SYSTEM_METRIC_KEY },
                                update: { value: JSON.parse(JSON.stringify(rateData)) },
                                create: {
                                    key: SYSTEM_METRIC_KEY,
                                    value: JSON.parse(JSON.stringify(rateData)),
                                },
                            }),
                            CACHE_WRITE_TIMEOUT_MS,
                            'Cache write'
                        )
                    } catch (dbError) {
                        console.warn('Failed to cache mortgage rate (non-critical):', dbError)
                    }
                }
            }
        }

        // 3. Fallback to DB cache if API unavailable
        if (!rateData) {
            try {
                const cachedMetric = await withTimeout(
                    prisma.systemMetric.findUnique({ where: { key: SYSTEM_METRIC_KEY } }),
                    DB_READ_TIMEOUT_MS,
                    'DB read'
                )

                if (cachedMetric?.value) {
                    const cached = JSON.parse(JSON.stringify(cachedMetric.value)) as MortgageRateResponse
                    cached.source = `${cached.source || 'Unknown'} (Cached)`
                    cached.isCached = true
                    rateData = cached
                }
            } catch (dbError) {
                console.error('Failed to load mortgage rate from DB:', dbError)
            }
        }

        // 4. Emergency fallback
        if (!rateData) {
            const fallbackRate = FINANCIAL_DEFAULTS.fallbackMortgageRate
            rateData = {
                rate: fallbackRate,
                date: new Date().toISOString().split('T')[0],
                source: 'Emergency Fallback',
                isFallback: true,
                history: Array.from({ length: 30 }, (_, i) => ({
                    date: new Date(Date.now() - i * 7 * 86400000).toISOString().split('T')[0],
                    rate: fallbackRate,
                })).reverse(),
            }
        }

        return NextResponse.json(rateData)
    } catch (error) {
        console.error('Unexpected error in mortgage rate API:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
