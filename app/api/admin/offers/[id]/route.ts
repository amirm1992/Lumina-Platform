import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { isUserAdmin } from '@/utils/admin/api'

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    // Check admin access
    const isAdmin = await isUserAdmin()
    if (!isAdmin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: offerId } = await params
    const body = await request.json()

    const supabase = await createClient()

    const { error } = await supabase
        .from('lender_offers')
        .update({
            lender_name: body.lender_name,
            interest_rate: body.interest_rate,
            apr: body.apr,
            monthly_payment: body.monthly_payment,
            loan_term: body.loan_term,
            loan_type: body.loan_type,
            points: body.points,
            closing_costs: body.closing_costs,
            is_recommended: body.is_recommended,
            updated_at: new Date().toISOString()
        })
        .eq('id', offerId)

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Log activity
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
        await supabase.from('admin_activity_log').insert({
            admin_id: user.id,
            action: 'updated_offer',
            target_type: 'offer',
            target_id: offerId,
            details: body
        })
    }

    return NextResponse.json({ success: true })
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    // Check admin access
    const isAdmin = await isUserAdmin()
    if (!isAdmin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: offerId } = await params

    const supabase = await createClient()

    const { error } = await supabase
        .from('lender_offers')
        .delete()
        .eq('id', offerId)

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Log activity
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
        await supabase.from('admin_activity_log').insert({
            admin_id: user.id,
            action: 'deleted_offer',
            target_type: 'offer',
            target_id: offerId,
            details: null
        })
    }

    return NextResponse.json({ success: true })
}
