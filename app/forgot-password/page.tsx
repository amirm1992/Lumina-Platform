'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/utils/supabase/client'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!email) {
            setError('Please enter your email address')
            return
        }

        setLoading(true)
        setError('')

        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
        })

        if (resetError) {
            setError(resetError.message)
            setLoading(false)
            return
        }

        setSuccess(true)
        setLoading(false)
    }

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#1E3A5F] via-[#1A3353] to-[#0F172A] flex items-center justify-center p-4">
                <div className="w-full max-w-md text-center space-y-6 bg-white p-8 rounded-2xl shadow-2xl">
                    <div className="w-16 h-16 mx-auto rounded-full bg-[#EFF6FF] flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-[#2563EB]">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-[#1E3A5F]">Check Your Email</h1>
                    <p className="text-gray-500">
                        We've sent a password reset link to <span className="text-[#2563EB] font-medium">{email}</span>.
                        Click the link to reset your password.
                    </p>
                    <Link href="/login" className="inline-block text-[#2563EB] hover:text-[#1D4ED8] text-sm underline font-medium">
                        Back to Sign In
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1E3A5F] via-[#1A3353] to-[#0F172A] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <Link href="/login" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-8 text-sm transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                    Back to Sign In
                </Link>

                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    {/* Logo */}
                    <div className="flex items-center justify-center gap-2 mb-8">
                        <div className="relative w-10 h-10">
                            <Image
                                src="/logo-transparent.png"
                                alt="Lumina Logo"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <span className="text-xl font-bold text-[#1E3A5F]">Lumina</span>
                    </div>

                    <div className="mb-8 text-center">
                        <h1 className="text-2xl font-bold text-[#1E3A5F] mb-2">Forgot Password</h1>
                        <p className="text-gray-500">Enter your email and we'll send you a reset link.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); setError('') }}
                                placeholder="you@example.com"
                                className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 text-black placeholder:text-gray-400 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-all"
                            />
                        </div>

                        {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-6 py-4 rounded-xl bg-[#2563EB] text-white font-semibold hover:bg-[#1D4ED8] hover:shadow-lg hover:shadow-[#2563EB]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
