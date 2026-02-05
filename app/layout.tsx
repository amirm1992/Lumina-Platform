import './globals.css'
import { Orbitron } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { ComplianceFooter } from '@/components/layout/ComplianceFooter'

const orbitron = Orbitron({
    subsets: ['latin'],
    variable: '--font-brand'
})

export const metadata = {
    title: {
        default: 'Lumina - AI-Powered Mortgage Platform',
        template: '%s | Lumina'
    },
    description: 'The future of mortgages. Instant pre-approvals, AI-driven rate comparison, and a 100% digital workflow.',
    keywords: ['mortgage', 'fintech', 'home loan', 'refinance', 'AI mortgage', 'digital lender'],
    authors: [{ name: 'Lumina Financial Technologies' }],
    creator: 'Lumina Financial Technologies',
    themeColor: '#ffffff',
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://lumina.finance',
        title: 'Lumina - AI-Powered Mortgage Platform',
        description: 'Instant pre-approvals, AI-driven rate comparison, and a 100% digital workflow.',
        siteName: 'Lumina',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Lumina Platform'
            }
        ]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Lumina - AI-Powered Mortgage Platform',
        description: 'The future of mortgages is here.',
        images: ['/og-image.png'],
        creator: '@luminafinance'
    },
    icons: {
        icon: '/logo-transparent.png',
        shortcut: '/logo-transparent.png',
        apple: '/logo-transparent.png'
    },
    viewport: {
        width: 'device-width',
        initialScale: 1,
        maximumScale: 1
    }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <ClerkProvider>
            <html lang="en" className={orbitron.variable}>
                <body className="flex flex-col min-h-screen">
                    <main className="flex-1">
                        {children}
                    </main>
                    <ComplianceFooter />
                </body>
            </html>
        </ClerkProvider>
    )
}
