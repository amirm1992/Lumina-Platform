'use client'

import React, { useState, useRef } from 'react'
import { UploadCloud, ShieldCheck } from 'lucide-react'
import { DocFile } from './types'

interface UploadZoneProps {
    onUpload: (newFiles: DocFile[]) => void
}

export function UploadZone({ onUpload, userId }: UploadZoneProps & { userId: string }) {
    const [isDragging, setIsDragging] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    const showComingSoon = () => {
        alert('Document upload will be available soon. We\'re migrating to a new storage system.')
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        showComingSoon()
    }

    const handleFileSelect = () => {
        showComingSoon()
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
            onClick={() => fileInputRef.current?.click()}
        >
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple
                onChange={handleFileSelect}
            />

            <div className="flex flex-col items-center justify-center py-4">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <UploadCloud className={`w-8 h-8 ${isDragging ? 'text-purple-500' : 'text-gray-400'}`} />
                </div>
                <h3 className="text-lg font-bold text-black mb-2">
                    {isDragging ? 'Drop files here' : 'Upload Documents'}
                </h3>
                <p className="text-sm text-gray-500 max-w-sm mb-4">
                    Document upload will be available soon. Drag & drop or click to browse when ready.
                </p>
                <div className="flex gap-2 text-xs text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
                    <span>256-bit Encrypted Storage (coming soon)</span>
                </div>
            </div>
        </div>
    )
}
