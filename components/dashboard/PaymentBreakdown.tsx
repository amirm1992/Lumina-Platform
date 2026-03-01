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
        <div className="glass p-8 rounded-3xl border border-white/60 bg-white/80 backdrop-blur-xl relative overflow-hidden shadow-sm transition-shadow hover:shadow-md">
            {/* Chart Background */}
            <div className="absolute inset-x-0 bottom-0 h-48 opacity-20 pointer-events-none">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
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

            <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-8 relative z-10">Payment Breakdown</h3>

            <div className="flex flex-col items-center justify-center py-6 relative z-10">
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mb-2">Total Monthly</p>
                <p className="text-5xl font-extrabold text-slate-900 mb-1 tracking-tighter">{formatCurrency(totalMonthly)}</p>
                <div className="h-1 w-24 bg-gradient-to-r from-transparent via-[#2563EB] to-transparent mt-4 opacity-40 rounded-full" />
            </div>

            <div className="space-y-4 mt-8 relative z-10 border-t border-slate-200/50 pt-6">
                <div className="flex justify-between items-center text-[13px]">
                    <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#2563EB] shadow-[0_0_8px_rgba(37,99,235,0.4)]" />
                        <span className="text-slate-500 font-medium tracking-wide">Principal & Interest</span>
                    </div>
                    <span className="text-slate-900 font-bold">{formatCurrency(monthlyPayment)}</span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                    <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                        <span className="text-slate-500 font-medium tracking-wide">Est. Property Tax</span>
                    </div>
                    <span className="text-slate-900 font-bold">{formatCurrency(propertyTax)}</span>
                </div>
                <div className="flex justify-between items-center text-[13px]">
                    <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                        <span className="text-slate-500 font-medium tracking-wide">Est. Home Insurance</span>
                    </div>
                    <span className="text-slate-900 font-bold">{formatCurrency(homeInsurance)}</span>
                </div>
            </div>
        </div>
    )
}
