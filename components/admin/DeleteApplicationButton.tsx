'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'

interface DeleteApplicationButtonProps {
    applicationId: string
    applicationLabel?: string
    /** 'icon' = small icon button for tables, 'full' = full button with text for detail pages */
    variant?: 'icon' | 'full'
}

export function DeleteApplicationButton({
    applicationId,
    applicationLabel,
    variant = 'full',
}: DeleteApplicationButtonProps) {
    const router = useRouter()
    const [showConfirm, setShowConfirm] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [error, setError] = useState('')

    const handleDelete = async () => {
        setDeleting(true)
        setError('')

        try {
            const res = await fetch(`/api/admin/applications/${applicationId}`, {
                method: 'DELETE',
            })

            if (!res.ok) {
                const data = await res.json().catch(() => ({}))
                throw new Error(data?.error || 'Failed to delete application')
            }

            // Navigate back to applications list
            router.push('/admin/applications')
            router.refresh()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete')
            setDeleting(false)
        }
    }

    return (
        <>
            {variant === 'icon' ? (
                <button
                    type="button"
                    onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setShowConfirm(true)
                    }}
                    className="inline-flex items-center gap-1 text-red-500 hover:text-red-700 font-medium text-sm transition-colors"
                    title="Delete application"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            ) : (
                <button
                    type="button"
                    onClick={() => setShowConfirm(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-medium text-sm transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                    Delete Application
                </button>
            )}

            {/* Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div
                        className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 max-w-md w-full mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                                <Trash2 className="w-5 h-5 text-red-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Delete Application</h3>
                        </div>

                        <p className="text-gray-600 text-sm mb-2">
                            Are you sure you want to delete this application
                            {applicationLabel ? ` (${applicationLabel})` : ''}?
                        </p>
                        <p className="text-gray-500 text-xs mb-6">
                            This will permanently remove the application and all associated lender offers. This action cannot be undone.
                        </p>

                        {error && (
                            <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-100 mb-4">
                                {error}
                            </p>
                        )}

                        <div className="flex gap-3 justify-end">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowConfirm(false)
                                    setError('')
                                }}
                                disabled={deleting}
                                className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium text-sm transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={deleting}
                                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 font-medium text-sm transition-colors disabled:opacity-50"
                            >
                                {deleting ? 'Deleting...' : 'Yes, Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
