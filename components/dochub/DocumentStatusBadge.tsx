'use client'

import { ShieldCheck, Clock, AlertCircle, FileQuestion } from 'lucide-react'
import type { DocumentStatus } from '@/types/database'

const config: Record<string, { label: string; icon: React.ElementType; bg: string; text: string }> = {
    approved: { label: 'Approved', icon: ShieldCheck, bg: 'bg-green-50', text: 'text-green-700' },
    pending_review: { label: 'Pending Review', icon: Clock, bg: 'bg-amber-50', text: 'text-amber-700' },
    rejected: { label: 'Action Needed', icon: AlertCircle, bg: 'bg-red-50', text: 'text-red-700' },
    missing: { label: 'Not Uploaded', icon: FileQuestion, bg: 'bg-gray-100', text: 'text-gray-500' },
}

interface Props {
    status: DocumentStatus | 'missing'
}

export function DocumentStatusBadge({ status }: Props) {
    const c = config[status] || config.missing
    const Icon = c.icon

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
            <Icon className="w-3.5 h-3.5" />
            {c.label}
        </span>
    )
}
