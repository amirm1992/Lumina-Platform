'use client'

import Link from 'next/link'

interface ComplianceFooterProps {
    variant?: 'full' | 'compact'
}

export function ComplianceFooter({ variant = 'compact' }: ComplianceFooterProps) {
    // Compact variant for application flow and other pages
    return (
        <footer className="bg-[#0D3B25] py-6">
            <div className="container mx-auto px-4">
                <div className="text-center space-y-2 text-white/50 text-[10px] leading-relaxed">
                    <div className="flex flex-wrap justify-center gap-3">
                        <Link href="/disclosures" className="hover:text-white/80 transition-colors">Disclosures</Link>
                        <span className="text-white/30">|</span>
                        <Link href="/privacy" className="hover:text-white/80 transition-colors">Privacy</Link>
                        <span className="text-white/30">|</span>
                        <Link href="/terms" className="hover:text-white/80 transition-colors">Terms</Link>
                        <span className="text-white/30">|</span>
                        <a
                            href="https://www.nmlsconsumeraccess.org/EntityDetails.aspx/COMPANY/135622"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-white/80 transition-colors"
                        >
                            NMLS Consumer Access
                        </a>
                    </div>
                    <p>
                        NMLS #1631748 | C2 Financial Corporation NMLS #135622 | Licensed Mortgage Broker | FL
                    </p>
                    <p className="text-white/40 max-w-xl mx-auto">
                        Not a commitment to lend. All loans subject to credit approval. Equal Housing Lender.
                    </p>
                </div>
            </div>
        </footer>
    )
}
