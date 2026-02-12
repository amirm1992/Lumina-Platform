'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useApplicationStore } from '@/store/applicationStore'
import { trackStepComplete } from '@/lib/analytics'

const fmt = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v)

export function LiquidAssets() {
    const router = useRouter()
    const { liquidAssets, setLiquidAssets, nextStep, prevStep } = useApplicationStore()
    const [localAssets, setLocalAssets] = useState(liquidAssets ?? 50000)

    const handleContinue = () => { setLiquidAssets(localAssets); trackStepComplete(10); nextStep(); router.push('/apply/step/11') }
    const handleBack = () => { prevStep(); router.push('/apply/step/9') }

    return (
        <div className="space-y-8">
            <div><h1 className="text-3xl font-bold text-black mb-2">How much do you have in savings?</h1><p className="text-gray-500">Funds for down payment and reserves.</p></div>
            <div className="text-center">
                <div className="text-5xl font-bold text-black mb-6">{fmt(localAssets)}</div>
                <input type="range" min={0} max={500000} step={5000} value={localAssets} onChange={(e) => setLocalAssets(Number(e.target.value))} className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-600" />
                <div className="flex justify-between text-xs text-gray-500 mt-2"><span>$0</span><span>$500K+</span></div>
            </div>
            <div className="flex justify-between items-center">
                <button onClick={handleBack} className="text-gray-500 hover:text-black text-sm flex items-center gap-1 font-medium transition-colors">← Back</button>
                <button onClick={handleContinue} className="px-6 py-3 rounded-full bg-black text-white font-bold hover:bg-gray-800 shadow-md hover:shadow-lg transition-all">Continue</button>
            </div>
        </div>
    )
}
