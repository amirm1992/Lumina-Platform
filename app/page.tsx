import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/Navbar'
import { Hero } from '@/components/landing/Hero'
import { Features } from '@/components/landing/Features'
import { Footer } from '@/components/landing/Footer'
import { SITE_CONFIG } from '@/lib/constants'

export const metadata: Metadata = {
    title: `${SITE_CONFIG.name} - AI-Powered Online Mortgage Platform`,
    description:
        'Compare mortgage rates from 50+ lenders instantly. Get pre-approved in minutes with AI-driven rate matching. Conventional, FHA, VA, and jumbo loans available.',
    alternates: {
        canonical: '/',
    },
}

// JSON-LD structured data for rich search results
function JsonLd() {
    const structuredData = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Organization',
                name: SITE_CONFIG.name,
                legalName: SITE_CONFIG.nmls.brokerName,
                url: SITE_CONFIG.url,
                logo: `${SITE_CONFIG.url}${SITE_CONFIG.logo}`,
                contactPoint: {
                    '@type': 'ContactPoint',
                    telephone: SITE_CONFIG.phoneRaw,
                    contactType: 'customer service',
                    availableLanguage: 'English',
                },
                address: {
                    '@type': 'PostalAddress',
                    streetAddress: SITE_CONFIG.address.street,
                    addressLocality: SITE_CONFIG.address.city,
                    addressRegion: SITE_CONFIG.address.state,
                    postalCode: SITE_CONFIG.address.zip,
                    addressCountry: SITE_CONFIG.address.country,
                },
                sameAs: [
                    SITE_CONFIG.nmls.consumerAccessUrl,
                ],
            },
            {
                '@type': 'WebSite',
                name: SITE_CONFIG.name,
                url: SITE_CONFIG.url,
                description: SITE_CONFIG.description,
            },
            {
                '@type': 'FinancialProduct',
                name: 'Mortgage Loan Comparison',
                description:
                    'Compare mortgage rates from top national lenders. Conventional, FHA, VA, and jumbo loans available.',
                provider: {
                    '@type': 'Organization',
                    name: SITE_CONFIG.nmls.brokerName,
                },
                category: 'Mortgage',
                offers: {
                    '@type': 'AggregateOffer',
                    priceCurrency: 'USD',
                    offerCount: '50+',
                },
            },
        ],
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
    )
}

export default function Home() {
    return (
        <>
            <JsonLd />
            <main className="min-h-screen bg-white">
                <Navbar />
                <Hero />
                <Features />
                <Footer />
            </main>
        </>
    )
}
