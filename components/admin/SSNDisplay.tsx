'use client'

import { useState } from 'react'
import { Eye, EyeOff, Shield, ShieldOff } from 'lucide-react'

interface SSNDisplayProps {
    applicationId: string
    hasSSN: boolean
    hasConsent: boolean
}

export function SSNDisplay({ applicationId, hasSSN, hasConsent }: SSNDisplayProps) {
    const [ssn, setSsn] = useState<string | null>(null)
    const [revealed, setRevealed] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const fetchSSN = async () => {
        setLoading(true)
        setError('')
        try {
            const res = await fetch(`/api/admin/applications/${applicationId}/ssn`)
            const data = await res.json()
            if (!res.ok) throw new Error(data?.error || 'Failed to retrieve SSN')
            setSsn(data.ssn)
            setRevealed(true)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to retrieve SSN')
        } finally {
            setLoading(false)
        }
    }

    const formatSSN = (raw: string) => {
        return `${raw.slice(0, 3)}-${raw.slice(3, 5)}-${raw.slice(5, 9)}`
    }

    const maskSSN = (raw: string) => {
        return `•••-••-${raw.slice(5, 9)}`
    }

    if (!hasSSN) {
        return (
            <div className="flex items-center gap-2 text-gray-400">
                <ShieldOff className="w-4 h-4" />
                <span className="text-sm">Not provided</span>
            </div>
        )
    }

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                {ssn ? (
                    <>
                        <code className="text-gray-900 font-mono text-base tracking-wider bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                            {revealed ? formatSSN(ssn) : maskSSN(ssn)}
                        </code>
                        <button
                            type="button"
                            onClick={() => setRevealed(!revealed)}
                            className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors rounded-md hover:bg-gray-100"
                            title={revealed ? 'Hide SSN' : 'Show SSN'}
                        >
                            {revealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </>
                ) : (
                    <button
                        type="button"
                        onClick={fetchSSN}
                        disabled={loading}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        <Eye className="w-4 h-4" />
                        {loading ? 'Retrieving...' : 'View SSN'}
                    </button>
                )}
            </div>
            {hasConsent && (
                <div className="flex items-center gap-1.5 text-xs text-green-600">
                    <Shield className="w-3.5 h-3.5" />
                    Soft pull authorized by applicant
                </div>
            )}
            {error && (
                <p className="text-red-500 text-xs">{error}</p>
            )}
        </div>
    )
}
