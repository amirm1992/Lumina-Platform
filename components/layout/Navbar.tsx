import Link from 'next/link'
import Image from 'next/image'

export function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-start justify-between px-6 py-6 pointer-events-none bg-gradient-to-b from-white/90 to-transparent">
            {/* Logo - Top Left */}
            <div className="pointer-events-auto">
                <Link href="/" className="flex items-center -ml-2 group">
                    <div className="relative w-20 h-20 -mt-2 transition-transform group-hover:scale-105">
                        <Image
                            src="/logo-transparent.png"
                            alt="Lumina Logo"
                            fill
                            className="object-contain drop-shadow-[0_4px_6px_rgba(0,0,0,0.05)]"
                        />
                    </div>
                    <div className="relative w-48 h-20 -mt-2 -ml-16 transition-transform group-hover:scale-105">
                        <Image
                            src="/lumina-text.png"
                            alt="Lumina"
                            fill
                            className="object-contain"
                        />
                    </div>
                </Link>
            </div>

            {/* Floating Auth Links */}
            <div className="flex items-center gap-4 pointer-events-auto mt-4">
                <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-black transition-colors bg-white/80 backdrop-blur-md px-6 py-2.5 rounded-full border border-gray-200 hover:border-gray-300 hover:shadow-md h-12 flex items-center shadow-sm">
                    Log in
                </Link>
                <Link href="/apply">
                    <button className="px-6 py-2.5 rounded-full text-sm font-semibold bg-black text-white hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl h-12">
                        Get Started
                    </button>
                </Link>
            </div>
        </nav>
    )
}
