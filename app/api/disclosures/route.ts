import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import { DISCLOSURE_SLOTS } from '@/types/database'

export const dynamic = 'force-dynamic'

/**
 * GET /api/disclosures
 * Returns all disclosure signature records for the current user's application.
 * If no records exist yet and the application has pre-approval complete,
 * auto-creates pending disclosure records.
 */
export async function GET() {
    try {
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Find user's most recent application
        const application = await prisma.application.findFirst({
            where: {
                OR: [
                    { userId },
                    { newUserId: userId },
                ],
            },
            orderBy: { createdAt: 'desc' },
            include: {
                disclosureSignatures: true,
            },
        })

        if (!application) {
            return NextResponse.json({ disclosures: [], applicationId: null })
        }

        let disclosures = application.disclosureSignatures

        // If pre-approval is complete but no disclosure records exist, create them
        if (application.preApprovalComplete && disclosures.length === 0) {
            const requiredDisclosures = DISCLOSURE_SLOTS.filter(s => s.required)

            await prisma.disclosureSignature.createMany({
                data: requiredDisclosures.map(slot => ({
                    applicationId: application.id,
                    disclosureType: slot.category,
                    status: 'pending_signature',
                })),
            })

            // Re-fetch
            disclosures = await prisma.disclosureSignature.findMany({
                where: { applicationId: application.id },
                orderBy: { createdAt: 'asc' },
            })
        }

        // Map to API format
        const mapped = disclosures.map(d => ({
            id: d.id,
            application_id: d.applicationId,
            disclosure_type: d.disclosureType,
            document_id: d.documentId,
            signed_name: d.signedName,
            signed_at: d.signedAt?.toISOString() || null,
            signed_ip: d.signedIp,
            status: d.status,
            created_at: d.createdAt.toISOString(),
            updated_at: d.updatedAt.toISOString(),
        }))

        return NextResponse.json({
            disclosures: mapped,
            applicationId: application.id,
            preApprovalComplete: application.preApprovalComplete,
        })
    } catch (error) {
        console.error('[Disclosures API] Error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch disclosures' },
            { status: 500 }
        )
    }
}
