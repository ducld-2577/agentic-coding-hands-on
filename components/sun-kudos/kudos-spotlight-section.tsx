import type { SpotlightNode } from '@/lib/kudos/types'
import { KudosSpotlightBoard } from './kudos-spotlight-board'

interface KudosSpotlightSectionProps {
  nodes: SpotlightNode[]
  totalKudosCount: number
}

export function KudosSpotlightSection({ nodes, totalKudosCount }: KudosSpotlightSectionProps) {
  return (
    <section aria-label="Spotlight Board" className="w-full">
      <div className="px-4 sm:px-8 md:px-[72px] lg:px-[144px] pt-16 pb-8">
        <p
          className="font-montserrat font-bold uppercase tracking-widest text-center"
          style={{ fontSize: '14px', lineHeight: '20px', color: 'rgba(255,255,255,0.5)' }}
        >
          Sun* Annual Awards 2025
        </p>

        <div className="w-full h-px my-4" style={{ backgroundColor: 'rgba(255,255,255,0.12)' }} aria-hidden="true" />

        <h2
          className="font-montserrat font-bold text-white text-center"
          style={{ fontSize: '64px', lineHeight: '1.1', letterSpacing: '-0.5px' }}
        >
          SPOTLIGHT BOARD
        </h2>
      </div>

      <div className="w-full" style={{ backgroundColor: '#051825' }}>
        <KudosSpotlightBoard nodes={nodes} totalKudosCount={totalKudosCount} />
      </div>
    </section>
  )
}
