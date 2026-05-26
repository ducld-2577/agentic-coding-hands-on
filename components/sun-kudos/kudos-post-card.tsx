'use client'

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

export interface KudosPostCardProps {
  item: KudosFeedItem
  currentUserId: string
  onHashtagClick: (hashtag: string) => void
  onCopySuccess: () => void
  onOpenDetail: () => void
}

export function KudosPostCard({ item, currentUserId, onHashtagClick, onCopySuccess, onOpenDetail }: KudosPostCardProps) {
  // When anonymous, show nickname instead of real sender info and disable hover card
  const displaySender = item.is_anonymous
    ? {
        ...item.sender,
        full_name:   item.anonymous_nickname ?? 'Ẩn danh',
        avatar_url:  null,
        badge_title: null,
      }
    : item.sender

  return (
    <div
      className="flex flex-col gap-3 w-full"
      style={{ background: '#F5F0E4', borderRadius: 16, padding: 24 }}
    >
      <div className="flex items-center gap-3">
        <KudosUserInfoBlock user={displaySender} size={48} disableHover={item.is_anonymous} />
        <ArrowRight size={18} style={{ color: 'rgba(0,0,0,0.35)', flexShrink: 0 }} />
        <KudosUserInfoBlock user={item.receiver} size={48} />
      </div>

      <span className="text-xs" style={{ color: 'rgba(0,0,0,0.45)' }}>
        {formatTime(item.created_at)}
      </span>

      {item.category_name && (
        <span className="text-xs font-bold uppercase tracking-wide" style={{ color: '#1A1A1A' }}>
          {item.category_name}
        </span>
      )}

      <button
        type="button"
        onClick={onOpenDetail}
        className="text-sm leading-relaxed line-clamp-5 text-left w-full bg-transparent border-none p-0 cursor-pointer hover:opacity-75 transition-opacity"
        style={{ color: '#1A1A1A' }}
      >
        {item.content}
      </button>

      {item.image_urls.length > 0 && (
        <KudosImageGallery urls={item.image_urls} />
      )}

      {item.hashtags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {item.hashtags.slice(0, 5).map((tag) => (
            <KudosHashtagTag key={tag} name={tag} onHashtagClick={() => onHashtagClick(tag)} />
          ))}
        </div>
      )}

      <KudosActionBar
        kudosId={item.id}
        likeCount={item.like_count}
        userLiked={item.user_liked}
        isSender={item.sender.id === currentUserId}
        showViewDetails={false}
        onCopySuccess={onCopySuccess}
      />
    </div>
  )
}
