'use client'

import React, { useState, useRef, useCallback } from 'react'
import { X, Search, Loader2, MapPin } from 'lucide-react'
import { Property, MapboxSuggestion } from './types'

interface AddPropertyModalProps {
    isOpen: boolean
    onClose: () => void
    onAdd: (property: Property) => void
}

export function AddPropertyModal({ isOpen, onClose, onAdd }: AddPropertyModalProps) {
    const [query, setQuery] = useState('')
    const [suggestions, setSuggestions] = useState<MapboxSuggestion[]>([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [isSearching, setIsSearching] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Selected address fields (filled by autocomplete or manual entry)
    const [addressLine1, setAddressLine1] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [zipCode, setZipCode] = useState('')
    const [county, setCounty] = useState('')

    // Whether user selected from autocomplete
    const [addressSelected, setAddressSelected] = useState(false)

    const timerRef = useRef<NodeJS.Timeout | null>(null)

    const resetForm = useCallback(() => {
        setQuery('')
        setSuggestions([])
        setShowSuggestions(false)
        setAddressLine1('')
        setCity('')
        setState('')
        setZipCode('')
        setCounty('')
        setAddressSelected(false)
        setError(null)
        setIsSearching(false)
        setIsSaving(false)
    }, [])

    if (!isOpen) return null

    const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setQuery(val)
        setAddressSelected(false)
        setError(null)

        if (timerRef.current) clearTimeout(timerRef.current)

        if (val.length >= 3) {
            timerRef.current = setTimeout(async () => {
                try {
                    setIsSearching(true)
                    const res = await fetch(`/api/property/mapbox-autocomplete?query=${encodeURIComponent(val)}`)
                    const data = await res.json()
                    setSuggestions(data.suggestions || [])
                    setShowSuggestions(true)
                } catch (err) {
                    console.error('Autocomplete error:', err)
                } finally {
                    setIsSearching(false)
                }
            }, 350)
        } else {
            setSuggestions([])
            setShowSuggestions(false)
        }
    }

    const handleSelectSuggestion = (suggestion: MapboxSuggestion) => {
        setQuery(suggestion.fullAddress)
        setAddressLine1(suggestion.street)
        setCity(suggestion.city)
        setState(suggestion.state)
        setZipCode(suggestion.zipCode)
        setCounty(suggestion.county)
        setAddressSelected(true)
        setShowSuggestions(false)
        setSuggestions([])
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Use autocomplete values or manual entry
        const finalAddress = addressLine1 || query
        const finalCity = city
        const finalState = state
        const finalZip = zipCode

        if (!finalAddress || !finalCity || !finalState || !finalZip) {
            setError('Please select an address from the dropdown or fill in all fields manually.')
            return
        }

        setIsSaving(true)
        setError(null)

        try {
            // Step 1: Try to get property details from RentCast/Zillow
            const fullAddress = `${finalAddress}, ${finalCity}, ${finalState} ${finalZip}`
            let propertyDetails: Record<string, unknown> = {}

            try {
                const detailRes = await fetch(`/api/rentcast/property-detail?address=${encodeURIComponent(fullAddress)}`)
                if (detailRes.ok) {
                    propertyDetails = await detailRes.json()
                }
            } catch {
                // Property details are optional — continue without them
                console.log('Could not fetch property details, saving address only')
            }

            // Step 2: Save to database via API
            const saveRes = await fetch('/api/properties', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    addressLine1: finalAddress,
                    city: finalCity,
                    state: finalState,
                    zipCode: finalZip,
                    county: county || null,
                    price: propertyDetails.price || null,
                    bedrooms: propertyDetails.bedrooms || null,
                    bathrooms: propertyDetails.bathrooms || null,
                    squareFootage: propertyDetails.squareFootage || null,
                    yearBuilt: propertyDetails.yearBuilt || null,
                    propertyType: propertyDetails.propertyType || null,
                    status: propertyDetails.status || 'Off Market',
                    imageUrl: propertyDetails.imageUrl || null,
                    description: propertyDetails.description || null,
                    daysOnMarket: propertyDetails.daysOnMarket || null,
                }),
            })

            if (!saveRes.ok) {
                const errData = await saveRes.json()
                throw new Error(errData.error || 'Failed to save property')
            }

            const { property } = await saveRes.json()
            onAdd(property)
            resetForm()
            onClose()
        } catch (err) {
            console.error('Error adding property:', err)
            const message = err instanceof Error ? err.message : 'Could not save property'
            setError(message)
        } finally {
            setIsSaving(false)
        }
    }

    const handleClose = () => {
        resetForm()
        onClose()
    }

    const isLoading = isSearching || isSaving

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={handleClose}
            />

            <div className="relative w-full max-w-lg bg-white border border-gray-100 rounded-2xl shadow-2xl p-8 animate-in fade-in zoom-in-95 duration-200">
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-black transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-black mb-2">Add a Property</h2>
                    <p className="text-gray-500 text-sm">Search for an address to add a property you&apos;re interested in.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Address Autocomplete */}
                    <div className="relative z-20">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                            Search Address
                        </label>
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            {isSearching && (
                                <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-500 animate-spin" />
                            )}
                            <input
                                type="text"
                                disabled={isSaving}
                                value={query}
                                onChange={handleQueryChange}
                                placeholder="Start typing an address..."
                                autoFocus
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 pl-10 py-3 text-black placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white transition-all shadow-sm"
                            />
                        </div>

                        {showSuggestions && suggestions.length > 0 && (
                            <ul className="absolute z-30 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden max-h-60 overflow-y-auto">
                                {suggestions.map((item) => (
                                    <li
                                        key={item.id}
                                        onClick={() => handleSelectSuggestion(item)}
                                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer text-gray-700 hover:text-black text-sm border-b border-gray-100 last:border-0 flex items-start gap-3"
                                    >
                                        <MapPin className="w-4 h-4 text-purple-500 mt-0.5 shrink-0" />
                                        <div>
                                            <div className="font-semibold">{item.street}</div>
                                            <div className="text-xs text-gray-400">
                                                {item.city}, {item.state} {item.zipCode}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Selected address display / manual override */}
                    {addressSelected && (
                        <div className="p-4 bg-purple-50 border border-purple-100 rounded-xl">
                            <div className="flex items-center gap-2 mb-2">
                                <MapPin className="w-4 h-4 text-purple-600" />
                                <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Selected Address</span>
                            </div>
                            <p className="text-sm font-semibold text-black">{addressLine1}</p>
                            <p className="text-xs text-gray-500">{city}, {state} {zipCode}{county ? ` · ${county}` : ''}</p>
                        </div>
                    )}

                    {/* Manual fields (shown when no autocomplete selection) */}
                    {!addressSelected && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                        City
                                    </label>
                                    <input
                                        type="text"
                                        disabled={isSaving}
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
                                        disabled={isSaving}
                                        value={state}
                                        onChange={(e) => setState(e.target.value)}
                                        placeholder="CA"
                                        maxLength={2}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-black placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white transition-all shadow-sm uppercase"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                    Zip Code
                                </label>
                                <input
                                    type="text"
                                    disabled={isSaving}
                                    value={zipCode}
                                    onChange={(e) => setZipCode(e.target.value)}
                                    placeholder="12345"
                                    maxLength={5}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-black placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:bg-white transition-all shadow-sm"
                                />
                            </div>
                        </>
                    )}

                    <div className="pt-2 flex justify-end">
                        {isSaving ? (
                            <button disabled className="px-6 py-3 rounded-xl bg-purple-100 text-purple-600 font-bold flex items-center gap-2 cursor-wait">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Adding Property...
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={!query && !addressLine1}
                                className="px-6 py-3 rounded-xl bg-black text-white font-bold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-black/10"
                            >
                                Add Property
                            </button>
                        )}
                    </div>
                </form>

                {error && (
                    <div className="mt-4 p-4 rounded-lg bg-red-50 border border-red-100 text-red-500 text-sm">
                        {error}
                        <div className="mt-2 text-xs opacity-70">
                            Double check the address details or try entering manually.
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
