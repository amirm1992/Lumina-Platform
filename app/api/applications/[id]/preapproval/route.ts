import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import { pushToZapier } from '@/lib/zapier'

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

        const { id: applicationId } = await params
        const body = await request.json()

        // Verify the application belongs to this user
        const application = await prisma.application.findFirst({
            where: {
                id: applicationId,
                OR: [
                    { userId },
                    { newUserId: userId },
                ],
            },
        })

        if (!application) {
            return NextResponse.json({ error: 'Application not found' }, { status: 404 })
        }

        // Parse dates safely
        const dateOfBirth = body.date_of_birth ? new Date(body.date_of_birth) : null
        const employmentStartDate = body.employment_start_date ? new Date(body.employment_start_date) : null
        const coBorrowerDob = body.co_borrower_dob ? new Date(body.co_borrower_dob) : null

        // Update the application with all pre-approval fields
        const updatedApp = await prisma.application.update({
            where: { id: applicationId },
            data: {
                // Borrower details
                dateOfBirth,
                maritalStatus: body.marital_status || null,
                firstTimeHomeBuyer: typeof body.first_time_home_buyer === 'boolean' ? body.first_time_home_buyer : null,
                preferredLanguage: body.preferred_language || null,

                // Current residence
                mailingAddress: body.mailing_address || null,
                mailingUnit: body.mailing_unit || null,
                mailingCity: body.mailing_city || null,
                mailingState: body.mailing_state || null,
                mailingZipCode: body.mailing_zip_code || null,
                addressDurationMonths: typeof body.address_duration_months === 'number' ? body.address_duration_months : null,
                housingStatus: body.housing_status || null,

                // Employment details
                employerName: body.employer_name || null,
                employerPosition: body.employer_position || null,
                employerPhone: body.employer_phone || null,
                employmentStartDate,
                selfEmployed: typeof body.self_employed === 'boolean' ? body.self_employed : null,

                // Loan preferences
                downPayment: body.down_payment != null ? body.down_payment : null,
                mortgageType: body.mortgage_type || null,
                loanTerm: typeof body.loan_term === 'number' ? body.loan_term : null,
                amortizationType: body.amortization_type || null,
                numberOfUnits: typeof body.number_of_units === 'number' ? body.number_of_units : null,

                // Co-borrower
                hasCoBorrower: typeof body.has_co_borrower === 'boolean' ? body.has_co_borrower : null,
                coBorrowerFirstName: body.co_borrower_first_name || null,
                coBorrowerLastName: body.co_borrower_last_name || null,
                coBorrowerEmail: body.co_borrower_email || null,
                coBorrowerPhone: body.co_borrower_phone || null,
                coBorrowerDob,

                // Pre-approval tracking
                preApprovalSubmittedAt: new Date(),
                preApprovalComplete: true,
                zapierPushStatus: 'pending',
            },
        })

        // Fire Zapier webhook asynchronously (don't block the response)
        pushToZapier(updatedApp).catch((err) => {
            console.error('[Zapier] Failed to push application:', err)
        })

        return NextResponse.json({
            success: true,
            message: 'Pre-approval submitted successfully',
            applicationId: updatedApp.id,
        })
    } catch (error) {
        console.error('[PreApproval API] Error:', error)
        return NextResponse.json(
            { error: 'Failed to submit pre-approval' },
            { status: 500 }
        )
    }
}
