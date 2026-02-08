import { NextRequest, NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

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

        console.log(`[App Submission] Received application for User ID: ${userId}`)

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

        // Create the application using Prisma
        const application = await prisma.application.create({
            data: {
                userId: userId,
                newUserId: userId,
                productType: body.productType,
                propertyType: body.propertyType?.replaceAll('-', '_'),
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

        console.log(`[App Submission] Application created in DB: ${application.id}`)

        // Sync User Data to Clerk (Name & Phone)
        const firstName = typeof body.firstName === 'string' ? body.firstName.trim() : ''
        const lastName = typeof body.lastName === 'string' ? body.lastName.trim() : ''
        const fullName = `${firstName} ${lastName}`.trim()
        const email = typeof body.email === 'string' ? body.email.trim() : null
        const phone = typeof body.phone === 'string' ? body.phone.trim() : null

        // Update Prisma Profile
        await prisma.profile.upsert({
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

        // Sync to Clerk
        try {
            const clerk = await clerkClient()

            // 1. Update Name
            if (firstName || lastName) {
                await clerk.users.updateUser(userId, {
                    firstName: firstName || undefined,
                    lastName: lastName || undefined
                })
                console.log(`[App Submission] Updated Clerk user name for ${userId}`)
            }

            // 2. Sync Phone Number
            if (phone) {
                // Convert formatted phone like "(555) 123-4567" to E.164 "+15551234567"
                const digits = phone.replace(/\D/g, '')
                const e164Phone = digits.length === 10 ? `+1${digits}` : digits.length === 11 && digits[0] === '1' ? `+${digits}` : null

                if (e164Phone) {
                    // Check for existing phone to avoid duplicates
                    const user = await clerk.users.getUser(userId)
                    const existingPhone = user.phoneNumbers.find(p => p.phoneNumber === e164Phone)

                    if (!existingPhone) {
                        await clerk.phoneNumbers.createPhoneNumber({
                            userId,
                            phoneNumber: e164Phone,
                            verified: true
                        })
                        console.log(`[App Submission] Added phone number to Clerk for ${userId}`)
                    } else {
                        console.log(`[App Submission] Phone number already exists in Clerk for ${userId}`)
                    }
                }
            }

        } catch (clerkError) {
            console.error('[App Submission] Clerk Sync Warning:', clerkError)
            // We do NOT fail the request here, just log the warning
        }

        return NextResponse.json({
            success: true,
            applicationId: application.id
        })

    } catch (error) {
        console.error('[App Submission] Critical Error:', error)
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

        return NextResponse.json({ applications: formattedApplications })

    } catch (error) {
        console.error('Error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
