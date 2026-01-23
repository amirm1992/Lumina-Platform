import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { isUserAdmin } from '@/utils/admin/api'

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    // Check admin access
    const isAdmin = await isUserAdmin()
    if (!isAdmin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: applicationId } = await params
    const body = await request.json()

    const supabase = await createClient()

    const { data: offer, error } = await supabase
        .from('lender_offers')
        .insert({
            application_id: applicationId,
            lender_name: body.lender_name,
            interest_rate: body.interest_rate,
            apr: body.apr,
            monthly_payment: body.monthly_payment,
            loan_term: body.loan_term,
            loan_type: body.loan_type,
            points: body.points || 0,
            closing_costs: body.closing_costs,
            is_recommended: body.is_recommended || false
        })
        .select()
        .single()

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Log activity
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
        await supabase.from('admin_activity_log').insert({
            admin_id: user.id,
            action: 'created_offer',
            target_type: 'offer',
            target_id: offer.id,
            details: { lender: body.lender_name, rate: body.interest_rate }
        })
    }

    return NextResponse.json({ success: true, offer })
}
