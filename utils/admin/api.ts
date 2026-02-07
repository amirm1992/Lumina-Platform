import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/utils/supabase/server' // Keep for Storage
import type {
    Application,
    LenderOffer,
    Profile,
    AdminDashboardStats,
    CreditScoreFormData,
    LenderOfferFormData,
    ApplicationStatusFormData,
    ApplicationStatus,
    Document
} from '@/types/database'

// ============================================
// HELPERS (Data Mapping)
// ============================================

function mapProfile(p: any): Profile {
    return {
        id: p.id,
        email: p.email,
        full_name: p.fullName || null,
        phone: p.phone || null,
        is_admin: p.isAdmin || false,
        created_at: p.createdAt?.toISOString() || new Date().toISOString(),
        updated_at: p.updatedAt?.toISOString() || new Date().toISOString()
    }
}

function mapApplication(a: any): Application {
    return {
        id: a.id,
        user_id: a.userId || '', // Handle null
        product_type: a.productType as any,
        property_type: a.propertyType as any,
        property_usage: a.propertyUsage as any,
        property_value: a.propertyValue ? Number(a.propertyValue) : null,
        loan_amount: a.loanAmount ? Number(a.loanAmount) : null,
        zip_code: a.zipCode,
        employment_status: a.employmentStatus,
        annual_income: a.annualIncome ? Number(a.annualIncome) : null,
        liquid_assets: a.liquidAssets ? Number(a.liquidAssets) : null,
        credit_score: a.creditScore,
        credit_score_source: a.creditScoreSource as any,
        credit_score_date: a.creditScoreDate?.toISOString() || null,
        credit_notes: a.creditNotes,
        dti_ratio: a.dtiRatio ? Number(a.dtiRatio) : null,
        status: a.status as ApplicationStatus,
        admin_notes: a.adminNotes || null,
        created_at: a.createdAt?.toISOString() || new Date().toISOString(),
        updated_at: a.updatedAt?.toISOString() || new Date().toISOString(),
        offers_published_at: a.offersPublishedAt?.toISOString() || null,
        // Relations
        lender_offers: a.lenderOffers?.map(mapLenderOffer) || [],
        // Profile must be attached manually if not included
    }
}

function mapLenderOffer(o: any): LenderOffer {
    return {
        id: o.id,
        application_id: o.applicationId,
        lender_name: o.lenderName,
        lender_nmls: null, // Schema doesn't have this?
        product_name: o.productName,
        interest_rate: o.interestRate ? Number(o.interestRate) : 0,
        apr: o.apr ? Number(o.apr) : null,
        monthly_payment: o.monthlyPayment ? Number(o.monthlyPayment) : null,
        loan_term: o.loanTerm,
        loan_type: null, // Schema mismatch?
        points: 0, // Schema mismatch?
        origination_fee: null,
        closing_costs: o.closingCosts ? Number(o.closingCosts) : null,
        rate_lock_days: null,
        rate_lock_expires: null,
        is_recommended: o.isRecommended || false,
        admin_notes: null,
        is_best_match: o.isBestMatch || false, // Specific to Prisma schema
        is_visible: o.isVisible || true,      // Specific to Prisma schema
        // Missing fields in Prisma schema: loan_type, points, origination_fee
        // We set defaults for now to satisfy TS interface
        created_at: o.createdAt?.toISOString(),
        updated_at: o.updatedAt?.toISOString()
    } as any // Cast as any because of minor type mismatches between Schema and UI Type
}

// ============================================
// AUTH & PERMISSIONS
// ============================================

export async function getCurrentUser() {
    return await currentUser()
}

export async function isUserAdmin(): Promise<boolean> {
    const user = await currentUser()
    if (!user) return false

    const email = user.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress
    if (!email) return false

    // Check Prisma Profile
    const profile = await prisma.profile.findFirst({
        where: { email }
    })

    return profile?.isAdmin ?? false
}

export async function getProfile(userId: string): Promise<Profile | null> {
    const profile = await prisma.profile.findUnique({
        where: { id: userId } // Assuming userId maps to Profile ID
    })

    // Fallback: search by User ID if linked? 
    // Schema says Profile id matches Auth ID.

    if (!profile) return null
    return mapProfile(profile)
}

