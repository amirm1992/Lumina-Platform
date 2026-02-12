/**
 * Zapier Integration — Lumina → Arive LOS
 *
 * This module maps Lumina application data to Arive Zapier API fields
 * and posts to a Zapier Webhook ("Catch Hook") which triggers the
 * "Create Loan" action in Arive.
 *
 * Environment variable required:
 *   ZAPIER_WEBHOOK_URL — the Catch Hook URL from your Zapier Zap
 *
 * Arive field reference:
 *   https://support.arive.com/support/solutions/articles/61000273608
 */

import prisma from '@/lib/prisma'

// ── Helpers ──

/** Safely coerce Prisma Decimal to number */
function toNum(val: unknown): number | null {
    if (val == null) return null
    if (typeof val === 'number') return val
    if (typeof (val as { toNumber?: () => number }).toNumber === 'function') {
        return (val as { toNumber: () => number }).toNumber()
    }
    const n = Number(val)
    return Number.isNaN(n) ? null : n
}

/** Map Lumina product type → Arive loanPurpose */
function mapLoanPurpose(productType: string | null): string {
    switch (productType) {
        case 'purchase': return 'Purchase'
        case 'refinance': return 'Refinance'
        case 'heloc': return 'HELOC'
        default: return 'Purchase'
    }
}

/** Map Lumina property type → Arive subjectProperty_housingType */
function mapPropertyType(propertyType: string | null): string {
    switch (propertyType) {
        case 'single_family': return 'Single Family'
        case 'condo': return 'Condominium'
        case 'townhouse': return 'Townhouse'
        case 'multi_family': return 'Two-to-Four Unit'
        default: return 'Single Family'
    }
}

/** Map Lumina property usage → Arive subjectProperty_propertyUsageType */
function mapOccupancy(usage: string | null): string {
    switch (usage) {
        case 'primary': return 'PrimaryResidence'
        case 'secondary': return 'SecondHome'
        case 'investment': return 'InvestmentProperty'
        default: return 'PrimaryResidence'
    }
}

/** Map Lumina mortgage type → Arive mortgageType */
function mapMortgageType(type: string | null): string {
    switch (type) {
        case 'conventional': return 'Conventional'
        case 'fha': return 'FHA'
        case 'va': return 'VA'
        case 'jumbo': return 'Jumbo'
        default: return 'Conventional'
    }
}

/** Map Lumina amortization → Arive amortizationType */
function mapAmortizationType(type: string | null): string {
    switch (type) {
        case 'fixed': return 'Fixed'
        case 'arm': return 'AdjustableRate'
        default: return 'Fixed'
    }
}

/** Map Lumina employment status → Arive employment_classificationType */
function mapEmploymentClassification(status: string | null): string {
    switch (status) {
        case 'salaried': return 'Primary'
        case 'self-employed':
        case 'self_employed': return 'Primary'
        case 'retired': return 'Primary'
        case 'military': return 'MilitaryPay'
        default: return 'Primary'
    }
}

/** Map Lumina housing status → Arive address residencyBasisType */
function mapResidencyBasis(status: string | null): string {
    switch (status) {
        case 'own': return 'Own'
        case 'rent': return 'Rent'
        case 'rent_free': return 'LivingRentFree'
        default: return 'Rent'
    }
}

/** Map Lumina marital status → Arive loanBorrowers_maritalStatusType */
function mapMaritalStatus(status: string | null): string {
    switch (status) {
        case 'married': return 'Married'
        case 'unmarried': return 'Unmarried'
        case 'separated': return 'Separated'
        default: return 'Unmarried'
    }
}

// ── Types ──

interface ApplicationRecord {
    id: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any
}

export interface AriveZapierPayload {
    // CRM link
    crmReferenceId: string

    // Loan details
    loanPurpose: string
    mortgageType: string
    baseLoanAmount: number | null
    amortizationType: string
    amortizationTerm: number | null
    loanTerm: number | null
    downPayment: number | null
    purchasePriceOrEstimatedValue: number | null

