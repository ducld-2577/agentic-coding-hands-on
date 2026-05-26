'use client'

import { KudosStatsBlock } from './kudos-stats-block'
import { KudosPrizeList } from './kudos-prize-list'
import type { KudosStats, PrizeRecipient } from '@/lib/kudos/types'

interface KudosSidebarProps {
  stats: KudosStats
  prizeRecipients: PrizeRecipient[]
  onOpenSecretBox: () => void
}

export function KudosSidebar({ stats, prizeRecipients, onOpenSecretBox }: KudosSidebarProps) {
  return (
    <aside className="sticky top-[88px] flex flex-col gap-4" style={{ width: 422 }}>
      <KudosStatsBlock stats={stats} onOpenSecretBox={onOpenSecretBox} />
      <KudosPrizeList recipients={prizeRecipients} />
    </aside>
  )
}
