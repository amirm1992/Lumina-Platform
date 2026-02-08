'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ClipboardList, LogOut } from 'lucide-react'

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/applications', label: 'Applications', icon: ClipboardList },
]

export function AdminSidebar() {
    const pathname = usePathname()

    return (
        <aside className="w-64 min-h-[calc(100vh-64px)] bg-white border-r border-gray-200 p-4 flex flex-col">
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
        </aside>
    )
}
