import { NextResponse } from 'next/server'

const MAX_ADDRESS_LENGTH = 500

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const rawAddress = searchParams.get('address')

    if (!rawAddress) {
        return NextResponse.json({ error: 'Address is required' }, { status: 400 })
    }

    // Sanitize input: trim, limit length, strip control characters
    const address = rawAddress.trim().replace(/[\x00-\x1f]/g, '').slice(0, MAX_ADDRESS_LENGTH)
    if (address.length < 5) {
        return NextResponse.json({ error: 'Address is too short' }, { status: 400 })
    }

    const apiKey = process.env.RAPIDAPI_KEY
    const apiHost = process.env.RAPIDAPI_HOST || 'real-estate101.p.rapidapi.com'

    if (!apiKey) {
        console.error('RAPIDAPI_KEY is not configured')
        return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
    }

    try {
        // Format address for Zillow URL pattern
        const formattedAddress = address.replace(/,/g, '').replace(/\s+/g, '-') + '_rb'
        const zillowUrl = `https://www.zillow.com/homes/${encodeURIComponent(formattedAddress)}/`

        const apiUrl = `https://${apiHost}/api/search/byurl?url=${encodeURIComponent(zillowUrl)}`

        const response = await fetch(apiUrl, {
            headers: {
                'x-rapidapi-key': apiKey,
                'x-rapidapi-host': apiHost,
            },
            next: { revalidate: 3600 },
        })

        if (!response.ok) {
            throw new Error(`RapidAPI returned status ${response.status}`)
        }

        const data = await response.json()

        if (!data.success && data.error) {
            console.error('RealEstate101 API error:', data.error)
            throw new Error(data.error)
        }

        const properties: Record<string, unknown>[] = data.properties ?? []

        if (properties.length === 0) {
            return NextResponse.json({ error: 'Property not found' }, { status: 404 })
        }

        const zillowData = properties[0] as Record<string, unknown>
        const addr = (zillowData.address ?? {}) as Record<string, string>

        const property = {
            id: zillowData.id || zillowData.zpid,
            addressLine1: addr.street || address.split(',')[0],
            city: addr.city,
            state: addr.state,
            zipCode: addr.zipcode,
            price:
                zillowData.unformattedPrice ||
                (typeof zillowData.price === 'string'
                    ? zillowData.price.replace(/[^0-9]/g, '')
                    : null),
            status: mapZillowStatus(
                zillowData.homeStatus as string | undefined,
                zillowData.marketingStatus as string | undefined
            ),
            daysOnMarket: zillowData.daysOnZillow || 0,
            bedrooms: zillowData.beds,
            bathrooms: zillowData.baths,
            squareFootage: zillowData.area || zillowData.livingArea,
            yearBuilt: zillowData.yearBuilt,
            propertyType: mapHomeType(zillowData.homeType as string | undefined),
            imageUrl: zillowData.imgSrc,
            description: zillowData.statusText,
            lastSeenDate: new Date().toISOString(),
        }

        return NextResponse.json(property)
    } catch (error) {
        console.error('Property detail fetch error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch property details' },
            { status: 500 }
        )
    }
}

function mapZillowStatus(homeStatus: string | undefined, marketingStatus: string | undefined): string {
    const status = (homeStatus || marketingStatus || '').toUpperCase()
    if (status.includes('FOR_SALE') || status.includes('FOR SALE')) return 'For Sale'
    if (status.includes('PENDING') || status.includes('UNDER CONTRACT')) return 'Pending'
    if (status.includes('SOLD')) return 'Sold'
    return 'Off Market'
}

function mapHomeType(type: string | undefined): string {
    if (!type) return 'Single Family'
    if (type.includes('MULTI')) return 'Multi-Family'
    if (type.includes('CONDO')) return 'Condo'
    if (type.includes('TOWNHOUSE')) return 'Townhouse'
    return 'Single Family'
}
