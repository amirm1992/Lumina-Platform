import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import { sendAdminNewMessageEmail } from '@/utils/email/send-email'

export const dynamic = 'force-dynamic'

// GET /api/messages — get current user's message threads
export async function GET() {
    try {
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const threads = await prisma.messageThread.findMany({
            where: { userId },
            include: {
                replies: {
                    orderBy: { createdAt: 'asc' },
                },
            },
            orderBy: { updatedAt: 'desc' },
        })

        return NextResponse.json({
            threads: threads.map((t) => ({
                id: t.id,
                user_id: t.userId,
                subject: t.subject,
                status: t.status,
                created_at: t.createdAt.toISOString(),
                updated_at: t.updatedAt.toISOString(),
                replies: t.replies.map((r) => ({
                    id: r.id,
                    thread_id: r.threadId,
                    sender_id: r.senderId,
                    sender_role: r.senderRole,
                    sender_name: r.senderName,
                    body: r.body,
                    is_read: r.isRead,
                    created_at: r.createdAt.toISOString(),
                })),
            })),
        })
    } catch (error) {
        console.error('GET /api/messages error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// POST /api/messages — create a new message thread
export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth()
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await currentUser()
        const senderName = user
            ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.emailAddresses[0]?.emailAddress || 'Client'
            : 'Client'
        const senderEmail = user?.emailAddresses[0]?.emailAddress || ''

        const body = await req.json()
        const { subject, message } = body as { subject?: string; message?: string }

        if (!subject?.trim() || !message?.trim()) {
            return NextResponse.json({ error: 'Subject and message are required' }, { status: 400 })
        }

        const thread = await prisma.messageThread.create({
            data: {
                userId,
                subject: subject.trim(),
                replies: {
                    create: {
                        senderId: userId,
                        senderRole: 'client',
                        senderName,
                        body: message.trim(),
                        isRead: true, // sender has read their own message
                    },
                },
            },
            include: { replies: true },
        })

        // Notify admin (non-blocking)
        try {
            await sendAdminNewMessageEmail({
                senderName,
                senderEmail,
                subject: subject.trim(),
                preview: message.trim().slice(0, 200),
                threadId: thread.id,
            })
        } catch (emailErr) {
            console.error('Admin message notification warning:', emailErr)
        }

        return NextResponse.json({
            success: true,
            thread: {
                id: thread.id,
                subject: thread.subject,
                status: thread.status,
                created_at: thread.createdAt.toISOString(),
                replies: thread.replies.map((r) => ({
                    id: r.id,
                    sender_id: r.senderId,
                    sender_role: r.senderRole,
                    sender_name: r.senderName,
                    body: r.body,
                    is_read: r.isRead,
                    created_at: r.createdAt.toISOString(),
                })),
            },
        })
    } catch (error) {
        console.error('POST /api/messages error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
