'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Heart, Link2 } from 'lucide-react'
import { likeKudos, unlikeKudos } from '@/lib/kudos/actions'

interface KudosActionBarProps {
  kudosId: string
  likeCount: number
  userLiked: boolean
  isSender: boolean
  showViewDetails?: boolean
  onCopySuccess: () => void
}

export function KudosActionBar({
  kudosId,
  likeCount,
  userLiked,
  isSender,
  showViewDetails = false,
  onCopySuccess,
}: KudosActionBarProps) {
  const [likeState, setLikeState] = useState({ liked: userLiked, count: likeCount })
  const [pending, setPending] = useState(false)

  async function handleLikeToggle() {
    if (isSender || pending) return

    const prev = { ...likeState }
    const next = { liked: !likeState.liked, count: likeState.liked ? likeState.count - 1 : likeState.count + 1 }
    setLikeState(next)
    setPending(true)

    try {
      const result = likeState.liked
        ? await unlikeKudos(kudosId)
        : await likeKudos(kudosId)

      if (!result.success) {
        setLikeState(prev)
      }
    } catch {
      setLikeState(prev)
    } finally {
      setPending(false)
    }
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(window.location.origin + '/sun-kudos/' + kudosId)
      onCopySuccess()
    } catch {
      // clipboard unavailable — silently skip
    }
  }

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={handleLikeToggle}
        disabled={isSender || pending}
        aria-label={likeState.liked ? 'Unlike kudos' : 'Like kudos'}
        className="flex items-center gap-1.5 bg-transparent border-none p-0 cursor-pointer font-medium text-sm transition-opacity"
        style={{
          color: likeState.liked ? '#E84A4A' : 'rgba(0,0,0,0.5)',
          opacity: isSender ? 0.4 : 1,
        }}
      >
        <Heart
          size={16}
          aria-hidden="true"
          fill={likeState.liked ? '#E84A4A' : 'none'}
          stroke={likeState.liked ? '#E84A4A' : 'currentColor'}
        />
        <span>{likeState.count}</span>
      </button>

      <button
        type="button"
        onClick={handleCopyLink}
        className="flex items-center gap-1.5 bg-transparent border-none p-0 cursor-pointer font-medium text-sm hover:underline underline-offset-2"
        style={{ color: 'rgba(0,0,0,0.5)' }}
      >
        <Link2 size={16} aria-hidden="true" />
        <span>Copy Link</span>
      </button>

      {showViewDetails && (
        <Link
          href={`/sun-kudos/${kudosId}`}
          className="font-medium text-sm hover:underline underline-offset-2 ml-auto"
          style={{ color: 'rgba(0,0,0,0.7)' }}
        >
          Xem chi tiết →
        </Link>
      )}
    </div>
  )
}