// ============================================
// DASHBOARD STATS
// ============================================

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [total, pending, in_review, offers_ready, completed_today] = await Promise.all([
        prisma.application.count(),
        prisma.application.count({ where: { status: 'pending' } }),
        prisma.application.count({ where: { status: 'in_review' } }),
        prisma.application.count({ where: { status: 'offers_ready' } }),
        prisma.application.count({
            where: {
                status: 'completed',
                updatedAt: { gte: today }
            }
        })
    ])

    return {
        total_applications: total,
        pending_count: pending,
        in_review_count: in_review,
        offers_ready_count: offers_ready,
        completed_today: completed_today
    }
}

// ============================================
// APPLICATIONS
// ============================================

export async function getApplications(status?: ApplicationStatus): Promise<Application[]> {
    const where = status ? { status } : {}

    const apps = await prisma.application.findMany({
        where,
        orderBy: { createdAt: 'desc' }
    })

    // Fetch profiles for these apps (since userId is string, no relation)
    const userIds = apps.map(a => a.userId).filter(Boolean) as string[]
    const profiles = await prisma.profile.findMany({
        where: { id: { in: userIds } }
    })
    const profileMap = new Map(profiles.map(p => [p.id, mapProfile(p)]))

    return apps.map(app => {
        const mapped = mapApplication(app)
        if (app.userId && profileMap.has(app.userId)) {
            mapped.profile = profileMap.get(app.userId)
        }
        return mapped
    })
}

export async function getApplicationById(id: string): Promise<Application | null> {
    const app = await prisma.application.findUnique({
        where: { id },
        include: { lenderOffers: true }
    })

    if (!app) return null

    const mapped = mapApplication(app)

    if (app.userId) {
        const profile = await prisma.profile.findUnique({
            where: { id: app.userId }
        })
        if (profile) {
            mapped.profile = mapProfile(profile)
        }
    }

    return mapped
}

export async function updateApplicationCreditScore(
    applicationId: string,
    data: CreditScoreFormData
): Promise<boolean> {
    try {
        await prisma.application.update({
            where: { id: applicationId },
            data: {
                creditScore: data.credit_score,
                creditScoreSource: data.credit_score_source,
                creditScoreDate: new Date(data.credit_score_date),
                creditNotes: data.credit_notes
            }
        })
        await logAdminActivity('updated_credit', 'application', applicationId, data)
        return true
    } catch (e) {
        console.error(e)
        return false
    }
}

export async function updateApplicationStatus(
    applicationId: string,
    data: ApplicationStatusFormData
): Promise<boolean> {
    try {
        const updateData: any = {
            status: data.status,
            adminNotes: data.admin_notes
        }

        if (data.status === 'offers_ready') {
            updateData.offersPublishedAt = new Date()
        }

        await prisma.application.update({
            where: { id: applicationId },
            data: updateData
        })
        await logAdminActivity('changed_status', 'application', applicationId, data)
        return true
    } catch (e) {
        console.error(e)
        return false
    }
}

// ============================================
// LENDER OFFERS
// ============================================

export async function getOffersForApplication(applicationId: string): Promise<LenderOffer[]> {
    const offers = await prisma.lenderOffer.findMany({
        where: { applicationId },
        orderBy: [
            { isRecommended: 'desc' },
            { interestRate: 'asc' }
        ]
    })
    return offers.map(mapLenderOffer)
}

export async function createLenderOffer(
    applicationId: string,
    data: LenderOfferFormData
): Promise<LenderOffer | null> {
    try {
        const offer = await prisma.lenderOffer.create({
            data: {
                applicationId,
                lenderName: data.lender_name,
                productName: data.loan_type, // Mapping loan_type to productName temporarily
                interestRate: data.interest_rate,
                apr: data.apr,
                monthlyPayment: data.monthly_payment,
                loanTerm: data.loan_term,
                closingCosts: data.closing_costs,
                isRecommended: data.is_recommended || false
            }
        })
        await logAdminActivity('created_offer', 'offer', offer.id, data)
        return mapLenderOffer(offer)
    } catch (e) {
        console.error(e)
        return null
    }
}

