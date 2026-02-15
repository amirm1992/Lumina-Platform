import type { Metadata } from 'next'
import { SITE_CONFIG } from '@/lib/constants'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/landing/Footer'
import { FAQSection } from '@/components/landing/FAQSection'

export const metadata: Metadata = {
    title: 'Frequently Asked Questions',
    description:
        'Find answers to common questions about Lumina, C2 Financial Corporation, mortgage applications, loan types, and our AI-powered platform.',
    alternates: {
        canonical: '/faq',
    },
    openGraph: {
        title: `FAQ | ${SITE_CONFIG.name}`,
        description:
            'Find answers to common questions about Lumina, C2 Financial Corporation, mortgage applications, loan types, and our AI-powered platform.',
    },
}

export default function FAQPage() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />
            {/* Hero */}
            <section className="relative pt-32 pb-16 bg-gradient-to-br from-[#1E3A5F] via-[#1A3353] to-[#0F172A] overflow-hidden">
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#3B82F6]/10 rounded-full blur-[150px]" />
                    <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#60A5FA]/5 rounded-full blur-[100px]" />
                </div>
                <div className="relative z-10 container mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium text-white/90 mb-6">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                        </svg>
                        Help Center
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6">
                        Frequently Asked Questions
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg text-white/70 leading-relaxed">
                        Everything you need to know about Lumina, our mortgage process, and how we work with C2 Financial Corporation.
                    </p>
                </div>
            </section>

            {/* FAQ Content */}
            <FAQSection />

            <Footer />
        </main>
    )
}
