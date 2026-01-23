'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useApplicationStore } from '@/store/applicationStore'
import { createClient } from '@/utils/supabase/client'

export function CreateAccount() {
    const router = useRouter()
    const { email, setEmail, setPassword, completeApplication, prevStep } = useApplicationStore()
    const [localEmail, setLocalEmail] = useState(email)
    const [localPassword, setLocalPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showExistingAccount, setShowExistingAccount] = useState(false)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const supabase = createClient()

    const handleSubmit = async () => {
        // Validation
        if (!localEmail || !localPassword) {
            setError('Please fill in all fields')
            return
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(localEmail)) {
            setError('Please enter a valid email address')
            return
        }
        if (localPassword.length < 6) {
            setError('Password must be at least 6 characters')
            return
        }
        if (localPassword !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        setLoading(true)
        setError('')
        setShowExistingAccount(false)

        const { data, error: signUpError } = await supabase.auth.signUp({
            email: localEmail,
            password: localPassword,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        })

        if (signUpError) {
            // Check if user already exists
            if (signUpError.message.includes('already registered') || signUpError.message.includes('User already')) {
                setShowExistingAccount(true)
                setError('An account with this email already exists.')
            } else {
                setError(signUpError.message)
            }
            setLoading(false)
            return
        }

        // Check if email confirmation is required (identities array is empty means waiting for confirmation)
        if (data.user && data.user.identities && data.user.identities.length === 0) {
            setShowExistingAccount(true)
            setError('An account with this email already exists.')
            setLoading(false)
            return
        }

        setEmail(localEmail)
        setPassword(localPassword)
        completeApplication()
        setSuccess(true)
        setLoading(false)
    }

    const handleBack = () => {
        prevStep()
        router.push('/apply/step/11')
    }

    if (success) {
        return (
            <div className="space-y-6 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-green-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                </div>
                <h1 className="text-3xl font-bold text-white">Check Your Email</h1>
                <p className="text-gray-400 max-w-md mx-auto">
                    We've sent a confirmation link to <span className="text-purple-400 font-medium">{localEmail}</span>.
                    Click the link to verify your email and access your personalized rates.
                </p>
                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-sm text-blue-300">
                    💡 Don't see the email? Check your spam folder or wait a few minutes.
                </div>
                <button
                    onClick={() => router.push('/login')}
                    className="text-purple-400 hover:text-purple-300 text-sm underline"
                >
                    Already confirmed? Sign in here
                </button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Create your dashboard</h1>
                <p className="text-gray-400">Your personalized rates are almost ready.</p>
            </div>

            <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-sm text-purple-300">
                🔒 Your data is encrypted. We are not a lead generator—your info stays with us.
            </div>

            <div className="space-y-4">
                <h1 className="text-3xl font-bold text-black mb-2">Create your account</h1>
                <p className="text-gray-500">Save your progress and see your rates instantly.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div>
                    <label className="block text-sm text-gray-500 mb-2">Email Address</label>
                    <input
                        type="email"
                        value={localEmail}
                        onChange={(e) => { setLocalEmail(e.target.value); setError(''); setShowExistingAccount(false) }}
                        placeholder="you@example.com"
                        className="w-full p-4 rounded-xl bg-white border border-gray-200 text-black placeholder:text-gray-400 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all shadow-sm"
                    />
                </div>

                {/* Password */}
                <div>
                    <label className="block text-sm text-gray-500 mb-2">Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={localPassword}
                            onChange={(e) => { setLocalPassword(e.target.value); setError('') }}
                            placeholder="At least 8 characters"
                            className="w-full p-4 rounded-xl bg-white border border-gray-200 text-black placeholder:text-gray-400 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all shadow-sm"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                        >
                            {showPassword ? 'Hide' : 'Show'}
                        </button>
                    </div>
                </div>

                {/* Confirm Password - kept for logic but hidden if not needed or add back if requested, sticking to previous UI replacement which removed it visually but logic remains. Wait, previous replacement removed Confirm Password UI. The logic uses it. I should verify if I need to keep it. The previous dark mode code had it. My light mode replacement REMOVED it. I should add it back to match functionality. */}
                <div>
                    <label className="block text-sm text-gray-500 mb-2">Confirm Password</label>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => { setConfirmPassword(e.target.value); setError('') }}
                        placeholder="Confirm your password"
                        className="w-full p-4 rounded-xl bg-white border border-gray-200 text-black placeholder:text-gray-400 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 transition-all shadow-sm"
                    />
                </div>

                {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>}

                <div className="pt-4 flex justify-between items-center">
                    <button type="button" onClick={handleBack} className="text-gray-500 hover:text-black text-sm flex items-center gap-1 font-medium transition-colors">
                        ← Back
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-4 rounded-full bg-black text-white font-bold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all"
                    >
                        {loading ? 'Creating Account...' : 'Complete & View Rates'}
                    </button>
                </div>
            </form>

            <p className="text-center text-xs text-gray-400 mt-4">
                By creating an account, you agree to our Terms of Service and Privacy Policy.
            </p>
        </div>
    )
}
