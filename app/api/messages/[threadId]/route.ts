import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

// DELETE /api/messages/[threadId] — client deletes their own thread
export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ threadId: string }> }
) {
    try {
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { threadId } = await params

        // Verify the thread belongs to the current user
        const thread = await prisma.messageThread.findUnique({ where: { id: threadId } })
        if (!thread || thread.userId !== userId) {
            return NextResponse.json({ error: 'Thread not found' }, { status: 404 })
        }

        // Delete replies first, then the thread
        await prisma.messageReply.deleteMany({ where: { threadId } })
        await prisma.messageThread.delete({ where: { id: threadId } })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('DELETE /api/messages/[threadId] error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
