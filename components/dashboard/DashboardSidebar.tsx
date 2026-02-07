'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FileText, MessageSquare, Building2, LogOut, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useClerk } from '@clerk/nextjs'

export function DashboardSidebar() {
    const [isOpen, setIsOpen] = useState(true)
    const pathname = usePathname()
    const { signOut } = useClerk()

    // Auto-collapse logic
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsOpen(false)
        }, 3000)

        // Clear timer if component unmounts
        return () => clearTimeout(timer)
    }, [])

    const navItems = [
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/dochub', label: 'DocHub', icon: FileText },
        { href: '/messages', label: 'Messages', icon: MessageSquare },
        { href: '/properties', label: 'Properties', icon: Building2 },
    ]

    return (
        <>
            {/* Toggle Button (Fixed on screen when closed) */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed top-6 left-6 z-50 p-2 bg-white rounded-lg shadow-md border border-gray-200 text-gray-600 hover:text-[#2563EB] hover:border-[#2563EB] transition-all"
                    aria-label="Open Menu"
                >
                    <Menu className="w-6 h-6" />
                </button>
            )}

            {/* Sidebar Container */}
            <div
                className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 shadow-2xl z-50 transition-all duration-300 ease-in-out transform ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64'
                    }`}
            >
                {/* Header */}
                <div className="h-20 flex items-center justify-between px-6 border-b border-gray-100">
                    <Link href="/dashboard" className="flex items-center gap-3">
                        <div className="relative w-8 h-8">
                            <Image
                                src="/logo-transparent.png"
                                alt="Lumina"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <span className="text-lg font-bold text-[#1E3A5F]">Lumina</span>
                    </Link>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-1 rounded-md hover:bg-gray-100 text-gray-500 transition-colors"
                        aria-label="Close Menu"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation */}
                <div className="flex flex-col h-[calc(100%-5rem)] justify-between py-6">
                    <nav className="px-4 space-y-2">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href
                            const Icon = item.icon
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)} // Close on navigate (optional, good for mobile)
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                        ? 'bg-[#EFF6FF] text-[#2563EB] font-medium'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-[#1E3A5F]'
                                        }`}
                                >
                                    <Icon className={`w-5 h-5 ${isActive ? 'text-[#2563EB]' : 'text-gray-400'}`} />
                                    <span>{item.label}</span>
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Footer / Sign Out */}
                    <div className="px-4">
                        <button
                            onClick={() => signOut()}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all group"
                        >
                            <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-500" />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Backdrop for mobile (or when open) */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    )
}
