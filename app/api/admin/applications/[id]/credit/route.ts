import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isUserAdmin, updateApplicationCreditScore } from '@/utils/admin/api'
import { unauthorized, notFound, serverError, success } from '@/utils/admin/responses'

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
    const ok = await updateApplicationCreditScore(id, {
        credit_score: body.credit_score,
        credit_score_source: body.credit_score_source,
        credit_score_date: body.credit_score_date,
        credit_notes: body.credit_notes
    })
    if (!ok) return serverError('Failed to update credit')
    return success()
}
