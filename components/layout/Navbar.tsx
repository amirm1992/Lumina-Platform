'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

export function Navbar() {
    const [activeTab, setActiveTab] = useState<'personal' | 'business'>('personal')

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
            <div className="container mx-auto px-6">
                <div className="flex items-center justify-between h-16">

                    {/* Left: Logo + Tabs */}
                    <div className="flex items-center gap-8">
                        {/* Logo */}
                        <Link href="/" className="flex items-center group">
                            <div className="relative w-12 h-12 transition-transform group-hover:scale-105">
                                <Image
                                    src="/logo-transparent.png"
                                    alt="Lumina Logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <span className="ml-2 text-xl font-bold text-[#0D3B25]">Lumina</span>
                        </Link>

                        {/* Personal/Business Tabs */}
                        <div className="hidden md:flex items-center bg-gray-100 rounded-full p-1">
                            <button
                                onClick={() => setActiveTab('personal')}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${activeTab === 'personal'
                                        ? 'bg-white text-[#0D3B25] shadow-sm'
                                        : 'text-gray-600 hover:text-[#0D3B25]'
                                    }`}
                            >
                                Personal
                            </button>
                            <button
                                onClick={() => setActiveTab('business')}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${activeTab === 'business'
                                        ? 'bg-white text-[#0D3B25] shadow-sm'
                                        : 'text-gray-600 hover:text-[#0D3B25]'
                                    }`}
                            >
                                Business
                            </button>
                        </div>
                    </div>

                    {/* Center: Nav Links */}
                    <div className="hidden lg:flex items-center gap-6">
                        <Link href="#loan-products" className="text-sm text-gray-700 hover:text-[#0D3B25] transition-colors">
                            Loan Products
                        </Link>
                        <Link href="#calculator" className="text-sm text-gray-700 hover:text-[#0D3B25] transition-colors">
                            Calculator
                        </Link>
                        <Link href="#how-it-works" className="text-sm text-gray-700 hover:text-[#0D3B25] transition-colors">
                            How It Works
                        </Link>
                        <Link href="/disclosures" className="text-sm text-gray-700 hover:text-[#0D3B25] transition-colors">
                            Resources
                        </Link>
                    </div>

                    {/* Right: Auth Buttons */}
                    <div className="flex items-center gap-3">
                        <Link
                            href="/login"
                            className="hidden sm:flex items-center px-4 py-2 text-sm font-medium text-[#0D3B25] hover:bg-gray-50 rounded-full transition-colors"
                        >
                            Log in
                        </Link>
                        <Link href="/apply">
                            <button className="px-5 py-2.5 rounded-full text-sm font-semibold bg-[#22C55E] text-white hover:bg-[#16A34A] transition-all shadow-sm hover:shadow-md">
                                Get Started
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}
