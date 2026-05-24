'use client'

import { KudosFeed } from './kudos-feed'
import { KudosSidebar } from './kudos-sidebar'
import type { KudosFeedItem, FilterState, KudosStats, PrizeRecipient, FeedPage } from '@/lib/kudos/types'

interface KudosAllKudosSectionProps {
  initialItems: KudosFeedItem[]
  initialCursor: string | null
  filters: FilterState
  currentUserId: string
  stats: KudosStats
  prizeRecipients: PrizeRecipient[]
  onHashtagClick: (hashtag: string) => void
  onCopySuccess: () => void
  onOpenSecretBox: () => void
  loadMore: (cursor: string | null, filters: FilterState) => Promise<FeedPage>
}

export function KudosAllKudosSection({
  initialItems,
  initialCursor,
  filters,
  currentUserId,
  stats,
  prizeRecipients,
  onHashtagClick,
  onCopySuccess,
  onOpenSecretBox,
  loadMore,
}: KudosAllKudosSectionProps) {
  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Sun* Annual Awards 2025
        </p>
        <hr style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
        <h2 className="text-2xl font-bold uppercase tracking-wide text-white">
          All Kudos
        </h2>
      </div>

      <div className="grid gap-8" style={{ gridTemplateColumns: '1fr 422px' }}>
        <KudosFeed
          initialItems={initialItems}
          initialCursor={initialCursor}
          filters={filters}
          currentUserId={currentUserId}
          onHashtagClick={onHashtagClick}
          onCopySuccess={onCopySuccess}
          loadMore={loadMore}
        />
        <KudosSidebar
          stats={stats}
          prizeRecipients={prizeRecipients}
          onOpenSecretBox={onOpenSecretBox}
        />
      </div>
    </section>
  )
}
