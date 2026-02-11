import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'
import { isUserAdmin } from '@/utils/admin/api'
import { sendDocumentRequestEmail } from '@/utils/email/send-email'

// GET /api/admin/applications/[id]/document-requests — list all requests for an application
export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const admin = await isUserAdmin()
        if (!admin) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const { id: applicationId } = await params
        const requests = await prisma.documentRequest.findMany({
            where: { applicationId },
            orderBy: { createdAt: 'desc' },
        })

        return NextResponse.json({
            document_requests: requests.map((r) => ({
                id: r.id,
                application_id: r.applicationId,
                title: r.title,
                category: r.category,
                instructions: r.instructions,
                status: r.status,
                created_by: r.createdBy,
                fulfilled_at: r.fulfilledAt?.toISOString() ?? null,
                cancelled_at: r.cancelledAt?.toISOString() ?? null,
                created_at: r.createdAt.toISOString(),
                updated_at: r.updatedAt.toISOString(),
            })),
        })
    } catch (error) {
        console.error('GET document-requests error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// POST /api/admin/applications/[id]/document-requests — create a new request
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const admin = await isUserAdmin()
        if (!admin) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }

        const { userId: adminId } = await auth()
        const { id: applicationId } = await params

        const app = await prisma.application.findUnique({
            where: { id: applicationId },
            select: { id: true, userId: true },
        })
        if (!app) {
            return NextResponse.json({ error: 'Application not found' }, { status: 404 })
        }

        const body = await request.json()
        const { title, category, instructions, notify_client } = body as {
            title?: string
            category?: string
            instructions?: string
            notify_client?: boolean
        }

        if (!title || typeof title !== 'string' || !title.trim()) {
            return NextResponse.json({ error: 'Title is required' }, { status: 400 })
        }

        const docRequest = await prisma.documentRequest.create({
            data: {
                applicationId,
                title: title.trim(),
                category: category?.trim() || null,
                instructions: instructions?.trim() || null,
                createdBy: adminId || 'admin',
            },
        })

        // Send email to client if admin opted to notify
        if (notify_client && app.userId) {
            try {
                const profile = await prisma.profile.findUnique({
                    where: { id: app.userId },
                    select: { email: true, fullName: true },
                })
                if (profile?.email) {
                    await sendDocumentRequestEmail({
                        to: profile.email,
                        name: profile.fullName || 'Valued Client',
                        title: title.trim(),
                        instructions: instructions?.trim() || undefined,
                    })
                }
            } catch (emailErr) {
                console.error('Doc request email warning:', emailErr)
            }
        }

        return NextResponse.json({
            success: true,
            document_request: {
                id: docRequest.id,
                application_id: docRequest.applicationId,
                title: docRequest.title,
                category: docRequest.category,
                instructions: docRequest.instructions,
                status: docRequest.status,
                created_at: docRequest.createdAt.toISOString(),
            },
        })
    } catch (error) {
        console.error('POST document-requests error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
