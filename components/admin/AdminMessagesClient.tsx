'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Search, MessageSquare, Send, ArrowLeft, Reply, Loader2, User } from 'lucide-react'

/* ──────────────────── Types ──────────────────── */
interface AdminMessageReply {
    id: string
    thread_id: string
    sender_id: string
    sender_role: 'client' | 'admin'
    sender_name: string | null
    body: string
    is_read: boolean
    created_at: string
}

interface AdminMessageThread {
    id: string
    user_id: string
    user_name: string
    user_email: string
    subject: string
    status: 'open' | 'closed'
    created_at: string
    updated_at: string
    unread_count: number
    replies: AdminMessageReply[]
}

/* ──────────────────── Helpers ──────────────────── */
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

/* ──────────────────── Thread List ──────────────────── */
function ThreadList({
    threads,
    selectedId,
    onSelect,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
}: {
    threads: AdminMessageThread[]
    selectedId: string | null
    onSelect: (id: string) => void
    filter: 'all' | 'unread'
    setFilter: (f: 'all' | 'unread') => void
    searchQuery: string
    setSearchQuery: (q: string) => void
}) {
    const filtered = threads.filter((t) => {
        const matchesFilter = filter === 'all' || (filter === 'unread' && t.unread_count > 0)
        const q = searchQuery.toLowerCase()
        const matchesSearch =
            t.subject.toLowerCase().includes(q) ||
            t.user_name.toLowerCase().includes(q) ||
            t.user_email.toLowerCase().includes(q) ||
            t.replies.some((r) => r.body.toLowerCase().includes(q))
        return matchesFilter && matchesSearch
    })

    const totalUnread = threads.reduce((sum, t) => sum + t.unread_count, 0)

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 space-y-3">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900">Messages</h2>
                    {totalUnread > 0 && (
                        <span className="text-xs font-bold bg-purple-600 text-white px-2 py-0.5 rounded-full">
                            {totalUnread}
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-100 transition-all">
                    <Search className="w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name, email, or content..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent border-none outline-none text-sm text-gray-900 placeholder-gray-400 w-full"
                    />
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`flex-1 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${
                            filter === 'all'
                                ? 'bg-purple-600 text-white shadow-md'
                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('unread')}
                        className={`flex-1 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${
                            filter === 'unread'
                                ? 'bg-purple-600 text-white shadow-md'
                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                    >
                        Unread
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
                {filtered.length === 0 ? (
                    <div className="p-8 text-center text-gray-400 text-sm flex flex-col items-center gap-3">
                        <MessageSquare className="w-8 h-8 text-gray-300" />
                        {threads.length === 0 ? 'No messages yet.' : 'No messages match your search.'}
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {filtered.map((thread) => {
                            const lastReply = thread.replies[thread.replies.length - 1]
                            const hasUnread = thread.unread_count > 0
                            const lastSenderLabel =
                                lastReply?.sender_role === 'admin'
                                    ? 'You'
                                    : thread.user_name || 'Client'

                            return (
                                <div
                                    key={thread.id}
                                    onClick={() => onSelect(thread.id)}
                                    className={`group p-4 cursor-pointer transition-all hover:bg-gray-50 relative ${
                                        selectedId === thread.id
                                            ? 'bg-purple-50 border-l-4 border-l-purple-600'
                                            : 'border-l-4 border-l-transparent'
                                    } ${hasUnread ? 'bg-white' : 'bg-gray-50/50'}`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <h4
                                            className={`text-sm truncate pr-2 ${
                                                hasUnread ? 'font-bold text-gray-900' : 'font-medium text-gray-700'
                                            }`}
                                        >
                                            {thread.subject}
                                        </h4>
                                        <span className="text-[10px] text-gray-400 whitespace-nowrap">
                                            {formatDate(thread.updated_at)}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-1.5 mb-1">
                                        <User className="w-3 h-3 text-gray-400" />
                                        <span className="text-xs text-purple-600 font-medium truncate">
                                            {thread.user_name}
                                        </span>
                                        <span className="text-[10px] text-gray-400 truncate">
                                            ({thread.user_email})
                                        </span>
                                    </div>

                                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                                        <span className="font-medium text-gray-600">{lastSenderLabel}:</span>{' '}
                                        {lastReply?.body.slice(0, 120) || ''}
                                    </p>

                                    {hasUnread && (
                                        <div className="absolute top-4 right-2 flex items-center gap-1">
                                            <span className="text-[10px] font-bold text-purple-600">
                                                {thread.unread_count}
                                            </span>
                                            <div className="w-2 h-2 rounded-full bg-purple-600 shadow-sm shadow-purple-200" />
                                        </div>
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

/* ──────────────────── Conversation Detail ──────────────────── */
function ConversationDetail({
    thread,
    onReply,
    onBack,
}: {
    thread: AdminMessageThread | null
    onReply: (threadId: string, message: string) => Promise<void>
    onBack: () => void
}) {
    const [replyText, setReplyText] = useState('')
    const [sending, setSending] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

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
                <h3 className="text-xl font-bold text-gray-900 mb-2">Select a conversation</h3>
                <p className="text-gray-400 max-w-xs">
                    Choose a message thread from the list to view and reply.
                </p>
            </div>
        )
    }

    const handleSend = async () => {
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
                <button
                    onClick={onBack}
                    className="lg:hidden p-2 rounded-md hover:bg-gray-100 text-gray-500 hover:text-gray-900"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex-1 min-w-0">
                    <h1 className="text-lg font-bold text-gray-900 truncate">{thread.subject}</h1>
                    <p className="text-xs text-gray-400">
                        <span className="text-purple-600 font-medium">{thread.user_name}</span>
                        {' · '}
                        {thread.user_email}
                        {' · '}
                        {thread.replies.length} message{thread.replies.length !== 1 ? 's' : ''}
                    </p>
                </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
                {thread.replies.map((reply) => {
                    const isAdmin = reply.sender_role === 'admin'
                    return (
                        <div key={reply.id} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[75%] ${isAdmin ? 'order-2' : 'order-1'}`}>
                                <div
                                    className={`rounded-2xl px-4 py-3 shadow-sm ${
                                        isAdmin
                                            ? 'bg-purple-600 text-white rounded-br-md shadow-md shadow-purple-900/20'
                                            : 'bg-white text-gray-900 border border-gray-200 rounded-bl-md'
                                    }`}
                                >
                                    {!isAdmin && (
                                        <p className="text-xs font-semibold text-purple-600 mb-1">
                                            {thread.user_name || 'Client'}
                                        </p>
                                    )}
                                    {isAdmin && (
                                        <p className="text-xs font-semibold text-purple-200 mb-1">
                                            {reply.sender_name || 'You'}
                                        </p>
                                    )}
                                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                                        {reply.body}
                                    </div>
                                </div>
                                <p
                                    className={`text-[10px] text-gray-400 mt-1 ${
                                        isAdmin ? 'text-right' : 'text-left'
                                    }`}
                                >
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
                                handleSend()
                            }
                        }}
                        placeholder="Type your reply to the client..."
                        rows={1}
                        className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all resize-none"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!replyText.trim() || sending}
                        className="p-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-purple-900/20 shrink-0"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
                <p className="text-[10px] text-gray-400 mt-2">Press Enter to send, Shift+Enter for new line</p>
            </div>
        </div>
    )
}

/* ──────────────────── Main Client ──────────────────── */
export function AdminMessagesClient() {
    const [threads, setThreads] = useState<AdminMessageThread[]>([])
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [filter, setFilter] = useState<'all' | 'unread'>('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [loading, setLoading] = useState(true)

    const selectedThread = threads.find((t) => t.id === selectedId) || null

    const fetchThreads = useCallback(async () => {
        try {
            const res = await fetch('/api/admin/messages', { cache: 'no-store' })
            if (res.ok) {
                const data = await res.json()
                setThreads(data.threads || [])
            }
        } catch (err) {
            console.error('Failed to fetch admin messages:', err)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchThreads()
        const interval = setInterval(fetchThreads, 30000)
        return () => clearInterval(interval)
    }, [fetchThreads])

    const handleSelectThread = async (id: string) => {
        setSelectedId(id)
        try {
            await fetch(`/api/admin/messages/${id}/replies`, { method: 'PATCH' })
            setThreads((prev) =>
                prev.map((t) =>
                    t.id === id
                        ? {
                              ...t,
                              unread_count: 0,
                              replies: t.replies.map((r) =>
                                  r.sender_role === 'client' ? { ...r, is_read: true } : r
                              ),
                          }
                        : t
                )
            )
        } catch (err) {
            console.error('Failed to mark as read:', err)
        }
    }

    const handleReply = async (threadId: string, message: string) => {
        try {
            const res = await fetch(`/api/admin/messages/${threadId}/replies`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message }),
            })
            if (res.ok) {
                const data = await res.json()
                setThreads((prev) =>
                    prev.map((t) =>
                        t.id === threadId
                            ? {
                                  ...t,
                                  unread_count: 0,
                                  replies: [
                                      ...t.replies.map((r) =>
                                          r.sender_role === 'client' ? { ...r, is_read: true } : r
                                      ),
                                      {
                                          id: data.reply.id,
                                          thread_id: threadId,
                                          sender_id: data.reply.sender_id,
                                          sender_role: data.reply.sender_role,
                                          sender_name: data.reply.sender_name,
                                          body: data.reply.body,
                                          is_read: data.reply.is_read,
                                          created_at: data.reply.created_at,
                                      },
                                  ],
                                  updated_at: new Date().toISOString(),
                              }
                            : t
                    )
                )
            }
        } catch (err) {
            console.error('Failed to send admin reply:', err)
        }
    }

    return (
        <div className="h-[calc(100vh-64px)] flex overflow-hidden -m-4 sm:-m-6 lg:-m-8 bg-white rounded-lg border border-gray-200">
            {/* Thread list sidebar */}
            <div
                className={`flex flex-col h-full border-r border-gray-200 bg-white ${
                    selectedThread ? 'hidden lg:flex' : 'flex w-full'
                } lg:w-80 xl:w-96 shrink-0`}
            >
                {loading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
                    </div>
                ) : (
                    <ThreadList
                        threads={threads}
                        selectedId={selectedId}
                        onSelect={handleSelectThread}
                        filter={filter}
                        setFilter={setFilter}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                    />
                )}
            </div>

            {/* Conversation detail */}
            <div className={`${selectedThread ? 'flex' : 'hidden lg:flex'} flex-1 h-full bg-gray-50`}>
                <ConversationDetail
                    thread={selectedThread}
                    onReply={handleReply}
                    onBack={() => setSelectedId(null)}
                />
            </div>
        </div>
    )
}
