'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ProductType = 'purchase' | 'refinance' | 'heloc' | null
export type PropertyType = 'single-family' | 'condo' | 'townhome' | 'multi-family' | null
export type PropertyUsage = 'primary' | 'secondary' | 'investment' | null
export type CreditScore = 'excellent' | 'good' | 'fair' | 'poor' | null
export type EmploymentStatus = 'salaried' | 'self-employed' | 'retired' | 'military' | null

export interface ApplicationState {
    productType: ProductType
    propertyType: PropertyType
    propertyUsage: PropertyUsage
    zipCode: string
    estimatedValue: number
    loanAmount: number
    firstName: string
    lastName: string
    phone: string
    creditScore: CreditScore
    employmentStatus: EmploymentStatus
    annualIncome: number
    liquidAssets: number
    ssn: string
    email: string
    password: string
    currentStep: number
    isCompleted: boolean
    setProductType: (type: ProductType) => void
    setPropertyType: (type: PropertyType) => void
    setPropertyUsage: (usage: PropertyUsage) => void
    setZipCode: (zip: string) => void
    setEstimatedValue: (value: number) => void
    setLoanAmount: (amount: number) => void
    setFirstName: (name: string) => void
    setLastName: (name: string) => void
    setPhone: (phone: string) => void
    setCreditScore: (score: CreditScore) => void
    setEmploymentStatus: (status: EmploymentStatus) => void
    setAnnualIncome: (income: number) => void
    setLiquidAssets: (assets: number) => void
    setSSN: (ssn: string) => void
    setEmail: (email: string) => void
    setPassword: (password: string) => void
    setCurrentStep: (step: number) => void
    nextStep: () => void
    prevStep: () => void
    completeApplication: () => void
    resetApplication: () => void
}

const initialState = {
    productType: null as ProductType,
    propertyType: null as PropertyType,
    propertyUsage: null as PropertyUsage,
    zipCode: '',
    estimatedValue: 400000,
    loanAmount: 320000,
    firstName: '',
    lastName: '',
    phone: '',
    creditScore: null as CreditScore,
    employmentStatus: null as EmploymentStatus,
    annualIncome: 0,
    liquidAssets: 0,
    ssn: '',
    email: '',
    password: '',
    currentStep: 1,
    isCompleted: false,
}

export const useApplicationStore = create<ApplicationState>()(
    persist(
        (set) => ({
            ...initialState,
            setProductType: (type) => set({ productType: type }),
            setPropertyType: (type) => set({ propertyType: type }),
            setPropertyUsage: (usage) => set({ propertyUsage: usage }),
            setZipCode: (zip) => set({ zipCode: zip }),
            setEstimatedValue: (value) => set({ estimatedValue: value }),
            setLoanAmount: (amount) => set({ loanAmount: amount }),
            setFirstName: (name) => set({ firstName: name }),
            setLastName: (name) => set({ lastName: name }),
            setPhone: (phone) => set({ phone: phone }),
            setCreditScore: (score) => set({ creditScore: score }),
            setEmploymentStatus: (status) => set({ employmentStatus: status }),
            setAnnualIncome: (income) => set({ annualIncome: income }),
            setLiquidAssets: (assets) => set({ liquidAssets: assets }),
            setSSN: (ssn) => set({ ssn: ssn }),
            setEmail: (email) => set({ email: email }),
            setPassword: (password) => set({ password: password }),
            setCurrentStep: (step) => set({ currentStep: step }),
            nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, 12) })),
            prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),
            completeApplication: () => set({ isCompleted: true }),
            resetApplication: () => set(initialState),
        }),
        { name: 'lumina-application' }
    )
)
