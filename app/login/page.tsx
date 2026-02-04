'use client'

import { SignIn } from '@clerk/nextjs'
import Link from 'next/link'
import Image from 'next/image'

export default function LoginPage() {
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
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <Link href="/" className="flex items-center gap-2">
                        <Image
                            src="/Lumina.svg"
                            alt="Lumina"
                            width={40}
                            height={40}
                            className="w-10 h-10"
                        />
                        <span className="text-white text-xl font-bold">Lumina</span>
                    </Link>
                </div>

                {/* Clerk Sign In Component */}
                <SignIn
                    appearance={{
                        elements: {
                            rootBox: "w-full",
                            card: "bg-white rounded-2xl shadow-2xl border-0",
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
                    }}
                    routing="path"
                    path="/login"
                    signUpUrl="/signup"
                    afterSignInUrl="/dashboard"
                />
            </div>

            {/* Footer */}
            <div className="mt-8 text-center text-white/50 text-xs">
                <p>© 2026 Lumina Financial Technologies. All rights reserved.</p>
                <p className="mt-1">NMLS #1631748</p>
            </div>
        </div>
    )
}
