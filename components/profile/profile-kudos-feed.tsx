'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { KudosPostCard } from '@/components/sun-kudos/kudos-post-card'
import { KudosDetailDialog } from '@/components/sun-kudos/kudos-detail-dialog'
import { KudosToast } from '@/components/sun-kudos/kudos-toast'
import { fetchProfileKudosFeed } from '@/lib/kudos/actions'
import type { KudosFeedItem, ProfileFeedFilter } from '@/lib/kudos/types'

interface ProfileKudosFeedProps {
  initialItems: KudosFeedItem[]
  initialCursor: string | null
  userId: string
  initialSentCount: number
  initialReceivedCount: number
}

export function ProfileKudosFeed({
  initialItems,
  initialCursor,
  userId,
  initialSentCount,
  initialReceivedCount,
}: ProfileKudosFeedProps) {
  const [filter, setFilter] = useState<ProfileFeedFilter>('sent')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [items, setItems] = useState<KudosFeedItem[]>(initialItems)
  const [cursor, setCursor] = useState<string | null>(initialCursor)
  const [loading, setLoading] = useState(false)
  const [detailItem, setDetailItem] = useState<KudosFeedItem | null>(null)
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  const activeCount = filter === 'sent' ? initialSentCount : initialReceivedCount

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const applyFilter = useCallback(async (newFilter: ProfileFeedFilter) => {
    if (newFilter === filter) return
    setDropdownOpen(false)
    setLoading(true)
    setFilter(newFilter)
    try {
      const page = await fetchProfileKudosFeed(newFilter, null)
      setItems(page.items)
      setCursor(page.nextCursor)
    } finally {
      setLoading(false)
    }
  }, [filter])

  const loadMore = useCallback(async () => {
    if (!cursor || loading) return
    setLoading(true)
    try {
      const page = await fetchProfileKudosFeed(filter, cursor)
      setItems((prev) => [...prev, ...page.items])
      setCursor(page.nextCursor)
    } finally {
      setLoading(false)
    }
  }, [cursor, filter, loading])

  const filterLabel = filter === 'sent' ? 'Đã gửi' : 'Đã nhận'

  return (
    <section className="mt-8">
      {/* Section header */}
      <div className="flex items-end justify-between gap-4 mb-4">
        <div className="flex flex-col gap-0.5">
          <span className="font-montserrat text-xs font-medium uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Sun* Annual Awards 2025
          </span>
          <h2 className="font-montserrat text-4xl font-extrabold text-white leading-none">
            KUDOS
          </h2>
        </div>

        {/* Filter dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full font-montserrat text-sm font-semibold transition-colors"
            style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.15)' }}
            aria-haspopup="listbox"
            aria-expanded={dropdownOpen}
          >
            {filterLabel} ({activeCount})
            <ChevronDown size={14} />
          </button>

          {dropdownOpen && (
            <ul
              role="listbox"
              className="absolute right-0 top-full mt-1 z-20 rounded-lg overflow-hidden"
              style={{ background: '#0B1A26', border: '1px solid rgba(255,255,255,0.12)', minWidth: 130 }}
            >
              {(['sent', 'received'] as const).map((opt) => (
                <li key={opt} role="option" aria-selected={filter === opt}>
                  <button
                    type="button"
                    onClick={() => applyFilter(opt)}
                    className="w-full px-4 py-2.5 text-left font-montserrat text-sm transition-colors hover:bg-white/10"
                    style={{ color: filter === opt ? '#F5C842' : 'white' }}
                  >
                    {opt === 'sent' ? `Đã gửi (${initialSentCount})` : `Đã nhận (${initialReceivedCount})`}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Feed */}
      {loading && items.length === 0 ? (
        <div className="text-center py-12 font-montserrat text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Đang tải...
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 font-montserrat text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
          {filter === 'sent' ? 'Bạn chưa gửi kudos nào.' : 'Bạn chưa nhận kudos nào.'}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <div key={item.id} className="relative">
              {/* Spam / flagged status badge */}
              {item.status && (
                <span
                  className="absolute top-3 right-3 z-10 px-2 py-0.5 rounded font-montserrat text-xs font-bold uppercase"
                  style={{ background: '#F5A623', color: '#1A1A1A' }}
                >
                  {item.status}
                </span>
              )}
              <KudosPostCard
                item={item}
                currentUserId={userId}
                onHashtagClick={() => {}}
                onCopySuccess={() => setToastMsg('Link đã được sao chép!')}
                onOpenDetail={() => setDetailItem(item)}
              />
            </div>
          ))}

          {cursor && (
            <button
              type="button"
              onClick={loadMore}
              disabled={loading}
              className="mx-auto mt-2 px-8 py-2.5 rounded-full font-montserrat text-sm font-semibold transition-opacity hover:opacity-80 disabled:opacity-50"
              style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.15)' }}
            >
              {loading ? 'Đang tải...' : 'Xem thêm'}
            </button>
          )}
        </div>
      )}

      {/* Detail dialog */}
      {detailItem && (
        <KudosDetailDialog
          item={detailItem}
          currentUserId={userId}
          onClose={() => setDetailItem(null)}
          onHashtagClick={() => {}}
          onCopySuccess={() => setToastMsg('Link đã được sao chép!')}
        />
      )}

      {/* Copy link toast */}
      {toastMsg && (
        <KudosToast message={toastMsg} onDismiss={() => setToastMsg(null)} />
      )}
    </section>
  )
}
