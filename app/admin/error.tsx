'use client'

import { useEffect } from 'react'

export default function AdminError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log to error reporting service in production
        console.error('Admin Error:', error)
    }, [error])

    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-4 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-gray-500 mb-4 text-sm max-w-md">
                An unexpected error occurred. Please try again or contact support if the problem persists.
            </p>
            {error.digest && (
                <p className="text-gray-400 mb-4 text-xs font-mono">
                    Error ID: {error.digest}
                </p>
            )}
            <button
                onClick={reset}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
            >
                Try again
            </button>
        </div>
    )
}
