import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
    title: string
    value: number
    icon: LucideIcon
    trend?: string
    variant?: 'default' | 'success' | 'warning' | 'info'
}

const variantStyles = {
    default: 'bg-gray-50 text-gray-600',
    success: 'bg-green-50 text-green-600',
    warning: 'bg-amber-50 text-amber-600',
    info: 'bg-blue-50 text-blue-600',
}

export function StatsCard({ title, value, icon: Icon, trend, variant = 'default' }: StatsCardProps) {
    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500 font-medium">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
                    {trend && (
                        <p className="text-xs text-gray-400 mt-2">{trend}</p>
                    )}
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${variantStyles[variant]}`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
        </div>
    )
}
