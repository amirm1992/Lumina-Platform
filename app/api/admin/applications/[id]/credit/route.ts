import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isUserAdmin, updateApplicationCreditScore } from '@/utils/admin/api'
import { unauthorized, notFound, badRequest, serverError, success } from '@/utils/admin/responses'

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const isAdmin = await isUserAdmin()
    if (!isAdmin) return unauthorized()

    const { id } = await params
    const app = await prisma.application.findUnique({ where: { id } })
    if (!app) return notFound('application')

    const body = await request.json()

    // Validation
    const score = Number(body.credit_score)
    if (!body.credit_score || isNaN(score) || score < 300 || score > 850) {
        return badRequest('Credit score must be a number between 300 and 850')
    }
    const validSources = ['self_reported', 'soft_pull', 'hard_pull', 'estimated']
    if (body.credit_score_source && !validSources.includes(body.credit_score_source)) {
        return badRequest(`Credit score source must be one of: ${validSources.join(', ')}`)
    }
    if (body.credit_score_date && isNaN(Date.parse(body.credit_score_date))) {
        return badRequest('Credit score date must be a valid date')
    }

    const ok = await updateApplicationCreditScore(id, {
        credit_score: score,
        credit_score_source: body.credit_score_source,
        credit_score_date: body.credit_score_date,
        credit_notes: body.credit_notes
    })
    if (!ok) return serverError('Failed to update credit')
    return success()
}
