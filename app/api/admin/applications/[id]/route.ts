import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isUserAdmin } from '@/utils/admin/api'
import { unauthorized, notFound, serverError, success } from '@/utils/admin/responses'

export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const isAdmin = await isUserAdmin()
        if (!isAdmin) return unauthorized()

        const { id: applicationId } = await params
        const existing = await prisma.application.findUnique({ where: { id: applicationId } })
        if (!existing) return notFound('application')

        // Delete associated documents from storage first
        const documents = await prisma.document.findMany({
            where: { applicationId },
        })

        if (documents.length > 0) {
            try {
                const { deleteFileFromSpaces } = await import('@/lib/storage')
                await Promise.allSettled(
                    documents.map((doc) => deleteFileFromSpaces(doc.storageKey))
                )
            } catch (storageErr) {
                console.error('Storage cleanup failed (continuing with DB delete):', storageErr)
            }

            // Unlink documents from this application (don't delete the DB records)
            await prisma.document.updateMany({
                where: { applicationId },
                data: { applicationId: null },
            })
        }

        // Delete the application (lender_offers cascade-delete automatically)
        await prisma.application.delete({ where: { id: applicationId } })

        return success()
    } catch (error) {
        console.error('Delete application error:', error)
        return serverError('Failed to delete application')
    }
}
