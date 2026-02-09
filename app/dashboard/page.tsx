import type { Metadata } from 'next'
import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { DashboardClient } from '@/components/dashboard/DashboardClient'

export const metadata: Metadata = {
    title: 'Dashboard',
    description: 'View your personalized mortgage offers, track your application status, and manage your home financing journey.',
    robots: { index: false, follow: false },
}

export default async function DashboardPage() {
    const { userId } = await auth()
    const user = await currentUser()

    if (!userId || !user) {
        return redirect('/login')
    }

    // Create a user object compatible with the existing DashboardClient
    const userData = {
        id: userId,
        email: user.emailAddresses[0]?.emailAddress || '',
        user_metadata: {
            full_name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.emailAddresses[0]?.emailAddress,
            first_name: user.firstName || ''
        }
    }

    return <DashboardClient user={userData} />
}
