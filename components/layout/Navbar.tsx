'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

export function Navbar() {
    const [activeTab, setActiveTab] = useState<'personal' | 'commercial'>('personal')

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
            <div className="container mx-auto px-6">
                <div className="flex items-center justify-between h-16">

                    {/* Left: Logo Only */}
                    <div className="flex items-center">
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
                            <span className="ml-2 text-xl font-bold text-[#1E3A5F]">Lumina</span>
                        </Link>
                    </div>

                    {/* Right: Auth Buttons + Personal/Commercial Toggle */}
                    <div className="flex items-center gap-4">
                        <Link
                            href="/login"
                            className="hidden sm:flex items-center px-4 py-2 text-sm font-medium text-[#1E3A5F] hover:bg-gray-50 rounded-full transition-colors"
                        >
                            Log in
                        </Link>
                        <Link href="/apply">
                            <button className="px-5 py-2.5 rounded-full text-sm font-semibold bg-[#2563EB] text-white hover:bg-[#1D4ED8] transition-all shadow-sm hover:shadow-md">
                                Get Started
                            </button>
                        </Link>

                        {/* Personal/Commercial Toggle - After Get Started */}
                        <div className="hidden md:flex items-center bg-gray-100 rounded-full p-0.5">
                            <button
                                onClick={() => setActiveTab('personal')}
                                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${activeTab === 'personal'
                                    ? 'bg-white text-[#1E3A5F] shadow-sm'
                                    : 'text-gray-600 hover:text-[#1E3A5F]'
                                    }`}
                            >
                                Personal
                            </button>
                            <button
                                onClick={() => setActiveTab('commercial')}
                                className={`relative px-3 py-1 rounded-full text-xs font-medium transition-all ${activeTab === 'commercial'
                                    ? 'bg-white text-[#1E3A5F] shadow-sm'
                                    : 'text-gray-600 hover:text-[#1E3A5F]'
                                    }`}
                            >
                                Commercial
                                {/* Coming Soon Badge - Translucent & positioned above */}
                                <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-1.5 py-0.5 text-[8px] font-semibold bg-emerald-500/80 backdrop-blur-sm text-white rounded-full whitespace-nowrap">
                                    Coming Soon
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}
