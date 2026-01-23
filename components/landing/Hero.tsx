'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface MortgageRate {
    rate: number
    date: string
    source: string
    description?: string
    isFallback?: boolean
}

export function Hero() {
    const [rateData, setRateData] = useState<MortgageRate | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchRate() {
            try {
                const response = await fetch('/api/mortgage-rate')
                const data = await response.json()
                setRateData(data)
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

    const formatDate = (dateString: string) => {
        const date = new Date(dateString + 'T00:00:00')
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    return (
        <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-white selection:bg-purple-100">
            {/* Modern Mesh Gradient Background - Subtle & Clean */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-blue-50/50 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-50/50 rounded-full blur-[100px]" />
                <div className="absolute inset-0 bg-[url('/grid-light.svg')] bg-center opacity-30 [mask-image:linear-gradient(180deg,black,transparent)]" />
            </div>

            <div className="relative z-10 container mx-auto px-4">
                <div className="max-w-5xl mx-auto text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-sm font-medium text-blue-700 mb-8 mx-auto hover:bg-blue-100 transition-colors cursor-default">
                        <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
                        Simplifying Home Financing
                    </div>

                    {/* Headline */}
                    <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-gray-900 mb-8 leading-[1.1]">
                        Smart Mortgage Solutions
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900">for Every Dream</span>
                    </h1>

                    {/* Subtitle */}
                    <p className="max-w-2xl mx-auto text-xl text-gray-500 mb-12 leading-relaxed">
                        AI-Powered Mortgage Guidance for Every Borrower.
                        Experience the new standard in digital lending.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24">
                        <Link href="/apply">
                            <button className="px-10 py-5 rounded-full text-lg font-semibold bg-black text-white hover:bg-gray-800 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 shadow-lg min-w-[200px]">
                                Get Started
                            </button>
                        </Link>
                        <Link href="/how-it-works">
                            <button className="px-10 py-5 rounded-full text-lg font-semibold bg-white text-gray-900 border-2 border-gray-200 hover:border-gray-900 hover:bg-gray-50 transition-all min-w-[200px]">
                                How it Works
                            </button>
                        </Link>
                    </div>

                    {/* Floating Cards Section - Enhanced Spacing */}
                    <div className="relative w-full max-w-[1400px] mx-auto h-[600px] hidden lg:block">

                        {/* Card 1: Rate & Finance (Far Left) */}
                        <div className="absolute top-20 left-4 xl:left-12 animate-float-slow z-20">
                            <div className="p-6 rounded-3xl bg-white/80 border border-white backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] w-[300px] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow duration-500">
                                <h3 className="font-bold text-gray-900 mb-1">Finance.</h3>
                                <div className="text-sm text-gray-500 mb-4">Today's Rate</div>
                                {loading ? (
                                    <div className="text-4xl font-bold text-gray-900 mb-4 animate-pulse">--.--%</div>
                                ) : (
                                    <div className="text-4xl font-bold text-gray-900 mb-4">{rateData?.rate.toFixed(3)}%</div>
                                )}

                                {/* Source Attribution */}
                                {!loading && rateData && (
                                    <div className="text-[10px] text-gray-400 mb-6 border-l-2 border-blue-500 pl-2">
                                        <div>Rate as of {formatDate(rateData.date)}</div>
                                        <div>Source: {rateData.source}</div>
                                    </div>
                                )}

                                <button className="w-full py-3 rounded-2xl bg-white border border-gray-200 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50 transition-colors">
                                    Compare Rates
                                </button>
                            </div>
                        </div>

                        {/* Card 2: Broker Profile (Center - Large) */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 w-[360px]">
                            <div className="relative rounded-[2.5rem] overflow-hidden bg-white shadow-2xl shadow-gray-200 border border-white">
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/5 z-10" />
                                {/* Placeholder Image */}
                                <div className="h-[520px] bg-gray-50 flex items-center justify-center">
                                    <div className="text-gray-200 text-9xl">👤</div>
                                </div>

                                <div className="absolute top-6 left-6 z-20">
                                    <div className="text-gray-900 font-semibold">Sarah Jenkins</div>
                                    <div className="text-gray-500 text-sm">Senior Broker</div>
                                </div>

                                <div className="absolute bottom-6 left-6 right-6 z-20">
                                    <div className="flex items-center gap-3 bg-white/60 backdrop-blur-md p-3 rounded-2xl border border-white/50 shadow-sm">
                                        <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                                        </div>
                                        <div>
                                            <div className="text-gray-900 text-sm font-medium">Active Now</div>
                                            <div className="text-gray-500 text-xs">Replies in ~2m</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card 3: AI Recommendation (Far Right) */}
                        <div className="absolute top-24 right-4 xl:right-12 animate-float-slower z-20">
                            <div className="p-6 rounded-3xl bg-white/80 border border-white backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] w-[300px] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow duration-500">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 rounded-xl bg-purple-100 text-purple-600">✨</div>
                                    <div className="font-bold text-gray-900">AI Recommendation</div>
                                </div>
                                <div className="space-y-4">
                                    {[1, 2].map((i) => (
                                        <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 border border-gray-100">
                                            <div className="flex flex-col text-left">
                                                <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Interest</span>
                                                <span className="font-bold text-gray-900">6.08%</span>
                                            </div>
                                            <div className="h-8 w-[1px] bg-gray-200" />
                                            <div className="flex flex-col text-right">
                                                <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Monthly</span>
                                                <span className="font-bold text-gray-900">$2,450</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Mobile Fallback for Cards (Stack) */}
                    <div className="lg:hidden flex flex-col items-center gap-8 pb-20">
                        {/* Card 2: Broker (First on mobile) */}
                        <div className="relative w-full max-w-sm rounded-[2.5rem] overflow-hidden bg-white shadow-xl h-[400px] border border-gray-100">
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/5 z-10" />
                            <div className="h-full bg-gray-50 flex items-center justify-center">
                                <div className="text-gray-200 text-8xl">👤</div>
                            </div>
                            <div className="absolute bottom-6 left-6 right-6 z-20">
                                <div className="flex items-center gap-3 bg-white/60 backdrop-blur-md p-3 rounded-2xl border border-white/50 shadow-sm">
                                    <div>
                                        <div className="text-gray-900 text-sm font-medium">Active Now</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card 1 */}
                        <div className="p-6 rounded-3xl bg-white border border-gray-100 shadow-lg w-full max-w-sm">
                            <h3 className="font-bold text-gray-900">Finance.</h3>
                            <div className="text-4xl font-bold text-gray-900 my-4">{!loading && rateData ? rateData.rate.toFixed(3) : '--.--'}%</div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}