export async function updateLenderOffer(
    offerId: string,
    data: Partial<LenderOfferFormData>
): Promise<boolean> {
    try {
        const updateData: any = {}
        if (data.lender_name) updateData.lenderName = data.lender_name
        if (data.interest_rate) updateData.interestRate = data.interest_rate
        if (data.apr) updateData.apr = data.apr
        if (data.monthly_payment) updateData.monthlyPayment = data.monthly_payment
        if (data.loan_term) updateData.loanTerm = data.loan_term
        if (data.closing_costs) updateData.closingCosts = data.closing_costs
        if (data.is_recommended !== undefined) updateData.isRecommended = data.is_recommended

        await prisma.lenderOffer.update({
            where: { id: offerId },
            data: updateData
        })
        await logAdminActivity('updated_offer', 'offer', offerId, data)
        return true
    } catch (e) {
        console.error(e)
        return false
    }
}

export async function deleteLenderOffer(offerId: string): Promise<boolean> {
    try {
        await prisma.lenderOffer.delete({ where: { id: offerId } })
        await logAdminActivity('deleted_offer', 'offer', offerId, null)
        return true
    } catch (e) {
        console.error(e)
        return false
    }
}

// ============================================
// DOCUMENTS (Keeping Supabase for Storage)
// ============================================

export async function getDocuments(applicationId: string): Promise<Document[]> {
    // Documents table is presumably in Supabase/Postgres.
    // If it's a table, we should use Prisma if mapped.
    // Checking schema... schema.prisma does NOT have a Document model!

    // Fallback: Query "documents" table via Supabase Client (might fail RLS)
    // OR: Check if schema has it.
    // I read schema.prisma, it has User, Account, Session, Profile, Application, LenderOffer, AdminActivityLog, SystemMetric.
    // It DOES NOT have "Document".

    // Conclusion: "documents" table might exist in DB but not in Prisma Schema.
    // Or it was missed.
    // If so, I MUST use Supabase Client to query it.

    const supabase = await createClient()
    const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('application_id', applicationId)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching documents:', error)
        return []
    }
    return (data as any[]) ?? []
}

export async function uploadDocument(
    applicationId: string,
    userId: string,
    file: File,
    category: 'lender_doc' | 'client_upload' | 'disclosure' = 'lender_doc'
): Promise<Document | null> {
    const supabase = await createClient()

    // 1. Upload to Storage
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}_${file.name.replace(/\s/g, '_')}`
    const filePath = `${userId}/${fileName}`

    const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file)

    if (uploadError) {
        console.error('Error uploading file:', uploadError)
        return null
    }

    // 2. Insert into Database (documents table)
    // Since 'documents' is not in Prisma, we use supabase client
    const { data, error: insertError } = await supabase
        .from('documents')
        .insert({
            application_id: applicationId,
            user_id: userId,
            file_name: file.name,
            file_path: filePath,
            file_size: file.size,
            file_type: fileExt,
            category,
            // uploaded_by: needs ID.
        })
        .select()
        .single()

    if (insertError) {
        console.error('Error saving document record:', insertError)
        return null
    }

    return data as any
}

// ... deleteDocument similarly ...

export async function deleteDocument(documentId: string, filePath: string): Promise<boolean> {
    const supabase = await createClient()

    // 1. Delete from Storage
    const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([filePath])

    if (storageError) console.error(storageError)

    // 2. Delete from Database
    const { error: dbError } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId)

    if (dbError) return false
    return true
}


// ============================================
// ADMIN LOGS
// ============================================

async function logAdminActivity(
    action: string,
    targetType: 'application' | 'offer' | 'profile',
    targetId: string | null,
    details: unknown
) {
    try {
        const user = await currentUser()
        if (!user) return

        // Need admin ID (Profile ID). 
        const email = user.emailAddresses[0]?.emailAddress
        const profile = await prisma.profile.findFirst({ where: { email } })

        if (profile) {
            await prisma.adminActivityLog.create({
                data: {
                    adminId: profile.id,
                    action,
                    targetType,
                    targetId,
                    details: details as any
                }
            })
        }
    } catch (e) {
        console.error('Failed to log activity', e)
    }
}

export async function getRecentActivity(limit: number = 20) {
    const logs = await prisma.adminActivityLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: limit
    })

    return logs.map(l => ({
        id: l.id,
        admin_id: l.adminId, // camel to snake
        action: l.action,
        target_type: l.targetType as any,
        target_id: l.targetId,
        details: l.details ? JSON.parse(JSON.stringify(l.details)) : null,
        created_at: l.createdAt.toISOString()
    }))
}
