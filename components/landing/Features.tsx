import React from 'react'
import Link from 'next/link'

const features = [
    {
        title: "Instant Pre-Approval",
        description: "Fill out our smart application and get a verified pre-approval letter in under 3 minutes.",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        )
    },
    {
        title: "Compare 50+ Lenders",
        description: "We scan top lenders to find the exact mortgage solution that fits your financial situation.",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
        )
    },
    {
        title: "100% Digital Process",
        description: "Upload documents, sign digitally, and track your progress from your dashboard.",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25" />
            </svg>
        )
    }
]

const loanProducts = [
    { name: "Conventional Loans", description: "Traditional financing with competitive rates" },
    { name: "FHA Loans", description: "Low down payment options for first-time buyers" },
    { name: "VA Loans", description: "Exclusive benefits for veterans and service members" },
    { name: "Jumbo Loans", description: "Financing for high-value properties" },
    { name: "Bank Statement Loans", description: "Alternative documentation for self-employed" },
    { name: "Investment Properties", description: "Financing for rental and investment homes" },
]

export function Features() {
    return (
        <>
            {/* Why Lumina Section */}
            <section id="features" className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <div className="text-[#2563EB] font-medium mb-4">Why Choose Us</div>
                        <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A5F] mb-4">Why Lumina?</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Traditional mortgages are broken. We fixed them with technology.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, i) => (
                            <div
                                key={i}
                                className="p-8 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-lg hover:border-[#3B82F6]/30 transition-all group cursor-pointer"
                            >
                                <div className="w-14 h-14 rounded-2xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#2563EB] group-hover:text-white transition-all">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-[#1E3A5F] mb-3">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Loan Products Section */}
            <section id="loan-products" className="py-20 bg-[#F5F3FF]">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <div className="text-[#2563EB] font-medium mb-4">Our Products</div>
                        <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A5F] mb-4">
                            Loan products for every situation
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Whether you're a first-time buyer, investor, or looking to refinance,
                            we have the right loan for you.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {loanProducts.map((product, i) => (
                            <div
                                key={i}
                                className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-[#3B82F6]/30 transition-all group"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center flex-shrink-0 group-hover:bg-[#2563EB] group-hover:text-white transition-all">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-[#1E3A5F] mb-1">{product.name}</h3>
                                        <p className="text-sm text-gray-500">{product.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-12">
                        <Link href="/apply">
                            <button className="px-8 py-4 rounded-full text-lg font-semibold bg-[#1E3A5F] text-white hover:bg-[#162D4A] transition-all shadow-lg">
                                Find Your Perfect Loan
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Florida CTA Banner */}
            <section className="py-16 bg-gradient-to-r from-[#EFF6FF] to-[#DBEAFE]">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                        <div>
                            <div className="text-[#2563EB] font-medium text-sm mb-2">Now Serving Florida</div>
                            <h2 className="text-2xl md:text-3xl font-bold text-[#1E3A5F] mb-3">
                                Looking for the best mortgage rates in Florida?
                            </h2>
                            <p className="text-gray-600 max-w-xl">
                                Compare rates from 50+ lenders across Miami, Tampa, Orlando, Jacksonville, and all of Florida. Get pre-approved in minutes.
                            </p>
                        </div>
                        <Link href="/mortgage/florida" className="flex-shrink-0">
                            <button className="px-8 py-4 rounded-full text-base font-semibold bg-[#2563EB] text-white hover:bg-[#1D4ED8] transition-all shadow-lg shadow-[#2563EB]/25 whitespace-nowrap">
                                See Florida Rates
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-br from-[#1E3A5F] via-[#1A3353] to-[#0F172A] relative overflow-hidden">
                {/* Decorative */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#3B82F6]/10 rounded-full blur-[120px]" />
                    <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#60A5FA]/5 rounded-full blur-[80px]" />
                </div>

                <div className="relative z-10 container mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                            Ready to start your home journey?
                        </h2>
                        <p className="text-white/70 text-lg mb-10 max-w-2xl mx-auto">
                            Get pre-approved in minutes. Compare rates from 50+ lenders.
                            Close faster with our fully digital process.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/apply">
                                <button className="px-8 py-4 rounded-full text-lg font-semibold bg-[#2563EB] text-white hover:bg-[#1D4ED8] transition-all shadow-lg shadow-[#2563EB]/25 min-w-[200px]">
                                    Get Started Now
                                </button>
                            </Link>
                            <Link href="#calculator">
                                <button className="px-8 py-4 rounded-full text-lg font-semibold bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20 transition-all min-w-[200px]">
                                    Calculate Payment
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
