'use client'

import { AWARD_DETAILS } from '@/lib/data/award-categories'
import { useAwardsNavScroll } from '@/hooks/use-awards-nav-scroll'
import { AwardsNavMenu } from './awards-nav-menu'
import { AwardsAwardBlock } from './awards-award-block'

const SLUGS = AWARD_DETAILS.map((a) => a.slug)

/**
 * Section B — Two-column layout: sticky left nav + scrollable award list.
 * Left column (~240px wide): AwardsNavMenu, sticky top-24.
 * Right column: list of 6 AwardsAwardBlock components with 80px gaps.
 *
 * Extracted from Figma node 313:8458 (B_Hệ thống giải thưởng).
 * Uses useAwardsNavScroll hook for scroll-spy + smooth-scroll behaviour.
 */
export function AwardsSystemSection() {
  const { activeSlug, scrollTo } = useAwardsNavScroll(SLUGS)

  return (
    <section
      aria-label="Award system"
      className={[
        'w-full',
        'px-4 sm:px-8 md:px-[72px] lg:px-[144px]',
        'pt-20 pb-20',
      ].join(' ')}
    >
      <div className="flex flex-col md:flex-row gap-20 items-start">
        {/* Left — sticky nav, ~240px wide */}
        <aside
          className="hidden md:block flex-shrink-0 sticky top-24 self-start"
          style={{ width: 240 }}
          aria-label="Award categories"
        >
          <AwardsNavMenu activeSlug={activeSlug} onSelect={scrollTo} />
        </aside>

        {/* Right — award blocks list, flex-1 */}
        <div className="flex-1 flex flex-col gap-20 min-w-0">
          {AWARD_DETAILS.map((award, index) => (
            <div key={award.slug}>
              <AwardsAwardBlock award={award} imageRight={index % 2 !== 0} />
              {/* Separator between cards — not after last */}
              {index < AWARD_DETAILS.length - 1 && (
                <div className="w-full h-px bg-[#2E3940] mt-20" aria-hidden="true" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
