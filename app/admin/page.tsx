import { getAdminDashboardStats, getApplications } from '@/utils/admin/api'
import { StatsCard } from '@/components/admin/StatsCard'
import { ApplicationsTable } from '@/components/admin/ApplicationsTable'
import { ClipboardList, Clock, CheckCircle, TrendingUp } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
    let stats
    let recentApplications
    try {
        stats = await getAdminDashboardStats()
        recentApplications = await getApplications()
    } catch (error) {
        console.error('Admin dashboard error:', error)
        stats = { total_applications: 0, pending_count: 0, offers_ready_count: 0, completed_today: 0, in_review_count: 0 }
        recentApplications = []
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-500 mt-1">Manage applications and lender offers</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Applications"
                    value={stats.total_applications}
                    icon={ClipboardList}
                    trend=""
                />
                <StatsCard
                    title="Pending Review"
                    value={stats.pending_count}
                    icon={Clock}
                    variant="warning"
                />
                <StatsCard
                    title="Offers Ready"
                    value={stats.offers_ready_count}
                    icon={CheckCircle}
                    variant="success"
                />
                <StatsCard
                    title="Completed Today"
                    value={stats.completed_today}
                    icon={TrendingUp}
                    variant="info"
                />
            </div>

            {/* Recent Applications */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">Recent Applications</h2>
                    <p className="text-gray-500 text-sm mt-1">Click on an application to view details and add offers</p>
                </div>
                <ApplicationsTable applications={recentApplications.slice(0, 10)} />
            </div>
        </div>
    )
}
