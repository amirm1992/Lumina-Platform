'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { useApplicationStore, PropertyType as PT } from '@/store/applicationStore'
import { trackStepComplete } from '@/lib/analytics'

const options: { value: PT; label: string }[] = [
    { value: 'single-family', label: 'Single Family Home' },
    { value: 'condo', label: 'Condominium' },
    { value: 'townhome', label: 'Townhome' },
    { value: 'multi-family', label: 'Multi-Family (2-4 units)' },
]

export function PropertyType() {
    const router = useRouter()
    const { propertyType, setPropertyType, nextStep, prevStep } = useApplicationStore()

    const handleSelect = (value: PT) => { setPropertyType(value); trackStepComplete(2); nextStep(); router.push('/apply/step/3') }
    const handleBack = () => { prevStep(); router.push('/apply/step/1') }

    return (
        <div className="space-y-6">
            <div><h1 className="text-3xl font-bold text-black mb-2">What type of property?</h1><p className="text-gray-500">Select the property type.</p></div>
            <div className="grid grid-cols-2 gap-4">
                {options.map((o) => (
                    <button key={o.value} onClick={() => handleSelect(o.value)} className={`p-6 rounded-xl border transition-all cursor-pointer text-center ${propertyType === o.value ? 'bg-[#EFF6FF] border-[#2563EB] text-black shadow-md shadow-[#DBEAFE]' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-black'}`}>
                        <div className="font-semibold">{o.label}</div>
                    </button>
                ))}
            </div>
            <button onClick={handleBack} className="text-gray-500 hover:text-black text-sm flex items-center gap-1 font-medium transition-colors">← Back</button>
        </div>
    )
}
