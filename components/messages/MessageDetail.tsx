'use client'

import React from 'react'
import { Trash2, Reply, MoreVertical, Archive, ArrowLeft } from 'lucide-react'
import { Message } from './types'

interface MessageDetailProps {
    message: Message | null
    onDelete: (id: string) => void
    onBack?: () => void // Mobile back
}

export function MessageDetail({ message, onDelete, onBack }: MessageDetailProps) {
    if (!message) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gray-50 text-center">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm border border-gray-100">
                    <Reply className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-black mb-2">Select a message</h3>
                <p className="text-gray-400 max-w-xs">Choose a message from the list to view details.</p>
            </div>
        )
    }

    return (
        <div className="flex-1 flex flex-col h-full bg-white/50 backdrop-blur-sm overflow-hidden">
            {/* Toolbar */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white/80 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    {onBack && (
                        <button onClick={onBack} className="md:hidden p-2 rounded-md hover:bg-gray-100 text-gray-500 hover:text-black">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                    )}
                    <div className="flex gap-2">
                        <button className="p-2 rounded-md hover:bg-gray-100 text-gray-500 hover:text-black" title="Reply">
                            <Reply className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-md hover:bg-gray-100 text-gray-500 hover:text-black" title="Archive">
                            <Archive className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onDelete(message.id)}
                            className="p-2 rounded-md hover:bg-red-50 text-gray-500 hover:text-red-500"
                            title="Delete"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                <div>
                    <button className="p-2 rounded-md hover:bg-gray-100 text-gray-500 hover:text-black">
                        <MoreVertical className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10 bg-white">
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-black mb-4">{message.subject}</h1>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white font-bold shadow-md">
                                {message.sender.charAt(0)}
                            </div>
                            <div>
                                <div className="font-bold text-black text-sm">
                                    {message.sender}
                                    <span className="font-normal text-gray-400 ml-2 text-xs">&lt;{message.senderEmail || 'support@lumina.com'}&gt;</span>
                                </div>
                                <div className="text-xs text-gray-500">To: You</div>
                            </div>
                        </div>
                        <div className="text-xs text-black font-medium bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200">
                            {message.date}
                        </div>
                    </div>
                </div>

                <div className="prose prose-slate prose-sm max-w-none text-gray-600 leading-relaxed">
                    {/* Render body, handling newlines */}
                    {message.body.split('\n').map((line, i) => (
                        <p key={i} className="mb-4">{line}</p>
                    ))}
                </div>

                <div className="mt-10 pt-6 border-t border-gray-100">
                    <button className="px-6 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-sm font-bold text-black transition-all flex items-center gap-2">
                        <Reply className="w-4 h-4" />
                        Reply to {message.sender.split(' ')[0]}
                    </button>
                </div>
            </div>
        </div>
    )
}
