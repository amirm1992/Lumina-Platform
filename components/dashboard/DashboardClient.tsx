'use client'

import React, { useState, useMemo } from 'react'
import { User } from '@supabase/supabase-js'
import { DashboardNavbar } from './DashboardNavbar'
import { LenderCard } from './LenderCard'
import { PaymentBreakdown } from './PaymentBreakdown'
import { MarketTrends } from './MarketTrends'
import { ScenarioAdjuster } from './ScenarioAdjuster'
import { EditDetailsModal } from './EditDetailsModal'
import { MOCK_LENDERS, RATE_TRENDS } from './constants'
import { UserProfile } from './types'

interface DashboardClientProps {
    user: User | null
}

export function DashboardClient({ user }: DashboardClientProps) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [userProfile, setUserProfile] = useState<UserProfile>({
        name: user?.user_metadata?.full_name || "Alex Thompson", // Fallback for demo
        creditScore: 782,
        estimatedLoanAmount: 450000,
        downPayment: 90000,
        homeValue: 540000,
        location: "Austin, TX"
    })

    const handleProfileUpdate = (newValues: { homeValue: number; loanAmount: number; downPayment: number }) => {
        setUserProfile(prev => ({
            ...prev,
            ...newValues
        }))
    }

    const [selectedLenderId, setSelectedLenderId] = useState<string>(MOCK_LENDERS[1].id)

    const selectedLender = useMemo(() =>
        MOCK_LENDERS.find(l => l.id === selectedLenderId) || MOCK_LENDERS[0]
        , [selectedLenderId])

    const ltv = useMemo(() =>
        ((userProfile.estimatedLoanAmount / userProfile.homeValue) * 100).toFixed(1)
        , [userProfile])

    return (
        <div className="min-h-screen bg-gray-50 selection:bg-purple-100 font-sans text-gray-900">
            <DashboardNavbar user={user} />

            <main className="container mx-auto px-6 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Column: Summary & Controls */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* Header Summary */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">Welcome back, {userProfile.name}</h1>
                                <p className="text-gray-500">Based on your soft credit pull, here are your personalized offers.</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="px-5 py-3 bg-white border border-gray-200 rounded-2xl text-center min-w-[120px] shadow-sm">
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-bold">Credit Score</p>
                                    <p className="text-2xl font-bold text-green-600">{userProfile.creditScore}</p>
                                </div>
                                <div className="px-5 py-3 bg-white border border-gray-200 rounded-2xl text-center min-w-[120px] shadow-sm">
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-bold">LTV Ratio</p>
                                    <p className="text-2xl font-bold text-purple-600">{ltv}%</p>
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
                                <h2 className="text-xl font-bold text-black">Available Lender Offers</h2>
                                <div className="flex gap-2 text-xs">
                                    <span className="text-gray-500">Sort by:</span>
                                    <button className="text-purple-600 font-bold hover:text-purple-500 transition-colors">Lowest Rate</button>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {MOCK_LENDERS.map(lender => (
                                    <LenderCard
                                        key={lender.id}
                                        lender={lender}
                                        isSelected={selectedLenderId === lender.id}
                                        onSelect={() => setSelectedLenderId(lender.id)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Analytics & Visualization */}
                    <div className="lg:col-span-4 space-y-8">

                        {/* Monthly Payment Breakdown */}
                        <PaymentBreakdown
                            monthlyPayment={selectedLender.monthlyPayment}
                            propertyTax={450} // Mock fixed value
                            homeInsurance={120} // Mock fixed value
                        />

                        {/* Market Trends */}
                        <MarketTrends />

                        {/* Closing Info */}
                        <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-2 bg-black rounded-lg shadow-lg shadow-black/20">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h4 className="font-bold text-black">Closing Cost Insight</h4>
                            </div>
                            <p className="text-sm text-gray-500 mb-5 leading-relaxed">
                                Based on <strong className="text-black">{selectedLender.name}'s</strong> fees, your total estimated closing costs are <strong className="text-black">$12,450</strong>. This includes lender fees, appraisal, and title insurance.
                            </p>
                            <button className="text-sm text-purple-600 font-bold hover:text-purple-500 transition-colors uppercase tracking-wide">View detailed cost breakdown &rarr;</button>
                        </div>
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
        </div>
    )
}
