import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isUserAdmin, updateApplicationStatus } from '@/utils/admin/api'
import { unauthorized, notFound, badRequest, serverError, success } from '@/utils/admin/responses'
import { sendStatusUpdateEmail } from '@/utils/email/send-email'
import type { ApplicationStatus } from '@/types/database'

const VALID_STATUSES: ApplicationStatus[] = ['pending', 'in_review', 'approved', 'offers_ready', 'completed', 'denied', 'cancelled']

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const isAdmin = await isUserAdmin()
        if (!isAdmin) return unauthorized()

        const { id } = await params
        const app = await prisma.application.findUnique({ where: { id } })
        if (!app) return notFound('application')

        const body = await request.json()

        // Validation
        if (!body.status || !VALID_STATUSES.includes(body.status)) {
            return badRequest(`Status must be one of: ${VALID_STATUSES.join(', ')}`)
        }
        if (body.admin_notes && typeof body.admin_notes !== 'string') {
            return badRequest('Admin notes must be a string')
        }

        const ok = await updateApplicationStatus(id, {
            status: body.status,
            admin_notes: body.admin_notes
        })
        if (!ok) return serverError('Failed to update status')

        // Send notification email (non-blocking — status is already saved)
        if (body.notify_client) {
            try {
                const application = await prisma.application.findUnique({
                    where: { id },
                    select: { userId: true }
                })
                const userId = application?.userId
                if (userId) {
                    const profile = await prisma.profile.findUnique({
                        where: { id: userId },
                        select: { email: true, fullName: true }
                    })
                    if (profile?.email) {
                        await sendStatusUpdateEmail({
                            to: profile.email,
                            name: profile.fullName || 'Valued Client',
                            status: body.status as ApplicationStatus,
                            applicationId: id,
                        })
                    }
                }
            } catch (emailErr) {
                console.error('Failed to send status notification email:', emailErr)
                // Don't fail the request — status was already updated
            }
        }

        return success()
    } catch (error) {
        console.error('Status update error:', error)
        return serverError('Failed to update status')
    }
}
