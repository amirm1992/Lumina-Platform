'use client'

import Link from 'next/link'
import Image from 'next/image'

export function Footer() {
    return (
        <footer className="relative bg-[#1E3A5F] text-white overflow-hidden">
            {/* Large Watermark Text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                <span className="text-[20rem] font-bold text-white/[0.03] tracking-tighter whitespace-nowrap select-none">
                    LUMINA
                </span>
            </div>

            <div className="relative z-10 container mx-auto px-6 py-16">
                {/* Main Footer Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-16">
                    {/* Products */}
                    <div>
                        <h4 className="font-semibold text-white mb-6">Products</h4>
                        <ul className="space-y-3 text-sm text-white/70">
                            <li><Link href="#" className="hover:text-white transition-colors">Conventional Loans</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">FHA Loans</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">VA Loans</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Jumbo Loans</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Refinance</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Bank Statement Loans</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">ITIN Loans</Link></li>
                        </ul>
                    </div>

                    {/* Who We Serve */}
                    <div>
                        <h4 className="font-semibold text-white mb-6">Who We Serve</h4>
                        <ul className="space-y-3 text-sm text-white/70">
                            <li><Link href="#" className="hover:text-white transition-colors">First-Time Buyers</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Move-Up Buyers</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Investors</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Self-Employed</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Military & Veterans</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Real Estate Agents</Link></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="font-semibold text-white mb-6">Resources</h4>
                        <ul className="space-y-3 text-sm text-white/70">
                            <li><Link href="#calculator" className="hover:text-white transition-colors">Loan Calculator</Link></li>
                            <li><Link href="/disclosures" className="hover:text-white transition-colors">Disclosures</Link></li>
                            <li><Link href="/mortgage/florida" className="hover:text-white transition-colors">Florida Mortgages</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">FAQ</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="font-semibold text-white mb-6">Company</h4>
                        <ul className="space-y-3 text-sm text-white/70">
                            <li><Link href="#" className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
                            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
                            <li>
                                <a
                                    href="https://www.nmlsconsumeraccess.org/EntityDetails.aspx/COMPANY/135622"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-white transition-colors"
                                >
                                    NMLS Consumer Access
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Connect (only on large screens) */}
                    <div className="col-span-2 md:col-span-4 lg:col-span-1">
                        <h4 className="font-semibold text-white mb-6">Get Started</h4>
                        <p className="text-sm text-white/70 mb-4">
                            Ready to find your perfect mortgage? Apply in minutes.
                        </p>
                        <Link href="/apply">
                            <button className="px-6 py-3 rounded-full text-sm font-semibold bg-[#2563EB] text-white hover:bg-[#1D4ED8] transition-all">
                                Apply Now
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-white/10 pt-8">
                    {/* Bottom Row */}
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                        {/* Left: Location & Social */}
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 text-sm text-white/60">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                                </svg>
                                United States (English)
                            </div>
                            {/* Social Icons */}
                            <div className="flex items-center gap-4">
                                <a href="#" className="text-white/60 hover:text-white transition-colors">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                </a>
                                <a href="#" className="text-white/60 hover:text-white transition-colors">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                    </svg>
                                </a>
                                <a href="#" className="text-white/60 hover:text-white transition-colors">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                    </svg>
                                </a>
                            </div>
                        </div>

                        {/* Right: Copyright */}
                        <div className="text-sm text-white/60">
                            © {new Date().getFullYear()} Lumina. All rights reserved.
                        </div>
                    </div>

                    {/* Trust Badge Banner */}
                    <div className="mt-8 pt-8 border-t border-white/10">
                        <div className="flex items-center justify-center gap-8 sm:gap-12 py-6 px-6 mx-auto max-w-lg">
                            <Image src="/logos/equal-housing.png" alt="Equal Housing Opportunity" width={500} height={500} className="h-10 sm:h-14 w-auto invert opacity-80" />
                            <div className="w-px h-10 bg-white/20" />
                            <div className="flex items-center gap-2.5 text-white/70">
                                <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                                </svg>
                                <div>
                                    <div className="text-sm sm:text-base font-semibold tracking-wide">NMLS #1631748</div>
                                    <div className="text-[10px] sm:text-xs text-white/40">Federally Registered</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Compliance Section */}
                    <div className="mt-8 pt-8 border-t border-white/10">
                        <div className="text-center space-y-3 text-[11px] leading-relaxed max-w-4xl mx-auto text-white/50">
                            <p>
                                NMLS #1631748 | Loans originated through C2 Financial Corporation | NMLS #135622
                            </p>
                            <p>
                                Licensed Mortgage Broker | Florida Office of Financial Regulation
                            </p>
                            <p>
                                Loan approval is not guaranteed and is subject to lender review of information.
                                All loan approvals are conditional and all conditions must be met by borrower.
                                Loan is only approved when lender has issued approval in writing and is subject to
                                the Lender conditions. Specified rates may not be available for all borrowers.
                                Rate subject to change with market conditions.
                            </p>
                            <p>
                                C2 Financial Corporation is an Equal Opportunity Mortgage Broker/Lender.
                                For state licensing information, visit{' '}
                                <a
                                    href="https://www.nmlsconsumeraccess.org/EntityDetails.aspx/COMPANY/135622"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#60A5FA] hover:underline"
                                >
                                    NMLS Consumer Access
                                </a>.
                                As a broker, C2 Financial Corporation is NOT individually approved by the FHA or HUD,
                                but C2 Financial Corporation is allowed to originate FHA loans based on their
                                relationships with FHA approved lenders.
                            </p>
                            <p className="text-white/40">
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
            </div>
        </footer>
    )
}
