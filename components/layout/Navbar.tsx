'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

export function Navbar() {
    const [activeTab, setActiveTab] = useState<'personal' | 'commercial'>('personal')
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => { document.body.style.overflow = '' }
    }, [mobileMenuOpen])

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
                <div className="container mx-auto px-6">
                    <div className="flex items-center justify-between h-16">

                        {/* Left: Logo */}
                        <div className="flex items-center">
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

                        {/* Right: Desktop nav */}
                        <div className="hidden sm:flex items-center gap-4">
                            <Link
                                href="/login"
                                className="flex items-center px-4 py-2 text-sm font-medium text-[#1E3A5F] hover:bg-gray-50 rounded-full transition-colors"
                            >
                                Log in
                            </Link>
                            <Link href="/apply">
                                <button className="px-5 py-2.5 rounded-full text-sm font-semibold bg-[#2563EB] text-white hover:bg-[#1D4ED8] transition-all shadow-sm hover:shadow-md">
                                    Get Started
                                </button>
                            </Link>

                            {/* Personal/Commercial Toggle */}
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
                                    <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-1.5 py-0.5 text-[8px] font-semibold bg-emerald-500/80 backdrop-blur-sm text-white rounded-full whitespace-nowrap">
                                        Coming Soon
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Mobile: Log in + Hamburger */}
                        <div className="flex sm:hidden items-center gap-3">
                            <Link
                                href="/login"
                                className="px-4 py-2 text-sm font-medium text-[#1E3A5F] hover:bg-gray-50 rounded-full transition-colors"
                            >
                                Log in
                            </Link>
                            <button
                                onClick={() => setMobileMenuOpen(true)}
                                className="p-2 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors"
                                aria-label="Open menu"
                            >
                                <Menu className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-[60] sm:hidden">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                        onClick={() => setMobileMenuOpen(false)}
                    />

                    {/* Panel */}
                    <div className="absolute top-0 right-0 w-72 h-full bg-white shadow-2xl animate-in slide-in-from-right duration-300">
                        {/* Close button */}
                        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-100">
                            <span className="text-lg font-bold text-[#1E3A5F]">Menu</span>
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                                aria-label="Close menu"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Menu items */}
                        <div className="p-6 space-y-4">
                            <Link
                                href="/login"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center px-4 py-3 text-base font-medium text-[#1E3A5F] hover:bg-gray-50 rounded-xl transition-colors"
                            >
                                Log in
                            </Link>

                            <Link
                                href="/apply"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center justify-center px-4 py-3 rounded-xl text-base font-semibold bg-[#2563EB] text-white hover:bg-[#1D4ED8] transition-all shadow-sm"
                            >
                                Get Started
                            </Link>

                            {/* Divider */}
                            <div className="border-t border-gray-100 pt-4">
                                <p className="text-xs text-gray-400 uppercase tracking-wider mb-3 px-4">Loan Type</p>
                                <div className="flex items-center bg-gray-100 rounded-full p-0.5 mx-4">
                                    <button
                                        onClick={() => setActiveTab('personal')}
                                        className={`flex-1 px-3 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'personal'
                                            ? 'bg-white text-[#1E3A5F] shadow-sm'
                                            : 'text-gray-600'
                                            }`}
                                    >
                                        Personal
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('commercial')}
                                        className={`relative flex-1 px-3 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'commercial'
                                            ? 'bg-white text-[#1E3A5F] shadow-sm'
                                            : 'text-gray-600'
                                            }`}
                                    >
                                        Commercial
                                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-1.5 py-0.5 text-[8px] font-semibold bg-emerald-500/80 text-white rounded-full whitespace-nowrap">
                                            Soon
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
