import { getApplicationById, getDocuments } from '@/utils/admin/api'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, User, Home, DollarSign, Briefcase, PiggyBank, CreditCard, FileText } from 'lucide-react'
import { CreditScoreEntry } from '@/components/admin/CreditScoreEntry'
import { LenderOffersSection } from '@/components/admin/LenderOffersSection'
import { ApplicationStatusForm } from '@/components/admin/ApplicationStatusForm'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { PreApprovalUpload } from '@/components/admin/PreApprovalUpload'
import { AdminOfferSlots } from '@/components/admin/AdminOfferSlots'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

interface PageProps {
    params: { id: string }
}

export default async function ApplicationDetailPage({ params }: PageProps) {
    const { id } = params
    const application = await getApplicationById(id)

    if (!application) {
        notFound()
    }

    // Fetch associated documents
    const documents = await getDocuments(id)

    const profile = application.profile as { email?: string; full_name?: string; phone?: string } | undefined

    // Calculate derived values
    const downPayment = application.property_value && application.loan_amount
        ? application.property_value - application.loan_amount
        : null
    const downPaymentPercent = application.property_value && downPayment
        ? ((downPayment / application.property_value) * 100).toFixed(1)
        : null
    const ltvRatio = application.property_value && application.loan_amount
        ? ((application.loan_amount / application.property_value) * 100).toFixed(1)
        : null

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
                            <User className="w-5 h-5 text-[#2563EB]" />
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
                            <Home className="w-5 h-5 text-[#2563EB]" />
                            Property & Loan Details
                        </h2>
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Loan Purpose</p>
                                <p className="text-gray-900 font-medium capitalize">{application.product_type || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Property Type</p>
                                <p className="text-gray-900 capitalize">{application.property_type?.replaceAll('_', ' ').replaceAll('-', ' ') || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Property Usage</p>
                                <p className="text-gray-900 capitalize">{application.property_usage || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Property Location (ZIP)</p>
                                <p className="text-gray-900">{application.zip_code || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Financial Details Card */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-[#2563EB]" />
                            Financial Details
                        </h2>
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Property Value</p>
                                <p className="text-gray-900 font-medium text-lg">
                                    {application.property_value
                                        ? `$${application.property_value.toLocaleString()}`
                                        : 'N/A'}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Loan Amount</p>
                                <p className="text-gray-900 font-medium text-lg">
                                    {application.loan_amount
                                        ? `$${application.loan_amount.toLocaleString()}`
                                        : 'N/A'}
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Down Payment</p>
                                    <p className="text-gray-900 font-medium">
                                        {downPayment !== null
                                            ? `$${downPayment.toLocaleString()}`
                                            : 'N/A'}
                                    </p>
                                    {downPaymentPercent && (
                                        <p className="text-xs text-gray-500">{downPaymentPercent}% down</p>
                                    )}
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">LTV Ratio</p>
                                    <p className="text-gray-900 font-medium">
                                        {ltvRatio ? `${ltvRatio}%` : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Employment & Income Card */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Briefcase className="w-5 h-5 text-[#2563EB]" />
                            Employment & Income
                        </h2>
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Employment Status</p>
                                <p className="text-gray-900 font-medium capitalize">{application.employment_status?.replaceAll('-', ' ') || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Annual Income</p>
                                <p className="text-gray-900 font-medium text-lg">
                                    {application.annual_income
                                        ? `$${application.annual_income.toLocaleString()}`
                                        : 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Assets Card */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <PiggyBank className="w-5 h-5 text-[#2563EB]" />
                            Assets
                        </h2>
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Liquid Assets</p>
                                <p className="text-gray-900 font-medium text-lg">
                                    {application.liquid_assets
                                        ? `$${application.liquid_assets.toLocaleString()}`
                                        : 'N/A'}
                                </p>
                            </div>
                            {application.dti_ratio && (
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">DTI Ratio (Admin)</p>
                                    <p className="text-gray-900 font-medium">{application.dti_ratio}%</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column - Admin Actions */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Pre-Approval / Documents */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-[#2563EB]" />
                            Documents & Pre-Approval
                        </h2>
                        <PreApprovalUpload
                            applicationId={id}
                            userId={application.user_id}
                            documents={documents}
                        />
                    </div>

                    {/* Credit Score Entry */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-[#2563EB]" />
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

                    {/* 6-slot view: one card per lender with Add / Edit */}
                    <AdminOfferSlots
                        applicationId={id}
                        offers={application.lender_offers || []}
                    />

                    {/* Lender Offers table */}
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
