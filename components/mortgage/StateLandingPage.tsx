'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { ChevronRight } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { SITE_CONFIG } from '@/lib/constants'
import type { StateConfig } from '@/lib/state-configs'

const SceneClient = dynamic(() => import('@/components/landing/Scene').then(mod => mod.Scene), {
    ssr: false,
    loading: () => <div className="w-full h-full flex items-center justify-center text-slate-400 font-medium">Loading 3D Scene...</div>
})
// ── Icons (inline SVGs to avoid extra deps) ─────────────────────

function IconCheck() {
    return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
    )
}

function IconShield() {
    return (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
    )
}

function IconBolt() {
    return (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
    )
}

function IconUsers() {
    return (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
    )
}

function IconDocument() {
    return (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
    )
}

// ── Steps Data ──────────────────────────────────────────────────

const howItWorks = [
    {
        step: '01',
        title: 'Apply Online',
        description: 'Complete our smart application in under 10 minutes. No paperwork, no branch visits.',
    },
    {
        step: '02',
        title: 'Soft Credit Check',
        description: 'We perform a soft pull that won\'t affect your credit score — ever.',
    },
    {
        step: '03',
        title: 'Compare Lender Offers',
        description: 'Our AI matches you with the best rates from 50+ competing lenders.',
    },
    {
        step: '04',
        title: 'Close Digitally',
        description: 'Upload documents, e-sign, and close — all from your dashboard.',
    },
]

const differentiators = [
    { icon: <IconBolt />, title: '100% Online', description: 'No branch visits. Apply, compare, and close from anywhere.' },
    { icon: <IconShield />, title: 'Soft Credit Pull', description: 'Check your rates without impacting your credit score.' },
    { icon: <IconUsers />, title: '50+ Lenders', description: 'We shop the market so you don\'t have to. One application, many offers.' },
    { icon: <IconDocument />, title: 'No Obligation', description: 'Compare rates freely. You\'re never locked in until you choose to be.' },
]

// ── Component ───────────────────────────────────────────────────

interface Props {
    config: StateConfig
}

