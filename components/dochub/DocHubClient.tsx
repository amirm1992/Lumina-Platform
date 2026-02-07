'use client'

import React, { useState } from 'react'
import { AuthUser } from '@/types/auth'
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar'
import { DocGroup } from './DocGroup'
import { UploadZone } from './UploadZone'
import { DocFile } from './types'

interface DocHubClientProps {
    user: AuthUser | null
    initialFiles: DocFile[]
}

export function DocHubClient({ user, initialFiles }: DocHubClientProps) {
    const [files, setFiles] = useState<DocFile[]>(initialFiles)

    const handleUpload = (newFiles: DocFile[]) => {
        setFiles(prev => [...newFiles, ...prev])
    }

    // TODO: Migrate document storage from Supabase to DigitalOcean Spaces
    const handleDelete = async (id: string) => {
        const fileToDelete = files.find(f => f.id === id)
        if (!fileToDelete) return

        if (!confirm('Are you sure you want to delete this file?')) return

        // Optimistic UI update
        setFiles(prev => prev.filter(f => f.id !== id))

        // TODO: Implement API call to delete document
        console.log('Delete document:', id)
    }

    const handleDownload = async (file: DocFile) => {
        if (!file.path) {
            alert('Document not available')
            return
        }

        // TODO: Implement API call to get signed download URL
        console.log('Download document:', file.id)
        alert('Document download will be available after storage migration')
    }

    // Categorize files
    const clientFiles = files.filter(f => f.category === 'client_upload')
    const lenderFiles = files.filter(f => f.category === 'lender_doc')
    const disclosureFiles = files.filter(f => f.category === 'disclosure')

    return (
        <div className="min-h-screen bg-gray-50 selection:bg-[#DBEAFE] font-sans text-gray-900">
            <DashboardSidebar />

            <main className="container mx-auto px-6 py-10 pt-20 max-w-7xl">
                <div className="mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">DocHub</h1>
                    <p className="text-gray-500">Secure document portal for your loan application.</p>
                </div>

                {/* Upload Section */}
                <div className="mb-16">
                    <UploadZone onUpload={handleUpload} userId={user?.id || ''} />
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
