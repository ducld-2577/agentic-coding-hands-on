'use client'

import { useState } from 'react'
import { KudosSecretBoxDialog } from '@/components/sun-kudos/kudos-secret-box-dialog'
import type { KudosStats, SecretBox } from '@/lib/kudos/types'

interface ProfileStatsSectionProps {
  stats: KudosStats
  secretBoxes: SecretBox[]
}

function StatRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between gap-2 py-1">
      <span className="font-montserrat text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
        {label}
      </span>
      <span className="font-montserrat text-sm font-bold" style={{ color: '#F5C842' }}>
        {value}
      </span>
    </div>
  )
}

export function ProfileStatsSection({ stats, secretBoxes }: ProfileStatsSectionProps) {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <>
      <div
        className="rounded-xl p-6 flex flex-col gap-1"
        style={{
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <StatRow label="Số kudos bạn nhận được:" value={stats.received} />
        <StatRow label="Số kudos bạn đã gửi:" value={stats.sent} />
        <StatRow label="Số tim bạn nhận được:" value={stats.hearts} />

        <hr className="my-2" style={{ borderColor: 'rgba(255,255,255,0.08)' }} />

        <StatRow label="Secret Box bạn đã mở:" value={stats.opened_boxes} />
        <StatRow label="Secret Box chưa mở:" value={stats.unopened_boxes} />

        {stats.unopened_boxes > 0 && (
          <button
            type="button"
            onClick={() => setDialogOpen(true)}
            className="w-full mt-3 py-2.5 font-montserrat text-sm font-bold rounded-full transition-opacity hover:opacity-90"
            style={{ background: '#F5C842', color: '#1A1A1A' }}
          >
            Mở Secret Box 🎁
          </button>
        )}
      </div>

      <KudosSecretBoxDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        secretBoxes={secretBoxes}
      />
    </>
  )
}
