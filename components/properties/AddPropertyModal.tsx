'use client'

import React, { useState } from 'react'
import { X, Search, Loader2 } from 'lucide-react'
import { Property } from './types'

interface AddPropertyModalProps {
    isOpen: boolean
    onClose: () => void
    onAdd: (property: Property) => void
}

interface Suggestion {
    place_id: string
    description: string
    structured_formatting: {
        main_text: string
        secondary_text: string
    }
}

export function AddPropertyModal({ isOpen, onClose, onAdd }: AddPropertyModalProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [suggestions, setSuggestions] = useState<Suggestion[]>([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Separate fields for manual entry
    const [addressLine1, setAddressLine1] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [zipCode, setZipCode] = useState('')

    // Debounce timer
    const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)

    if (!isOpen) return null

    // Helper to build full address string
    const getFullAddress = () => {
        const parts = [addressLine1, city, state, zipCode].filter(Boolean)
        return parts.join(', ')
    }

    // Shared handler for fetching property data
    const fetchPropertyData = async (addressDescription: string) => {
        setIsLoading(true)
        setError(null)
        setShowSuggestions(false)

        try {
            const res = await fetch(`/api/rentcast/property-detail?address=${encodeURIComponent(addressDescription)}`)

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData.error || 'Failed to fetch property details')
            }

            const propertyData = await res.json()
            onAdd(propertyData)
            onClose()
            // Reset fields
            setAddressLine1('')
            setCity('')
            setState('')
            setZipCode('')
            setSuggestions([])
        } catch (err) {
            console.error(err)
            const message = err instanceof Error ? err.message : 'Could not find property data'
            setError(message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setAddressLine1(val)

        if (timer) clearTimeout(timer)

        if (val.length > 3) {
            const newTimer = setTimeout(async () => {
                try {
                    const res = await fetch(`/api/property/autocomplete?query=${encodeURIComponent(val)}`)
                    const data = await res.json()
                    setSuggestions(data.suggestions || [])
                    setShowSuggestions(true)
                } catch (err) {
                    console.error('Autocomplete error:', err)
                }
            }, 500) // 500ms debounce
            setTimer(newTimer)
        } else {
            setSuggestions([])
            setShowSuggestions(false)
        }
    }

    const handleSelect = async (description: string) => {
        setAddressLine1(description) // Fill input
        setShowSuggestions(false)

        // Use the selected description to fetch full details
        await fetchPropertyData(description)
    }

    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const fullAddress = getFullAddress()
        if (!fullAddress) return

        fetchPropertyData(fullAddress)
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="relative w-full max-w-lg bg-white border border-gray-100 rounded-2xl shadow-2xl p-8 animate-in fade-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-black transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-black mb-2">Add a Property</h2>
                    <p className="text-gray-500 text-sm">Enter address details to fetch property data.</p>
                </div>

                <form onSubmit={handleManualSubmit} className="space-y-4">
                    {/* Address Line 1 / Autocomplete */}
                    <div className="relative z-20">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                            Street Address (or City to search)
                        </label>
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                disabled={isLoading}
                                value={addressLine1}
                                onChange={handleAddressChange}
                                placeholder="123 Main St..."
                                autoFocus
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 pl-10 py-3 text-black placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white transition-all shadow-sm"
                            />
                        </div>

                        {showSuggestions && suggestions.length > 0 && (
                            <ul className="absolute z-30 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden max-h-60 overflow-y-auto">
                                {suggestions.map((item) => (
                                    <li
                                        key={item.place_id}
                                        onClick={() => handleSelect(item.description)}
                                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-gray-700 hover:text-black text-sm border-b border-gray-100 last:border-0"
                                    >
                                        <div className="font-semibold">{item.structured_formatting.main_text}</div>
                                        <div className="text-xs text-gray-400">{item.structured_formatting.secondary_text}</div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                City
                            </label>
                            <input
                                type="text"
                                disabled={isLoading}
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                placeholder="City"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-black placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white transition-all shadow-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                State
                            </label>
                            <input
                                type="text"
                                disabled={isLoading}
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                                placeholder="State"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-black placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                            Zip Code
                        </label>
                        <input
                            type="text"
                            disabled={isLoading}
                            value={zipCode}
                            onChange={(e) => setZipCode(e.target.value)}
                            placeholder="12345"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-black placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white transition-all shadow-sm"
                        />
                    </div>

                    <div className="pt-2 flex justify-end">
                        {isLoading ? (
                            <button disabled className="px-6 py-3 rounded-xl bg-purple-100 text-purple-600 font-bold flex items-center gap-2 cursor-wait">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Searching...
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={!addressLine1}
                                className="px-6 py-3 rounded-xl bg-black text-white font-bold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-black/10"
                            >
                                Search Property
                            </button>
                        )}
                    </div>
                </form>

                {error && (
                    <div className="mt-4 p-4 rounded-lg bg-red-50 border border-red-100 text-red-500 text-sm">
                        {error}
                        <div className="mt-2 text-xs opacity-70">
                            Double check the address details.
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
