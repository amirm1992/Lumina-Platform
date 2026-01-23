'use client'

import React from 'react'
import { Plus } from 'lucide-react'

interface AddPropertyCardProps {
    onClick: () => void
}

export function AddPropertyCard({ onClick }: AddPropertyCardProps) {
    return (
        <button
            onClick={onClick}
            className="group relative aspect-[4/3] rounded-2xl border-2 border-dashed border-gray-300 bg-white hover:bg-gray-50 hover:border-purple-500 hover:shadow-lg transition-all flex flex-col items-center justify-center gap-4 animate-in fade-in"
        >
            <div className="w-16 h-16 rounded-full bg-gray-100 group-hover:bg-purple-100 flex items-center justify-center transition-colors">
                <Plus className="w-8 h-8 text-gray-400 group-hover:text-purple-600 transition-colors" />
            </div>
            <span className="text-sm font-bold text-gray-500 group-hover:text-black transition-colors uppercase tracking-wider">
                Add Property
            </span>
        </button>
    )
}
