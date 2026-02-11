'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { AuthUser } from '@/types/auth'
import { toast } from 'sonner'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import { PropertyCard } from './PropertyCard'
import { AddPropertyCard } from './AddPropertyCard'
import { AddPropertyModal } from './AddPropertyModal'
import { PropertyDetailsModal } from './PropertyDetailsModal'
import { Property } from './types'
import { Loader2, Home } from 'lucide-react'

interface PropertiesClientProps {
    user: AuthUser | null
}

export function PropertiesClient({ user }: PropertiesClientProps) {
    const [properties, setProperties] = useState<Property[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [choosingId, setChoosingId] = useState<string | null>(null)

    // Fetch properties from API on mount
    const fetchProperties = useCallback(async () => {
        try {
            const res = await fetch('/api/properties')
            if (!res.ok) throw new Error('Failed to fetch')
            const data = await res.json()
            setProperties(data.properties || [])
        } catch (error) {
            console.error('Error fetching properties:', error)
            toast.error('Failed to load properties')
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchProperties()
    }, [fetchProperties])

    const handleAddProperty = (property: Property) => {
        setProperties(prev => [property, ...prev])
        toast.success('Property added successfully')
    }

    const handleDeleteProperty = async (propertyId: string) => {
        setDeletingId(propertyId)
        try {
            const res = await fetch(`/api/properties/${propertyId}`, {
                method: 'DELETE',
            })

            if (!res.ok) throw new Error('Failed to delete')

            setProperties(prev => prev.filter(p => p.id !== propertyId))
            toast.success('Property removed')
        } catch (error) {
            console.error('Error deleting property:', error)
            toast.error('Failed to remove property')
        } finally {
            setDeletingId(null)
        }
    }

    const handleChooseProperty = async (propertyId: string) => {
        setChoosingId(propertyId)
        try {
            const res = await fetch(`/api/properties/${propertyId}/choose`, {
                method: 'POST',
            })

            if (!res.ok) throw new Error('Failed to set chosen property')

            const { property: updatedProperty } = await res.json()

            setProperties(prev =>
                prev.map(p => {
                    if (p.id === propertyId) return { ...p, isChosen: updatedProperty.isChosen }
                    // Un-choose all others if this one is now chosen
                    if (updatedProperty.isChosen) return { ...p, isChosen: false }
                    return p
                }).sort((a, b) => {
                    // Chosen property always first
                    if (a.isChosen && !b.isChosen) return -1
                    if (!a.isChosen && b.isChosen) return 1
                    return 0
                })
            )

            // Update the detail modal if it's open
            if (selectedProperty?.id === propertyId) {
                setSelectedProperty(prev => prev ? { ...prev, isChosen: updatedProperty.isChosen } : null)
            }

            if (updatedProperty.isChosen) {
                toast.success('Property set as your chosen property! Application data updated.')
            } else {
                toast.info('Property is no longer your chosen property.')
            }
        } catch (error) {
            console.error('Error choosing property:', error)
            toast.error('Failed to update chosen property')
        } finally {
            setChoosingId(null)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 selection:bg-purple-100 font-sans text-gray-900">
            <DashboardSidebar />

            <main className="container mx-auto px-6 py-10 pt-20">
                <div className="mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">My Properties</h1>
                    <p className="text-gray-500">
                        Add properties you&apos;re interested in, then choose one to link to your application.
                    </p>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex items-center justify-center py-24">
                        <div className="flex flex-col items-center gap-4">
                            <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
                            <p className="text-sm text-gray-400 font-medium">Loading your properties...</p>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && properties.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-20 h-20 rounded-full bg-purple-50 flex items-center justify-center mb-6">
                            <Home className="w-10 h-10 text-purple-400" />
                        </div>
                        <h2 className="text-xl font-bold text-black mb-2">No properties yet</h2>
                        <p className="text-gray-500 mb-8 max-w-md">
                            Start by adding properties you&apos;re interested in. You can search by address and we&apos;ll pull in the details automatically.
                        </p>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="px-6 py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-all shadow-lg shadow-black/10"
                        >
                            Add Your First Property
                        </button>
                    </div>
                )}

                {/* Property Grid */}
                {!isLoading && properties.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <AddPropertyCard onClick={() => setIsAddModalOpen(true)} />

                        {properties.map((property) => (
                            <PropertyCard
                                key={property.id}
                                property={property}
                                onClick={() => setSelectedProperty(property)}
                                onDelete={(e) => {
                                    e.stopPropagation()
                                    handleDeleteProperty(property.id)
                                }}
                                onChoose={(e) => {
                                    e.stopPropagation()
                                    handleChooseProperty(property.id)
                                }}
                                isDeleting={deletingId === property.id}
                                isChoosing={choosingId === property.id}
                            />
                        ))}
                    </div>
                )}
            </main>

            {/* Modals */}
            <AddPropertyModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddProperty}
            />

            <PropertyDetailsModal
                property={selectedProperty}
                onClose={() => setSelectedProperty(null)}
                onChoose={handleChooseProperty}
                isChoosing={choosingId === selectedProperty?.id}
            />
        </div>
    )
}
