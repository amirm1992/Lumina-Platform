import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { MessagesClient } from '@/components/messages/MessagesClient'

export default async function MessagesPage() {
    const { userId } = await auth()
    const user = await currentUser()

    if (!userId || !user) {
        return redirect('/login')
    }

    // Create a user object compatible with the existing component
    const userData = {
        id: userId,
        email: user.emailAddresses[0]?.emailAddress || '',
        user_metadata: {
            full_name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.emailAddresses[0]?.emailAddress,
        }
    }

    return <MessagesClient user={userData} />
}