    // Subject property
    subjectProperty_addressLineText: string | null
    subjectProperty_city: string | null
    subjectProperty_state: string | null
    subjectProperty_county: string | null
    subjectProperty_postalCode: string | null
    subjectProperty_housingType: string
    subjectProperty_propertyUsageType: string
    subjectProperty_financedUnitCount: number | null

    // Borrower info
    loanBorrowers_firstName: string | null
    loanBorrowers_lastName: string | null
    loanBorrowers_emailAddressText: string | null
    loanBorrowers_mobilePhone10digit: string | null
    loanBorrowers_birthDate: string | null
    loanBorrowers_dayOfBirth: string | null
    loanBorrowers_monthOfBirth: string | null
    loanBorrowers_maritalStatusType: string
    loanBorrowers_firstTimeHomeBuyer: boolean | null
    loanBorrowers_preferedLanguages: string | null

    // Borrower address
    loanBorrowers_address_addressLineText: string | null
    loanBorrowers_address_addressUnitIdentifier: string | null
    loanBorrowers_address_addressCity: string | null
    loanBorrowers_address_addressState: string | null
    loanBorrowers_address_addressPostalCode: string | null
    loanBorrowers_address_durationTermMonths: number | null
    loanBorrowers_address_residencyBasisType: string

    // Employment
    employment_employerName: string | null
    employment_positionDesc: string | null
    employment_employerPhone: string | null
    employment_startDate: string | null
    employment_selfEmployedInd: boolean | null
    employment_monthlyIncome: number | null
    employment_classificationType: string

    // Credit
    estimatedFICO: number | null

    // Lead source
    leadSource: string
    loanCreatedFrom: string
}

// ── Main Functions ──

/**
 * Map a Lumina application record to the Arive Zapier API payload.
 */
export function mapApplicationToArive(app: ApplicationRecord): AriveZapierPayload {
    // Extract DOB parts
    const dob = app.dateOfBirth ? new Date(app.dateOfBirth) : null
    const dobDay = dob ? dob.getUTCDate().toString() : null
    const dobMonth = dob ? (dob.getUTCMonth() + 1).toString() : null
    // Combined date format for Arive Create Loan action: YYYY-MM-DD (ISO)
    const dobFormatted = dob
        ? `${dob.getUTCFullYear()}-${(dob.getUTCMonth() + 1).toString().padStart(2, '0')}-${dob.getUTCDate().toString().padStart(2, '0')}`
        : null

    // Monthly income from annual
    const annualIncome = toNum(app.annualIncome)
    const monthlyIncome = annualIncome ? Math.round(annualIncome / 12) : null

    // Employment start date as string
    const empStartDate = app.employmentStartDate
        ? new Date(app.employmentStartDate).toISOString().split('T')[0]
        : null

    // Fetch profile name — already on the application from step 6
    // The name comes from the original application POST which stores firstName/lastName
    // in the profile. We fetch from the joined profile or use newUserId to look up.

    return {
        // CRM reference
        crmReferenceId: app.id,

        // Loan details
        loanPurpose: mapLoanPurpose(app.productType),
        mortgageType: mapMortgageType(app.mortgageType),
        baseLoanAmount: toNum(app.loanAmount),
        amortizationType: mapAmortizationType(app.amortizationType),
        amortizationTerm: app.loanTerm ? app.loanTerm * 12 : null, // Arive expects months
        loanTerm: app.loanTerm ? app.loanTerm * 12 : null,
        downPayment: toNum(app.downPayment),
        purchasePriceOrEstimatedValue: toNum(app.propertyValue),

        // Subject property
        subjectProperty_addressLineText: app.propertyAddress || null,
        subjectProperty_city: app.propertyCity || null,
        subjectProperty_state: app.propertyState || null,
        subjectProperty_county: app.propertyCounty || null,
        subjectProperty_postalCode: app.zipCode || null,
        subjectProperty_housingType: mapPropertyType(app.propertyType),
        subjectProperty_propertyUsageType: mapOccupancy(app.propertyUsage),
        subjectProperty_financedUnitCount: app.numberOfUnits || 1,

        // Borrower info — firstName/lastName are on the Profile, not Application
        // We'll enrich these below via profile lookup
        loanBorrowers_firstName: null, // enriched below
        loanBorrowers_lastName: null,  // enriched below
        loanBorrowers_emailAddressText: null, // enriched below
        loanBorrowers_mobilePhone10digit: null, // enriched below
        loanBorrowers_birthDate: dobFormatted,
        loanBorrowers_dayOfBirth: dobDay,
        loanBorrowers_monthOfBirth: dobMonth,
        loanBorrowers_maritalStatusType: mapMaritalStatus(app.maritalStatus),
        loanBorrowers_firstTimeHomeBuyer: app.firstTimeHomeBuyer ?? null,
        loanBorrowers_preferedLanguages: app.preferredLanguage || 'english',

        // Borrower address
        loanBorrowers_address_addressLineText: app.mailingAddress || null,
        loanBorrowers_address_addressUnitIdentifier: app.mailingUnit || null,
        loanBorrowers_address_addressCity: app.mailingCity || null,
        loanBorrowers_address_addressState: app.mailingState || null,
        loanBorrowers_address_addressPostalCode: app.mailingZipCode || null,
        loanBorrowers_address_durationTermMonths: app.addressDurationMonths || null,
        loanBorrowers_address_residencyBasisType: mapResidencyBasis(app.housingStatus),

        // Employment
        employment_employerName: app.employerName || null,
        employment_positionDesc: app.employerPosition || null,
        employment_employerPhone: app.employerPhone || null,
        employment_startDate: empStartDate,
        employment_selfEmployedInd: app.selfEmployed ?? null,
        employment_monthlyIncome: monthlyIncome,
        employment_classificationType: mapEmploymentClassification(app.employmentStatus),

        // Credit
        estimatedFICO: app.creditScore || null,

        // Source tracking
        leadSource: 'Lumina Platform',
        loanCreatedFrom: 'POS',
    }
}

