'use client'

import { useEffect, useState } from 'react'
import { calculateCountdown, type CountdownResult } from '@/lib/utils/countdown'
import { EVENT_DATETIME } from '@/lib/config/event.config'
import { CountdownUnit } from '@/components/countdown/countdown-unit'
import { useLocale } from '@/lib/i18n/use-locale'
import { countdownTranslations } from '@/lib/i18n/countdown-translations'

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

// Thin vertical separator between countdown groups — matches Figma design.
function Separator() {
  return (
    <div
      className="self-stretch"
      style={{ width: '1px', background: 'rgba(255,255,255,0.3)', margin: '0 4px' }}
    />
  )
}

export function CountdownPrelaunch() {
  // null until first client-side tick — avoids SSR/hydration mismatch.
  const [countdown, setCountdown] = useState<CountdownResult | null>(null)
  const locale = useLocale()
  const t = countdownTranslations[locale]

  useEffect(() => {
    if (!EVENT_DATETIME) return
    setCountdown(calculateCountdown(EVENT_DATETIME))
    // Minutes-only granularity is intentional — matches the Figma design spec.
    const id = setInterval(() => setCountdown(calculateCountdown(EVENT_DATETIME)), 60_000)
    return () => clearInterval(id)
  }, [])

  // Show zeros as placeholder until the client-side countdown is ready.
  const display = countdown ?? { days: 0, hours: 0, minutes: 0, expired: false }

  return (
    <main
      aria-label="Countdown to event"
      className="relative min-h-screen w-full overflow-hidden flex items-center justify-center"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(/countdown/bg.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      {/* Dark overlay for text contrast */}
      <div
        className="absolute inset-0 z-0"
        style={{ background: 'rgba(0, 10, 20, 0.55)' }}
      />

      {/* Countdown content */}
      <div className="relative z-10 flex flex-col items-center" style={{ gap: '32px' }}>
        {/* Title */}
        <p
          className="font-montserrat font-semibold text-white text-center"
          style={{ fontSize: '20px', lineHeight: '32px', letterSpacing: '0.5px' }}
        >
          {t.eventTitle}
        </p>

        {/* Countdown row */}
        <div className="flex items-stretch" style={{ gap: '24px' }}>
          <CountdownUnit value={pad(display.days)} label={t.days} />
          <Separator />
          <CountdownUnit value={pad(display.hours)} label={t.hours} />
          <Separator />
          <CountdownUnit value={pad(display.minutes)} label={t.minutes} />
        </div>
      </div>
    </main>
  )
}
