import { Lender } from "../components/dashboard/types";

export interface LenderMeta {
    name: string;
    logo: string;
    description?: string;
}

export const CONSTANT_LENDERS: LenderMeta[] = [
    {
        name: 'UWM',
        logo: '/logos/logo-3.png',
        description: 'United Wholesale Mortgage'
    },
    {
        name: 'Rocket Mortgage',
        logo: '/logos/logo-4.jpg',
        description: 'America\'s largest mortgage lender'
    },
    {
        name: 'Freedom Mortgage',
        logo: '/logos/logo-1.png',
        description: 'FHA & VA Specialist'
    },
    {
        name: 'Kind Lending',
        logo: '/logos/kind-lending.png',
        description: 'People-first mortgage lender'
    },
    {
        name: 'Pennymac',
        logo: '/logos/pennymac.png',
        description: 'Leading national mortgage lender'
    },
    {
        name: 'New American Funding',
        logo: '/logos/new-american-funding.png',
        description: 'Independent mortgage lender'
    },
    {
        name: 'Equity Prime Mortgage',
        logo: '/logos/equity-prime-mortgage.png',
        description: 'Full-service mortgage lender'
    },
    {
        name: 'NewRez',
        logo: '/logos/newrez.png',
        description: 'Residential mortgage lender & servicer'
    },
    {
        name: 'Plaza Home Mortgage',
        logo: '/logos/plaza-home-mortgage.png',
        description: 'Wholesale & correspondent lender'
    }
];

// Helper to get logo for a lender
export function getLenderLogo(name: string): string {
    const lender = CONSTANT_LENDERS.find(l => l.name.toLowerCase() === name.toLowerCase());
    return lender?.logo || '';
}

// Helper to create placeholder lenders
export function getPlaceholderLenders(): Lender[] {
    return CONSTANT_LENDERS.map((meta, index) => ({
        id: `placeholder-${index}`,
        name: meta.name,
        logo: meta.logo,
        rate: 0,
        apr: 0,
        monthlyPayment: 0,
        loanTerm: 30,
        loanType: 'CONVENTIONAL',
        points: 0,
        closingCosts: 0,
        isRecommended: false,
        isBestMatch: false,
        isPlaceholder: true // New property for styling
    }));
}
