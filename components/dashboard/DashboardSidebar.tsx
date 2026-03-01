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
    Menu,
    X,
} from 'lucide-react'

export default function DashboardSidebar() {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()
    const { signOut } = useClerk()

    // Close on route change on mobile
    useEffect(() => {
        setIsOpen(false)
    }, [pathname])

    const navItems = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'DocHub', href: '/dochub', icon: FileText },
        { name: 'Messages', href: '/messages', icon: MessageSquare },
        { name: 'Properties', href: '/properties', icon: Building2 },
    ]

    return (
        <>
            {/* Mobile Header Toggle */}
            <div className="md:hidden fixed top-0 left-0 w-full h-16 bg-white border-b border-gray-200 z-40 flex items-center justify-between px-6">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <Image src="/logo-transparent.png" alt="Lumina" width={28} height={28} />
                    <span className="text-lg font-bold text-[#1E3A5F]">Lumina</span>
                </Link>
                <button onClick={() => setIsOpen(true)} className="text-gray-600">
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            {/* Backdrop for mobile */}
            {isOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <div
                className={`fixed top-0 left-0 h-full bg-[#111827] text-gray-300 shadow-2xl z-50 transition-transform duration-300 ease-in-out md:translate-x-0 md:w-64 ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64'
                    }`}
            >
                {/* Header / Logo */}
                <div className="h-24 flex items-center px-8 border-b border-gray-800">
                    <Link href="/dashboard" className="flex items-center gap-3">
                        <div className="relative w-8 h-8 opacity-90">
                            <Image
                                src="/logo-transparent.png"
                                alt="Lumina Logo"
                                fill
                                className="object-contain brightness-0 invert"
                            />
                        </div>
                        <span className="text-xl font-bold text-white tracking-wide">Lumina</span>
                    </Link>
                    {/* Mobile Close Button */}
                    <button
                        onClick={() => setIsOpen(false)}
                        className="md:hidden ml-auto p-1 rounded-md text-gray-400 hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation Links */}
                <div className="flex flex-col h-[calc(100%-6rem)] justify-between py-8">
                    <nav className="px-4 space-y-2">
                        <p className="px-4 text-[10px] font-bold tracking-widest text-gray-500 uppercase mb-4">Main Menu</p>
                        {navItems.map((item) => {
                            const Icon = item.icon
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                            ? 'bg-[#2563EB] text-white shadow-md'
                                            : 'hover:bg-gray-800 hover:text-white'
                                        }`}
                                >
                                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white transition-colors'}`} />
                                    <span className="font-medium tracking-wide text-sm">{item.name}</span>
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Footer / User Actions */}
                    <div className="px-4">
                        <div className="border-t border-gray-800 pt-4 mb-2">
                            <button
                                onClick={() => signOut()}
                                className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-gray-400 hover:bg-gray-800 hover:text-white transition-all group"
                            >
                                <LogOut className="w-5 h-5 text-gray-500 group-hover:text-red-400 transition-colors" />
                                <span className="font-medium tracking-wide text-sm">Sign Out</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
