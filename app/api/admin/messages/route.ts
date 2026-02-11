import { NextResponse } from 'next/server'
import { isUserAdmin } from '@/utils/admin/api'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET /api/admin/messages — get all message threads (admin view)
export async function GET() {
    try {
        const admin = await isUserAdmin()
        if (!admin) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const threads = await prisma.messageThread.findMany({
            include: {
                replies: {
                    orderBy: { createdAt: 'asc' },
                },
            },
            orderBy: { updatedAt: 'desc' },
        })

        // Fetch profiles for user names
        const userIds = Array.from(new Set(threads.map((t) => t.userId)))
        const profiles = await prisma.profile.findMany({
            where: { id: { in: userIds } },
            select: { id: true, email: true, fullName: true },
        })
        const profileMap = Object.fromEntries(profiles.map((p) => [p.id, p]))

        return NextResponse.json({
            threads: threads.map((t) => {
                const profile = profileMap[t.userId]
                return {
                    id: t.id,
                    user_id: t.userId,
                    user_name: profile?.fullName || 'Unknown',
                    user_email: profile?.email || '',
                    subject: t.subject,
                    status: t.status,
                    created_at: t.createdAt.toISOString(),
                    updated_at: t.updatedAt.toISOString(),
                    unread_count: t.replies.filter((r) => r.senderRole === 'client' && !r.isRead).length,
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
                }
            }),
        })
    } catch (error) {
        console.error('GET /api/admin/messages error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
