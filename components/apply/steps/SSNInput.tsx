'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useApplicationStore } from '@/store/applicationStore'

export function SSNInput() {
    const router = useRouter()
    const { ssn, setSSN, nextStep, prevStep } = useApplicationStore()
    const [localSSN, setLocalSSN] = useState(ssn)

    const formatSSN = (v: string) => {
        const d = v.replace(/\D/g, '').slice(0, 9)
        if (d.length <= 3) return d
        if (d.length <= 5) return `${d.slice(0, 3)}-${d.slice(3)}`
        return `${d.slice(0, 3)}-${d.slice(3, 5)}-${d.slice(5)}`
    }

    const handleContinue = () => { setSSN(localSSN); nextStep(); router.push('/apply/step/12') }
    const handleSkip = () => { nextStep(); router.push('/apply/step/12') }
    const handleBack = () => { prevStep(); router.push('/apply/step/10') }

    return (
        <div className="space-y-6">
            <div><h1 className="text-3xl font-bold text-black mb-2">Unlock precise rates (optional)</h1><p className="text-gray-500">Soft credit inquiry that does NOT affect your score.</p></div>
            <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-sm text-green-700 shadow-sm">🔒 Bank-level encryption. Your SSN is never stored in plain text.</div>
            <input type="password" value={localSSN} onChange={(e) => setLocalSSN(formatSSN(e.target.value))} placeholder="XXX-XX-XXXX" className="w-full p-4 rounded-xl bg-white border border-gray-200 text-black placeholder:text-gray-400 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all shadow-sm text-xl text-center tracking-widest" maxLength={11} />
            <div className="flex justify-between items-center">
                <button onClick={handleBack} className="text-gray-500 hover:text-black text-sm flex items-center gap-1 font-medium transition-colors">← Back</button>
                <div className="flex gap-3">
                    <button onClick={handleSkip} className="px-5 py-3 rounded-full text-gray-500 hover:text-black text-sm font-medium transition-colors">Skip for now</button>
                    <button onClick={handleContinue} className="px-6 py-3 rounded-full bg-black text-white font-bold hover:bg-gray-800 shadow-md hover:shadow-lg transition-all">Continue</button>
                </div>
            </div>
        </div>
    )
}
