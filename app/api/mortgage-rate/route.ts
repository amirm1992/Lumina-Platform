import { NextResponse } from 'next/server'

// FRED series ID for 30-Year Fixed Rate Mortgage Average
const MORTGAGE_RATE_SERIES = 'MORTGAGE30US'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const history = searchParams.get('history')
    const apiKey = process.env.FRED_API_KEY

    // Fetch 1 year (approx 52 weeks) if history is requested, otherwise just latest
    const limit = history ? 52 : 1

    if (!apiKey) {
        // Return fallback data if API key is not configured
        const mockHistory = Array.from({ length: 12 }, (_, i) => ({
            date: new Date(Date.now() - (11 - i) * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            rate: 6.5 + Math.random() * 0.5 - 0.25
        }))

        return NextResponse.json({
            rate: 6.89,
            date: new Date().toISOString().split('T')[0],
            history: mockHistory,
            source: 'Fallback (FRED API key missing)',
            description: '30-Year Fixed Rate Mortgage Average (Fallback)',
            isFallback: true
        })
    }

    try {
        const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${MORTGAGE_RATE_SERIES}&api_key=${apiKey}&file_type=json&sort_order=desc&limit=${limit}`

        const response = await fetch(url, {
            next: { revalidate: 3600 } // Cache for 1 hour
        })

        if (!response.ok) {
            throw new Error(`FRED API error: ${response.status}`)
        }

        const data = await response.json()

        if (!data.observations || data.observations.length === 0) {
            throw new Error('No rate data available')
        }

        // Process data for chart (FRED returns descending by date)
        const formattedData = data.observations.map((obs: { date: string, value: string }) => ({
            date: obs.date, // YYYY-MM-DD
            rate: parseFloat(obs.value)
        })).reverse() // Recharts usually prefers ascending date order

        const latestObservation = data.observations[0]

        return NextResponse.json({
            rate: parseFloat(latestObservation.value),
            date: latestObservation.date,
            history: formattedData,
            source: 'Federal Reserve Bank of St. Louis (FRED)',
            seriesId: MORTGAGE_RATE_SERIES,
            description: '30-Year Fixed Rate Mortgage Average',
            fetchedAt: new Date().toISOString()
        })
    } catch (error) {
        console.error('FRED API fetch error:', error)
        // Fallback mock data for dev/error states
        const mockHistory = Array.from({ length: 12 }, (_, i) => ({
            date: new Date(Date.now() - (11 - i) * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            rate: 6.5 + Math.random() * 0.5 - 0.25
        }))

        return NextResponse.json(
            {
                error: 'Failed to fetch mortgage rate',
                rate: 6.89,
                date: new Date().toISOString().split('T')[0],
                history: mockHistory,
                source: 'Fallback (FRED unavailable)',
                isFallback: true
            },
            { status: 200 }
        )
    }
}
