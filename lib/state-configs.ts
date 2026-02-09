// ============================================
// State-specific landing page configurations
// Add a new state by adding a new entry — no code changes needed.
// ============================================

import { SITE_CONFIG } from '@/lib/constants'

export interface StateConfig {
    /** URL slug used in /mortgage/{slug} */
    slug: string
    /** Two-letter state code (e.g. 'FL') */
    code: string
    /** Full state name */
    name: string

    // Hero
    headline: string
    subheadline: string
    ctaText: string

    // Trust & compliance
    licensingText: string
    complianceDisclaimer: string

    // Market insight (short paragraph)
    marketInsight: string

    // SEO
    meta: {
        title: string
        description: string
    }

    // Schema.org structured data type
    schema: {
        areaServed: string
    }

    // Loan types available in this state
    loanTypes: Array<{
        name: string
        description: string
    }>
}

// ── State Configurations ──────────────────────────────────────────

export const STATE_CONFIGS: Record<string, StateConfig> = {
    florida: {
        slug: 'florida',
        code: 'FL',
        name: 'Florida',

        headline: 'Smart Mortgage Options for Florida Homebuyers — 100% Online',
        subheadline:
            'Compare rates from top lenders in seconds. AI-powered rate matching, soft credit pull, and a fully digital closing process — built for Florida homebuyers.',
        ctaText: 'Start My Florida Application',

        licensingText: `Licensed to originate mortgages in the State of Florida`,
        complianceDisclaimer: `${SITE_CONFIG.name} is a brand of ${SITE_CONFIG.nmls.brokerName} | NMLS #${SITE_CONFIG.nmls.broker}. Licensed by the Florida Office of Financial Regulation. Equal Housing Lender. NMLS Consumer Access: ${SITE_CONFIG.nmls.consumerAccessUrl}`,

        marketInsight:
            "Florida's housing market continues to attract buyers nationwide with competitive rates and growing demand across Miami, Tampa, Orlando, and Jacksonville. Securing the right mortgage has never been more important — Lumina helps Florida homebuyers compare offers from 50+ lenders to find their best rate, all online.",

        meta: {
            title: `Florida Mortgage Rates — Compare 50+ Lenders | ${SITE_CONFIG.name}`,
            description:
                'Compare mortgage rates from top Florida lenders. Get pre-approved in minutes with AI-driven rate matching. Purchase, refinance, and HELOC — 100% online.',
        },

        schema: {
            areaServed: 'Florida, US',
        },

        loanTypes: [
            { name: 'Conventional Loans', description: 'Traditional financing with competitive Florida rates' },
            { name: 'FHA Loans', description: 'Low down payment options — popular with FL first-time buyers' },
            { name: 'VA Loans', description: 'Exclusive benefits for Florida veterans and active military' },
            { name: 'Jumbo Loans', description: 'Financing for high-value Florida properties' },
            { name: 'HELOC', description: 'Tap into your Florida home equity' },
            { name: 'Investment Properties', description: 'Financing for Florida rental and investment homes' },
        ],
    },
}

// ── Helpers ────────────────────────────────────────────────────────

export function getStateConfig(slug: string): StateConfig | null {
    return STATE_CONFIGS[slug.toLowerCase()] ?? null
}

export function getAllStateSlugs(): string[] {
    return Object.keys(STATE_CONFIGS)
}
