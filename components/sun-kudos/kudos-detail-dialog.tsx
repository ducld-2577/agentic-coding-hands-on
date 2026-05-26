'use client'

import { useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import { KudosUserInfoBlock } from './kudos-user-info-block'
import { KudosImageGallery } from './kudos-image-gallery'
import { KudosHashtagTag } from './kudos-hashtag-tag'
import { KudosActionBar } from './kudos-action-bar'
import type { KudosFeedItem } from '@/lib/kudos/types'

function formatTime(iso: string) {
  const d = new Date(iso)
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const yyyy = d.getFullYear()
  return `${hh}:${mm} - ${month}/${day}/${yyyy}`
}

interface KudosDetailDialogProps {
  item: KudosFeedItem
  currentUserId: string
  onClose: () => void
  onHashtagClick: (hashtag: string) => void
  onCopySuccess: () => void
}

export function KudosDetailDialog({
  item,
  currentUserId,
  onClose,
  onHashtagClick,
  onCopySuccess,
}: KudosDetailDialogProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const displaySender = item.is_anonymous
    ? { ...item.sender, full_name: item.anonymous_nickname ?? 'Ẩn danh', avatar_url: null, badge_title: null }
    : item.sender

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-8 px-4"
      style={{ background: 'rgba(0,0,0,0.65)' }}
      onClick={onClose}
    >
      <div className="w-full max-w-xl flex flex-col gap-2">
        {/* Dialog header label */}
        <span className="text-sm font-medium px-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
          View Kudo
        </span>

        {/* Card */}
        <div
          className="flex flex-col gap-3 w-full"
          style={{ background: '#F5F0E4', borderRadius: 16, padding: 24 }}
          onClick={e => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label="Chi tiết Kudos"
        >
          {/* Sender → Receiver */}
          <div className="flex items-center gap-3">
            <KudosUserInfoBlock user={displaySender} size={48} disableHover={item.is_anonymous} />
            <ArrowRight size={18} style={{ color: 'rgba(0,0,0,0.35)', flexShrink: 0 }} />
            <KudosUserInfoBlock user={item.receiver} size={48} />
          </div>

          {/* Time */}
          <span className="text-xs" style={{ color: 'rgba(0,0,0,0.45)' }}>
            {formatTime(item.created_at)}
          </span>

          {/* Category */}
          {item.category_name && (
            <span className="text-xs font-bold uppercase tracking-wide text-center" style={{ color: '#1A1A1A' }}>
              {item.category_name}
            </span>
          )}

          {/* Full content — no line-clamp */}
          <p className="text-sm leading-relaxed" style={{ color: '#1A1A1A' }}>
            {item.content}
          </p>

          {/* Images */}
          {item.image_urls.length > 0 && (
            <KudosImageGallery urls={item.image_urls} />
          )}

          {/* Hashtags */}
          {item.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {item.hashtags.map((tag) => (
                <KudosHashtagTag
                  key={tag}
                  name={tag}
                  onHashtagClick={() => { onHashtagClick(tag); onClose() }}
                />
              ))}
            </div>
          )}

          {/* Action bar + close button */}
          <div className="flex items-center justify-between gap-2 mt-1">
            <KudosActionBar
              kudosId={item.id}
              likeCount={item.like_count}
              userLiked={item.user_liked}
              isSender={item.sender.id === currentUserId}
              onCopySuccess={onCopySuccess}
            />
            <button
              type="button"
              onClick={onClose}
              className="text-sm font-medium px-4 py-1.5 rounded-full transition-colors hover:bg-black/10"
              style={{ color: 'rgba(0,0,0,0.6)' }}
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