/**
 * Push a Lumina application to Arive via Zapier webhook.
 * Updates the application's zapierPushStatus afterward.
 */
export async function pushToZapier(app: ApplicationRecord): Promise<void> {
    const webhookUrl = process.env.ZAPIER_WEBHOOK_URL

    if (!webhookUrl) {
        console.warn('[Zapier] ZAPIER_WEBHOOK_URL not set — skipping push')
        await prisma.application.update({
            where: { id: app.id },
            data: {
                zapierPushStatus: 'failed',
                zapierPushedAt: new Date(),
            },
        })
        return
    }

    // Build payload
    const payload = mapApplicationToArive(app)

    // Enrich with profile data (firstName, lastName, email, phone)
    const lookupId = app.newUserId || app.userId
    if (lookupId) {
        const profile = await prisma.profile.findUnique({
            where: { id: lookupId },
        })
        if (profile) {
            const nameParts = (profile.fullName || '').split(' ')
            payload.loanBorrowers_firstName = nameParts[0] || null
            payload.loanBorrowers_lastName = nameParts.slice(1).join(' ') || null
            payload.loanBorrowers_emailAddressText = profile.email || null
            payload.loanBorrowers_mobilePhone10digit = profile.phone || null
        }
    }

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        })

        if (!response.ok) {
            throw new Error(`Zapier webhook returned ${response.status}: ${await response.text()}`)
        }

        // Mark as sent
        await prisma.application.update({
            where: { id: app.id },
            data: {
                zapierPushStatus: 'sent',
                zapierPushedAt: new Date(),
            },
        })

        console.log(`[Zapier] Successfully pushed application ${app.id}`)
    } catch (error) {
        console.error(`[Zapier] Error pushing application ${app.id}:`, error)

        await prisma.application.update({
            where: { id: app.id },
            data: {
                zapierPushStatus: 'failed',
                zapierPushedAt: new Date(),
            },
        })

        throw error
    }
}
