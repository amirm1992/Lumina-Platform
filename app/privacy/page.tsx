'use client'

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 py-6">
                    <h1 className="text-2xl font-bold text-gray-900">Privacy Policy</h1>
                </div>
            </header>

            {/* Content */}
            <main className="container mx-auto px-4 py-12 max-w-4xl">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
                    <div className="prose prose-gray max-w-none">

                        {/* Introduction */}
                        <section className="mb-10">
                            <p className="text-gray-600 leading-relaxed">
                                This privacy notice discloses the privacy practices for Lumina (lumina.finance).
                                Lumina operates under C2 Financial Corporation (NMLS #135622). This privacy notice
                                applies solely to information collected by this website. It will notify you of the following:
                            </p>
                            <ul className="list-disc list-inside text-gray-600 space-y-2 mt-4 ml-4">
                                <li>What personally identifiable information is collected from you through the website, how it is used and with whom it may be shared.</li>
                                <li>What choices are available to you regarding the use of your data.</li>
                                <li>The security procedures in place to protect the misuse of your information.</li>
                                <li>How you can correct any inaccuracies in the information.</li>
                            </ul>
                        </section>

                        {/* Information Collection */}
                        <section className="mb-10">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Information Collection, Use, and Sharing</h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                We are the sole owners of the information collected on this site. We only have access
                                to/collect information that you voluntarily give us via email or other direct contact
                                from you. We will not sell or rent this information to anyone.
                            </p>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                We will use your information to respond to you, regarding the reason you contacted us.
                                We will not share your information with any third party outside of our organization,
                                other than as necessary to fulfill your request, e.g. to process your mortgage application
                                with lending partners.
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                Unless you ask us not to, we may contact you via email in the future to tell you about
                                specials, new products or services, or changes to this privacy policy.
                            </p>
                        </section>

                        {/* Your Access and Control */}
                        <section className="mb-10">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Access to and Control Over Information</h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                You may opt out of any future contacts from us at any time. You can do the following
                                at any time by contacting us via the email address or phone number given on our website:
                            </p>
                            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                                <li>See what data we have about you, if any.</li>
                                <li>Change/correct any data we have about you.</li>
                                <li>Have us delete any data we have about you.</li>
                                <li>Express any concern you have about our use of your data.</li>
                            </ul>
                        </section>

                        {/* Security */}
                        <section className="mb-10">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Security</h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                We take precautions to protect your information. When you submit sensitive information
                                via the website, your information is protected both online and offline.
                            </p>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Wherever we collect sensitive information (such as credit card data), that information
                                is encrypted and transmitted to us in a secure way. You can verify this by looking for
                                a closed lock icon at the bottom of your web browser, or looking for "https" at the
                                beginning of the address of the web page.
                            </p>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                While we use encryption to protect sensitive information transmitted online, we also
                                protect your information offline. Only employees who need the information to perform
                                a specific job (for example, billing or customer service) are granted access to
                                personally identifiable information. The computers/servers in which we store personally
                                identifiable information are kept in a secure environment.
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                If you feel that we are not abiding by this privacy policy, you should contact us
                                immediately via telephone at{' '}
                                <a href="tel:8583124900" className="text-blue-600 hover:underline">(858) 312-4900</a>
                                {' '}or via email{' '}
                                <a href="mailto:help@c2financialcorp.com" className="text-blue-600 hover:underline">
                                    help@c2financialcorp.com
                                </a>.
                            </p>
                        </section>

                        {/* SMS Terms */}
                        <section className="mb-10">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">SMS Terms of Service</h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                By opting into SMS from a web form or other medium, you are agreeing to receive SMS
                                messages from C2 Financial. This includes SMS messages for conversations (between
                                employees), conversations (external). Message frequency varies. Message and data rates
                                may apply.
                            </p>
                            <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                                <li>Message <strong>HELP</strong> for help.</li>
                                <li>Reply <strong>STOP</strong> to stop any message to opt out.</li>
                            </ul>
                            <p className="text-gray-600 leading-relaxed mt-4">
                                We do not share or sell SMS opt-in, or phone numbers for the purpose of SMS.
                            </p>
                        </section>

                        {/* Licensing Info */}
                        <section className="mb-6">
                            <div className="bg-gray-50 rounded-xl p-6">
                                <p className="text-gray-600 text-sm">
                                    <strong>Lumina</strong> | NMLS #1631748<br />
                                    Operated under C2 Financial Corporation | NMLS #135622<br />
                                    <a href="https://www.nmlsconsumeraccess.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                        NMLS Consumer Access
                                    </a>
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
