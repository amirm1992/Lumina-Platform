'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { useApplicationStore, CreditScore } from '@/store/applicationStore'

const options: { value: CreditScore; label: string; range: string; color: string }[] = [
    { value: 'excellent', label: 'Excellent', range: '740+', color: 'bg-green-50 border-green-500 text-green-700 shadow-sm' },
    { value: 'good', label: 'Good', range: '700-739', color: 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm' },
    { value: 'fair', label: 'Fair', range: '640-699', color: 'bg-yellow-50 border-yellow-500 text-yellow-700 shadow-sm' },
    { value: 'poor', label: 'Needs Work', range: 'Below 640', color: 'bg-orange-50 border-orange-500 text-orange-700 shadow-sm' },
]

export function CreditHealth() {
    const router = useRouter()
    const { creditScore, setCreditScore, nextStep, prevStep } = useApplicationStore()

    const handleSelect = (value: CreditScore) => { setCreditScore(value); nextStep(); router.push('/apply/step/8') }
    const handleBack = () => { prevStep(); router.push('/apply/step/6') }

    return (
        <div className="space-y-6">
            <div><h1 className="text-3xl font-bold text-black mb-2">What's your credit situation?</h1><p className="text-gray-500">Self-assessment, won't affect your score.</p></div>
            <div className="grid grid-cols-2 gap-4">
                {options.map((o) => (
                    <button key={o.value} onClick={() => handleSelect(o.value)} className={`p-6 rounded-xl border transition-all cursor-pointer text-center ${creditScore === o.value ? o.color : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-black'}`}>
                        <div className="font-semibold text-lg">{o.label}</div><div className="text-sm opacity-70 mt-1">{o.range}</div>
                    </button>
                ))}
            </div>
            <button onClick={handleBack} className="text-gray-500 hover:text-black text-sm flex items-center gap-1 font-medium transition-colors">← Back</button>
        </div>
    )
}
