'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useApplicationStore } from '@/store/applicationStore'
import { trackStepComplete } from '@/lib/analytics'

const fmt = (v: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v)

export function ValueLoanSliders() {
    const router = useRouter()
    const { estimatedValue, loanAmount, setEstimatedValue, setLoanAmount, nextStep, prevStep } = useApplicationStore()

    const ltv = estimatedValue > 0 ? (loanAmount / estimatedValue) * 100 : 0

    const handleNext = () => { trackStepComplete(5); nextStep(); router.push('/apply/step/6') }
    const handleBack = () => { prevStep(); router.push('/apply/step/4') }

    return (
        <div className="space-y-8">
            <div><h1 className="text-3xl font-bold text-black mb-2">Estimated Value & Loan Amount</h1><p className="text-gray-500">Adjust the sliders to match your needs.</p></div>

            <div className="space-y-6">
                {/* Est Value */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Property Value</span>
                        <span className="font-bold text-black">${estimatedValue.toLocaleString()}</span>
                    </div>
                    <input
                        type="range" min={100000} max={2000000} step={5000}
                        value={estimatedValue}
                        onChange={(e) => setEstimatedValue(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#2563EB]"
                    />
                </div>

                {/* Loan Amount */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Loan Amount</span>
                        <span className="font-bold text-black">${loanAmount.toLocaleString()}</span>
                    </div>
                    <input
                        type="range" min={50000} max={estimatedValue} step={5000}
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#2563EB]"
                    />
                </div>

                {/* LTV */}
                <div className="p-4 rounded-xl bg-[#EFF6FF] border border-[#DBEAFE] flex justify-between items-center">
                    <span className="text-[#1E3A5F] font-medium">Loan-to-Value (LTV)</span>
                    <span className={`font-bold ${ltv > 80 ? 'text-amber-600' : 'text-green-600'}`}>{ltv.toFixed(0)}%</span>
                </div>
            </div>

            <div className="flex gap-4">
                <button onClick={handleBack} className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all">Back</button>
                <button onClick={handleNext} className="flex-[2] py-4 bg-black text-white rounded-xl font-bold hover:bg-gray-800 shadow-md hover:shadow-lg transition-all">Continue</button>
            </div>
        </div>
    )
}
