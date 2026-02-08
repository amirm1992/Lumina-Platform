import { getApplications } from '@/utils/admin/api'
import { ApplicationsTable } from '@/components/admin/ApplicationsTable'
import { ApplicationFilters } from '@/components/admin/ApplicationFilters'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default async function ApplicationsPage({
    searchParams,
}: {
    searchParams: Promise<{
        status?: string
        search?: string
        sort?: string
        order?: string
        offers?: string
    }>
}) {
    const params = await searchParams
    const status = params.status as 'pending' | 'in_review' | 'offers_ready' | 'completed' | undefined
    const applications = await getApplications({
        status,
        search: params.search?.trim() || undefined,
        sortBy: (params.sort as 'created_at' | 'updated_at' | 'status') || 'created_at',
        sortOrder: params.order === 'asc' ? 'asc' : 'desc',
        offersFilter: (params.offers as 'all' | 'incomplete' | 'none') || 'all'
    })

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
                    <p className="text-gray-500 mt-1">View and manage all client applications</p>
                </div>
                <Link
                    href="/admin/applications/new"
                    className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    New Application
                </Link>
            </div>

            {/* Filters */}
            <ApplicationFilters
                currentStatus={status}
                currentSearch={params.search ?? ''}
                currentSort={params.sort ?? 'created_at'}
                currentOrder={params.order ?? 'desc'}
                currentOffersFilter={params.offers ?? 'all'}
            />

            {/* Applications Table */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                {applications.length > 0 ? (
                    <ApplicationsTable applications={applications} />
                ) : (
                    <div className="p-12 text-center">
                        <p className="text-gray-500">No applications found</p>
                        <p className="text-gray-400 text-sm mt-1">
                            {status ? `No ${status.replace('_', ' ')} applications` : 'Applications will appear here when clients submit them'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
