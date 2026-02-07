import { NextRequest, NextResponse } from 'next/server'
import { isUserAdmin, updateLenderOffer, deleteLenderOffer } from '@/utils/admin/api'

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const isAdmin = await isUserAdmin()
    if (!isAdmin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: offerId } = await params
    const body = await request.json()

    const ok = await updateLenderOffer(offerId, {
        lender_name: body.lender_name,
        interest_rate: body.interest_rate,
        apr: body.apr,
        monthly_payment: body.monthly_payment,
        loan_term: body.loan_term,
        closing_costs: body.closing_costs,
        is_recommended: body.is_recommended
    })
    if (!ok) {
        return NextResponse.json({ error: 'Failed to update offer' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}

export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const isAdmin = await isUserAdmin()
    if (!isAdmin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: offerId } = await params

    const ok = await deleteLenderOffer(offerId)
    if (!ok) {
        return NextResponse.json({ error: 'Failed to delete offer' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}
