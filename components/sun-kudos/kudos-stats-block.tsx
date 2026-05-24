import type { KudosStats } from '@/lib/kudos/types'

interface KudosStatsBlockProps {
  stats: KudosStats
  onOpenSecretBox: () => void
}

function StatRow({ label, value, gold = false }: { label: string; value: number; gold?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
        {label}
      </span>
      <span className="text-sm font-bold" style={{ color: gold ? '#F5C842' : '#F5C842' }}>
        {value}
      </span>
    </div>
  )
}

export function KudosStatsBlock({ stats, onOpenSecretBox }: KudosStatsBlockProps) {
  return (
    <div
      className="rounded-xl p-6 flex flex-col gap-3"
      style={{
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <StatRow label="Số Kudos bạn nhận được:" value={stats.received} />
      <StatRow label="Số Kudos bạn đã gửi:" value={stats.sent} />

      <div className="flex items-center justify-between gap-2">
        <span className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
          Số tim bạn nhận được:
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-bold" style={{ color: '#F5C842' }}>
            {stats.hearts}
          </span>
          <span
            className="text-xs font-bold px-1.5 py-0.5 rounded"
            style={{ background: 'rgba(245,200,66,0.15)', color: '#F5C842' }}
          >
            ×2
          </span>
        </div>
      </div>

      <hr style={{ borderColor: 'rgba(255,255,255,0.08)' }} />

      <StatRow label="Số Secret Box bạn đã mở:" value={stats.opened_boxes} />
      <StatRow label="Số Secret Box chưa mở:" value={stats.unopened_boxes} />

      <button
        type="button"
        onClick={onOpenSecretBox}
        className="w-full mt-1 py-2.5 text-sm font-bold rounded-full transition-opacity hover:opacity-90"
        style={{ background: '#F5C842', color: '#1A1A1A' }}
      >
        Mở quà
      </button>
    </div>
  )
}
