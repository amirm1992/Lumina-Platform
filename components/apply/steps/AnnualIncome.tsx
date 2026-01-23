'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useApplicationStore } from '@/store/applicationStore'

const fmt = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v)

export function AnnualIncome() {
    const router = useRouter()
    const { annualIncome, setAnnualIncome, nextStep, prevStep } = useApplicationStore()
    const [localIncome, setLocalIncome] = useState(annualIncome || 100000)

    const handleContinue = () => { setAnnualIncome(localIncome); nextStep(); router.push('/apply/step/10') }
    const handleBack = () => { prevStep(); router.push('/apply/step/8') }

    return (
        <div className="space-y-8">
            <div><h1 className="text-3xl font-bold text-black mb-2">What is your annual income?</h1><p className="text-gray-500">Combined gross household income.</p></div>
            <div className="text-center">
                <div className="text-5xl font-bold text-black mb-6">{fmt(localIncome)}</div>
                <input type="range" min={25000} max={1000000} step={5000} value={localIncome} onChange={(e) => setLocalIncome(Number(e.target.value))} className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer accent-purple-600" />
                <div className="flex justify-between text-xs text-gray-500 mt-2"><span>$25K</span><span>$1M+</span></div>
            </div>
            <div className="flex justify-between items-center">
                <button onClick={handleBack} className="text-gray-500 hover:text-black text-sm flex items-center gap-1 font-medium transition-colors">← Back</button>
                <button onClick={handleContinue} className="px-6 py-3 rounded-full bg-black text-white font-bold hover:bg-gray-800 shadow-md hover:shadow-lg transition-all">Continue</button>
            </div>
        </div>
    )
}
