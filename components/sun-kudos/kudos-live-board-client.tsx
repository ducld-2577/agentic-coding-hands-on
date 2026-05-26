'use client'

import { useState, useCallback, useEffect } from 'react'
import { KudosKvBanner } from './kudos-kv-banner'
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
  const [preselectedReceiver, setPreselectedReceiver] = useState<{ id: string; full_name: string; avatar_url: string | null } | null>(null)
  const [secretBoxOpen, setSecretBoxOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = useCallback((msg: string) => setToast(msg), [])
  const dismissToast = useCallback(() => setToast(null), [])

  useEffect(() => {
    function handleOpenSubmit(e: Event) {
      const detail = (e as CustomEvent<{ id: string; full_name: string; avatar_url: string | null }>).detail
      setPreselectedReceiver(detail ?? null)
      setSubmitOpen(true)
    }
    window.addEventListener('kudos:open-submit', handleOpenSubmit)
    return () => window.removeEventListener('kudos:open-submit', handleOpenSubmit)
  }, [])

  function handleHashtagClick(hashtag: string) {
    const match = hashtags.find((h) => h.name === hashtag)
    if (!match) return
    if (filters.hashtag_ids.includes(match.id)) return
    setFilters((f) => ({ ...f, hashtag_ids: [...f.hashtag_ids, match.id].slice(0, 5) }))
  }

  return (
    <div className="flex flex-col" style={{ background: '#00101A' }}>
      <KudosKvBanner onOpenKudos={() => setSubmitOpen(true)} />

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

      <KudosSpotlightSection nodes={spotlightNodes} totalKudosCount={totalKudosCount} recentFeed={feedItems} />

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
        onClose={() => { setSubmitOpen(false); setPreselectedReceiver(null) }}
        categories={categories}
        hashtags={hashtags}
        currentUserId={currentUserId}
        preselectedReceiver={preselectedReceiver ?? undefined}
        onSuccess={() => {
          setSubmitOpen(false)
          setPreselectedReceiver(null)
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
