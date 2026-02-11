import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import { sendAdminNewMessageEmail } from '@/utils/email/send-email'

// POST /api/messages/[threadId]/replies — client adds a reply to a thread
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ threadId: string }> }
) {
    try {
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { threadId } = await params

        // Verify thread belongs to user
        const thread = await prisma.messageThread.findUnique({ where: { id: threadId } })
        if (!thread || thread.userId !== userId) {
            return NextResponse.json({ error: 'Thread not found' }, { status: 404 })
        }

        const user = await currentUser()
        const senderName = user
            ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.emailAddresses[0]?.emailAddress || 'Client'
            : 'Client'
        const senderEmail = user?.emailAddresses[0]?.emailAddress || ''

        const body = await req.json()
        const { message } = body as { message?: string }

        if (!message?.trim()) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 })
        }

        const reply = await prisma.messageReply.create({
            data: {
                threadId,
                senderId: userId,
                senderRole: 'client',
                senderName,
                body: message.trim(),
                isRead: true,
            },
        })

        // Touch thread updatedAt
        await prisma.messageThread.update({
            where: { id: threadId },
            data: { status: 'open' },
        })

        // Notify admin (non-blocking)
        try {
            await sendAdminNewMessageEmail({
                senderName,
                senderEmail,
                subject: `Re: ${thread.subject}`,
                preview: message.trim().slice(0, 200),
                threadId,
            })
        } catch (emailErr) {
            console.error('Admin reply notification warning:', emailErr)
        }

        return NextResponse.json({
            success: true,
            reply: {
                id: reply.id,
                sender_id: reply.senderId,
                sender_role: reply.senderRole,
                sender_name: reply.senderName,
                body: reply.body,
                is_read: reply.isRead,
                created_at: reply.createdAt.toISOString(),
            },
        })
    } catch (error) {
        console.error('POST /api/messages/[threadId]/replies error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// PATCH /api/messages/[threadId]/replies — mark all replies as read
export async function PATCH(
    _req: NextRequest,
    { params }: { params: Promise<{ threadId: string }> }
) {
    try {
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { threadId } = await params

        const thread = await prisma.messageThread.findUnique({ where: { id: threadId } })
        if (!thread || thread.userId !== userId) {
            return NextResponse.json({ error: 'Thread not found' }, { status: 404 })
        }

        // Mark admin replies as read (client reading them)
        await prisma.messageReply.updateMany({
            where: { threadId, senderRole: 'admin', isRead: false },
            data: { isRead: true },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('PATCH /api/messages/[threadId]/replies error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
