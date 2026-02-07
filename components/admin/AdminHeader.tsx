import Image from 'next/image'
import Link from 'next/link'
import { getCurrentUser } from '@/utils/admin/api'

export async function AdminHeader() {
    const user = await getCurrentUser()

    return (
        <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Link href="/admin" className="flex items-center">
                    <Image
                        src="/logo-transparent.png"
                        alt="Lumina"
                        width={40}
                        height={40}
                        className="w-10 h-10"
                    />
                    <span className="ml-2 font-bold text-xl text-gray-900">Lumina Admin</span>
                </Link>
            </div>

            <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">
                    Logged in as <span className="font-medium text-gray-900">{user?.emailAddresses[0]?.emailAddress}</span>
                </span>
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-700 font-medium text-sm">
                        {user?.emailAddresses[0]?.emailAddress?.[0]?.toUpperCase() || 'A'}
                    </span>
                </div>
            </div>
        </header>
    )
}
