'use client'

import React, { useState, useRef } from 'react'
import { Upload, FileText, Download, RotateCcw, User, ShieldCheck } from 'lucide-react'
import { DocumentStatusBadge } from './DocumentStatusBadge'
import type { Document, DocumentSlotDef } from '@/types/database'

interface DocumentSlotProps {
    slot: DocumentSlotDef
    document: Document | null
    onUpload: (category: string, file: File) => Promise<void>
    onDownload: (doc: Document) => void
}

export function DocumentSlot({ slot, document, onUpload, onDownload }: DocumentSlotProps) {
    const [isUploading, setIsUploading] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setIsUploading(true)
        try {
            await onUpload(slot.category, file)
        } finally {
            setIsUploading(false)
            if (fileInputRef.current) fileInputRef.current.value = ''
        }
    }

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const file = e.dataTransfer.files[0]
        if (!file) return
        setIsUploading(true)
        try {
            await onUpload(slot.category, file)
        } finally {
            setIsUploading(false)
        }
    }

    const status = document ? document.status : 'missing'
    const isRejected = document?.status === 'rejected'

    return (
        <div
            className={`
                relative bg-white border rounded-2xl p-5 transition-all duration-200
                ${isDragging ? 'border-blue-400 bg-blue-50/50 shadow-lg shadow-blue-500/10' : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'}
                ${isRejected ? 'ring-1 ring-red-200' : ''}
            `}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
        >
            {/* Header row */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-gray-900">{slot.label}</h3>
                        {slot.required && (
                            <span className="text-[10px] uppercase tracking-wider font-bold text-red-500">Required</span>
                        )}
                    </div>
                    <p className="text-xs text-gray-500">{slot.description}</p>
                </div>
                <DocumentStatusBadge status={status} />
            </div>

            {/* Document content */}
            {document ? (
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileText className="w-5 h-5 text-red-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{document.file_name}</p>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                                <span>{new Date(document.created_at).toLocaleDateString()}</span>
                                {document.file_size && (
                                    <>
                                        <span>&middot;</span>
                                        <span>{(document.file_size / 1024).toFixed(0)} KB</span>
                                    </>
                                )}
                                <span>&middot;</span>
                                <span className="flex items-center gap-1">
                                    {document.uploaded_by === 'admin' ? (
                                        <><ShieldCheck className="w-3 h-3 text-blue-500" /> Admin</>
                                    ) : (
                                        <><User className="w-3 h-3" /> You</>
                                    )}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={() => onDownload(document)}
                            className="p-2 rounded-lg hover:bg-white text-gray-400 hover:text-gray-700 transition-colors"
                            title="Download"
                        >
                            <Download className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Rejection notes */}
                    {isRejected && document.admin_notes && (
                        <div className="mt-3 p-2.5 bg-red-50 border border-red-100 rounded-lg">
                            <p className="text-xs text-red-700">
                                <span className="font-semibold">Feedback:</span> {document.admin_notes}
                            </p>
                        </div>
                    )}

                    {/* Re-upload button for rejected docs */}
                    {isRejected && (
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Re-upload Document
                        </button>
                    )}
                </div>
            ) : (
                /* Empty slot — upload prompt */
                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className={`
                        w-full border-2 border-dashed rounded-xl p-4 text-center transition-all duration-200 cursor-pointer
                        ${isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-blue-400 hover:bg-gray-50'}
                        disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                >
                    <div className="flex flex-col items-center">
                        {isUploading ? (
                            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-2" />
                        ) : (
                            <Upload className={`w-6 h-6 mb-2 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
                        )}
                        <p className="text-sm font-medium text-gray-600">
                            {isUploading ? 'Uploading...' : 'Drop file or click to upload'}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG, DOCX &bull; Max 10 MB</p>
                    </div>
                </button>
            )}

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx"
                onChange={handleFileChange}
            />
        </div>
    )
}
