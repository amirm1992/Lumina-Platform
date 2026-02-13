'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSignUp, useUser, useClerk } from '@clerk/nextjs'
import { useApplicationStore } from '@/store/applicationStore'
import { trackStepComplete, trackApplicationSubmitted } from '@/lib/analytics'

export function CreateAccount() {
    const router = useRouter()
    const { isLoaded, signUp, setActive } = useSignUp()
    const { user, isSignedIn, isLoaded: isUserLoaded } = useUser()
    const { signOut } = useClerk()
    const { email, setEmail, completeApplication, prevStep, isCompleted } = useApplicationStore()

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

    // ── Shared helper: save application to DB with retry ──
    const saveApplication = async (emailToUse: string): Promise<string | null> => {
        const applicationState = useApplicationStore.getState()
        const payload = {
            email: emailToUse,
            productType: applicationState.productType,
            propertyType: applicationState.propertyType,
            propertyUsage: applicationState.propertyUsage,
            propertyState: applicationState.propertyState,
            zipCode: applicationState.zipCode,
            estimatedValue: applicationState.estimatedValue,
            loanAmount: applicationState.loanAmount,
            firstName: applicationState.firstName,
            lastName: applicationState.lastName,
            phone: applicationState.phone || '',
            employmentStatus: applicationState.employmentStatus,
            annualIncome: applicationState.annualIncome,
            liquidAssets: applicationState.liquidAssets,
            creditScore: applicationState.creditScore,
            ssn: applicationState.ssn || undefined,
            consentSoftPull: applicationState.consentSoftPull || false,
            consentSignedAt: applicationState.consentSignedAt || undefined,
            consentSignedName: applicationState.consentSignedName || undefined,
        }

        // Debug: log what we're sending so we can trace issues
        console.log('[saveApplication] payload:', JSON.stringify(payload, null, 2))

        let lastError: string | null = null
        // Retry up to 5 times with increasing delays to handle session propagation
        const delays = [600, 1000, 1500, 2000, 3000]
        for (let attempt = 0; attempt < delays.length; attempt++) {
            try {
                console.log(`[saveApplication] attempt ${attempt + 1}/${delays.length}`)
                const response = await fetch('/api/applications', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                })
                if (response.ok) {
                    console.log('[saveApplication] success')
                    return null // success
                }
                const data = await response.json().catch(() => ({}))
                lastError = data?.error || `Request failed (${response.status})`
                console.error(`[saveApplication] attempt ${attempt + 1} failed: ${response.status}`, data)
                // Retry on 401 (session not yet propagated) — wait with increasing delay
                if (response.status === 401 && attempt < delays.length - 1) {
                    await new Promise((r) => setTimeout(r, delays[attempt]))
                    continue
                }
                break
            } catch (err) {
                lastError = err instanceof Error ? err.message : 'Network error'
                console.error(`[saveApplication] attempt ${attempt + 1} network error:`, err)
                // Also retry on network errors (session middleware may not be ready)
                if (attempt < delays.length - 1) {
                    await new Promise((r) => setTimeout(r, delays[attempt]))
                    continue
                }
            }
        }
        return lastError
    }

    // ── Shared helper: finalize after successful save ──
    const finalizeSuccess = () => {
        setEmail(localEmail)
        completeApplication()
        trackStepComplete(12)
        trackApplicationSubmitted('new_account')
        setSuccess(true)
        setLoading(false)
    }

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
        if (localPassword.length < 8) {
            setError('Password must be at least 8 characters')
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
            // Create user in Clerk
            const result = await signUp.create({
                emailAddress: localEmail,
                password: localPassword,
            })

            // ── Branch based on sign-up status ──
            if (result.status === 'complete') {
                // Email verification is NOT required — sign-up already done
                // Activate the session immediately
                await setActive({ session: result.createdSessionId })

                // Wait for the session cookie to propagate before making API calls
                await new Promise((r) => setTimeout(r, 1000))

                // Save application to DB
                const saveError = await saveApplication(localEmail)
                if (saveError) {
                    setError(`We couldn't save your application. Please try again from your dashboard. (${saveError})`)
                    setLoading(false)
                    return
                }

                finalizeSuccess()
                return
            }

            // Email verification IS required — send code
            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
            setPendingVerification(true)
            setLoading(false)

        } catch (err: unknown) {
            const clerkErr = err as { errors?: Array<{ code?: string; message?: string }>; message?: string }
            const clerkError = clerkErr?.errors?.[0]
            const code = clerkError?.code
            const message = clerkError?.message || clerkErr?.message || ''

            if (code === 'form_identifier_exists') {
                setShowExistingAccount(true)
                setError('An account with this email already exists.')
            } else {
                setError(message || 'Something went wrong. Please try again.')
            }
            setLoading(false)
        }
    }

    const handleVerification = async () => {
        if (!isLoaded || !verificationCode) return

        setLoading(true)
        setError('')

        try {
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

            // Wait for the session cookie to propagate before making API calls
            await new Promise((r) => setTimeout(r, 1000))

            // Save application to DB
            const saveError = await saveApplication(localEmail)
            if (saveError) {
                setError(`We couldn't save your application. Please try again from your dashboard. (${saveError})`)
                setLoading(false)
                return
            }

            finalizeSuccess()

        } catch (err: unknown) {
            const clerkErr = err as { errors?: Array<{ message?: string }>; message?: string }
            setError(clerkErr?.errors?.[0]?.message || 'Invalid verification code')
            setLoading(false)
        }
    }

    const handleContinueWithCurrentAccount = async () => {
        if (!user) return
        setLoading(true)
        setError('')

        try {
            const userEmail = user.primaryEmailAddress?.emailAddress || email
            const saveError = await saveApplication(userEmail)
            if (saveError) {
                // If the error is about a duplicate/conflict, provide a clearer message
                if (saveError.includes('already exists') || saveError.includes('409')) {
                    throw new Error('An application may already exist for this account. Please check your dashboard.')
                }
                throw new Error(saveError)
            }

            setLocalEmail(userEmail)
            setEmail(userEmail)
            completeApplication()
            trackStepComplete(12)
            trackApplicationSubmitted('existing_account')
            setSuccess(true)
            setLoading(false)

        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to submit application.'
            setError(message)
            setLoading(false)
        }
    }

    const handleBack = () => {
        prevStep()
        router.push('/apply/step/11')
    }

    // Existing User State
    if (isUserLoaded && isSignedIn && user) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-black mb-2">You are already signed in</h1>
                    <p className="text-gray-600">
                        You are currently signed in as <span className="font-semibold text-[#1D4ED8]">{user.primaryEmailAddress?.emailAddress}</span>.
                    </p>
                </div>

                <div className="p-4 rounded-xl bg-[#EFF6FF] border border-[#DBEAFE] text-sm text-[#1D4ED8]">
                    ℹ️ Do you want to submit this application with your existing account?
                </div>

                {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>}

                <div className="pt-4 flex flex-col gap-3">
                    <button
                        type="button"
                        onClick={() => handleContinueWithCurrentAccount()}
                        disabled={loading}
                        className="w-full px-8 py-4 rounded-full bg-black text-white font-bold hover:bg-gray-800 disabled:opacity-50 shadow-md transition-all"
                    >
                        {loading ? 'Submitting Application...' : 'Yes, Submit Application'}
                    </button>

                    {error && (
                        <button
                            type="button"
                            onClick={() => router.push('/dashboard')}
                            className="w-full px-8 py-4 rounded-full bg-[#1D4ED8] text-white font-semibold hover:bg-[#1e40af] transition-all"
                        >
                            Go to Dashboard
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={() => signOut(() => window.location.reload())}
                        className="w-full px-8 py-4 rounded-full bg-white border border-gray-200 text-black font-semibold hover:bg-gray-50 transition-all"
                    >
                        Sign out and create new account
                    </button>
                </div>
            </div>
        )
    }

    // Success state
    if (success || isCompleted) {
        return (
            <div className="space-y-8 text-center py-8">
                {/* Animated checkmark icon */}
                <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10 text-green-600">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>

                <div>
                    <h1 className="text-3xl font-bold text-black mb-3">Congratulations!</h1>
                    <p className="text-xl text-gray-600 mb-2">Your application has been submitted successfully.</p>
                    <p className="text-gray-500">Your personalized savings are being calculated. We&apos;ll have your rates ready shortly.</p>
                </div>

                {/* Email confirmation notice */}
                <div className="p-5 rounded-xl bg-[#EFF6FF] border border-[#DBEAFE]">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-[#1D4ED8]">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                        </svg>
                        <span className="font-semibold text-[#1D4ED8]">Check your inbox</span>
                    </div>
                    <p className="text-sm text-[#1D4ED8]/80">
                        We&apos;ve sent a confirmation email to <span className="font-semibold">{localEmail || email}</span>.
                        Please verify your email to access your dashboard and view your rates.
                    </p>
                </div>

                <div className="flex flex-col gap-3 pt-2">
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="w-full px-8 py-4 rounded-full bg-black text-white font-bold hover:bg-gray-800 transition-all shadow-md"
                    >
                        Go to My Dashboard
                    </button>
                    <p className="text-xs text-gray-400">
                        Didn&apos;t receive the email? Check your spam folder or contact us at support@golumina.net
                    </p>
                </div>
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
                        {loading ? 'Verifying & Submitting...' : 'Verify & Submit Application'}
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
