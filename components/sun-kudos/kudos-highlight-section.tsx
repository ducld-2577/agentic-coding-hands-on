'use client'

import { useState, useEffect, useTransition } from 'react'
import { KudosFilterButtons } from './kudos-filter-buttons'
import { KudosHighlightCarousel } from './kudos-highlight-carousel'
import type { KudosFeedItem, KudosHashtag, Department, FilterState } from '@/lib/kudos/types'

interface KudosHighlightSectionProps {
  initialItems: KudosFeedItem[]
  hashtags: KudosHashtag[]
  departments: Department[]
  currentUserId: string
  filters: FilterState
  onFiltersChange: (f: FilterState) => void
  onCopySuccess: () => void
  fetchHighlight: (filters: FilterState) => Promise<KudosFeedItem[]>
}

export function KudosHighlightSection({
  initialItems,
  hashtags,
  departments,
  currentUserId,
  filters,
  onFiltersChange,
  onCopySuccess,
  fetchHighlight,
}: KudosHighlightSectionProps) {
  const [items, setItems] = useState<KudosFeedItem[]>(initialItems)
  const [carouselKey, setCarouselKey] = useState(0)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    startTransition(async () => {
      try {
        const fresh = await fetchHighlight(filters)
        setItems(fresh)
        setCarouselKey((k) => k + 1)
      } catch {
        // keep previous items on error
      }
    })
  }, [filters, fetchHighlight])

  return (
    <section
      aria-label="Highlight Kudos"
      className="w-full py-10"
      style={{ background: '#00101A' }}
    >
      <div className="px-4 sm:px-8 md:px-[72px] lg:px-[144px]">
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

          <div className="flex items-center justify-between gap-4">
            <h2
              className="font-black uppercase leading-none"
              style={{ color: '#F5C842', fontSize: '64px', letterSpacing: '-1px' }}
            >
              HIGHLIGHT KUDOS
            </h2>
            <div className="flex items-center gap-2 flex-shrink-0">
              {isPending && (
                <span
                  className="text-xs animate-pulse"
                  style={{ color: 'rgba(255,255,255,0.4)' }}
                >
                  Loading…
                </span>
              )}
              <KudosFilterButtons
                hashtags={hashtags}
                departments={departments}
                filters={filters}
                onFiltersChange={onFiltersChange}
              />
            </div>
          </div>
        </div>

        <KudosHighlightCarousel
          key={carouselKey}
          items={items}
          currentUserId={currentUserId}
          onHashtagClick={(hashtag) => {
            const match = hashtags.find((h) => h.name === hashtag)
            if (!match) return
            const already = filters.hashtag_ids.includes(match.id)
            if (already) return
            const next = [...filters.hashtag_ids, match.id].slice(0, 5)
            onFiltersChange({ ...filters, hashtag_ids: next })
          }}
          onCopySuccess={onCopySuccess}
        />
      </div>
    </section>
  )
}
