'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useClerk, useUser } from '@clerk/nextjs'
import { useRouter, usePathname } from 'next/navigation'

const INACTIVITY_TIMEOUT_MS = 3 * 60 * 1000 // 3 minutes

/**
 * Monitors user activity (mouse, keyboard, touch, scroll).
 * Signs the user out after 3 minutes of inactivity.
 * Only active when the user is signed in.
 */
export function InactivityLogout(): null {
    const { signOut } = useClerk()
    const { isSignedIn, isLoaded } = useUser()
    const router = useRouter()
    const pathname = usePathname()
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const handleLogout = useCallback(async () => {
        try {
            await signOut()
            // Clear any persisted application data
            if (typeof window !== 'undefined') {
                localStorage.removeItem('lumina-application')
            }
            router.push('/')
        } catch (err) {
            console.error('Auto-logout error:', err)
            // Force reload as fallback
            window.location.href = '/'
        }
    }, [signOut, router])

    const resetTimer = useCallback(() => {
        if (timerRef.current) {
            clearTimeout(timerRef.current)
        }
        timerRef.current = setTimeout(handleLogout, INACTIVITY_TIMEOUT_MS)
    }, [handleLogout])

    useEffect(() => {
        if (!isLoaded || !isSignedIn) return

        // Activity events to monitor
        const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click']

        const onActivity = () => resetTimer()

        // Start the timer
        resetTimer()

        // Listen for activity
        events.forEach((event) => {
            window.addEventListener(event, onActivity, { passive: true })
        })

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current)
            }
            events.forEach((event) => {
                window.removeEventListener(event, onActivity)
            })
        }
    }, [isLoaded, isSignedIn, resetTimer, pathname])

    return null // This component renders nothing
}
