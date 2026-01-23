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
    fees: number;
    points: number;
    logo?: string; // Optional URL or helper identifier
    bestMatch?: boolean;
}

export interface RateTrend {
    date: string;
    rate: number;
}
