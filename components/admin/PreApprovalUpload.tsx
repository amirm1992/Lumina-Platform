'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, X, FileText, Trash2, CheckCircle, Loader2 } from 'lucide-react'
import { Document } from '@/types/database'
import { createClient } from '@/utils/supabase/client'

interface PreApprovalUploadProps {
    applicationId: string
    userId: string
    documents: Document[]
}

export function PreApprovalUpload({ applicationId, userId, documents: initialDocuments }: PreApprovalUploadProps) {
    const router = useRouter()
    const [isUploading, setIsUploading] = useState(false)
    const [documents, setDocuments] = useState<Document[]>(initialDocuments)
    const supabase = createClient()

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        try {
            // 1. Upload to Storage
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random().toString(36).substring(2)}_${file.name.replace(/\s/g, '_')}`
            const filePath = `${userId}/${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('documents')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            // 2. Insert into Database
            const { data: newDoc, error: insertError } = await supabase
                .from('documents')
                .insert({
                    application_id: applicationId,
                    user_id: userId,
                    file_name: file.name,
                    file_path: filePath,
                    file_size: file.size,
                    file_type: fileExt,
                    category: 'lender_doc',
                    status: 'verified' // Auto-verify admin uploads
                })
                .select()
                .single()

            if (insertError) throw insertError

            if (newDoc) {
                setDocuments(prev => [newDoc, ...prev])
                router.refresh()
            }
        } catch (error) {
            console.error('Upload failed:', error)
            alert('Failed to upload document')
        } finally {
            setIsUploading(false)
            // Reset input
            e.target.value = ''
        }
    }

    const handleDelete = async (docId: string, filePath: string) => {
        if (!confirm('Are you sure you want to delete this document?')) return

        const previousDocs = [...documents]
        setDocuments(prev => prev.filter(d => d.id !== docId)) // Optimistic

        try {
            // 1. Delete from Storage
            const { error: storageError } = await supabase.storage
                .from('documents')
                .remove([filePath])

            if (storageError) console.error('Storage delete failed', storageError)

            // 2. Delete from Database
            const { error: dbError } = await supabase
                .from('documents')
                .delete()
                .eq('id', docId)

            if (dbError) throw dbError

            router.refresh()

        } catch (error) {
            console.error('Delete failed:', error)
            setDocuments(previousDocs) // Revert
            alert('Failed to delete document')
        }
    }

    // Filter to only show relevant lender docs (like pre-approvals)
    const lenderDocs = documents.filter(d => d.category === 'lender_doc')

    return (
        <div className="space-y-4">
            {/* Upload Area */}
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 transition-colors hover:border-purple-400 hover:bg-purple-50 group">
                <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-3 group-hover:bg-white transition-colors">
                        {isUploading ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                            <Upload className="w-6 h-6" />
                        )}
                    </div>
                    <div>
                        <label htmlFor="file-upload" className="cursor-pointer">
                            <span className="text-purple-600 font-semibold hover:text-purple-700">Click to upload</span>
                            <span className="text-gray-500"> or drag and drop</span>
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
                        <p className="text-xs text-gray-400 mt-1">PDF up to 5MB</p>
                    </div>
                </div>
            </div>

            {/* Document List */}
            {lenderDocs.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-sm font-medium text-gray-900">Uploaded Documents</h3>
                    {lenderDocs.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 group">
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
                            <div className="flex items-center gap-2">
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" />
                                    Ready
                                </span>
                                <button
                                    onClick={() => handleDelete(doc.id, doc.file_path)}
                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                                    title="Delete document"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
