export interface Property {
    id: string
    userId: string
    applicationId?: string | null
    addressLine1: string
    city: string
    state: string
    zipCode: string
    county?: string | null
    price: number | null
    bedrooms?: number | null
    bathrooms?: number | null
    squareFootage?: number | null
    yearBuilt?: number | null
    propertyType?: string | null
    lotSize?: number | null
    status?: string | null
    imageUrl?: string | null
    description?: string | null
    daysOnMarket?: number | null
    isChosen: boolean
    createdAt: string
    updatedAt: string
}

export interface MapboxSuggestion {
    id: string
    fullAddress: string
    street: string
    city: string
    state: string
    zipCode: string
    county: string
    coordinates: [number, number] | null
}
