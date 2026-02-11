import { NextResponse } from 'next/server'

const MAX_QUERY_LENGTH = 200

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const rawQuery = searchParams.get('query')

    if (!rawQuery) {
        return NextResponse.json({ suggestions: [] })
    }

    const query = rawQuery.trim().slice(0, MAX_QUERY_LENGTH)
    if (query.length < 3) {
        return NextResponse.json({ suggestions: [] })
    }

    const accessToken = process.env.MAPBOX_ACCESS_TOKEN
    if (!accessToken) {
        console.error('MAPBOX_ACCESS_TOKEN is not configured')
        return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
    }

    try {
        // Use Mapbox Geocoding v6 for address autocomplete (US only)
        const url = new URL('https://api.mapbox.com/search/geocode/v6/forward')
        url.searchParams.set('q', query)
        url.searchParams.set('access_token', accessToken)
        url.searchParams.set('country', 'US')
        url.searchParams.set('types', 'address')
        url.searchParams.set('limit', '5')
        url.searchParams.set('autocomplete', 'true')

        const response = await fetch(url.toString(), {
            next: { revalidate: 300 }, // Cache for 5 minutes
        })

        if (!response.ok) {
            console.error('Mapbox API error:', response.status)
            return NextResponse.json({ suggestions: [] })
        }

        const data = await response.json()
        const features = data.features || []

        const suggestions = features.map((feature: {
            id: string
            properties: {
                full_address?: string
                name?: string
                context?: {
                    place?: { name?: string }
                    region?: { name?: string; region_code?: string }
                    postcode?: { name?: string }
                    district?: { name?: string }
                }
            }
            geometry: {
                coordinates: [number, number]
            }
        }) => {
            const props = feature.properties
            const context = props.context || {}

            return {
                id: feature.id,
                fullAddress: props.full_address || props.name || '',
                street: props.name || '',
                city: context.place?.name || '',
                state: context.region?.region_code || context.region?.name || '',
                zipCode: context.postcode?.name || '',
                county: context.district?.name || '',
                coordinates: feature.geometry?.coordinates || null,
            }
        })

        return NextResponse.json({ suggestions })
    } catch (error) {
        console.error('Mapbox Autocomplete Error:', error)
        return NextResponse.json({ suggestions: [] })
    }
}
