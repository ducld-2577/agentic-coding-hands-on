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
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex items-center gap-3">
          <span
            className="text-xs font-medium tracking-wide"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            Sun* Annual Awards 2025
          </span>
          <hr
            className="flex-1"
            style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.12)' }}
          />
        </div>
        <h2
          className="font-black uppercase leading-none"
          style={{ color: '#F5C842', fontSize: '64px', letterSpacing: '-1px' }}
        >
          ALL KUDOS
        </h2>
      </div>

      {/* Figma: feed=680px, sidebar=422px, gap=50px, justify-between */}
      <div className="flex items-start justify-between" style={{ gap: '50px' }}>
        <div style={{ flex: '0 0 680px', minWidth: 0 }}>
          <KudosFeed
            initialItems={initialItems}
            initialCursor={initialCursor}
            filters={filters}
            currentUserId={currentUserId}
            onHashtagClick={onHashtagClick}
            onCopySuccess={onCopySuccess}
            loadMore={loadMore}
          />
        </div>
        <KudosSidebar
          stats={stats}
          prizeRecipients={prizeRecipients}
          onOpenSecretBox={onOpenSecretBox}
        />
      </div>
    </section>
  )
}
