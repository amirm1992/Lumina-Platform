import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 text-center">
            <h1 className="text-9xl font-bold text-gray-900 mb-4">404</h1>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h2>
            <p className="text-gray-500 max-w-md mb-8">
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            <Link href="/">
                <button className="px-8 py-4 rounded-full bg-black text-white font-bold hover:bg-gray-800 transition-all shadow-lg">
                    Back to Home
                </button>
            </Link>
        </div>
    )
}
