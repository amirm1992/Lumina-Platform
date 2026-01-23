'use client'

import React from 'react'
import { Property } from './types'
import { X, MapPin, Bed, Bath, Square, Calendar, Hash, DollarSign } from 'lucide-react'

interface PropertyDetailsModalProps {
    property: Property | null
    onClose: () => void
}

export function PropertyDetailsModal({ property, onClose }: PropertyDetailsModalProps) {
    if (!property) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
                onClick={onClose}
            />

            <div className="relative w-full max-w-4xl max-h-[90vh] bg-white border border-gray-100 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">

                {/* Header Image */}
                <div className="relative h-64 md:h-80 shrink-0">
                    {property.imageUrl ? (
                        <img src={property.imageUrl} alt={property.addressLine1} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400 font-bold uppercase tracking-widest">No Image Available</span>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 rounded-full bg-white/20 text-white hover:bg-white/40 backdrop-blur-md transition-all"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <div className="absolute bottom-6 left-6 md:left-10">
                        <div className="flex items-center gap-3 mb-2">
                            <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider backdrop-blur-md
                                ${(property.status === 'For Sale' && property.price) ? 'bg-green-500/80 text-white' :
                                    'bg-gray-700/80 text-white'}
                            `}>
                                {!property.price ? 'Off Market' : property.status}
                            </span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-1 shadow-black/50 drop-shadow-lg">{property.addressLine1}</h2>
                        <p className="text-lg text-gray-200 flex items-center gap-2 drop-shadow-md">
                            <MapPin className="w-4 h-4 text-white" />
                            {property.city}, {property.state} {property.zipCode}
                        </p>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10 bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                        <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
                            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-2">List Price</p>
                            <div className="flex items-center gap-2">
                                <DollarSign className="w-6 h-6 text-green-500" />
                                <span className="text-3xl font-bold text-black">${(property.price || 0).toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
                            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-2">Configuration</p>
                            <div className="flex items-center gap-4">
                                <span className="flex items-center gap-2 text-black font-bold"><Bed className="w-5 h-5 text-purple-500" /> {property.bedrooms || '-'}</span>
                                <div className="w-px h-6 bg-gray-200" />
                                <span className="flex items-center gap-2 text-black font-bold"><Bath className="w-5 h-5 text-purple-500" /> {property.bathrooms || '-'}</span>
                            </div>
                        </div>
                        <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
                            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-2">Size</p>
                            <div className="flex items-center gap-2">
                                <Square className="w-5 h-5 text-purple-500" />
                                <span className="text-2xl font-bold text-black">{(property.squareFootage || 0).toLocaleString()} <span className="text-sm font-normal text-gray-500">sqft</span></span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
                                <Hash className="w-5 h-5 text-purple-500" />
                                Property Details
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                                    <span className="block text-gray-500 text-xs mb-1">Year Built</span>
                                    <span className="block text-black font-semibold">{property.yearBuilt || 'N/A'}</span>
                                </div>
                                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                                    <span className="block text-gray-500 text-xs mb-1">Property Type</span>
                                    <span className="block text-black font-semibold">{property.propertyType || 'Single Family'}</span>
                                </div>
                                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                                    <span className="block text-gray-500 text-xs mb-1">Days on Market</span>
                                    <span className="block text-black font-semibold">{property.daysOnMarket || 0} Days</span>
                                </div>
                                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                                    <span className="block text-gray-500 text-xs mb-1">Last Updated</span>
                                    <span className="block text-black font-semibold">
                                        {property.lastSeenDate ? new Date(property.lastSeenDate).toLocaleDateString() : 'Recent'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {property.description && (
                            <div>
                                <h3 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-purple-500" />
                                    Description
                                </h3>
                                <p className="text-gray-600 leading-relaxed bg-gray-50 p-6 rounded-2xl border border-gray-100 text-sm">
                                    {property.description}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Action */}
                <div className="p-6 border-t border-gray-100 bg-gray-50 shrink-0 flex gap-4">
                    <button className="flex-1 py-4 bg-black hover:bg-gray-800 text-white rounded-xl font-bold uppercase tracking-wider transition-all shadow-lg shadow-black/10">
                        Start Application
                    </button>
                    <button className="flex-1 py-4 bg-white hover:bg-gray-50 text-black rounded-xl font-bold uppercase tracking-wider transition-all border border-gray-200">
                        Run Analysis
                    </button>
                </div>
            </div>
        </div>
    )
}
