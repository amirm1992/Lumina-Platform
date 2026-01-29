'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function AdminLoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        const supabase = createClient()

        const { data, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (signInError) {
            setError(signInError.message)
            setLoading(false)
            return
        }

        // Check if user is admin
        if (data.user) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('is_admin')
                .eq('id', data.user.id)
                .single()

            if (!profile?.is_admin) {
                // Sign out non-admin users
                await supabase.auth.signOut()
                setError('Access denied. This portal is for administrators only.')
                setLoading(false)
                return
            }

            // Admin verified - redirect to admin dashboard
            router.push('/admin')
        }

        setLoading(false)
    }

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                {/* Admin Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#2563EB] mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-white">Lumina Admin</h1>
                    <p className="text-gray-400 mt-2">Sign in to access the admin portal</p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleLogin} className="bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-700">
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm text-gray-300 mb-2">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@lumina.com"
                                required
                                className="w-full p-4 rounded-xl bg-gray-700 border border-gray-600 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#EFF6FF]0 focus:ring-1 focus:ring-[#EFF6FF]0 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-300 mb-2">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full p-4 rounded-xl bg-gray-700 border border-gray-600 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#EFF6FF]0 focus:ring-1 focus:ring-[#EFF6FF]0 transition-all"
                            />
                        </div>

                        {error && (
                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 rounded-xl bg-[#2563EB] text-white font-bold hover:bg-[#EFF6FF]0 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#2563EB]/30"
                        >
                            {loading ? 'Signing in...' : 'Sign In to Admin Portal'}
                        </button>
                    </div>
                </form>

                {/* Security Notice */}
                <div className="mt-6 text-center">
                    <p className="text-gray-500 text-xs">
                        🔒 This is a secure admin portal. Unauthorized access is prohibited.
                    </p>
                </div>
            </div>
        </div>
    )
}
