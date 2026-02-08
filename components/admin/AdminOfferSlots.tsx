'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LenderOffer } from '@/types/database'
import { CONSTANT_LENDERS } from '@/constants/lenders'
import { Plus, Edit2 } from 'lucide-react'
import Image from 'next/image'

interface AdminOfferSlotsProps {
    applicationId: string
    offers: LenderOffer[]
}

function offerMatchesLender(offer: LenderOffer, lenderName: string): boolean {
    const name = (offer.lender_name ?? '').toLowerCase().trim()
    const expected = lenderName.toLowerCase().trim()
    if (name === expected) return true
    if (lenderName === 'UWM' && (name.includes('united wholesale') || name.includes('uwm')))
        return true
    return false
}

const EXPECTED_COUNT = 6

export function AdminOfferSlots({ applicationId, offers }: AdminOfferSlotsProps) {
    const pathname = usePathname()
    const filledCount = CONSTANT_LENDERS.filter((l) =>
        offers.some((o) => offerMatchesLender(o, l.name))
    ).length

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Lender slots</h2>
            <p className="text-sm text-gray-500 mb-4">
                <strong className="text-gray-700">Offers: {filledCount}/{EXPECTED_COUNT}</strong>
                {' — '}
                One card per lender. Add or edit offers so the consumer sees up to 6 complete cards.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {CONSTANT_LENDERS.map((lender) => {
                    const offer = offers.find((o) => offerMatchesLender(o, lender.name))
                    const hasOffer = !!offer
                    return (
                        <div
                            key={lender.name}
                            className={`rounded-xl border-2 p-4 transition-colors ${
                                hasOffer
                                    ? 'border-green-200 bg-green-50/50'
                                    : 'border-gray-100 bg-gray-50/50'
                            }`}
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                                    {lender.logo ? (
                                        <Image
                                            src={lender.logo}
                                            alt=""
                                            width={36}
                                            height={36}
                                            className="object-contain"
                                        />
                                    ) : (
                                        <span className="text-sm font-bold text-gray-500">
                                            {lender.name[0]}
                                        </span>
                                    )}
                                </div>
                                <span className="font-semibold text-gray-900 truncate">
                                    {lender.name}
                                </span>
                            </div>
                            {hasOffer && offer ? (
                                <>
                                    <div className="text-sm text-gray-700 space-y-1 mb-3">
                                        <p>
                                            <span className="text-gray-500">Rate:</span>{' '}
                                            <strong>{offer.interest_rate}%</strong>
                                        </p>
                                        <p>
                                            <span className="text-gray-500">APR:</span>{' '}
                                            <strong>{offer.apr ?? '—'}%</strong>
                                        </p>
                                        {offer.monthly_payment != null && (
                                            <p>
                                                <span className="text-gray-500">Monthly:</span>{' '}
                                                <strong>
                                                    ${offer.monthly_payment.toLocaleString()}
                                                </strong>
                                            </p>
                                        )}
                                    </div>
                                    <Link
                                        href={`${pathname}?edit=${offer.id}`}
                                        className="inline-flex items-center gap-1.5 text-sm font-medium text-purple-600 hover:text-purple-800"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        Edit offer
                                    </Link>
                                </>
                            ) : (
                                <Link
                                    href={`${pathname}?add=${encodeURIComponent(lender.name)}`}
                                    className="inline-flex items-center gap-1.5 text-sm font-medium text-purple-600 hover:text-purple-800"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add offer
                                </Link>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
