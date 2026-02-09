export type { Document, DocumentCategory, DocumentStatus, DocumentUploader, DocumentSlotDef } from '@/types/database'
export { DOCUMENT_SLOTS } from '@/types/database'

/** Presentation-layer file object used by DocHub UI components */
export interface DocFile {
    id: string
    name: string
    type: 'pdf' | 'image' | 'other'
    status: 'pending' | 'verified' | 'rejected'
    category: string
    uploadDate: string
    size: string
}
