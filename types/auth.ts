// Flexible user type for Clerk compatibility
export interface AuthUser {
    id: string
    email: string
    user_metadata?: {
        full_name?: string
        first_name?: string
    }
}
