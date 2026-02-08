'use client'

import React, { useState, useMemo, useEffect } from 'react'
import DashboardSidebar from './DashboardSidebar'
import { LenderCard } from './LenderCard'
import { PaymentBreakdown } from './PaymentBreakdown'
import { MarketTrends } from './MarketTrends'
import { ScenarioAdjuster } from './ScenarioAdjuster'
import { EditDetailsModal } from './EditDetailsModal'
import { RATE_TRENDS } from './constants'
import { UserProfile, Lender } from './types'
import { Application, LenderOffer } from '@/types/database'
import { AuthUser } from '@/types/auth'
import { CONSTANT_LENDERS, getPlaceholderLenders } from '@/constants/lenders'

interface DashboardClientProps {
    user: AuthUser | null
}

// Convert database offer to Lender type for display
// Helper to calculate monthly payment
function calculateMonthlyPayment(principal: number, annualRate: number, years: number): number {
    const r = annualRate / 100 / 12
    const n = years * 12
    if (!principal || !r || !n) return 0
    return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
}

// Normalize lender name for matching (handles UWM and other aliases)
function normalizeLenderName(name: string): string {
    return (name || '').toLowerCase().trim().replace(/\s+/g, ' ')
}

function dbOfferMatchesConstant(dbName: string, constantName: string): boolean {
    const d = normalizeLenderName(dbName)
    const c = normalizeLenderName(constantName)
    if (d === c) return true
    if (c === 'uwm' && (d.includes('united wholesale') || d.includes('uwm') || d === 'u.w.m.')) return true
    return false
}

// Convert database offer to Lender type for display
function offerToLender(offer: LenderOffer, loanAmount: number): Lender {
    const rate = offer.interest_rate ?? 0
    const term = offer.loan_term ?? 30
    const calculatedPayment = calculateMonthlyPayment(loanAmount, rate, term)
    return {
        id: offer.id,
        name: offer.lender_name,
        rate,
        apr: offer.apr ?? rate,
        monthlyPayment: calculatedPayment || (offer.monthly_payment ?? 0),
        loanTerm: term,
        loanType: (offer.loan_type?.toUpperCase() || 'CONVENTIONAL') as 'CONVENTIONAL' | 'FHA' | 'VA' | 'JUMBO',
        points: offer.points ?? 0,
        closingCosts: offer.closing_costs ?? 0,
        isRecommended: offer.is_recommended,
        bestMatch: offer.is_best_match ?? false,
        logo: offer.lender_logo ?? undefined
    }
}

