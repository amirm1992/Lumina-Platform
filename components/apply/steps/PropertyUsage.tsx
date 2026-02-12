'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { useApplicationStore, PropertyUsage as PU } from '@/store/applicationStore'
import { trackStepComplete } from '@/lib/analytics'

const options: { value: PU; label: string; desc: string }[] = [
    { value: 'primary', label: 'Primary Residence', desc: 'Main home' },
    { value: 'secondary', label: 'Secondary / Vacation', desc: 'Second home' },
    { value: 'investment', label: 'Investment Property', desc: 'Rental' },
]

export function PropertyUsage() {
    const router = useRouter()
    const { propertyUsage, setPropertyUsage, nextStep, prevStep } = useApplicationStore()

    const handleSelect = (value: PU) => { setPropertyUsage(value); trackStepComplete(3); nextStep(); router.push('/apply/step/4') }
    const handleBack = () => { prevStep(); router.push('/apply/step/2') }

    return (
        <div className="space-y-6">
            <div><h1 className="text-3xl font-bold text-black mb-2">How will you use this property?</h1><p className="text-gray-500">This affects rates.</p></div>
            <div className="grid gap-4">
                {options.map((o) => (
                    <button key={o.value} onClick={() => handleSelect(o.value)} className={`p-6 rounded-xl border transition-all cursor-pointer text-left ${propertyUsage === o.value ? 'bg-[#EFF6FF] border-[#2563EB] text-black shadow-md shadow-[#DBEAFE]' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-black'}`}>
                        <div className="font-semibold">{o.label}</div><div className="text-sm text-gray-500 mt-1">{o.desc}</div>
                    </button>
                ))}
            </div>
            <button onClick={handleBack} className="text-gray-500 hover:text-black text-sm flex items-center gap-1 font-medium transition-colors">← Back</button>
        </div>
    )
}
