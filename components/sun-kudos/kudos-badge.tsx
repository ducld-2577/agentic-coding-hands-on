'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { BadgeTitle } from '@/lib/kudos/types'

interface KudosBadgeProps {
  badge: BadgeTitle
}

const BADGE_CONFIG: Record<BadgeTitle, { image: string; title: string; description: string }> = {
  'New Hero': {
    image: '/kudos/new_hero.png',
    title: 'New Hero',
    description: 'Có 1–4 người gửi Kudos cho bạn\nHành trình lan tỏa điều tốt đẹp bắt đầu – những lời cảm ơn và ghi nhận đầu tiên đã tìm đến bạn.',
  },
  'Rising Hero': {
    image: '/kudos/rising_hero.png',
    title: 'Rising Hero',
    description: 'Có 5–9 người gửi Kudos cho bạn\nHình ảnh bạn đang lớn dần trong trái tim đồng đội bằng sự tử tế và cống hiến của mình.',
  },
  'Super Hero': {
    image: '/kudos/super_hero.png',
    title: 'Super Hero',
    description: 'Có 10–20 người gửi Kudos cho bạn\nBạn đã trở thành biểu tượng được tin tưởng và yêu quý, người luôn sẵn sàng hỗ trợ và được nhiều đồng đội nhớ đến.',
  },
  'Legend Hero': {
    image: '/kudos/legend_hero.png',
    title: 'Legend Hero',
    description: 'Có hơn 20 người gửi Kudos cho bạn\nBạn đã trở thành huyền thoại – người để lại dấu ấn khó quên trong tập thể bằng trái tim và hành động của mình.',
  },
}

export function KudosBadge({ badge }: KudosBadgeProps) {
  const [hovered, setHovered] = useState(false)
  const config = BADGE_CONFIG[badge]
  const [titleLine, descLine] = config.description.split('\n')

  return (
    <span className="relative inline-flex items-center">
      <span
        className="inline-flex items-center cursor-default select-none"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Image
          src={config.image}
          alt={config.title}
          width={90}
          height={28}
        />
      </span>

      {hovered && (
        <span
          className="absolute bottom-full left-1/2 z-50 mb-2 pointer-events-none flex flex-col gap-1 rounded-xl p-3"
          style={{
            transform: 'translateX(-50%)',
            background: '#1B1230',
            border: '1px solid rgba(255,255,255,0.1)',
            minWidth: 220,
            maxWidth: 260,
          }}
          role="tooltip"
        >
          <Image
            src={config.image}
            alt={config.title}
            width={120}
            height={36}
            className="mx-auto"
          />
          <span
            className="font-semibold text-white text-xs leading-tight mt-1"
            style={{ fontSize: 12 }}
          >
            {titleLine}
          </span>
          <span
            className="text-xs leading-snug"
            style={{ color: 'rgba(255,255,255,0.65)', fontSize: 11 }}
          >
            {descLine}
          </span>
        </span>
      )}
    </span>
  )
}
