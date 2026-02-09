'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ClipboardList, LogOut, X } from 'lucide-react'
import { useEffect } from 'react'

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/applications', label: 'Applications', icon: ClipboardList },
]

interface AdminSidebarProps {
    mobileOpen: boolean
    onMobileClose: () => void
}

export function AdminSidebar({ mobileOpen, onMobileClose }: AdminSidebarProps) {
    const pathname = usePathname()

    // Close mobile sidebar on route change
    useEffect(() => {
        onMobileClose()
    }, [pathname]) // eslint-disable-line react-hooks/exhaustive-deps

    // Prevent body scroll when mobile sidebar is open
    useEffect(() => {
        if (mobileOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => { document.body.style.overflow = '' }
    }, [mobileOpen])

    const sidebarContent = (
        <>
            <nav className="space-y-2 flex-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href ||
                        (item.href !== '/admin' && pathname.startsWith(item.href))

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                ? 'bg-purple-50 text-purple-700 font-medium'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            <item.icon className={`w-5 h-5 ${isActive ? 'text-purple-600' : ''}`} />
                            {item.label}
                        </Link>
                    )
                })}
            </nav>

            <div className="mt-auto pt-4 border-t border-gray-200">
                <Link
                    href="/dashboard"
                    className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-gray-700 transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    Exit Admin
                </Link>
            </div>
        </>
    )

    return (
        <>
            {/* Desktop sidebar — hidden on mobile */}
            <aside className="hidden lg:flex w-64 min-h-[calc(100vh-64px)] bg-white border-r border-gray-200 p-4 flex-col">
                {sidebarContent}
            </aside>

            {/* Mobile sidebar overlay */}
            {mobileOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                        onClick={onMobileClose}
                    />

                    {/* Drawer */}
                    <div className="absolute top-0 left-0 w-64 h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-200">
                        {/* Header */}
                        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
                            <span className="font-bold text-gray-900">Navigation</span>
                            <button
                                onClick={onMobileClose}
                                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                                aria-label="Close sidebar"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Nav content */}
                        <div className="flex-1 flex flex-col p-4">
                            {sidebarContent}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
