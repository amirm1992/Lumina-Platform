'use client'

import { SignIn } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function LoginContent() {
    const searchParams = useSearchParams()
    const redirectTo = searchParams.get('redirect') || '/dashboard'

    return (
        <div className="min-h-screen relative flex flex-col items-center justify-center p-4 overflow-hidden bg-[#0F172A]">
            {/* Abstract Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[100px] animate-pulse delay-1000" />
            </div>

            {/* Back to Home Link */}
            <Link
                href="/"
                className="absolute top-8 left-8 text-white/60 hover:text-white text-sm flex items-center gap-2 transition-all hover:-translate-x-1 z-20 group"
            >
                <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </div>
                <span className="font-medium tracking-wide">Back to Home</span>
            </Link>

            <div className="w-full max-w-[440px] z-10 flex flex-col items-center animate-in fade-in zoom-in duration-500">
                {/* Logo Section */}
                <div className="flex flex-col items-center mb-10 text-center">
                    <div className="relative w-16 h-16 mb-6 drop-shadow-2xl">
                        <Image
                            src="/logo-transparent.png"
                            alt="Lumina"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Welcome Back</h1>
                    <p className="text-white/60 text-sm max-w-xs leading-relaxed">
                        {redirectTo.startsWith('/admin')
                            ? 'Secure access to the Lumina Admin Portal'
                            : 'Log in to manage your mortgage applications'}
                    </p>
                </div>

                {/* Glassmorphism Card Container */}
                <div className="relative w-full">
                    {/* Glowing border effect */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 rounded-2xl blur opacity-75 animate-pulse" />

                    <div className="relative bg-[#0F172A]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                        <SignIn
                            appearance={{
                                baseTheme: dark,
                                variables: {
                                    colorPrimary: '#2563EB',
                                    colorBackground: 'transparent',
                                    colorInputBackground: 'rgba(255, 255, 255, 0.05)',
                                    colorInputText: '#fff',
                                    colorText: '#fff',
                                    colorTextSecondary: 'rgba(255, 255, 255, 0.6)',
                                    borderRadius: '0.75rem',
                                },
                                elements: {
                                    rootBox: "w-full !bg-transparent",
                                    cardBox: "!bg-transparent !shadow-none !border-none w-full",
                                    card: "!bg-transparent !shadow-none !border-none !p-8 w-full",
                                    headerTitle: "hidden",
                                    headerSubtitle: "hidden",
                                    formFieldInput: "!bg-white/5 !border-white/10 focus:!border-blue-500/50 !text-white placeholder:!text-white/30 !transition-all",
                                    formFieldLabel: "!text-white/70",
                                    socialButtonsBlockButton: "!bg-white/5 hover:!bg-white/10 !border-white/10 !transition-colors",
                                    socialButtonsBlockButtonText: "!text-white/90 !font-medium",
                                    dividerLine: "!bg-white/10",
                                    dividerText: "!text-white/40",
                                    footer: "!bg-transparent !border-none",
                                    footerAction: "!bg-transparent",
                                    footerActionLink: "!text-blue-400 hover:!text-blue-300 !font-medium",
                                    identityPreviewEditButton: "!text-blue-400 hover:!text-blue-300",
                                    formButtonPrimary: "!bg-blue-600 hover:!bg-blue-500 !text-white !shadow-lg !shadow-blue-500/20 !border-0"
                                }
                            }}
                            routing="path"
                            path="/login"
                            signUpUrl="/apply"
                            fallbackRedirectUrl={redirectTo}
                        />
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-12 text-center z-10">
                <p className="text-white/20 text-xs font-light tracking-wider">
                    SECURE & ENCRYPTED • NMLS #1631748
                </p>
            </div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-[#0F172A]">
                <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
        }>
            <LoginContent />
        </Suspense>
    )
}
