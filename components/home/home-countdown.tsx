'use client'

import { useEffect, useState } from 'react'
import { calculateCountdown, type CountdownResult } from '@/lib/utils/countdown'
import { EVENT_DATETIME } from '@/lib/config/event.config'
import { CountdownUnit } from '@/components/countdown/countdown-unit'
import { useLocale } from '@/lib/i18n/use-locale'
import { homeTranslations } from '@/lib/i18n/home-translations'

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

export function HomeCountdown() {
  // null until first client-side tick — avoids SSR/hydration mismatch.
  const [countdown, setCountdown] = useState<CountdownResult | null>(null)
  const locale = useLocale()
  const t = homeTranslations[locale].countdown

  useEffect(() => {
    if (!EVENT_DATETIME) return
    setCountdown(calculateCountdown(EVENT_DATETIME))
    // Minutes-only granularity is intentional — matches the Figma design spec.
    const id = setInterval(() => setCountdown(calculateCountdown(EVENT_DATETIME)), 60_000)
    return () => clearInterval(id)
  }, [])

  if (!EVENT_DATETIME || countdown === null) return null

  return (
    <div className="flex flex-col items-start" style={{ gap: '16px' }}>
      {!countdown.expired && (
        <p
          className="font-montserrat font-bold text-white"
          style={{ fontSize: '24px', lineHeight: '32px' }}
        >
          {t.comingSoon}
        </p>
      )}
      <div className="flex items-end" style={{ gap: '40px' }}>
        <CountdownUnit value={pad(countdown.days)} label={t.days} />
        <CountdownUnit value={pad(countdown.hours)} label={t.hours} />
        <CountdownUnit value={pad(countdown.minutes)} label={t.minutes} />
      </div>
    </div>
  )
}
