import { NextResponse } from 'next/server'

// Legacy auth callback redirect — Clerk handles auth natively.
// Kept for backwards compatibility with any old bookmarked/emailed links.
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const next = searchParams.get('next') ?? '/dashboard'
    const origin = new URL(request.url).origin
    return NextResponse.redirect(`${origin}${next.startsWith('/') ? next : `/${next}`}`)
}
