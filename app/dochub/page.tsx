import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import { DocHubClient } from '@/components/dochub/DocHubClient'
import { DocFile } from '@/components/dochub/types'

export default async function DocHubPage() {
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

    // TODO: Migrate documents table to Prisma and fetch from there
    // For now, return empty array until documents are migrated
    const initialFiles: DocFile[] = []

    return <DocHubClient user={userData} initialFiles={initialFiles} />
}
