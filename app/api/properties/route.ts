import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

// GET /api/properties — Fetch all properties for the current user
export async function GET() {
    try {
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const properties = await prisma.property.findMany({
            where: { userId },
            orderBy: [
                { isChosen: 'desc' },
                { createdAt: 'desc' },
            ],
        })

        return NextResponse.json({ properties })
    } catch (error) {
        console.error('Error fetching properties:', error)
        return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 })
    }
}

// POST /api/properties — Add a new property
export async function POST(request: Request) {
    try {
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()

        const {
            addressLine1,
            city,
            state,
            zipCode,
            county,
            price,
            bedrooms,
            bathrooms,
            squareFootage,
            yearBuilt,
            propertyType,
            lotSize,
            status,
            imageUrl,
            description,
            daysOnMarket,
        } = body

        if (!addressLine1 || !city || !state || !zipCode) {
            return NextResponse.json(
                { error: 'Address, city, state, and zip code are required' },
                { status: 400 }
            )
        }

        // Link to user's current application (if one exists)
        const application = await prisma.application.findFirst({
            where: {
                OR: [
                    { userId },
                    { newUserId: userId },
                ],
            },
            orderBy: { createdAt: 'desc' },
            select: { id: true },
        })

        const property = await prisma.property.create({
            data: {
                userId,
                applicationId: application?.id || null,
                addressLine1: addressLine1.trim(),
                city: city.trim(),
                state: state.trim().toUpperCase().slice(0, 2),
                zipCode: zipCode.trim(),
                county: county?.trim() || null,
                price: price ? parseFloat(String(price)) : null,
                bedrooms: bedrooms ? parseInt(String(bedrooms)) : null,
                bathrooms: bathrooms ? parseFloat(String(bathrooms)) : null,
                squareFootage: squareFootage ? parseInt(String(squareFootage)) : null,
                yearBuilt: yearBuilt ? parseInt(String(yearBuilt)) : null,
                propertyType: propertyType || null,
                lotSize: lotSize ? parseFloat(String(lotSize)) : null,
                status: status || 'For Sale',
                imageUrl: imageUrl || null,
                description: description || null,
                daysOnMarket: daysOnMarket ? parseInt(String(daysOnMarket)) : null,
            },
        })

        return NextResponse.json({ property }, { status: 201 })
    } catch (error) {
        console.error('Error creating property:', error)
        return NextResponse.json({ error: 'Failed to create property' }, { status: 500 })
    }
}
