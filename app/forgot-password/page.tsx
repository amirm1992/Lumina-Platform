'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSignIn } from '@clerk/nextjs'

export default function ForgotPasswordPage() {
    const { signIn, isLoaded } = useSignIn()
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!isLoaded || !signIn) return

        setIsLoading(true)
        setError('')

        try {
            await signIn.create({
                strategy: 'reset_password_email_code',
                identifier: email,
            })
            setIsSuccess(true)
        } catch (err: any) {
            setError(err.errors?.[0]?.message || 'Failed to send reset email')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E3A5F] to-[#0F172A] flex flex-col items-center justify-center p-4">
            {/* Back to Login Link */}
            <Link
                href="/login"
                className="absolute top-6 left-6 text-white/70 hover:text-white text-sm flex items-center gap-2 transition-colors"
            >
                ‹ Back to Login
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

                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    <h1 className="text-2xl font-bold text-[#1E3A5F] text-center mb-2">
                        Reset Password
                    </h1>
                    <p className="text-gray-600 text-center mb-6">
                        Enter your email and we&apos;ll send you a reset code
                    </p>

                    {isSuccess ? (
                        <div className="text-center">
                            <div className="w-16 h-16 bg-[#2563EB]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-[#1E3A5F] mb-2">Check your email</h3>
                            <p className="text-gray-600 mb-4">
                                We sent a password reset code to <strong>{email}</strong>
                            </p>
                            <Link
                                href="/reset-password"
                                className="text-[#2563EB] hover:text-[#1D4ED8] font-medium"
                            >
                                Enter reset code →
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full p-3 rounded-lg border border-gray-200 focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none transition-colors"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
                            >
                                {isLoading ? 'Sending...' : 'Send Reset Code'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}
