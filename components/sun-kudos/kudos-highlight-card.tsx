import { ArrowRight } from 'lucide-react'
import { KudosUserInfoBlock } from './kudos-user-info-block'
import { KudosHashtagTag } from './kudos-hashtag-tag'
import { KudosActionBar } from './kudos-action-bar'
import type { KudosFeedItem } from '@/lib/kudos/types'

interface KudosHighlightCardProps {
  item: KudosFeedItem
  currentUserId: string
  onHashtagClick: (hashtag: string) => void
  onCopySuccess: () => void
}

function formatDate(isoString: string): string {
  const d = new Date(isoString)
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const year = d.getFullYear()
  return `${hh}:${mm} - ${month}/${day}/${year}`
}

export function KudosHighlightCard({
  item,
  currentUserId,
  onHashtagClick,
  onCopySuccess,
}: KudosHighlightCardProps) {
  const isSender = item.sender.id === currentUserId
  const visibleHashtags = item.hashtags.slice(0, 5)

  return (
    <div
      className="flex flex-col gap-3 p-5 overflow-hidden"
      style={{
        width: '528px',
        height: '525px',
        background: '#F5F0E4',
        borderRadius: '16px',
        flexShrink: 0,
      }}
    >
      <div className="flex items-center gap-2">
        <div className="flex-1 min-w-0">
          <KudosUserInfoBlock user={item.sender} />
        </div>
        <ArrowRight size={18} aria-hidden="true" style={{ color: 'rgba(0,0,0,0.4)', flexShrink: 0 }} />
        <div className="flex-1 min-w-0 flex justify-end">
          <KudosUserInfoBlock user={item.receiver} />
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid rgba(0,0,0,0.1)', margin: '2px 0' }} />

      <p className="text-xs" style={{ color: 'rgba(0,0,0,0.45)', lineHeight: '18px' }}>
        {formatDate(item.created_at)}
      </p>

      {item.category_name && (
        <p
          className="font-bold uppercase tracking-wide text-xs"
          style={{ color: '#1A1A1A' }}
        >
          {item.category_name}
        </p>
      )}

      <p
        className="text-sm leading-relaxed line-clamp-3 flex-1"
        style={{ color: '#1A1A1A' }}
      >
        {item.content}
      </p>

      {visibleHashtags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 items-center">
          {visibleHashtags.map((tag) => (
            <KudosHashtagTag
              key={tag}
              name={tag}
              onHashtagClick={() => onHashtagClick(tag)}
            />
          ))}
          {item.hashtags.length > 5 && (
            <span className="text-xs" style={{ color: 'rgba(0,0,0,0.4)' }}>
              ...
            </span>
          )}
        </div>
      )}

      <KudosActionBar
        kudosId={item.id}
        likeCount={item.like_count}
        userLiked={item.user_liked}
        isSender={isSender}
        showViewDetails={true}
        onCopySuccess={onCopySuccess}
      />
    </div>
  )
}
