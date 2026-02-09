'use client'

import React, { useState, useCallback } from 'react'
import { FileText, ShieldCheck, CheckCircle2, Clock, AlertCircle } from 'lucide-react'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import { DocumentSlot } from './DocumentSlot'
import { DOCUMENT_SLOTS } from '@/types/database'
import type { Document } from '@/types/database'

interface DocHubClientProps {
    userId: string
    initialDocuments: Document[]
}

export function DocHubClient({ userId, initialDocuments }: DocHubClientProps) {
    const [documents, setDocuments] = useState<Document[]>(initialDocuments)
    const [error, setError] = useState<string | null>(null)

    // Get the latest document for each category (most recent wins)
    const getDocForCategory = useCallback((category: string): Document | null => {
        const matching = documents
            .filter(d => d.category === category)
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        return matching[0] || null
    }, [documents])

    // Stats
    const totalSlots = DOCUMENT_SLOTS.length
    const uploadedCount = DOCUMENT_SLOTS.filter(s => getDocForCategory(s.category)).length
    const approvedCount = DOCUMENT_SLOTS.filter(s => getDocForCategory(s.category)?.status === 'approved').length
    const pendingCount = DOCUMENT_SLOTS.filter(s => getDocForCategory(s.category)?.status === 'pending_review').length
    const rejectedCount = DOCUMENT_SLOTS.filter(s => getDocForCategory(s.category)?.status === 'rejected').length

    const handleUpload = async (category: string, file: File) => {
        setError(null)
        try {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('category', category)

            const res = await fetch('/api/documents/upload', {
                method: 'POST',
                body: formData,
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Upload failed')
            }

            // Refresh documents list
            const listRes = await fetch('/api/documents')
            if (listRes.ok) {
                const data = await listRes.json()
                setDocuments(data.documents)
            }
        } catch (err: any) {
            setError(err.message || 'Failed to upload document')
            console.error('Upload error:', err)
        }
    }

    const handleDownload = async (doc: Document) => {
        try {
            const res = await fetch(`/api/documents/${doc.id}/download`)
            if (!res.ok) throw new Error('Failed to get download URL')
            const data = await res.json()
            window.open(data.url, '_blank')
        } catch (err) {
            console.error('Download error:', err)
            alert('Failed to download document. Please try again.')
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 selection:bg-[#DBEAFE] font-sans text-gray-900">
            <DashboardSidebar />

            <main className="container mx-auto px-6 py-10 pt-20 max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                            <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-black">DocHub</h1>
                            <p className="text-gray-500 text-sm">Secure document portal for your loan application</p>
                        </div>
                    </div>
                </div>

                {/* Progress summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-1">
                            <FileText className="w-4 h-4 text-blue-500" />
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Uploaded</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{uploadedCount}<span className="text-sm font-normal text-gray-400">/{totalSlots}</span></p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-1">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Approved</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{approvedCount}</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-1">
                            <Clock className="w-4 h-4 text-amber-500" />
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Pending</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-1">
                            <AlertCircle className="w-4 h-4 text-red-500" />
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Needs Action</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{rejectedCount}</p>
                    </div>
                </div>

                {/* Error banner */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        {error}
                        <button onClick={() => setError(null)} className="ml-auto text-red-500 hover:text-red-700 font-medium">Dismiss</button>
                    </div>
                )}

                {/* Security notice */}
                <div className="mb-8 flex items-center gap-2 text-xs text-gray-500 bg-white border border-gray-200 rounded-full px-4 py-2 w-fit">
                    <ShieldCheck className="w-4 h-4 text-green-600" />
                    All documents are encrypted and stored securely. Only you and your loan advisor can access them.
                </div>

                {/* Document Slots - Required */}
                <div className="mb-10">
                    <h2 className="text-lg font-bold text-gray-900 mb-1">Required Documents</h2>
                    <p className="text-sm text-gray-500 mb-4">Upload each required document to keep your application moving forward.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {DOCUMENT_SLOTS.filter(s => s.required).map(slot => (
                            <DocumentSlot
                                key={slot.category}
                                slot={slot}
                                document={getDocForCategory(slot.category)}
                                onUpload={handleUpload}
                                onDownload={handleDownload}
                            />
                        ))}
                    </div>
                </div>

                {/* Document Slots - Optional */}
                <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-1">Additional Documents</h2>
                    <p className="text-sm text-gray-500 mb-4">These may be needed depending on your loan type.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {DOCUMENT_SLOTS.filter(s => !s.required).map(slot => (
                            <DocumentSlot
                                key={slot.category}
                                slot={slot}
                                document={getDocForCategory(slot.category)}
                                onUpload={handleUpload}
                                onDownload={handleDownload}
                            />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    )
}
