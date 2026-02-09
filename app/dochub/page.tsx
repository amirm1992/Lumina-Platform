import type { Metadata } from 'next'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import { DocHubClient } from '@/components/dochub/DocHubClient'
import { mapDocument } from '@/lib/mappers'

export const metadata: Metadata = {
    title: 'Document Hub',
    description: 'Upload and manage your mortgage documents securely. Track document status and approvals.',
    robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function DocHubPage() {
    const { userId } = await auth()

    if (!userId) {
        return redirect('/login')
    }

    // Fetch documents scoped to this user only
    const rawDocs = await prisma.document.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    })

    const documents = rawDocs.map(mapDocument)

    return <DocHubClient userId={userId} initialDocuments={documents} />
}
