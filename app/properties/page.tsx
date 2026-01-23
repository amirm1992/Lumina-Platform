import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { PropertiesClient } from '@/components/properties/PropertiesClient'

export default async function PropertiesPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return redirect('/login')

    return <PropertiesClient user={user} />
}
