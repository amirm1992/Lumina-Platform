'use client'

import React, { useState } from 'react'
import { X, ChevronRight, ChevronLeft, User, Home, Briefcase, FileText, Loader2, Check, Users } from 'lucide-react'
import type { PreApprovalFormData, MaritalStatus, HousingStatus, MortgageType, AmortizationType } from '@/types/database'

// ── US States for dropdowns ──
const US_STATES = [
    'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY',
    'LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND',
    'OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC'
]

const MONTHS = [
    { value: 1, label: 'January' }, { value: 2, label: 'February' }, { value: 3, label: 'March' },
    { value: 4, label: 'April' }, { value: 5, label: 'May' }, { value: 6, label: 'June' },
    { value: 7, label: 'July' }, { value: 8, label: 'August' }, { value: 9, label: 'September' },
    { value: 10, label: 'October' }, { value: 11, label: 'November' }, { value: 12, label: 'December' },
]

interface PreApprovalModalProps {
    isOpen: boolean
    onClose: () => void
    applicationId: string
    lenderName: string
    /** Pre-computed from propertyValue - loanAmount */
    defaultDownPayment?: number
    /** Pre-filled from step 8 employment status */
    employmentStatus?: string | null
}

const TOTAL_STEPS = 4

const STEP_INFO = [
    { icon: User, title: 'Borrower Information', subtitle: 'Personal details for your loan application' },
    { icon: Home, title: 'Current Residence', subtitle: 'Where do you currently live?' },
    { icon: Briefcase, title: 'Employment Details', subtitle: 'Tell us about your current employment' },
    { icon: FileText, title: 'Loan Details & Co-Borrower', subtitle: 'Final loan preferences' },
]

