'use client'

import React from 'react'
import { Search, Mail, MailOpen, Trash2 } from 'lucide-react'
import { Message } from './types'

interface MessageListProps {
    messages: Message[]
    selectedId: string | null
    onSelect: (id: string) => void
    onDelete: (id: string, e: React.MouseEvent) => void
    filter: 'all' | 'unread'
    setFilter: (filter: 'all' | 'unread') => void
    searchQuery: string
    setSearchQuery: (query: string) => void
}

export function MessageList({
    messages,
    selectedId,
    onSelect,
    onDelete,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery
}: MessageListProps) {

    // Filter logic
    const filteredMessages = messages.filter(msg => {
        const matchesFilter = filter === 'all' || (filter === 'unread' && msg.status === 'unread')
        const matchesSearch = msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            msg.sender.toLowerCase().includes(searchQuery.toLowerCase())
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
                {filteredMessages.length === 0 ? (
                    <div className="p-8 text-center text-gray-400 text-sm">
                        No messages found.
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {filteredMessages.map((msg) => (
                            <div
                                key={msg.id}
                                onClick={() => onSelect(msg.id)}
                                className={`group p-4 cursor-pointer transition-all hover:bg-gray-50 relative
                                    ${selectedId === msg.id ? 'bg-purple-50 border-l-4 border-l-purple-600' : 'border-l-4 border-l-transparent'}
                                    ${msg.status === 'unread' ? 'bg-white' : 'bg-gray-50/50'}
                                `}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className={`text-sm truncate pr-2 ${msg.status === 'unread' ? 'font-bold text-black' : 'font-medium text-gray-700'}`}>
                                        {msg.sender}
                                    </h4>
                                    <span className="text-[10px] text-gray-400 whitespace-nowrap">{msg.date}</span>
                                </div>
                                <h5 className={`text-xs mb-2 truncate ${msg.status === 'unread' ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                                    {msg.subject}
                                </h5>
                                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                                    {msg.preview}
                                </p>

                                {/* Hover Actions */}
                                <div className="absolute right-2 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                    <button
                                        onClick={(e) => onDelete(msg.id, e)}
                                        className="p-1.5 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>

                                {msg.status === 'unread' && (
                                    <div className="absolute top-4 right-2 w-2 h-2 rounded-full bg-purple-600 shadow-sm shadow-purple-200" />
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
