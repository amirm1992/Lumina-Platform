/**
 * Centralized data mappers for converting Prisma models to API response types.
 * Single source of truth — eliminates duplicate mappers across the codebase.
 */
import type {
    Application,
    LenderOffer,
    Profile,
    Document,
    DocumentCategory,
    ApplicationStatus,
} from '@/types/database'

// ============================================
// Prisma model type definitions (from generated client)
// These represent the raw shape returned by Prisma queries
// ============================================

interface PrismaProfile {
    id: string
    email: string | null
    fullName: string | null
    phone: string | null
    isAdmin: boolean
    createdAt: Date
    updatedAt: Date
}

interface PrismaLenderOffer {
    id: string
    applicationId: string
    lenderName: string
    lenderLogo: string | null
    productName: string | null
    loanType: string | null
    interestRate: { toNumber(): number } | number | null
    apr: { toNumber(): number } | number | null
    monthlyPayment: { toNumber(): number } | number | null
    closingCosts: { toNumber(): number } | number | null
    points: { toNumber(): number } | number | null
    originationFee: { toNumber(): number } | number | null
    loanTerm: number | null
    rateLockDays: number | null
    rateLockExpires: Date | null
    isRecommended: boolean
    isBestMatch: boolean
    isVisible: boolean
    source: string | null
    externalId: string | null
    createdAt: Date
    updatedAt: Date
}

interface PrismaApplication {
    id: string
    userId: string | null
    productType: string | null
    propertyType: string | null
    propertyUsage: string | null
    propertyState: string | null
    propertyValue: { toNumber(): number } | number | null
    loanAmount: { toNumber(): number } | number | null
    zipCode: string | null
    employmentStatus: string | null
    annualIncome: { toNumber(): number } | number | null
    liquidAssets: { toNumber(): number } | number | null
    creditScore: number | null
    creditScoreSource: string | null
    creditScoreDate: Date | null
    creditNotes: string | null
    dtiRatio: { toNumber(): number } | number | null
    status: string
    adminNotes: string | null
    createdAt: Date
    updatedAt: Date
    offersPublishedAt: Date | null
    lenderOffers?: PrismaLenderOffer[]
}

interface PrismaDocument {
    id: string
    userId: string
    applicationId: string | null
    category: string
    fileName: string
    storageKey: string
    fileSize: number | null
    mimeType: string | null
    uploadedBy: string
    uploadedByName: string | null
    status: string
    adminNotes: string | null
    createdAt: Date
    updatedAt: Date
}

// ============================================
// Helpers
// ============================================

/** Safely convert a Prisma Decimal or number to a plain number. */
function toNum(val: { toNumber(): number } | number | null | undefined): number | null {
    if (val == null) return null
    return typeof val === 'number' ? val : val.toNumber()
}

function toISOString(date: Date | null | undefined): string {
    return date?.toISOString() ?? new Date().toISOString()
}

function toDateString(date: Date | null | undefined): string | null {
    if (!date) return null
    return date.toISOString().slice(0, 10)
}

// ============================================
// Mappers
// ============================================

export function mapProfile(p: PrismaProfile): Profile {
    return {
        id: p.id,
        email: p.email,
        full_name: p.fullName ?? null,
        phone: p.phone ?? null,
        is_admin: p.isAdmin,
        created_at: toISOString(p.createdAt),
        updated_at: toISOString(p.updatedAt),
    }
}

export function mapLenderOffer(o: PrismaLenderOffer): LenderOffer {
    return {
        id: o.id,
        application_id: o.applicationId,
        lender_name: o.lenderName,
        lender_logo: o.lenderLogo ?? null,
        interest_rate: toNum(o.interestRate) ?? 0,
        apr: toNum(o.apr),
        monthly_payment: toNum(o.monthlyPayment),
        loan_term: o.loanTerm ?? null,
        loan_type: (o.loanType || o.productName) as LenderOffer['loan_type'],
        points: toNum(o.points) ?? 0,
        origination_fee: toNum(o.originationFee),
        closing_costs: toNum(o.closingCosts),
        rate_lock_days: o.rateLockDays ?? null,
        rate_lock_expires: toDateString(o.rateLockExpires),
        is_recommended: o.isRecommended,
        is_best_match: o.isBestMatch,
        source: o.source ?? null,
        external_id: o.externalId ?? null,
        created_at: toISOString(o.createdAt),
        updated_at: toISOString(o.updatedAt),
    }
}

export function mapApplication(a: PrismaApplication): Application {
    return {
        id: a.id,
        user_id: a.userId ?? '',
        product_type: a.productType as Application['product_type'],
        property_type: a.propertyType as Application['property_type'],
        property_usage: a.propertyUsage as Application['property_usage'],
        property_state: a.propertyState ?? null,
        property_value: toNum(a.propertyValue),
        loan_amount: toNum(a.loanAmount),
        zip_code: a.zipCode,
        employment_status: a.employmentStatus,
        annual_income: toNum(a.annualIncome),
        liquid_assets: toNum(a.liquidAssets),
        credit_score: a.creditScore,
        credit_score_source: a.creditScoreSource as Application['credit_score_source'],
        credit_score_date: toDateString(a.creditScoreDate),
        credit_notes: a.creditNotes,
        dti_ratio: toNum(a.dtiRatio),
        status: a.status as ApplicationStatus,
        admin_notes: a.adminNotes ?? null,
        created_at: toISOString(a.createdAt),
        updated_at: toISOString(a.updatedAt),
        offers_published_at: a.offersPublishedAt?.toISOString() ?? null,
        lender_offers: a.lenderOffers?.map(mapLenderOffer) ?? [],
    }
}

export function mapDocument(d: PrismaDocument): Document {
    return {
        id: d.id,
        user_id: d.userId,
        application_id: d.applicationId,
        category: d.category as DocumentCategory,
        file_name: d.fileName,
        storage_key: d.storageKey,
        file_size: d.fileSize,
        mime_type: d.mimeType,
        uploaded_by: d.uploadedBy as Document['uploaded_by'],
        uploaded_by_name: d.uploadedByName,
        status: d.status as Document['status'],
        admin_notes: d.adminNotes,
        created_at: toISOString(d.createdAt),
        updated_at: toISOString(d.updatedAt),
    }
}
