import React from 'react'
import Image from 'next/image'

export function TrustSidebar() {
    return (
        <aside className="hidden lg:block w-80 h-fit sticky top-24">
            <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
                <h3 className="text-lg font-bold text-black mb-5">Your Protection</h3>

                {/* Trust items */}
                <div className="space-y-3 mb-5">
                    <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                            <svg className="w-4 h-4 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                            </svg>
                        </div>
                        <div>
                            <div className="text-sm font-medium text-black">256-bit SSL Encrypted</div>
                            <div className="text-xs text-gray-500">Bank-level data protection</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                            <svg className="w-4 h-4 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                            </svg>
                        </div>
                        <div>
                            <div className="text-sm font-medium text-black">Soft Credit Pull Only</div>
                            <div className="text-xs text-gray-500">No impact on your score</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                            <svg className="w-4 h-4 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                        </div>
                        <div>
                            <div className="text-sm font-medium text-black">No Spam, Ever</div>
                            <div className="text-xs text-gray-500">No unsolicited calls or robocalls</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                            <svg className="w-4 h-4 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                            </svg>
                        </div>
                        <div>
                            <div className="text-sm font-medium text-black">Your Data Stays Private</div>
                            <div className="text-xs text-gray-500">Never sold to third parties</div>
                        </div>
                    </div>
                </div>

                {/* NMLS badge */}
                <div className="px-3 py-2 bg-blue-50 rounded-lg border border-blue-100 mb-5">
                    <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-blue-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                        </svg>
                        <span className="text-xs font-semibold text-blue-800">NMLS #1631748</span>
                        <span className="text-[10px] text-blue-500 ml-auto">Federally registered</span>
                    </div>
                </div>

                {/* GSE Logos */}
                <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                        <Image src="/logos/fannie-mae.png" alt="Fannie Mae" width={1169} height={212} className="h-5 w-auto opacity-40" />
                        <Image src="/logos/equal-housing.png" alt="Equal Housing Opportunity" width={500} height={500} className="h-7 w-auto opacity-40" />
                        <Image src="/logos/freddie-mac.png" alt="Freddie Mac" width={342} height={220} className="h-7 w-auto opacity-40" />
                    </div>
                </div>
            </div>
        </aside>
    )
}
