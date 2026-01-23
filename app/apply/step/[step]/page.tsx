'use client'

import React, { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useApplicationStore } from '@/store/applicationStore'
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
    const { setCurrentStep } = useApplicationStore()
    const stepNumber = parseInt(params.step as string, 10)

    useEffect(() => {
        if (stepNumber >= 1 && stepNumber <= 12) setCurrentStep(stepNumber)
        else router.replace('/apply/step/1')
    }, [stepNumber, setCurrentStep, router])

    const StepComponent = stepComponents[stepNumber]
    if (!StepComponent) return null
    return <StepComponent />
}
