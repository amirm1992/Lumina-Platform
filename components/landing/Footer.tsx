import Link from 'next/link'
import Image from 'next/image'

export function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 py-16">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-4 gap-12 mb-12">
                    <div>
                        <Link href="/" className="flex items-center mb-6 hover:opacity-80 transition-opacity">
                            {/* Abstract flowing logo - matching Hero */}
                            <div className="relative">
                                <Image
                                    src="/logo-transparent.png"
                                    alt="Lumina Logo"
                                    width={40}
                                    height={40}
                                    className="w-10 h-10 object-contain"
                                />
                            </div>
                            <div className="relative w-48 h-12 -ml-16">
                                <Image
                                    src="/lumina-text.png"
                                    alt="Lumina"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                            The modern way to finance your home. AI-powered, simplified, and reliable.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 mb-6">Product</h4>
                        <ul className="space-y-3 text-sm text-gray-500">
                            <li><Link href="#" className="hover:text-blue-600 transition-colors">Current Rates</Link></li>
                            <li><Link href="#" className="hover:text-blue-600 transition-colors">Pre-Approval</Link></li>
                            <li><Link href="#" className="hover:text-blue-600 transition-colors">Refinance</Link></li>
                            <li><Link href="#" className="hover:text-blue-600 transition-colors">Partner API</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 mb-6">Company</h4>
                        <ul className="space-y-3 text-sm text-gray-500">
                            <li><Link href="#" className="hover:text-blue-600 transition-colors">About Us</Link></li>
                            <li><Link href="#" className="hover:text-blue-600 transition-colors">Careers</Link></li>
                            <li><Link href="#" className="hover:text-blue-600 transition-colors">Legal & Privacy</Link></li>
                            <li><Link href="#" className="hover:text-blue-600 transition-colors">Contact</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 mb-6">Contact</h4>
                        <p className="text-gray-500 text-sm mb-4">
                            hello@lumina.finance<br />
                            1-800-LUMINA-AI
                        </p>
                        <div className="flex gap-4">
                            {/* Social Placeholders */}
                            <div className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"></div>
                            <div className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"></div>
                            <div className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"></div>
                        </div>
                    </div>
                </div>
                {/* Compliance Disclosures */}
                <div className="pt-8 border-t border-gray-100 text-gray-400 text-xs space-y-4">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center gap-2">
                            <span>© 2026 Lumina. All rights reserved.</span>
                            <span className="hidden md:inline">|</span>
                            <a
                                href="https://www.nmlsconsumeraccess.org"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-blue-600 transition-colors"
                            >
                                NMLS Consumer Access
                            </a>
                        </div>
                        <div className="flex gap-6 mt-4 md:mt-0">
                            <Link href="/disclosures" className="hover:text-gray-600">Disclosures</Link>
                            <Link href="/privacy" className="hover:text-gray-600">Privacy Policy</Link>
                            <Link href="/terms" className="hover:text-gray-600">Terms of Service</Link>
                        </div>
                    </div>

                    {/* NMLS & Licensing Info */}
                    <div className="text-center space-y-3 text-[11px] leading-relaxed max-w-4xl mx-auto">
                        <p>
                            NMLS #1631748 | Loans originated through C2 Financial Corporation | NMLS #135622
                        </p>
                        <p>
                            Licensed Mortgage Broker | Florida Office of Financial Regulation
                        </p>
                        <p className="text-gray-500">
                            Loan approval is not guaranteed and is subject to lender review of information.
                            All loan approvals are conditional and all conditions must be met by borrower.
                            Loan is only approved when lender has issued approval in writing and is subject to
                            the Lender conditions. Specified rates may not be available for all borrowers.
                            Rate subject to change with market conditions.
                        </p>
                        <p className="text-gray-500">
                            C2 Financial Corporation is an Equal Opportunity Mortgage Broker/Lender.
                            For state licensing information, visit{' '}
                            <a
                                href="https://www.nmlsconsumeraccess.org/EntityDetails.aspx/COMPANY/135622"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                            >
                                NMLS Consumer Access
                            </a>.
                            As a broker, C2 Financial Corporation is NOT individually approved by the FHA or HUD,
                            but C2 Financial Corporation is allowed to originate FHA loans based on their
                            relationships with FHA approved lenders.
                        </p>
                        <p className="text-gray-400 text-[10px]">
                            C2 Financial Corporation, 12230 El Camino Real #100, San Diego, CA 92130
                        </p>
                        <div className="flex items-center justify-center gap-2 pt-2">
                            <span>Equal Housing Lender</span>
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 3L2 12h3v9h14v-9h3L12 3zm0 2.84L18 11v8H6v-8l6-5.16z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
