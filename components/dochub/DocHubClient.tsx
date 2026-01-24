'use client'

import React, { useState } from 'react'
import { User } from '@supabase/supabase-js'
import { DashboardNavbar } from '@/components/dashboard/DashboardNavbar'
import { DocGroup } from './DocGroup'
import { UploadZone } from './UploadZone'
import { DocFile } from './types'

interface DocHubClientProps {
    user: User | null
    initialFiles: DocFile[]
}

export function DocHubClient({ user, initialFiles }: DocHubClientProps) {
    const [files, setFiles] = useState<DocFile[]>(initialFiles)

    const handleUpload = (newFiles: DocFile[]) => {
        setFiles(prev => [...newFiles, ...prev])
    }

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this file?')) {
            setFiles(prev => prev.filter(f => f.id !== id))
        }
    }

    const handleDownload = (file: DocFile) => {
        alert(`Simulating download for: ${file.name}`)
    }

    // Categorize files
    const clientFiles = files.filter(f => f.category === 'client_upload')
    const lenderFiles = files.filter(f => f.category === 'lender_doc')
    const disclosureFiles = files.filter(f => f.category === 'disclosure')

    return (
        <div className="min-h-screen bg-gray-50 selection:bg-purple-100 font-sans text-gray-900">
            <DashboardNavbar user={user} />

            <main className="container mx-auto px-6 py-10 max-w-7xl">
                <div className="mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">DocHub</h1>
                    <p className="text-gray-500">Secure document portal for your loan application.</p>
                </div>

                {/* Upload Section */}
                <div className="mb-16">
                    <UploadZone onUpload={handleUpload} />
                </div>

                {/* Document Groups */}
                <div className="space-y-4">
                    <DocGroup
                        title="Your Uploads"
                        description="Documents you have submitted for review."
                        files={clientFiles}
                        onDelete={handleDelete}
                        onDownload={handleDownload}
                    />

                    <DocGroup
                        title="Lender Documents"
                        description="Pre-approvals, Loan Estimates, and other docs from us."
                        files={lenderFiles}
                        onDelete={handleDelete}
                        onDownload={handleDownload}
                    />

                    <DocGroup
                        title="Disclosures"
                        description="Regulatory documents and agreements."
                        files={disclosureFiles}
                        onDelete={handleDelete}
                        onDownload={handleDownload}
                    />
                </div>
            </main>
        </div>
    )
}
