import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isUserAdmin, createLenderOffer } from '@/utils/admin/api'
import { unauthorized, notFound, badRequest, serverError, success } from '@/utils/admin/responses'

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const isAdmin = await isUserAdmin()
    if (!isAdmin) return unauthorized()

    const { id: applicationId } = await params
    const app = await prisma.application.findUnique({ where: { id: applicationId } })
    if (!app) return notFound('application')

    const body = await request.json()

    // Validation
    if (!body.lender_name || typeof body.lender_name !== 'string' || !body.lender_name.trim()) {
        return badRequest('Lender name is required')
    }
    const rate = Number(body.interest_rate)
    if (body.interest_rate == null || isNaN(rate) || rate <= 0 || rate > 20) {
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

    const offer = await createLenderOffer(applicationId, {
        lender_name: body.lender_name.trim(),
        lender_logo: body.lender_logo,
        interest_rate: rate,
        apr: body.apr ?? undefined,
        monthly_payment: body.monthly_payment ?? undefined,
        loan_term: body.loan_term ?? 30,
        loan_type: body.loan_type || 'conventional',
        points: body.points ?? undefined,
        origination_fee: body.origination_fee ?? undefined,
        closing_costs: body.closing_costs ?? undefined,
        rate_lock_days: body.rate_lock_days ?? undefined,
        rate_lock_expires: body.rate_lock_expires ?? undefined,
        is_recommended: body.is_recommended ?? false,
        is_best_match: body.is_best_match ?? false,
        source: body.source ?? undefined,
        external_id: body.external_id ?? undefined
    })

    if (!offer) return serverError('Failed to create offer')
    return success({ success: true, offer })
}
