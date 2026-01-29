'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { useApplicationStore, ProductType } from '@/store/applicationStore'

const options: { value: ProductType; label: string; desc: string }[] = [
    { value: 'purchase', label: 'Purchase', desc: 'Buy a new home' },
    { value: 'refinance', label: 'Refinance', desc: 'Lower your rate or payment' },
    { value: 'heloc', label: 'HELOC / Home Equity', desc: 'Tap into your equity' },
]

export function ProductSelection() {
    const router = useRouter()
    const { productType, setProductType, nextStep } = useApplicationStore()

    const handleSelect = (value: ProductType) => {
        setProductType(value)
        nextStep()
        router.push('/apply/step/2')
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-black mb-2">What can we help you with today?</h1>
                <p className="text-gray-500">Select the type of mortgage solution you are looking for.</p>
            </div>
            <div className="grid gap-4">
                {options.map((option) => (
                    <button key={option.value} onClick={() => handleSelect(option.value)} className={`flex items-center gap-4 p-6 rounded-xl border transition-all cursor-pointer text-left ${productType === option.value ? 'bg-[#EFF6FF] border-[#2563EB] text-black shadow-md shadow-[#DBEAFE]' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-black'}`}>
                        <div><div className="font-semibold text-lg">{option.label}</div><div className="text-sm text-gray-500">{option.desc}</div></div>
                    </button>
                ))}
            </div>
        </div>
    )
}
