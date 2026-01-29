'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/utils/supabase/client'

export default function ResetPasswordPage() {
    const router = useRouter()
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (password.length < 6) {
            setError('Password must be at least 6 characters')
            return
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        setLoading(true)
        setError('')

        const { error: updateError } = await supabase.auth.updateUser({
            password: password,
        })

        if (updateError) {
            setError(updateError.message)
            setLoading(false)
            return
        }

        // Redirect to dashboard after password reset
        router.push('/dashboard')
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1E3A5F] via-[#1A3353] to-[#0F172A] flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl">
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

                <div className="space-y-6">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-[#1E3A5F] mb-2">Reset Password</h1>
                        <p className="text-gray-500">Enter your new password below.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-700 mb-2">New Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); setError('') }}
                                placeholder="At least 6 characters"
                                className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 text-black placeholder:text-gray-400 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-700 mb-2">Confirm New Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => { setConfirmPassword(e.target.value); setError('') }}
                                placeholder="Confirm your password"
                                className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 text-black placeholder:text-gray-400 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-all"
                            />
                        </div>

                        {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-6 py-4 rounded-xl bg-[#2563EB] text-white font-semibold hover:bg-[#1D4ED8] hover:shadow-lg hover:shadow-[#2563EB]/20 transition-all disabled:opacity-50"
                        >
                            {loading ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500">
                        <Link href="/login" className="text-[#2563EB] font-semibold hover:text-[#1D4ED8] transition-colors">Back to Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
