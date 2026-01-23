'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { useApplicationStore, EmploymentStatus as ES } from '@/store/applicationStore'

const options: { value: ES; label: string }[] = [
    { value: 'salaried', label: 'Salaried / W-2 Employee' },
    { value: 'self-employed', label: 'Self-Employed / Business Owner' },
    { value: 'retired', label: 'Retired' },
    { value: 'military', label: 'Active Military / Veteran' },
]

export function EmploymentStatus() {
    const router = useRouter()
    const { employmentStatus, setEmploymentStatus, nextStep, prevStep } = useApplicationStore()

    const handleSelect = (value: ES) => { setEmploymentStatus(value); nextStep(); router.push('/apply/step/9') }
    const handleBack = () => { prevStep(); router.push('/apply/step/7') }

    return (
        <div className="space-y-6">
            <div><h1 className="text-3xl font-bold text-black mb-2">What's your employment status?</h1></div>
            <div className="grid gap-4">
                {options.map((o) => (
                    <button key={o.value} onClick={() => handleSelect(o.value)} className={`p-5 rounded-xl border transition-all cursor-pointer text-left ${employmentStatus === o.value ? 'bg-purple-50 border-purple-600 text-black shadow-md shadow-purple-100' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-black'}`}>
                        <div className="font-medium">{o.label}</div>
                    </button>
                ))}
            </div>
            <button onClick={handleBack} className="text-gray-500 hover:text-black text-sm flex items-center gap-1 font-medium transition-colors">← Back</button>
        </div>
    )
}
