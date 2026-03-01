'use client'

import React from 'react'
import { Lender } from './types'
import { Check, Calculator } from 'lucide-react'
/* eslint-disable @next/next/no-img-element */

interface LenderCardProps {
    lender: Lender
    isSelected: boolean
    onSelect: () => void
    onPreApprove?: () => void
}

export function LenderCard({ lender, isSelected, onSelect, onPreApprove }: LenderCardProps) {
    const isPlaceholder = lender.isPlaceholder === true
    return (
        <div
            onClick={isPlaceholder ? undefined : onSelect}
            role={isPlaceholder ? undefined : 'button'}
            className={`
                relative p-6 rounded-3xl border cursor-pointer transition-all duration-300 group overflow-hidden
                backdrop-blur-xl
                ${isSelected
                    ? 'bg-[#EBF5FF]/90 border-[#2563EB]/40 shadow-[0_8px_30px_rgba(37,99,235,0.12)] ring-1 ring-[#2563EB]/20'
                    : 'bg-white/80 border-white/60 hover:bg-white/95 hover:shadow-xl hover:-translate-y-1'
                }
                ${isPlaceholder ? 'opacity-90 grayscale cursor-default' : 'cursor-pointer'}
            `}
        >
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                    {/* Placeholder Logo Avatar */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center overflow-hidden shrink-0 shadow-sm
                        ${isSelected ? 'bg-white' : 'bg-slate-50'}
                    `}>
                        {lender.logo ? (
                            <img
                                src={lender.logo}
                                alt={lender.name}
                                className="w-full h-full object-contain p-2"
                            />
                        ) : (
                            <span className={`text-xl font-bold ${isSelected ? 'text-[#2563EB]' : 'text-slate-400'}`}>
                                {lender.name[0]}
                            </span>
                        )}
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 text-lg tracking-tight">{lender.name}</h3>
                        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">
                            {lender.loanTerm || 30} Year {lender.loanType || 'Fixed'}
                        </p>
                    </div>
                </div>
                {(lender.bestMatch || lender.isRecommended) && (
                    <span className="px-3 py-1.5 rounded-full bg-[#2563EB] text-[10px] font-bold text-white uppercase tracking-widest shadow-md shadow-[#2563EB]/20 ml-2">
                        ⭐ Best
                    </span>
                )}
            </div>

            {isPlaceholder ? (
                <div className="flex flex-col items-center justify-center py-8 space-y-3 px-4 text-center">
                    <div className="p-3 bg-blue-50/50 rounded-full mb-1">
                        <Calculator className="w-5 h-5 text-[#2563EB] animate-pulse" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-900 mb-1">Calculating your savings…</p>
                        <p className="text-xs text-slate-500">We’re gathering your personalized offer from {lender.name}. You’ll see your rate here as soon as it’s ready.</p>
                    </div>
                </div>
            ) : (
                <>
                    {/* Rates */}
                    <div className="grid grid-cols-2 gap-8 mb-6">
                        <div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Interest Rate</p>
                            <p className="text-4xl font-extrabold text-[#2563EB] tracking-tighter">{lender.rate.toFixed(3)}%</p>
                        </div>
                        <div>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">APR</p>
                            <p className="text-4xl font-extrabold text-slate-800 tracking-tighter opacity-90">{lender.apr.toFixed(3)}%</p>
                        </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-3 mb-8 border-t border-slate-200/50 pt-6">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500 font-medium tracking-wide">Monthly P&I</span>
                            <span className="font-bold text-slate-900">${lender.monthlyPayment.toLocaleString()}</span>
                        </div>
                        {lender.closingCosts && (
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500 font-medium tracking-wide">Closing Costs</span>
                                <span className="font-bold text-slate-900">${lender.closingCosts.toLocaleString()}</span>
                            </div>
                        )}
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500 font-medium tracking-wide">Points</span>
                            <span className="font-bold text-slate-900">{lender.points}</span>
                        </div>
                    </div>
                </>
            )}

            {/* Action Button: disabled for placeholders so we don't imply an actual offer */}
            <button
                type="button"
                disabled={isPlaceholder}
                onClick={(e) => {
                    if (isSelected && onPreApprove) {
                        e.stopPropagation()
                        onPreApprove()
                    }
                }}
                className={`w-full py-4 rounded-2xl font-bold text-[13px] uppercase tracking-widest transition-all duration-300 shadow-sm
                    ${isPlaceholder
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : isSelected
                            ? 'bg-[#2563EB] text-white hover:bg-[#1D4ED8] hover:shadow-[0_4px_20px_rgba(37,99,235,0.3)] hover:-translate-y-0.5'
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300'
                    }
                    `}
            >
                {isPlaceholder ? 'In progress' : isSelected ? 'Pre-Approve Now' : 'Select Offer'}
            </button>

            {/* Selection Ring (Visual Polish) */}
            {isSelected && (
                <div className="absolute inset-0 rounded-3xl border-2 border-[#2563EB]/40 pointer-events-none" />
            )}
        </div>
    )
}
