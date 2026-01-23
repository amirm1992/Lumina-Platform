'use client'

import Link from 'next/link'
import Image from 'next/image'
import SignOutButton from '@/components/auth/signout-button'
import { User } from '@supabase/supabase-js'

interface DashboardNavbarProps {
    user: User | null
}

export function DashboardNavbar({ user }: DashboardNavbarProps) {
    return (
        <nav className="border-b border-gray-100 bg-white/90 backdrop-blur-md sticky top-0 z-50">
            <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo Section */}
                <div className="flex items-center gap-8">
                    <Link href="/dashboard" className="flex items-center -ml-2 group">
                        <div className="relative w-20 h-20 transition-transform group-hover:scale-105">
                            <Image
                                src="/logo-transparent.png"
                                alt="Lumina Logo"
                                fill
                                className="object-contain drop-shadow-sm"
                            />
                        </div>
                        <div className="relative w-56 h-20 -ml-12 transition-transform group-hover:scale-105">
                            <Image
                                src="/lumina-text.png"
                                alt="Lumina"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center gap-8 ml-4">
                        <Link href="/dashboard" className="text-sm font-medium text-black hover:text-purple-600 transition-colors">Dashboard</Link>
                        <Link href="/dochub" className="text-sm font-medium text-gray-500 hover:text-black transition-colors">DocHub</Link>
                        <Link href="/messages" className="text-sm font-medium text-gray-500 hover:text-black transition-colors">Messages</Link>
                        <Link href="/properties" className="text-sm font-medium text-gray-500 hover:text-black transition-colors">Properties</Link>
                    </div>
                </div>

                {/* Right Side - User Profile */}
                <div className="flex items-center gap-4">
                    <div className="hidden md:block text-right">
                        <div className="text-xs text-gray-500">Welcome back</div>
                        <div className="text-sm font-semibold text-black truncate max-w-[150px]">{user?.email}</div>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-purple-200">
                        {user?.email?.[0].toUpperCase() || 'U'}
                    </div>
                    <SignOutButton />
                </div>
            </div>
        </nav>
    )
}
