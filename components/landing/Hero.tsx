'use client'

declare global {
    namespace JSX {
        interface IntrinsicElements {
            'spline-viewer': any;
        }
    }
}

import React, { useEffect, useState, useMemo, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Script from 'next/script'
import dynamic from 'next/dynamic'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { ChevronRight } from 'lucide-react'

// Dynamic import for Lottie to avoid SSR issues
const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

// Dynamic import for 3D Scene
const SceneClient = dynamic(() => import('./Scene').then(mod => mod.Scene), {
    ssr: false,
    loading: () => <div className="w-full h-full flex items-center justify-center text-slate-400 font-medium">Loading 3D Scene...</div>
})
interface MortgageRate {
    rate: number
    date: string
    source: string
    description?: string
    isFallback?: boolean
    history?: { date: string, rate: number }[]
}

export function Hero() {
    const [rateData, setRateData] = useState<MortgageRate | null>(null)
    const [loading, setLoading] = useState(true)
    const [loanAmount, setLoanAmount] = useState(350000)
    const [loanTerm, setLoanTerm] = useState(30)
    const [interestRate, setInterestRate] = useState(6.5)
    type ChartView = 'D' | 'M' | 'W'
    const [chartView, setChartView] = useState<ChartView>('W')
    const [lottieData, setLottieData] = useState<Record<string, unknown> | null>(null)
    const [lottieDataLoan, setLottieDataLoan] = useState<Record<string, unknown> | null>(null)
    const [splineLoaded, setSplineLoaded] = useState(false)

    // Skip Spline on mobile / low-end devices
    const [shouldLoadSpline, setShouldLoadSpline] = useState(false)

    useEffect(() => {
        const checkDeviceCapability = () => {
            const isMobile = window.innerWidth < 768
            const isLowEnd = (navigator.hardwareConcurrency || 4) <= 2

            // Optional WebGL check
            try {
                const canvas = document.createElement('canvas')
                const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
                if (!gl) return false
            } catch (e) {
                return false
            }

            return !isMobile && !isLowEnd
        }

        setShouldLoadSpline(checkDeviceCapability())
    }, [])

    useEffect(() => {
        // Fetch Lottie animation data
        fetch('/rocksolid-estate.json')
            .then(res => res.json())
            .then(data => setLottieData(data))
            .catch(err => console.warn('Failed to load animation:', err))

        // Fetch second Lottie animation
        fetch('/mortgage-loan.json')
            .then(res => res.json())
            .then(data => setLottieDataLoan(data))
            .catch(err => console.warn('Failed to load loan animation:', err))
    }, [])

    useEffect(() => {
        async function fetchRate() {
            try {
                const response = await fetch('/api/mortgage-rate?history=true')

                if (!response.ok) throw new Error('Failed to fetch')

                const data = await response.json()
                setRateData(data)
                if (data.rate) {
                    setInterestRate(data.rate)
                }
            } catch (error) {
                console.warn('Failed to fetch rate:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchRate()
    }, [])

    const chartData = useMemo(() => {
        if (!rateData?.history && !rateData?.rate) return []

        if (chartView === 'D') {
            const currentRate = rateData?.rate || 6.5
            const today = new Date()
            return Array.from({ length: 6 }, (_, i) => {
                const d = new Date(today)
                d.setDate(today.getDate() - (5 - i))
                return {
                    date: d.toISOString().split('T')[0],
                    rate: currentRate,
                    label: d.toLocaleDateString('en-US', { weekday: 'short' }),
                    fullDate: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                }
            })
        }

        let data: { date: string; rate: number }[] = []
        if (chartView === 'M') {
            if (rateData?.history) {
                const last26Weeks = rateData.history.slice(-26)
                data = last26Weeks.filter((_, i) => i % 4 === 0).slice(-6)
            }
        } else {
            if (rateData?.history) {
                data = rateData.history.slice(-6)
            }
        }

        return data.map((item) => ({
            ...item,
            label: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            fullDate: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        }))
    }, [rateData, chartView])

    // Memoize monthly payment calculation
    const monthlyPayment = useMemo(() => {
        const monthlyRate = interestRate / 100 / 12
        const numberOfPayments = loanTerm * 12
        if (monthlyRate === 0) return loanAmount / numberOfPayments
        return (
            (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
            (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
        )
    }, [loanAmount, interestRate, loanTerm])

    const totalInterest = useMemo(
        () => monthlyPayment * loanTerm * 12 - loanAmount,
        [monthlyPayment, loanTerm, loanAmount]
    )

    return (
        <>
            {/* Hero Section with Light Background */}
            <section
                aria-label="Hero — mortgage rate comparison"
                className="relative min-h-screen bg-gradient-to-br from-[#eef5fb] via-[#e0eaf5] to-[#d1e0f0] flex flex-col justify-center overflow-hidden font-sans text-[#1a202c] pt-24 pb-8"
            >
                {/* Main Content Area */}
                <main className="flex-1 flex flex-col lg:flex-row items-center justify-between px-6 lg:px-24 w-full max-w-7xl mx-auto relative z-10">

                    {/* Left Column - Text */}
                    <div className="w-full lg:w-[55%] flex flex-col justify-center gap-6 z-10 mt-12 lg:mt-0">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-md border border-white/60 text-sm font-medium text-slate-700 w-fit shadow-sm">
                            <span className="flex h-2 w-2 rounded-full bg-[#2563EB] animate-pulse"></span>
                            AI-Powered Mortgage Platform
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-slate-900">
                            A smarter way to find<br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#2563EB] to-[#60A5FA]">your perfect mortgage</span>
                        </h1>
                        <p className="text-xl text-slate-600 max-w-lg leading-relaxed mt-2">
                            Compare rates from top lenders instantly. Our AI analyzes your profile to find the best loan options tailored just for you.
                        </p>

                        <div className="flex flex-wrap gap-4 mt-6">
                            <Link href="/apply">
                                <button className="flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-8 py-4 rounded-full font-semibold transition-colors shadow-lg shadow-[#2563EB]/25 w-full sm:w-auto">
                                    Get It For Your Home
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </Link>
                            <Link href="#calculator">
                                <button className="flex items-center justify-center gap-2 bg-white/50 hover:bg-white/80 text-[#2563EB] border border-[#BFDBFE] px-8 py-4 rounded-full font-semibold transition-colors backdrop-blur-sm shadow-sm ring-1 ring-white/60 w-full sm:w-auto">
                                    Discover More
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </Link>
                        </div>

                        {/* Trust Badges */}
                        <div className="flex items-center gap-6 sm:gap-8 mt-10">
                            <Image src="/logos/equal-housing.png" alt="Equal Housing Opportunity" width={500} height={500} className="h-10 sm:h-12 w-auto opacity-70" />
                            <div className="w-px h-10 bg-slate-300" />
                            <div className="flex items-center gap-2.5 text-slate-600">
                                <svg className="w-6 h-6 sm:w-7 sm:h-7 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                                </svg>
                                <div>
                                    <div className="text-sm font-bold tracking-wide text-slate-800">NMLS #1631748</div>
                                    <div className="text-[10px] text-slate-500 font-medium tracking-wide">Federally Registered</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - 3D Canvas */}
                    <div className="w-full lg:w-1/2 h-[400px] lg:h-[600px] absolute lg:relative right-0 opacity-30 lg:opacity-100 pointer-events-none lg:pointer-events-auto">
                        {shouldLoadSpline ? <SceneClient /> : null}
                    </div>
                </main>

                <div className="container mx-auto px-6 lg:px-24 mb-6 relative z-10 w-full max-w-7xl">
                    {/* Live Rate Dashboard (Moved Below) */}
                    <div className="mt-8 bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl p-6 md:p-8 w-full shadow-lg">
                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Rate Column */}
                            <div className="md:col-span-1 flex flex-col justify-center text-center md:text-left">
                                <h3 className="text-gray-600 text-lg font-semibold mb-1">Current 30-Year Fixed</h3>
                                <div className="text-6xl font-extrabold text-[#0F172A] tracking-tighter mb-4">
                                    {loading ? '---' : `${rateData?.rate?.toFixed(2)}%`}
                                </div>
                                <div className="text-gray-500 text-xs font-medium">
                                    Source: FRED • Updated {new Date().toLocaleDateString()}
                                </div>
                            </div>

                            {/* Chart Area */}
                            <div className="md:col-span-2 min-h-[220px] w-full bg-white/40 rounded-2xl p-4 border border-white/60 relative group shadow-sm">
                                {/* Glassmorphic Grid Overlay */}
                                <div className="absolute inset-x-4 bottom-4 top-4 border-b border-gray-200/50 pointer-events-none" />

                                {/* Controls */}
                                <div className="absolute top-4 right-4 z-10 flex p-1 bg-white/60 rounded-full border border-gray-200 backdrop-blur-md">
                                    {(['D', 'M', 'W'] as const).map((view) => {
                                        const labels: Record<string, string> = { D: 'Daily', M: 'Monthly', W: 'Weekly' }
                                        return (
                                            <button
                                                key={view}
                                                onClick={() => setChartView(view)}
                                                aria-label={`Show ${labels[view]} rate trend`}
                                                aria-pressed={chartView === view}
                                                className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${chartView === view
                                                    ? 'bg-white text-[#2563EB] shadow-sm ring-1 ring-gray-200'
                                                    : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
                                                    }`}
                                            >
                                                {view}
                                            </button>
                                        )
                                    })}
                                </div>

                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                                                <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis
                                            dataKey="label"
                                            stroke="rgba(15, 23, 42, 0.2)"
                                            tick={{ fill: 'rgba(15, 23, 42, 0.5)', fontSize: 10, dy: 10, fontWeight: 500 }}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            hide={true}
                                            domain={['dataMin - 0.2', 'dataMax + 0.2']}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                backdropFilter: 'blur(8px)',
                                                borderRadius: '12px',
                                                border: '1px solid rgba(226, 232, 240, 1)',
                                                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                                                padding: '12px'
                                            }}
                                            itemStyle={{ color: '#0F172A', fontWeight: 700, fontSize: '14px' }}
                                            labelStyle={{ color: '#64748B', marginBottom: '4px', fontSize: '12px', borderBottom: '1px solid #E2E8F0', paddingBottom: '4px', fontWeight: 500 }}
                                            formatter={(value: number) => [`${value.toFixed(2)}%`, 'Rate']}
                                            labelFormatter={(_, payload) => payload[0]?.payload?.fullDate || ''}
                                            cursor={{ stroke: 'rgba(15, 23, 42, 0.1)', strokeWidth: 1, strokeDasharray: '4 4' }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="rate"
                                            stroke="#2563EB"
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#colorRate)"
                                            dot={{ r: 4, strokeWidth: 2, stroke: '#2563EB', fill: '#FFFFFF' }}
                                            activeDot={{ r: 6, fill: '#1D4ED8', stroke: '#BFDBFE', strokeWidth: 4 }}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Calculator Section with Light Blue Background */}
            <section id="calculator" className="py-20 bg-[#EFF6FF]">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A5F] mb-4">
                            Stay on budget — calculate your monthly loan easily
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Use our calculator to estimate your monthly payments and plan your home purchase.
                        </p>
                    </div>

                    <div className="max-w-5xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Calculator Inputs */}
                            <div className="bg-white rounded-3xl p-8 shadow-sm">
                                <div className="space-y-6">
                                    {/* Loan Amount Slider */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Loan Amount
                                        </label>
                                        <div className="text-2xl font-bold text-[#1E3A5F] mb-3">
                                            ${loanAmount.toLocaleString()}
                                        </div>
                                        <input
                                            type="range"
                                            min="50000"
                                            max="1000000"
                                            step="10000"
                                            value={loanAmount}
                                            onChange={(e) => setLoanAmount(Number(e.target.value))}
                                            className="w-full h-2 bg-[#3B82F6] rounded-lg appearance-none cursor-pointer accent-[#1E3A5F]"
                                            aria-label={`Loan amount: $${loanAmount.toLocaleString()}`}
                                        />
                                        <div className="flex justify-between text-sm text-gray-500 mt-2">
                                            <span>$50k</span>
                                            <span>$1M</span>
                                        </div>
                                    </div>

                                    {/* Interest Rate */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Interest Rate (%)
                                        </label>
                                        <input
                                            type="range"
                                            min="3"
                                            max="10"
                                            step="0.125"
                                            value={interestRate}
                                            onChange={(e) => setInterestRate(Number(e.target.value))}
                                            className="w-full h-2 bg-[#3B82F6] rounded-lg appearance-none cursor-pointer accent-[#1E3A5F]"
                                            aria-label={`Interest rate: ${interestRate.toFixed(2)}%`}
                                        />
                                        <div className="flex justify-between text-sm text-gray-500 mt-2">
                                            <span>3%</span>
                                            <span className="font-semibold text-[#1E3A5F]">{interestRate.toFixed(2)}%</span>
                                            <span>10%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Results Card */}
                            <div className="bg-gradient-to-br from-[#DBEAFE] to-[#BFDBFE] rounded-3xl p-8 shadow-sm border border-[#93C5FD] flex flex-col justify-center">
                                <div className="text-center">
                                    <div className="text-5xl md:text-6xl font-bold text-[#1E3A5F] mb-2">
                                        ${monthlyPayment.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                    </div>
                                    <div className="text-gray-600 mb-8">Monthly Payments</div>

                                    <div className="border-t border-[#93C5FD] pt-6 space-y-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Total Principal Paid</span>
                                            <span className="font-semibold text-[#1E3A5F]">${loanAmount.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Total Interest Paid</span>
                                            <span className="font-semibold text-[#1E3A5F]">${totalInterest.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                                        </div>
                                    </div>

                                    <Link href="/apply">
                                        <button className="w-full mt-8 px-6 py-4 rounded-full text-lg font-semibold bg-[#1E3A5F] text-white hover:bg-[#162D4A] transition-all shadow-lg">
                                            Apply Now
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Section with Lavender Background */}
            <section className="py-20 bg-[#F5F3FF]">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A5F] mb-6">
                                Power your home purchase with smarter financing
                            </h2>
                            <p className="text-gray-600 text-lg mb-8">
                                From pre-approval to closing, unlock tools that help you move faster,
                                save more, and stay in control of your mortgage journey.
                            </p>
                            <Link href="/apply">
                                <button className="px-6 py-3 rounded-full text-base font-semibold bg-[#1E3A5F] text-white hover:bg-[#162D4A] transition-all">
                                    Get Pre-Approved
                                </button>
                            </Link>
                        </div>

                        {/* Right - Lottie Animation */}
                        <div className="relative">
                            <div className="aspect-[4/3] bg-gradient-to-br from-[#C7D9F0] to-[#E4EDF9] rounded-3xl flex items-center justify-center overflow-hidden p-8">
                                {lottieData ? (
                                    <Lottie
                                        animationData={lottieData}
                                        loop={true}
                                        autoplay={true}
                                        className="w-full h-full max-w-[400px] drop-shadow-lg"
                                    />
                                ) : (
                                    <div className="text-center text-gray-400">
                                        <div className="text-8xl mb-4">🏡</div>
                                        <div className="text-sm">Happy Homeowners</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Smart Loan Products Section */}
            <section id="how-it-works" className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div>
                            <div className="text-[#2563EB] font-medium mb-4">Smart Loan Products</div>
                            <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A5F] mb-6">
                                Unlock a mortgage experience that adapts to your lifestyle.
                            </h2>
                            <p className="text-gray-600 text-lg mb-8">
                                The more you share about your goals, the more personalized recommendations
                                you unlock — with built-in flexibility at every stage.
                            </p>
                            <Link href="#loan-products">
                                <button className="px-6 py-3 rounded-full text-base font-semibold bg-[#1E3A5F] text-white hover:bg-[#162D4A] transition-all">
                                    Learn More
                                </button>
                            </Link>
                        </div>

                        {/* Right - Lottie Animation */}
                        <div className="relative">
                            <div className="aspect-video bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] rounded-3xl flex items-center justify-center overflow-hidden p-8">
                                {lottieDataLoan ? (
                                    <Lottie
                                        animationData={lottieDataLoan}
                                        loop={true}
                                        autoplay={true}
                                        className="w-full h-full max-w-[450px] drop-shadow-lg"
                                    />
                                ) : (
                                    <div className="text-center text-gray-400">
                                        <div className="text-8xl mb-4">🤝</div>
                                        <div className="text-sm">Personalized Experience</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
