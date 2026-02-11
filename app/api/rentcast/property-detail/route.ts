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

    const apiKey = process.env.RENTCAST_API_KEY
    if (!apiKey) {
        console.error('RENTCAST_API_KEY is not configured')
        return NextResponse.json({ error: 'Service unavailable' }, { status: 503 })
    }

    const headers = {
        'Accept': 'application/json',
        'X-Api-Key': apiKey,
    }

    try {
        // Fetch property records and sale listings in parallel
        const [propertyRes, listingRes] = await Promise.allSettled([
            fetch(`https://api.rentcast.io/v1/properties?address=${encodeURIComponent(address)}`, {
                headers,
                next: { revalidate: 3600 },
            }),
            fetch(`https://api.rentcast.io/v1/listings/sale?address=${encodeURIComponent(address)}`, {
                headers,
                next: { revalidate: 3600 },
            }),
        ])

        // Parse property record data
        let propertyData: Record<string, unknown> | null = null
        if (propertyRes.status === 'fulfilled' && propertyRes.value.ok) {
            const data = await propertyRes.value.json()
            // API returns an array of property records
            const records = Array.isArray(data) ? data : []
            if (records.length > 0) {
                propertyData = records[0]
            }
        }

        // Parse listing data
        let listingData: Record<string, unknown> | null = null
        if (listingRes.status === 'fulfilled' && listingRes.value.ok) {
            const data = await listingRes.value.json()
            const listings = Array.isArray(data) ? data : []
            if (listings.length > 0) {
                listingData = listings[0]
            }
        }

        // We need at least one data source
        if (!propertyData && !listingData) {
            return NextResponse.json({ error: 'Property not found' }, { status: 404 })
        }

        // Merge data — listing data takes priority for price/status/photos
        const property = buildPropertyResponse(address, propertyData, listingData)

        return NextResponse.json(property)
    } catch (error) {
        console.error('RentCast property detail error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch property details' },
            { status: 500 }
        )
    }
}

function buildPropertyResponse(
    originalAddress: string,
    propertyData: Record<string, unknown> | null,
    listingData: Record<string, unknown> | null,
) {
    // Property record fields
    const pAddr = (propertyData?.addressLine1 as string) || ''
    const pCity = (propertyData?.city as string) || ''
    const pState = (propertyData?.state as string) || ''
    const pZip = (propertyData?.zipCode as string) || ''
    const pCounty = (propertyData?.county as string) || ''

    // Listing fields
    const lAddr = (listingData?.addressLine1 as string) || ''
    const lCity = (listingData?.city as string) || ''
    const lState = (listingData?.state as string) || ''
    const lZip = (listingData?.zipCode as string) || ''

    // Photos from listing
    const photos = (listingData?.photos as string[]) || []

    // Price: prefer listing price, fall back to property estimated value
    const listingPrice = listingData?.price as number | undefined
    const estimatedValue = (propertyData?.propertyTaxes as Record<string, unknown>)?.assessedValue as number | undefined
    const price = listingPrice || estimatedValue || null

    // Status from listing
    const listingStatus = (listingData?.status as string) || ''

    return {
        addressLine1: lAddr || pAddr || originalAddress.split(',')[0]?.trim(),
        city: lCity || pCity,
        state: lState || pState,
        zipCode: lZip || pZip,
        county: pCounty || null,
        price,
        status: mapStatus(listingStatus),
        daysOnMarket: (listingData?.daysOnMarket as number) || 0,
        bedrooms: (propertyData?.bedrooms as number) || (listingData?.bedrooms as number) || null,
        bathrooms: (propertyData?.bathrooms as number) || (listingData?.bathrooms as number) || null,
        squareFootage: (propertyData?.squareFootage as number) || (listingData?.squareFootage as number) || null,
        yearBuilt: (propertyData?.yearBuilt as number) || null,
        propertyType: mapPropertyType(
            (propertyData?.propertyType as string) || (listingData?.propertyType as string)
        ),
        lotSize: (propertyData?.lotSize as number) || null,
        imageUrl: photos.length > 0 ? photos[0] : null,
        description: (listingData?.description as string) || null,
    }
}

function mapStatus(status: string): string {
    if (!status) return 'Off Market'
    const s = status.toUpperCase()
    if (s.includes('ACTIVE') || s.includes('FOR_SALE') || s.includes('FOR SALE')) return 'For Sale'
    if (s.includes('PENDING') || s.includes('UNDER CONTRACT') || s.includes('CONTINGENT')) return 'Pending'
    if (s.includes('SOLD') || s.includes('CLOSED')) return 'Sold'
    return 'Off Market'
}

function mapPropertyType(type: string | undefined): string {
    if (!type) return 'Single Family'
    const t = type.toUpperCase()
    if (t.includes('MULTI') || t.includes('DUPLEX') || t.includes('TRIPLEX') || t.includes('QUAD')) return 'Multi-Family'
    if (t.includes('CONDO')) return 'Condo'
    if (t.includes('TOWNHOUSE') || t.includes('TOWN')) return 'Townhouse'
    if (t.includes('APARTMENT')) return 'Apartment'
    if (t.includes('MOBILE') || t.includes('MANUFACTURED')) return 'Mobile Home'
    return 'Single Family'
}
