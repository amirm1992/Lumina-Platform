'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useApplicationStore } from '@/store/applicationStore'

export function LocationInput() {
    const router = useRouter()
    const { zipCode, setZipCode, nextStep, prevStep } = useApplicationStore()
    const [localZip, setLocalZip] = useState(zipCode)
    const [error, setError] = useState('')

    const handleContinue = (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        if (!/^\d{5}$/.test(localZip)) { setError('Enter a valid 5-digit ZIP'); return }
        setZipCode(localZip); nextStep(); router.push('/apply/step/5')
    }
    const handleBack = () => { prevStep(); router.push('/apply/step/3') }

    return (
        <div className="space-y-6">
            <div><h1 className="text-3xl font-bold text-black mb-2">Where is the property?</h1><p className="text-gray-500">Enter your 5-digit ZIP code.</p></div>
            <form onSubmit={handleContinue} className="space-y-4">
                <input
                    type="text"
                    value={localZip}
                    onChange={(e) => { setLocalZip(e.target.value.replace(/\D/g, '').slice(0, 5)); setError('') }}
                    placeholder="e.g. 78701"
                    className="w-full p-4 rounded-xl bg-white border border-gray-200 text-black placeholder:text-gray-400 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all shadow-sm text-2xl text-center tracking-widest"
                    maxLength={5}
                    autoFocus
                />
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <button type="submit" disabled={localZip.length < 5} className="w-full py-4 rounded-xl bg-black text-white font-bold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg">
                    Next Step
                </button>
            </form>
            <button onClick={handleBack} className="text-gray-500 hover:text-black text-sm flex items-center gap-1 font-medium transition-colors">← Back</button>
        </div>
    )
}
