'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CreditScoreSource } from '@/types/database'

interface CreditScoreEntryProps {
    applicationId: string
    initialData?: {
        credit_score?: number
        credit_score_source?: CreditScoreSource
        credit_score_date?: string
        credit_notes?: string
    }
}

const creditSources: { value: CreditScoreSource; label: string }[] = [
    { value: 'experian', label: 'Experian' },
    { value: 'equifax', label: 'Equifax' },
    { value: 'transunion', label: 'TransUnion' },
    { value: 'tri_merge', label: 'Tri-Merge' },
]

export function CreditScoreEntry({ applicationId, initialData }: CreditScoreEntryProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [score, setScore] = useState(initialData?.credit_score?.toString() || '')
    const [source, setSource] = useState<CreditScoreSource>(initialData?.credit_score_source || 'experian')
    const [date, setDate] = useState(initialData?.credit_score_date || new Date().toISOString().split('T')[0])
    const [notes, setNotes] = useState(initialData?.credit_notes || '')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const res = await fetch(`/api/admin/applications/${applicationId}/credit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    credit_score: parseInt(score),
                    credit_score_source: source,
                    credit_score_date: date,
                    credit_notes: notes
                })
            })

            if (res.ok) {
                router.refresh()
            }
        } catch (error) {
            console.error('Error saving credit score:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const getScoreColor = (scoreValue: number) => {
        if (scoreValue >= 740) return 'text-green-600'
        if (scoreValue >= 670) return 'text-blue-600'
        if (scoreValue >= 580) return 'text-amber-600'
        return 'text-red-600'
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Score */}
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Credit Score
                    </label>
                    <input
                        type="number"
                        min="300"
                        max="850"
                        value={score}
                        onChange={(e) => setScore(e.target.value)}
                        placeholder="720"
                        className={`w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:border-purple-500 focus:bg-white transition-all ${score ? getScoreColor(parseInt(score)) : 'text-gray-900'
                            } font-semibold text-lg`}
                    />
                </div>

                {/* Source */}
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Source
                    </label>
                    <select
                        value={source}
                        onChange={(e) => setSource(e.target.value as CreditScoreSource)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:border-purple-500 focus:bg-white transition-all text-gray-900"
                    >
                        {creditSources.map((s) => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                    </select>
                </div>

                {/* Date */}
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Pull Date
                    </label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:border-purple-500 focus:bg-white transition-all text-gray-900"
                    />
                </div>
            </div>

            {/* Notes */}
            <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Notes (optional)
                </label>
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any relevant credit notes..."
                    rows={2}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:border-purple-500 focus:bg-white transition-all text-gray-900 resize-none"
                />
            </div>

            <button
                type="submit"
                disabled={isLoading || !score}
                className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                {isLoading ? 'Saving...' : 'Save Credit Score'}
            </button>
        </form>
    )
}
