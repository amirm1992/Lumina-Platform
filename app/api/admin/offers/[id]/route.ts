import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isUserAdmin, updateLenderOffer, deleteLenderOffer } from '@/utils/admin/api'
import { unauthorized, notFound, badRequest, serverError, success } from '@/utils/admin/responses'

const VALID_LOAN_TYPES = ['conventional', 'fha', 'va', 'jumbo', 'usda']

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const isAdmin = await isUserAdmin()
        if (!isAdmin) return unauthorized()

        const { id: offerId } = await params
        const existing = await prisma.lenderOffer.findUnique({ where: { id: offerId } })
        if (!existing) return notFound('offer')

        const body = await request.json()

        // Validation
        if (body.lender_name != null && (typeof body.lender_name !== 'string' || !body.lender_name.trim())) {
            return badRequest('Lender name must be a non-empty string')
        }
        if (body.interest_rate != null && (isNaN(Number(body.interest_rate)) || Number(body.interest_rate) <= 0 || Number(body.interest_rate) > 20)) {
            return badRequest('Interest rate must be a number between 0 and 20')
        }
        if (body.apr != null && (isNaN(Number(body.apr)) || Number(body.apr) <= 0 || Number(body.apr) > 25)) {
            return badRequest('APR must be a number between 0 and 25')
        }
        if (body.monthly_payment != null && (isNaN(Number(body.monthly_payment)) || Number(body.monthly_payment) <= 0)) {
            return badRequest('Monthly payment must be a positive number')
        }
        if (body.loan_term != null && ![10, 15, 20, 25, 30].includes(Number(body.loan_term))) {
            return badRequest('Loan term must be 10, 15, 20, 25, or 30 years')
        }
        if (body.loan_type != null && !VALID_LOAN_TYPES.includes(body.loan_type)) {
            return badRequest(`Loan type must be one of: ${VALID_LOAN_TYPES.join(', ')}`)
        }
        if (body.points != null && (isNaN(Number(body.points)) || Number(body.points) < 0)) {
            return badRequest('Points must be a non-negative number')
        }
        if (body.closing_costs != null && (isNaN(Number(body.closing_costs)) || Number(body.closing_costs) < 0)) {
            return badRequest('Closing costs must be a non-negative number')
        }
        if (body.origination_fee != null && (isNaN(Number(body.origination_fee)) || Number(body.origination_fee) < 0)) {
            return badRequest('Origination fee must be a non-negative number')
        }

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
    } catch (error) {
        console.error('Update offer error:', error)
        return serverError('Failed to update offer')
    }
}

export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const isAdmin = await isUserAdmin()
        if (!isAdmin) return unauthorized()

        const { id: offerId } = await params
        const existing = await prisma.lenderOffer.findUnique({ where: { id: offerId } })
        if (!existing) return notFound('offer')

        const ok = await deleteLenderOffer(offerId)
        if (!ok) return serverError('Failed to delete offer')
        return success()
    } catch (error) {
        console.error('Delete offer error:', error)
        return serverError('Failed to delete offer')
    }
}
