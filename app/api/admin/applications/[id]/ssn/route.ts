import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isUserAdmin } from '@/utils/admin/api'
import { unauthorized, notFound, serverError } from '@/utils/admin/responses'
import { decrypt } from '@/lib/encryption'
import { NextResponse } from 'next/server'

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const isAdmin = await isUserAdmin()
        if (!isAdmin) return unauthorized()

        const { id } = await params
        const app = await prisma.application.findUnique({
            where: { id },
            select: { ssnEncrypted: true, consentSoftPull: true },
        })

        if (!app) return notFound('application')

        if (!app.ssnEncrypted) {
            return NextResponse.json({
                ssn: null,
                consent: app.consentSoftPull,
                message: 'No SSN on file for this application',
            })
        }

        const ssn = decrypt(app.ssnEncrypted)

        return NextResponse.json({
            ssn,
            consent: app.consentSoftPull,
        })
    } catch (error) {
        console.error('SSN retrieval error:', error)
        return serverError('Failed to retrieve SSN')
    }
}
