import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

/**
 * Inbound webhook from Zapier, triggered by Arive events:
 *   - Loan Status Updated
 *   - Loan Date Updated
 *
 * Zapier Zap configuration:
 *   Trigger: ARIVE API → Loan Status Updated (or Loan Date Updated)
 *   Action:  Webhooks by Zapier → POST to this URL
 *
 * Expected payload from Zapier (mapped from Arive fields):
 * {
 *   crmReferenceId: string,          // Lumina application ID
 *   ariveLoanId?: string,            // sysGUID from Arive
 *   ariveDeepLink?: string,          // deepLinkURL from Arive
 *   currentLoanStatus_status?: string,// e.g. PREAPPROVED, DISCLOSURE_SENT, etc.
 *   currentLoanStatus_date?: string,  // status date
 *   keyDates_initialLESentDate?: string,
 *   keyDates_initialLESignedDate?: string,
 *   keyDates_initialCDSentDate?: string,
 *   keyDates_initialCDSignedDate?: string,
 *   keyDates_intentToProceedDate?: string,
 *   keyDates_closingContingency?: string,
 * }
 *
 * Security: Validated via a shared secret in the Authorization header.
 * Set ZAPIER_WEBHOOK_SECRET in .env.local
 */

// Map Arive loan stages to Lumina application statuses
function mapAriveStatusToLumina(ariveStatus: string): string | null {
    const statusMap: Record<string, string> = {
        APPLICATION_INTAKE: 'pending',
        QUALIFICATION: 'in_review',
        PREAPPROVED: 'approved',
        LOAN_SETUP: 'approved',
        DISCLOSURE_SENT: 'approved',
        UNDERWRITING_SUBMITTED: 'in_review',
        APPROVED_WITH_CONDITION: 'approved',
        RE_SUBMITTAL: 'in_review',
        CLEAR_TO_CLOSE: 'offers_ready',
        DOCS_OUT: 'offers_ready',
        DOCS_SIGNED: 'completed',
        LOAN_FUNDED: 'completed',
        BROKER_CHECK_RECEIVED: 'completed',
        COMMISSION_PAID: 'completed',
        ADVERSE: 'denied',
        SUSPENDED: 'cancelled',
    }
    return statusMap[ariveStatus] || null
}

export async function POST(request: NextRequest) {
    try {
        // Verify webhook secret
        const secret = process.env.ZAPIER_WEBHOOK_SECRET
        if (secret) {
            const authHeader = request.headers.get('authorization')
            if (authHeader !== `Bearer ${secret}`) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
            }
        }

        const body = await request.json()

        // Must have a crmReferenceId to identify the Lumina application
        const applicationId = body.crmReferenceId
        if (!applicationId) {
            return NextResponse.json(
                { error: 'Missing crmReferenceId' },
                { status: 400 }
            )
        }

        // Find the application
        const application = await prisma.application.findUnique({
            where: { id: applicationId },
        })

        if (!application) {
            return NextResponse.json(
                { error: `Application not found: ${applicationId}` },
                { status: 404 }
            )
        }

        // Build update payload
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const updateData: Record<string, any> = {}

        // Arive identifiers
        if (body.ariveLoanId) {
            updateData.ariveLoanId = body.ariveLoanId
        }
        if (body.ariveDeepLink) {
            updateData.ariveDeepLink = body.ariveDeepLink
        }

        // Status mapping
        if (body.currentLoanStatus_status) {
            const luminaStatus = mapAriveStatusToLumina(body.currentLoanStatus_status)
            if (luminaStatus) {
                updateData.status = luminaStatus
            }
        }

        // Confirm Zapier connection is working
        if (application.zapierPushStatus === 'sent') {
            updateData.zapierPushStatus = 'confirmed'
        }

        // Update the application
        if (Object.keys(updateData).length > 0) {
            await prisma.application.update({
                where: { id: applicationId },
                data: updateData,
            })
        }

        // Log key dates for future disclosure tracking
        const keyDates = {
            initialLESentDate: body.keyDates_initialLESentDate || null,
            initialLESignedDate: body.keyDates_initialLESignedDate || null,
            initialCDSentDate: body.keyDates_initialCDSentDate || null,
            initialCDSignedDate: body.keyDates_initialCDSignedDate || null,
            intentToProceedDate: body.keyDates_intentToProceedDate || null,
            closingContingency: body.keyDates_closingContingency || null,
        }

        console.log(`[Arive Webhook] Updated application ${applicationId}`, {
            ariveStatus: body.currentLoanStatus_status,
            luminaStatus: updateData.status,
            keyDates,
        })

        return NextResponse.json({
            success: true,
            applicationId,
            updated: Object.keys(updateData),
        })
    } catch (error) {
        console.error('[Arive Webhook] Error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
