'use client'

import React, { useState } from 'react'
import { AuthUser } from '@/types/auth'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import { MessageList } from './MessageList'
import { MessageDetail } from './MessageDetail'
import { ComposeModal } from './ComposeModal'
import { Message } from './types'
import { Plus } from 'lucide-react'

interface MessagesClientProps {
    user: AuthUser | null
}

const INITIAL_MESSAGES: Message[] = [
    {
        id: '1',
        sender: 'Lumina Support',
        senderEmail: 'support@lumina.com',
        subject: 'Welcome to Lumina Beta',
        preview: 'Thanks for joining the Lumina early access program. We are excited to have you on board.',
        body: `Hi there,\n\nWelcome to Lumina! We're thrilled to have you as one of our early adopters.\n\nLumina is designed to streamline your property investment workflow, from analysis to acquisition. Take a look around, add your first property, and let us know what you think.\n\nIf you have any questions, feel free to reply to this message directly.\n\nBest,\nThe Lumina Team`,
        date: '10:00 AM',
        status: 'unread'
    },
    {
        id: '2',
        sender: 'System Alert',
        senderEmail: 'alerts@lumina.com',
        subject: 'Rate Limit Warning',
        preview: 'You are approaching your API rate limit for property searches this month.',
        body: `Hello User,\n\nThis is an automated notification to let you know that you have used 85% of your property lookup quota for this month.\n\nTo ensure uninterrupted service, consider upgrading your plan or wait until the next billing cycle for your quota to reset.\n\nRegards,\nLumina Systems`,
        date: 'Yesterday',
        status: 'read'
    },
    {
        id: '3',
        sender: 'Sarah Jenkins',
        senderEmail: 's.jenkins@brokerage.com',
        subject: 'Regarding the property on Grand Lake',
        preview: 'I saw you were interested in the 5500 Grand Lake Dr listing. Is it still available?',
        body: `Hi,\n\nI noticed you added 5500 Grand Lake Dr to your watchlist. I represent a potential buyer who is very interested in this area.\n\nIs this property currently under contract? Please let me know if we can schedule a viewing or discuss further.\n\nThanks,\nSarah`,
        date: 'Jan 20',
        status: 'read'
    }
]

export function MessagesClient({ user }: MessagesClientProps) {
    const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [filter, setFilter] = useState<'all' | 'unread'>('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [isComposeOpen, setIsComposeOpen] = useState(false)

    const selectedMessage = messages.find(m => m.id === selectedId) || null

    const handleSelectMessage = (id: string) => {
        setSelectedId(id)
        // Mark as read
        setMessages(prev => prev.map(m => m.id === id ? { ...m, status: 'read' as const } : m))
    }

    const handleDeleteMessage = (id: string, e?: React.MouseEvent) => {
        e?.stopPropagation()
        setMessages(prev => prev.filter(m => m.id !== id))
        if (selectedId === id) setSelectedId(null)
    }

    const handleSend = (to: string, subject: string, body: string) => {
        // Mock sending - just add to list for feedback loop or show toast
        // ideally we would likely show a "Sent" success toast.
        setIsComposeOpen(false)
    }

    return (
        <div className="h-screen flex flex-col bg-gray-50 selection:bg-purple-100 font-sans text-gray-900 overflow-hidden pt-20">
            <DashboardSidebar />

            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar Container */}
                <div className={`flex flex-col h-full border-r border-gray-200 bg-white
                    ${selectedMessage ? 'hidden md:flex' : 'flex w-full'} 
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

                    <MessageList
                        messages={messages}
                        selectedId={selectedId}
                        onSelect={handleSelectMessage}
                        onDelete={handleDeleteMessage}
                        filter={filter}
                        setFilter={setFilter}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                    />
                </div>

                {/* Main Content */}
                <div className={`
                    ${selectedMessage ? 'flex' : 'hidden md:flex'} 
                    flex-1 h-full bg-gray-50
                `}>
                    <MessageDetail
                        message={selectedMessage}
                        onDelete={(id) => handleDeleteMessage(id)}
                        onBack={() => setSelectedId(null)}
                    />
                </div>
            </div>

            <ComposeModal
                isOpen={isComposeOpen}
                onClose={() => setIsComposeOpen(false)}
                onSend={handleSend}
            />
        </div>
    )
}
