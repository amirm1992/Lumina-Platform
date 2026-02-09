import { redirect } from 'next/navigation'
import { isUserAdmin, getCurrentUser } from '@/utils/admin/api'
import { AdminLayoutClient } from '@/components/admin/AdminLayoutClient'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // Check if user is admin
    const isAdmin = await isUserAdmin()

    if (!isAdmin) {
        redirect('/admin-login')
    }

    // Get user email for the header
    const user = await getCurrentUser()
    const email = user?.emailAddresses[0]?.emailAddress || 'Admin'

    return (
        <AdminLayoutClient email={email}>
            {children}
        </AdminLayoutClient>
    )
}
