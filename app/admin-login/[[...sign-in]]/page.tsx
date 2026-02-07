import { redirect } from 'next/navigation'

/**
 * Admin login: send users to the main sign-in page with a return URL.
 * The main /login page shows the full Clerk form and redirects to /admin/applications after sign-in.
 */
export default function AdminLoginPage() {
    redirect('/login?redirect=/admin/applications')
}
