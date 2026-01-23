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
                <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-100 text-gray-400 text-xs">
                    <div>© 2026 Lumina Financial Technologies Inc. All rights reserved. NMLS #123456</div>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <Link href="#" className="hover:text-gray-600">Privacy Policy</Link>
                        <Link href="#" className="hover:text-gray-600">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
