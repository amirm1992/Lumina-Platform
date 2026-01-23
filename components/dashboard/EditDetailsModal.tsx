'use client'

import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'

interface EditDetailsModalProps {
    isOpen: boolean
    onClose: () => void
    currentValues: {
        homeValue: number
        loanAmount: number
        downPayment: number
    }
    onSave: (values: { homeValue: number; loanAmount: number; downPayment: number }) => void
}

export function EditDetailsModal({ isOpen, onClose, currentValues, onSave }: EditDetailsModalProps) {
    const [formData, setFormData] = useState(currentValues)

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            setFormData(currentValues)
        }
    }, [isOpen, currentValues])

    if (!isOpen) return null

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSave(formData)
        onClose()
    }

    const handleChange = (field: keyof typeof formData, value: string) => {
        const numValue = parseInt(value.replace(/[^0-9]/g, '')) || 0
        setFormData(prev => ({
            ...prev,
            [field]: numValue
        }))
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-md bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50">
                    <h2 className="text-xl font-bold text-black">Edit Loan Details</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-200 text-gray-500 hover:text-black transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                            Home Value
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
                            <input
                                type="text"
                                value={formData.homeValue.toLocaleString()}
                                onChange={(e) => handleChange('homeValue', e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 pl-8 py-3 text-black font-bold text-lg focus:outline-none focus:border-purple-500 focus:bg-white transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                            Loan Amount
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
                            <input
                                type="text"
                                value={formData.loanAmount.toLocaleString()}
                                onChange={(e) => handleChange('loanAmount', e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 pl-8 py-3 text-black font-bold text-lg focus:outline-none focus:border-purple-500 focus:bg-white transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                            Down Payment
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
                            <input
                                type="text"
                                value={formData.downPayment.toLocaleString()}
                                onChange={(e) => handleChange('downPayment', e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 pl-8 py-3 text-black font-bold text-lg focus:outline-none focus:border-purple-500 focus:bg-white transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 rounded-xl font-bold text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all border border-transparent"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-3 rounded-xl font-bold text-sm bg-black text-white hover:bg-gray-800 shadow-lg shadow-black/10 transition-all"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
