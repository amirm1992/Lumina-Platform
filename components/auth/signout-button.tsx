'use client'

import { useClerk } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export default function SignOutButton() {
    const { signOut } = useClerk()
    const router = useRouter()

    const handleSignOut = async () => {
        await signOut()
        router.push('/')
    }

    return (
        <button
            onClick={handleSignOut}
            className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
        >
            Sign Out
        </button>
    )
}
