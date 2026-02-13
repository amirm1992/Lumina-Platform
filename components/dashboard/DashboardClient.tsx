'use client'

import React, { useState, useCallback } from 'react'
import Link from 'next/link'
import DashboardSidebar from './DashboardSidebar'
import { LenderCard } from './LenderCard'
import { LenderNegotiationList } from './LenderNegotiationList'
import { PaymentBreakdown } from './PaymentBreakdown'
import { MarketTrends } from './MarketTrends'
import { ScenarioAdjuster } from './ScenarioAdjuster'
import { EditDetailsModal } from './EditDetailsModal'
import { PreApprovalModal } from './PreApprovalModal'
import type { AuthUser } from '@/types/auth'
import { FINANCIAL_DEFAULTS } from '@/lib/constants'
import { useDashboardData } from './hooks/useDashboardData'

interface DashboardClientProps {
    user: AuthUser | null
}

export function DashboardClient({ user }: DashboardClientProps) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isPreApprovalOpen, setIsPreApprovalOpen] = useState(false)

    const {
        application,
        offers,
        hasRealOffers,
        userProfile,
        setUserProfile,
        loading,
        fetchError,
        selectedLender,
        selectedLenderId,
        setSelectedLenderId,
        ltv,
    } = useDashboardData(user)

    const handleProfileUpdate = useCallback(
        (newValues: { homeValue: number; loanAmount: number; downPayment: number }) => {
            setUserProfile((prev) => ({
                ...prev,
                homeValue: newValues.homeValue,
                estimatedLoanAmount: newValues.loanAmount,
                downPayment: newValues.downPayment,
            }))
        },
        [setUserProfile]
    )

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
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8] transition font-medium"
                            aria-label="Reload page to try again"
                        >
                            Try again
                        </button>
                        {fetchError.toLowerCase().includes('session') || fetchError.toLowerCase().includes('log in') ? (
                            <Link
                                href="/login?redirect=/dashboard"
                                className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                            >
                                Log in again
                            </Link>
                        ) : null}
                    </div>
                </div>
            </div>
        )
    }

    // Only show real (non-placeholder) offers in the cards
    const realOffers = offers.filter(o => !o.isPlaceholder)

    return (
        <div className="min-h-screen bg-gray-50 selection:bg-[#DBEAFE] font-sans text-gray-900">
            <DashboardSidebar />

            <main className="container mx-auto px-6 py-10 pt-20">

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
                                    {hasRealOffers
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

                        {/* Offer Cards (when offers exist) OR Lender Negotiation List (when waiting) */}
                        {hasRealOffers ? (
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-black">Available Lender Offers</h2>
                                    <div className="flex gap-2 text-xs">
                                        <span className="text-gray-500">Sort by:</span>
                                        <button className="text-[#2563EB] font-bold hover:text-[#1D4ED8] transition-colors">Lowest Rate</button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {realOffers.map(lender => (
                                        <LenderCard
                                            key={lender.id}
                                            lender={lender}
                                            isSelected={selectedLenderId === lender.id}
                                            onSelect={() => setSelectedLenderId(lender.id)}
                                            onPreApprove={() => setIsPreApprovalOpen(true)}
                                        />
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <LenderNegotiationList />
                        )}
                    </div>

                    {/* Right Column: Analytics & Visualization */}
                    <div className="lg:col-span-4 space-y-8">

                        {/* Monthly Payment Breakdown */}
                        {selectedLender && hasRealOffers && (
                            <PaymentBreakdown
                                monthlyPayment={selectedLender.monthlyPayment}
                                propertyTax={FINANCIAL_DEFAULTS.defaultPropertyTax}
                                homeInsurance={FINANCIAL_DEFAULTS.defaultHomeInsurance}
                            />
                        )}

                        {/* Market Trends */}
                        <MarketTrends />

                        {/* Closing Info */}
                        {selectedLender && hasRealOffers && (
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
                                    Based on <strong className="text-black">{selectedLender.name}&apos;s</strong> fees, your total estimated closing costs are{' '}
                                    <strong className="text-black">${(selectedLender.closingCosts ?? 0).toLocaleString()}</strong>.
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

            {/* Pre-Approval Modal */}
            {application && (
                <PreApprovalModal
                    isOpen={isPreApprovalOpen}
                    onClose={() => setIsPreApprovalOpen(false)}
                    applicationId={application.id}
                    lenderName={selectedLender?.name || 'Lender'}
                    defaultDownPayment={userProfile.downPayment}
                    employmentStatus={application.employment_status}
                />
            )}

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
