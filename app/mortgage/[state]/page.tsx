import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SITE_CONFIG } from '@/lib/constants'
import { getStateConfig, getAllStateSlugs } from '@/lib/state-configs'
import { StateLandingPage } from '@/components/mortgage/StateLandingPage'

// ── Static params for all configured states ─────────────────────

export function generateStaticParams() {
    return getAllStateSlugs().map((slug) => ({ state: slug }))
}

// ── Dynamic metadata per state ──────────────────────────────────

interface PageProps {
    params: Promise<{ state: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { state } = await params
    const config = getStateConfig(state)
    if (!config) return {}

    const url = `${SITE_CONFIG.url}/mortgage/${config.slug}`

    return {
        title: config.meta.title,
        description: config.meta.description,
        alternates: {
            canonical: url,
        },
        openGraph: {
            title: config.meta.title,
            description: config.meta.description,
            url,
            siteName: SITE_CONFIG.name,
            type: 'website',
            locale: 'en_US',
        },
        twitter: {
            card: 'summary_large_image',
            title: config.meta.title,
            description: config.meta.description,
        },
    }
}

// ── JSON-LD structured data ─────────────────────────────────────

function StateJsonLd({ config }: { config: NonNullable<ReturnType<typeof getStateConfig>> }) {
    const structuredData = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': ['LocalBusiness', 'FinancialService'],
                name: `${SITE_CONFIG.name} — ${config.name} Mortgages`,
                description: config.meta.description,
                url: `${SITE_CONFIG.url}/mortgage/${config.slug}`,
                logo: `${SITE_CONFIG.url}${SITE_CONFIG.logo}`,
                telephone: SITE_CONFIG.phoneRaw,
                areaServed: {
                    '@type': 'State',
                    name: config.schema.areaServed,
                },
                address: {
                    '@type': 'PostalAddress',
                    streetAddress: SITE_CONFIG.address.street,
                    addressLocality: SITE_CONFIG.address.city,
                    addressRegion: SITE_CONFIG.address.state,
                    postalCode: SITE_CONFIG.address.zip,
                    addressCountry: SITE_CONFIG.address.country,
                },
            },
            {
                '@type': 'WebPage',
                name: config.meta.title,
                description: config.meta.description,
                url: `${SITE_CONFIG.url}/mortgage/${config.slug}`,
                isPartOf: {
                    '@type': 'WebSite',
                    name: SITE_CONFIG.name,
                    url: SITE_CONFIG.url,
                },
            },
            {
                '@type': 'FinancialProduct',
                name: `${config.name} Mortgage Loans`,
                description: `Compare mortgage rates from top ${config.name} lenders.`,
                provider: {
                    '@type': 'Organization',
                    name: SITE_CONFIG.nmls.brokerName,
                },
                areaServed: config.schema.areaServed,
                category: 'Mortgage',
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

// ── Page ─────────────────────────────────────────────────────────

export default async function MortgageStatePage({ params }: PageProps) {
    const { state } = await params
    const config = getStateConfig(state)

    if (!config) {
        notFound()
    }

    return (
        <>
            <StateJsonLd config={config} />
            <StateLandingPage config={config} />
        </>
    )
}
