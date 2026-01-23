import { getApplicationById } from '@/utils/admin/api'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, User, Home, DollarSign, Calendar } from 'lucide-react'
import { CreditScoreEntry } from '@/components/admin/CreditScoreEntry'
import { LenderOffersSection } from '@/components/admin/LenderOffersSection'
import { ApplicationStatusForm } from '@/components/admin/ApplicationStatusForm'
import { StatusBadge } from '@/components/admin/StatusBadge'

export default async function ApplicationDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const application = await getApplicationById(id)

    if (!application) {
        notFound()
    }

    const profile = application.profile as { email?: string; full_name?: string; phone?: string } | undefined

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/applications"
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-gray-900">
                                Application #{id.slice(0, 8)}
                            </h1>
                            <StatusBadge status={application.status} />
                        </div>
                        <p className="text-gray-500 text-sm mt-1">
                            Submitted {new Date(application.created_at).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Client Info & Loan Details */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Client Info Card */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-purple-600" />
                            Client Information
                        </h2>
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Name</p>
                                <p className="text-gray-900 font-medium">{profile?.full_name || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                                <p className="text-gray-900">{profile?.email || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Phone</p>
                                <p className="text-gray-900">{profile?.phone || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Loan Details Card */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Home className="w-5 h-5 text-purple-600" />
                            Loan Details
                        </h2>
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Purpose</p>
                                <p className="text-gray-900 font-medium capitalize">{application.product_type || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Property Type</p>
                                <p className="text-gray-900 capitalize">{application.property_type?.replace('_', ' ') || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Property Usage</p>
                                <p className="text-gray-900 capitalize">{application.property_usage || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">ZIP Code</p>
                                <p className="text-gray-900">{application.zip_code || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Financial Details Card */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-purple-600" />
                            Financial Details
                        </h2>
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Property Value</p>
                                <p className="text-gray-900 font-medium">
                                    {application.property_value
                                        ? `$${application.property_value.toLocaleString()}`
                                        : 'N/A'}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Loan Amount</p>
                                <p className="text-gray-900 font-medium">
                                    {application.loan_amount
                                        ? `$${application.loan_amount.toLocaleString()}`
                                        : 'N/A'}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">LTV Ratio</p>
                                <p className="text-gray-900">
                                    {application.property_value && application.loan_amount
                                        ? `${((application.loan_amount / application.property_value) * 100).toFixed(1)}%`
                                        : 'N/A'}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Annual Income</p>
                                <p className="text-gray-900">
                                    {application.annual_income
                                        ? `$${application.annual_income.toLocaleString()}`
                                        : 'N/A'}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Employment</p>
                                <p className="text-gray-900 capitalize">{application.employment_status || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Admin Actions */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Credit Score Entry */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-purple-600" />
                            Credit Score
                        </h2>
                        <CreditScoreEntry
                            applicationId={id}
                            initialData={{
                                credit_score: application.credit_score || undefined,
                                credit_score_source: application.credit_score_source || undefined,
                                credit_score_date: application.credit_score_date || undefined,
                                credit_notes: application.credit_notes || undefined
                            }}
                        />
                    </div>

                    {/* Lender Offers */}
                    <LenderOffersSection
                        applicationId={id}
                        offers={application.lender_offers || []}
                    />

                    {/* Status & Notes */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Status & Notes</h2>
                        <ApplicationStatusForm
                            applicationId={id}
                            currentStatus={application.status}
                            currentNotes={application.admin_notes || ''}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
