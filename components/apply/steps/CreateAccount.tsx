'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSignUp } from '@clerk/nextjs'
import { useApplicationStore } from '@/store/applicationStore'

export function CreateAccount() {
    const router = useRouter()
    const { isLoaded, signUp, setActive } = useSignUp()
    const { email, setEmail, setPassword, completeApplication, prevStep, isCompleted } = useApplicationStore()

    const [localEmail, setLocalEmail] = useState(email)
    const [localPassword, setLocalPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showExistingAccount, setShowExistingAccount] = useState(false)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(isCompleted)
    const [pendingVerification, setPendingVerification] = useState(false)
    const [verificationCode, setVerificationCode] = useState('')

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) {
            e.preventDefault()
            e.stopPropagation()
        }

        if (!isLoaded) return

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

        try {
            // Start sign up with Clerk
            await signUp.create({
                emailAddress: localEmail,
                password: localPassword,
            })

            // Send email verification code
            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

            // Move to verification step
            setPendingVerification(true)
            setLoading(false)

        } catch (err: any) {
            console.error('Sign up error:', err)

            // Handle specific Clerk errors
            if (err.errors?.[0]?.code === 'form_identifier_exists') {
                setShowExistingAccount(true)
                setError('An account with this email already exists.')
            } else {
                setError(err.errors?.[0]?.message || 'Something went wrong. Please try again.')
            }
            setLoading(false)
        }
    }

    const handleVerification = async () => {
        if (!isLoaded || !verificationCode) return

        setLoading(true)
        setError('')

        try {
            // Verify the email code
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code: verificationCode,
            })

            if (completeSignUp.status !== 'complete') {
                setError('Verification failed. Please try again.')
                setLoading(false)
                return
            }

            // Set the session as active
            await setActive({ session: completeSignUp.createdSessionId })

            // Get full application state to submit
            const applicationState = useApplicationStore.getState()

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

            // Redirect to dashboard
            router.push('/dashboard')

        } catch (err: any) {
            console.error('Verification error:', err)
            setError(err.errors?.[0]?.message || 'Invalid verification code')
            setLoading(false)
        }
    }

    const handleBack = () => {
        prevStep()
        router.push('/apply/step/11')
    }

    // Success state
    if (success || isCompleted) {
        return (
            <div className="space-y-8 text-center py-8">
                <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10 text-green-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-black mb-3">Congratulations! 🎉</h1>
                    <p className="text-xl text-gray-600">Your application has been submitted successfully.</p>
                </div>
                <button
                    onClick={() => router.push('/dashboard')}
                    className="px-8 py-3 rounded-full bg-black text-white font-semibold hover:bg-gray-800 transition-all shadow-md"
                >
                    View Your Dashboard →
                </button>
            </div>
        )
    }

    // Verification step
    if (pendingVerification) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-black mb-2">Check your email</h1>
                    <p className="text-gray-600">
                        We've sent a 6-digit verification code to <span className="font-semibold text-[#1D4ED8]">{localEmail}</span>
                    </p>
                </div>

                <div className="p-4 rounded-xl bg-[#EFF6FF] border border-[#DBEAFE] text-sm text-[#1D4ED8]">
                    📧 Can't find it? Check your spam folder.
                </div>

                <div>
                    <label className="block text-sm text-gray-500 mb-2">Verification Code</label>
                    <input
                        type="text"
                        value={verificationCode}
                        onChange={(e) => { setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6)); setError('') }}
                        placeholder="000000"
                        className="w-full p-4 rounded-xl bg-white border border-gray-200 text-black placeholder:text-gray-400 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all shadow-sm text-2xl text-center tracking-[0.5em]"
                        maxLength={6}
                    />
                </div>

                {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>}

                <div className="pt-4 flex justify-between items-center">
                    <button
                        type="button"
                        onClick={() => setPendingVerification(false)}
                        className="text-gray-500 hover:text-black text-sm flex items-center gap-1 font-medium transition-colors"
                    >
                        ← Back
                    </button>
                    <button
                        type="button"
                        onClick={handleVerification}
                        disabled={loading || verificationCode.length !== 6}
                        className="px-8 py-4 rounded-full bg-black text-white font-bold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all"
                    >
                        {loading ? 'Verifying...' : 'Verify & Continue'}
                    </button>
                </div>
            </div>
        )
    }

    // Main form
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-black mb-2">Create your dashboard</h1>
                <p className="text-gray-600">Your personalized rates are almost ready. Create an account to save your progress.</p>
            </div>

            <div className="p-4 rounded-xl bg-[#EFF6FF] border border-[#DBEAFE] text-sm text-[#1D4ED8]">
                🔒 Your data is encrypted. We are not a lead generator—your info stays with us.
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
                        className="w-full p-4 rounded-xl bg-white border border-gray-200 text-black placeholder:text-gray-400 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all shadow-sm"
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
                            className="w-full p-4 rounded-xl bg-white border border-gray-200 text-black placeholder:text-gray-400 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all shadow-sm"
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
                        className="w-full p-4 rounded-xl bg-white border border-gray-200 text-black placeholder:text-gray-400 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all shadow-sm"
                    />
                </div>

                {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>}

                {showExistingAccount && (
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-sm">
                        <p className="text-amber-800 mb-2">Already have an account?</p>
                        <button
                            onClick={() => router.push('/login')}
                            className="text-[#2563EB] font-semibold hover:underline"
                        >
                            Sign in instead →
                        </button>
                    </div>
                )}

                <div className="pt-4 flex justify-between items-center">
                    <button type="button" onClick={handleBack} className="text-gray-500 hover:text-black text-sm flex items-center gap-1 font-medium transition-colors">
                        ← Back
                    </button>
                    <button
                        type="button"
                        onClick={() => handleSubmit()}
                        disabled={loading || !isLoaded}
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
