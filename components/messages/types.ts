export interface MessageReply {
    id: string
    thread_id: string
    sender_id: string
    sender_role: 'client' | 'admin'
    sender_name: string | null
    body: string
    is_read: boolean
    created_at: string
}

export interface MessageThread {
    id: string
    user_id: string
    subject: string
    status: 'open' | 'closed'
    created_at: string
    updated_at: string
    replies: MessageReply[]
}

// Derived convenience type for the list view
export interface ThreadSummary {
    id: string
    subject: string
    lastReply: MessageReply | null
    hasUnread: boolean
    updatedAt: string
}
