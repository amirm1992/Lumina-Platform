import './globals.css'
import Script from 'next/script'
import type { Metadata, Viewport } from 'next'
import { Orbitron } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from 'sonner'
import { ComplianceFooter } from '@/components/layout/ComplianceFooter'
import { SITE_CONFIG } from '@/lib/constants'

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID

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
    verification: {
        google: 'ZQQLSX1-tV62kq5KbjV1ft10G4UswZuOHkk9Gnjjtic',
    },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <ClerkProvider>
            <html lang="en" className={orbitron.variable}>
                <head>
                    {/* Google Tag Manager */}
                    {GTM_ID && (
                        <Script
                            id="gtm-script"
                            strategy="afterInteractive"
                            dangerouslySetInnerHTML={{
                                __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
                            }}
                        />
                    )}
                </head>
                <body className="flex flex-col min-h-screen">
                    {/* Google Tag Manager (noscript fallback) */}
                    {GTM_ID && (
                        <noscript>
                            <iframe
                                src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
                                height="0"
                                width="0"
                                style={{ display: 'none', visibility: 'hidden' }}
                            />
                        </noscript>
                    )}
                    <main className="flex-1">
                        {children}
                    </main>
                    <Toaster position="bottom-right" richColors closeButton />
                    <ComplianceFooter />
                </body>
            </html>
        </ClerkProvider>
    )
}
