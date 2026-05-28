'use client'

import Image from 'next/image'
import type { KudosStats } from '@/lib/kudos/types'
import { useLocale } from '@/lib/i18n/use-locale'
import { kudosTranslations } from '@/lib/i18n/kudos-translations'

interface KudosStatsBlockProps {
  stats: KudosStats
  onOpenSecretBox: () => void
}

function StatRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
        {label}
      </span>
      <span className="text-sm font-bold" style={{ color: '#F5C842' }}>
        {value}
      </span>
    </div>
  )
}

export function KudosStatsBlock({ stats, onOpenSecretBox }: KudosStatsBlockProps) {
  const locale = useLocale()
  const t = kudosTranslations[locale]

  return (
    <div
      className="rounded-xl p-6 flex flex-col gap-3"
      style={{
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <StatRow label={t.statsKudosReceived} value={stats.received} />
      <StatRow label={t.statsKudosSent} value={stats.sent} />

      <div className="flex items-center justify-between gap-2">
        <span className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
          {t.statsHeartsReceived}
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-bold" style={{ color: '#F5C842' }}>
            {stats.hearts}
          </span>
          <Image src="/kudos/x2.png" alt="×2" width={32} height={20} className="object-contain" />
        </div>
      </div>

      <hr style={{ borderColor: 'rgba(255,255,255,0.08)' }} />

      <StatRow label={t.statsBoxesOpened} value={stats.opened_boxes} />
      <StatRow label={t.statsBoxesUnopened} value={stats.unopened_boxes} />

      <button
        type="button"
        onClick={onOpenSecretBox}
        className="w-full mt-1 py-2.5 text-sm font-bold rounded-full transition-opacity hover:opacity-90"
        style={{ background: '#F5C842', color: '#1A1A1A' }}
      >
        {t.openSecretBox}
      </button>
    </div>
  )
}
