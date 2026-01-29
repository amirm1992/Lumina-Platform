import { Navbar } from '@/components/layout/Navbar'
import Link from 'next/link'

const steps = [
    {
        number: '01',
        title: 'Fill Out Our Smart Form',
        subtitle: 'Quick & Easy',
        description: 'Start with our intuitive, step-by-step form. Tell us your needs — Purchase, Refinance, or HELOC.',
        highlight: 'No SSN required yet!',
        icon: (
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        ),
    },
    {
        number: '02',
        title: 'Create Account & Unlock AI',
        subtitle: 'AI-Powered Matching',
        description: 'Access your personalized dashboard, fueled by our high-end AI technology that finds you the best rates.',
        highlight: 'Your data stays with us.',
        icon: (
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
        ),
    },
    {
        number: '03',
        title: 'Compare Top Lender Rates',
        subtitle: 'See the Best Offers',
        description: 'Compare real-time rates from top national and local lenders. Pick the offer that works for you.',
        highlight: 'Your data is secure. Never sold.',
        icon: (
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
        ),
    },
    {
        number: '04',
        title: 'Complete Digital Closing',
        subtitle: 'Go From Yes to Done',
        description: 'Upload documents, digitally sign, and breeze through underwriting. Lumina guides you every step of the way.',
        highlight: 'No brokers. No middlemen.',
        icon: (
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
        ),
    },
]

export default function HowItWorksPage() {
    return (
        <main className="min-h-screen bg-gray-50 selection:bg-[#DBEAFE]">
            <Navbar />

            {/* Background effects */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#BFDBFE]/30 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-200/30 rounded-full blur-[120px]" />
            </div>

            {/* Hero Section */}
            <section className="relative z-10 pt-32 pb-16 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-200 text-sm text-[#2563EB] mb-8 shadow-sm">
                        <span className="flex h-2 w-2 rounded-full bg-[#2563EB] animate-pulse"></span>
                        Simple 4-Step Process
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold text-black mb-6">
                        How <Link href="/" className="bg-clip-text text-transparent bg-gradient-to-r from-[#2563EB] via-blue-600 to-[#2563EB] hover:from-[#EFF6FF]0 hover:via-blue-500 hover:to-[#EFF6FF]0 transition-all cursor-pointer">Lumina</Link> Works
                    </h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                        Your mortgage journey, simplified. No lead selling. No broker referrals. Just you and your dream home.
                    </p>
                </div>
            </section>

            {/* Vertical Asymmetric Steps */}
            <section className="relative z-10 py-12 px-6">
                <div className="max-w-5xl mx-auto">
                    {/* Vertical line connector */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#BFDBFE]/0 via-[#BFDBFE] to-[#BFDBFE]/0 hidden md:block" />

                    {steps.map((step, index) => (
                        <div
                            key={step.number}
                            className={`relative flex flex-col md:flex-row items-center gap-8 mb-24 last:mb-0 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                                }`}
                        >
                            {/* Step Content */}
                            <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right md:pr-16' : 'md:text-left md:pl-16'}`}>
                                <div className={`inline-block ${index % 2 === 0 ? 'md:float-right md:clear-right' : ''}`}>
                                    <div className="p-6 md:p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-[#BFDBFE] transition-all duration-300 max-w-md">
                                        {/* Icon */}
                                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[#EFF6FF] text-[#2563EB] mb-4">
                                            {step.icon}
                                        </div>

                                        {/* Content */}
                                        <p className="text-[#2563EB] text-xs font-semibold uppercase tracking-wider mb-2">{step.subtitle}</p>
                                        <h3 className="text-xl md:text-2xl font-bold text-black mb-3">{step.title}</h3>
                                        <p className="text-gray-500 mb-4 text-sm md:text-base">{step.description}</p>

                                        {/* Highlight */}
                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EFF6FF] border border-[#DBEAFE]">
                                            <svg className="w-3.5 h-3.5 text-[#2563EB]" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-[#1D4ED8] text-xs font-medium">{step.highlight}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Center Step Number */}
                            <div className="relative z-10 flex-shrink-0 order-first md:order-none">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#2563EB] to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-[#EFF6FF]0/30 border-4 border-gray-50">
                                    {step.number}
                                </div>
                            </div>

                            {/* Spacer for asymmetry */}
                            <div className="flex-1 hidden md:block" />
                        </div>
                    ))}
                </div>
            </section>

            {/* Security Promise Section */}
            <section className="relative z-10 py-20 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="p-8 md:p-12 rounded-3xl bg-white border border-gray-200 shadow-xl shadow-gray-200/50">
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#EFF6FF] border border-[#DBEAFE] mb-6">
                                <svg className="w-8 h-8 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>

                            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
                                Your Privacy is <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#2563EB] to-blue-600">Non-Negotiable</span>
                            </h2>
                            <p className="text-gray-500 max-w-xl mx-auto">
                                Unlike lead aggregators, we keep your information secure and never share it.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6 mb-10">
                            <div className="text-center p-5 rounded-xl bg-gray-50 border border-gray-100">
                                <div className="text-red-500 mb-3">
                                    <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                    </svg>
                                </div>
                                <h3 className="text-base font-bold text-black mb-1">No Lead Selling</h3>
                                <p className="text-gray-500 text-sm">We never sell your info to third parties.</p>
                            </div>

                            <div className="text-center p-5 rounded-xl bg-gray-50 border border-gray-100">
                                <div className="text-red-500 mb-3">
                                    <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                    </svg>
                                </div>
                                <h3 className="text-base font-bold text-black mb-1">No Broker Referrals</h3>
                                <p className="text-gray-500 text-sm">We ARE your broker. No handoffs.</p>
                            </div>

                            <div className="text-center p-5 rounded-xl bg-gray-50 border border-gray-100">
                                <div className="text-[#2563EB] mb-3">
                                    <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <h3 className="text-base font-bold text-black mb-1">Bank-Level Security</h3>
                                <p className="text-gray-500 text-sm">256-bit encryption protects your data.</p>
                            </div>
                        </div>

                        <div className="text-center">
                            <Link href="/apply">
                                <button className="px-8 py-4 rounded-full text-lg font-semibold bg-black text-white hover:bg-gray-800 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                                    Start Your Application
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
