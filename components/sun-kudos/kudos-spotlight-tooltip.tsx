import type { SpotlightNode } from '@/lib/kudos/types'

function relativeTime(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime()
  const hours = Math.floor(diff / 3_600_000)
  const days = Math.floor(diff / 86_400_000)
  const months = Math.floor(days / 30)
  if (months >= 1) return `${months} tháng trước`
  if (days >= 1) return `${days} ngày trước`
  return `${Math.max(1, hours)} giờ trước`
}

interface KudosSpotlightTooltipProps {
  node: SpotlightNode
  x: number
  y: number
}

export function KudosSpotlightTooltip({ node, x, y }: KudosSpotlightTooltipProps) {
  const timeLabel = node.last_received_at ? ` · lần cuối ${relativeTime(node.last_received_at)}` : ''
  return (
    <div
      className="absolute pointer-events-none rounded-lg px-3 py-2 text-white text-sm font-medium whitespace-nowrap z-50"
      style={{
        left: x,
        top: y,
        transform: 'translate(-50%, -110%)',
        background: 'rgba(0,0,0,0.85)',
      }}
    >
      {node.name} • nhận {node.kudos_count} Kudos{timeLabel}
    </div>
  )
}
