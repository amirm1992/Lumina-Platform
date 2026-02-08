'use client'

import React from 'react'
import { Lender } from './types'
import { Check, Calculator } from 'lucide-react'
/* eslint-disable @next/next/no-img-element */

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
                    ? 'bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] border-[#3B82F6] shadow-[0_0_30px_rgba(37,99,235,0.15)]'
                    : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-lg'
                }
                ${lender.isPlaceholder ? 'opacity-70 grayscale' : ''}
            `}
        >
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                    {/* Placeholder Logo Avatar */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center overflow-hidden
                        ${isSelected ? 'bg-white' : 'bg-gray-100'}
                    `}>
                        {lender.logo ? (
                            <img
                                src={lender.logo}
                                alt={lender.name}
                                className="w-full h-full object-contain p-1"
                            />
                        ) : (
                            <span className={`text - lg font - bold ${isSelected ? 'text-[#2563EB]' : 'text-gray-500'} `}>
                                {lender.name[0]}
                            </span>
                        )}
                    </div>
                    <div>
                        <h3 className="font-bold text-black text-lg">{lender.name}</h3>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">
                            {lender.loanTerm || 30} Year {lender.loanType || 'Fixed'}
                        </p>
                    </div>
                </div>
                {(lender.bestMatch || lender.isRecommended) && (
                    <span className="px-3 py-1 rounded-md bg-[#2563EB] text-[10px] font-bold text-white uppercase tracking-widest shadow-lg shadow-[#2563EB]/30">
                        ⭐ Recommended
                    </span>
                )}
            </div>

            {lender.isPlaceholder ? (
                <div className="flex flex-col items-center justify-center py-8 space-y-3 px-4 text-center">
                    <div className="p-3 bg-blue-50 rounded-full mb-1">
                        <Calculator className="w-5 h-5 text-blue-600 animate-pulse" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-900 mb-1">Calculating your savings...</p>
                        <p className="text-xs text-gray-400">Negotiating the best rates for your unique scenario.</p>
                    </div>
                </div>
            ) : (
                <>
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
                </>
            )}

            {/* Action Button */}
            <button
                className={`w-full py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all
                    ${isSelected
                        ? 'bg-[#1E3A5F] text-white shadow-[0_4px_20px_rgba(30,58,95,0.25)] hover:bg-[#162D4A]'
                        : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-black'
                    }
                    `}
            >
                {isSelected ? 'Pre-Approve Now' : 'Select Offer'}
            </button>

            {/* Selection Ring (Visual Polish) */}
            {isSelected && (
                <div className="absolute inset-0 rounded-2xl border-2 border-[#3B82F6]/30 pointer-events-none animate-pulse" />
            )}
        </div>
    )
}
