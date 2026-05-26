import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { HomeHeader } from '@/components/home/home-header'
import { HomeFooter } from '@/components/home/home-footer'
import { KudosLiveBoardClient } from '@/components/sun-kudos/kudos-live-board-client'
import {
  getHighlightKudos, getKudosFeed, getKudosStats, getSpotlightData,
  getKudosTotalCount, getDepartments, getHashtags, getKudosCategories,
  getRecentPrizeRecipients, getUserSecretBoxes,
} from '@/lib/kudos/queries'
import { fetchHighlightKudos, fetchKudosFeed } from '@/lib/kudos/actions'

export default async function SunKudosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const filters = { hashtag_ids: [], department_id: null }

  const [
    highlightKudos,
    feedPage,
    stats,
    spotlightNodes,
    totalKudosCount,
    departments,
    hashtags,
    categories,
    prizeRecipients,
    secretBoxes,
  ] = await Promise.all([
    getHighlightKudos(filters, user.id),
    getKudosFeed(filters, null, user.id),
    getKudosStats(user.id),
    getSpotlightData(),
    getKudosTotalCount(),
    getDepartments(),
    getHashtags(),
    getKudosCategories(),
    getRecentPrizeRecipients(10),
    getUserSecretBoxes(user.id),
  ])

  return (
    <main
      aria-label="Sun* Kudos Live Board"
      className="relative min-h-screen w-full"
      style={{ background: '#00101A' }}
    >
      <HomeHeader user={user} />
      <div className="pt-[72px]">
        <KudosLiveBoardClient
          currentUserId={user.id}
          highlightKudos={highlightKudos}
          feedItems={feedPage.items}
          feedCursor={feedPage.nextCursor}
          stats={stats}
          spotlightNodes={spotlightNodes}
          totalKudosCount={totalKudosCount}
          departments={departments}
          hashtags={hashtags}
          categories={categories}
          prizeRecipients={prizeRecipients}
          secretBoxes={secretBoxes}
          fetchHighlight={fetchHighlightKudos}
          loadMore={fetchKudosFeed}
        />
      </div>
      <HomeFooter />
    </main>
  )
}
