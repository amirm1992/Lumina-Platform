import { NextRequest, NextResponse } from 'next/server'
import { isUserAdmin, updateApplicationCreditScore } from '@/utils/admin/api'

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const isAdmin = await isUserAdmin()
    if (!isAdmin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    const ok = await updateApplicationCreditScore(id, {
        credit_score: body.credit_score,
        credit_score_source: body.credit_score_source,
        credit_score_date: body.credit_score_date,
        credit_notes: body.credit_notes
    })
    if (!ok) {
        return NextResponse.json({ error: 'Failed to update credit' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}