export function StateLandingPage({ config }: Props) {
    const applyUrl = `/apply/step/1?state=${config.code}`
    const [shouldLoadSpline, setShouldLoadSpline] = useState(false)

    useEffect(() => {
        const checkDeviceCapability = () => {
            const isMobile = window.innerWidth < 768
            const isLowEnd = (navigator.hardwareConcurrency || 4) <= 2
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

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* ═══ Hero ═══ */}
            <section
                aria-label={`Hero — ${config.name} mortgage landing page`}
                className="relative min-h-[90vh] bg-gradient-to-br from-[#eef5fb] via-[#e0eaf5] to-[#d1e0f0] flex flex-col justify-center overflow-hidden font-sans text-[#1a202c] pt-24 pb-8"
            >
                {/* Main Content Area */}
                <main className="flex-1 flex flex-col lg:flex-row items-center justify-between px-6 lg:px-24 w-full max-w-7xl mx-auto relative z-10">

                    {/* Left Column - Text */}
                    <div className="w-full lg:w-[55%] flex flex-col justify-center gap-6 z-10 mt-12 lg:mt-0">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-md border border-white/60 text-sm font-medium text-slate-700 w-fit shadow-sm">
                            <span className="flex h-2 w-2 rounded-full bg-[#2563EB] animate-pulse"></span>
                            {config.licensingText}
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-slate-900">
                            {config.headline.split(' ').slice(0, -2).join(' ')}<br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#2563EB] to-[#60A5FA]">
                                {config.headline.split(' ').slice(-2).join(' ')}
                            </span>
                        </h1>
                        <p className="text-xl text-slate-600 max-w-lg leading-relaxed mt-2">
                            {config.subheadline}
                        </p>

                        <div className="flex flex-wrap gap-4 mt-6">
                            <Link href={applyUrl} className="w-full sm:w-auto">
                                <button className="flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-8 py-4 rounded-full font-semibold transition-colors shadow-lg shadow-[#2563EB]/25 w-full">
                                    {config.ctaText}
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </Link>
                            <Link href="#how-it-works" className="w-full sm:w-auto">
                                <button className="flex items-center justify-center gap-2 bg-white/50 hover:bg-white/80 text-[#2563EB] border border-[#BFDBFE] px-8 py-4 rounded-full font-semibold transition-colors backdrop-blur-sm shadow-sm ring-1 ring-white/60 w-full">
                                    See How It Works
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </Link>
                        </div>

                        {/* Trust checkmarks */}
                        <div className="flex flex-wrap items-center gap-6 mt-8 text-slate-600 text-sm font-medium">
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                <span>No impact on credit score</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                <span>Pre-approval in minutes</span>
                            </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="flex items-center gap-6 sm:gap-8 mt-6">
                            <Image src="/logos/equal-housing.png" alt="Equal Housing Opportunity" width={500} height={500} className="h-10 sm:h-12 w-auto opacity-70" />
                            <div className="w-px h-10 bg-slate-300" />
                            <div className="flex items-center gap-2.5 text-slate-600">
                                <svg className="w-6 h-6 sm:w-7 sm:h-7 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                                </svg>
                                <div>
                                    <div className="text-sm font-bold tracking-wide text-slate-800">NMLS #{SITE_CONFIG.nmls.individual}</div>
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
            </section>

            {/* ═══ How It Works ═══ */}
            <section id="how-it-works" className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <div className="text-[#2563EB] font-medium mb-4">Simple Process</div>
                        <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A5F] mb-4">
                            How to Get the Best {config.name} Mortgage Rate
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            From application to closing — entirely online, in four simple steps.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                        {howItWorks.map((item) => (
                            <div key={item.step} className="relative p-8 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-lg hover:border-[#3B82F6]/30 transition-all group">
                                <div className="text-5xl font-bold text-[#EFF6FF] group-hover:text-[#DBEAFE] transition-colors mb-4">
                                    {item.step}
                                </div>
                                <h3 className="text-xl font-bold text-[#1E3A5F] mb-3">{item.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ Why Choose Us ═══ */}
            <section className="py-20 bg-[#F8FAFC]">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <div className="text-[#2563EB] font-medium mb-4">Why Choose Us</div>
                        <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A5F] mb-4">
                            Why {config.name} Homebuyers Choose Lumina
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Traditional {config.name.toLowerCase()} mortgage lenders are slow, opaque, and frustrating. We built a faster, smarter way to compare {config.name.toLowerCase()} home loan rates.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                        {differentiators.map((item, i) => (
                            <div
                                key={i}
                                className="p-8 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-lg hover:border-[#3B82F6]/30 transition-all group text-center"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:bg-[#2563EB] group-hover:text-white transition-all">
                                    {item.icon}
                                </div>
                                <h3 className="text-lg font-bold text-[#1E3A5F] mb-2">{item.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ Loan Types ═══ */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <div className="text-[#2563EB] font-medium mb-4">Our Products</div>
                        <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A5F] mb-4">
                            Mortgage Types Available in {config.name}
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Whether you&apos;re a first-time buyer, investor, or looking to refinance — we have the right loan for you.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {config.loanTypes.map((loan, i) => (
                            <div
                                key={i}
                                className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-[#3B82F6]/30 transition-all group"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center flex-shrink-0 group-hover:bg-[#2563EB] group-hover:text-white transition-all">
                                        <IconCheck />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-[#1E3A5F] mb-1">{loan.name}</h3>
                                        <p className="text-sm text-gray-500">{loan.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ Market Insight ═══ */}
            <section className="py-20 bg-[#EFF6FF]">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="text-[#2563EB] font-medium mb-4">{config.name} Housing Market</div>
                        <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A5F] mb-6">
                            The {config.name} Mortgage Landscape
                        </h2>
                        <p className="text-gray-700 text-lg leading-relaxed max-w-3xl mx-auto">
                            {config.marketInsight}
                        </p>
                    </div>
                </div>
            </section>

            {/* ═══ Final CTA ═══ */}
            <section className="py-20 bg-gradient-to-br from-[#1E3A5F] via-[#1A3353] to-[#0F172A] relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#3B82F6]/10 rounded-full blur-[120px]" />
                    <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#60A5FA]/5 rounded-full blur-[80px]" />
                </div>

                <div className="relative z-10 container mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                            Ready to find your best {config.name} mortgage rate?
                        </h2>
                        <p className="text-white/70 text-lg mb-10 max-w-2xl mx-auto">
                            Get pre-approved for a {config.name.toLowerCase()} home loan in minutes. Compare mortgage rates from 50+ lenders and close faster with our fully digital process.
                        </p>
                        <Link
                            href={applyUrl}
                            className="inline-block px-10 py-4 rounded-full text-lg font-semibold bg-[#2563EB] text-white hover:bg-[#1D4ED8] transition-all shadow-lg shadow-[#2563EB]/25 min-w-[280px] text-center"
                        >
                            {config.ctaText}
                        </Link>
                    </div>
                </div>
            </section>

            {/* ═══ Compliance Footer ═══ */}
            <section className="py-12 bg-[#0F172A]">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto text-center space-y-6">
                        <div className="flex items-center justify-center gap-3">
                            <div className="relative w-10 h-10">
                                <Image
                                    src="/logo-transparent.png"
                                    alt={`${SITE_CONFIG.name} Logo`}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <span className="text-white font-bold text-lg">{SITE_CONFIG.name}</span>
                        </div>
                        <p className="text-white/40 text-xs leading-relaxed max-w-3xl mx-auto">
                            {config.complianceDisclaimer}
                        </p>
                        <div className="flex items-center justify-center gap-6 text-white/40 text-xs">
                            <Link href="/disclosures" className="hover:text-white/60 transition-colors">Disclosures</Link>
                            <Link href="/privacy" className="hover:text-white/60 transition-colors">Privacy Policy</Link>
                            <Link href="/terms" className="hover:text-white/60 transition-colors">Terms of Service</Link>
                        </div>
                        {/* Trust Badge Banner */}
                        <div className="flex items-center justify-center gap-6 sm:gap-10 py-4 mx-auto max-w-md mt-2">
                            <Image src="/logos/equal-housing.png" alt="Equal Housing Opportunity" width={500} height={500} className="h-8 sm:h-10 w-auto invert opacity-70" />
                            <div className="w-px h-8 bg-white/15" />
                            <div className="flex items-center gap-2 text-white/60">
                                <svg className="w-5 h-5 text-white/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                                </svg>
                                <span className="text-xs font-semibold">NMLS #1631748</span>
                            </div>
                        </div>

                        <p className="text-white/20 text-xs">
                            &copy; {new Date().getFullYear()} {SITE_CONFIG.legalName}. All rights reserved. Equal Housing Lender.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    )
}
