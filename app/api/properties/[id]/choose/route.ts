import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

// POST /api/properties/[id]/choose — Mark a property as the chosen one
export async function POST(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params

        // Verify the property belongs to this user
        const property = await prisma.property.findFirst({
            where: { id, userId },
        })

        if (!property) {
            return NextResponse.json({ error: 'Property not found' }, { status: 404 })
        }

        // If already chosen, un-choose it
        if (property.isChosen) {
            const updated = await prisma.property.update({
                where: { id },
                data: { isChosen: false },
            })

            // Clear the application address fields
            if (property.applicationId) {
                await prisma.application.update({
                    where: { id: property.applicationId },
                    data: {
                        propertyAddress: null,
                        propertyCity: null,
                        propertyState: null,
                        propertyCounty: null,
                        zipCode: null,
                        propertyValue: null,
                    },
                })
            }

            return NextResponse.json({ property: updated })
        }

        // Transaction: un-choose all others, choose this one, update application
        const result = await prisma.$transaction(async (tx) => {
            // Un-choose all other properties for this user
            await tx.property.updateMany({
                where: { userId, isChosen: true },
                data: { isChosen: false },
            })

            // Choose this property
            const chosenProperty = await tx.property.update({
                where: { id },
                data: { isChosen: true },
            })

            // Update the linked application with property data
            if (chosenProperty.applicationId) {
                await tx.application.update({
                    where: { id: chosenProperty.applicationId },
                    data: {
                        propertyAddress: chosenProperty.addressLine1,
                        propertyCity: chosenProperty.city,
                        propertyState: chosenProperty.state,
                        propertyCounty: chosenProperty.county,
                        zipCode: chosenProperty.zipCode,
                        propertyValue: chosenProperty.price,
                    },
                })
            }

            return chosenProperty
        })

        return NextResponse.json({ property: result })
    } catch (error) {
        console.error('Error choosing property:', error)
        return NextResponse.json({ error: 'Failed to set chosen property' }, { status: 500 })
    }
}
