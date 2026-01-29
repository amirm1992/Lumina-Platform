'use client'

import React from 'react'
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts'

interface PaymentBreakdownProps {
    monthlyPayment: number
    propertyTax: number
    homeInsurance: number
}

const formatCurrency = (val: number) => `$${val.toLocaleString()}`

export function PaymentBreakdown({ monthlyPayment, propertyTax, homeInsurance }: PaymentBreakdownProps) {
    const totalMonthly = monthlyPayment + propertyTax + homeInsurance

    // Mock data structure required for AreaChart
    const data = [
        { name: 'Start', value: monthlyPayment },
        { name: 'End', value: 0 } // Simple tapering effect for visual
    ]

    return (
        <div className="glass p-8 rounded-3xl border border-gray-100 bg-white relative overflow-hidden shadow-sm">
            {/* Chart Background */}
            <div className="absolute inset-x-0 bottom-0 h-64 opacity-20 pointer-events-none">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.5} />
                                <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#2563EB"
                            strokeWidth={2}
                            fill="url(#chartGradient)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <h3 className="text-lg font-semibold text-black mb-8 relative z-10">Payment Breakdown</h3>

            <div className="flex flex-col items-center justify-center py-8 relative z-10">
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Total Monthly</p>
                <p className="text-5xl font-bold text-black mb-1">{formatCurrency(totalMonthly)}</p>
                <div className="h-1 w-24 bg-gradient-to-r from-transparent via-[#3B82F6] to-transparent mt-4 opacity-50" />
            </div>

            <div className="space-y-4 mt-8 relative z-10">
                <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#2563EB] shadow-[0_0_8px_rgba(37,99,235,0.6)]" />
                        <span className="text-gray-500 font-medium">Principal & Interest</span>
                    </div>
                    <span className="text-black font-semibold">{formatCurrency(monthlyPayment)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-gray-400" />
                        <span className="text-gray-500 font-medium">Est. Property Tax</span>
                    </div>
                    <span className="text-black font-semibold">{formatCurrency(propertyTax)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-gray-400" />
                        <span className="text-gray-500 font-medium">Est. Home Insurance</span>
                    </div>
                    <span className="text-black font-semibold">{formatCurrency(homeInsurance)}</span>
                </div>
            </div>
        </div>
    )
}
