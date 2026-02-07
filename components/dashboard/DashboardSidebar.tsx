'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useClerk } from '@clerk/nextjs'
import {
    LayoutDashboard,
    FileText,
    MessageSquare,
    Building2,
    LogOut,
    X,
    ChevronRight
} from 'lucide-react'

export default function DashboardSidebar() {
    const [isOpen, setIsOpen] = useState(true)
    const pathname = usePathname()
    const { signOut } = useClerk()

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsOpen(false)
        }, 500) // 0.5s auto-collapse

        // Clear timer if component unmounts
        return () => clearTimeout(timer)
    }, [])

    const navItems = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'DocHub', href: '/dochub', icon: FileText },
        { name: 'Messages', href: '/messages', icon: MessageSquare },
        { name: 'Properties', href: '/properties', icon: Building2 },
    ]

    return (
        <>
            {/* Logo (Visible when sidebar is closed) */}
            {!isOpen && (
                <Link
                    href="/dashboard"
                    className="fixed top-6 left-6 z-40 transition-opacity duration-300 hover:opacity-80"
                >
                    <div className="relative w-10 h-10">
                        <Image
                            src="/logo-transparent.png"
                            alt="Lumina"
                            fill
                            className="object-contain"
                        />
                    </div>
                </Link>
            )}

            {/* Mid-Page Tab Trigger (Visible when sidebar is closed) */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed left-0 top-1/2 -translate-y-1/2 z-50 bg-white border-y border-r border-gray-200 shadow-lg rounded-r-xl p-2 py-3 text-gray-500 hover:text-[#2563EB] hover:pl-3 transition-all duration-300 group"
                    aria-label="Open Menu"
                >
                    <div className="flex flex-col items-center gap-1">
                        <span className="w-1 h-8 bg-gray-300 rounded-full group-hover:bg-[#2563EB] transition-colors" />
                        <ChevronRight className="w-4 h-4" />
                    </div>
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
                            const Icon = item.icon
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                            ? 'bg-[#EBF5FF] text-[#2563EB] font-medium'
                                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                >
                                    <Icon className={`w-5 h-5 ${isActive ? 'text-[#2563EB]' : 'text-gray-400 group-hover:text-gray-600'}`} />
                                    <span>{item.name}</span>
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
