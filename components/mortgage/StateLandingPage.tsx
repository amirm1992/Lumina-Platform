import Link from 'next/link'
import Image from 'next/image'
import { Navbar } from '@/components/layout/Navbar'
import { SITE_CONFIG } from '@/lib/constants'
import type { StateConfig } from '@/lib/state-configs'

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

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* ═══ Hero ═══ */}
            <section className="relative overflow-hidden bg-gradient-to-br from-[#1E3A5F] via-[#1A3353] to-[#0F172A] pt-32 pb-20 lg:pt-40 lg:pb-28">
                {/* Decorative blurs */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-20%] right-[-10%] w-[700px] h-[700px] bg-[#3B82F6]/10 rounded-full blur-[150px]" />
                    <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-[#60A5FA]/5 rounded-full blur-[120px]" />
                </div>

                <div className="relative z-10 container mx-auto px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-8">
                            <IconShield />
                            <span className="text-white/80 text-sm font-medium">{config.licensingText}</span>
                        </div>

                        {/* H1 */}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                            {config.headline}
                        </h1>

                        {/* Subheadline */}
                        <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto mb-10 leading-relaxed">
                            {config.subheadline}
                        </p>

                        {/* CTA */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href={applyUrl}
                                className="px-10 py-4 rounded-full text-lg font-semibold bg-[#2563EB] text-white hover:bg-[#1D4ED8] transition-all shadow-lg shadow-[#2563EB]/25 min-w-[260px] text-center"
                            >
                                {config.ctaText}
                            </Link>
                            <Link
                                href="#how-it-works"
                                className="px-10 py-4 rounded-full text-lg font-semibold bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20 transition-all min-w-[260px] text-center"
                            >
                                See How It Works
                            </Link>
                        </div>

                        {/* Trust badges */}
                        <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-white/50 text-sm">
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                <span>No impact on credit score</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                <span>Pre-approval in minutes</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                <span>NMLS #{SITE_CONFIG.nmls.individual}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ How It Works ═══ */}
            <section id="how-it-works" className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <div className="text-[#2563EB] font-medium mb-4">Simple Process</div>
                        <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A5F] mb-4">
                            How It Works
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
                            Traditional mortgages are slow, opaque, and frustrating. We built something better.
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
                            Get pre-approved in minutes. Compare rates from 50+ lenders.
                            Close faster with our fully digital process.
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
                        <p className="text-white/20 text-xs">
                            &copy; {new Date().getFullYear()} {SITE_CONFIG.legalName}. All rights reserved. Equal Housing Lender.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    )
}
