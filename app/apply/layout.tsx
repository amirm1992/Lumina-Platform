'use client'

import React from 'react'
import { useApplicationStore } from '@/store/applicationStore'
import { ProgressBar } from '@/components/apply/ProgressBar'
import { TrustSidebar } from '@/components/apply/TrustSidebar'
import { FloatingHeader } from '@/components/apply/FloatingHeader'

export default function ApplyLayout({ children }: { children: React.ReactNode }) {
    const { currentStep } = useApplicationStore()

    return (
        <>
            <FloatingHeader />
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 pt-14 sm:pt-20">
                <div className="w-full max-w-5xl flex gap-8">
                    <div className="flex-1 max-w-xl">
                        <ProgressBar currentStep={currentStep} />
                        {children}
                    </div>
                    <TrustSidebar />
                </div>
            </div>
        </>
    )
}
