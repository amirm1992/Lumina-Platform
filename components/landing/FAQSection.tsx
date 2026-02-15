'use client'

import { useState } from 'react'
import Link from 'next/link'
import { SITE_CONFIG } from '@/lib/constants'

interface FAQItem {
    question: string
    answer: string | React.ReactNode
    category: string
}

const faqItems: FAQItem[] = [
    // ── About Lumina & C2 Financial ──
    {
        category: 'About Lumina & C2 Financial',
        question: 'What is Lumina?',
        answer: (
            <>
                Lumina is the <strong>technology platform</strong> that powers your mortgage experience — from application to closing. It is not a bank or a lender. Lumina provides the AI-driven tools, digital application, document upload, and rate-comparison engine that make the mortgage process faster and easier. All mortgage loans originated through Lumina are processed and funded through{' '}
                <strong>C2 Financial Corporation</strong> (NMLS #135622), a licensed mortgage broker.
            </>
        ),
    },
    {
        category: 'About Lumina & C2 Financial',
        question: 'What is C2 Financial Corporation?',
        answer: (
            <>
                C2 Financial Corporation is a licensed mortgage broker (NMLS #135622) headquartered in San Diego, California. C2 Financial is the entity that originates, processes, and facilitates your mortgage loan. Lumina operates under C2 Financial&apos;s brokerage license. You can verify C2 Financial&apos;s licensing information on the{' '}
                <a
                    href={SITE_CONFIG.nmls.consumerAccessUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#2563EB] hover:underline font-medium"
                >
                    NMLS Consumer Access
                </a>{' '}
                website.
            </>
        ),
    },
    {
        category: 'About Lumina & C2 Financial',
        question: 'Is Lumina a lender or a bank?',
        answer:
            'No. Lumina is a technology platform, not a lender or bank. We do not directly fund loans. Instead, we connect you with competitive loan options from 50+ wholesale lenders through our broker relationship with C2 Financial Corporation. This means you get access to a wide range of rates and products without having to shop around yourself.',
    },
    {
        category: 'About Lumina & C2 Financial',
        question: 'Where can I verify your licensing information?',
        answer: (
            <>
                You can verify all licensing information through the Nationwide Multistate Licensing System (NMLS):{' '}
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>
                        <strong>C2 Financial Corporation</strong> — NMLS #135622:{' '}
                        <a
                            href={SITE_CONFIG.nmls.consumerAccessUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#2563EB] hover:underline"
                        >
                            View on NMLS Consumer Access
                        </a>
                    </li>
                    <li>
                        <strong>Individual Loan Originator</strong> — NMLS #1631748
                    </li>
                </ul>
            </>
        ),
    },
    {
        category: 'About Lumina & C2 Financial',
        question: 'What states does Lumina operate in?',
        answer:
            'Lumina currently serves borrowers in Florida, with plans to expand to additional states. All operations are conducted under C2 Financial Corporation\'s state-specific licenses. Check back for updates as we expand our coverage.',
    },

    // ── Mortgage Process ──
    {
        category: 'Mortgage Process',
        question: 'How does the mortgage application process work?',
        answer:
            'Our process is simple: (1) Complete our digital application in about 10 minutes, (2) Our AI analyzes your profile and matches you with the best loan options from 50+ lenders, (3) Review and select your preferred offer, (4) Upload your documents securely through our platform, and (5) We handle the rest through closing. You can track every step from your personal dashboard.',
    },
    {
        category: 'Mortgage Process',
        question: 'How long does it take to get pre-approved?',
        answer:
            'Most applicants receive a pre-approval decision within minutes of completing the application. Our AI-powered system instantly evaluates your financial profile and matches you with eligible loan programs. A formal pre-approval letter can typically be issued the same day.',
    },
    {
        category: 'Mortgage Process',
        question: 'What documents do I need to apply?',
        answer: (
            <>
                The documents you&apos;ll need depend on your employment type and loan program, but typically include:
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Government-issued photo ID</li>
                    <li>Recent pay stubs (last 30 days)</li>
                    <li>W-2s or tax returns (last 2 years)</li>
                    <li>Bank statements (last 2-3 months)</li>
                    <li>Proof of assets and investments</li>
                </ul>
                <p className="mt-2">Self-employed borrowers may need additional documentation such as profit &amp; loss statements or business bank statements.</p>
            </>
        ),
    },
    {
        category: 'Mortgage Process',
        question: 'Is my personal information secure?',
        answer:
            'Absolutely. We use bank-level 256-bit SSL encryption to protect all data in transit and at rest. Documents are stored in secure, encrypted cloud storage. We never sell your personal information to third parties. Our platform complies with all federal and state data protection regulations.',
    },
    {
        category: 'Mortgage Process',
        question: 'Will applying affect my credit score?',
        answer:
            'Our initial pre-qualification uses a soft credit pull, which does NOT affect your credit score. A hard credit inquiry is only performed when you decide to move forward with a formal application and loan lock. We\'ll always let you know before a hard pull is made.',
    },

    // ── Loan Types & Rates ──
    {
        category: 'Loan Types & Rates',
        question: 'What types of loans do you offer?',
        answer: (
            <>
                We offer a comprehensive range of mortgage products through our lender network:
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li><strong>Conventional Loans</strong> — Traditional financing with competitive rates</li>
                    <li><strong>FHA Loans</strong> — Low down payment options (as low as 3.5%)</li>
                    <li><strong>VA Loans</strong> — Zero down payment for eligible veterans</li>
                    <li><strong>Jumbo Loans</strong> — Financing for high-value properties</li>
                    <li><strong>Bank Statement Loans</strong> — Alternative income documentation for self-employed borrowers</li>
                    <li><strong>ITIN Loans</strong> — Options for borrowers with an Individual Taxpayer Identification Number</li>
                    <li><strong>Refinance</strong> — Rate-and-term or cash-out refinancing</li>
                    <li><strong>Investment Property Loans</strong> — Financing for rental and investment properties</li>
                </ul>
            </>
        ),
    },
    {
        category: 'Loan Types & Rates',
        question: 'How do you compare rates from 50+ lenders?',
        answer:
            'As a mortgage broker operating through C2 Financial Corporation, we have wholesale relationships with over 50 national and regional lenders. When you apply, our system simultaneously checks rates and programs across all of these lenders to find the best match for your specific financial profile. This saves you the time and hassle of applying to multiple lenders individually.',
    },
    {
        category: 'Loan Types & Rates',
        question: 'Are the rates on your website guaranteed?',
        answer:
            'The rates displayed on our website are for informational purposes and reflect current market conditions. Your actual rate will depend on factors including your credit score, loan amount, down payment, property type, and loan program. Rates are subject to change with market conditions. A guaranteed rate is provided when you lock your rate during the formal application process.',
    },
    {
        category: 'Loan Types & Rates',
        question: 'What is the minimum credit score required?',
        answer:
            'Minimum credit score requirements vary by loan program. FHA loans may accept scores as low as 580, while conventional loans typically require a minimum of 620. VA loans have flexible credit requirements. Our AI will match you with programs you qualify for based on your complete financial profile, not just your credit score.',
    },
    {
        category: 'Loan Types & Rates',
        question: 'How much down payment do I need?',
        answer: (
            <>
                Down payment requirements vary by loan type:
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li><strong>VA Loans</strong> — 0% down payment</li>
                    <li><strong>FHA Loans</strong> — As low as 3.5% down</li>
                    <li><strong>Conventional Loans</strong> — As low as 3-5% down</li>
                    <li><strong>Jumbo Loans</strong> — Typically 10-20% down</li>
                </ul>
                <p className="mt-2">Down payment assistance programs may also be available depending on your location and eligibility.</p>
            </>
        ),
    },

    // ── Costs & Fees ──
    {
        category: 'Costs & Fees',
        question: 'Does it cost anything to use Lumina?',
        answer:
            'There is no cost to create an account, get pre-qualified, or compare rates on Lumina. Our platform is free to use. Standard mortgage closing costs and broker fees apply when you proceed with a loan, and these will be clearly disclosed before you commit to anything.',
    },
    {
        category: 'Costs & Fees',
        question: 'What are typical closing costs?',
        answer:
            'Closing costs typically range from 2-5% of the loan amount and may include appraisal fees, title insurance, escrow fees, and origination fees. We provide a detailed Loan Estimate early in the process so you know exactly what to expect. In some cases, closing costs can be rolled into the loan or covered by the seller.',
    },

    // ── Account & Support ──
    {
        category: 'Account & Support',
        question: 'How do I track my application status?',
        answer:
            'Once you submit your application, you\'ll have access to a personal dashboard where you can track every step of the process in real time. You\'ll see your application status, any outstanding document requests, and key milestones from submission through closing.',
    },
    {
        category: 'Account & Support',
        question: 'How can I contact support?',
        answer: (
            <>
                You can reach our team in several ways:
                <ul className="list-disc list-inside mt-2 space-y-1">
                    <li><strong>Email:</strong> {SITE_CONFIG.email}</li>
                    <li><strong>Phone:</strong> {SITE_CONFIG.phone}</li>
                    <li><strong>Dashboard:</strong> Message us directly from your application dashboard</li>
                </ul>
                <p className="mt-2">Our team is available Monday through Friday, 9 AM – 6 PM ET.</p>
            </>
        ),
    },
    {
        category: 'Account & Support',
        question: 'Can I apply with a co-borrower?',
        answer:
            'Yes! Our application supports co-borrowers. Adding a co-borrower can help you qualify for a larger loan amount or better rate by combining incomes and credit profiles. You can add a co-borrower during the application process.',
    },
]

const categories = Array.from(new Set(faqItems.map((item) => item.category)))

function AccordionItem({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
    return (
        <div className="border border-gray-200 rounded-2xl overflow-hidden transition-all hover:border-[#3B82F6]/30">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left bg-white hover:bg-[#F8FAFC] transition-colors"
                aria-expanded={isOpen}
            >
                <span className="text-base font-semibold text-[#1E3A5F]">{item.question}</span>
                <svg
                    className={`w-5 h-5 text-[#2563EB] flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <div className="px-6 pb-5 text-gray-600 leading-relaxed text-[15px]">
                    {item.answer}
                </div>
            </div>
        </div>
    )
}

export function FAQSection() {
    const [openIndex, setOpenIndex] = useState<string | null>(null)
    const [activeCategory, setActiveCategory] = useState<string>(categories[0])

    const filteredItems = faqItems.filter((item) => item.category === activeCategory)

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6">
                {/* Category Tabs */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => {
                                setActiveCategory(category)
                                setOpenIndex(null)
                            }}
                            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                                activeCategory === category
                                    ? 'bg-[#1E3A5F] text-white shadow-lg'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* FAQ Items */}
                <div className="max-w-3xl mx-auto space-y-3">
                    {filteredItems.map((item, index) => {
                        const key = `${activeCategory}-${index}`
                        return (
                            <AccordionItem
                                key={key}
                                item={item}
                                isOpen={openIndex === key}
                                onToggle={() => setOpenIndex(openIndex === key ? null : key)}
                            />
                        )
                    })}
                </div>

                {/* NMLS Banner */}
                <div className="mt-16 max-w-3xl mx-auto">
                    <div className="bg-gradient-to-r from-[#EFF6FF] to-[#DBEAFE] rounded-2xl p-8 border border-[#93C5FD]/30">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[#2563EB] text-white flex items-center justify-center flex-shrink-0">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-[#1E3A5F] mb-1">Verify Our Credentials</h3>
                                <p className="text-sm text-gray-600 mb-3">
                                    Loans originated through C2 Financial Corporation (NMLS #135622). Lumina operates as the technology platform under C2 Financial&apos;s brokerage license. Individual NMLS #1631748.
                                </p>
                                <a
                                    href={SITE_CONFIG.nmls.consumerAccessUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#2563EB] hover:underline"
                                >
                                    Visit NMLS Consumer Access
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Still Have Questions CTA */}
                <div className="mt-12 text-center">
                    <h3 className="text-2xl font-bold text-[#1E3A5F] mb-3">Still have questions?</h3>
                    <p className="text-gray-600 mb-6 max-w-lg mx-auto">
                        Our team is here to help. Reach out and we&apos;ll get back to you as soon as possible.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a
                            href={`mailto:${SITE_CONFIG.email}`}
                            className="px-6 py-3 rounded-full text-sm font-semibold bg-[#1E3A5F] text-white hover:bg-[#162D4A] transition-all"
                        >
                            Email Us
                        </a>
                        <Link
                            href="/apply"
                            className="px-6 py-3 rounded-full text-sm font-semibold bg-[#2563EB] text-white hover:bg-[#1D4ED8] transition-all shadow-lg shadow-[#2563EB]/25"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}
