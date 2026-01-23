'use client'

import { signOut } from '@/app/login/actions'

export default function SignOutButton() {
    return (
        <button onClick={() => signOut()} className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">
            Sign Out
        </button>
    )
}
