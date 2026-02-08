import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isUserAdmin, updateApplicationStatus } from '@/utils/admin/api'
import { unauthorized, notFound, serverError, success } from '@/utils/admin/responses'
import { sendStatusUpdateEmail, EmailStatus } from '@/utils/email/send-email'

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const isAdmin = await isUserAdmin()
    if (!isAdmin) return unauthorized()

    const { id } = await params
    const app = await prisma.application.findUnique({ where: { id } })
    if (!app) return notFound('application')

    const body = await request.json()
    const ok = await updateApplicationStatus(id, {
        status: body.status,
        admin_notes: body.admin_notes
    })
    if (!ok) return serverError('Failed to update status')

    if (body.notify_client) {
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
                    status: body.status as EmailStatus,
                    applicationId: id,
                })
            }
        }
    }

    return success()
}
