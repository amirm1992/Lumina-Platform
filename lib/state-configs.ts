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

        headline: 'Florida Mortgage Rates — Compare 50+ Lenders & Save',
        subheadline:
            'Find the best Florida mortgage rates in minutes. AI-powered rate matching across 50+ lenders, soft credit pull that won\'t affect your score, and a fully digital closing process — built for Florida homebuyers.',
        ctaText: 'Get My Florida Rate',

        licensingText: `Licensed to originate mortgages in the State of Florida`,
        complianceDisclaimer: `${SITE_CONFIG.name} is a brand of ${SITE_CONFIG.nmls.brokerName} | NMLS #${SITE_CONFIG.nmls.broker}. Licensed by the Florida Office of Financial Regulation. Equal Housing Lender. NMLS Consumer Access: ${SITE_CONFIG.nmls.consumerAccessUrl}`,

        marketInsight:
            "Florida mortgage rates remain competitive as the state's housing market attracts buyers nationwide — from Miami and Fort Lauderdale to Tampa, Orlando, and Jacksonville. Whether you're a first-time homebuyer in Florida or refinancing an existing home loan, securing the best rate matters. Lumina compares Florida mortgage rates from 50+ lenders so you can find the lowest rate for your situation, entirely online.",

        meta: {
            title: `Best Florida Mortgage Rates 2026 — Compare 50+ Lenders Online | ${SITE_CONFIG.name}`,
            description:
                'Compare the best Florida mortgage rates from 50+ lenders. Get pre-approved in minutes — FHA, VA, conventional, jumbo, and HELOC. Soft credit pull, 100% online. No obligation.',
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
