'use client'

import React from 'react'

// The full list of approved wholesale lenders we negotiate with
const NEGOTIATION_LENDERS = [
    'UWM',
    'Windsor',
    'Orion Lending',
    'Newrez, LLC Wholesale',
    'PowerTPO',
    'Freedom Mortgage',
    'Pennymac TPO',
    'Sierra-Union Home',
    'Union Home TPO',
    'PRMG',
    'Newfi Wholesale',
    'Mega Capital Funding',
    'Equity Prime Mortgage',
    "Click n' Close",
    '11 Mortgage',
    'AFR, LLC dba eLEND',
    'JMAC Lending',
    'Arc Home LLC',
    'The Loan Store',
    'Plaza Home Mortgage',
    'First Colony Wholesale',
    'REMN',
    'Kind Lending',
    'Oaktree Funding Corp',
]

export function LenderNegotiationList() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-5">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500" />
                    </span>
                    <span className="text-sm font-semibold text-blue-700">Actively Negotiating</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    We&apos;re shopping {NEGOTIATION_LENDERS.length} lenders for your best rate
                </h2>
                <p className="text-gray-500 max-w-lg mx-auto text-sm">
                    Our team is actively contacting each lender below to secure the most competitive offers for your profile. You&apos;ll see your personalized offers here as soon as they&apos;re ready.
                </p>
            </div>

            {/* Lender Grid */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {NEGOTIATION_LENDERS.map((lender, index) => (
                        <div
                            key={lender}
                            className={`flex items-center justify-between px-5 py-4 transition-colors
                                ${index < NEGOTIATION_LENDERS.length - (NEGOTIATION_LENDERS.length % 3 || 3) ? 'border-b border-gray-100' : ''}
                                ${(index + 1) % 3 !== 0 ? 'sm:border-r sm:border-gray-100' : ''}
                            `}
                            style={{ animationDelay: `${index * 80}ms` }}
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                {/* Lender icon */}
                                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 flex items-center justify-center flex-shrink-0">
                                    <span className="text-xs font-bold text-gray-500">
                                        {lender.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <span className="text-sm font-medium text-gray-800 truncate">
                                    {lender}
                                </span>
                            </div>

                            {/* Animated status indicator */}
                            <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                                <div className="flex gap-0.5">
                                    <span
                                        className="w-1 h-3 bg-blue-400 rounded-full animate-pulse"
                                        style={{ animationDelay: `${index * 120}ms`, animationDuration: '1.2s' }}
                                    />
                                    <span
                                        className="w-1 h-3 bg-blue-300 rounded-full animate-pulse"
                                        style={{ animationDelay: `${index * 120 + 200}ms`, animationDuration: '1.2s' }}
                                    />
                                    <span
                                        className="w-1 h-3 bg-blue-200 rounded-full animate-pulse"
                                        style={{ animationDelay: `${index * 120 + 400}ms`, animationDuration: '1.2s' }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom info strip */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-xs text-gray-400">
                <div className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Offers typically arrive within 24–48 hours</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                    <span>256-bit encrypted &middot; No impact on credit score</span>
                </div>
            </div>
        </div>
    )
}
