'use client'

import { useEffect } from 'react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Something went wrong!</h1>
            <p className="text-gray-500 max-w-md mb-8">
                We apologize for the inconvenience. A critical error has occurred.
            </p>
            <button
                onClick={reset}
                className="px-8 py-4 rounded-full bg-black text-white font-bold hover:bg-gray-800 transition-all shadow-lg"
            >
                Try again
            </button>
        </div>
    )
}
