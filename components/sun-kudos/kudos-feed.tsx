'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { KudosPostCard } from './kudos-post-card'
import type { KudosFeedItem, FilterState, FeedPage } from '@/lib/kudos/types'

interface KudosFeedProps {
  initialItems: KudosFeedItem[]
  initialCursor: string | null
  filters: FilterState
  currentUserId: string
  onHashtagClick: (hashtag: string) => void
  onCopySuccess: () => void
  loadMore: (cursor: string | null, filters: FilterState) => Promise<FeedPage>
}

export function KudosFeed({
  initialItems,
  initialCursor,
  filters,
  currentUserId,
  onHashtagClick,
  onCopySuccess,
  loadMore,
}: KudosFeedProps) {
  const [items, setItems] = useState<KudosFeedItem[]>(initialItems)
  const [cursor, setCursor] = useState<string | null>(initialCursor)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialCursor !== null)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const filtersRef = useRef(filters)

  // Update filter ref when filters change
  useEffect(() => {
    filtersRef.current = filters
  }, [filters])

  const fetchMore = useCallback(async () => {
    const currentCursor = cursor
    if (!currentCursor || loading || !hasMore) return
    setLoading(true)
    try {
      const page = await loadMore(currentCursor, filtersRef.current)
      setItems((prev) => [...prev, ...page.items])
      setCursor(page.nextCursor)
      setHasMore(page.nextCursor !== null)
    } catch {
      // silent: feed keeps current items on error
    } finally {
      setLoading(false)
    }
  }, [cursor, loading, hasMore, loadMore])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchMore()
      },
      { threshold: 0.1 },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [fetchMore])

  if (items.length === 0 && !loading) {
    return (
      <p className="text-center py-12 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
        Hiện tại chưa có Kudos nào.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {items.map((item) => (
        <KudosPostCard
          key={item.id}
          item={item}
          currentUserId={currentUserId}
          onHashtagClick={onHashtagClick}
          onCopySuccess={onCopySuccess}
        />
      ))}

      <div ref={sentinelRef} className="h-4" aria-hidden="true" />

      {loading && (
        <div className="flex justify-center py-6">
          <span
            className="inline-block w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: '#F5C842', borderTopColor: 'transparent' }}
          />
        </div>
      )}
    </div>
  )
}
