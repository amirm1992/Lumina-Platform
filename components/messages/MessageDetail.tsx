'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Send, Reply } from 'lucide-react'
import { MessageThread } from './types'

interface MessageDetailProps {
    thread: MessageThread | null
    currentUserId: string
    onReply: (threadId: string, message: string) => Promise<void>
    onBack?: () => void
}

function formatTimestamp(iso: string): string {
    const d = new Date(iso)
    return d.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    })
}

export function MessageDetail({ thread, currentUserId, onReply, onBack }: MessageDetailProps) {
    const [replyText, setReplyText] = useState('')
    const [sending, setSending] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    // Auto-scroll to bottom when replies change
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [thread?.replies.length])

    if (!thread) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gray-50 text-center">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm border border-gray-100">
                    <Reply className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-black mb-2">Select a conversation</h3>
                <p className="text-gray-400 max-w-xs">Choose a message thread from the list to view the conversation.</p>
            </div>
        )
    }

    const handleSendReply = async () => {
        if (!replyText.trim() || sending) return
        setSending(true)
        try {
            await onReply(thread.id, replyText.trim())
            setReplyText('')
        } finally {
            setSending(false)
        }
    }

    return (
        <div className="flex-1 flex flex-col h-full bg-white/50 backdrop-blur-sm overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b border-gray-100 bg-white/80 backdrop-blur-md">
                {onBack && (
                    <button onClick={onBack} className="md:hidden p-2 rounded-md hover:bg-gray-100 text-gray-500 hover:text-black">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                )}
                <div className="flex-1 min-w-0">
                    <h1 className="text-lg font-bold text-black truncate">{thread.subject}</h1>
                    <p className="text-xs text-gray-400">
                        {thread.replies.length} message{thread.replies.length !== 1 ? 's' : ''}
                    </p>
                </div>
            </div>

            {/* Conversation */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4 bg-gray-50/50">
                {thread.replies.map((reply) => {
                    const isMe = reply.sender_role === 'client'
                    return (
                        <div
                            key={reply.id}
                            className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[75%] ${isMe ? 'order-2' : 'order-1'}`}>
                                <div className={`rounded-2xl px-4 py-3 shadow-sm ${
                                    isMe
                                        ? 'bg-violet-600 text-white rounded-br-md shadow-md shadow-violet-900/20'
                                        : 'bg-white text-gray-900 border border-gray-200 rounded-bl-md'
                                }`}>
                                    {!isMe && (
                                        <p className="text-xs font-semibold text-purple-600 mb-1">
                                            {reply.sender_name || 'Lumina Support'}
                                        </p>
                                    )}
                                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                                        {reply.body}
                                    </div>
                                </div>
                                <p className={`text-[10px] text-gray-400 mt-1 ${isMe ? 'text-right' : 'text-left'}`}>
                                    {formatTimestamp(reply.created_at)}
                                </p>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Reply input */}
            <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex items-end gap-3">
                    <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault()
                                handleSendReply()
                            }
                        }}
                        placeholder="Type your reply..."
                        rows={1}
                        className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all resize-none"
                    />
                    <button
                        onClick={handleSendReply}
                        disabled={!replyText.trim() || sending}
                        className="p-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-violet-900/20 shrink-0"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
                <p className="text-[10px] text-gray-400 mt-2">Press Enter to send, Shift+Enter for new line</p>
            </div>
        </div>
    )
}
