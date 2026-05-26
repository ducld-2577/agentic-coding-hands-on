import Image from 'next/image'
import Link from 'next/link'
import type { PrizeRecipient } from '@/lib/kudos/types'

interface KudosPrizeListProps {
  recipients: PrizeRecipient[]
}

function Initials({ name, size }: { name: string; size: number }) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
  return (
    <span
      className="flex items-center justify-center rounded-full font-semibold select-none flex-shrink-0"
      style={{
        width: size,
        height: size,
        background: '#1E3A4A',
        color: '#F5C842',
        fontSize: Math.max(10, Math.round(size * 0.35)),
        border: '2px solid white',
      }}
    >
      {initials}
    </span>
  )
}

export function KudosPrizeList({ recipients }: KudosPrizeListProps) {
  return (
    <div
      className="rounded-xl flex flex-col"
      style={{
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.08)',
        overflow: 'hidden',
      }}
    >
      <div
        className="px-5 py-3 text-center"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(245,200,66,0.06)' }}
      >
        <p
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: '#F5C842' }}
        >
          10 Sunner nhận quà mới nhất
        </p>
      </div>

      <div className="p-5">
        {recipients.length === 0 ? (
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Chưa có dữ liệu
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {recipients.slice(0, 10).map((r) => (
              <li key={r.id} className="flex items-center gap-3">
                <span className="relative flex-shrink-0" style={{ width: 40, height: 40 }}>
                  {r.avatar_url ? (
                    <Image
                      src={r.avatar_url}
                      alt={r.full_name}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                      style={{ border: '2px solid white' }}
                    />
                  ) : (
                    <Initials name={r.full_name} size={40} />
                  )}
                </span>
                <div className="flex flex-col min-w-0">
                  <Link
                    href={`/profile/${r.user_id}`}
                    className="text-sm font-bold truncate hover:underline underline-offset-2"
                    style={{ color: '#FFEA9E' }}
                  >
                    {r.full_name}
                  </Link>
                  <span className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    {r.prize_description}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
