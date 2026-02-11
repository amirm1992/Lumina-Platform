import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

// DELETE /api/properties/[id] — Remove a property
export async function DELETE(
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

        await prisma.property.delete({
            where: { id },
        })

        // If this was the chosen property, clear the application address fields
        if (property.isChosen && property.applicationId) {
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

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting property:', error)
        return NextResponse.json({ error: 'Failed to delete property' }, { status: 500 })
    }
}