export function PreApprovalModal({
    isOpen,
    onClose,
    applicationId,
    lenderName,
    defaultDownPayment = 0,
    employmentStatus,
}: PreApprovalModalProps) {
    const [step, setStep] = useState(1)
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // ── Form State ──
    const [dobMonth, setDobMonth] = useState('')
    const [dobDay, setDobDay] = useState('')
    const [dobYear, setDobYear] = useState('')
    const [maritalStatus, setMaritalStatus] = useState<MaritalStatus | ''>('')
    const [firstTimeHomeBuyer, setFirstTimeHomeBuyer] = useState<boolean | null>(null)
    const [preferredLanguage, setPreferredLanguage] = useState('english')

    const [mailingAddress, setMailingAddress] = useState('')
    const [mailingUnit, setMailingUnit] = useState('')
    const [mailingCity, setMailingCity] = useState('')
    const [mailingState, setMailingState] = useState('')
    const [mailingZipCode, setMailingZipCode] = useState('')
    const [addressYears, setAddressYears] = useState('')
    const [addressMonths, setAddressMonths] = useState('')
    const [housingStatus, setHousingStatus] = useState<HousingStatus | ''>('')

    const [employerName, setEmployerName] = useState('')
    const [employerPosition, setEmployerPosition] = useState('')
    const [employerPhone, setEmployerPhone] = useState('')
    const [employmentStartMonth, setEmploymentStartMonth] = useState('')
    const [employmentStartYear, setEmploymentStartYear] = useState('')
    const [selfEmployed, setSelfEmployed] = useState<boolean>(
        employmentStatus === 'self-employed' || employmentStatus === 'self_employed'
    )

    const [downPayment, setDownPayment] = useState(defaultDownPayment.toString())
    const [mortgageType, setMortgageType] = useState<MortgageType | ''>('')
    const [loanTerm, setLoanTerm] = useState<number>(30)
    const [amortizationType, setAmortizationType] = useState<AmortizationType>('fixed')
    const [numberOfUnits, setNumberOfUnits] = useState<number>(1)
    const [hasCoBorrower, setHasCoBorrower] = useState(false)
    const [coFirstName, setCoFirstName] = useState('')
    const [coLastName, setCoLastName] = useState('')
    const [coEmail, setCoEmail] = useState('')
    const [coPhone, setCoPhone] = useState('')
    const [coDobMonth, setCoDobMonth] = useState('')
    const [coDobDay, setCoDobDay] = useState('')
    const [coDobYear, setCoDobYear] = useState('')

    // ── Validation ──
    const validateStep = (s: number): boolean => {
        switch (s) {
            case 1:
                return !!dobMonth && !!dobDay && !!dobYear && !!maritalStatus && firstTimeHomeBuyer !== null
            case 2:
                return !!mailingAddress && !!mailingCity && !!mailingState && !!mailingZipCode && !!housingStatus
            case 3:
                return !!employerName && !!employerPosition && !!employmentStartMonth && !!employmentStartYear
            case 4: {
                const baseValid = !!downPayment && !!mortgageType
                if (hasCoBorrower) {
                    return baseValid && !!coFirstName && !!coLastName && !!coEmail
                }
                return baseValid
            }
            default:
                return false
        }
    }

    const handleNext = () => {
        if (step < TOTAL_STEPS) setStep(step + 1)
    }

    const handleBack = () => {
        if (step > 1) setStep(step - 1)
    }

    const handleSubmit = async () => {
        setSubmitting(true)
        setError(null)

        // Build DOB string
        const dob = `${dobYear}-${dobMonth.padStart(2, '0')}-${dobDay.padStart(2, '0')}`
        const addressDurationMonths = (parseInt(addressYears || '0') * 12) + parseInt(addressMonths || '0')
        const empStartDate = `${employmentStartYear}-${employmentStartMonth.padStart(2, '0')}-01`

        const formData: PreApprovalFormData = {
            date_of_birth: dob,
            marital_status: maritalStatus as MaritalStatus,
            first_time_home_buyer: firstTimeHomeBuyer!,
            preferred_language: preferredLanguage,

            mailing_address: mailingAddress,
            mailing_unit: mailingUnit || undefined,
            mailing_city: mailingCity,
            mailing_state: mailingState,
            mailing_zip_code: mailingZipCode,
            address_duration_months: addressDurationMonths,
            housing_status: housingStatus as HousingStatus,

            employer_name: employerName,
            employer_position: employerPosition,
            employer_phone: employerPhone,
            employment_start_date: empStartDate,
            self_employed: selfEmployed,

            down_payment: parseFloat(downPayment) || 0,
            mortgage_type: mortgageType as MortgageType,
            loan_term: loanTerm,
            amortization_type: amortizationType,
            number_of_units: numberOfUnits,
            has_co_borrower: hasCoBorrower,
            ...(hasCoBorrower ? {
                co_borrower_first_name: coFirstName,
                co_borrower_last_name: coLastName,
                co_borrower_email: coEmail,
                co_borrower_phone: coPhone || undefined,
                co_borrower_dob: coDobYear && coDobMonth && coDobDay
                    ? `${coDobYear}-${coDobMonth.padStart(2, '0')}-${coDobDay.padStart(2, '0')}`
                    : undefined,
            } : {}),
        }

        try {
            const res = await fetch(`/api/applications/${applicationId}/preapproval`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            if (!res.ok) {
                const data = await res.json().catch(() => ({}))
                throw new Error(data.error || 'Failed to submit pre-approval')
            }

            setSubmitted(true)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong')
        } finally {
            setSubmitting(false)
        }
    }

    if (!isOpen) return null

    // ── Success Screen ──
    if (submitted) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
                <div className="relative w-full max-w-lg bg-white border border-gray-100 rounded-2xl shadow-2xl p-8 animate-in fade-in zoom-in-95 duration-200 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Pre-Approval Submitted!</h2>
                    <p className="text-gray-500 mb-2">
                        Your complete application has been sent to <strong>{lenderName}</strong> for pre-approval.
                    </p>
                    <p className="text-sm text-gray-400 mb-8">
                        You&apos;ll receive updates in your dashboard and via email. Check the Disclosures section in your DocHub for any documents requiring your signature.
                    </p>
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-[#1E3A5F] text-white font-bold rounded-xl hover:bg-[#162D4A] transition-all"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        )
    }

    const StepIcon = STEP_INFO[step - 1].icon
    const isStepValid = validateStep(step)

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-2xl bg-white border border-gray-100 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <StepIcon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">{STEP_INFO[step - 1].title}</h2>
                            <p className="text-xs text-gray-500">{STEP_INFO[step - 1].subtitle}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="px-6 pt-4">
                    <div className="flex items-center gap-2 mb-1">
                        {Array.from({ length: TOTAL_STEPS }, (_, i) => (
                            <div
                                key={i}
                                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                                    i + 1 <= step ? 'bg-blue-600' : 'bg-gray-200'
                                }`}
                            />
                        ))}
                    </div>
                    <p className="text-xs text-gray-400 text-right">Step {step} of {TOTAL_STEPS}</p>
                </div>

                {/* Scrollable Form Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-5">

                    {/* ── Step 1: Borrower Info ── */}
                    {step === 1 && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                                <div className="grid grid-cols-3 gap-3">
                                    <select
                                        value={dobMonth}
                                        onChange={(e) => setDobMonth(e.target.value)}
                                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">Month</option>
                                        {MONTHS.map(m => (
                                            <option key={m.value} value={m.value.toString()}>{m.label}</option>
                                        ))}
                                    </select>
                                    <select
                                        value={dobDay}
                                        onChange={(e) => setDobDay(e.target.value)}
                                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">Day</option>
                                        {Array.from({ length: 31 }, (_, i) => (
                                            <option key={i + 1} value={(i + 1).toString()}>{i + 1}</option>
                                        ))}
                                    </select>
                                    <input
                                        type="text"
                                        placeholder="Year (e.g. 1990)"
                                        value={dobYear}
                                        onChange={(e) => setDobYear(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                        maxLength={4}
                                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Marital Status</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {(['married', 'unmarried', 'separated'] as MaritalStatus[]).map(status => (
                                        <button
                                            key={status}
                                            type="button"
                                            onClick={() => setMaritalStatus(status)}
                                            className={`px-4 py-2.5 rounded-lg border text-sm font-medium transition-all capitalize ${
                                                maritalStatus === status
                                                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                                                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                            }`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">First Time Home Buyer?</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {[true, false].map(val => (
                                        <button
                                            key={val.toString()}
                                            type="button"
                                            onClick={() => setFirstTimeHomeBuyer(val)}
                                            className={`px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                                                firstTimeHomeBuyer === val
                                                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                                                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                            }`}
                                        >
                                            {val ? 'Yes' : 'No'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Language</label>
                                <select
                                    value={preferredLanguage}
                                    onChange={(e) => setPreferredLanguage(e.target.value)}
                                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="english">English</option>
                                    <option value="spanish">Spanish</option>
                                    <option value="chinese">Chinese</option>
                                    <option value="vietnamese">Vietnamese</option>
                                    <option value="korean">Korean</option>
                                    <option value="tagalog">Tagalog</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </>
                    )}

                    {/* ── Step 2: Current Residence ── */}
                    {step === 2 && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                                <input
                                    type="text"
                                    value={mailingAddress}
                                    onChange={(e) => setMailingAddress(e.target.value)}
                                    placeholder="123 Main Street"
                                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Unit / Apt (optional)</label>
                                <input
                                    type="text"
                                    value={mailingUnit}
                                    onChange={(e) => setMailingUnit(e.target.value)}
                                    placeholder="Apt 4B"
                                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                    <input
                                        type="text"
                                        value={mailingCity}
                                        onChange={(e) => setMailingCity(e.target.value)}
                                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                    <select
                                        value={mailingState}
                                        onChange={(e) => setMailingState(e.target.value)}
                                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">Select</option>
                                        {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                                    <input
                                        type="text"
                                        value={mailingZipCode}
                                        onChange={(e) => setMailingZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                                        maxLength={5}
                                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">How long at this address?</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={addressYears}
                                            onChange={(e) => setAddressYears(e.target.value.replace(/\D/g, ''))}
                                            placeholder="0"
                                            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-16"
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">years</span>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={addressMonths}
                                            onChange={(e) => setAddressMonths(e.target.value.replace(/\D/g, ''))}
                                            placeholder="0"
                                            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-20"
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">months</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Housing Status</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {([
                                        { value: 'own', label: 'Own' },
                                        { value: 'rent', label: 'Rent' },
                                        { value: 'rent_free', label: 'Rent-Free' },
                                    ] as { value: HousingStatus; label: string }[]).map(opt => (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => setHousingStatus(opt.value)}
                                            className={`px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                                                housingStatus === opt.value
                                                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                                                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                            }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {/* ── Step 3: Employment Details ── */}
                    {step === 3 && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Employer Name</label>
                                <input
                                    type="text"
                                    value={employerName}
                                    onChange={(e) => setEmployerName(e.target.value)}
                                    placeholder="Company name"
                                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Position / Title</label>
                                <input
                                    type="text"
                                    value={employerPosition}
                                    onChange={(e) => setEmployerPosition(e.target.value)}
                                    placeholder="e.g. Software Engineer"
                                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Employer Phone (optional)</label>
                                <input
                                    type="tel"
                                    value={employerPhone}
                                    onChange={(e) => setEmployerPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                    placeholder="(555) 123-4567"
                                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Employment Start Date</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <select
                                        value={employmentStartMonth}
                                        onChange={(e) => setEmploymentStartMonth(e.target.value)}
                                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">Month</option>
                                        {MONTHS.map(m => (
                                            <option key={m.value} value={m.value.toString()}>{m.label}</option>
                                        ))}
                                    </select>
                                    <input
                                        type="text"
                                        value={employmentStartYear}
                                        onChange={(e) => setEmploymentStartYear(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                        placeholder="Year (e.g. 2020)"
                                        maxLength={4}
                                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Self-Employed?</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {[true, false].map(val => (
                                        <button
                                            key={val.toString()}
                                            type="button"
                                            onClick={() => setSelfEmployed(val)}
                                            className={`px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                                                selfEmployed === val
                                                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                                                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                            }`}
                                        >
                                            {val ? 'Yes' : 'No'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {/* ── Step 4: Loan Details + Co-Borrower ── */}
                    {step === 4 && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Down Payment ($)</label>
                                <input
                                    type="text"
                                    value={downPayment}
                                    onChange={(e) => setDownPayment(e.target.value.replace(/[^\d.]/g, ''))}
                                    placeholder="80,000"
                                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Mortgage Type</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {([
                                        { value: 'conventional', label: 'Conv.' },
                                        { value: 'fha', label: 'FHA' },
                                        { value: 'va', label: 'VA' },
                                        { value: 'jumbo', label: 'Jumbo' },
                                    ] as { value: MortgageType; label: string }[]).map(opt => (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => setMortgageType(opt.value)}
                                            className={`px-3 py-2.5 rounded-lg border text-sm font-medium transition-all ${
                                                mortgageType === opt.value
                                                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                                                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                            }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Loan Term</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[15, 20, 30].map(term => (
                                            <button
                                                key={term}
                                                type="button"
                                                onClick={() => setLoanTerm(term)}
                                                className={`px-2 py-2 rounded-lg border text-sm font-medium transition-all ${
                                                    loanTerm === term
                                                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                                                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                                }`}
                                            >
                                                {term}yr
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {([
                                            { value: 'fixed', label: 'Fixed' },
                                            { value: 'arm', label: 'ARM' },
                                        ] as { value: AmortizationType; label: string }[]).map(opt => (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                onClick={() => setAmortizationType(opt.value)}
                                                className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                                                    amortizationType === opt.value
                                                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                                                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                                }`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Units</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {[1, 2, 3, 4].map(n => (
                                        <button
                                            key={n}
                                            type="button"
                                            onClick={() => setNumberOfUnits(n)}
                                            className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                                                numberOfUnits === n
                                                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                                                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                            }`}
                                        >
                                            {n}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Co-Borrower Section */}
                            <div className="border-t border-gray-100 pt-5">
                                <div className="flex items-center gap-3 mb-4">
                                    <Users className="w-5 h-5 text-gray-500" />
                                    <label className="text-sm font-medium text-gray-700">Do you have a co-borrower?</label>
                                    <div className="flex gap-2 ml-auto">
                                        {[true, false].map(val => (
                                            <button
                                                key={val.toString()}
                                                type="button"
                                                onClick={() => setHasCoBorrower(val)}
                                                className={`px-4 py-1.5 rounded-lg border text-sm font-medium transition-all ${
                                                    hasCoBorrower === val
                                                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                                                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                                }`}
                                            >
                                                {val ? 'Yes' : 'No'}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {hasCoBorrower && (
                                    <div className="space-y-4 bg-gray-50 rounded-xl p-4">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-600 mb-1">First Name</label>
                                                <input
                                                    type="text"
                                                    value={coFirstName}
                                                    onChange={(e) => setCoFirstName(e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-600 mb-1">Last Name</label>
                                                <input
                                                    type="text"
                                                    value={coLastName}
                                                    onChange={(e) => setCoLastName(e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">Email</label>
                                            <input
                                                type="email"
                                                value={coEmail}
                                                onChange={(e) => setCoEmail(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">Phone (optional)</label>
                                            <input
                                                type="tel"
                                                value={coPhone}
                                                onChange={(e) => setCoPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">Date of Birth (optional)</label>
                                            <div className="grid grid-cols-3 gap-2">
                                                <select
                                                    value={coDobMonth}
                                                    onChange={(e) => setCoDobMonth(e.target.value)}
                                                    className="w-full px-2 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                >
                                                    <option value="">Month</option>
                                                    {MONTHS.map(m => (
                                                        <option key={m.value} value={m.value.toString()}>{m.label}</option>
                                                    ))}
                                                </select>
                                                <select
                                                    value={coDobDay}
                                                    onChange={(e) => setCoDobDay(e.target.value)}
                                                    className="w-full px-2 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                >
                                                    <option value="">Day</option>
                                                    {Array.from({ length: 31 }, (_, i) => (
                                                        <option key={i + 1} value={(i + 1).toString()}>{i + 1}</option>
                                                    ))}
                                                </select>
                                                <input
                                                    type="text"
                                                    placeholder="Year"
                                                    value={coDobYear}
                                                    onChange={(e) => setCoDobYear(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                                    maxLength={4}
                                                    className="w-full px-2 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* Error Display */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}
                </div>

                {/* Footer Navigation */}
                <div className="flex items-center justify-between p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
                    <button
                        onClick={step === 1 ? onClose : handleBack}
                        className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        {step === 1 ? 'Cancel' : 'Back'}
                    </button>

                    {step < TOTAL_STEPS ? (
                        <button
                            onClick={handleNext}
                            disabled={!isStepValid}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                                isStepValid
                                    ? 'bg-[#1E3A5F] text-white hover:bg-[#162D4A] shadow-lg shadow-[#1E3A5F]/20'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                        >
                            Continue
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={!isStepValid || submitting}
                            className={`flex items-center gap-2 px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${
                                isStepValid && !submitting
                                    ? 'bg-[#1E3A5F] text-white hover:bg-[#162D4A] shadow-lg shadow-[#1E3A5F]/20'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    Submit Pre-Approval
                                    <Check className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
