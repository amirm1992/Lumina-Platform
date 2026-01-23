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

    const { id } = await params
    const body = await request.json()

    const supabase = await createClient()

    const { error } = await supabase
        .from('applications')
        .update({
            credit_score: body.credit_score,
            credit_score_source: body.credit_score_source,
            credit_score_date: body.credit_score_date,
            credit_notes: body.credit_notes,
            updated_at: new Date().toISOString()
        })
        .eq('id', id)

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Log activity
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
        await supabase.from('admin_activity_log').insert({
            admin_id: user.id,
            action: 'updated_credit',
            target_type: 'application',
            target_id: id,
            details: body
        })
    }

    return NextResponse.json({ success: true })
}
