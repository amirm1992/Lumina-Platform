import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Log In',
    description: 'Log in to your Lumina account to manage mortgage applications, view offers, and track your home financing progress.',
    robots: { index: false, follow: false },
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
