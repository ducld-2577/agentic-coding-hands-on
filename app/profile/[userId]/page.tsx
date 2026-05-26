import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { HomeHeader } from '@/components/home/home-header'

interface ProfileUserPageProps {
  params: Promise<{ userId: string }>
}

export default async function ProfileUserPage({ params }: ProfileUserPageProps) {
  const { userId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Own profile → redirect to the canonical /profile page
  if (userId === user.id) redirect('/profile')

  // Other users' profiles — not yet implemented
  return (
    <main className="min-h-screen bg-[#00101A]">
      <HomeHeader user={user} />
      <div className="flex min-h-screen items-center justify-center pt-[72px]">
        <div className="text-center">
          <h1 className="font-montserrat text-2xl font-semibold text-white">Profile</h1>
          <p className="mt-2 font-montserrat text-white/60">Coming soon</p>
        </div>
      </div>
    </main>
  )
}
