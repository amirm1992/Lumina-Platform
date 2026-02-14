import React from 'react'
import Image from 'next/image'

const trustItems = [
    { icon: '🔒', title: 'Privacy', description: 'Your information is never sold to third-party brokers.' },
    { icon: '🎛️', title: 'Control', description: 'You choose which lenders to interact with.' },
    { icon: '🛡️', title: 'Security', description: '256-bit SSL encryption (Bank-level).' },
    { icon: '🚫', title: 'Spam-Free', description: 'No unsolicited calls or robocalls.' },
]

export function TrustSidebar() {
    return (
        <aside className="hidden lg:block w-80 space-y-4 h-fit sticky top-24">
            {/* Our Promise */}
            <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
                <h3 className="text-lg font-bold text-black mb-6">Our Promise</h3>
                <div className="space-y-5">
                    {trustItems.map((item) => (
                        <div key={item.title} className="flex gap-3">
                            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center text-xl">{item.icon}</div>
                            <div>
                                <div className="font-medium text-black text-sm">{item.title}</div>
                                <div className="text-xs text-gray-500">{item.description}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Security & Compliance Badges */}
            <div className="p-5 bg-[#F0FDF4] border border-[#BBF7D0] rounded-2xl">
                <div className="flex items-center gap-2 mb-4">
                    <svg className="w-4 h-4 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                    <span className="text-sm font-semibold text-green-800">Verified & Secure</span>
                </div>
                <div className="space-y-3">
                    {/* 256-bit SSL */}
                    <div className="flex items-center gap-3 px-3 py-2.5 bg-white rounded-xl border border-green-100">
                        <svg className="w-5 h-5 text-green-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                        </svg>
                        <div>
                            <div className="text-xs font-semibold text-gray-800">256-bit SSL Encrypted</div>
                            <div className="text-[10px] text-gray-500">Bank-level data protection</div>
                        </div>
                    </div>
                    {/* NMLS */}
                    <div className="flex items-center gap-3 px-3 py-2.5 bg-white rounded-xl border border-green-100">
                        <svg className="w-5 h-5 text-green-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                        </svg>
                        <div>
                            <div className="text-xs font-semibold text-gray-800">NMLS #1631748</div>
                            <div className="text-[10px] text-gray-500">Federally registered</div>
                        </div>
                    </div>
                    {/* Soft Credit Pull */}
                    <div className="flex items-center gap-3 px-3 py-2.5 bg-white rounded-xl border border-green-100">
                        <svg className="w-5 h-5 text-green-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <div>
                            <div className="text-xs font-semibold text-gray-800">Soft Credit Pull Only</div>
                            <div className="text-[10px] text-gray-500">No impact on your score</div>
                        </div>
                    </div>
                </div>

                {/* GSE Badges */}
                <div className="mt-4 pt-4 border-t border-green-200">
                    <div className="flex items-center justify-between px-1">
                        <Image src="/logos/fannie-mae.png" alt="Fannie Mae" width={1169} height={212} className="h-5 w-auto opacity-40" />
                        <Image src="/logos/equal-housing.png" alt="Equal Housing Opportunity" width={500} height={500} className="h-7 w-auto opacity-40" />
                        <Image src="/logos/freddie-mac.png" alt="Freddie Mac" width={342} height={220} className="h-5 w-auto opacity-40" />
                    </div>
                </div>
            </div>
        </aside>
    )
}
