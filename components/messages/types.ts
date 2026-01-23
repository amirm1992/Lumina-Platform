export type MessageStatus = 'unread' | 'read'

export interface Message {
    id: string
    sender: string
    senderEmail?: string
    subject: string
    preview: string
    body: string
    date: string
    status: MessageStatus
    avatar?: string
}
