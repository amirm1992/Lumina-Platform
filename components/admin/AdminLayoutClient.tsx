'use client'

import { useState } from 'react'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminHeader } from '@/components/admin/AdminHeader'

interface AdminLayoutClientProps {
    email: string
    children: React.ReactNode
}

export function AdminLayoutClient({ email, children }: AdminLayoutClientProps) {
    const [mobileOpen, setMobileOpen] = useState(false)

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminHeader
                email={email}
                onMobileMenuToggle={() => setMobileOpen(prev => !prev)}
            />
            <div className="flex">
                <AdminSidebar
                    mobileOpen={mobileOpen}
                    onMobileClose={() => setMobileOpen(false)}
                />
                <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
                    {children}
                </main>
            </div>
        </div>
    )
}
