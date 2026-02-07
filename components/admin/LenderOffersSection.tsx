'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LenderOffer, LoanType } from '@/types/database'
import { Plus, Edit2, Trash2, Star, X } from 'lucide-react'

interface LenderOffersSectionProps {
    applicationId: string
    offers: LenderOffer[]
}

const loanTypes: { value: LoanType; label: string }[] = [
    { value: 'conventional', label: 'Conventional' },
    { value: 'fha', label: 'FHA' },
    { value: 'va', label: 'VA' },
    { value: 'jumbo', label: 'Jumbo' },
    { value: 'usda', label: 'USDA' },
]

const loanTerms = [15, 20, 30]

export function LenderOffersSection({ applicationId, offers }: LenderOffersSectionProps) {
    const router = useRouter()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingOffer, setEditingOffer] = useState<LenderOffer | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    // Form state
    const [formData, setFormData] = useState({
        lender_name: '',
        lender_logo: '', // Added logo field
        interest_rate: '',
        apr: '',
        monthly_payment: '',
        loan_term: 30,
        loan_type: 'conventional' as LoanType,
        points: '0',
        closing_costs: '',
        is_recommended: false
    })

    const resetForm = () => {
        setFormData({
            lender_name: '',
            lender_logo: '',
            interest_rate: '',
            apr: '',
            monthly_payment: '',
            loan_term: 30,
            loan_type: 'conventional',
            points: '0',
            closing_costs: '',
            is_recommended: false
        })
        setEditingOffer(null)
    }

    const openAddModal = () => {
        resetForm()
        setIsModalOpen(true)
    }

    const openEditModal = (offer: LenderOffer) => {
        setEditingOffer(offer)
        setFormData({
            lender_name: offer.lender_name,
            lender_logo: offer.lender_logo || '',
            interest_rate: offer.interest_rate.toString(),
            apr: offer.apr?.toString() || '',
            monthly_payment: offer.monthly_payment?.toString() || '',
            loan_term: offer.loan_term || 30,
            loan_type: offer.loan_type || 'conventional',
            points: offer.points?.toString() || '0',
            closing_costs: offer.closing_costs?.toString() || '',
            is_recommended: offer.is_recommended
        })
        setIsModalOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        const payload = {
            lender_name: formData.lender_name,
            lender_logo: formData.lender_logo || null,
            interest_rate: parseFloat(formData.interest_rate),
            apr: formData.apr ? parseFloat(formData.apr) : null,
            monthly_payment: formData.monthly_payment ? parseFloat(formData.monthly_payment) : null,
            loan_term: formData.loan_term,
            loan_type: formData.loan_type,
            points: parseFloat(formData.points || '0'),
            closing_costs: formData.closing_costs ? parseFloat(formData.closing_costs) : null,
            is_recommended: formData.is_recommended
        }

        try {
            const url = editingOffer
                ? `/api/admin/offers/${editingOffer.id}`
                : `/api/admin/applications/${applicationId}/offers`

            const res = await fetch(url, {
                method: editingOffer ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            if (res.ok) {
                setIsModalOpen(false)
                resetForm()
                router.refresh()
            }
        } catch (error) {
            console.error('Error saving offer:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async (offerId: string) => {
        if (!confirm('Are you sure you want to delete this offer?')) return

        try {
            const res = await fetch(`/api/admin/offers/${offerId}`, {
                method: 'DELETE'
            })

            if (res.ok) {
                router.refresh()
            }
        } catch (error) {
            console.error('Error deleting offer:', error)
        }
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Lender Offers</h2>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                >
                    <Plus className="w-4 h-4" />
                    Add Offer
                </button>
            </div>

            {offers.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Lender</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Rate</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">APR</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Monthly</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Term</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Type</th>
                                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {offers.map((offer) => (
                                <tr key={offer.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            {offer.is_recommended && (
                                                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                            )}
                                            <span className="font-medium text-gray-900">{offer.lender_name}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-gray-900 font-medium">{offer.interest_rate}%</td>
                                    <td className="px-4 py-3 text-gray-600">{offer.apr}%</td>
                                    <td className="px-4 py-3 text-gray-900">${offer.monthly_payment?.toLocaleString()}</td>
                                    <td className="px-4 py-3 text-gray-600">{offer.loan_term}yr</td>
                                    <td className="px-4 py-3 text-gray-600 uppercase text-xs">{offer.loan_type}</td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => openEditModal(offer)}
                                                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(offer.id)}
                                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="py-8 text-center">
                    <p className="text-gray-500">No offers added yet</p>
                    <p className="text-gray-400 text-sm mt-1">Click &quot;Add Offer&quot; to enter lender quotes from your pricing engine</p>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                    <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>

                        <h3 className="text-xl font-bold text-gray-900 mb-6">
                            {editingOffer ? 'Edit Offer' : 'Add New Offer'}
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Lender Name */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                                    Lender Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.lender_name}
                                    onChange={(e) => setFormData({ ...formData, lender_name: e.target.value })}
                                    placeholder="e.g., Wells Fargo"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:border-purple-500 focus:bg-white"
                                />
                            </div>

                            {/* Lender Logo URL */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                                    Lender Logo URL (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={formData.lender_logo}
                                    onChange={(e) => setFormData({ ...formData, lender_logo: e.target.value })}
                                    placeholder="https://example.com/logo.png"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:border-purple-500 focus:bg-white"
                                />
                            </div>

                            {/* Rate & APR */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                                        Interest Rate % *
                                    </label>
                                    <input
                                        type="number"
                                        step="0.001"
                                        required
                                        value={formData.interest_rate}
                                        onChange={(e) => setFormData({ ...formData, interest_rate: e.target.value })}
                                        placeholder="6.25"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:border-purple-500 focus:bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                                        APR %
                                    </label>
                                    <input
                                        type="number"
                                        step="0.001"
                                        value={formData.apr}
                                        onChange={(e) => setFormData({ ...formData, apr: e.target.value })}
                                        placeholder="6.45"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:border-purple-500 focus:bg-white"
                                    />
                                </div>
                            </div>

                            {/* Monthly Payment & Points */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                                        Monthly Payment $
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.monthly_payment}
                                        onChange={(e) => setFormData({ ...formData, monthly_payment: e.target.value })}
                                        placeholder="2,771"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:border-purple-500 focus:bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                                        Points
                                    </label>
                                    <input
                                        type="number"
                                        step="0.125"
                                        value={formData.points}
                                        onChange={(e) => setFormData({ ...formData, points: e.target.value })}
                                        placeholder="0"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:border-purple-500 focus:bg-white"
                                    />
                                </div>
                            </div>

                            {/* Term & Type */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                                        Loan Term
                                    </label>
                                    <select
                                        value={formData.loan_term}
                                        onChange={(e) => setFormData({ ...formData, loan_term: parseInt(e.target.value) })}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:border-purple-500 focus:bg-white"
                                    >
                                        {loanTerms.map((term) => (
                                            <option key={term} value={term}>{term} Year</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                                        Loan Type
                                    </label>
                                    <select
                                        value={formData.loan_type}
                                        onChange={(e) => setFormData({ ...formData, loan_type: e.target.value as LoanType })}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:border-purple-500 focus:bg-white"
                                    >
                                        {loanTypes.map((type) => (
                                            <option key={type.value} value={type.value}>{type.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Closing Costs */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                                    Closing Costs $
                                </label>
                                <input
                                    type="number"
                                    value={formData.closing_costs}
                                    onChange={(e) => setFormData({ ...formData, closing_costs: e.target.value })}
                                    placeholder="8,500"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:border-purple-500 focus:bg-white"
                                />
                            </div>

                            {/* Recommended Checkbox */}
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.is_recommended}
                                    onChange={(e) => setFormData({ ...formData, is_recommended: e.target.checked })}
                                    className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                />
                                <span className="text-gray-700">Mark as Recommended ⭐</span>
                            </label>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-6 py-2 rounded-lg bg-black text-white font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
                                >
                                    {isLoading ? 'Saving...' : (editingOffer ? 'Update Offer' : 'Add Offer')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
