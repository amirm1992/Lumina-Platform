import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Orbitron } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { ComplianceFooter } from '@/components/layout/ComplianceFooter'
import { SITE_CONFIG } from '@/lib/constants'

const orbitron = Orbitron({
    subsets: ['latin'],
    variable: '--font-brand',
    display: 'swap',
})

// Next.js 14+ requires viewport to be exported separately
export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    themeColor: '#ffffff',
}

export const metadata: Metadata = {
    metadataBase: new URL(SITE_CONFIG.url),
    title: {
        default: `${SITE_CONFIG.name} - ${SITE_CONFIG.tagline}`,
        template: `%s | ${SITE_CONFIG.name}`,
    },
    description: SITE_CONFIG.description,
    keywords: [
        'mortgage',
        'home loan',
        'refinance',
        'HELOC',
        'mortgage rates',
        'AI mortgage',
        'digital mortgage',
        'pre-approval',
        'mortgage lender',
        'FHA loan',
        'VA loan',
        'jumbo loan',
        'first-time homebuyer',
        'mortgage calculator',
    ],
    authors: [{ name: SITE_CONFIG.legalName }],
    creator: SITE_CONFIG.legalName,
    publisher: SITE_CONFIG.legalName,
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: SITE_CONFIG.url,
        title: `${SITE_CONFIG.name} - ${SITE_CONFIG.tagline}`,
        description: SITE_CONFIG.description,
        siteName: SITE_CONFIG.name,
        images: [
            {
                url: SITE_CONFIG.ogImage,
                width: 1200,
                height: 630,
                alt: `${SITE_CONFIG.name} - ${SITE_CONFIG.tagline}`,
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: `${SITE_CONFIG.name} - ${SITE_CONFIG.tagline}`,
        description: SITE_CONFIG.description,
        images: [SITE_CONFIG.ogImage],
        creator: SITE_CONFIG.social.twitter,
    },
    icons: {
        icon: SITE_CONFIG.logo,
        shortcut: SITE_CONFIG.logo,
        apple: SITE_CONFIG.logo,
    },
    alternates: {
        canonical: SITE_CONFIG.url,
    },
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
