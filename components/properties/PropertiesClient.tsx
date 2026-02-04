'use client'

import React, { useState } from 'react'
import { AuthUser } from '@/types/auth'
import { DashboardNavbar } from '@/components/dashboard/DashboardNavbar'
import { PropertyCard } from './PropertyCard'
import { AddPropertyCard } from './AddPropertyCard'
import { AddPropertyModal } from './AddPropertyModal'
import { PropertyDetailsModal } from './PropertyDetailsModal'
import { Property } from './types'

interface PropertiesClientProps {
    user: AuthUser | null
}

export function PropertiesClient({ user }: PropertiesClientProps) {
    const [properties, setProperties] = useState<Property[]>([])
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)

    const handleAddProperty = (property: Property) => {
        setProperties(prev => [property, ...prev])
    }

    const handleDeleteProperty = (propertyId: string) => {
        setProperties(prev => prev.filter(p => p.id !== propertyId))
    }

    return (
        <div className="min-h-screen bg-gray-50 selection:bg-purple-100 font-sans text-gray-900">
            <DashboardNavbar user={user} />

            <main className="container mx-auto px-6 py-10">
                <div className="mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">My Properties</h1>
                    <p className="text-gray-500">Manage and analyze your potential investments.</p>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {/* First Tile: Add Property */}
                    <AddPropertyCard onClick={() => setIsAddModalOpen(true)} />

                    {/* Property List */}
                    {properties.map((property, index) => (
                        <PropertyCard
                            key={property.id || index}
                            property={property}
                            onClick={() => setSelectedProperty(property)}
                            onDelete={(e) => {
                                e.stopPropagation()
                                handleDeleteProperty(property.id)
                            }}
                        />
                    ))}
                </div>
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
            />
        </div>
    )
}
