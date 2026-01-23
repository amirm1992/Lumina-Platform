import { redirect } from 'next/navigation'
import { isUserAdmin } from '@/utils/admin/api'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminHeader } from '@/components/admin/AdminHeader'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // Check if user is admin
    const isAdmin = await isUserAdmin()

    if (!isAdmin) {
        redirect('/dashboard')
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminHeader />
            <div className="flex">
                <AdminSidebar />
                <main className="flex-1 p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
