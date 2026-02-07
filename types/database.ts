// Database types for Admin Portal MVP
// These types mirror the Prisma schema

export type ApplicationStatus = 'pending' | 'in_review' | 'offers_ready' | 'completed' | 'cancelled'

export type ProductType = 'purchase' | 'refinance' | 'heloc'

export type PropertyType = 'single_family' | 'condo' | 'townhouse' | 'multi_family' | 'other'

export type PropertyUsage = 'primary' | 'secondary' | 'investment'

export type LoanType = 'conventional' | 'fha' | 'va' | 'jumbo' | 'usda'

export type CreditScoreSource = 'experian' | 'equifax' | 'transunion' | 'tri_merge'

// Profile (extends auth.users)
export interface Profile {
    id: string
    email: string | null
    full_name: string | null
    phone: string | null
    is_admin: boolean
    created_at: string
    updated_at: string
}

// Application (client submission + admin data)
export interface Application {
    id: string
    user_id: string

    // Client-submitted data
    product_type: ProductType | null
    property_type: PropertyType | null
    property_usage: PropertyUsage | null
    property_value: number | null
    loan_amount: number | null
    zip_code: string | null
    employment_status: string | null
    annual_income: number | null
    liquid_assets: number | null

    // Admin-entered data
    credit_score: number | null
    credit_score_source: CreditScoreSource | null
    credit_score_date: string | null
    credit_notes: string | null
    dti_ratio: number | null

    // Status & workflow
    status: ApplicationStatus
    admin_notes: string | null

    // Timestamps
    created_at: string
    updated_at: string
    offers_published_at: string | null

    // Joined data (optional)
    profile?: Profile
    lender_offers?: LenderOffer[]
}

// Lender Offer
export interface LenderOffer {
    id: string
    application_id: string

    // Lender info
    lender_name: string
    lender_logo?: string | null // Logo URL
    lender_nmls: string | null

    // Loan terms
    interest_rate: number
    apr: number | null
    monthly_payment: number | null
    loan_term: number | null // 15, 20, 30
    loan_type: LoanType | null

    // Costs
    points: number
    origination_fee: number | null
    closing_costs: number | null

    // Rate lock
    rate_lock_days: number | null
    rate_lock_expires: string | null

    // Admin flags
    is_recommended: boolean
    admin_notes: string | null

    // Timestamps
    created_at: string
    updated_at: string
}

// Admin Activity Log
export interface AdminActivityLog {
    id: string
    admin_id: string
    action: string
    target_type: 'application' | 'offer' | 'profile'
    target_id: string | null
    details: Record<string, unknown> | null
    created_at: string
}

// Form types for admin inputs
export interface CreditScoreFormData {
    credit_score: number
    credit_score_source: CreditScoreSource
    credit_score_date: string
    credit_notes?: string
}

export interface LenderOfferFormData {
    lender_name: string
    lender_logo?: string
    lender_nmls?: string
    interest_rate: number
    apr?: number
    monthly_payment?: number
    loan_term: number
    loan_type: LoanType
    points?: number
    origination_fee?: number
    closing_costs?: number
    rate_lock_days?: number
    is_recommended?: boolean
    admin_notes?: string
}

export interface ApplicationStatusFormData {
    status: ApplicationStatus
    admin_notes?: string
}

// Stats for admin dashboard
export interface AdminDashboardStats {
    total_applications: number
    pending_count: number
    in_review_count: number
    offers_ready_count: number
    completed_today: number
}

// Documents
export interface Document {
    id: string
    application_id: string
    user_id: string
    file_name: string
    file_path: string
    file_size: number | null
    file_type: string | null
    category: 'lender_doc' | 'client_upload' | 'disclosure'
    status: 'pending' | 'verified'
    uploaded_by: string
    created_at: string
    updated_at: string
}
