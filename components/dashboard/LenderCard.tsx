'use client'

import React from 'react'
import { Lender } from './types'
import { Check } from 'lucide-react'

interface LenderCardProps {
    lender: Lender
    isSelected: boolean
    onSelect: () => void
}

export function LenderCard({ lender, isSelected, onSelect }: LenderCardProps) {
    return (
        <div
            onClick={onSelect}
            className={`
                relative p-6 rounded-2xl border cursor-pointer transition-all duration-300 group
                ${isSelected
                    ? 'bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200 shadow-[0_0_30px_rgba(168,85,247,0.15)]'
                    : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-lg'
                }
            `}
        >
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                    {/* Placeholder Logo Avatar */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold
                        ${isSelected ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-500'}
                    `}>
                        {lender.name[0]}
                    </div>
                    <div>
                        <h3 className="font-bold text-black text-lg">{lender.name}</h3>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">
                            {lender.loanTerm || 30} Year {lender.loanType || 'Fixed'}
                        </p>
                    </div>
                </div>
                {(lender.bestMatch || lender.isRecommended) && (
                    <span className="px-3 py-1 rounded-md bg-purple-600 text-[10px] font-bold text-white uppercase tracking-widest shadow-lg shadow-purple-500/30">
                        ⭐ Recommended
                    </span>
                )}
            </div>

            {/* Rates */}
            <div className="grid grid-cols-2 gap-8 mb-6">
                <div>
                    <p className="text-xs text-gray-500 mb-1">Interest Rate</p>
                    <p className="text-3xl font-bold text-black tracking-tight">{lender.rate.toFixed(3)}%</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 mb-1">APR</p>
                    <p className="text-3xl font-bold text-black tracking-tight opacity-80">{lender.apr.toFixed(3)}%</p>
                </div>
            </div>

            {/* Details */}
            <div className="space-y-3 mb-8 border-t border-gray-100 pt-6">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Monthly P&I</span>
                    <span className="font-semibold text-black">${lender.monthlyPayment.toLocaleString()}</span>
                </div>
                {lender.closingCosts && (
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Closing Costs</span>
                        <span className="font-semibold text-black">${lender.closingCosts.toLocaleString()}</span>
                    </div>
                )}
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Points</span>
                    <span className="font-semibold text-black">{lender.points}</span>
                </div>
            </div>

            {/* Action Button */}
            <button
                className={`w-full py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all
                    ${isSelected
                        ? 'bg-black text-white shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:bg-gray-800'
                        : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-black'
                    }
                `}
            >
                {isSelected ? 'Pre-Approve Now' : 'Select Offer'}
            </button>

            {/* Selection Ring (Visual Polish) */}
            {isSelected && (
                <div className="absolute inset-0 rounded-2xl border-2 border-purple-500/30 pointer-events-none animate-pulse" />
            )}
        </div>
    )
}
