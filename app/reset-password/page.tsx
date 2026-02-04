'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useSignIn } from '@clerk/nextjs'

export default function ResetPasswordPage() {
    const { signIn, setActive, isLoaded } = useSignIn()
    const router = useRouter()
    const [code, setCode] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!isLoaded || !signIn) return

        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters')
            return
        }

        setIsLoading(true)
        setError('')

        try {
            const result = await signIn.attemptFirstFactor({
                strategy: 'reset_password_email_code',
                code,
                password,
            })

            if (result.status === 'complete') {
                await setActive({ session: result.createdSessionId })
                router.push('/dashboard')
            }
        } catch (err: any) {
            setError(err.errors?.[0]?.message || 'Failed to reset password')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E3A5F] to-[#0F172A] flex flex-col items-center justify-center p-4">
            {/* Back Link */}
            <Link
                href="/forgot-password"
                className="absolute top-6 left-6 text-white/70 hover:text-white text-sm flex items-center gap-2 transition-colors"
            >
                ‹ Back
            </Link>

            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <Link href="/" className="flex items-center gap-2">
                        <Image
                            src="/Lumina.svg"
                            alt="Lumina"
                            width={40}
                            height={40}
                            className="w-10 h-10"
                        />
                        <span className="text-white text-xl font-bold">Lumina</span>
                    </Link>
                </div>

                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    <h1 className="text-2xl font-bold text-[#1E3A5F] text-center mb-2">
                        Set New Password
                    </h1>
                    <p className="text-gray-600 text-center mb-6">
                        Enter the code from your email and your new password
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Reset Code
                            </label>
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="w-full p-3 rounded-lg border border-gray-200 focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none transition-colors"
                                placeholder="Enter code from email"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                New Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 rounded-lg border border-gray-200 focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none transition-colors"
                                placeholder="At least 8 characters"
                                required
                                minLength={8}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full p-3 rounded-lg border border-gray-200 focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] outline-none transition-colors"
                                placeholder="Confirm your new password"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
                        >
                            {isLoading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
