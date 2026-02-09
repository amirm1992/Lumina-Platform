import { NextResponse } from 'next/server'

interface PropertyAddress {
    street: string
    city: string
    state: string
    zipcode: string
}

interface PropertyResult {
    id?: string
    zpid?: string
    address: PropertyAddress
}

const MAX_QUERY_LENGTH = 200

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const rawQuery = searchParams.get('query')

    if (!rawQuery) {
        return NextResponse.json({ suggestions: [] })
    }

    // Sanitize and validate input
    const query = rawQuery.trim().slice(0, MAX_QUERY_LENGTH)
    if (query.length < 2) {
        return NextResponse.json({ suggestions: [] })
    }

    const apiKey = process.env.RAPIDAPI_KEY
    const apiHost = process.env.RAPIDAPI_HOST || 'real-estate101.p.rapidapi.com'

    if (!apiKey) {
        console.error('RAPIDAPI_KEY is not configured')
        return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
    }

    try {
        const apiUrl = `https://${apiHost}/api/search?location=${encodeURIComponent(query)}`

        const response = await fetch(apiUrl, {
            headers: {
                'x-rapidapi-key': apiKey,
                'x-rapidapi-host': apiHost,
            },
            next: { revalidate: 3600 },
        })

        if (!response.ok) {
            return NextResponse.json({ suggestions: [] })
        }

        const data = await response.json()
        const properties: PropertyResult[] = data.properties ?? []

        const suggestions = properties.map((p) => ({
            place_id: p.id || p.zpid,
            description: `${p.address.street}, ${p.address.city}, ${p.address.state} ${p.address.zipcode}`,
            structured_formatting: {
                main_text: p.address.street,
                secondary_text: `${p.address.city}, ${p.address.state}`,
            },
        }))

        return NextResponse.json({ suggestions })
    } catch (error) {
        console.error('Autocomplete Proxy Error:', error)
        return NextResponse.json({ suggestions: [] })
    }
}
