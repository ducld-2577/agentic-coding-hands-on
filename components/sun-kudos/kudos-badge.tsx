'use client'

import { useState } from 'react'
import type { BadgeTitle, StarLevel } from '@/lib/kudos/types'

interface KudosBadgeProps {
  badge: BadgeTitle
  starLevel: StarLevel
}

const BADGE_CONFIG: Record<
  BadgeTitle,
  { gradient: string; description: string }
> = {
  'New Hero': {
    gradient: 'linear-gradient(135deg, #00B4D8, #0077B6)',
    description: 'Nhận được từ 10 Kudos trở lên',
  },
  'Rising Hero': {
    gradient: 'linear-gradient(135deg, #7B2FBE, #3A86FF)',
    description: 'Nhận được từ 20 Kudos trở lên',
  },
  'Legend Hero': {
    gradient: 'linear-gradient(135deg, #F5C842, #E88E1F)',
    description: 'Nhận được từ 50 Kudos trở lên',
  },
}

export function KudosBadge({ badge, starLevel }: KudosBadgeProps) {
  const [hovered, setHovered] = useState(false)
  const config = BADGE_CONFIG[badge]

  return (
    <span className="relative inline-flex items-center">
      <span
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-white font-semibold cursor-default select-none"
        style={{
          background: config.gradient,
          fontSize: '11px',
          lineHeight: '16px',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <span>{badge}</span>
        {starLevel > 0 && (
          <span style={{ fontSize: '10px', letterSpacing: '0.5px' }}>
            {'★'.repeat(starLevel)}
          </span>
        )}
      </span>

      {hovered && (
        <span
          className="absolute bottom-full left-1/2 z-50 mb-1 whitespace-nowrap rounded-full px-3 py-1 text-white pointer-events-none"
          style={{
            transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.85)',
            fontSize: '11px',
            lineHeight: '16px',
          }}
          role="tooltip"
        >
          {config.description}
        </span>
      )}
    </span>
  )
}
