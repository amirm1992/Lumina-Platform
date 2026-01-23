'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface ApplicationFiltersProps {
    currentStatus?: string
}

const statuses = [
    { value: '', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'in_review', label: 'In Review' },
    { value: 'offers_ready', label: 'Offers Ready' },
    { value: 'completed', label: 'Completed' },
]

export function ApplicationFilters({ currentStatus }: ApplicationFiltersProps) {
    const searchParams = useSearchParams()

    return (
        <div className="flex gap-2">
            {statuses.map((status) => {
                const isActive = currentStatus === status.value ||
                    (!currentStatus && status.value === '')

                const params = new URLSearchParams(searchParams.toString())
                if (status.value) {
                    params.set('status', status.value)
                } else {
                    params.delete('status')
                }

                return (
                    <Link
                        key={status.value}
                        href={`/admin/applications${params.toString() ? `?${params.toString()}` : ''}`}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                            }`}
                    >
                        {status.label}
                    </Link>
                )
            })}
        </div>
    )
}
