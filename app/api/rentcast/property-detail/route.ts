import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get('address')

    if (!address) {
        return NextResponse.json({ error: 'Address is required' }, { status: 400 })
    }

    const apiKey = process.env.RAPIDAPI_KEY
    const apiHost = process.env.RAPIDAPI_HOST || 'real-estate101.p.rapidapi.com'

    if (!apiKey) {
        return NextResponse.json({ error: 'RapidAPI key not configured' }, { status: 500 })
    }

    try {
        // Format address for Zillow URL: "5500-Grand-Lake-Dr,-San-Antonio,-TX-78244"
        // 1. Remove commas 
        // 2. Replace spaces with hyphens
        // 3. Ensure commas before City and State if possible, or just standard Zillow Search format
        // Zillow Search URL Pattern: https://www.zillow.com/homes/ADDRESS_rb/
        // Simple formatter: Replace spaces with hyphens, commas with hyphens or keep commas and encode? 
        // Best bet: "5500-Grand-Lake-Dr,-San-Antonio,-TX-78244"

        const formattedAddress = address.replace(/,/g, '').replace(/\s+/g, '-') + '_rb'
        const zillowUrl = `https://www.zillow.com/homes/${formattedAddress}/`

        const apiUrl = `https://${apiHost}/api/search/byurl?url=${encodeURIComponent(zillowUrl)}`

        const response = await fetch(apiUrl, {
            headers: {
                'x-rapidapi-key': apiKey,
                'x-rapidapi-host': apiHost
            },
            next: { revalidate: 3600 }
        })

        if (!response.ok) {
            throw new Error(`RapidAPI error: ${response.status}`)
        }

        const data = await response.json()

        if (!data.success && data.error) {
            console.error('RealEstate101 API Logic Error:', data.error)
            // If simple URL fails, try strict "City-State" search URL logic or fail gracefully
            throw new Error(data.error)
        }

        const properties = data.properties || []

        if (properties.length === 0) {
            return NextResponse.json({ error: 'Property not found' }, { status: 404 })
        }

        // Take the first result (Best Match)
        const zillowData = properties[0]

        // Map Zillow Data to our Property Interface
        const property = {
            id: zillowData.id || zillowData.zpid,
            addressLine1: zillowData.address?.street || address.split(',')[0],
            city: zillowData.address?.city,
            state: zillowData.address?.state,
            zipCode: zillowData.address?.zipcode,
            price: zillowData.unformattedPrice || zillowData.price?.replace(/[^0-9]/g, '') || null,
            status: mapZillowStatus(zillowData.homeStatus, zillowData.marketingStatus),
            daysOnMarket: zillowData.daysOnZillow || 0,
            bedrooms: zillowData.beds,
            bathrooms: zillowData.baths,
            squareFootage: zillowData.area || zillowData.livingArea,
            yearBuilt: zillowData.yearBuilt, // Might not be in search result, check details?
            propertyType: mapHomeType(zillowData.homeType),
            imageUrl: zillowData.imgSrc,
            description: zillowData.statusText, // Fallback
            lastSeenDate: new Date().toISOString()
        }

        return NextResponse.json(property)

    } catch (error) {
        console.error('RealEstate101 API fetch error:', error)
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
