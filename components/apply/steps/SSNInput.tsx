'use client'
import React, { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useApplicationStore } from '@/store/applicationStore'

export function SSNInput() {
    const router = useRouter()
    const {
        ssn, setSsn, consentSoftPull, setConsentSoftPull,
        setConsentSignedAt, setConsentSignedName,
        firstName, lastName,
        nextStep, prevStep,
    } = useApplicationStore()

    const [part1, setPart1] = useState(ssn.slice(0, 3))
    const [part2, setPart2] = useState(ssn.slice(3, 5))
    const [part3, setPart3] = useState(ssn.slice(5, 9))
    const [consent, setConsent] = useState(consentSoftPull)
    const [showDisclosure, setShowDisclosure] = useState(false)
    const [error, setError] = useState('')
    const [showSSN, setShowSSN] = useState(false)

    const ref2 = useRef<HTMLInputElement>(null)
    const ref3 = useRef<HTMLInputElement>(null)

    const fullSSN = `${part1}${part2}${part3}`
    const isValidSSN = /^\d{9}$/.test(fullSSN)
    const borrowerName = `${firstName} ${lastName}`.trim() || 'Borrower'
    const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

    const handlePart1 = (val: string) => {
        const digits = val.replace(/\D/g, '').slice(0, 3)
        setPart1(digits)
        setError('')
        if (digits.length === 3) ref2.current?.focus()
    }

    const handlePart2 = (val: string) => {
        const digits = val.replace(/\D/g, '').slice(0, 2)
        setPart2(digits)
        setError('')
        if (digits.length === 2) ref3.current?.focus()
    }

    const handlePart3 = (val: string) => {
        const digits = val.replace(/\D/g, '').slice(0, 4)
        setPart3(digits)
        setError('')
    }

    const handleBackspace2 = (e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && part2 === '') {
            setPart1(part1.slice(0, -1))
        }
    }

    const handleBackspace3 = (e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && part3 === '') {
            ref2.current?.focus()
        }
    }

    const handleContinue = () => {
        if (!isValidSSN) {
            setError('Please enter a valid 9-digit Social Security Number.')
            return
        }
        if (!consent) {
            setError('You must agree to the credit authorization to continue.')
            return
        }
        setSsn(fullSSN)
        setConsentSoftPull(true)
        setConsentSignedAt(new Date().toISOString())
        setConsentSignedName(borrowerName)
        nextStep()
        router.push('/apply/step/12')
    }

    const handleBack = () => {
        prevStep()
        router.push('/apply/step/10')
    }

    const displayValue = (val: string) => showSSN ? val : '•'.repeat(val.length)

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-black mb-2">Authorize a soft credit check</h1>
                <p className="text-gray-500">
                    Enter your Social Security Number to authorize a soft credit inquiry. This helps us provide you with the most accurate, personalized rates.
                </p>
            </div>

            {/* Security badge */}
            <div className="p-4 rounded-xl bg-[#EFF6FF] border border-[#DBEAFE] text-sm text-[#1D4ED8] shadow-sm flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mt-0.5 shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
                <div>
                    <p className="font-semibold mb-1">Your data is protected</p>
                    <p>A soft credit check does <strong>not</strong> affect your credit score. Your SSN is encrypted with 256-bit AES encryption and is never shared with third parties.</p>
                </div>
            </div>

            {/* SSN Input */}
            <div>
                <label className="block text-sm text-gray-500 mb-3">Social Security Number</label>
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        inputMode="numeric"
                        autoComplete="off"
                        value={displayValue(part1)}
                        onChange={(e) => {
                            // When masked, the user's new keystroke appends to bullets.
                            // Extract only the raw digit(s) the user just typed and
                            // append to the real value stored in state.
                            const raw = e.target.value
                            if (showSSN) {
                                handlePart1(raw)
                            } else {
                                const newChars = raw.replace(/•/g, '').replace(/\D/g, '')
                                handlePart1((part1 + newChars).slice(0, 3))
                            }
                        }}
                        onKeyDown={(e) => {
                            if (!showSSN && e.key === 'Backspace') {
                                e.preventDefault()
                                setPart1(part1.slice(0, -1))
                            }
                        }}
                        placeholder="•••"
                        maxLength={showSSN ? 3 : undefined}
                        className="w-24 p-4 rounded-xl bg-white border border-gray-200 text-black text-center text-xl tracking-[0.3em] placeholder:text-gray-300 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all shadow-sm"
                    />
                    <span className="text-gray-300 text-2xl font-light">—</span>
                    <input
                        ref={ref2}
                        type="text"
                        inputMode="numeric"
                        autoComplete="off"
                        value={displayValue(part2)}
                        onChange={(e) => {
                            const raw = e.target.value
                            if (showSSN) {
                                handlePart2(raw)
                            } else {
                                const newChars = raw.replace(/•/g, '').replace(/\D/g, '')
                                handlePart2((part2 + newChars).slice(0, 2))
                            }
                        }}
                        onKeyDown={(e) => {
                            if (!showSSN && e.key === 'Backspace') {
                                e.preventDefault()
                                if (part2 === '') {
                                    setPart1(part1.slice(0, -1))
                                } else {
                                    setPart2(part2.slice(0, -1))
                                }
                            } else {
                                handleBackspace2(e)
                            }
                        }}
                        placeholder="••"
                        maxLength={showSSN ? 2 : undefined}
                        className="w-20 p-4 rounded-xl bg-white border border-gray-200 text-black text-center text-xl tracking-[0.3em] placeholder:text-gray-300 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all shadow-sm"
                    />
                    <span className="text-gray-300 text-2xl font-light">—</span>
                    <input
                        ref={ref3}
                        type="text"
                        inputMode="numeric"
                        autoComplete="off"
                        value={displayValue(part3)}
                        onChange={(e) => {
                            const raw = e.target.value
                            if (showSSN) {
                                handlePart3(raw)
                            } else {
                                const newChars = raw.replace(/•/g, '').replace(/\D/g, '')
                                handlePart3((part3 + newChars).slice(0, 4))
                            }
                        }}
                        onKeyDown={(e) => {
                            if (!showSSN && e.key === 'Backspace') {
                                e.preventDefault()
                                if (part3 === '') {
                                    ref2.current?.focus()
                                } else {
                                    setPart3(part3.slice(0, -1))
                                }
                            } else {
                                handleBackspace3(e)
                            }
                        }}
                        placeholder="••••"
                        maxLength={showSSN ? 4 : undefined}
                        className="w-28 p-4 rounded-xl bg-white border border-gray-200 text-black text-center text-xl tracking-[0.3em] placeholder:text-gray-300 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all shadow-sm"
                    />
                    <button
                        type="button"
                        onClick={() => setShowSSN(!showSSN)}
                        className="ml-2 text-gray-400 hover:text-black transition-colors text-sm font-medium"
                    >
                        {showSSN ? 'Hide' : 'Show'}
                    </button>
                </div>
            </div>

            {/* Consent checkbox */}
            <label className="flex items-start gap-3 cursor-pointer">
                <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => { setConsent(e.target.checked); setError('') }}
                    className="mt-0.5 w-5 h-5 rounded border-gray-300 text-[#2563EB] focus:ring-[#2563EB] cursor-pointer shrink-0"
                />
                <span className="text-sm text-gray-600 leading-relaxed">
                    I authorize Lumina to perform a <strong>soft credit inquiry</strong> using my Social Security Number. I understand this will not affect my credit score.
                </span>
            </label>

            {/* Link to open full disclosure */}
            <button
                type="button"
                onClick={() => setShowDisclosure(true)}
                className="text-[#2563EB] hover:text-[#1D4ED8] text-xs font-medium underline underline-offset-2 transition-colors"
            >
                Review full Credit Authorization Disclosure
            </button>

            {error && (
                <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>
            )}

            <div className="flex justify-between items-center pt-2">
                <button
                    onClick={handleBack}
                    className="text-gray-500 hover:text-black text-sm flex items-center gap-1 font-medium transition-colors"
                >
                    ← Back
                </button>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleContinue}
                        disabled={!isValidSSN || !consent}
                        className="px-8 py-4 rounded-full bg-black text-white font-bold hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all"
                    >
                        Authorize & Continue →
                    </button>
                </div>
            </div>

            <p className="text-center text-xs text-gray-400 mt-2">
                Your SSN is transmitted over TLS and encrypted at rest with AES-256. We comply with all applicable federal and state data protection regulations.
            </p>

            {/* ── Full Disclosure Modal ── */}
            {showDisclosure && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <h3 className="text-base font-bold text-gray-900">Credit Authorization Disclosure</h3>
                            <button
                                type="button"
                                onClick={() => setShowDisclosure(false)}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Scrollable body */}
                        <div className="flex-1 overflow-y-auto px-6 py-5 text-sm text-gray-600 leading-relaxed space-y-4">
                            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
                                <div>
                                    <span className="text-gray-400">Borrower:</span>{' '}
                                    <span className="font-medium text-gray-800">{borrowerName}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400">Date:</span>{' '}
                                    <span className="font-medium text-gray-800">{today}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400">Lender/Broker:</span>{' '}
                                    <span className="font-medium text-gray-800">Lumina Mortgage Platform</span>
                                </div>
                                <div>
                                    <span className="text-gray-400">Loan Originator:</span>{' '}
                                    <span className="font-medium text-gray-800">Amir Moustafa, NMLS# 1631748</span>
                                </div>
                            </div>

                            <hr className="border-gray-200" />

                            <p>
                                In connection with your application for a mortgage loan, you hereby authorize the Broker (or any subsequent Lender/Investor who is processing your application for a mortgage loan) to order a consumer credit report and obtain and verify information regarding your personal and financial background.
                            </p>

                            <p>
                                This credit check will be performed with one or more credit bureaus, and the report we receive includes, but is not limited to, your marital status, number of dependents, current and past employers, current deposit accounts, current and past consumer credit accounts, and your mortgage and/or rental history.
                            </p>

                            <p>
                                You further authorize us to verify your past and present employment earnings records, bank accounts, stock holdings, any asset balances, and any other information deemed necessary to process your mortgage loan application. The information received will only be used to process your application for a mortgage loan.
                            </p>

                            <p>
                                This authorization is for a <strong>soft credit inquiry only</strong>, which will not affect your credit score. This consent will be valid for a period of <strong>180 days</strong> from the date hereof.
                            </p>

                            <hr className="border-gray-200" />

                            <p className="italic text-gray-500">
                                By checking the consent box, I, {borrowerName}, have read the above and hereby consent to and give authorization to order my credit and verify my financial history as indicated above.
                            </p>

                            <p className="text-[10px] text-gray-400">
                                Electronic consent provided on {today} via Lumina Mortgage Platform. This electronic authorization has the same legal effect as a handwritten signature pursuant to the E-SIGN Act (15 U.S.C. &sect; 7001 et seq.).
                            </p>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                            <button
                                type="button"
                                onClick={() => setShowDisclosure(false)}
                                className="w-full py-3 rounded-xl bg-black text-white font-semibold text-sm hover:bg-gray-800 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
