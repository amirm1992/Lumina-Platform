export interface Property {
    id: string
    addressLine1: string
    city: string
    state: string
    zipCode: string
    price: number
    status: 'For Sale' | 'Pending' | 'Sold' | 'Off Market'
    daysOnMarket?: number
    bedrooms?: number
    bathrooms?: number
    squareFootage?: number
    yearBuilt?: number
    propertyType?: string
    imageUrl?: string
    description?: string
    lastSeenDate?: string
}
