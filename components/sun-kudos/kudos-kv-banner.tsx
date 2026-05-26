'use client'

import Image from 'next/image'
import { PenLine, Search } from 'lucide-react'

const inputBase: React.CSSProperties = {
  height: '72px',
  borderRadius: '68px',
  background: 'rgba(255, 234, 158, 0.10)',
  border: '1px solid #998C5F',
  padding: '0 16px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flexShrink: 1,
  minWidth: 0,
}

interface KudosKvBannerProps {
  onOpenKudos: () => void
}

export function KudosKvBanner({ onOpenKudos }: KudosKvBannerProps) {
  return (
    <section
      aria-label="Kudos key visual banner"
      className="relative w-full overflow-hidden"
      style={{ height: '480px', backgroundColor: '#00101A' }}
    >
      {/* Artwork on the right — auto-height to fill banner, anchored right */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/kudos/kudos-bg.png)',
          backgroundSize: 'auto 100%',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right center',
        }}
      />

      {/* Left-to-right gradient so text stays legible */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to right, #00101A 40%, rgba(0,16,26,0.75) 60%, transparent 85%)',
        }}
      />

      {/* Content — full height, space-between top content and bottom inputs */}
      <div className="relative z-10 h-full flex flex-col justify-between px-4 sm:px-8 md:px-[72px] lg:px-[144px] py-10">
        {/* Top: tagline + logo */}
        <div className="flex flex-col gap-4">
          <p
            className="font-montserrat font-bold"
            style={{ color: '#F5C842', fontSize: '28px', lineHeight: '36px' }}
          >
            Hệ thống ghi nhận và cảm ơn
          </p>
          <Image
            src="/kudos/kudos-logo.png"
            alt="Sun* Kudos logo"
            width={500}
            height={103}
            className="object-contain object-left"
            priority
          />
        </div>

        {/* Bottom: two pill inputs — left 738px : right 381px ratio at 1440px design */}
        <div className="flex" style={{ gap: '32px' }}>
          {/* Send kudos trigger — wider (738/1151 ≈ 64%) */}
          <div
            role="button"
            tabIndex={0}
            aria-label="Mở form gửi lời cảm ơn"
            onClick={onOpenKudos}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') onOpenKudos()
            }}
            className="cursor-pointer select-none"
            style={{ ...inputBase, flexGrow: 738 }}
          >
            <PenLine size={20} aria-hidden="true" style={{ color: 'rgba(255,255,255,0.5)', flexShrink: 0 }} />
            <span
              className="font-montserrat truncate"
              style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', lineHeight: '24px' }}
            >
              Hôm nay, bạn muốn gửi lời cảm ơn và ghi nhận đến ai?
            </span>
          </div>

          {/* Search Sunner profile — narrower (381/1151 ≈ 33%) */}
          <div
            style={{ ...inputBase, flexGrow: 381 }}
          >
            <Search size={20} aria-hidden="true" style={{ color: 'rgba(255,255,255,0.5)', flexShrink: 0 }} />
            <span
              className="font-montserrat truncate"
              style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', lineHeight: '24px' }}
            >
              Tìm kiếm profile Sunner
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
