'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { FileText, ShieldCheck, CheckCircle2, Clock, AlertCircle, PenTool, Lock } from 'lucide-react'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import { DocumentSlot } from './DocumentSlot'
import { DisclosureSignModal } from './DisclosureSignModal'
import { DOCUMENT_SLOTS, DISCLOSURE_SLOTS } from '@/types/database'
import type { Document, DisclosureSignature } from '@/types/database'

interface DocHubClientProps {
    userId: string
    initialDocuments: Document[]
}

export function DocHubClient({ userId, initialDocuments }: DocHubClientProps) {
    const [documents, setDocuments] = useState<Document[]>(initialDocuments)
    const [error, setError] = useState<string | null>(null)

    // Disclosure state
    const [disclosures, setDisclosures] = useState<DisclosureSignature[]>([])
    const [disclosuresLoading, setDisclosuresLoading] = useState(true)
    const [preApprovalComplete, setPreApprovalComplete] = useState(false)
    const [signingDisclosure, setSigningDisclosure] = useState<DisclosureSignature | null>(null)

    // Fetch disclosures on mount
    useEffect(() => {
        async function fetchDisclosures() {
            try {
                const res = await fetch('/api/disclosures')
                if (res.ok) {
                    const data = await res.json()
                    setDisclosures(data.disclosures || [])
                    setPreApprovalComplete(data.preApprovalComplete || false)
                }
            } catch (err) {
                console.error('Failed to fetch disclosures:', err)
            } finally {
                setDisclosuresLoading(false)
            }
        }
        fetchDisclosures()
    }, [])

    const handleDisclosureSigned = useCallback((updated: DisclosureSignature) => {
        setDisclosures(prev => prev.map(d => d.id === updated.id ? updated : d))
    }, [])

    // Disclosure stats
    const totalDisclosures = disclosures.length
    const signedDisclosures = disclosures.filter(d => d.status === 'signed').length
    const pendingDisclosures = disclosures.filter(d => d.status === 'pending_signature').length

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

                {/* ── Disclosures Section ── */}
                {preApprovalComplete && (
                    <div className="mb-10">
                        <div className="flex items-center justify-between mb-1">
                            <h2 className="text-lg font-bold text-gray-900">Disclosures</h2>
                            {totalDisclosures > 0 && (
                                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                                    signedDisclosures === totalDisclosures
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-amber-100 text-amber-700'
                                }`}>
                                    {signedDisclosures}/{totalDisclosures} Signed
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-gray-500 mb-4">
                            Review and electronically sign each required disclosure to proceed with your loan.
                        </p>

                        {disclosuresLoading ? (
                            <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
                                <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                                <p className="text-sm text-gray-500">Loading disclosures...</p>
                            </div>
                        ) : disclosures.length === 0 ? (
                            <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
                                <Lock className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                                <p className="text-sm text-gray-500">Disclosures will appear here after your pre-approval is processed.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {disclosures.map(disclosure => {
                                    const slotDef = DISCLOSURE_SLOTS.find(s => s.category === disclosure.disclosure_type)
                                    const isSigned = disclosure.status === 'signed'
                                    return (
                                        <button
                                            key={disclosure.id}
                                            onClick={() => setSigningDisclosure(disclosure)}
                                            className={`text-left p-5 rounded-xl border transition-all ${
                                                isSigned
                                                    ? 'bg-green-50/50 border-green-200 hover:border-green-300'
                                                    : 'bg-white border-amber-200 hover:border-amber-300 hover:shadow-md'
                                            }`}
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    {isSigned ? (
                                                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                                                    ) : (
                                                        <PenTool className="w-5 h-5 text-amber-600 flex-shrink-0" />
                                                    )}
                                                    <h3 className="font-semibold text-gray-900 text-sm">
                                                        {slotDef?.label || disclosure.disclosure_type}
                                                    </h3>
                                                </div>
                                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                                    isSigned
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                    {isSigned ? 'Signed' : 'Requires Signature'}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 ml-7">
                                                {slotDef?.description || 'Review and sign this disclosure'}
                                            </p>
                                            {isSigned && disclosure.signed_at && (
                                                <p className="text-[10px] text-gray-400 ml-7 mt-1">
                                                    Signed {new Date(disclosure.signed_at).toLocaleDateString()} by {disclosure.signed_name}
                                                </p>
                                            )}
                                        </button>
                                    )
                                })}
                            </div>
                        )}

                        {pendingDisclosures > 0 && (
                            <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
                                <PenTool className="w-5 h-5 text-amber-600 flex-shrink-0" />
                                <p className="text-sm text-amber-800">
                                    <strong>{pendingDisclosures} disclosure{pendingDisclosures > 1 ? 's' : ''}</strong> still require{pendingDisclosures === 1 ? 's' : ''} your signature.
                                    Click on each to review and sign.
                                </p>
                            </div>
                        )}
                    </div>
                )}

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

                {/* Disclosure Sign Modal */}
                {signingDisclosure && (
                    <DisclosureSignModal
                        isOpen={!!signingDisclosure}
                        onClose={() => setSigningDisclosure(null)}
                        disclosure={signingDisclosure}
                        label={DISCLOSURE_SLOTS.find(s => s.category === signingDisclosure.disclosure_type)?.label || 'Disclosure'}
                        description={DISCLOSURE_SLOTS.find(s => s.category === signingDisclosure.disclosure_type)?.description || ''}
                        onSigned={handleDisclosureSigned}
                    />
                )}
            </main>
        </div>
    )
}