export function DashboardClient({ user }: DashboardClientProps) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [application, setApplication] = useState<Application | null>(null)
    const [offers, setOffers] = useState<Lender[]>(getPlaceholderLenders())
    const [loading, setLoading] = useState(true)
    const [fetchError, setFetchError] = useState<string | null>(null)
    const [applicationStatus, setApplicationStatus] = useState<string>('pending')

    const [userProfile, setUserProfile] = useState<UserProfile>({
        name: user?.user_metadata?.first_name || user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || "User",
        creditScore: 0,
        estimatedLoanAmount: 0,
        downPayment: 0,
        homeValue: 0,
        location: ""
    })

    // Fetch application and offers from database
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(`/api/applications?t=${Date.now()}`, { cache: 'no-store' })
                if (response.ok) {
                    const data = await response.json()
                    if (data.applications && data.applications.length > 0) {
                        // Prefer application that has offers (admin may have added to a specific one)
                        const apps = data.applications as Application[]
                        const appWithOffers = apps.find(a => a.lender_offers && a.lender_offers.length > 0)
                        const app = (appWithOffers ?? apps[0]) as Application
                        setApplication(app)
                        setApplicationStatus(app.status)

                        // Update user profile with application data
                        setUserProfile(prev => ({
                            ...prev,
                            creditScore: app.credit_score || 0,
                            estimatedLoanAmount: app.loan_amount || 0,
                            homeValue: app.property_value || 0,
                            downPayment: (app.property_value || 0) - (app.loan_amount || 0),
                            location: app.zip_code || ""
                        }))

                        // Convert offers if available
                        if (app.lender_offers && app.lender_offers.length > 0) {
                            const dbOffers = app.lender_offers.map(o => offerToLender(o, app.loan_amount || 0))

                            // Merge with Constants
                            const mergedOffers = CONSTANT_LENDERS.map((constant, index) => {
                                const match = dbOffers.find(o => dbOfferMatchesConstant(o.name, constant.name))

                                if (match) return match

                                // Return Placeholder
                                return {
                                    id: `placeholder-${index}`,
                                    name: constant.name,
                                    logo: constant.logo,
                                    rate: 0,
                                    apr: 0,
                                    monthlyPayment: 0,
                                    loanTerm: 30,
                                    loanType: 'CONVENTIONAL',
                                    points: 0,
                                    closingCosts: 0,
                                    isRecommended: false,
                                    isPlaceholder: true
                                } as Lender
                            })

                            // Add any other DB offers that aren't in constants
                            const otherOffers = dbOffers.filter(o =>
                                !CONSTANT_LENDERS.some(c => dbOfferMatchesConstant(o.name, c.name))
                            )

                            // Sort: Real offers first (lowest rate), then placeholders
                            const sortedOffers = [...mergedOffers, ...otherOffers].sort((a, b) => {
                                if (a.isPlaceholder && !b.isPlaceholder) return 1
                                if (!a.isPlaceholder && b.isPlaceholder) return -1
                                return a.rate - b.rate
                            })

                            setOffers(sortedOffers)
                        } else {
                            // No offers yet - show placeholders
                            setOffers(getPlaceholderLenders())
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching application:', error)
                setFetchError('Unable to load your application data. Please try refreshing the page.')
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    const handleProfileUpdate = (newValues: { homeValue: number; loanAmount: number; downPayment: number }) => {
        setUserProfile(prev => ({
            ...prev,
            homeValue: newValues.homeValue,
            estimatedLoanAmount: newValues.loanAmount,
            downPayment: newValues.downPayment
        }))
    }

    const [selectedLenderId, setSelectedLenderId] = useState<string>('')

    useEffect(() => {
        if (offers.length > 0 && !selectedLenderId) {
            // Select first REAL offer, or first placeholder
            const firstReal = offers.find(o => !o.isPlaceholder)
            setSelectedLenderId(firstReal?.id || offers[0].id)
        }
    }, [offers, selectedLenderId])

    const selectedLender = useMemo(() =>
        offers.find(l => l.id === selectedLenderId) || offers[0]
        , [selectedLenderId, offers])

    const ltv = useMemo(() => {
        if (!userProfile.homeValue || userProfile.homeValue <= 0) return '0.0'
        return ((userProfile.estimatedLoanAmount / userProfile.homeValue) * 100).toFixed(1)
    }, [userProfile])

    // Status banner component - Disabled as per user request
    const StatusBanner = () => {
        return null
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-500">Loading your dashboard...</p>
                </div>
            </div>
        )
    }

    if (fetchError) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center max-w-md">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to load dashboard</h2>
                    <p className="text-gray-500 mb-6 text-sm">{fetchError}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8] transition font-medium"
                    >
                        Try again
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 selection:bg-[#DBEAFE] font-sans text-gray-900">
            <DashboardSidebar />

            <main className="container mx-auto px-6 py-10 pt-20">

                <StatusBanner />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Column: Summary & Controls */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* Header Summary */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">
                                    Welcome back, {userProfile.name}
                                </h1>
                                <p className="text-gray-500">
                                    {offers.some(o => !o.isPlaceholder)
                                        ? 'Based on your verified credit, here are your personalized offers.'
                                        : 'We are crunching the numbers with our top lenders for you.'}
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <div className="px-5 py-3 bg-white border border-gray-200 rounded-2xl text-center min-w-[120px] shadow-sm">
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-bold">Credit Score</p>
                                    {userProfile.creditScore > 0 ? (
                                        <p className={`text-2xl font-bold ${userProfile.creditScore >= 740 ? 'text-green-600' :
                                            userProfile.creditScore >= 670 ? 'text-blue-600' :
                                                userProfile.creditScore >= 580 ? 'text-amber-600' : 'text-red-600'
                                            }`}>{userProfile.creditScore}</p>
                                    ) : (
                                        <p className="text-xl font-medium text-gray-400">Pending</p>
                                    )}
                                </div>
                                <div className="px-5 py-3 bg-white border border-gray-200 rounded-2xl text-center min-w-[120px] shadow-sm">
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-bold">LTV Ratio</p>
                                    <p className="text-2xl font-bold text-[#2563EB]">{ltv}%</p>
                                </div>
                            </div>
                        </div>

                        {/* Quick Scenario Adjuster */}
                        <ScenarioAdjuster
                            homeValue={userProfile.homeValue}
                            loanAmount={userProfile.estimatedLoanAmount}
                            downPayment={userProfile.downPayment}
                            onEdit={() => setIsEditModalOpen(true)}
                        />

                        {/* Rate Grid */}
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-black">
                                    {offers.length > 0 ? 'Available Lender Offers' : 'Lender Offers'}
                                </h2>
                                {offers.length > 0 && (
                                    <div className="flex gap-2 text-xs">
                                        <span className="text-gray-500">Sort by:</span>
                                        <button className="text-[#2563EB] font-bold hover:text-[#1D4ED8] transition-colors">Lowest Rate</button>
                                    </div>
                                )}
                            </div>

                            {offers.length > 0 ? (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {offers.map(lender => (
                                            <LenderCard
                                                key={lender.id}
                                                lender={lender}
                                                isSelected={selectedLenderId === lender.id}
                                                onSelect={() => setSelectedLenderId(lender.id)}
                                            />
                                        ))}
                                    </div>
                                    {offers.some(o => o.isPlaceholder) && (
                                        <p className="mt-4 text-center text-sm text-gray-500">
                                            We’re comparing offers from 6 lenders. You’ll see your personalized rates here as they’re ready.
                                        </p>
                                    )}
                                </>
                            ) : (
                                <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Offers Yet</h3>
                                    <p className="text-gray-500 text-sm max-w-sm mx-auto">
                                        We're working on getting you the best rates from our lender network. This usually takes 24-48 hours.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Analytics & Visualization */}
                    <div className="lg:col-span-4 space-y-8">

                        {/* Monthly Payment Breakdown */}
                        {selectedLender && (
                            <PaymentBreakdown
                                monthlyPayment={selectedLender.monthlyPayment}
                                propertyTax={450}
                                homeInsurance={120}
                            />
                        )}

                        {/* Market Trends */}
                        <MarketTrends />

                        {/* Closing Info */}
                        {selectedLender && (
                            <div className="p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-white/50 shadow-lg transition-all hover:shadow-xl">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-2 bg-black/90 rounded-lg shadow-lg shadow-black/10">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h4 className="font-bold text-black">Closing Cost Insight</h4>
                                </div>
                                <p className="text-sm text-gray-500 mb-5 leading-relaxed">
                                    Based on <strong className="text-black">{selectedLender.name}'s</strong> fees, your total estimated closing costs are{' '}
                                    <strong className="text-black">${(selectedLender.closingCosts ?? 12450).toLocaleString()}</strong>.
                                    This includes lender fees, appraisal, and title insurance.
                                </p>
                                <button className="text-sm text-[#2563EB] font-bold hover:text-[#1D4ED8] transition-colors uppercase tracking-wide">
                                    View detailed cost breakdown &rarr;
                                </button>
                            </div>
                        )}

                        {/* Application Info */}
                        {application && (
                            <div className="p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-white/50 shadow-lg">
                                <h4 className="font-bold text-black mb-4">Your Application</h4>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Loan Purpose</span>
                                        <span className="text-gray-900 font-medium capitalize">{application.product_type}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Property Type</span>
                                        <span className="text-gray-900 font-medium capitalize">{application.property_type?.replaceAll('_', ' ')}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">ZIP Code</span>
                                        <span className="text-gray-900 font-medium">{application.zip_code}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Submitted</span>
                                        <span className="text-gray-900 font-medium">
                                            {new Date(application.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Edit Details Modal */}
            <EditDetailsModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                currentValues={{
                    homeValue: userProfile.homeValue,
                    loanAmount: userProfile.estimatedLoanAmount,
                    downPayment: userProfile.downPayment
                }}
                onSave={handleProfileUpdate}
            />

            {/* Extended Compliance Footer */}
            <footer className="mt-16 border-t border-gray-200 bg-white">
                <div className="container mx-auto px-6 py-8">
                    <div className="text-center space-y-3 text-[11px] leading-relaxed max-w-4xl mx-auto text-gray-500">
                        <p>
                            NMLS #1631748 | Loans originated through C2 Financial Corporation | NMLS #135622
                        </p>
                        <p>
                            Licensed Mortgage Broker | Florida Office of Financial Regulation
                        </p>
                        <p>
                            Loan approval is not guaranteed and is subject to lender review of information.
                            All loan approvals are conditional and all conditions must be met by borrower.
                            Loan is only approved when lender has issued approval in writing and is subject to
                            the Lender conditions. Specified rates may not be available for all borrowers.
                            Rate subject to change with market conditions.
                        </p>
                        <p>
                            C2 Financial Corporation is an Equal Opportunity Mortgage Broker/Lender.
                            For state licensing information, visit{' '}
                            <a
                                href="https://www.nmlsconsumeraccess.org/EntityDetails.aspx/COMPANY/135622"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                            >
                                NMLS Consumer Access
                            </a>.
                            As a broker, C2 Financial Corporation is NOT individually approved by the FHA or HUD,
                            but C2 Financial Corporation is allowed to originate FHA loans based on their
                            relationships with FHA approved lenders.
                        </p>
                        <p className="text-gray-400 text-[10px]">
                            C2 Financial Corporation, 12230 El Camino Real #100, San Diego, CA 92130
                        </p>
                        <div className="flex items-center justify-center gap-2 pt-2">
                            <span>Equal Housing Lender</span>
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 3L2 12h3v9h14v-9h3L12 3zm0 2.84L18 11v8H6v-8l6-5.16z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
