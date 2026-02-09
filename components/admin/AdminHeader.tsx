'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Menu } from 'lucide-react'

interface AdminHeaderProps {
    email: string
    onMobileMenuToggle: () => void
}

export function AdminHeader({ email, onMobileMenuToggle }: AdminHeaderProps) {
    const initial = email?.[0]?.toUpperCase() || 'A'

    return (
        <header className="h-16 bg-white border-b border-gray-200 px-4 sm:px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
                {/* Mobile hamburger */}
                <button
                    onClick={onMobileMenuToggle}
                    className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
                    aria-label="Open navigation"
                >
                    <Menu className="w-5 h-5" />
                </button>

                <Link href="/admin" className="flex items-center">
                    <Image
                        src="/logo-transparent.png"
                        alt="Lumina"
                        width={40}
                        height={40}
                        className="w-10 h-10"
                    />
                    <span className="ml-2 font-bold text-xl text-gray-900 hidden sm:inline">Lumina Admin</span>
                    <span className="ml-2 font-bold text-xl text-gray-900 sm:hidden">Admin</span>
                </Link>
            </div>

            <div className="flex items-center gap-3">
                {/* Email — hidden on small screens, truncated on medium */}
                <span className="hidden md:block text-sm text-gray-500 max-w-[200px] truncate">
                    <span className="hidden lg:inline">Logged in as </span>
                    <span className="font-medium text-gray-900">{email}</span>
                </span>
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-700 font-medium text-sm">{initial}</span>
                </div>
            </div>
        </header>
    )
}
