'use client'

import React from 'react'

interface ScenarioAdjusterProps {
    homeValue: number
    loanAmount: number
    downPayment: number
    onEdit: () => void
}

const formatCurrency = (val: number) => `$${val.toLocaleString()}`

export function ScenarioAdjuster({ homeValue, loanAmount, downPayment, onEdit }: ScenarioAdjusterProps) {
    return (
        <div className="glass p-6 rounded-2xl flex flex-wrap gap-8 items-center border border-gray-100 bg-white">

            <div className="flex-1 min-w-[140px]">
                <label className="text-[10px] text-gray-500 uppercase font-bold mb-1 block tracking-wider">Home Value</label>
                <div className="text-2xl font-bold text-black tracking-tight">{formatCurrency(homeValue)}</div>
            </div>

            <div className="w-px h-10 bg-gray-200 hidden md:block" />

            <div className="flex-1 min-w-[140px]">
                <label className="text-[10px] text-gray-500 uppercase font-bold mb-1 block tracking-wider">Loan Amount</label>
                <div className="text-2xl font-bold text-black tracking-tight">{formatCurrency(loanAmount)}</div>
            </div>

            <div className="w-px h-10 bg-gray-200 hidden md:block" />

            <div className="flex-1 min-w-[140px]">
                <label className="text-[10px] text-gray-500 uppercase font-bold mb-1 block tracking-wider">Down Payment</label>
                <div className="text-2xl font-bold text-gray-500 tracking-tight">{formatCurrency(downPayment)}</div>
            </div>

            <button
                onClick={onEdit}
                className="px-6 py-3 rounded-xl text-sm font-semibold text-gray-500 border border-gray-200 hover:bg-gray-50 hover:text-black transition-all ml-auto"
            >
                Edit Details
            </button>
        </div>
    )
}
