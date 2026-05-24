'use client'

import Image from 'next/image'
import { AWARD_DETAILS } from '@/lib/data/award-categories'

interface AwardsNavMenuProps {
  /** Slug of the currently active nav item */
  activeSlug: string
  /** Callback fired when user clicks a nav item */
  onSelect: (slug: string) => void
}

/**
 * Section C — Left sticky navigation menu.
 * 6 items derived from AWARD_DETAILS. Each item has a 24×24 Target icon.
 * Active item: yellow-400 text + underline. Hover: highlighted.
 * Extracted from Figma node 313:8459 (C_Menu list).
 */
export function AwardsNavMenu({ activeSlug, onSelect }: AwardsNavMenuProps) {
  return (
    <nav
      aria-label="Award categories navigation"
      className="flex flex-col gap-4 w-full"
    >
      {AWARD_DETAILS.map((award) => {
        const isActive = award.slug === activeSlug
        return (
          <button
            key={award.slug}
            type="button"
            onClick={() => onSelect(award.slug)}
            className={[
              'flex items-center gap-1 text-left w-full',
              'px-4 py-4 rounded transition-colors duration-200',
              isActive
                ? 'text-yellow-400 border-b border-[#FFEA9E]'
                : 'text-white hover:text-yellow-300 hover:bg-white/5',
            ].join(' ')}
            aria-current={isActive ? 'location' : undefined}
          >
            {/* Target icon — 24×24px */}
            <span className="flex-shrink-0 w-6 h-6 relative" aria-hidden="true">
              <Image
                src="/awards-information/Target.svg"
                alt=""
                fill
                className="object-contain"
                unoptimized
              />
            </span>

            {/* Label */}
            <span
              className={[
                'font-montserrat font-bold text-sm leading-6',
                isActive ? 'underline underline-offset-4' : '',
              ].join(' ')}
            >
              {award.title}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
