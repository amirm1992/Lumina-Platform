import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isUserAdmin, createLenderOffer } from '@/utils/admin/api'
import { unauthorized, notFound, serverError, success } from '@/utils/admin/responses'

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
    const offer = await createLenderOffer(applicationId, {
        lender_name: body.lender_name,
        lender_logo: body.lender_logo,
        interest_rate: body.interest_rate,
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
