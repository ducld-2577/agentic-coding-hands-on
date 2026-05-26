'use client'

import Image from 'next/image'
import Link from 'next/link'
import { PenLine } from 'lucide-react'
import { KudosBadge } from './kudos-badge'
import type { ProfileSummary } from '@/lib/kudos/types'

interface KudosUserInfoBlockProps {
  user: ProfileSummary
  size?: number
  disableHover?: boolean
}

function AvatarFallback({ name, size }: { name: string; size: number }) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')

  return (
    <span
      className="flex items-center justify-center rounded-full font-semibold text-white select-none"
      style={{
        width: size,
        height: size,
        background: '#1E3A4A',
        fontSize: Math.max(10, Math.round(size * 0.35)),
        flexShrink: 0,
      }}
      aria-hidden="true"
    >
      {initials}
    </span>
  )
}

export function KudosUserInfoBlock({ user, size = 40, disableHover = false }: KudosUserInfoBlockProps) {
  function handleSendKudo(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    window.dispatchEvent(
      new CustomEvent('kudos:open-submit', {
        detail: { id: user.id, full_name: user.full_name, avatar_url: user.avatar_url },
      })
    )
  }

  return (
    <div className="flex items-center gap-2 min-w-0">
      {/* Avatar — CSS group-hover keeps card visible when mouse moves onto it */}
      <div className="group relative flex-shrink-0" style={{ width: size, height: size }}>
        <span
          className="block rounded-full overflow-hidden transition-all group-hover:ring-2 group-hover:ring-[#F5C842]"
          style={{ width: size, height: size }}
        >
          {user.avatar_url ? (
            <Image
              src={user.avatar_url}
              alt={user.full_name}
              width={size}
              height={size}
              className="object-cover rounded-full"
            />
          ) : (
            <AvatarFallback name={user.full_name} size={size} />
          )}
        </span>

        {/* Hover card — bottom-full = above avatar, no gap so hover stays active */}
        <div
          className={`absolute bottom-full left-1/2 -translate-x-1/2 flex-col gap-3 rounded-2xl z-50 ${disableHover ? 'hidden' : 'hidden group-hover:flex'}`}
          style={{
            background: '#1B1230',
            border: '1px solid rgba(255,255,255,0.1)',
            minWidth: 240,
            padding: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          }}
        >
          {/* Name + department */}
          <div className="flex flex-col gap-0.5">
            <span className="font-bold leading-tight" style={{ color: '#F5C842', fontSize: 15 }}>
              {user.full_name}
            </span>
            {user.department_name && (
              <span className="text-xs leading-snug" style={{ color: 'rgba(255,255,255,0.55)' }}>
                {user.department_name}
              </span>
            )}
          </div>

          {/* Badge */}
          {user.badge_title && (
            <div><KudosBadge badge={user.badge_title} /></div>
          )}

          {/* Divider */}
          <div style={{ height: 1, background: 'rgba(255,255,255,0.1)' }} />

          {/* Kudos stats */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
              <span>Số Kudos nhận được:</span>
              <span className="font-bold" style={{ color: '#F5C842' }}>{user.kudos_received_count}</span>
            </div>
            <div className="flex items-center justify-between text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
              <span>Số Kudos đã gửi:</span>
              <span className="font-bold" style={{ color: '#F5C842' }}>{user.kudos_sent_count}</span>
            </div>
          </div>

          {/* Send button */}
          <button
            onClick={handleSendKudo}
            className="flex items-center justify-center gap-2 w-full rounded-full font-semibold text-sm transition-opacity hover:opacity-90 active:opacity-75"
            style={{ background: '#F5C842', color: '#1A1A1A', height: 40, border: 'none', cursor: 'pointer' }}
          >
            <PenLine size={15} />
            Gửi KUDO
          </button>
        </div>
      </div>

      {/* Name + badge inline */}
      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <Link
            href={`/profile/${user.id}`}
            className="font-semibold text-sm leading-tight hover:underline decoration-[#F5C842] underline-offset-2 truncate"
            style={{ color: '#1A1A1A' }}
          >
            {user.full_name}
          </Link>
          {user.badge_title && (
            <KudosBadge badge={user.badge_title} />
          )}
        </div>
        {user.department_name && (
          <span
            className="text-xs truncate"
            style={{ color: 'rgba(0,0,0,0.5)', lineHeight: '16px' }}
          >
            {user.department_name}
          </span>
        )}
      </div>
    </div>
  )
}
