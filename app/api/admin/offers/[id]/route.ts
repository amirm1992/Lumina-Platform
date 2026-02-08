import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isUserAdmin, updateLenderOffer, deleteLenderOffer } from '@/utils/admin/api'
import { unauthorized, notFound, serverError, success } from '@/utils/admin/responses'

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const isAdmin = await isUserAdmin()
    if (!isAdmin) return unauthorized()

    const { id: offerId } = await params
    const existing = await prisma.lenderOffer.findUnique({ where: { id: offerId } })
    if (!existing) return notFound('offer')

    const body = await request.json()
    const ok = await updateLenderOffer(offerId, {
        lender_name: body.lender_name,
        lender_logo: body.lender_logo,
        interest_rate: body.interest_rate,
        apr: body.apr,
        monthly_payment: body.monthly_payment,
        loan_term: body.loan_term,
        loan_type: body.loan_type,
        points: body.points,
        origination_fee: body.origination_fee,
        closing_costs: body.closing_costs,
        rate_lock_days: body.rate_lock_days,
        rate_lock_expires: body.rate_lock_expires,
        is_recommended: body.is_recommended,
        is_best_match: body.is_best_match
    })
    if (!ok) return serverError('Failed to update offer')
    return success()
}

export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const isAdmin = await isUserAdmin()
    if (!isAdmin) return unauthorized()

    const { id: offerId } = await params
    const existing = await prisma.lenderOffer.findUnique({ where: { id: offerId } })
    if (!existing) return notFound('offer')

    const ok = await deleteLenderOffer(offerId)
    if (!ok) return serverError('Failed to delete offer')
    return success()
}
