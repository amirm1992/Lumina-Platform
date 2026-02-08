import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
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
        lender_logo: o.lenderLogo ?? null,
        interest_rate: o.interestRate ? Number(o.interestRate) : 0,
        apr: o.apr != null ? Number(o.apr) : null,
        monthly_payment: o.monthlyPayment != null ? Number(o.monthlyPayment) : null,
        loan_term: o.loanTerm ?? null,
        loan_type: (o.loanType || o.productName) ?? null,
        points: o.points != null ? Number(o.points) : 0,
        origination_fee: o.originationFee != null ? Number(o.originationFee) : null,
        closing_costs: o.closingCosts != null ? Number(o.closingCosts) : null,
        rate_lock_days: o.rateLockDays ?? null,
        rate_lock_expires: o.rateLockExpires ? new Date(o.rateLockExpires).toISOString().slice(0, 10) : null,
        is_recommended: o.isRecommended ?? false,
        is_best_match: o.isBestMatch ?? false,
        source: o.source ?? null,
        external_id: o.externalId ?? null,
        created_at: o.createdAt?.toISOString() ?? new Date().toISOString(),
        updated_at: o.updatedAt?.toISOString() ?? new Date().toISOString()
    }
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

export type ApplicationListSort = 'created_at' | 'updated_at' | 'status'
export type ApplicationOffersFilter = 'all' | 'incomplete' | 'none'

export interface GetApplicationsOptions {
    status?: ApplicationStatus
    search?: string
    sortBy?: ApplicationListSort
    sortOrder?: 'asc' | 'desc'
    offersFilter?: ApplicationOffersFilter
}

export async function getApplications(
    options?: ApplicationStatus | GetApplicationsOptions
): Promise<Application[]> {
    const opts: GetApplicationsOptions =
        typeof options === 'string' || options == null
            ? { status: typeof options === 'string' ? options : undefined }
            : options

    const where = opts.status ? { status: opts.status } : {}
    const orderByField =
        opts.sortBy === 'updated_at'
            ? 'updatedAt'
            : opts.sortBy === 'status'
              ? 'status'
              : 'createdAt'
    const orderBy = { [orderByField]: opts.sortOrder ?? 'desc' }

    const apps = await prisma.application.findMany({
        where,
        include: { lenderOffers: true },
        orderBy
    })

    const userIds = apps.map(a => a.userId).filter(Boolean) as string[]
    const profiles = await prisma.profile.findMany({
        where: { id: { in: userIds } }
    })
    const profileMap = new Map(profiles.map(p => [p.id, mapProfile(p)]))

    let results = apps.map(app => {
        const mapped = mapApplication(app)
        if (app.userId && profileMap.has(app.userId)) {
            mapped.profile = profileMap.get(app.userId)
        }
        return mapped
    })

    if (opts.search?.trim()) {
        const q = opts.search.trim().toLowerCase()
        results = results.filter(app => {
            const profile = app.profile as { full_name?: string; email?: string } | undefined
            const matchName = profile?.full_name?.toLowerCase().includes(q)
            const matchEmail = profile?.email?.toLowerCase().includes(q)
            const matchId = app.id.toLowerCase().includes(q)
            return matchName || matchEmail || matchId
        })
    }

    if (opts.offersFilter === 'incomplete') {
        results = results.filter(app => (app.lender_offers?.length ?? 0) < 6)
    } else if (opts.offersFilter === 'none') {
        results = results.filter(app => (app.lender_offers?.length ?? 0) === 0)
    }

    return results
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
                lenderLogo: data.lender_logo,
                productName: data.loan_type,
                loanType: data.loan_type,
                interestRate: data.interest_rate,
                apr: data.apr,
                monthlyPayment: data.monthly_payment,
                loanTerm: data.loan_term,
                closingCosts: data.closing_costs,
                points: data.points,
                originationFee: data.origination_fee,
                rateLockDays: data.rate_lock_days,
                rateLockExpires: data.rate_lock_expires ? new Date(data.rate_lock_expires) : undefined,
                isRecommended: data.is_recommended ?? false,
                isBestMatch: data.is_best_match ?? false,
                source: data.source ?? 'manual',
                externalId: data.external_id
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
        if (data.lender_name !== undefined) updateData.lenderName = data.lender_name
        if (data.interest_rate !== undefined) updateData.interestRate = data.interest_rate
        if (data.apr !== undefined) updateData.apr = data.apr
        if (data.monthly_payment !== undefined) updateData.monthlyPayment = data.monthly_payment
        if (data.loan_term !== undefined) updateData.loanTerm = data.loan_term
        if (data.closing_costs !== undefined) updateData.closingCosts = data.closing_costs
        if (data.points !== undefined) updateData.points = data.points
        if (data.origination_fee !== undefined) updateData.originationFee = data.origination_fee
        if (data.rate_lock_days !== undefined) updateData.rateLockDays = data.rate_lock_days
        if (data.rate_lock_expires !== undefined) updateData.rateLockExpires = data.rate_lock_expires ? new Date(data.rate_lock_expires) : null
        if (data.loan_type !== undefined) {
            updateData.loanType = data.loan_type
            updateData.productName = data.loan_type
        }
        if (data.is_recommended !== undefined) updateData.isRecommended = data.is_recommended
        if (data.is_best_match !== undefined) updateData.isBestMatch = data.is_best_match
        if (data.lender_logo !== undefined) updateData.lenderLogo = data.lender_logo
        if (data.source !== undefined) updateData.source = data.source
        if (data.external_id !== undefined) updateData.externalId = data.external_id

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
// DOCUMENTS (stub until Document model + storage added)
// ============================================

export async function getDocuments(_applicationId: string): Promise<Document[]> {
    return []
}

export async function uploadDocument(
    _applicationId: string,
    _userId: string,
    _file: File,
    _category: 'lender_doc' | 'client_upload' | 'disclosure' = 'lender_doc'
): Promise<Document | null> {
    return null
}

export async function deleteDocument(_documentId: string, _filePath: string): Promise<boolean> {
    return false
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
