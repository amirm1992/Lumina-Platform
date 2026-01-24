import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { isUserAdmin } from '@/utils/admin/api'
import { sendStatusUpdateEmail, EmailStatus } from '@/utils/email/send-email'

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

    // Fetch application and profile data for email notification
    const { data: application } = await supabase
        .from('applications')
        .select('user_id')
        .eq('id', id)
        .single()

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

    // Send email notification if requested and user has profile
    if (body.notify_client && application?.user_id) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('email, full_name')
            .eq('id', application.user_id)
            .single()

        if (profile?.email) {
            await sendStatusUpdateEmail({
                to: profile.email,
                name: profile.full_name || 'Valued Client',
                status: body.status as EmailStatus,
                applicationId: id,
            })
        }
    }

    return NextResponse.json({ success: true })
}
