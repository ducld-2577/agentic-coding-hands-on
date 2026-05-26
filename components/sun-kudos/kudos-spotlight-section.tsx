import type { SpotlightNode, KudosFeedItem } from '@/lib/kudos/types'
import { KudosSpotlightBoard } from './kudos-spotlight-board'

interface KudosSpotlightSectionProps {
  nodes: SpotlightNode[]
  totalKudosCount: number
  recentFeed?: KudosFeedItem[]
}

export function KudosSpotlightSection({ nodes, totalKudosCount, recentFeed }: KudosSpotlightSectionProps) {
  return (
    <section aria-label="Spotlight Board" className="w-full">
      <div className="px-4 sm:px-8 md:px-[72px] lg:px-[144px] pt-16 pb-8">
        <div className="flex flex-col gap-2 mb-6">
          <div className="flex items-center gap-3">
            <span
              className="text-xs font-medium tracking-wide"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              Sun* Annual Awards 2025
            </span>
            <hr
              className="flex-1"
              style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.12)' }}
            />
          </div>
          <h2
            className="font-black uppercase leading-none"
            style={{ color: '#F5C842', fontSize: '64px', letterSpacing: '-1px' }}
          >
            SPOTLIGHT BOARD
          </h2>
        </div>

        <KudosSpotlightBoard nodes={nodes} totalKudosCount={totalKudosCount} recentFeed={recentFeed} />
      </div>
    </section>
  )
}
