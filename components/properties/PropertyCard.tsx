'use client'

import React from 'react'
import { Property } from './types'
import { Bed, Bath, Square, Clock, Trash2, Star, Loader2 } from 'lucide-react'

interface PropertyCardProps {
    property: Property
    onClick: () => void
    onDelete: (e: React.MouseEvent) => void
    onChoose: (e: React.MouseEvent) => void
    isDeleting?: boolean
    isChoosing?: boolean
}

export function PropertyCard({ property, onClick, onDelete, onChoose, isDeleting, isChoosing }: PropertyCardProps) {
    return (
        <div
            onClick={onClick}
            className={`group relative aspect-[4/3] rounded-2xl bg-gray-200 border-2 overflow-hidden cursor-pointer transition-all shadow-md hover:shadow-xl
                ${property.isChosen
                    ? 'border-amber-400 hover:border-amber-500 hover:shadow-amber-500/15 ring-1 ring-amber-400/30'
                    : 'border-gray-200 hover:border-purple-500 hover:shadow-purple-500/10'
                }`}
        >
            {/* Image Layer */}
            <div className="absolute inset-0">
                {property.imageUrl ? (
                    <img
                        src={property.imageUrl}
                        alt={property.addressLine1}
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity scale-100 group-hover:scale-105 duration-700"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400 font-bold text-xs uppercase">No Image</span>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
            </div>

            {/* Chosen Badge */}
            {property.isChosen && (
                <div className="absolute top-4 left-4 z-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-black text-[10px] font-bold uppercase tracking-wider shadow-lg">
                        <Star className="w-3 h-3 fill-current" />
                        Chosen Property
                    </span>
                </div>
            )}

            {/* Status Badge (shifted down when chosen badge is present) */}
            {!property.isChosen && (
                <div className="absolute top-4 left-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider backdrop-blur-md
                        ${(property.status === 'For Sale' && property.price) ? 'bg-green-500/80 text-white' :
                            property.status === 'Pending' ? 'bg-amber-500/80 text-white' :
                                'bg-gray-700/80 text-white'}
                    `}>
                        {!property.price ? 'Off Market' : property.status}
                    </span>
                </div>
            )}

            {/* Top-right Actions */}
            <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                {property.daysOnMarket != null && property.daysOnMarket > 0 && (
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-black/40 backdrop-blur-md border border-white/10">
                        <Clock className="w-3 h-3 text-white" />
                        <span className="text-[10px] font-bold text-white">{property.daysOnMarket}d</span>
                    </div>
                )}

                {/* Choose Button */}
                <button
                    onClick={onChoose}
                    disabled={isChoosing}
                    className={`p-1.5 rounded-full backdrop-blur-md transition-all
                        ${property.isChosen
                            ? 'bg-amber-400/90 text-black hover:bg-amber-300'
                            : 'bg-white/20 text-white hover:bg-amber-400 hover:text-black opacity-0 group-hover:opacity-100'
                        }`}
                    title={property.isChosen ? 'Remove as chosen' : 'Set as chosen property'}
                >
                    {isChoosing ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                        <Star className={`w-3.5 h-3.5 ${property.isChosen ? 'fill-current' : ''}`} />
                    )}
                </button>

                {/* Delete Button */}
                <button
                    onClick={onDelete}
                    disabled={isDeleting}
                    className="p-1.5 rounded-full bg-white/20 backdrop-blur-md hover:bg-red-500 hover:text-white text-white transition-colors opacity-0 group-hover:opacity-100"
                    title="Remove Property"
                >
                    {isDeleting ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                    )}
                </button>
            </div>

            {/* Details Layer */}
            <div className="absolute inset-x-0 bottom-0 p-5">
                <div className="mb-1">
                    <span className="text-xl font-bold text-white drop-shadow-md">
                        {property.price ? `$${Number(property.price).toLocaleString()}` : 'Price N/A'}
                    </span>
                </div>
                <div className="mb-4">
                    <p className="text-sm font-medium text-white line-clamp-1 drop-shadow-md">{property.addressLine1}</p>
                    <p className="text-xs text-gray-200 drop-shadow-md">{property.city}, {property.state} {property.zipCode}</p>
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-200 border-t border-white/20 pt-4">
                    <div className="flex items-center gap-1.5">
                        <Bed className="w-3.5 h-3.5 text-purple-300" />
                        <span className="font-semibold">{property.bedrooms || '-'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Bath className="w-3.5 h-3.5 text-purple-300" />
                        <span className="font-semibold">{property.bathrooms || '-'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Square className="w-3.5 h-3.5 text-purple-300" />
                        <span className="font-semibold">{property.squareFootage ? `${Number(property.squareFootage).toLocaleString()} sqft` : '-'}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
