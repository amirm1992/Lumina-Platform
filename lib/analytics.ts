// ============================================
// Google Analytics / GTM event helpers
// All dataLayer pushes go through here for consistency.
// No PII (email, name, phone, SSN) should ever be passed.
// ============================================

// Step metadata used by funnel events
export const STEP_NAMES: Record<number, string> = {
    1: 'ProductSelection',
    2: 'PropertyType',
    3: 'PropertyUsage',
    4: 'LocationInput',
    5: 'ValueLoanSliders',
    6: 'PersonalIdentity',
    7: 'CreditHealth',
    8: 'EmploymentStatus',
    9: 'AnnualIncome',
    10: 'LiquidAssets',
    11: 'SSNInput',
    12: 'CreateAccount',
}

export const STEP_PHASES: Record<number, string> = {
    1: 'Property',
    2: 'Property',
    3: 'Property',
    4: 'Property',
    5: 'Property',
    6: 'Profile',
    7: 'Profile',
    8: 'Profile',
    9: 'Financial',
    10: 'Financial',
    11: 'Security',
    12: 'Security',
}

// ── Core push ───────────────────────────────────────────────────

type DataLayerEvent = Record<string, unknown>

function pushToDataLayer(event: DataLayerEvent) {
    if (typeof window === 'undefined') return
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any
    w.dataLayer = w.dataLayer || []
    w.dataLayer.push(event)
}

// ── Public helpers ──────────────────────────────────────────────

/**
 * Fired when a user lands on an application step (1–12).
 * Used to build the 12-step funnel and measure drop-off.
 */
export function trackStepView(stepNumber: number) {
    if (stepNumber < 1 || stepNumber > 12) return
    pushToDataLayer({
        event: 'application_step_view',
        step_number: stepNumber,
        step_name: STEP_NAMES[stepNumber] || `Step${stepNumber}`,
        phase: STEP_PHASES[stepNumber] || 'Unknown',
    })
}

/**
 * Fired when a user completes a step (clicks Continue / selects an option).
 * Optional — step_view alone is enough for funnel analysis.
 */
export function trackStepComplete(stepNumber: number) {
    if (stepNumber < 1 || stepNumber > 12) return
    pushToDataLayer({
        event: 'application_step_complete',
        step_number: stepNumber,
        step_name: STEP_NAMES[stepNumber] || `Step${stepNumber}`,
        phase: STEP_PHASES[stepNumber] || 'Unknown',
    })
}

/**
 * Fired once when the application is successfully saved to the database
 * and the user is sent to their dashboard. This is the primary conversion.
 */
export function trackApplicationSubmitted(method: 'new_account' | 'existing_account') {
    pushToDataLayer({
        event: 'application_submitted',
        method,
    })
}

/**
 * Generic event push for any custom event.
 */
export function trackEvent(eventName: string, params?: Record<string, unknown>) {
    pushToDataLayer({
        event: eventName,
        ...params,
    })
}
