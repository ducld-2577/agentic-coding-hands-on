'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { KudosHighlightCard } from './kudos-highlight-card'
import type { KudosFeedItem } from '@/lib/kudos/types'

interface KudosHighlightCarouselProps {
  items: KudosFeedItem[]
  currentUserId: string
  onHashtagClick: (hashtag: string) => void
  onCopySuccess: () => void
}

export function KudosHighlightCarousel({
  items,
  currentUserId,
  onHashtagClick,
  onCopySuccess,
}: KudosHighlightCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (items.length === 0) {
    return (
      <div
        className="flex items-center justify-center"
        style={{ height: '525px' }}
      >
        <p className="text-base" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Hiện tại chưa có Kudos nào.
        </p>
      </div>
    )
  }

  const prevIndex = currentIndex - 1
  const nextIndex = currentIndex + 1
  const hasPrev = currentIndex > 0
  const hasNext = currentIndex < items.length - 1

  const slots = [
    { item: hasPrev ? items[prevIndex] : null, role: 'prev' },
    { item: items[currentIndex], role: 'active' },
    { item: hasNext ? items[nextIndex] : null, role: 'next' },
  ] as const

  return (
    <div className="flex flex-col items-center gap-4" style={{ width: '100%' }}>
      <div className="relative flex items-center justify-center w-full" style={{ height: '525px' }}>
        <div
          className="flex items-center justify-center gap-6"
          style={{ transition: 'all 0.3s ease' }}
        >
          {slots.map(({ item, role }) => {
            const isActive = role === 'active'
            return (
              <div
                key={role}
                style={{
                  transform: isActive ? 'scale(1)' : 'scale(0.9)',
                  opacity: isActive ? 1 : item ? 0.4 : 0,
                  pointerEvents: isActive ? 'auto' : 'none',
                  transition: 'all 0.3s ease',
                  visibility: item ? 'visible' : 'hidden',
                }}
              >
                {item && (
                  <KudosHighlightCard
                    item={item}
                    currentUserId={currentUserId}
                    onHashtagClick={onHashtagClick}
                    onCopySuccess={onCopySuccess}
                  />
                )}
                {!item && (
                  <div style={{ width: '528px', height: '525px', flexShrink: 0 }} />
                )}
              </div>
            )
          })}
        </div>

        <button
          type="button"
          aria-label="Previous kudos"
          disabled={!hasPrev}
          onClick={() => setCurrentIndex((i) => i - 1)}
          className="absolute left-0 z-10 flex items-center justify-center rounded-full border transition-opacity"
          style={{
            width: '56px',
            height: '56px',
            background: '#0D1F2D',
            borderColor: 'rgba(255,255,255,0.2)',
            color: 'white',
            opacity: hasPrev ? 1 : 0.3,
            pointerEvents: hasPrev ? 'auto' : 'none',
            cursor: hasPrev ? 'pointer' : 'default',
          }}
        >
          <ChevronLeft size={24} aria-hidden="true" />
        </button>

        <button
          type="button"
          aria-label="Next kudos"
          disabled={!hasNext}
          onClick={() => setCurrentIndex((i) => i + 1)}
          className="absolute right-0 z-10 flex items-center justify-center rounded-full border transition-opacity"
          style={{
            width: '56px',
            height: '56px',
            background: '#0D1F2D',
            borderColor: 'rgba(255,255,255,0.2)',
            color: 'white',
            opacity: hasNext ? 1 : 0.3,
            pointerEvents: hasNext ? 'auto' : 'none',
            cursor: hasNext ? 'pointer' : 'default',
          }}
        >
          <ChevronRight size={24} aria-hidden="true" />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-label="Previous"
          disabled={!hasPrev}
          onClick={() => setCurrentIndex((i) => i - 1)}
          className="flex items-center justify-center rounded-full transition-opacity"
          style={{
            width: '36px',
            height: '36px',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'white',
            opacity: hasPrev ? 1 : 0.3,
            cursor: hasPrev ? 'pointer' : 'default',
          }}
        >
          <ChevronLeft size={18} aria-hidden="true" />
        </button>

        <span className="text-sm font-semibold tabular-nums" style={{ color: 'rgba(255,255,255,0.7)', minWidth: '40px', textAlign: 'center' }}>
          {currentIndex + 1}/{items.length}
        </span>

        <button
          type="button"
          aria-label="Next"
          disabled={!hasNext}
          onClick={() => setCurrentIndex((i) => i + 1)}
          className="flex items-center justify-center rounded-full transition-opacity"
          style={{
            width: '36px',
            height: '36px',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'white',
            opacity: hasNext ? 1 : 0.3,
            cursor: hasNext ? 'pointer' : 'default',
          }}
        >
          <ChevronRight size={18} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
