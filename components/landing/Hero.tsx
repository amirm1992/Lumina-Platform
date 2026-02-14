'use client'

import React, { useEffect, useState, useMemo, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

// Dynamic import for Lottie to avoid SSR issues
const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

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
            {/* Hero Section with Dark Navy Blue Background */}
            <section
                aria-label="Hero — mortgage rate comparison"
                className="relative min-h-[90vh] flex items-center pt-24 pb-16 overflow-hidden bg-gradient-to-br from-[#1E3A5F] via-[#1A3353] to-[#0F172A]"
            >
                {/* Decorative Elements */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#3B82F6]/10 rounded-full blur-[150px]" />
                    <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#60A5FA]/5 rounded-full blur-[100px]" />
                    {/* Animated line graph */}
                    <svg className="absolute bottom-20 left-0 right-0 w-full h-32 opacity-30" viewBox="0 0 1200 100" preserveAspectRatio="none">
                        <path
                            d="M0,80 Q150,60 300,70 T600,50 T900,60 T1200,40"
                            stroke="#3B82F6"
                            strokeWidth="2"
                            fill="none"
                            className="animate-pulse"
                        />
                    </svg>
                </div>

                <div className="relative z-10 container mx-auto px-6">
                    <div className="text-center max-w-4xl mx-auto">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium text-white/90 mb-8">
                            <span className="flex h-2 w-2 rounded-full bg-[#3B82F6] animate-pulse"></span>
                            AI-Powered Mortgage Platform
                        </div>

                        {/* Headline */}
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
                            A smarter way to find
                            <br />
                            <span className="text-[#60A5FA]">your perfect mortgage</span>
                        </h1>

                        {/* Subtitle */}
                        <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/70 mb-10 leading-relaxed">
                            Compare rates from top lenders instantly. Our AI analyzes your profile
                            to find the best loan options tailored just for you.
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                            <Link href="/apply">
                                <button className="px-8 py-4 rounded-full text-lg font-semibold bg-[#2563EB] text-white hover:bg-[#1D4ED8] transition-all duration-300 shadow-lg shadow-[#2563EB]/25 hover:shadow-xl hover:shadow-[#2563EB]/30 min-w-[200px]">
                                    Get Started
                                </button>
                            </Link>
                            <Link href="#calculator">
                                <button className="px-8 py-4 rounded-full text-lg font-semibold bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20 transition-all min-w-[200px]">
                                    Calculate Payment
                                </button>
                            </Link>
                        </div>

                        {/* Trust Badges */}
                        <div className="flex items-center justify-center gap-8 sm:gap-12 mb-16">
                            <Image src="/logos/fannie-mae.png" alt="Fannie Mae" width={1169} height={212} className="h-7 sm:h-9 w-auto invert opacity-90" />
                            <div className="w-px h-10 bg-white/20" />
                            <Image src="/logos/equal-housing.png" alt="Equal Housing Opportunity" width={500} height={500} className="h-10 sm:h-14 w-auto invert opacity-90" />
                            <div className="w-px h-10 bg-white/20" />
                            <Image src="/logos/freddie-mac.png" alt="Freddie Mac" width={152} height={54} className="h-12 sm:h-16 w-auto invert opacity-90" />
                        </div>

                        {/* Live Rate Dashboard */}
                        <div className="mt-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 md:p-8 max-w-4xl mx-auto shadow-xl">
                            <div className="grid md:grid-cols-3 gap-8">
                                {/* Rate Column */}
                                <div className="md:col-span-1 flex flex-col justify-center text-center md:text-left">
                                    <h3 className="text-white/80 text-lg font-medium mb-1">Current 30-Year Fixed</h3>
                                    <div className="text-6xl font-bold text-white tracking-tighter mb-4">
                                        {loading ? '---' : `${rateData?.rate?.toFixed(2)}%`}
                                    </div>
                                    <div className="text-white/40 text-xs">
                                        Source: FRED • Updated {new Date().toLocaleDateString()}
                                    </div>
                                </div>

                                {/* Chart Area */}
                                <div className="md:col-span-2 min-h-[220px] w-full bg-black/10 rounded-2xl p-4 border border-white/5 relative group">
                                    {/* Glassmorphic Grid Overlay */}
                                    <div className="absolute inset-x-4 bottom-4 top-4 border-b border-white/5 pointer-events-none" />

                                    {/* Controls (Moved Inside) */}
                                    <div className="absolute top-4 right-4 z-10 flex gap-2">
                                        {(['D', 'M', 'W'] as const).map((view) => {
                                            const labels: Record<string, string> = { D: 'Daily', M: 'Monthly', W: 'Weekly' }
                                            return (
                                                <button
                                                    key={view}
                                                    onClick={() => setChartView(view)}
                                                    aria-label={`Show ${labels[view]} rate trend`}
                                                    aria-pressed={chartView === view}
                                                    className={`w-8 h-8 rounded-full text-xs font-bold transition-all border ${chartView === view
                                                        ? 'bg-white text-[#1E3A5F] border-white'
                                                        : 'bg-black/20 text-white/70 border-white/10 hover:bg-white/10 hover:text-white'
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
                                                    <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.6} />
                                                    <stop offset="95%" stopColor="#60A5FA" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <XAxis
                                                dataKey="label"
                                                stroke="rgba(255,255,255,0.3)"
                                                tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10, dy: 10 }}
                                                tickLine={false}
                                                axisLine={false}
                                            />
                                            <YAxis
                                                hide={true}
                                                domain={['dataMin - 0.2', 'dataMax + 0.2']}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: 'rgba(20, 30, 60, 0.90)',
                                                    backdropFilter: 'blur(8px)',
                                                    borderRadius: '12px',
                                                    border: '1px solid rgba(255,255,255,0.1)',
                                                    boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                                                    padding: '12px'
                                                }}
                                                itemStyle={{ color: '#fff', fontWeight: 600, fontSize: '14px' }}
                                                labelStyle={{ color: '#9CA3AF', marginBottom: '4px', fontSize: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px' }}
                                                formatter={(value: number) => [`${value.toFixed(2)}%`, 'Rate']}
                                                labelFormatter={(_, payload) => payload[0]?.payload?.fullDate || ''}
                                                cursor={{ stroke: 'rgba(255,255,255,0.3)', strokeWidth: 1, strokeDasharray: '4 4' }}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="rate"
                                                stroke="#60A5FA"
                                                strokeWidth={3}
                                                fillOpacity={1}
                                                fill="url(#colorRate)"
                                                dot={{ r: 4, strokeWidth: 2, stroke: '#60A5FA', fill: '#1E3A5F' }}
                                                activeDot={{ r: 6, strokeWidth: 0, fill: '#fff' }}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
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
