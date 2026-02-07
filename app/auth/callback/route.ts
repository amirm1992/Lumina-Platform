import { NextResponse } from 'next/server'

// Legacy auth callback (Supabase). Clerk handles auth; redirect to dashboard.
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const next = searchParams.get('next') ?? '/dashboard'
    const origin = new URL(request.url).origin
    return NextResponse.redirect(`${origin}${next.startsWith('/') ? next : `/${next}`}`)
}
