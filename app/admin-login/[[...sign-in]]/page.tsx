'use client'

import { SignIn } from '@clerk/nextjs'
import Link from 'next/link'
import Image from 'next/image'

export default function AdminLoginPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E3A5F] to-[#0F172A] flex flex-col items-center justify-center p-4">
            {/* Back to Home Link */}
            <Link
                href="/"
                className="absolute top-6 left-6 text-white/70 hover:text-white text-sm flex items-center gap-2 transition-colors"
            >
                ‹ Back to Home
            </Link>

            <div className="w-full max-w-md">
                {/* Logo & Admin Badge */}
                <div className="flex flex-col items-center mb-8">
                    <Link href="/" className="flex items-center gap-2 mb-4">
                        <Image
                            src="/logo-transparent.png"
                            alt="Lumina"
                            width={40}
                            height={40}
                            className="w-10 h-10"
                        />
                        <span className="text-white text-xl font-bold">Lumina</span>
                    </Link>
                    <div className="bg-[#2563EB]/20 text-[#60A5FA] px-4 py-1 rounded-full text-sm font-medium border border-[#2563EB]/30">
                        Admin Portal
                    </div>
                </div>

                {/* Sign-in heading so it's clear this is the login page */}
                <h2 className="text-white text-center text-lg font-semibold mb-4">
                    Sign in with your admin account
                </h2>

                {/* Clerk Sign In Component - email/password + social options */}
                <div className="min-h-[320px] w-full flex justify-center">
                    <SignIn
                        /* appearance={{
                            elements: {
                                rootBox: "w-full max-w-full",
                                card: "bg-white rounded-2xl shadow-2xl border-0 w-full",
                                cardBox: "w-full",
                                headerTitle: "text-[#1E3A5F] font-bold",
                                headerSubtitle: "text-gray-600",
                            formButtonPrimary: "bg-[#2563EB] hover:bg-[#1D4ED8] transition-colors",
                            formFieldInput: "border-gray-200 focus:border-[#2563EB] focus:ring-[#2563EB]",
                            footerActionLink: "text-[#2563EB] hover:text-[#1D4ED8]",
                            identityPreviewEditButton: "text-[#2563EB]",
                        },
                        layout: {
                            socialButtonsPlacement: "bottom",
                            socialButtonsVariant: "iconButton",
                        }
                    }} */
                        routing="path"
                        path="/admin-login"
                        afterSignInUrl="/admin/applications"
                    />
                </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center text-white/50 text-xs">
                <p>© 2026 Lumina Financial Technologies. All rights reserved.</p>
                <p className="mt-1">Admin access requires elevated permissions</p>
            </div>
        </div>
    )
}
