import { NextRequest, NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

// Prevent Next.js from caching this route — admin updates must be reflected immediately
export const dynamic = 'force-dynamic'

// ── Validation helpers ──

const VALID_PRODUCT_TYPES = ['purchase', 'refinance', 'heloc']
const VALID_PROPERTY_TYPES = ['single_family', 'single-family', 'condo', 'townhouse', 'townhome', 'multi_family', 'multi-family', 'other']
const VALID_PROPERTY_USAGE = ['primary', 'secondary', 'investment']
const VALID_EMPLOYMENT = ['salaried', 'self-employed', 'retired', 'military']
const VALID_CREDIT_SCORES = ['excellent', 'good', 'fair', 'poor']

function normalizePropertyType(raw: string): string {
    // Accept both hyphen and underscore variants
    return raw.replaceAll('-', '_').replace('townhome', 'townhouse')
}

function validateApplicationBody(body: Record<string, unknown>): string | null {
    // Product type
    if (!body.productType || !VALID_PRODUCT_TYPES.includes(body.productType as string)) {
        return `Product type must be one of: ${VALID_PRODUCT_TYPES.join(', ')}`
    }
    // Property type
    if (!body.propertyType || !VALID_PROPERTY_TYPES.includes(body.propertyType as string)) {
        return `Property type must be one of: ${VALID_PROPERTY_TYPES.join(', ')}`
    }
    // Property usage
    if (!body.propertyUsage || !VALID_PROPERTY_USAGE.includes(body.propertyUsage as string)) {
        return `Property usage must be one of: ${VALID_PROPERTY_USAGE.join(', ')}`
    }
    // Estimated value
    if (body.estimatedValue == null || typeof body.estimatedValue !== 'number' || body.estimatedValue <= 0 || body.estimatedValue > 100_000_000) {
        return 'Estimated property value must be a positive number up to $100M'
    }
    // Loan amount
    if (body.loanAmount == null || typeof body.loanAmount !== 'number' || body.loanAmount <= 0 || body.loanAmount > 100_000_000) {
        return 'Loan amount must be a positive number up to $100M'
    }
    if (body.loanAmount > body.estimatedValue) {
        return 'Loan amount cannot exceed estimated property value'
    }
    // Zip code
    if (!body.zipCode || typeof body.zipCode !== 'string' || !/^\d{5}$/.test(body.zipCode)) {
        return 'Zip code must be exactly 5 digits'
    }
    // Employment
    if (!body.employmentStatus || !VALID_EMPLOYMENT.includes(body.employmentStatus as string)) {
        return `Employment status must be one of: ${VALID_EMPLOYMENT.join(', ')}`
    }
    // Annual income
    if (body.annualIncome == null || typeof body.annualIncome !== 'number' || body.annualIncome < 0 || body.annualIncome > 100_000_000) {
        return 'Annual income must be a non-negative number'
    }
    // Liquid assets
    if (body.liquidAssets == null || typeof body.liquidAssets !== 'number' || body.liquidAssets < 0 || body.liquidAssets > 1_000_000_000) {
        return 'Liquid assets must be a non-negative number'
    }
    // Credit score (optional but must be valid if provided)
    if (body.creditScore && !VALID_CREDIT_SCORES.includes(body.creditScore as string)) {
        return `Credit score must be one of: ${VALID_CREDIT_SCORES.join(', ')}`
    }
    // Email
    if (!body.email || typeof body.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
        return 'A valid email address is required'
    }
    // Name fields
    if (body.firstName && typeof body.firstName === 'string' && body.firstName.length > 100) {
        return 'First name must be under 100 characters'
    }
    if (body.lastName && typeof body.lastName === 'string' && body.lastName.length > 100) {
        return 'Last name must be under 100 characters'
    }

    return null // validation passed
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json(
                { error: 'User not authenticated' },
                { status: 401 }
            )
        }

        // Validate input
        const validationError = validateApplicationBody(body)
        if (validationError) {
            return NextResponse.json(
                { error: validationError },
                { status: 400 }
            )
        }

        // Map categorical credit score to a representative numeric value
        const creditScoreMap: Record<string, number> = {
            excellent: 780,
            good: 710,
            fair: 640,
            poor: 560,
        }
        const creditScoreNumeric = body.creditScore
            ? creditScoreMap[body.creditScore] ?? null
            : null

        const firstName = typeof body.firstName === 'string' ? body.firstName.trim() : ''
        const lastName = typeof body.lastName === 'string' ? body.lastName.trim() : ''
        const fullName = `${firstName} ${lastName}`.trim()
        const email = typeof body.email === 'string' ? body.email.trim() : null
        const phone = typeof body.phone === 'string' ? body.phone.trim() : null

        // Create application and profile in a single transaction
        const application = await prisma.$transaction(async (tx) => {
            const app = await tx.application.create({
                data: {
                    userId: userId,
                    newUserId: userId,
                    productType: body.productType,
                    propertyType: normalizePropertyType(body.propertyType),
                    propertyUsage: body.propertyUsage,
                    propertyValue: body.estimatedValue,
                    loanAmount: body.loanAmount,
                    zipCode: body.zipCode,
                    employmentStatus: body.employmentStatus,
                    annualIncome: body.annualIncome,
                    liquidAssets: body.liquidAssets,
                    creditScore: creditScoreNumeric,
                    status: 'pending'
                }
            })

            await tx.profile.upsert({
                where: { id: userId },
                update: {
                    fullName: fullName || undefined,
                    phone: phone ?? undefined,
                    ...(email ? { email } : {})
                },
                create: {
                    id: userId,
                    email: email || undefined,
                    fullName: fullName || undefined,
                    phone: phone || undefined
                }
            })

            return app
        })

        // Sync to Clerk (non-blocking — application already saved)
        try {
            const clerk = await clerkClient()

            if (firstName || lastName) {
                await clerk.users.updateUser(userId, {
                    firstName: firstName || undefined,
                    lastName: lastName || undefined
                })
            }

            if (phone) {
                const digits = phone.replace(/\D/g, '')
                const e164Phone = digits.length === 10 ? `+1${digits}` : digits.length === 11 && digits[0] === '1' ? `+${digits}` : null

                if (e164Phone) {
                    const user = await clerk.users.getUser(userId)
                    const existingPhone = user.phoneNumbers.find(p => p.phoneNumber === e164Phone)

                    if (!existingPhone) {
                        await clerk.phoneNumbers.createPhoneNumber({
                            userId,
                            phoneNumber: e164Phone,
                            verified: false // Don't mark as verified without actual verification
                        })
                    }
                }
            }
        } catch (clerkError) {
            console.error('Clerk sync warning:', clerkError)
            // Don't fail the request — application is already saved
        }

        return NextResponse.json({
            success: true,
            applicationId: application.id
        })

    } catch (error) {
        console.error('Application submission error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function GET() {
    try {
        const { userId } = await auth()

        if (!userId) {
            return NextResponse.json(
                { error: 'User not authenticated' },
                { status: 401 }
            )
        }

        // Get user's applications with offers
        const applications = await prisma.application.findMany({
            where: {
                OR: [
                    { newUserId: userId },
                    { userId: userId }
                ]
            },
            include: {
                lenderOffers: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        // Transform to match existing API response format
        const formattedApplications = applications.map(app => ({
            id: app.id,
            user_id: app.userId,
            product_type: app.productType,
            property_type: app.propertyType,
            property_usage: app.propertyUsage,
            property_value: app.propertyValue?.toNumber(),
            loan_amount: app.loanAmount?.toNumber(),
            zip_code: app.zipCode,
            employment_status: app.employmentStatus,
            annual_income: app.annualIncome?.toNumber(),
            liquid_assets: app.liquidAssets?.toNumber(),
            credit_score: app.creditScore,
            status: app.status,
            admin_notes: app.adminNotes,
            created_at: app.createdAt,
            updated_at: app.updatedAt,
            offers_published_at: app.offersPublishedAt,
            lender_offers: app.lenderOffers.map(offer => ({
                id: offer.id,
                application_id: offer.applicationId,
                lender_name: offer.lenderName,
                lender_logo: offer.lenderLogo,
                product_name: offer.productName,
                loan_type: offer.loanType,
                interest_rate: offer.interestRate?.toNumber(),
                apr: offer.apr?.toNumber(),
                monthly_payment: offer.monthlyPayment?.toNumber(),
                closing_costs: offer.closingCosts?.toNumber(),
                points: offer.points?.toNumber(),
                origination_fee: offer.originationFee?.toNumber(),
                loan_term: offer.loanTerm,
                rate_lock_days: offer.rateLockDays,
                rate_lock_expires: offer.rateLockExpires?.toISOString?.()?.slice(0, 10) ?? null,
                is_recommended: offer.isRecommended,
                is_best_match: offer.isBestMatch,
                is_visible: offer.isVisible,
                source: offer.source,
                external_id: offer.externalId,
                created_at: offer.createdAt,
                updated_at: offer.updatedAt
            }))
        }))

        return NextResponse.json(
            { applications: formattedApplications },
            { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
        )

    } catch (error) {
        console.error('Error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
