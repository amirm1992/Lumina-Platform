'use client'

import { useState } from 'react'
import { FileCheck, X } from 'lucide-react'

interface ConsentRecordProps {
    hasConsent: boolean
    signedAt: string | null
    signedName: string | null
    ipAddress: string | null
    borrowerName: string
}

export function ConsentRecord({
    hasConsent,
    signedAt,
    signedName,
    ipAddress,
    borrowerName,
}: ConsentRecordProps) {
    const [showModal, setShowModal] = useState(false)

    if (!hasConsent) {
        return (
            <p className="text-sm text-gray-400 italic">No credit authorization on file.</p>
        )
    }

    const signedDate = signedAt
        ? new Date(signedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        : 'N/A'
    const signedTime = signedAt
        ? new Date(signedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short' })
        : ''
    const displayName = signedName || borrowerName || 'Borrower'

    return (
        <>
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-green-600">
                    <FileCheck className="w-4 h-4" />
                    <span className="text-sm font-medium">Consent signed</span>
                </div>
                <span className="text-xs text-gray-400">{signedDate}</span>
                <button
                    type="button"
                    onClick={() => setShowModal(true)}
                    className="text-purple-600 hover:text-purple-800 text-xs font-medium underline underline-offset-2 transition-colors"
                >
                    View signed disclosure
                </button>
            </div>

            {/* ── Signed Disclosure Modal ── */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <h3 className="text-base font-bold text-gray-900">Credit Authorization — Signed Record</h3>
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Document body */}
                        <div className="flex-1 overflow-y-auto px-8 py-6 text-sm text-gray-700 leading-relaxed space-y-5">
                            <h2 className="text-lg font-bold text-gray-900 text-center uppercase tracking-wide">
                                Consent to Run Credit History
                            </h2>

                            <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm border border-gray-200 rounded-lg p-4 bg-gray-50">
                                <div>
                                    <span className="text-xs text-gray-400 uppercase tracking-wide">Borrower</span>
                                    <p className="font-semibold text-gray-900">{displayName}</p>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-400 uppercase tracking-wide">Date Signed</span>
                                    <p className="font-semibold text-gray-900">{signedDate}</p>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-400 uppercase tracking-wide">Lender / Broker</span>
                                    <p className="font-semibold text-gray-900">Lumina Mortgage Platform</p>
                                </div>
                                <div>
                                    <span className="text-xs text-gray-400 uppercase tracking-wide">Loan Originator</span>
                                    <p className="font-semibold text-gray-900">Amir Moustafa, NMLS# 1631748</p>
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

                            <p className="italic text-gray-600">
                                I, {displayName}, have read the above and hereby consent to and give authorization to order my credit and verify my financial history as indicated above.
                            </p>

                            {/* Digital signature block */}
                            <div className="border border-gray-200 rounded-lg p-5 bg-gray-50 space-y-3">
                                <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Electronic Signature</p>
                                <div className="flex items-end gap-8">
                                    <div className="flex-1">
                                        <p className="font-serif text-2xl text-gray-900 italic border-b border-gray-300 pb-1">
                                            {displayName}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">Signature</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 border-b border-gray-300 pb-1 px-2">
                                            {signedDate}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">Date</p>
                                    </div>
                                </div>
                                <div className="pt-2 border-t border-gray-200 mt-3 grid grid-cols-3 gap-4 text-xs text-gray-500">
                                    <div>
                                        <span className="text-gray-400">Signed at:</span>{' '}
                                        <span className="font-mono">{signedTime}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">IP Address:</span>{' '}
                                        <span className="font-mono">{ipAddress || 'N/A'}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Method:</span>{' '}
                                        <span>Electronic (E-SIGN Act)</span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-[10px] text-gray-400 leading-relaxed">
                                This electronic authorization was provided via the Lumina Mortgage Platform and has the same legal effect as a handwritten signature pursuant to the Electronic Signatures in Global and National Commerce Act (E-SIGN Act, 15 U.S.C. &sect; 7001 et seq.) and the Uniform Electronic Transactions Act (UETA).
                            </p>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="px-5 py-2.5 rounded-xl bg-black text-white font-semibold text-sm hover:bg-gray-800 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
