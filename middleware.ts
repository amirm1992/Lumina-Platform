import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Define protected routes (require authentication)
const isProtectedRoute = createRouteMatcher([
    '/dashboard(.*)',
    '/dochub(.*)',
    '/messages(.*)',
    '/properties(.*)',
    '/admin/(.*)',        // Admin pages (but NOT /admin-login)
    '/api/admin/(.*)',    // Admin API routes
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
