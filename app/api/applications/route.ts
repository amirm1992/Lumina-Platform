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

        // Create the application using Prisma
        const application = await prisma.application.create({
            data: {
                userId: userId,
                newUserId: userId,
                productType: body.productType,
                propertyType: body.propertyType?.replace('-', '_'),
                propertyUsage: body.propertyUsage,
                propertyValue: body.estimatedValue,
                loanAmount: body.loanAmount,
                zipCode: body.zipCode,
                employmentStatus: body.employmentStatus,
                annualIncome: body.annualIncome,
                liquidAssets: body.liquidAssets,
                status: 'pending'
            }
        })

        // Update or create the user's profile (email, phone from application)
        const fullName = `${body.firstName || ''} ${body.lastName || ''}`.trim()
        const email = typeof body.email === 'string' ? body.email.trim() : null
        const phone = typeof body.phone === 'string' ? body.phone.trim() : null
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

        // Sync phone to Clerk user metadata so it appears in Clerk Dashboard
        if (phone) {
            try {
                await clerkClient.users.updateUserMetadata(userId, {
                    unsafeMetadata: { phone }
                })
            } catch (e) {
                console.warn('Could not sync phone to Clerk metadata:', e)
            }
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

        return NextResponse.json({ applications: formattedApplications })

    } catch (error) {
        console.error('Error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
