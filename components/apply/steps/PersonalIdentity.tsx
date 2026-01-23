'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useApplicationStore } from '@/store/applicationStore'

function formatPhone(value: string): string {
    const digits = value.replace(/\D/g, '').slice(0, 10)
    if (digits.length <= 3) return digits
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

export function PersonalIdentity() {
    const router = useRouter()
    const { firstName, lastName, phone, setFirstName, setLastName, setPhone, nextStep, prevStep } = useApplicationStore()
    const [localFirst, setLocalFirst] = useState(firstName)
    const [localLast, setLocalLast] = useState(lastName)
    const [localPhone, setLocalPhone] = useState(phone)
    const [error, setError] = useState('')

    const handleContinue = () => {
        if (!localFirst.trim() || !localLast.trim()) {
            setError('Please enter your full name')
            return
        }
        // Phone is required - must be 10 digits
        const phoneDigits = localPhone.replace(/\D/g, '')
        if (phoneDigits.length !== 10) {
            setError('Please enter a valid 10-digit phone number')
            return
        }
        setFirstName(localFirst.trim())
        setLastName(localLast.trim())
        setPhone(localPhone)
        nextStep()
        router.push('/apply/step/7')
    }

    const handleBack = () => {
        prevStep()
        router.push('/apply/step/5')
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-black mb-2">Let's get to know you</h1>
                <p className="text-gray-500">This helps us personalize your experience.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm text-gray-500 mb-2">First Name</label>
                    <input
                        type="text"
                        value={localFirst}
                        onChange={(e) => { setLocalFirst(e.target.value); setError('') }}
                        placeholder="John"
                        className="w-full p-4 rounded-xl bg-white border border-gray-200 text-black placeholder:text-gray-400 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all shadow-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm text-gray-500 mb-2">Last Name</label>
                    <input
                        type="text"
                        value={localLast}
                        onChange={(e) => { setLocalLast(e.target.value); setError('') }}
                        placeholder="Smith"
                        className="w-full p-4 rounded-xl bg-white border border-gray-200 text-black placeholder:text-gray-400 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all shadow-sm"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm text-gray-500 mb-2">Phone Number</label>
                <input
                    type="tel"
                    value={localPhone}
                    onChange={(e) => { setLocalPhone(formatPhone(e.target.value)); setError('') }}
                    placeholder="(555) 123-4567"
                    className="w-full p-4 rounded-xl bg-white border border-gray-200 text-black placeholder:text-gray-400 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all shadow-sm"
                />
                <p className="text-xs text-gray-500 mt-1">For important updates about your application only</p>
            </div>

            {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>}

            <div className="flex justify-between items-center">
                <button onClick={handleBack} className="text-gray-500 hover:text-black text-sm flex items-center gap-1 font-medium transition-colors">
                    ← Back
                </button>
                <button
                    onClick={handleContinue}
                    className="px-6 py-3 rounded-full bg-black text-white font-bold hover:bg-gray-800 shadow-md hover:shadow-lg transition-all"
                >
                    Continue
                </button>
            </div>
        </div>
    )
}
