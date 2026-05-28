'use client'

import { useLocale } from '@/lib/i18n/use-locale'
import { homeTranslations } from '@/lib/i18n/home-translations'

export function HomeEventInfo() {
  const locale = useLocale()
  const t = homeTranslations[locale].eventInfo

  return (
    <div className="flex flex-col" style={{ gap: '8px' }}>
      {/* Date and venue on the same row, separated by gap */}
      <div className="flex flex-wrap items-center" style={{ gap: '60px' }}>
        <EventRow label={t.dateLabel} value={t.date} />
        <EventRow label={t.venueLabel} value={t.venue} />
      </div>
      {/* Livestream note */}
      <p
        className="font-montserrat font-bold text-white"
        style={{ fontSize: '16px', lineHeight: '24px', letterSpacing: '0.5px' }}
      >
        {t.livestream}
      </p>
    </div>
  )
}

function EventRow({ label, value }: { label: string; value: string }) {
  return (
    <span className="flex items-baseline gap-2">
      <span
        className="font-montserrat font-bold text-white"
        style={{ fontSize: '16px', lineHeight: '24px', letterSpacing: '0.15px' }}
      >
        {label}
      </span>
      <span
        className="font-montserrat font-bold"
        style={{ fontSize: '24px', lineHeight: '32px', color: '#FFEA9E' }}
      >
        {value}
      </span>
    </span>
  )
}
