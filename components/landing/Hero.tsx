'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

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

    useEffect(() => {
        async function fetchRate() {
            try {
                const response = await fetch('/api/mortgage-rate?history=true')
                const data = await response.json()
                setRateData(data)
                if (data.rate) {
                    setInterestRate(data.rate)
                }
            } catch (error) {
                console.error('Failed to fetch rate:', error)
                setRateData({
                    rate: 6.89,
                    date: new Date().toISOString().split('T')[0],
                    source: 'Fallback',
                    isFallback: true
                })
            } finally {
                setLoading(false)
            }
        }
        fetchRate()
    }, [])

    // Calculate monthly payment
    const calculateMonthlyPayment = () => {
        const principal = loanAmount
        const monthlyRate = interestRate / 100 / 12
        const numberOfPayments = loanTerm * 12

        if (monthlyRate === 0) return principal / numberOfPayments

        const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
            (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
        return payment
    }

    const monthlyPayment = calculateMonthlyPayment()
    const totalInterest = (monthlyPayment * loanTerm * 12) - loanAmount

    const formatDate = (dateString: string) => {
        const date = new Date(dateString + 'T00:00:00')
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    return (
        <>
            {/* Hero Section with Dark Navy Blue Background */}
            <section className="relative min-h-[90vh] flex items-center pt-24 pb-16 overflow-hidden bg-gradient-to-br from-[#1E3A5F] via-[#1A3353] to-[#0F172A]">
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
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
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

                        {/* Live Rate Dashboard */}
                        <div className="mt-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 md:p-8 max-w-2xl mx-auto shadow-xl">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                                {/* Current Rate Display */}
                                <div className="text-center md:text-left">
                                    <h3 className="text-white/80 text-lg font-medium mb-1">Current 30-Year Fixed</h3>
                                    <div className="flex items-baseline justify-center md:justify-start gap-2">
                                        <span className="text-6xl md:text-7xl font-bold text-white tracking-tighter">
                                            {loading ? '---' : `${rateData?.rate?.toFixed(2)}%`}
                                        </span>
                                        {rateData?.history && rateData.history.length > 1 && (
                                            <span className={`text-lg font-medium px-2 py-1 rounded-full ${rateData.rate > rateData.history[1].rate ? 'bg-red-500/20 text-red-200' : 'bg-green-500/20 text-green-200'
                                                }`}>
                                                {rateData.rate > rateData.history[1].rate ? '▲' : '▼'}
                                                {Math.abs(rateData.rate - rateData.history[1].rate).toFixed(2)}%
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-white/50 text-sm mt-3 flex items-center justify-center md:justify-start gap-2">
                                        <span>As of {rateData ? new Date(rateData.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '---'}</span>
                                        <span>•</span>
                                        <span>Source: FRED</span>
                                    </div>
                                </div>

                                {/* Trend Table */}
                                <div className="w-full md:w-auto bg-black/20 rounded-xl p-4 min-w-[240px]">
                                    <h4 className="text-white/90 text-sm font-semibold mb-3 border-b border-white/10 pb-2">Rate History</h4>
                                    <div className="space-y-3 text-sm">
                                        {[
                                            { label: 'Last Week', index: 1 },
                                            { label: '6 Weeks Ago', index: 6 },
                                            { label: '6 Months Ago', index: 25 }
                                        ].map((period) => {
                                            const historicalRate = rateData?.history?.[period.index]?.rate;
                                            const current = rateData?.rate || 0;
                                            const diff = historicalRate ? current - historicalRate : 0;

                                            return (
                                                <div key={period.label} className="flex justify-between items-center text-white/80">
                                                    <span>{period.label}</span>
                                                    <div className="flex items-center gap-3">
                                                        <span className="font-medium">{historicalRate ? `${historicalRate.toFixed(2)}%` : '--'}</span>
                                                        <span className={`text-xs w-12 text-right ${diff > 0 ? 'text-red-400' : 'text-green-400'}`}>
                                                            {diff > 0 ? '+' : ''}{diff.toFixed(2)}%
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
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
                                    {/* Loan Amount */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Total Principal Paid
                                        </label>
                                        <div className="text-2xl font-bold text-[#1E3A5F] mb-3">
                                            ${loanAmount.toLocaleString()}
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {[100000, 200000, 350000, 500000, 750000].map((amount) => (
                                                <button
                                                    key={amount}
                                                    onClick={() => setLoanAmount(amount)}
                                                    className={`px-3 py-1.5 text-sm rounded-full transition-all ${loanAmount === amount
                                                        ? 'bg-[#1E3A5F] text-white'
                                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                        }`}
                                                >
                                                    ${(amount / 1000).toFixed(0)}k
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Loan Term */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Loan Term in Years
                                        </label>
                                        <input
                                            type="range"
                                            min="10"
                                            max="30"
                                            step="5"
                                            value={loanTerm}
                                            onChange={(e) => setLoanTerm(Number(e.target.value))}
                                            className="w-full h-2 bg-[#3B82F6] rounded-lg appearance-none cursor-pointer accent-[#1E3A5F]"
                                        />
                                        <div className="flex justify-between text-sm text-gray-500 mt-2">
                                            <span>10 yrs</span>
                                            <span className="font-semibold text-[#1E3A5F]">{loanTerm} years</span>
                                            <span>30 yrs</span>
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
                            <div className="mb-8">
                                <span className="text-6xl">🏠</span>
                            </div>
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

                        {/* Right Image Placeholder */}
                        <div className="relative">
                            <div className="aspect-[4/3] bg-gradient-to-br from-[#3B82F6]/20 to-[#1E3A5F]/20 rounded-3xl flex items-center justify-center">
                                <div className="text-center text-gray-400">
                                    <div className="text-8xl mb-4">🏡</div>
                                    <div className="text-sm">Happy Homeowners</div>
                                </div>
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

                        {/* Right - Placeholder */}
                        <div className="relative">
                            <div className="aspect-video bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] rounded-3xl flex items-center justify-center">
                                <div className="text-center text-gray-400">
                                    <div className="text-8xl mb-4">🤝</div>
                                    <div className="text-sm">Personalized Experience</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
