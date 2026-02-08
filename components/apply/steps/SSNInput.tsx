'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { useApplicationStore } from '@/store/applicationStore'

export function SSNInput() {
    const router = useRouter()
    const { nextStep, prevStep } = useApplicationStore()

    // SSN collection is not yet implemented — skip to account creation
    // This step is a placeholder for future soft-pull integration
    const handleContinue = () => { nextStep(); router.push('/apply/step/12') }
    const handleBack = () => { prevStep(); router.push('/apply/step/10') }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-black mb-2">Almost done!</h1>
                <p className="text-gray-500">
                    In the future, you&apos;ll be able to authorize a soft credit inquiry here for more precise rates.
                    For now, continue to create your account and view your personalized offers.
                </p>
            </div>
            <div className="p-4 rounded-xl bg-[#EFF6FF] border border-[#DBEAFE] text-sm text-[#1D4ED8] shadow-sm">
                ℹ️ A soft credit check does <strong>not</strong> affect your credit score. This feature is coming soon.
            </div>
            <div className="flex justify-between items-center pt-4">
                <button onClick={handleBack} className="text-gray-500 hover:text-black text-sm flex items-center gap-1 font-medium transition-colors">← Back</button>
                <button onClick={handleContinue} className="px-8 py-4 rounded-full bg-black text-white font-bold hover:bg-gray-800 shadow-md hover:shadow-lg transition-all">
                    Continue →
                </button>
            </div>
        </div>
    )
}
