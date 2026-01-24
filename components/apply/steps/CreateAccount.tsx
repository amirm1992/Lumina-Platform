'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useApplicationStore } from '@/store/applicationStore'
import { createClient } from '@/utils/supabase/client'

export function CreateAccount() {
    const router = useRouter()
    const { email, setEmail, setPassword, completeApplication, prevStep, isCompleted } = useApplicationStore()
    const [localEmail, setLocalEmail] = useState(email)
    const [localPassword, setLocalPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showExistingAccount, setShowExistingAccount] = useState(false)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(isCompleted)

    const supabase = createClient()

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) {
            e.preventDefault()
            e.stopPropagation()
        }
        console.log('handleSubmit called', { email: localEmail, passwordLength: localPassword.length })

        // Validation
        if (!localEmail || !localPassword) {
            console.log('Validation failed: missing fields')
            setError('Please fill in all fields')
            return
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(localEmail)) {
            console.log('Validation failed: invalid email')
            setError('Please enter a valid email address')
            return
        }
        if (localPassword.length < 6) {
            console.log('Validation failed: password too short')
            setError('Password must be at least 6 characters')
            return
        }
        if (localPassword !== confirmPassword) {
            console.log('Validation failed: passwords do not match')
            setError('Passwords do not match')
            return
        }

        setLoading(true)
        setError('')
        setShowExistingAccount(false)

        console.log('Calling supabase.auth.signUp...')
        const { data, error: signUpError } = await supabase.auth.signUp({
            email: localEmail,
            password: localPassword,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        })
        console.log('Supabase response:', { data, error: signUpError })

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
            console.log('User created but requires confirmation (existing user case?)')
            setShowExistingAccount(true)
            setError('An account with this email already exists.')
            setLoading(false)
            return
        }

        // Get full application state to submit
        const applicationState = useApplicationStore.getState()

        console.log('Submitting application to API...')
        // Submit application to database
        try {
            const response = await fetch('/api/applications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productType: applicationState.productType,
                    propertyType: applicationState.propertyType,
                    propertyUsage: applicationState.propertyUsage,
                    zipCode: applicationState.zipCode,
                    estimatedValue: applicationState.estimatedValue,
                    loanAmount: applicationState.loanAmount,
                    firstName: applicationState.firstName,
                    lastName: applicationState.lastName,
                    phone: applicationState.phone,
                    employmentStatus: applicationState.employmentStatus,
                    annualIncome: applicationState.annualIncome,
                    liquidAssets: applicationState.liquidAssets,
                })
            })

            console.log('API Response status:', response.status)
            if (!response.ok) {
                console.error('Failed to submit application')
            }
        } catch (err) {
            console.error('Error submitting application:', err)
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

    if (success || isCompleted) {
        return (
            <div className="space-y-8 text-center py-8">
                {/* Success Icon */}
                <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10 text-green-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>

                {/* Congratulations Header */}
                <div>
                    <h1 className="text-3xl font-bold text-black mb-3">Congratulations! 🎉</h1>
                    <p className="text-xl text-gray-600">Your application has been submitted successfully.</p>
                </div>

                {/* Email Verification Card */}
                <div className="p-6 rounded-2xl bg-purple-50 border border-purple-100 max-w-md mx-auto">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-purple-600">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                        </svg>
                        <h2 className="text-lg font-semibold text-purple-900">Verify Your Email</h2>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        We've sent a verification link to<br />
                        <span className="font-semibold text-purple-700">{localEmail}</span>
                    </p>
                    <p className="text-gray-500 text-sm mt-3">
                        Please check your inbox and click the link to activate your account and view your personalized mortgage rates.
                    </p>
                </div>

                {/* What's Next Section */}
                <div className="max-w-md mx-auto text-left">
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">What happens next?</h3>
                    <div className="space-y-3">
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold shrink-0">1</div>
                            <p className="text-gray-600 text-sm">Click the verification link in your email</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold shrink-0">2</div>
                            <p className="text-gray-600 text-sm">Log in to your secure dashboard</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold shrink-0">3</div>
                            <p className="text-gray-600 text-sm">View your personalized rates from top lenders</p>
                        </div>
                    </div>
                </div>

                {/* Help Text */}
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-500 max-w-md mx-auto">
                    💡 Didn't receive the email? Check your spam folder or wait a few minutes.
                </div>

                {/* Sign In Link */}
                <button
                    onClick={() => router.push('/login')}
                    className="px-8 py-3 rounded-full bg-black text-white font-semibold hover:bg-gray-800 transition-all shadow-md"
                >
                    Already verified? Sign In →
                </button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold mb-2" style={{ color: 'black' }}>Create your dashboard</h1>
                <p className="text-gray-400">Your personalized rates are almost ready.</p>
            </div>

            <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-sm text-purple-300">
                🔒 Your data is encrypted. We are not a lead generator—your info stays with us.
            </div>

            <div className="space-y-4">
                <h1 className="text-3xl font-bold !text-black mb-2">Create your account</h1>
                <p className="text-gray-500">Save your progress and see your rates instantly.</p>
            </div>

            <div className="space-y-4" onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}>
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

                {/* Confirm Password */}
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
                        type="button"
                        onClick={() => handleSubmit()}
                        disabled={loading}
                        className="px-8 py-4 rounded-full bg-black text-white font-bold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all"
                    >
                        {loading ? 'Creating Account...' : 'Complete & View Rates'}
                    </button>
                </div>
            </div>

            <p className="text-center text-xs text-gray-400 mt-4">
                By creating an account, you agree to our Terms of Service and Privacy Policy.
            </p>
        </div>
    )
}
