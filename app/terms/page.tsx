import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Terms & Conditions',
    description:
        'Terms of service, loan approval terms, and legal disclosures for Lumina mortgage platform. Licensed under C2 Financial Corporation NMLS #135622.',
    alternates: { canonical: '/terms' },
}

export default function TermsOfServicePage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 py-6">
                    <h1 className="text-2xl font-bold text-gray-900">Terms & Conditions</h1>
                </div>
            </header>

            {/* Content */}
            <main className="container mx-auto px-4 py-12 max-w-4xl">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
                    <div className="prose prose-gray max-w-none">

                        {/* License Information */}
                        <section className="mb-10">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">License Information</h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                This licensee is performing acts for which a real estate license is required.
                            </p>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                C2 Financial Corporation is licensed by the California Bureau of Real Estate,
                                Broker #01821025; NMLS #135622.
                            </p>
                            <div className="bg-gray-50 rounded-xl p-6 my-6">
                                <p className="text-gray-700 font-medium mb-2">Verify Our License:</p>
                                <a
                                    href="https://www.nmlsconsumeraccess.org/EntityDetails.aspx/COMPANY/135622"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    NMLS Consumer Access - C2 Financial Corporation
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </a>
                            </div>
                        </section>

                        {/* Loan Approval Terms */}
                        <section className="mb-10">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Loan Approval Terms</h2>
                            <ul className="space-y-4 text-gray-600">
                                <li className="flex gap-3">
                                    <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <span>Loan approval is not guaranteed and is subject to lender review of information.</span>
                                </li>
                                <li className="flex gap-3">
                                    <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <span>All loan approvals are conditional and all conditions must be met by borrower.</span>
                                </li>
                                <li className="flex gap-3">
                                    <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <span>Loan is only approved when lender has issued approval in writing and is subject to the Lender conditions.</span>
                                </li>
                                <li className="flex gap-3">
                                    <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <span>Specified rates may not be available for all borrowers. Rate subject to change with market conditions.</span>
                                </li>
                            </ul>
                        </section>

                        {/* Equal Opportunity & FHA */}
                        <section className="mb-10">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Equal Opportunity Lender</h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                C2 Financial Corporation is an Equal Opportunity Mortgage Broker/Lender.
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                As a broker, C2 Financial Corporation is NOT individually approved by the FHA or HUD,
                                but C2 Financial Corporation is allowed to originate FHA loans based on their
                                relationships with FHA approved lenders.
                            </p>
                        </section>

                        {/* State Licensing */}
                        <section className="mb-10">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">State Licensing</h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                For state licensing information, please visit the{' '}
                                <a
                                    href="https://www.nmlsconsumeraccess.org/EntityDetails.aspx/COMPANY/135622"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                >
                                    NMLS Consumer Access portal
                                </a>.
                            </p>

                            {/* Florida Disclosure */}
                            <div className="bg-blue-50 rounded-xl p-6 mt-6">
                                <h3 className="font-semibold text-gray-900 mb-2">Florida Consumers</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Lumina (NMLS #1631748) operates under C2 Financial Corporation and is licensed
                                    by the Florida Office of Financial Regulation.
                                </p>
                            </div>

                            {/* Texas Disclosure */}
                            <div className="bg-amber-50 rounded-xl p-6 mt-4">
                                <h3 className="font-semibold text-gray-900 mb-2">Texas Consumers</h3>
                                <p className="text-gray-600 text-sm leading-relaxed mb-3">
                                    Consumers wishing to file a complaint against a company or a residential
                                    mortgage loan originator should complete and send a complaint form to the
                                    Texas Department of Savings and Mortgage Lending, 2601 North Lamar, Suite 201,
                                    Austin, Texas 78705.
                                </p>
                                <p className="text-gray-600 text-sm leading-relaxed mb-3">
                                    Complaint forms and instructions may be obtained from the department's website at{' '}
                                    <a
                                        href="https://www.sml.texas.gov"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                    >
                                        www.sml.texas.gov
                                    </a>.
                                    A toll-free consumer hotline is available at{' '}
                                    <a href="tel:8772765550" className="text-blue-600 hover:underline">(877) 276-5550</a>.
                                </p>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    The department maintains a recovery fund to make payments of certain actual
                                    out of pocket damages sustained by borrowers caused by acts of licensed
                                    residential mortgage loan originators. A written application for reimbursement
                                    from the recovery fund must be filed with and investigated by the department
                                    prior to the payment of a claim. For more information about the recovery fund,
                                    please consult the department's website at{' '}
                                    <a
                                        href="https://www.sml.texas.gov"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                    >
                                        www.sml.texas.gov
                                    </a>.
                                </p>
                            </div>
                        </section>

                        {/* Website Terms */}
                        <section className="mb-10">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Website Terms of Use</h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                By accessing or using Lumina, you agree to be bound by these Terms & Conditions.
                                Lumina is a website platform operated under C2 Financial Corporation (NMLS #135622).
                            </p>
                            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                                <li>You must be at least 18 years old to use our services.</li>
                                <li>You agree to provide accurate and truthful information in your application.</li>
                                <li>Providing false information may constitute mortgage fraud, which is a federal crime.</li>
                                <li>We reserve the right to terminate your access at any time.</li>
                            </ul>
                        </section>

                        {/* Contact */}
                        <section className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
                            <div className="bg-gray-50 rounded-xl p-6">
                                <p className="text-gray-700">
                                    <strong>Lumina</strong> | NMLS #1631748<br />
                                    Operated under C2 Financial Corporation | NMLS #135622<br /><br />
                                    Phone: <a href="tel:8583124900" className="text-blue-600 hover:underline">(858) 312-4900</a><br />
                                    Email: <a href="mailto:help@c2financialcorp.com" className="text-blue-600 hover:underline">help@c2financialcorp.com</a>
                                </p>
                            </div>
                        </section>

                    </div>
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
