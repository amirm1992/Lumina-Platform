'use client'

import Link from 'next/link'

interface ComplianceFooterProps {
    variant?: 'full' | 'compact'
}

export function ComplianceFooter({ variant = 'compact' }: ComplianceFooterProps) {
    if (variant === 'full') {
        return (
            <footer className="bg-white border-t border-gray-200 py-6">
                <div className="container mx-auto px-4">
                    <div className="text-center space-y-3 text-gray-500 text-xs">
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="/disclosures" className="hover:text-blue-600 transition-colors">Disclosures</Link>
                            <Link href="/privacy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link>
                            <Link href="/terms" className="hover:text-blue-600 transition-colors">Terms of Service</Link>
                            <a
                                href="https://www.nmlsconsumeraccess.org/EntityDetails.aspx/COMPANY/135622"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-blue-600 transition-colors"
                            >
                                NMLS Consumer Access
                            </a>
                        </div>
                        <p>
                            NMLS #1631748 | C2 Financial Corporation | NMLS #135622
                        </p>
                        <p>
                            Licensed Mortgage Broker | Florida Office of Financial Regulation
                        </p>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            This is not a commitment to lend. Programs, rates, terms, and conditions are subject to
                            change without notice. All loans are subject to credit approval. Equal Housing Lender.
                        </p>
                        <p className="text-gray-400">
                            © {new Date().getFullYear()} Lumina. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        )
    }

    // Compact variant for application flow and other pages
    return (
        <footer className="bg-gray-50 border-t border-gray-200 py-4">
            <div className="container mx-auto px-4">
                <div className="text-center space-y-2 text-gray-400 text-[10px] leading-relaxed">
                    <div className="flex flex-wrap justify-center gap-3">
                        <Link href="/disclosures" className="hover:text-gray-600 transition-colors">Disclosures</Link>
                        <span>|</span>
                        <Link href="/privacy" className="hover:text-gray-600 transition-colors">Privacy</Link>
                        <span>|</span>
                        <Link href="/terms" className="hover:text-gray-600 transition-colors">Terms</Link>
                        <span>|</span>
                        <a
                            href="https://www.nmlsconsumeraccess.org/EntityDetails.aspx/COMPANY/135622"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-gray-600 transition-colors"
                        >
                            NMLS Consumer Access
                        </a>
                    </div>
                    <p>
                        NMLS #1631748 | C2 Financial Corporation NMLS #135622 | Licensed Mortgage Broker | FL
                    </p>
                    <p className="text-gray-400/80 max-w-xl mx-auto">
                        Not a commitment to lend. All loans subject to credit approval. Equal Housing Lender.
                    </p>
                </div>
            </div>
        </footer>
    )
}
