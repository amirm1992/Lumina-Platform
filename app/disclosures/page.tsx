'use client'

export default function DisclosuresPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 py-6">
                    <h1 className="text-2xl font-bold text-gray-900">Licensing & Disclosures</h1>
                </div>
            </header>

            {/* Content */}
            <main className="container mx-auto px-4 py-12 max-w-4xl">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12 space-y-10">

                    {/* NMLS Information */}
                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            NMLS Licensing Information
                        </h2>
                        <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Individual NMLS ID</p>
                                    <p className="text-lg font-medium text-gray-900">#1631748</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Broker</p>
                                    <p className="text-lg font-medium text-gray-900">C2 Financial Corporation</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Broker NMLS ID</p>
                                    <p className="text-lg font-medium text-gray-900">#135622</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">State Licensing</p>
                                    <p className="text-lg font-medium text-gray-900">Florida Office of Financial Regulation</p>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-gray-200">
                                <a
                                    href="https://www.nmlsconsumeraccess.org/EntityDetails.aspx/COMPANY/135622"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    Verify on NMLS Consumer Access
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </section>

                    {/* Equal Housing */}
                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 3L2 12h3v9h14v-9h3L12 3zm0 2.84L18 11v8H6v-8l6-5.16z" />
                            </svg>
                            Equal Housing Opportunity
                        </h2>
                        <div className="prose prose-gray max-w-none">
                            <p className="text-gray-600 leading-relaxed">
                                We are pledged to the letter and spirit of U.S. policy for the achievement of equal
                                housing opportunity throughout the Nation. We encourage and support an affirmative
                                advertising and marketing program in which there are no barriers to obtaining housing
                                because of race, color, religion, sex, handicap, familial status, or national origin.
                            </p>
                        </div>
                    </section>

                    {/* Lending Disclosures */}
                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Lending Disclosures
                        </h2>
                        <div className="space-y-4 text-gray-600 leading-relaxed">
                            <p>
                                <strong className="text-gray-900">Not a Commitment to Lend:</strong> This is not a
                                commitment to lend. Programs, rates, terms, and conditions are subject to change
                                without notice. All loans are subject to credit approval. Other restrictions may apply.
                            </p>
                            <p>
                                <strong className="text-gray-900">Mortgage Broker Disclosure:</strong> Lumina operates
                                as a website platform. All mortgage loans are originated through C2 Financial Corporation,
                                a licensed mortgage broker (NMLS #135622). C2 Financial Corporation is not a lender;
                                we arrange loans with third-party lenders.
                            </p>
                            <p>
                                <strong className="text-gray-900">Rate Information:</strong> Interest rates and Annual
                                Percentage Rates (APR) shown are subject to change. The actual rate you receive will
                                depend on your credit profile, loan amount, loan-to-value ratio, property type, and
                                other factors.
                            </p>
                            <p>
                                <strong className="text-gray-900">Pre-Approval:</strong> Pre-approval is based on a
                                preliminary review of credit information. Final loan approval is subject to a complete
                                underwriting review, including verification of income, assets, employment, and property.
                            </p>
                        </div>
                    </section>

                    {/* Loan Products */}
                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            Available Loan Products
                        </h2>
                        <div className="grid md:grid-cols-2 gap-3">
                            {[
                                'Conventional Loans',
                                'FHA Loans',
                                'VA Loans',
                                'Jumbo Loans',
                                'Bank Statement Loans',
                                'ITIN Loans',
                                'Investment Property Loans',
                                'Non-QM Loans',
                                'First-Time Homebuyer Programs',
                                'Down Payment Assistance',
                                'Refinance Loans',
                                'Cash-Out Refinance',
                            ].map((product) => (
                                <div
                                    key={product}
                                    className="flex items-center gap-2 text-gray-600 text-sm"
                                >
                                    <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    {product}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Contact for Questions */}
                    <section className="bg-blue-50 rounded-xl p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">Questions?</h2>
                        <p className="text-gray-600 text-sm">
                            If you have any questions about our licensing, disclosures, or loan products,
                            please contact us at{' '}
                            <a href="mailto:hello@lumina.finance" className="text-blue-600 hover:underline">
                                hello@lumina.finance
                            </a>
                        </p>
                    </section>

                </div>

                {/* Back Link */}
                <div className="mt-8 text-center">
                    <a
                        href="/"
                        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Home
                    </a>
                </div>
            </main>
        </div>
    )
}
