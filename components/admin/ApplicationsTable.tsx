import Link from 'next/link'
import { Application } from '@/types/database'
import { StatusBadge } from './StatusBadge'
import { Eye } from 'lucide-react'

interface ApplicationsTableProps {
    applications: Application[]
}

export function ApplicationsTable({ applications }: ApplicationsTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Client
                        </th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Loan Amount
                        </th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Type
                        </th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Credit Score
                        </th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Offers
                        </th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Status
                        </th>
                        <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Date
                        </th>
                        <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {applications.map((app) => {
                        const profile = app.profile as { full_name?: string; email?: string } | undefined
                        return (
                            <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {profile?.full_name || 'N/A'}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {profile?.email || 'No email'}
                                        </p>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="font-medium text-gray-900">
                                        {app.loan_amount
                                            ? `$${app.loan_amount.toLocaleString()}`
                                            : 'N/A'}
                                    </p>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-gray-700 capitalize">
                                        {app.product_type || 'N/A'}
                                    </p>
                                </td>
                                <td className="px-6 py-4">
                                    {app.credit_score ? (
                                        <span className={`font-medium ${app.credit_score >= 740 ? 'text-green-600' :
                                                app.credit_score >= 670 ? 'text-blue-600' :
                                                    app.credit_score >= 580 ? 'text-amber-600' :
                                                        'text-red-600'
                                            }`}>
                                            {app.credit_score}
                                        </span>
                                    ) : (
                                        <span className="text-gray-400">Not entered</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`font-medium ${(app.lender_offers?.length ?? 0) >= 6 ? 'text-green-600' : (app.lender_offers?.length ?? 0) > 0 ? 'text-amber-600' : 'text-gray-500'}`}>
                                        {(app.lender_offers?.length ?? 0)}/6
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <StatusBadge status={app.status} size="sm" />
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-sm text-gray-500">
                                        {new Date(app.created_at).toLocaleDateString()}
                                    </p>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Link
                                        href={`/admin/applications/${app.id}`}
                                        className="inline-flex items-center gap-1 text-purple-600 hover:text-purple-800 font-medium text-sm"
                                    >
                                        <Eye className="w-4 h-4" />
                                        View
                                    </Link>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}
