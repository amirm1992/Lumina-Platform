'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
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
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100">
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-black mb-2">Reset Password</h1>
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
                                className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 text-black placeholder:text-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-700 mb-2">Confirm New Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => { setConfirmPassword(e.target.value); setError('') }}
                                placeholder="Confirm your password"
                                className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 text-black placeholder:text-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                            />
                        </div>

                        {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-6 py-4 rounded-xl bg-black text-white font-bold hover:bg-gray-800 transition-all disabled:opacity-50 shadow-md hover:shadow-lg"
                        >
                            {loading ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500">
                        <Link href="/login" className="text-purple-600 font-semibold hover:text-purple-500 transition-colors">Back to Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
