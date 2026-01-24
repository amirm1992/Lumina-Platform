'use client'

import React, { useState, useRef } from 'react'
import { UploadCloud, ShieldCheck } from 'lucide-react'
import { DocFile } from './types'
import { createClient } from '@/utils/supabase/client'

interface UploadZoneProps {
    onUpload: (newFiles: DocFile[]) => void
}

export function UploadZone({ onUpload, userId }: UploadZoneProps & { userId: string }) {
    const [isDragging, setIsDragging] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const supabase = createClient()

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    const processFiles = async (files: FileList | null) => {
        if (!files || files.length === 0) return

        setIsUploading(true)
        const uploadedDocs: DocFile[] = []

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i]
                const fileExt = file.name.split('.').pop()
                const fileName = `${Math.random().toString(36).substring(2)}_${file.name.replace(/\s/g, '_')}`
                const filePath = `${userId}/${fileName}`

                // 1. Upload to Storage
                const { error: uploadError } = await supabase.storage
                    .from('documents')
                    .upload(filePath, file)

                if (uploadError) throw uploadError

                // 2. Insert into Database
                const { data: newDoc, error: insertError } = await supabase
                    .from('documents')
                    .insert({
                        user_id: userId,
                        file_name: file.name,
                        file_path: filePath,
                        file_size: file.size,
                        file_type: fileExt,
                        category: 'client_upload',
                        status: 'pending'
                    })
                    .select()
                    .single()

                if (insertError) throw insertError

                if (newDoc) {
                    uploadedDocs.push({
                        id: newDoc.id,
                        name: newDoc.file_name,
                        category: 'client_upload',
                        size: (newDoc.file_size / 1024 / 1024).toFixed(2) + ' MB',
                        type: newDoc.file_type === 'pdf' ? 'pdf' : 'image',
                        status: 'pending',
                        path: newDoc.file_path,
                        uploadDate: new Date(newDoc.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    })
                }
            }

            if (uploadedDocs.length > 0) {
                onUpload(uploadedDocs)
            }
        } catch (error) {
            console.error('Upload failed:', error)
            alert('Failed to upload one or more files. Please try again.')
        } finally {
            setIsUploading(false)
            setIsDragging(false)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        processFiles(e.dataTransfer.files)
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        processFiles(e.target.files)
    }

    return (
        <div
            className={`
                relative group border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer
                ${isDragging ? 'border-purple-500 bg-purple-50' : 'border-gray-300 bg-white hover:border-purple-500/50 hover:bg-gray-50 hover:shadow-lg hover:shadow-purple-500/10'}
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !isUploading && fileInputRef.current?.click()}
        >
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple
                onChange={handleFileSelect}
                disabled={isUploading}
            />

            {isUploading ? (
                <div className="flex flex-col items-center justify-center py-4 animate-in fade-in">
                    <div className="w-12 h-12 rounded-full border-4 border-gray-200 border-t-black animate-spin mb-4" />
                    <p className="text-black font-medium">Uploading files...</p>
                    <p className="text-sm text-gray-500">Encrypting and storing securely</p>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-4">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <UploadCloud className={`w-8 h-8 ${isDragging ? 'text-purple-500' : 'text-gray-400'}`} />
                    </div>
                    <h3 className="text-lg font-bold text-black mb-2">
                        {isDragging ? 'Drop files here' : 'Upload Documents'}
                    </h3>
                    <p className="text-sm text-gray-500 max-w-sm mb-4">
                        Drag & drop or click to browse. Supported: PDF, JPG, PNG.
                    </p>
                    <div className="flex gap-2 text-xs text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200">
                        <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
                        <span>256-bit Encrypted Storage</span>
                    </div>
                </div>
            )}
        </div>
    )
}
