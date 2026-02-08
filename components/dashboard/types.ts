export interface UserProfile {
    name: string;
    creditScore: number;
    estimatedLoanAmount: number;
    downPayment: number;
    homeValue: number;
    location: string;
}

export interface Lender {
    id: string;
    name: string;
    rate: number;
    apr: number;
    monthlyPayment: number;
    fees?: number;
    points: number;
    logo?: string;
    bestMatch?: boolean;
    loanTerm?: number;
    loanType?: 'CONVENTIONAL' | 'FHA' | 'VA' | 'JUMBO' | 'USDA';
    closingCosts?: number;
    isRecommended?: boolean;
    isPlaceholder?: boolean;
    description?: string;
}

export interface RateTrend {
    date: string;
    rate: number;
}
