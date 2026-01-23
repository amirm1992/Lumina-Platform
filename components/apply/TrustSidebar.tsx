import React from 'react'

const trustItems = [
    { icon: '🔒', title: 'Privacy', description: 'Your information is never sold to third-party brokers.' },
    { icon: '🎛️', title: 'Control', description: 'You choose which lenders to interact with.' },
    { icon: '🛡️', title: 'Security', description: '256-bit SSL encryption (Bank-level).' },
    { icon: '🚫', title: 'Spam-Free', description: 'No unsolicited calls or robocalls.' },
]

export function TrustSidebar() {
    return (
        <aside className="hidden lg:block w-80 p-6 bg-white border border-gray-100 rounded-2xl shadow-sm h-fit sticky top-24">
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
        </aside>
    )
}
