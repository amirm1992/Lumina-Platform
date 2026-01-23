import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const supabase = await createClient()

        // Get the current user
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json(
                { error: 'User not authenticated' },
                { status: 401 }
            )
        }

        // Map the application data to database schema
        const applicationData = {
            user_id: user.id,
            product_type: body.productType,
            property_type: body.propertyType?.replace('-', '_'), // single-family -> single_family
            property_usage: body.propertyUsage,
            property_value: body.estimatedValue,
            loan_amount: body.loanAmount,
            zip_code: body.zipCode,
            employment_status: body.employmentStatus,
            annual_income: body.annualIncome,
            liquid_assets: body.liquidAssets,
            status: 'pending'
        }

        // Insert the application
        const { data: application, error } = await supabase
            .from('applications')
            .insert(applicationData)
            .select()
            .single()

        if (error) {
            console.error('Error creating application:', error)
            return NextResponse.json(
                { error: 'Failed to create application' },
                { status: 500 }
            )
        }

        // Update the user's profile with their name and phone
        await supabase
            .from('profiles')
            .update({
                full_name: `${body.firstName} ${body.lastName}`.trim(),
                phone: body.phone
            })
            .eq('id', user.id)

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
        const supabase = await createClient()

        // Get the current user
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json(
                { error: 'User not authenticated' },
                { status: 401 }
            )
        }

        // Get user's applications
        const { data: applications, error } = await supabase
            .from('applications')
            .select(`
                *,
                lender_offers(*)
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching applications:', error)
            // If table doesn't exist or other DB error, return empty array
            // This allows the dashboard to load gracefully
            if (error.code === '42P01' || error.message?.includes('does not exist')) {
                return NextResponse.json({ applications: [] })
            }
            return NextResponse.json(
                { error: 'Failed to fetch applications', details: error.message },
                { status: 500 }
            )
        }

        return NextResponse.json({ applications })

    } catch (error) {
        console.error('Error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
