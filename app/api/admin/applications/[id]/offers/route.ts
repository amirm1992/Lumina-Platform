import { NextRequest, NextResponse } from 'next/server'
import { isUserAdmin, createLenderOffer } from '@/utils/admin/api'

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const isAdmin = await isUserAdmin()
    if (!isAdmin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: applicationId } = await params
    const body = await request.json()

    const offer = await createLenderOffer(applicationId, {
        lender_name: body.lender_name,
        interest_rate: body.interest_rate,
        apr: body.apr ?? undefined,
        monthly_payment: body.monthly_payment ?? undefined,
        loan_term: body.loan_term,
        loan_type: body.loan_type || 'conventional',
        points: body.points ?? 0,
        closing_costs: body.closing_costs ?? undefined,
        is_recommended: body.is_recommended ?? false
    })

    if (!offer) {
        return NextResponse.json({ error: 'Failed to create offer' }, { status: 500 })
    }

    return NextResponse.json({ success: true, offer })
}
