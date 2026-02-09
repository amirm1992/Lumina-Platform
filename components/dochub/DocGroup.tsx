'use client'

import React from 'react'
import { FileTile } from './FileTile'
import { DocFile } from './types'

interface DocGroupProps {
    title: string
    description?: string
    files: DocFile[]
    onDelete: (id: string) => void
    onDownload: (file: DocFile) => void
}

export function DocGroup({ title, description, files, onDelete, onDownload }: DocGroupProps) {
    // if (files.length === 0) return null -- Render even if empty

    return (
        <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-4 border-b border-gray-200 pb-2">
                <h2 className="text-xl font-bold text-black mb-1 flex items-center gap-3">
                    {title}
                    <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                        {files.length}
                    </span>
                </h2>
                {description && <p className="text-sm text-gray-500">{description}</p>}
            </div>

            {files.length === 0 ? (
                <div className="py-8 text-center bg-gray-100/50 rounded-xl border border-dashed border-gray-200">
                    <p className="text-sm text-gray-400 italic">No documents in this section</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {files.map(file => (
                        <FileTile
                            key={file.id}
                            file={file}
                            onDelete={onDelete}
                            onDownload={onDownload}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
