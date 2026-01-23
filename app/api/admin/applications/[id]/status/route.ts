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

    const updateData: Record<string, unknown> = {
        status: body.status,
        admin_notes: body.admin_notes,
        updated_at: new Date().toISOString()
    }

    // Set offers_published_at when status changes to offers_ready
    if (body.status === 'offers_ready') {
        updateData.offers_published_at = new Date().toISOString()
    }

    const { error } = await supabase
        .from('applications')
        .update(updateData)
        .eq('id', id)

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Log activity
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
        await supabase.from('admin_activity_log').insert({
            admin_id: user.id,
            action: 'changed_status',
            target_type: 'application',
            target_id: id,
            details: { status: body.status }
        })
    }

    // TODO: If notify_client is true, send email notification
    // This would integrate with a service like Resend, SendGrid, etc.

    return NextResponse.json({ success: true })
}
