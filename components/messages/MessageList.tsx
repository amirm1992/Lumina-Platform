'use client'

import React from 'react'
import { Search, MessageSquare } from 'lucide-react'
import { MessageThread } from './types'

interface MessageListProps {
    threads: MessageThread[]
    selectedId: string | null
    onSelect: (id: string) => void
    filter: 'all' | 'unread'
    setFilter: (filter: 'all' | 'unread') => void
    searchQuery: string
    setSearchQuery: (query: string) => void
}

function formatDate(iso: string): string {
    const d = new Date(iso)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
        return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    }
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return d.toLocaleDateString('en-US', { weekday: 'short' })
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function MessageList({
    threads,
    selectedId,
    onSelect,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
}: MessageListProps) {
    const filteredThreads = threads.filter(t => {
        const hasUnread = t.replies.some(r => r.sender_role === 'admin' && !r.is_read)
        const matchesFilter = filter === 'all' || (filter === 'unread' && hasUnread)
        const matchesSearch = t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.replies.some(r => r.body.toLowerCase().includes(searchQuery.toLowerCase()))
        return matchesFilter && matchesSearch
    })

    return (
        <div className="flex flex-col h-full bg-white w-full md:w-80 lg:w-96 shrink-0">
            {/* Header / Search */}
            <div className="p-4 border-b border-gray-100 space-y-4">
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-100 transition-all">
                    <Search className="w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search messages..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent border-none outline-none text-sm text-black placeholder-gray-400 w-full"
                    />
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`flex-1 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all
                            ${filter === 'all' ? 'bg-black text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}
                        `}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('unread')}
                        className={`flex-1 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all
                            ${filter === 'unread' ? 'bg-black text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}
                        `}
                    >
                        Unread
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {filteredThreads.length === 0 ? (
                    <div className="p-8 text-center text-gray-400 text-sm flex flex-col items-center gap-3">
                        <MessageSquare className="w-8 h-8 text-gray-300" />
                        {threads.length === 0 ? 'No messages yet. Start a conversation!' : 'No messages found.'}
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {filteredThreads.map((thread) => {
                            const lastReply = thread.replies[thread.replies.length - 1]
                            const hasUnread = thread.replies.some(r => r.sender_role === 'admin' && !r.is_read)
                            const lastSenderLabel = lastReply?.sender_role === 'admin' ? 'Lumina Support' : 'You'

                            return (
                                <div
                                    key={thread.id}
                                    onClick={() => onSelect(thread.id)}
                                    className={`group p-4 cursor-pointer transition-all hover:bg-gray-50 relative
                                        ${selectedId === thread.id ? 'bg-purple-50 border-l-4 border-l-purple-600' : 'border-l-4 border-l-transparent'}
                                        ${hasUnread ? 'bg-white' : 'bg-gray-50/50'}
                                    `}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className={`text-sm truncate pr-2 ${hasUnread ? 'font-bold text-black' : 'font-medium text-gray-700'}`}>
                                            {thread.subject}
                                        </h4>
                                        <span className="text-[10px] text-gray-400 whitespace-nowrap">
                                            {formatDate(thread.updated_at)}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                                        <span className="font-medium text-gray-600">{lastSenderLabel}:</span>{' '}
                                        {lastReply?.body.slice(0, 120) || ''}
                                    </p>

                                    {hasUnread && (
                                        <div className="absolute top-4 right-2 w-2 h-2 rounded-full bg-purple-600 shadow-sm shadow-purple-200" />
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
