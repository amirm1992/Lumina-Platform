'use client'

import React, { useState, useRef } from 'react'
import {
    Upload, FileText, Download, Trash2, CheckCircle2, XCircle,
    Clock, AlertCircle, ShieldCheck, User, MessageSquare, ChevronDown
} from 'lucide-react'
import { DOCUMENT_SLOTS } from '@/types/database'
import type { Document, DocumentCategory, DocumentSlotDef } from '@/types/database'

interface DocumentsSectionProps {
    applicationId: string
    userId: string
    initialDocuments: Document[]
}

const statusColors: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
    approved: { bg: 'bg-green-50', text: 'text-green-700', icon: CheckCircle2 },
    pending_review: { bg: 'bg-amber-50', text: 'text-amber-700', icon: Clock },
    rejected: { bg: 'bg-red-50', text: 'text-red-700', icon: AlertCircle },
}

export function DocumentsSection({ applicationId, userId, initialDocuments }: DocumentsSectionProps) {
    const [documents, setDocuments] = useState<Document[]>(initialDocuments)
    const [uploadingCategory, setUploadingCategory] = useState<string | null>(null)
    const [reviewingDocId, setReviewingDocId] = useState<string | null>(null)
    const [reviewNotes, setReviewNotes] = useState('')
    const [error, setError] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const uploadCategoryRef = useRef<string>('')

    const getDocForCategory = (category: string): Document | null => {
        const matching = documents
            .filter(d => d.category === category)
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        return matching[0] || null
    }

    // Stats
    const uploadedCount = DOCUMENT_SLOTS.filter(s => getDocForCategory(s.category)).length
    const totalSlots = DOCUMENT_SLOTS.length

    const refreshDocuments = async () => {
        try {
            const res = await fetch(`/api/admin/documents?userId=${userId}`)
            if (res.ok) {
                const data = await res.json()
                setDocuments(data.documents)
            }
        } catch (err) {
            console.error('Failed to refresh documents:', err)
        }
    }

    // Admin upload on behalf of client
    const handleAdminUpload = async (category: string, file: File) => {
        setError(null)
        setUploadingCategory(category)
        try {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('userId', userId)
            formData.append('category', category)
            formData.append('applicationId', applicationId)

            const res = await fetch('/api/admin/documents/upload', {
                method: 'POST',
                body: formData,
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Upload failed')
            }

            await refreshDocuments()
        } catch (err: any) {
            setError(err.message || 'Failed to upload document')
        } finally {
            setUploadingCategory(null)
        }
    }

    const triggerUpload = (category: string) => {
        uploadCategoryRef.current = category
        fileInputRef.current?.click()
    }

    const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        await handleAdminUpload(uploadCategoryRef.current, file)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    // Download
    const handleDownload = async (doc: Document) => {
        try {
            const res = await fetch(`/api/admin/documents/${doc.id}`)
            if (!res.ok) throw new Error('Failed to get download URL')
            const data = await res.json()
            window.open(data.url, '_blank')
        } catch (err) {
            console.error('Download error:', err)
        }
    }

    // Approve / Reject
    const handleReview = async (docId: string, status: 'approved' | 'rejected') => {
        try {
            const res = await fetch(`/api/admin/documents/${docId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status, adminNotes: reviewNotes || undefined }),
            })

            if (!res.ok) throw new Error('Failed to update document')

            setReviewingDocId(null)
            setReviewNotes('')
            await refreshDocuments()
        } catch (err) {
            console.error('Review error:', err)
        }
    }

    // Delete
    const handleDelete = async (docId: string) => {
        if (!confirm('Delete this document? This cannot be undone.')) return
        try {
            const res = await fetch(`/api/admin/documents/${docId}`, { method: 'DELETE' })
            if (!res.ok) throw new Error('Failed to delete')
            await refreshDocuments()
        } catch (err) {
            console.error('Delete error:', err)
        }
    }

    return (
        <div className="space-y-4">
            {/* Summary bar */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <p className="text-sm text-gray-500">
                    <span className="font-semibold text-gray-900">{uploadedCount}</span> of {totalSlots} documents uploaded
                </p>
                <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${(uploadedCount / totalSlots) * 100}%` }}
                    />
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                    <button onClick={() => setError(null)} className="ml-auto font-medium hover:underline">Dismiss</button>
                </div>
            )}

            {/* Document slots */}
            <div className="space-y-3">
                {DOCUMENT_SLOTS.map(slot => {
                    const doc = getDocForCategory(slot.category)
                    const isUploading = uploadingCategory === slot.category
                    const isReviewing = reviewingDocId === doc?.id
                    const statusConf = doc ? statusColors[doc.status] : null
                    const StatusIcon = statusConf?.icon || Clock

                    return (
                        <div key={slot.category} className="border border-gray-100 rounded-xl overflow-hidden">
                            {/* Slot row */}
                            <div className="flex items-center gap-4 p-4 bg-white hover:bg-gray-50/50 transition-colors">
                                {/* Status indicator */}
                                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${doc
                                    ? doc.status === 'approved' ? 'bg-green-500' : doc.status === 'rejected' ? 'bg-red-500' : 'bg-amber-500'
                                    : 'bg-gray-300'
                                    }`}
                                />

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-medium text-gray-900">{slot.label}</p>
                                        {slot.required && (
                                            <span className="text-[10px] uppercase tracking-wider font-bold text-red-400">Req</span>
                                        )}
                                    </div>
                                    {doc ? (
                                        <p className="text-xs text-gray-500 truncate">
                                            {doc.file_name} &middot; {new Date(doc.created_at).toLocaleDateString()}
                                            {doc.uploaded_by === 'admin' && ' · Uploaded by Admin'}
                                        </p>
                                    ) : (
                                        <p className="text-xs text-gray-400 italic">Not uploaded</p>
                                    )}
                                </div>

                                {/* Status badge */}
                                {doc && statusConf && (
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusConf.bg} ${statusConf.text}`}>
                                        <StatusIcon className="w-3 h-3" />
                                        {doc.status === 'pending_review' ? 'Pending' : doc.status === 'approved' ? 'Approved' : 'Rejected'}
                                    </span>
                                )}

                                {/* Actions */}
                                <div className="flex items-center gap-1">
                                    {doc && (
                                        <>
                                            <button
                                                onClick={() => handleDownload(doc)}
                                                className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                                                title="Download"
                                            >
                                                <Download className="w-4 h-4" />
                                            </button>
                                            {doc.status === 'pending_review' && (
                                                <>
                                                    <button
                                                        onClick={() => handleReview(doc.id, 'approved')}
                                                        className="p-1.5 rounded-md hover:bg-green-50 text-gray-400 hover:text-green-600 transition-colors"
                                                        title="Approve"
                                                    >
                                                        <CheckCircle2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setReviewingDocId(isReviewing ? null : doc.id)
                                                            setReviewNotes('')
                                                        }}
                                                        className="p-1.5 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                                                        title="Reject with notes"
                                                    >
                                                        <XCircle className="w-4 h-4" />
                                                    </button>
                                                </>
                                            )}
                                            <button
                                                onClick={() => handleDelete(doc.id)}
                                                className="p-1.5 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </>
                                    )}
                                    <button
                                        onClick={() => triggerUpload(slot.category)}
                                        disabled={isUploading}
                                        className="p-1.5 rounded-md hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors disabled:opacity-50"
                                        title={doc ? 'Upload new version' : 'Upload'}
                                    >
                                        {isUploading ? (
                                            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <Upload className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Rejection notes input (expandable) */}
                            {isReviewing && (
                                <div className="px-4 pb-4 bg-gray-50 border-t border-gray-100">
                                    <div className="pt-3 space-y-2">
                                        <label className="text-xs font-medium text-gray-700">Rejection notes (visible to client)</label>
                                        <textarea
                                            value={reviewNotes}
                                            onChange={e => setReviewNotes(e.target.value)}
                                            placeholder="e.g. Document is expired, please upload a current version..."
                                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400 resize-none"
                                            rows={2}
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleReview(doc!.id, 'rejected')}
                                                className="px-3 py-1.5 text-xs font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                                            >
                                                Reject Document
                                            </button>
                                            <button
                                                onClick={() => { setReviewingDocId(null); setReviewNotes('') }}
                                                className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-800 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx"
                onChange={handleFileSelected}
            />
        </div>
    )
}
