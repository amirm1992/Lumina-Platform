import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { isUserAdmin } from '@/utils/admin/api'
import prisma from '@/lib/prisma'
import { sendClientMessageReplyEmail } from '@/utils/email/send-email'

// POST /api/admin/messages/[threadId]/replies — admin replies to a thread
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ threadId: string }> }
) {
    try {
        const admin = await isUserAdmin()
        if (!admin) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const { userId: adminId } = await auth()
        const { threadId } = await params

        const thread = await prisma.messageThread.findUnique({ where: { id: threadId } })
        if (!thread) {
            return NextResponse.json({ error: 'Thread not found' }, { status: 404 })
        }

        const body = await req.json()
        const { message } = body as { message?: string }

        if (!message?.trim()) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 })
        }

        // Get admin profile name
        const adminProfile = adminId
            ? await prisma.profile.findUnique({ where: { id: adminId }, select: { fullName: true } })
            : null
        const adminName = adminProfile?.fullName || 'Lumina Support'

        const reply = await prisma.messageReply.create({
            data: {
                threadId,
                senderId: adminId || 'admin',
                senderRole: 'admin',
                senderName: adminName,
                body: message.trim(),
                isRead: false, // client hasn't read it yet
            },
        })

        // Mark client messages as read (admin has seen them by replying)
        await prisma.messageReply.updateMany({
            where: { threadId, senderRole: 'client', isRead: false },
            data: { isRead: true },
        })

        // Touch thread updatedAt
        await prisma.messageThread.update({
            where: { id: threadId },
            data: { updatedAt: new Date() },
        })

        // Email the client (non-blocking)
        try {
            const clientProfile = await prisma.profile.findUnique({
                where: { id: thread.userId },
                select: { email: true, fullName: true },
            })
            if (clientProfile?.email) {
                await sendClientMessageReplyEmail({
                    to: clientProfile.email,
                    name: clientProfile.fullName || 'Valued Client',
                    subject: thread.subject,
                    preview: message.trim().slice(0, 200),
                })
            }
        } catch (emailErr) {
            console.error('Client reply email warning:', emailErr)
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
        console.error('POST /api/admin/messages/[threadId]/replies error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// PATCH /api/admin/messages/[threadId]/replies — mark client messages as read
export async function PATCH(
    _req: NextRequest,
    { params }: { params: Promise<{ threadId: string }> }
) {
    try {
        const admin = await isUserAdmin()
        if (!admin) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const { threadId } = await params

        await prisma.messageReply.updateMany({
            where: { threadId, senderRole: 'client', isRead: false },
            data: { isRead: true },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('PATCH /api/admin/messages/[threadId]/replies error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
