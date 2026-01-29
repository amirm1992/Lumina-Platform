
'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const supabase = createClient()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!email || !password) {
            setError('Please fill in all fields')
            return
        }

        setLoading(true)
        setError('')

        const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (signInError) {
            if (signInError.message.includes('Invalid login credentials')) {
                setError('Invalid email or password')
            } else if (signInError.message.includes('Email not confirmed')) {
                setError('Please confirm your email before signing in')
            } else {
                setError(signInError.message)
            }
            setLoading(false)
            return
        }

        router.push('/dashboard')
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1E3A5F] via-[#1A3353] to-[#0F172A] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <Link href="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-8 text-sm transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                    Back to Home
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
                        <h1 className="text-2xl font-bold text-[#1E3A5F] mb-2">Welcome Back</h1>
                        <p className="text-gray-500">Sign in to access your mortgage dashboard</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); setError('') }}
                                placeholder="you@example.com"
                                className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 text-black placeholder:text-gray-400 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-all"
                            />
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-medium text-gray-700">Password</label>
                                <Link href="/forgot-password" className="text-sm text-[#2563EB] hover:text-[#1D4ED8] font-medium">
                                    Forgot password?
                                </Link>
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); setError('') }}
                                placeholder="••••••••"
                                className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 text-black placeholder:text-gray-400 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-all"
                            />
                        </div>

                        {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-6 py-4 rounded-xl bg-[#2563EB] text-white font-semibold hover:bg-[#1D4ED8] hover:shadow-lg hover:shadow-[#2563EB]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="text-center text-sm text-gray-500 mt-6">
                        Don't have an account?{' '}
                        <Link href="/apply" className="text-[#2563EB] font-medium hover:underline">
                            Get Your Rates
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
