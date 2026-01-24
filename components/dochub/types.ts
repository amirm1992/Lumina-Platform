export type DocCategory = 'client_upload' | 'lender_doc' | 'disclosure'

export interface DocFile {
    id: string
    name: string
    category: DocCategory
    uploadDate: string
    size: string
    type: 'pdf' | 'image' | 'doc'
    status?: 'pending' | 'verified' | 'rejected'
    downloadUrl?: string
    path?: string
}
