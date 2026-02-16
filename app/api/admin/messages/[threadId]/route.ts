import { NextRequest, NextResponse } from 'next/server'
import { isUserAdmin } from '@/utils/admin/api'
import prisma from '@/lib/prisma'

// DELETE /api/admin/messages/[threadId] — admin deletes a thread and all its replies
export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ threadId: string }> }
) {
    try {
        const admin = await isUserAdmin()
        if (!admin) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const { threadId } = await params

        const thread = await prisma.messageThread.findUnique({ where: { id: threadId } })
        if (!thread) {
            return NextResponse.json({ error: 'Thread not found' }, { status: 404 })
        }

        // Delete replies first, then the thread
        await prisma.messageReply.deleteMany({ where: { threadId } })
        await prisma.messageThread.delete({ where: { id: threadId } })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('DELETE /api/admin/messages/[threadId] error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
