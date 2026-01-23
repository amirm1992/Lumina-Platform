import { ApplicationStatus } from '@/types/database'

interface StatusBadgeProps {
    status: ApplicationStatus
    size?: 'sm' | 'md'
}

const statusConfig = {
    pending: {
        label: 'Pending',
        bgColor: 'bg-amber-100',
        textColor: 'text-amber-700',
        icon: '⏳'
    },
    in_review: {
        label: 'In Review',
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-700',
        icon: '🔄'
    },
    offers_ready: {
        label: 'Offers Ready',
        bgColor: 'bg-green-100',
        textColor: 'text-green-700',
        icon: '✅'
    },
    completed: {
        label: 'Completed',
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-700',
        icon: '✓'
    },
    cancelled: {
        label: 'Cancelled',
        bgColor: 'bg-red-100',
        textColor: 'text-red-700',
        icon: '✕'
    }
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
    const config = statusConfig[status] || statusConfig.pending

    const sizeClasses = size === 'sm'
        ? 'px-2 py-0.5 text-xs'
        : 'px-3 py-1 text-sm'

    return (
        <span className={`inline-flex items-center gap-1 rounded-full font-medium ${config.bgColor} ${config.textColor} ${sizeClasses}`}>
            <span>{config.icon}</span>
            {config.label}
        </span>
    )
}
