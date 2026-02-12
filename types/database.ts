// Database types for Admin Portal MVP
// These types mirror the Prisma schema

export type ApplicationStatus = 'pending' | 'in_review' | 'approved' | 'offers_ready' | 'completed' | 'denied' | 'cancelled'

export type ProductType = 'purchase' | 'refinance' | 'heloc'

export type PropertyType = 'single_family' | 'condo' | 'townhouse' | 'multi_family' | 'other'

export type PropertyUsage = 'primary' | 'secondary' | 'investment'

export type LoanType = 'conventional' | 'fha' | 'va' | 'jumbo' | 'usda'

export type MortgageType = 'conventional' | 'fha' | 'va' | 'jumbo'

export type AmortizationType = 'fixed' | 'arm'

export type MaritalStatus = 'married' | 'unmarried' | 'separated'

export type HousingStatus = 'own' | 'rent' | 'rent_free'

export type ZapierPushStatus = 'pending' | 'sent' | 'confirmed' | 'failed'

export type DisclosureType =
    | 'disclosure_le'
    | 'disclosure_til'
    | 'disclosure_intent_to_proceed'
    | 'disclosure_credit_auth'
    | 'disclosure_econsent'
    | 'disclosure_state'

export type DisclosureSignatureStatus = 'pending_signature' | 'signed' | 'expired'

export type CreditScoreSource = 'self_reported' | 'soft_pull' | 'hard_pull' | 'estimated'

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
    property_state: string | null
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

    // SSN & credit consent
    ssn_encrypted: string | null
    consent_soft_pull: boolean
    consent_signed_at: string | null
    consent_signed_name: string | null
    consent_ip_address: string | null

    dti_ratio: number | null

    // ── 1003 Borrower Details (Pre-Approval Modal) ──
    date_of_birth: string | null
    marital_status: MaritalStatus | null
    first_time_home_buyer: boolean | null
    preferred_language: string | null

    // ── Current Mailing Address ──
    mailing_address: string | null
    mailing_unit: string | null
    mailing_city: string | null
    mailing_state: string | null
    mailing_zip_code: string | null
    address_duration_months: number | null
    housing_status: HousingStatus | null

    // ── Employment Details ──
    employer_name: string | null
    employer_position: string | null
    employer_phone: string | null
    employment_start_date: string | null
    self_employed: boolean | null

    // ── Loan Preferences ──
    down_payment: number | null
    mortgage_type: MortgageType | null
    loan_term: number | null
    amortization_type: AmortizationType | null
    number_of_units: number | null

    // ── Co-Borrower ──
    has_co_borrower: boolean | null
    co_borrower_first_name: string | null
    co_borrower_last_name: string | null
    co_borrower_email: string | null
    co_borrower_phone: string | null
    co_borrower_dob: string | null

    // ── Arive / Zapier Integration ──
    arive_loan_id: string | null
    arive_deep_link: string | null
    zapier_push_status: ZapierPushStatus | null
    zapier_pushed_at: string | null

    // ── Pre-Approval ──
    pre_approval_submitted_at: string | null
    pre_approval_complete: boolean

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
    disclosure_signatures?: DisclosureSignature[]
}

// Lender Offer
export interface LenderOffer {
    id: string
    application_id: string

    // Lender info
    lender_name: string
    lender_logo?: string | null

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
    is_best_match?: boolean

