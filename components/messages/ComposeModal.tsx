'use client'

import React, { useState } from 'react'
import { X, Send } from 'lucide-react'

interface ComposeModalProps {
    isOpen: boolean
    onClose: () => void
    onSend: (to: string, subject: string, body: string) => void
}

export function ComposeModal({ isOpen, onClose, onSend }: ComposeModalProps) {
    const [to, setTo] = useState('support@lumina.com')
    const [subject, setSubject] = useState('')
    const [body, setBody] = useState('')

    if (!isOpen) return null

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSend(to, subject, body)
        // Reset
        setTo('support@lumina.com')
        setSubject('')
        setBody('')
        onClose()
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="relative w-full max-w-2xl bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                    <h2 className="text-lg font-bold text-black">New Message</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-200 text-gray-500 hover:text-black transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col flex-1 p-6">
                    <div className="space-y-4 mb-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">To</label>
                            <input
                                type="email"
                                value={to}
                                onChange={(e) => setTo(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-black focus:outline-none focus:border-purple-500 transition-colors"
                                placeholder="Recipient"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Subject</label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-black focus:outline-none focus:border-purple-500 transition-colors"
                                placeholder="Subject"
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="flex-1">
                        <textarea
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            className="w-full h-64 bg-gray-50 border border-gray-200 rounded-lg p-4 text-black focus:outline-none focus:border-purple-500 transition-colors resize-none placeholder-gray-400"
                            placeholder="Write your message here..."
                        />
                    </div>

                    <div className="flex justify-end pt-6 mt-2">
                        <button
                            type="submit"
                            disabled={!subject || !body}
                            className="px-6 py-2.5 bg-black hover:bg-gray-800 text-white font-bold rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-black/10"
                        >
                            <Send className="w-4 h-4" />
                            Send Message
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
