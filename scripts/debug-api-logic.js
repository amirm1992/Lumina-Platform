const { PrismaClient } = require('@prisma/client')
// Hardcoded config to match lib/prisma.ts if needed
const prisma = new PrismaClient()

function toNumber(val) {
    if (val == null) return null
    if (typeof val === 'number' && !Number.isNaN(val)) return val
    if (typeof (val?.toNumber) === 'function') {
        return val.toNumber()
    }
    const n = Number(val)
    return Number.isNaN(n) ? null : n
}

async function main() {
    try {
        console.log('Fetching applications (all)...')
        const applications = await prisma.application.findMany({
            include: { lenderOffers: true },
            orderBy: { createdAt: 'desc' }
        })

        console.log('Fetched', applications.length, 'apps. Mapping...')

        const formattedApplications = applications.map(app => ({
            id: app.id,
            user_id: app.userId,
            product_type: app.productType,
            property_type: app.propertyType,
            property_usage: app.propertyUsage,
            property_state: app.propertyState ?? null,
            property_value: toNumber(app.propertyValue),
            loan_amount: toNumber(app.loanAmount),
            zip_code: app.zipCode,
            employment_status: app.employmentStatus,
            annual_income: toNumber(app.annualIncome),
            liquid_assets: toNumber(app.liquidAssets),
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
                interest_rate: toNumber(offer.interestRate),
                apr: toNumber(offer.apr),
                monthly_payment: toNumber(offer.monthlyPayment),
                closing_costs: toNumber(offer.closingCosts),
                points: toNumber(offer.points),
                origination_fee: toNumber(offer.originationFee),
                loan_term: offer.loanTerm,
                rate_lock_days: offer.rateLockDays,
                rate_lock_expires: offer.rateLockExpires instanceof Date
                    ? offer.rateLockExpires.toISOString().slice(0, 10)
                    : offer.rateLockExpires ?? null,
                is_recommended: offer.isRecommended,
                is_best_match: offer.isBestMatch,
                is_visible: offer.isVisible,
                source: offer.source,
                external_id: offer.externalId,
                created_at: offer.createdAt,
                updated_at: offer.updatedAt
            }))
        }))

        console.log('SUCCESS: All mapped correctly.')
    } catch (err) {
        console.error('FAILURE during fetch or map:', err)
        process.exit(1)
    } finally {
        await prisma.$disconnect()
    }
}

main()
