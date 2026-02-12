import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id: disclosureId } = await params
        const body = await request.json()
        const signedName = body.signed_name

        if (!signedName || typeof signedName !== 'string' || signedName.trim().length < 2) {
            return NextResponse.json(
                { error: 'Please provide your full legal name' },
                { status: 400 }
            )
        }

        // Find the disclosure signature record
        const disclosure = await prisma.disclosureSignature.findUnique({
            where: { id: disclosureId },
            include: { application: true },
        })

        if (!disclosure) {
            return NextResponse.json({ error: 'Disclosure not found' }, { status: 404 })
        }

        // Verify the disclosure belongs to this user's application
        const app = disclosure.application
        if (app.userId !== userId && app.newUserId !== userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
        }

        // Already signed
        if (disclosure.status === 'signed') {
            return NextResponse.json({ error: 'This disclosure has already been signed' }, { status: 400 })
        }

        // Get IP address
        const forwarded = request.headers.get('x-forwarded-for')
        const ip = forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown'

        // Sign the disclosure
        const updated = await prisma.disclosureSignature.update({
            where: { id: disclosureId },
            data: {
                signedName: signedName.trim(),
                signedAt: new Date(),
                signedIp: ip,
                status: 'signed',
            },
        })

        return NextResponse.json({
            success: true,
            signature: {
                id: updated.id,
                application_id: updated.applicationId,
                disclosure_type: updated.disclosureType,
                document_id: updated.documentId,
                signed_name: updated.signedName,
                signed_at: updated.signedAt?.toISOString() || null,
                signed_ip: updated.signedIp,
                status: updated.status,
                created_at: updated.createdAt.toISOString(),
                updated_at: updated.updatedAt.toISOString(),
            },
        })
    } catch (error) {
        console.error('[Disclosure Sign] Error:', error)
        return NextResponse.json(
            { error: 'Failed to sign disclosure' },
            { status: 500 }
        )
    }
}
