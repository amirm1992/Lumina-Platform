'use client'

import { useState } from 'react'
import { Upload, FileText } from 'lucide-react'
import { Document } from '@/types/database'

interface PreApprovalUploadProps {
    applicationId: string
    userId: string
    documents: Document[]
}

export function PreApprovalUpload({ applicationId, userId, documents: initialDocuments }: PreApprovalUploadProps) {
    const [isUploading, setIsUploading] = useState(false)
    const lenderDocs = initialDocuments.filter(d => d.category === 'lender_doc')

    const handleFileUpload = () => {
        setIsUploading(true)
        alert('Document upload will be available soon. We\'re migrating to a new storage system.')
        setIsUploading(false)
    }

    return (
        <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 transition-colors hover:border-purple-400 hover:bg-purple-50 group">
                <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-3 group-hover:bg-white transition-colors">
                        {isUploading ? (
                            <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Upload className="w-6 h-6" />
                        )}
                    </div>
                    <div>
                        <label htmlFor="file-upload" className="cursor-pointer">
                            <span className="text-purple-600 font-semibold hover:text-purple-700">Click to upload</span>
                            <span className="text-gray-500"> (coming soon)</span>
                            <input
                                id="file-upload"
                                name="file-upload"
                                type="file"
                                className="sr-only"
                                accept=".pdf"
                                onChange={handleFileUpload}
                                disabled={isUploading}
                            />
                        </label>
                        <p className="text-xs text-gray-400 mt-1">Document storage is being migrated. Upload will be available soon.</p>
                    </div>
                </div>
            </div>

            {lenderDocs.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-900">Uploaded Documents</h3>
                    {lenderDocs.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <FileText className="w-4 h-4 text-red-500" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{doc.file_name}</p>
                                    <p className="text-xs text-gray-500">
                                        {new Date(doc.created_at).toLocaleDateString()} • {(doc.file_size ? (doc.file_size / 1024).toFixed(0) : '0')} KB
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
