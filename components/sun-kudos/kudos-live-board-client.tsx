'use client'

import { useState, useCallback } from 'react'
import { KudosKvBanner } from './kudos-kv-banner'
import { KudosSubmitInput } from './kudos-submit-input'
import { KudosHighlightSection } from './kudos-highlight-section'
import { KudosSpotlightSection } from './kudos-spotlight-section'
import { KudosAllKudosSection } from './kudos-all-kudos-section'
import { KudosSubmitDialog } from './kudos-submit-dialog'
import { KudosSecretBoxDialog } from './kudos-secret-box-dialog'
import { KudosToast } from './kudos-toast'
import type {
  KudosFeedItem, KudosStats, SpotlightNode, PrizeRecipient,
  SecretBox, FilterState, FeedPage, KudosHashtag, Department, KudosCategory,
} from '@/lib/kudos/types'

interface KudosLiveBoardClientProps {
  currentUserId: string
  highlightKudos: KudosFeedItem[]
  feedItems: KudosFeedItem[]
  feedCursor: string | null
  stats: KudosStats
  spotlightNodes: SpotlightNode[]
  totalKudosCount: number
  departments: Department[]
  hashtags: KudosHashtag[]
  categories: KudosCategory[]
  prizeRecipients: PrizeRecipient[]
  secretBoxes: SecretBox[]
  fetchHighlight: (filters: FilterState) => Promise<KudosFeedItem[]>
  loadMore: (cursor: string | null, filters: FilterState) => Promise<FeedPage>
}

export function KudosLiveBoardClient({
  currentUserId,
  highlightKudos,
  feedItems,
  feedCursor,
  stats,
  spotlightNodes,
  totalKudosCount,
  departments,
  hashtags,
  categories,
  prizeRecipients,
  secretBoxes,
  fetchHighlight,
  loadMore,
}: KudosLiveBoardClientProps) {
  const [filters, setFilters] = useState<FilterState>({ hashtag_ids: [], department_id: null })
  const [submitOpen, setSubmitOpen] = useState(false)
  const [secretBoxOpen, setSecretBoxOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = useCallback((msg: string) => setToast(msg), [])
  const dismissToast = useCallback(() => setToast(null), [])

  function handleHashtagClick(hashtag: string) {
    const match = hashtags.find((h) => h.name === hashtag)
    if (!match) return
    if (filters.hashtag_ids.includes(match.id)) return
    setFilters((f) => ({ ...f, hashtag_ids: [...f.hashtag_ids, match.id].slice(0, 5) }))
  }

  return (
    <div className="flex flex-col" style={{ background: '#00101A' }}>
      <KudosKvBanner />

      <div className="px-4 sm:px-8 md:px-[72px] lg:px-[144px] flex justify-center py-6">
        <KudosSubmitInput onOpen={() => setSubmitOpen(true)} />
      </div>

      <KudosHighlightSection
        initialItems={highlightKudos}
        hashtags={hashtags}
        departments={departments}
        currentUserId={currentUserId}
        filters={filters}
        onFiltersChange={setFilters}
        onCopySuccess={() => showToast('Link copied — ready to share!')}
        fetchHighlight={fetchHighlight}
      />

      <div className="px-4 sm:px-8 md:px-[72px] lg:px-[144px] py-10">
        <KudosSpotlightSection nodes={spotlightNodes} totalKudosCount={totalKudosCount} />
      </div>

      <div className="px-4 sm:px-8 md:px-[72px] lg:px-[144px] py-10">
        <KudosAllKudosSection
          initialItems={feedItems}
          initialCursor={feedCursor}
          filters={filters}
          currentUserId={currentUserId}
          stats={stats}
          prizeRecipients={prizeRecipients}
          onHashtagClick={handleHashtagClick}
          onCopySuccess={() => showToast('Link copied — ready to share!')}
          onOpenSecretBox={() => setSecretBoxOpen(true)}
          loadMore={loadMore}
        />
      </div>

      <KudosSubmitDialog
        open={submitOpen}
        onClose={() => setSubmitOpen(false)}
        categories={categories}
        hashtags={hashtags}
        currentUserId={currentUserId}
        onSuccess={() => {
          setSubmitOpen(false)
          showToast('Kudos đã được gửi!')
        }}
      />

      <KudosSecretBoxDialog
        open={secretBoxOpen}
        onClose={() => setSecretBoxOpen(false)}
        secretBoxes={secretBoxes}
      />

      {toast && (
        <KudosToast
          message={toast}
          onDismiss={dismissToast}
        />
      )}
    </div>
  )
}
