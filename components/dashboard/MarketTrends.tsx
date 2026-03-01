'use client'

import React, { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { MessageSquare, RefreshCw } from 'lucide-react'

interface RateData {
    date: string
    rate: number
}

type TimeRange = '1W' | '6W' | '6M'

export function MarketTrends() {
    const [data, setData] = useState<RateData[]>([])
    const [filteredData, setFilteredData] = useState<RateData[]>([])
    const [loading, setLoading] = useState(true)
    const [range, setRange] = useState<TimeRange>('6M')
    const [metadata, setMetadata] = useState({ source: '', date: '' })

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch('/api/mortgage-rate?history=true')
                const json = await res.json()

                if (json.history) {
                    setData(json.history)
                    setMetadata({
                        source: json.source,
                        date: json.date
                    })
                }
            } catch (error) {
                console.error('Failed to fetch market trends:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    useEffect(() => {
        if (data.length === 0) return

        let slicedData: RateData[] = []

        // FRED data is weekly. 
        // 6M = ~26 weeks
        // 6W = 6 weeks
        // 1W = Daily View requested (Showing last 4 weeks to give some context as weekly data is sparse)

        switch (range) {
            case '6M':
                slicedData = data.slice(-26)
                break
            case '6W':
                slicedData = data.slice(-6)
                break
            case '1W':
                // User asked for "Daily last 7 days". Since data is weekly, 
                // we show the last few points to show "recent" trend, 
                // otherwise it's just a single dot.
                slicedData = data.slice(-4)
                break
        }
        setFilteredData(slicedData)
    }, [data, range])

    const calculateChange = () => {
        if (filteredData.length < 2) return 0
        const first = filteredData[0].rate
        const last = filteredData[filteredData.length - 1].rate
        return last - first
    }

    const change = calculateChange()

    return (
        <div className="glass p-6 rounded-3xl border border-white/60 bg-white/80 backdrop-blur-xl relative min-h-[300px] flex flex-col shadow-sm transition-shadow hover:shadow-md">
            <div className="flex justify-between items-center mb-6 px-2">
                <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Market Rate Trends</h3>

                {/* Time Range Tabs */}
                <div className="flex bg-slate-100 rounded-lg p-1 border border-slate-200">
                    {(['1W', '6W', '6M'] as TimeRange[]).map((r) => (
                        <button
                            key={r}
                            onClick={() => setRange(r)}
                            className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all ${range === r
                                ? 'bg-[#2563EB] text-white shadow-sm'
                                : 'text-slate-500 hover:text-slate-900 hover:bg-white/60'
                                }`}
                        >
                            {r === '1W' ? 'Daily' : r === '6W' ? 'Weekly' : 'Monthly'}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex-1 flex items-center justify-center text-slate-400 gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span className="text-xs font-semibold tracking-wide">Loading data...</span>
                </div>
            ) : (
                <div className="flex-1 w-full min-h-[200px]" style={{ minHeight: '200px' }}>
                    {/* Debug: Print data length to invisible element */}
                    <span className="hidden" data-testid="chart-data-length">{filteredData.length}</span>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={filteredData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                            <defs>
                                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="#2563EB" stopOpacity={0.8} />
                                    <stop offset="100%" stopColor="#60A5FA" stopOpacity={0.8} />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="date"
                                hide
                                padding={{ left: 10, right: 10 }}
                            />
                            <YAxis
                                hide
                                domain={['dataMin - 0.5', 'dataMax + 0.5']}
                                padding={{ top: 20, bottom: 20 }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    backdropFilter: 'blur(8px)',
                                    border: '1px solid rgba(255,255,255,0.6)',
                                    borderRadius: '16px',
                                    boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)'
                                }}
                                itemStyle={{ color: '#0F172A', fontSize: '14px', fontWeight: '800' }}
                                formatter={(value: number) => [`${value.toFixed(2)}%`, 'Rate']}
                                labelStyle={{ color: '#64748B', marginBottom: '6px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                                labelFormatter={(label) => new Date(label).toLocaleDateString()}
                            />
                            <Line
                                type="monotone"
                                dataKey="rate"
                                stroke="#2563EB"
                                strokeWidth={4}
                                dot={{ r: 4, fill: '#2563EB', strokeWidth: 0 }}
                                activeDot={{ r: 6, fill: '#fff', stroke: '#2563EB', strokeWidth: 3 }}
                                isAnimationActive={false} // Disable animation to rule out render lag
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}

            {!loading && (
                <div className="mt-4 pt-5 border-t border-slate-200/50">
                    <p className="text-[11px] text-slate-500 text-center mb-2 font-medium">
                        Rates have <span className={change > 0 ? "text-rose-500 font-bold" : "text-emerald-500 font-bold"}>
                            {change > 0 ? 'increased' : 'decreased'} by {Math.abs(change).toFixed(3)}%
                        </span> over this period.
                    </p>
                    <div className="flex justify-between items-center px-2">
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                            Source: {metadata.source || 'FRED'}
                        </p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                            As of: {metadata.date}
                        </p>
                    </div>
                </div>
            )}

            {/* Chat fab */}
            <button className="absolute -bottom-3 -right-3 w-12 h-12 bg-[#2563EB] rounded-full flex items-center justify-center text-white shadow-lg shadow-[#2563EB]/30 hover:scale-110 transition-transform z-10 hover:bg-[#1D4ED8]">
                <MessageSquare className="w-5 h-5" />
            </button>
        </div>
    )
}
