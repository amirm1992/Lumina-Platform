'use client'

import { useState, useEffect, useMemo } from 'react'
import type { Application, LenderOffer } from '@/types/database'
import type { UserProfile, Lender } from '../types'
import type { AuthUser } from '@/types/auth'
import { CONSTANT_LENDERS, getPlaceholderLenders } from '@/constants/lenders'

// ============================================
// Helpers (pure functions, no side effects)
// ============================================

function calculateMonthlyPayment(principal: number, annualRate: number, years: number): number {
    const r = annualRate / 100 / 12
    const n = years * 12
    if (!principal || !r || !n) return 0
    return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
}

function normalizeLenderName(name: string): string {
    return (name || '').toLowerCase().trim().replace(/\s+/g, ' ')
}

function dbOfferMatchesConstant(dbName: string, constantName: string): boolean {
    const d = normalizeLenderName(dbName)
    const c = normalizeLenderName(constantName)
    if (d === c) return true
    if (c === 'uwm' && (d.includes('united wholesale') || d.includes('uwm') || d === 'u.w.m.')) return true
    return false
}

function offerToLender(offer: LenderOffer, loanAmount: number): Lender {
    const rate = offer.interest_rate ?? 0
    const term = offer.loan_term ?? 30
    const calculatedPayment = calculateMonthlyPayment(loanAmount, rate, term)
    return {
        id: offer.id,
        name: offer.lender_name,
        rate,
        apr: offer.apr ?? rate,
        monthlyPayment: calculatedPayment || (offer.monthly_payment ?? 0),
        loanTerm: term,
        loanType: (offer.loan_type?.toUpperCase() || 'CONVENTIONAL') as Lender['loanType'],
        points: offer.points ?? 0,
        closingCosts: offer.closing_costs ?? 0,
        isRecommended: offer.is_recommended,
        bestMatch: offer.is_best_match ?? false,
        logo: offer.lender_logo ?? undefined,
    }
}

function mergeOffersWithConstants(dbOffers: Lender[]): Lender[] {
    const mergedOffers = CONSTANT_LENDERS.map((constant, index) => {
        const match = dbOffers.find((o) => dbOfferMatchesConstant(o.name, constant.name))
        if (match) return match
        return {
            id: `placeholder-${index}`,
            name: constant.name,
            logo: constant.logo,
            rate: 0,
            apr: 0,
            monthlyPayment: 0,
            loanTerm: 30,
            loanType: 'CONVENTIONAL',
            points: 0,
            closingCosts: 0,
            isRecommended: false,
            isPlaceholder: true,
        } as Lender
    })

    const otherOffers = dbOffers.filter(
        (o) => !CONSTANT_LENDERS.some((c) => dbOfferMatchesConstant(o.name, c.name))
    )

    return [...mergedOffers, ...otherOffers].sort((a, b) => {
        if (a.isPlaceholder && !b.isPlaceholder) return 1
        if (!a.isPlaceholder && b.isPlaceholder) return -1
        return a.rate - b.rate
    })
}

// ============================================
// Hook
// ============================================

interface UseDashboardDataReturn {
    application: Application | null
    offers: Lender[]
    userProfile: UserProfile
    setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>
    loading: boolean
    fetchError: string | null
    selectedLender: Lender | undefined
    selectedLenderId: string
    setSelectedLenderId: (id: string) => void
    ltv: string
}

export function useDashboardData(user: AuthUser | null): UseDashboardDataReturn {
    const [application, setApplication] = useState<Application | null>(null)
    const [offers, setOffers] = useState<Lender[]>(getPlaceholderLenders())
    const [loading, setLoading] = useState(true)
    const [fetchError, setFetchError] = useState<string | null>(null)
    const [selectedLenderId, setSelectedLenderId] = useState<string>('')

    const [userProfile, setUserProfile] = useState<UserProfile>({
        name:
            user?.user_metadata?.first_name ||
            user?.user_metadata?.full_name?.split(' ')[0] ||
            user?.email?.split('@')[0] ||
            'User',
        creditScore: 0,
        estimatedLoanAmount: 0,
        downPayment: 0,
        homeValue: 0,
        location: '',
    })

    // Fetch application and offers
    useEffect(() => {
        let cancelled = false

        async function fetchData() {
            try {
                const response = await fetch(`/api/applications?t=${Date.now()}`, {
                    cache: 'no-store',
                })
                if (!response.ok) throw new Error('Failed to fetch applications')

                const data = await response.json()
                if (cancelled) return

                if (data.applications?.length > 0) {
                    const apps = data.applications as Application[]
                    const appWithOffers = apps.find(
                        (a) => a.lender_offers && a.lender_offers.length > 0
                    )
                    const app = appWithOffers ?? apps[0]
                    setApplication(app)

                    setUserProfile((prev) => ({
                        ...prev,
                        creditScore: app.credit_score || 0,
                        estimatedLoanAmount: app.loan_amount || 0,
                        homeValue: app.property_value || 0,
                        downPayment: (app.property_value || 0) - (app.loan_amount || 0),
                        location: app.zip_code || '',
                    }))

                    if (app.lender_offers && app.lender_offers.length > 0) {
                        const dbOffers = app.lender_offers.map((o) =>
                            offerToLender(o, app.loan_amount || 0)
                        )
                        setOffers(mergeOffersWithConstants(dbOffers))
                    } else {
                        setOffers(getPlaceholderLenders())
                    }
                }
            } catch (error) {
                console.error('Error fetching application:', error)
                if (!cancelled) {
                    setFetchError(
                        'Unable to load your application data. Please try refreshing the page.'
                    )
                }
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        fetchData()
        return () => {
            cancelled = true
        }
    }, [])

    // Auto-select first real offer
    useEffect(() => {
        if (offers.length > 0 && !selectedLenderId) {
            const firstReal = offers.find((o) => !o.isPlaceholder)
            setSelectedLenderId(firstReal?.id || offers[0].id)
        }
    }, [offers, selectedLenderId])

    const selectedLender = useMemo(
        () => offers.find((l) => l.id === selectedLenderId) || offers[0],
        [selectedLenderId, offers]
    )

    const ltv = useMemo(() => {
        if (!userProfile.homeValue || userProfile.homeValue <= 0) return '0.0'
        return ((userProfile.estimatedLoanAmount / userProfile.homeValue) * 100).toFixed(1)
    }, [userProfile.estimatedLoanAmount, userProfile.homeValue])

    return {
        application,
        offers,
        userProfile,
        setUserProfile,
        loading,
        fetchError,
        selectedLender,
        selectedLenderId,
        setSelectedLenderId,
        ltv,
    }
}
