// ============================================
// Site-wide constants
// Centralized configuration for SEO, branding, and shared values
// ============================================

export const SITE_CONFIG = {
  name: 'Lumina',
  legalName: 'Lumina Financial Technologies',
  tagline: 'AI-Powered Online Mortgage Platform',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://golumina.net',
  description:
    'The future of mortgages. Instant pre-approvals, AI-driven rate comparison, and a 100% digital workflow.',
  email: 'hello@golumina.net',
  phone: '(858) 312-4900',
  phoneRaw: '+18583124900',

  // Licensing
  nmls: {
    individual: '1631748',
    broker: '135622',
    brokerName: 'C2 Financial Corporation',
    consumerAccessUrl:
      'https://www.nmlsconsumeraccess.org/EntityDetails.aspx/COMPANY/135622',
  },

  // Address
  address: {
    street: '12230 El Camino Real #100',
    city: 'San Diego',
    state: 'CA',
    zip: '92130',
    country: 'US',
  },

  // Social
  social: {
    twitter: '@luminafinance',
    facebook: '',
    instagram: '',
  },

  // OG Image
  ogImage: '/og-image.png',
  logo: '/logo-transparent.png',
} as const

// Financial defaults
export const FINANCIAL_DEFAULTS = {
  fallbackMortgageRate: 6.89,
  defaultLoanAmount: 350_000,
  defaultInterestRate: 6.5,
  defaultLoanTerm: 30,
  defaultHomeValue: 400_000,
  defaultDownPaymentRatio: 0.2,
  defaultPropertyTax: 450,
  defaultHomeInsurance: 120,

  // Validation limits
  maxPropertyValue: 100_000_000,
  maxLoanAmount: 100_000_000,
  maxAnnualIncome: 100_000_000,
  maxLiquidAssets: 1_000_000_000,
  maxFileSize: 10 * 1024 * 1024, // 10 MB

  // Credit score mapping (categorical → numeric)
  creditScoreMap: {
    excellent: 780,
    good: 710,
    fair: 640,
    poor: 560,
  } as Record<string, number>,
} as const

// Storage defaults
export const STORAGE_CONFIG = {
  region: process.env.SPACES_REGION || 'nyc3',
  bucket: process.env.SPACES_BUCKET || 'lumina-docs',
  endpoint:
    process.env.SPACES_ENDPOINT ||
    `https://${process.env.SPACES_REGION || 'nyc3'}.digitaloceanspaces.com`,
  presignedUrlExpiry: 900, // 15 minutes in seconds
} as const

// Application status labels (for display)
export const APPLICATION_STATUS_LABELS: Record<string, string> = {
  pending: 'Pending Review',
  in_review: 'In Review',
  approved: 'Approved',
  offers_ready: 'Offers Ready',
  completed: 'Completed',
  denied: 'Denied',
  cancelled: 'Cancelled',
}

// Validation constants
export const VALIDATION = {
  productTypes: ['purchase', 'refinance', 'heloc'] as const,
  propertyTypes: [
    'single_family',
    'single-family',
    'condo',
    'townhouse',
    'townhome',
    'multi_family',
    'multi-family',
    'other',
  ] as const,
  propertyUsages: ['primary', 'secondary', 'investment'] as const,
  employmentStatuses: ['salaried', 'self-employed', 'retired', 'military'] as const,
  creditScores: ['excellent', 'good', 'fair', 'poor'] as const,
  zipCodeRegex: /^\d{5}$/,
  emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  maxNameLength: 100,
} as const
