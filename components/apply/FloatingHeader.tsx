'use client'

import Link from 'next/link'
import Image from 'next/image'

export function FloatingHeader() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex items-start justify-between px-4 sm:px-6 py-3 sm:py-6 bg-transparent pointer-events-none">
            <div className="pointer-events-auto hidden sm:block">
                <Link href="/" className="block group">
                    <div className="relative w-20 h-20 -mt-2 transition-transform group-hover:scale-105">
                        <Image
                            src="/logo-transparent.png"
                            alt="Lumina Logo"
                            fill
                            className="object-contain drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                        />
                    </div>
                </Link>
            </div>

            <div className="pointer-events-auto mt-1 sm:mt-4">
                <Link
                    href="/"
                    className="text-sm text-gray-600 hover:text-black flex items-center gap-2 transition-colors bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-gray-200 hover:bg-white shadow-sm"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Home
                </Link>
            </div>
        </header>
    )
}
