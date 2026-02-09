import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { mapProfile, mapApplication, mapLenderOffer, mapDocument } from '@/lib/mappers'
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

    // Check Prisma Profile (email has @unique constraint in schema)
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
        const parsedDate = data.credit_score_date ? new Date(data.credit_score_date) : null
        // Guard against Invalid Date
        const creditScoreDate = parsedDate && !isNaN(parsedDate.getTime()) ? parsedDate : null

        await prisma.application.update({
            where: { id: applicationId },
            data: {
                creditScore: data.credit_score,
                creditScoreSource: data.credit_score_source,
                creditScoreDate: creditScoreDate,
                creditNotes: data.credit_notes
            }
        })
        await logAdminActivity('updated_credit', 'application', applicationId, data)
        return true
    } catch (e) {
        console.error('Failed to update credit score:', e)
        return false
    }
}

export async function updateApplicationStatus(
    applicationId: string,
    data: ApplicationStatusFormData
): Promise<boolean> {
    try {
        const updateData: {
            status: string
            adminNotes?: string
            offersPublishedAt?: Date
        } = {
            status: data.status,
            adminNotes: data.admin_notes,
        }

        if (data.status === 'offers_ready') {
            updateData.offersPublishedAt = new Date()
        }

        await prisma.application.update({
            where: { id: applicationId },
            data: updateData,
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
        const updateData: Record<string, unknown> = {}
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
            data: updateData,
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
// DOCUMENTS (using centralized mapDocument from lib/mappers)
// ============================================

export async function getDocumentsForUser(userId: string): Promise<Document[]> {
    const docs = await prisma.document.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    })
    return docs.map(mapDocument)
}

export async function getDocumentsForApplication(applicationId: string): Promise<Document[]> {
    const docs = await prisma.document.findMany({
        where: { applicationId },
        orderBy: { createdAt: 'desc' },
    })
    return docs.map(mapDocument)
}

export async function updateDocumentStatus(
    documentId: string,
    status: 'pending_review' | 'approved' | 'rejected',
    adminNotes?: string
): Promise<boolean> {
    try {
        await prisma.document.update({
            where: { id: documentId },
            data: { status, adminNotes },
        })
        await logAdminActivity('updated_document_status', 'application', documentId, { status, adminNotes })
        return true
    } catch (e) {
        console.error('Failed to update document status:', e)
        return false
    }
}

export async function deleteDocument(documentId: string): Promise<boolean> {
    try {
        const doc = await prisma.document.findUnique({ where: { id: documentId } })
        if (!doc) return false

        // Delete from storage
        const { deleteFileFromSpaces } = await import('@/lib/storage')
        try {
            await deleteFileFromSpaces(doc.storageKey)
        } catch (storageErr) {
            console.error('Storage delete failed (continuing with DB delete):', storageErr)
        }

        await prisma.document.delete({ where: { id: documentId } })
        await logAdminActivity('deleted_document', 'application', documentId, { fileName: doc.fileName })
        return true
    } catch (e) {
        console.error('Failed to delete document:', e)
        return false
    }
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

        // Use primary email address for consistency with isUserAdmin()
        const email = user.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress || user.emailAddresses[0]?.emailAddress
        const profile = await prisma.profile.findFirst({ where: { email } })

        if (profile) {
            await prisma.adminActivityLog.create({
                data: {
                    adminId: profile.id,
                    action,
                    targetType,
                    targetId,
                    details: details ? JSON.parse(JSON.stringify(details)) : null,
                },
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
        admin_id: l.adminId,
        action: l.action,
        target_type: l.targetType as 'application' | 'offer' | 'profile' | null,
        target_id: l.targetId,
        details: l.details ? JSON.parse(JSON.stringify(l.details)) as Record<string, unknown> : null,
        created_at: l.createdAt.toISOString(),
    }))
}
