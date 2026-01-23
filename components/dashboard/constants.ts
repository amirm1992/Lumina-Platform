import { Lender, RateTrend } from './types';

export const MOCK_LENDERS: Lender[] = [
    {
        id: '1',
        name: 'Nebula Finance',
        rate: 6.125,
        apr: 6.24,
        monthlyPayment: 2431,
        fees: 1200,
        points: 0,
        logo: 'https://via.placeholder.com/40', // Placeholder
        bestMatch: false
    },
    {
        id: '2',
        name: 'Apex Mortgages',
        rate: 5.875,
        apr: 6.115,
        monthlyPayment: 2364,
        fees: 3500,
        points: 0.5,
        logo: 'https://via.placeholder.com/40',
        bestMatch: true
    },
    {
        id: '3',
        name: 'Horizon Capital',
        rate: 6.250,
        apr: 6.35,
        monthlyPayment: 2510,
        fees: 800,
        points: 0,
        bestMatch: false
    },
    {
        id: '4',
        name: 'Zen Bank',
        rate: 6.000,
        apr: 6.15,
        monthlyPayment: 2398,
        fees: 1500,
        points: 0.125,
        bestMatch: false
    }
];

export const RATE_TRENDS: RateTrend[] = [
    { date: 'Aug', rate: 6.8 },
    { date: 'Sep', rate: 6.7 },
    { date: 'Oct', rate: 6.85 },
    { date: 'Nov', rate: 6.5 },
    { date: 'Dec', rate: 6.3 },
    { date: 'Jan', rate: 6.125 }
];
