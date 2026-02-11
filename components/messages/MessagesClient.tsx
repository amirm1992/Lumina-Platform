'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { AuthUser } from '@/types/auth'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import { MessageList } from './MessageList'
import { MessageDetail } from './MessageDetail'
import { ComposeModal } from './ComposeModal'
import { MessageThread } from './types'
import { Plus, Loader2 } from 'lucide-react'

interface MessagesClientProps {
    user: AuthUser | null
}

export function MessagesClient({ user }: MessagesClientProps) {
    const [threads, setThreads] = useState<MessageThread[]>([])
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [filter, setFilter] = useState<'all' | 'unread'>('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [isComposeOpen, setIsComposeOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const [sending, setSending] = useState(false)

    const selectedThread = threads.find(t => t.id === selectedId) || null

    // Fetch threads from API
    const fetchThreads = useCallback(async () => {
        try {
            const res = await fetch('/api/messages', { cache: 'no-store' })
            if (res.ok) {
                const data = await res.json()
                setThreads(data.threads || [])
            }
        } catch (err) {
            console.error('Failed to fetch messages:', err)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchThreads()
        // Poll every 30 seconds for new replies
        const interval = setInterval(fetchThreads, 30000)
        return () => clearInterval(interval)
    }, [fetchThreads])

    const handleSelectThread = async (id: string) => {
        setSelectedId(id)
        // Mark replies as read
        try {
            await fetch(`/api/messages/${id}/replies`, { method: 'PATCH' })
            // Update local state
            setThreads(prev => prev.map(t =>
                t.id === id
                    ? { ...t, replies: t.replies.map(r => r.sender_role === 'admin' ? { ...r, is_read: true } : r) }
                    : t
            ))
        } catch (err) {
            console.error('Failed to mark as read:', err)
        }
    }

    const handleSend = async (subject: string, message: string) => {
        setSending(true)
        try {
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subject, message }),
            })
            if (res.ok) {
                const data = await res.json()
                setThreads(prev => [data.thread, ...prev])
                setSelectedId(data.thread.id)
                setIsComposeOpen(false)
            }
        } catch (err) {
            console.error('Failed to send message:', err)
        } finally {
            setSending(false)
        }
    }

    const handleReply = async (threadId: string, message: string) => {
        try {
            const res = await fetch(`/api/messages/${threadId}/replies`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message }),
            })
            if (res.ok) {
                const data = await res.json()
                setThreads(prev => prev.map(t =>
                    t.id === threadId
                        ? { ...t, replies: [...t.replies, data.reply], updated_at: new Date().toISOString() }
                        : t
                ))
            }
        } catch (err) {
            console.error('Failed to send reply:', err)
        }
    }

    return (
        <div className="h-screen flex flex-col bg-gray-50 selection:bg-purple-100 font-sans text-gray-900 overflow-hidden pt-20">
            <DashboardSidebar />

            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar Container */}
                <div className={`flex flex-col h-full border-r border-gray-200 bg-white
                    ${selectedThread ? 'hidden md:flex' : 'flex w-full'} 
                    md:w-80 lg:w-96 shrink-0
                `}>
                    <div className="p-4 flex items-center justify-between border-b border-gray-100">
                        <h2 className="text-lg font-bold text-black">Inbox</h2>
                        <button
                            onClick={() => setIsComposeOpen(true)}
                            className="p-2 rounded-full bg-black hover:bg-gray-800 text-white transition-all shadow-md"
                            title="Compose New Message"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>

                    {loading ? (
                        <div className="flex-1 flex items-center justify-center">
                            <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
                        </div>
                    ) : (
                        <MessageList
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

                {/* Main Content */}
                <div className={`
                    ${selectedThread ? 'flex' : 'hidden md:flex'} 
                    flex-1 h-full bg-gray-50
                `}>
                    <MessageDetail
                        thread={selectedThread}
                        currentUserId={user?.id || ''}
                        onReply={handleReply}
                        onBack={() => setSelectedId(null)}
                    />
                </div>
            </div>

            <ComposeModal
                isOpen={isComposeOpen}
                onClose={() => setIsComposeOpen(false)}
                onSend={handleSend}
                sending={sending}
            />
        </div>
    )
}
