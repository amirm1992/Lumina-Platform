import { createClient } from '@/utils/supabase/server'
import type {
    Application,
    LenderOffer,
    Profile,
    AdminDashboardStats,
    CreditScoreFormData,
    LenderOfferFormData,
    ApplicationStatusFormData,
    ApplicationStatus
} from '@/types/database'

// ============================================
// AUTH & PERMISSIONS
// ============================================

export async function getCurrentUser() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    return user
}

export async function isUserAdmin(): Promise<boolean> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return false

    const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()

    return profile?.is_admin ?? false
}

export async function getProfile(userId: string): Promise<Profile | null> {
    const supabase = await createClient()
    const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

    return data
}

// ============================================
// DASHBOARD STATS
// ============================================

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
    const supabase = await createClient()

    const today = new Date().toISOString().split('T')[0]

    const [
        { count: total },
        { count: pending },
        { count: in_review },
        { count: offers_ready },
        { count: completed_today }
    ] = await Promise.all([
        supabase.from('applications').select('*', { count: 'exact', head: true }),
        supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', 'in_review'),
        supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', 'offers_ready'),
        supabase.from('applications').select('*', { count: 'exact', head: true })
            .eq('status', 'completed')
            .gte('updated_at', today)
    ])

    return {
        total_applications: total ?? 0,
        pending_count: pending ?? 0,
        in_review_count: in_review ?? 0,
        offers_ready_count: offers_ready ?? 0,
        completed_today: completed_today ?? 0
    }
}

// ============================================
// APPLICATIONS
// ============================================

export async function getApplications(status?: ApplicationStatus): Promise<Application[]> {
    const supabase = await createClient()

    let query = supabase
        .from('applications')
        .select(`
            *,
            profile:profiles(id, email, full_name, phone)
        `)
        .order('created_at', { ascending: false })

    if (status) {
        query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) {
        console.error('Error fetching applications:', error)
        return []
    }

    return data ?? []
}

export async function getApplicationById(id: string): Promise<Application | null> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('applications')
        .select(`
            *,
            profile:profiles(id, email, full_name, phone),
            lender_offers(*)
        `)
        .eq('id', id)
        .single()

    if (error) {
        console.error('Error fetching application:', error)
        return null
    }

    return data
}

export async function updateApplicationCreditScore(
    applicationId: string,
    data: CreditScoreFormData
): Promise<boolean> {
    const supabase = await createClient()

    const { error } = await supabase
        .from('applications')
        .update({
            credit_score: data.credit_score,
            credit_score_source: data.credit_score_source,
            credit_score_date: data.credit_score_date,
            credit_notes: data.credit_notes,
            updated_at: new Date().toISOString()
        })
        .eq('id', applicationId)

    if (error) {
        console.error('Error updating credit score:', error)
        return false
    }

    // Log activity
    await logAdminActivity('updated_credit', 'application', applicationId, data)

    return true
}

export async function updateApplicationStatus(
    applicationId: string,
    data: ApplicationStatusFormData
): Promise<boolean> {
    const supabase = await createClient()

    const updateData: Record<string, unknown> = {
        status: data.status,
        updated_at: new Date().toISOString()
    }

    if (data.admin_notes) {
        updateData.admin_notes = data.admin_notes
    }

    if (data.status === 'offers_ready') {
        updateData.offers_published_at = new Date().toISOString()
    }

    const { error } = await supabase
        .from('applications')
        .update(updateData)
        .eq('id', applicationId)

    if (error) {
        console.error('Error updating application status:', error)
        return false
    }

    await logAdminActivity('changed_status', 'application', applicationId, data)

    return true
}

// ============================================
// LENDER OFFERS
// ============================================

export async function getOffersForApplication(applicationId: string): Promise<LenderOffer[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('lender_offers')
        .select('*')
        .eq('application_id', applicationId)
        .order('is_recommended', { ascending: false })
        .order('interest_rate', { ascending: true })

    if (error) {
        console.error('Error fetching offers:', error)
        return []
    }

    return data ?? []
}

export async function createLenderOffer(
    applicationId: string,
    data: LenderOfferFormData
): Promise<LenderOffer | null> {
    const supabase = await createClient()

    const { data: offer, error } = await supabase
        .from('lender_offers')
        .insert({
            application_id: applicationId,
            ...data
        })
        .select()
        .single()

    if (error) {
        console.error('Error creating offer:', error)
        return null
    }

    await logAdminActivity('created_offer', 'offer', offer.id, data)

    return offer
}

export async function updateLenderOffer(
    offerId: string,
    data: Partial<LenderOfferFormData>
): Promise<boolean> {
    const supabase = await createClient()

    const { error } = await supabase
        .from('lender_offers')
        .update({
            ...data,
            updated_at: new Date().toISOString()
        })
        .eq('id', offerId)

    if (error) {
        console.error('Error updating offer:', error)
        return false
    }

    await logAdminActivity('updated_offer', 'offer', offerId, data)

    return true
}

export async function deleteLenderOffer(offerId: string): Promise<boolean> {
    const supabase = await createClient()

    const { error } = await supabase
        .from('lender_offers')
        .delete()
        .eq('id', offerId)

    if (error) {
        console.error('Error deleting offer:', error)
        return false
    }

    await logAdminActivity('deleted_offer', 'offer', offerId, null)

    return true
}

// ============================================
// ACTIVITY LOG
// ============================================

async function logAdminActivity(
    action: string,
    targetType: 'application' | 'offer' | 'profile',
    targetId: string | null,
    details: unknown
) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return

    await supabase.from('admin_activity_log').insert({
        admin_id: user.id,
        action,
        target_type: targetType,
        target_id: targetId,
        details: details as Record<string, unknown>
    })
}

export async function getRecentActivity(limit: number = 20) {
    const supabase = await createClient()

    const { data } = await supabase
        .from('admin_activity_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit)

    return data ?? []
}
