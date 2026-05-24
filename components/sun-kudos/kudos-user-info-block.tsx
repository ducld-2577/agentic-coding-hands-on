import Image from 'next/image'
import Link from 'next/link'
import { KudosBadge } from './kudos-badge'
import type { ProfileSummary } from '@/lib/kudos/types'

interface KudosUserInfoBlockProps {
  user: ProfileSummary
  size?: number
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

export function KudosUserInfoBlock({ user, size = 40 }: KudosUserInfoBlockProps) {
  return (
    <div className="flex items-center gap-2 min-w-0">
      <span
        className="rounded-full overflow-hidden ring-offset-0 transition-all hover:ring-2 hover:ring-[#F5C842]"
        style={{ flexShrink: 0, width: size, height: size }}
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
            <KudosBadge badge={user.badge_title} starLevel={user.star_level} />
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
