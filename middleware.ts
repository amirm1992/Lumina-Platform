import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Define protected routes
const isProtectedRoute = createRouteMatcher([
    '/dashboard(.*)',
    '/dochub(.*)',
    '/messages(.*)',
    '/properties(.*)',
    '/admin(.*)',
])

// Define public routes (accessible without auth)
const isPublicRoute = createRouteMatcher([
    '/',
    '/login(.*)',
    '/signup(.*)',
    '/apply(.*)',
    '/how-it-works(.*)',
    '/privacy(.*)',
    '/terms(.*)',
    '/disclosures(.*)',
    '/forgot-password(.*)',
    '/reset-password(.*)',
    '/api/applications(.*)',
    '/api/mortgage-rate(.*)',
    '/api/property/(.*)',
    '/api/rentcast/(.*)',
])

export default clerkMiddleware(async (auth, req) => {
    // Check if route is protected
    if (isProtectedRoute(req)) {
        await auth.protect()
    }
})

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
}