    // Import/source (for future Arive PPE)
    source?: string | null
    external_id?: string | null

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
    interest_rate: number
    apr?: number
    monthly_payment?: number
    loan_term: number
    loan_type: LoanType
    points?: number
    origination_fee?: number
    closing_costs?: number
    rate_lock_days?: number
    rate_lock_expires?: string
    is_recommended?: boolean
    is_best_match?: boolean
    source?: string
    external_id?: string
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

// Document categories for DocHub
export type DocumentCategory =
    | 'government_id'
    | 'proof_of_income'
    | 'tax_returns'
    | 'bank_statements'
    | 'employment_letter'
    | 'contract'
    | 'pre_approval'
    | 'lender_doc'
    | 'insurance'
    | 'disclosure_le'
    | 'disclosure_til'
    | 'disclosure_intent_to_proceed'
    | 'disclosure_credit_auth'
    | 'disclosure_econsent'
    | 'disclosure_state'
    | 'other'

export type DocumentStatus = 'pending_review' | 'approved' | 'rejected'

export type DocumentUploader = 'client' | 'admin'

// Documents
export interface Document {
    id: string
    user_id: string
    application_id: string | null
    category: DocumentCategory
    file_name: string
    storage_key: string
    file_size: number | null
    mime_type: string | null
    uploaded_by: DocumentUploader
    uploaded_by_name: string | null
    status: DocumentStatus
    admin_notes: string | null
    created_at: string
    updated_at: string
}

// Document request status
export type DocumentRequestStatus = 'requested' | 'fulfilled' | 'cancelled'

// Document request (underwriting requests additional docs)
export interface DocumentRequest {
    id: string
    application_id: string
    title: string
    category: string | null
    instructions: string | null
    status: DocumentRequestStatus
    created_by: string
    fulfilled_at: string | null
    cancelled_at: string | null
    created_at: string
    updated_at: string
}

// Predefined document slot definitions
export interface DocumentSlotDef {
    category: DocumentCategory
    label: string
    description: string
    required: boolean
}

export const DOCUMENT_SLOTS: DocumentSlotDef[] = [
    { category: 'government_id', label: 'Government ID', description: "Driver's license or passport", required: true },
    { category: 'proof_of_income', label: 'Proof of Income', description: 'Recent pay stubs (last 2 months)', required: true },
    { category: 'tax_returns', label: 'Tax Returns', description: 'Last 2 years of tax returns', required: true },
    { category: 'bank_statements', label: 'Bank Statements', description: 'Last 2 months of bank statements', required: true },
    { category: 'employment_letter', label: 'Employment Verification', description: 'Letter from employer', required: false },
    { category: 'contract', label: 'Purchase Contract', description: 'Signed purchase agreement', required: false },
    { category: 'pre_approval', label: 'Pre-Approval Letter', description: 'Pre-approval from lender', required: false },
    { category: 'insurance', label: "Homeowner's Insurance", description: 'Proof of insurance', required: false },
    { category: 'other', label: 'Other Documents', description: 'Any additional supporting documents', required: false },
]

// Disclosure document slots
export const DISCLOSURE_SLOTS: DocumentSlotDef[] = [
    { category: 'disclosure_le', label: 'Loan Estimate (LE)', description: 'Initial Loan Estimate disclosure', required: true },
    { category: 'disclosure_til', label: 'Truth in Lending', description: 'Truth in Lending Act disclosure', required: true },
    { category: 'disclosure_intent_to_proceed', label: 'Intent to Proceed', description: 'Acknowledge intent to proceed with the loan', required: true },
    { category: 'disclosure_credit_auth', label: 'Credit Authorization', description: 'Authorization to pull credit report', required: true },
    { category: 'disclosure_econsent', label: 'E-Sign Consent', description: 'Consent to use electronic signatures', required: true },
    { category: 'disclosure_state', label: 'State Disclosures', description: 'State-specific required disclosures', required: false },
]

// Disclosure Signature
export interface DisclosureSignature {
    id: string
    application_id: string
    disclosure_type: DisclosureType
    document_id: string | null
    signed_name: string | null
    signed_at: string | null
    signed_ip: string | null
    status: DisclosureSignatureStatus
    created_at: string
    updated_at: string
}

// Pre-Approval Modal form data
export interface PreApprovalFormData {
    // Step 1: Borrower Info
    date_of_birth: string
    marital_status: MaritalStatus
    first_time_home_buyer: boolean
    preferred_language: string

    // Step 2: Current Residence
    mailing_address: string
    mailing_unit?: string
    mailing_city: string
    mailing_state: string
    mailing_zip_code: string
    address_duration_months: number
    housing_status: HousingStatus

    // Step 3: Employment Details
    employer_name: string
    employer_position: string
    employer_phone: string
    employment_start_date: string
    self_employed: boolean

    // Step 4: Loan Preferences + Co-Borrower
    down_payment: number
    mortgage_type: MortgageType
    loan_term: number
    amortization_type: AmortizationType
    number_of_units: number
    has_co_borrower: boolean
    co_borrower_first_name?: string
    co_borrower_last_name?: string
    co_borrower_email?: string
    co_borrower_phone?: string
    co_borrower_dob?: string
}
