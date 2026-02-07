'use client'

import { SignIn } from '@clerk/nextjs'
import Link from 'next/link'
import Image from 'next/image'

export default function LoginPage() {
    return (
        <div className="min-h-screen relative flex flex-col items-center justify-center p-4 overflow-hidden">
            {/* Abstract Background */}
            <div className="absolute inset-0 bg-[#0F172A] z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] animate-pulse" />
            </div>

            {/* Back to Home Link */}
            <Link
                href="/"
                className="absolute top-8 left-8 text-white/60 hover:text-white text-sm flex items-center gap-2 transition-all hover:-translate-x-1 z-20 group"
            >
                <span className="bg-white/10 p-1.5 rounded-full group-hover:bg-white/20 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </span>
                Back to Home
            </Link>

            <div className="w-full max-w-md z-10">
                {/* Logo Section */}
                <div className="flex flex-col items-center mb-8">
                    <div className="relative w-16 h-16 mb-4">
                        <Image
                            src="/logo-transparent.png"
                            alt="Lumina"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h1>
                    <p className="text-white/50 mt-2 text-sm">Sign in to access your financial dashboard</p>
                </div>

                {/* Glassmorphism Card Container */}
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-1 shadow-2xl">
                        <SignIn
                            appearance={{
                                elements: {
                                    rootBox: "w-full",
                                    card: "bg-transparent shadow-none border-0 p-6",
                                    headerTitle: "hidden",
                                    headerSubtitle: "hidden",
                                    // Primary Button
                                    formButtonPrimary: "bg-white text-black hover:bg-gray-100 transition-all transform hover:scale-[1.02] active:scale-[0.98] font-medium h-10 rounded-lg",
                                    // Inputs
                                    formFieldInput: "!bg-white/10 !border-white/10 !text-white placeholder:text-white/30 focus:!border-blue-500 focus:!ring-blue-500 rounded-lg",
                                    formFieldLabel: "!text-white/80",
                                    // Links
                                    footerActionLink: "!text-blue-400 hover:!text-blue-300",
                                    identityPreviewEditButton: "!text-blue-400 hover:!text-blue-300",
                                    formFieldAction: "!text-blue-400 hover:!text-blue-300",
                                    formResendCodeLink: "!text-blue-400 hover:!text-blue-300",
                                    // Divider
                                    dividerLine: "bg-white/10",
                                    dividerText: "!text-white/50",
                                    // Social / Alternative Methods
                                    socialButtonsBlockButton: "!bg-white/5 !border-white/10 hover:!bg-white/10",
                                    socialButtonsBlockButtonText: "!text-white",
                                    socialButtonsBlockButtonArrow: "!text-white/50",
                                    alternativeMethodsBlockButton: "!bg-white/5 !border-white/10 hover:!bg-white/10 !text-white",
                                    alternativeMethodsBlockButtonText: "!text-white",
                                    alternativeMethodsBlockButtonArrow: "!text-white/50",
                                    // Alerts & Errors
                                    formFieldErrorText: "!text-red-300",
                                    alertText: "!text-red-200",
                                    alert: "!bg-red-900/50 !border-red-800",
                                    // OTP
                                    otpCodeFieldInput: "!bg-white/10 !border-white/10 !text-white"
                                },
                                layout: {
                                    socialButtonsPlacement: "bottom",
                                    socialButtonsVariant: "blockButton",
                                }
                            }}
                            routing="path"
                            path="/login"
                            signUpUrl="/signup"
                            afterSignInUrl="/dashboard"
                        />
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-12 text-center z-10">
                <p className="text-white/30 text-xs">
                    © 2026 Lumina Financial Technologies. <br />
                    Bank-level security. NMLS #1631748.
                </p>
            </div>
        </div>
    )
}
