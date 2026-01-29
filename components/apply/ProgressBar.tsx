'use client'

import React from 'react'

const phases = [
    { name: 'Property', steps: [1, 2, 3, 4, 5] },
    { name: 'Profile', steps: [6, 7, 8] },
    { name: 'Financial', steps: [9, 10] },
    { name: 'Security', steps: [11, 12] },
]

export function ProgressBar({ currentStep, totalSteps = 12 }: { currentStep: number; totalSteps?: number }) {
    const currentPhaseIndex = phases.findIndex((phase) => phase.steps.includes(currentStep))

    return (
        <div className="w-full mb-8">
            <div className="flex justify-between mb-2">
                {phases.map((phase, index) => (
                    <div key={phase.name} className={`text-xs font-medium transition-colors ${index <= currentPhaseIndex ? 'text-[#2563EB]' : 'text-gray-400'}`}>
                        {phase.name}
                    </div>
                ))}
            </div>
            <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#1E3A5F] to-[#3B82F6] transition-all duration-500 ease-out" style={{ width: `${(currentStep / totalSteps) * 100}%` }} />
            </div>
            <div className="text-right mt-2 text-xs text-gray-500">Step {currentStep} of {totalSteps}</div>
        </div>
    )
}
