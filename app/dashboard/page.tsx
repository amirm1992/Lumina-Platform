import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { DashboardClient } from '@/components/dashboard/DashboardClient'

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
        }
    }

    return <DashboardClient user={userData} />
}
