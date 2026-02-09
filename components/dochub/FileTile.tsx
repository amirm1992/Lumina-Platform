'use client'

import React from 'react'
import { FileText, Image, Download, Trash2, Eye, ShieldCheck, AlertCircle } from 'lucide-react'
import { DocFile } from './types'

interface FileTileProps {
    file: DocFile
    onDelete: (id: string) => void
    onDownload: (file: DocFile) => void
}

export function FileTile({ file, onDelete, onDownload }: FileTileProps) {
    const getIcon = () => {
        switch (file.type) {
            case 'pdf': return <FileText className="w-8 h-8 text-red-400" />
            case 'image': return <Image className="w-8 h-8 text-blue-400" />
            default: return <FileText className="w-8 h-8 text-gray-400" />
        }
    }

    const getStatusIcon = () => {
        if (file.status === 'verified') return <ShieldCheck className="w-4 h-4 text-green-400" />
        if (file.status === 'rejected') return <AlertCircle className="w-4 h-4 text-red-400" />
        return null
    }

    return (
        <div className="group relative bg-white border border-gray-200 hover:border-purple-500 rounded-xl p-4 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/10 flex flex-col gap-3">
            <div className="flex items-start justify-between">
                <div className="p-3 bg-gray-50 rounded-lg group-hover:bg-gray-100 transition-colors">
                    {getIcon()}
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => onDownload(file)}
                        className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-black"
                        title="Download/View"
                    >
                        {file.type === 'pdf' ? <Eye className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                    </button>
                    {file.category === 'client_upload' && (
                        <button
                            onClick={() => onDelete(file.id)}
                            className="p-1.5 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-500"
                            title="Delete"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            <div>
                <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-black truncate" title={file.name}>
                        {file.name}
                    </h3>
                    {getStatusIcon()}
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{file.uploadDate}</span>
                    <span>{file.size}</span>
                </div>
            </div>
        </div>
    )
}
