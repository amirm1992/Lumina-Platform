'use client'

import React, { useState } from 'react'
import { X, FileText, Check, Loader2, ShieldCheck } from 'lucide-react'
import type { DisclosureSignature } from '@/types/database'

interface DisclosureSignModalProps {
    isOpen: boolean
    onClose: () => void
    disclosure: DisclosureSignature
    label: string
    description: string
    onSigned: (updated: DisclosureSignature) => void
}

// Disclosure content templates (simplified — in production these would be full legal docs)
const DISCLOSURE_CONTENT: Record<string, string> = {
    disclosure_le: `LOAN ESTIMATE DISCLOSURE

This Loan Estimate provides important information about the mortgage loan you have requested. This is not a commitment to lend. The actual terms of the loan may change.

Under the Real Estate Settlement Procedures Act (RESPA) and the Truth in Lending Act (TILA), your lender is required to provide this Loan Estimate within three business days of receiving your completed application.

This disclosure includes:
• Estimated loan terms, projected payments, and closing costs
• Comparisons to help you understand costs
• Important information about your loan

By signing below, you acknowledge receipt of this Loan Estimate and understand that this is an estimate only. Final terms will be provided in the Closing Disclosure.`,

    disclosure_til: `TRUTH IN LENDING DISCLOSURE

This disclosure is provided pursuant to the Truth in Lending Act (15 U.S.C. § 1601 et seq.) and Regulation Z (12 C.F.R. Part 1026).

This document provides information about the cost of your credit, including:
• Annual Percentage Rate (APR) — the cost of your credit as a yearly rate
• Finance Charge — the dollar amount the credit will cost you
• Amount Financed — the amount of credit provided to you
• Total of Payments — the amount you will have paid after making all payments as scheduled

By signing below, you acknowledge receipt and understanding of this Truth in Lending disclosure.`,

    disclosure_intent_to_proceed: `INTENT TO PROCEED

By signing this disclosure, you are indicating your intent to proceed with this mortgage loan application based on the terms provided in the Loan Estimate.

This is NOT a commitment to close the loan. You may withdraw your application at any time before closing without penalty.

Your lender will not charge you any fees (other than a credit report fee, if applicable) before you indicate your intent to proceed.

By signing below, you confirm your intent to proceed with this loan application.`,

    disclosure_credit_auth: `CREDIT AUTHORIZATION DISCLOSURE

By signing below, you authorize the lender, mortgage broker, and their designated agents to:

1. Obtain your credit report from one or more consumer reporting agencies
2. Verify the information provided in your loan application
3. Share your credit information with potential lenders for the purpose of obtaining a mortgage loan

This authorization is valid for 120 days from the date of signature and is governed by the Fair Credit Reporting Act (15 U.S.C. § 1681 et seq.) and the Equal Credit Opportunity Act.`,

    disclosure_econsent: `ELECTRONIC RECORDS AND SIGNATURE CONSENT (E-SIGN ACT)

Pursuant to the Electronic Signatures in Global and National Commerce Act (E-SIGN Act, 15 U.S.C. § 7001 et seq.), you are consenting to conduct transactions electronically.

By providing your electronic signature, you agree that:
• Electronic signatures carry the same legal weight as handwritten signatures
• You consent to receive documents and disclosures electronically
• You may withdraw this consent at any time by contacting your loan officer
• You have the ability to access and retain electronic records

Hardware/Software Requirements: A computer or mobile device with internet access and a current web browser.`,

    disclosure_state: `STATE-SPECIFIC DISCLOSURES

Additional disclosures required by your state's laws and regulations are provided herein. These may include:
• State-specific mortgage broker disclosures
• State consumer protection notices
• State-required fee disclosures
• State right-to-cancel notices

Please review these disclosures carefully. By signing below, you acknowledge receipt and understanding of all state-specific disclosures applicable to your loan.`,
}

export function DisclosureSignModal({
    isOpen,
    onClose,
    disclosure,
    label,
    description,
    onSigned,
}: DisclosureSignModalProps) {
    const [signedName, setSignedName] = useState('')
    const [agreed, setAgreed] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const content = DISCLOSURE_CONTENT[disclosure.disclosure_type] || 'Disclosure content not available.'

    const handleSign = async () => {
        if (!signedName.trim() || !agreed) return

        setSubmitting(true)
        setError(null)

        try {
            const res = await fetch(`/api/disclosures/${disclosure.id}/sign`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ signed_name: signedName.trim() }),
            })

            if (!res.ok) {
                const data = await res.json().catch(() => ({}))
                throw new Error(data.error || 'Failed to sign disclosure')
            }

            const data = await res.json()
            onSigned(data.signature)
            onClose()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong')
        } finally {
            setSubmitting(false)
        }
    }

    if (!isOpen) return null

    const alreadySigned = disclosure.status === 'signed'

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-2xl bg-white border border-gray-100 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">{label}</h2>
                            <p className="text-xs text-gray-500">{description}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                {/* Disclosure Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6 max-h-[300px] overflow-y-auto">
                        <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans leading-relaxed">
                            {content}
                        </pre>
                    </div>

                    {alreadySigned ? (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                            <Check className="w-8 h-8 text-green-600 mx-auto mb-2" />
                            <p className="text-sm font-medium text-green-800">
                                Signed by {disclosure.signed_name} on{' '}
                                {disclosure.signed_at
                                    ? new Date(disclosure.signed_at).toLocaleDateString('en-US', {
                                        year: 'numeric', month: 'long', day: 'numeric',
                                        hour: '2-digit', minute: '2-digit',
                                    })
                                    : 'N/A'
                                }
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Agreement Checkbox */}
                            <label className="flex items-start gap-3 mb-5 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={agreed}
                                    onChange={(e) => setAgreed(e.target.checked)}
                                    className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">
                                    I have read and understand this disclosure. I agree to the terms described above and consent to signing electronically pursuant to the E-SIGN Act (15 U.S.C. &sect; 7001 et seq.).
                                </span>
                            </label>

                            {/* Signature Field */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Type your full legal name to sign
                                </label>
                                <input
                                    type="text"
                                    value={signedName}
                                    onChange={(e) => setSignedName(e.target.value)}
                                    placeholder="John A. Doe"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-lg font-serif italic focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Security Notice */}
                            <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                Your signature is encrypted and timestamped. IP address is recorded for compliance.
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 mb-4">
                                    {error}
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        {alreadySigned ? 'Close' : 'Cancel'}
                    </button>

                    {!alreadySigned && (
                        <button
                            onClick={handleSign}
                            disabled={!signedName.trim() || !agreed || submitting}
                            className={`flex items-center gap-2 px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${
                                signedName.trim() && agreed && !submitting
                                    ? 'bg-[#1E3A5F] text-white hover:bg-[#162D4A] shadow-lg shadow-[#1E3A5F]/20'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Signing...
                                </>
                            ) : (
                                <>
                                    Sign Disclosure
                                    <Check className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
