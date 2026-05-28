import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { HomeHeader } from '@/components/home/home-header'
import { HomeFooter } from '@/components/home/home-footer'
import { ProfileHeroSection } from '@/components/profile/profile-hero-section'
import { ProfileStatsSection } from '@/components/profile/profile-stats-section'
import { ProfileKudosFeed } from '@/components/profile/profile-kudos-feed'
import {
  getUserProfile,
  getKudosStats,
  getUserSecretBoxes,
  getProfileKudosFeed,
} from '@/lib/kudos/queries'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [profile, stats, secretBoxes, initialFeed] = await Promise.all([
    getUserProfile(user.id),
    getKudosStats(user.id),
    getUserSecretBoxes(user.id),
    getProfileKudosFeed(user.id, 'sent', null),
  ])

  return (
    <main className="min-h-screen bg-[#00101A]">
      <HomeHeader user={user} />

      <div className="pt-[72px]">
        <ProfileHeroSection profile={profile} />

        <div className="mx-auto px-4 sm:px-8 py-8" style={{ maxWidth: 800 }}>
          <ProfileStatsSection stats={stats} secretBoxes={secretBoxes} />

          <ProfileKudosFeed
            initialItems={initialFeed.items}
            initialCursor={initialFeed.nextCursor}
            userId={user.id}
            initialSentCount={stats.sent}
            initialReceivedCount={stats.received}
          />
        </div>
      </div>

      <HomeFooter />
    </main>
  )
}
