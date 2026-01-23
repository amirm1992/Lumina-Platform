import React from 'react'

const cards = [
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
        title: "Compare Top Lenders",
        description: "We scan over 50+ top lenders to find the exact mortgage solution that fits your financial situation.",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
        )
    },
    {
        title: "100% Digital Workflow",
        description: "Upload documents, sign digitally, and track your progress from your dashboard. No fax machines allowed.",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25" />
            </svg>
        )
    }
]

export function Features() {
    return (
        <section id="features" className="py-24 bg-gray-50 relative">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Lumina?</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto">Traditional mortgages are broken. We fixed them with code.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    {cards.map((card, i) => (
                        <div key={i} className="p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all group cursor-pointer">
                            <div className="w-12 h-12 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                {card.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{card.title}</h3>
                            <p className="text-gray-500 leading-relaxed">{card.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
