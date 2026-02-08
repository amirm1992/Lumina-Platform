'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ApplicationStatus } from '@/types/database'

interface ApplicationStatusFormProps {
    applicationId: string
    currentStatus: ApplicationStatus
    currentNotes: string
}

const statuses: { value: ApplicationStatus; label: string; description: string }[] = [
    { value: 'pending', label: '⏳ Pending', description: 'Awaiting review' },
    { value: 'in_review', label: '🔄 In Review', description: 'Currently being processed' },
    { value: 'offers_ready', label: '✅ Offers Ready', description: 'Client can view offers' },
    { value: 'completed', label: '✓ Completed', description: 'Loan closed' },
    { value: 'cancelled', label: '✕ Cancelled', description: 'Application withdrawn' },
]

export function ApplicationStatusForm({
    applicationId,
    currentStatus,
    currentNotes
}: ApplicationStatusFormProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [status, setStatus] = useState<ApplicationStatus>(currentStatus)
    const [notes, setNotes] = useState(currentNotes)
    const [notifyClient, setNotifyClient] = useState(false)
    const [error, setError] = useState('')
    const [saved, setSaved] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')
        setSaved(false)

        try {
            const res = await fetch(`/api/admin/applications/${applicationId}/status`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status,
                    admin_notes: notes,
                    notify_client: notifyClient
                })
            })

            if (res.ok) {
                setSaved(true)
                router.refresh()
            } else {
                const data = await res.json().catch(() => ({}))
                setError(data?.error || `Failed to update status (${res.status})`)
            }
        } catch (error) {
            console.error('Error updating status:', error)
            setError('Network error. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Status Selection */}
            <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                    Application Status
                </label>
                <div className="flex flex-wrap gap-2">
                    {statuses.map((s) => (
                        <button
                            key={s.value}
                            type="button"
                            onClick={() => setStatus(s.value)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${status === s.value
                                    ? 'bg-purple-100 text-purple-700 ring-2 ring-purple-500'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                    {statuses.find(s => s.value === status)?.description}
                </p>
            </div>

            {/* Admin Notes */}
            <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Admin Notes (internal only)
                </label>
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add notes about this application..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:border-purple-500 focus:bg-white transition-all text-gray-900 resize-none"
                />
            </div>

            {/* Notify Client Option */}
            {status === 'offers_ready' && (
                <label className="flex items-center gap-3 cursor-pointer p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <input
                        type="checkbox"
                        checked={notifyClient}
                        onChange={(e) => setNotifyClient(e.target.checked)}
                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                        <span className="text-blue-800 font-medium">Notify client via email</span>
                        <p className="text-blue-600 text-sm">Send an email letting them know offers are ready</p>
                    </div>
                </label>
            )}

            {error && <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>}
            {saved && <p className="text-green-600 text-sm bg-green-50 p-3 rounded-lg border border-green-100">Status updated successfully.</p>}

            <div className="flex items-center gap-4">
                <button
                    type="submit"
                    disabled={isLoading || (status === currentStatus && notes === currentNotes)}
                    className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isLoading ? 'Saving...' : 'Update Status'}
                </button>

                {status !== currentStatus && (
                    <span className="text-sm text-gray-500">
                        Changing from {currentStatus.replaceAll('_', ' ')} → {status.replaceAll('_', ' ')}
                    </span>
                )}
            </div>
        </form>
    )
}
