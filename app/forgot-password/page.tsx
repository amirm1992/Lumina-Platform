'use client'

import React, { useState } from 'react'
import Link from 'next/link'
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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="w-full max-w-md text-center space-y-6 bg-white p-8 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100">
                    <div className="w-16 h-16 mx-auto rounded-full bg-green-50 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-green-500">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-black">Check Your Email</h1>
                    <p className="text-gray-500">
                        We've sent a password reset link to <span className="text-purple-600 font-medium">{email}</span>.
                        Click the link to reset your password.
                    </p>
                    <Link href="/login" className="inline-block text-purple-600 hover:text-purple-700 text-sm underline font-medium">
                        Back to Sign In
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <Link href="/login" className="inline-flex items-center gap-2 text-gray-500 hover:text-black mb-8 text-sm transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                    Back to Sign In
                </Link>

                <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-8 border border-gray-100">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-black mb-2">Forgot Password</h1>
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
                                className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 text-black placeholder:text-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10 transition-all"
                            />
                        </div>

                        {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-6 py-4 rounded-xl bg-black text-white font-semibold hover:bg-gray-900 hover:shadow-lg hover:shadow-black/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
