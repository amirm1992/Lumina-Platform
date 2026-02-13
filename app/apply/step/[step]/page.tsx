'use client'

import React, { useEffect, useRef } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useClerk, useUser } from '@clerk/nextjs'
import { useApplicationStore } from '@/store/applicationStore'
import { trackStepView } from '@/lib/analytics'
import {
    ProductSelection, PropertyType, PropertyUsage, LocationInput, ValueLoanSliders,
    PersonalIdentity, CreditHealth, EmploymentStatus, AnnualIncome, LiquidAssets,
    SSNInput, CreateAccount,
} from '@/components/apply/steps'

const stepComponents: Record<number, React.ComponentType> = {
    1: ProductSelection, 2: PropertyType, 3: PropertyUsage, 4: LocationInput, 5: ValueLoanSliders,
    6: PersonalIdentity, 7: CreditHealth, 8: EmploymentStatus, 9: AnnualIncome, 10: LiquidAssets,
    11: SSNInput, 12: CreateAccount,
}

export default function StepPage() {
    const params = useParams()
    const router = useRouter()
    const searchParams = useSearchParams()
    const { signOut } = useClerk()
    const { isSignedIn, isLoaded: isUserLoaded } = useUser()
    const { setCurrentStep, setPropertyState, propertyState, resetApplication } = useApplicationStore()
    const stepNumber = parseInt(params.step as string, 10)
    const hasReset = useRef(false)

    // When landing on step 1: sign out any existing session and reset application data
    // This ensures every new application starts completely fresh
    useEffect(() => {
        if (stepNumber === 1 && !hasReset.current && isUserLoaded) {
            hasReset.current = true
            resetApplication()
            if (isSignedIn) {
                signOut()
            }
        }
    }, [stepNumber, resetApplication, isUserLoaded, isSignedIn, signOut])

    // Capture the state param from the URL (e.g. ?state=FL from a state landing page)
    useEffect(() => {
        const stateParam = searchParams.get('state')
        if (stateParam && !propertyState) {
            setPropertyState(stateParam.toUpperCase())
        }
    }, [searchParams, propertyState, setPropertyState])

    useEffect(() => {
        if (stepNumber >= 1 && stepNumber <= 12) setCurrentStep(stepNumber)
        else router.replace('/apply/step/1')
    }, [stepNumber, setCurrentStep, router])

    // ── Analytics: track funnel step view ──
    useEffect(() => {
        if (stepNumber >= 1 && stepNumber <= 12) {
            trackStepView(stepNumber)
        }
    }, [stepNumber])

    const StepComponent = stepComponents[stepNumber]
    if (!StepComponent) return null
    return <StepComponent />
}
