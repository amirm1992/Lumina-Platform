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
        // Log the error to an error reporting service
        console.error('Admin Error:', error)
    }, [error])

    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-4 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong!</h2>
            <p className="text-gray-500 mb-4 bg-gray-100 p-2 rounded text-sm font-mono text-left max-w-lg overflow-auto">
                {error.message || 'Unknown error occurred'}
            </p>
            <button
                onClick={reset}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
                Try again
            </button>
        </div>
    )
}
