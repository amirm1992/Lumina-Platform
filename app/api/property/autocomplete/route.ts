import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query')

    if (!query) {
        return NextResponse.json({ suggestions: [] })
    }

    const apiKey = process.env.RAPIDAPI_KEY
    const apiHost = process.env.RAPIDAPI_HOST || 'real-estate101.p.rapidapi.com'

    if (!apiKey) {
        return NextResponse.json({ error: 'API key missing' }, { status: 500 })
    }

    try {
        // Use the search endpoint to find matches
        const apiUrl = `https://${apiHost}/api/search?location=${encodeURIComponent(query)}`

        const response = await fetch(apiUrl, {
            headers: {
                'x-rapidapi-key': apiKey,
                'x-rapidapi-host': apiHost
            },
            next: { revalidate: 3600 }
        })

        if (!response.ok) {
            return NextResponse.json({ suggestions: [] })
        }

        const data = await response.json()
        const properties = data.properties || []

        // Map properties to simplified suggestions
        // We will include the zpid or full address to make the subsequent fetch easier
        const suggestions = properties.map((p: { id?: string, zpid?: string, address: { street: string, city: string, state: string, zipcode: string } }) => ({
            place_id: p.id || p.zpid,
            description: `${p.address.street}, ${p.address.city}, ${p.address.state} ${p.address.zipcode}`,
            structured_formatting: {
                main_text: p.address.street,
                secondary_text: `${p.address.city}, ${p.address.state}`
            }
        }))

        return NextResponse.json({ suggestions })

    } catch (error) {
        console.error('Autocomplete Proxy Error:', error)
        return NextResponse.json({ suggestions: [] })
    }
}
