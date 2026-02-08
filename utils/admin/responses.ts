import { NextResponse } from 'next/server'

/** Consistent error/success shape for admin API routes */
export function unauthorized() {
    return NextResponse.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 })
}

export function notFound(resource: 'application' | 'offer') {
    const message = resource === 'application' ? 'Application not found' : 'Offer not found'
    return NextResponse.json({ error: message, code: 'NOT_FOUND' }, { status: 404 })
}

export function badRequest(message: string) {
    return NextResponse.json({ error: message, code: 'BAD_REQUEST' }, { status: 400 })
}

export function serverError(message: string = 'Internal server error') {
    return NextResponse.json({ error: message, code: 'SERVER_ERROR' }, { status: 500 })
}

export function success<T extends Record<string, unknown>>(data?: T) {
    return NextResponse.json(data ?? { success: true })
}
