'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useCallback, useState } from 'react'
import { Search, ArrowDown, ArrowUp } from 'lucide-react'

interface ApplicationFiltersProps {
    currentStatus?: string
    currentSearch?: string
    currentSort?: string
    currentOrder?: string
    currentOffersFilter?: string
}

const statuses = [
    { value: '', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'in_review', label: 'In Review' },
    { value: 'offers_ready', label: 'Offers Ready' },
    { value: 'completed', label: 'Completed' },
]

const sortOptions = [
    { value: 'created_at', label: 'Created' },
    { value: 'updated_at', label: 'Updated' },
    { value: 'status', label: 'Status' },
]

const offersFilters = [
    { value: 'all', label: 'All' },
    { value: 'incomplete', label: 'Incomplete (<6 offers)' },
    { value: 'none', label: 'No offers' },
]

export function ApplicationFilters({
    currentStatus,
    currentSearch = '',
    currentSort = 'created_at',
    currentOrder = 'desc',
    currentOffersFilter = 'all',
}: ApplicationFiltersProps) {
    const searchParams = useSearchParams()
    const [searchInput, setSearchInput] = useState(currentSearch)

    const buildParams = useCallback(
        (updates: Record<string, string | undefined>) => {
            const params = new URLSearchParams(searchParams.toString())
            Object.entries(updates).forEach(([key, value]) => {
                if (value !== undefined && value !== '') {
                    params.set(key, value)
                } else {
                    params.delete(key)
                }
            })
            return params.toString()
        },
        [searchParams]
    )

    const baseHref = '/admin/applications'

    return (
        <div className="space-y-4">
            {/* Status pills */}
            <div className="flex flex-wrap gap-2">
                {statuses.map((status) => {
                    const isActive =
                        currentStatus === status.value || (!currentStatus && status.value === '')
                    const params = buildParams({
                        status: status.value || undefined,
                        search: currentSearch || undefined,
                        sort: currentSort,
                        order: currentOrder,
                        offers: currentOffersFilter !== 'all' ? currentOffersFilter : undefined,
                    })
                    return (
                        <Link
                            key={status.value || 'all'}
                            href={`${baseHref}${params ? `?${params}` : ''}`}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                isActive
                                    ? 'bg-purple-100 text-purple-700'
                                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                            }`}
                        >
                            {status.label}
                        </Link>
                    )
                })}
            </div>

            {/* Search, sort, offers filter row */}
            <div className="flex flex-wrap items-center gap-4">
                <form
                    className="flex gap-2 flex-1 min-w-[200px] max-w-md"
                    onSubmit={(e) => {
                        e.preventDefault()
                        const params = buildParams({
                            status: currentStatus || undefined,
                            search: searchInput.trim() || undefined,
                            sort: currentSort,
                            order: currentOrder,
                            offers: currentOffersFilter !== 'all' ? currentOffersFilter : undefined,
                        })
                        window.location.href = `${baseHref}${params ? `?${params}` : ''}`
                    }}
                >
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="search"
                            placeholder="Search by name, email, or app ID..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors"
                    >
                        Search
                    </button>
                </form>

                <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Sort
                    </span>
                    {sortOptions.map((opt) => {
                        const isActive = currentSort === opt.value
                        const nextOrder =
                            isActive && currentOrder === 'desc' ? 'asc' : 'desc'
                        const params = buildParams({
                            status: currentStatus || undefined,
                            search: currentSearch || undefined,
                            sort: opt.value,
                            order: isActive ? nextOrder : 'desc',
                            offers: currentOffersFilter !== 'all' ? currentOffersFilter : undefined,
                        })
                        return (
                            <Link
                                key={opt.value}
                                href={`${baseHref}?${params}`}
                                className={`inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    isActive
                                        ? 'bg-gray-200 text-gray-900'
                                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                                }`}
                            >
                                {opt.label}
                                {isActive &&
                                    (currentOrder === 'asc' ? (
                                        <ArrowUp className="w-3.5 h-3.5" />
                                    ) : (
                                        <ArrowDown className="w-3.5 h-3.5" />
                                    ))}
                            </Link>
                        )
                    })}
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Offers
                    </span>
                    {offersFilters.map((filter) => {
                        const isActive = currentOffersFilter === filter.value
                        const params = buildParams({
                            status: currentStatus || undefined,
                            search: currentSearch || undefined,
                            sort: currentSort,
                            order: currentOrder,
                            offers: filter.value === 'all' ? undefined : filter.value,
                        })
                        return (
                            <Link
                                key={filter.value}
                                href={`${baseHref}${params ? `?${params}` : ''}`}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    isActive
                                        ? 'bg-amber-100 text-amber-800'
                                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                                }`}
                            >
                                {filter.label}
                            </Link>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
