'use client'

import { useEffect, useState } from 'react'
import { calculateCountdown, type CountdownResult } from '@/lib/utils/countdown'

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

// Frosted-glass digit box: matches Figma design (51×82px, gradient + gold border + blur)
function DigitBox({ digit }: { digit: string }) {
  return (
    <div
      className="flex items-center justify-center rounded-lg shrink-0"
      style={{
        width: '51px',
        height: '82px',
        background:
          'linear-gradient(180deg, rgba(255,255,255,0.50) 0%, rgba(255,255,255,0.05) 100%)',
        border: '0.5px solid #FFEA9E',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      <span
        className="font-mono font-bold text-white select-none leading-none"
        style={{ fontSize: '49px' }}
      >
        {digit}
      </span>
    </div>
  )
}

// One countdown unit: two digit boxes + label below
function CountdownUnit({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-start" style={{ gap: '14px' }}>
      <div className="flex items-center" style={{ gap: '14px' }}>
        <DigitBox digit={value[0]} />
        <DigitBox digit={value[1]} />
      </div>
      <span
        className="font-montserrat font-bold text-white"
        style={{ fontSize: '24px', lineHeight: '32px' }}
      >
        {label}
      </span>
    </div>
  )
}

export function HomeCountdown() {
  const targetIso = process.env.NEXT_PUBLIC_EVENT_DATETIME ?? ''

  const [countdown, setCountdown] = useState<CountdownResult>(() =>
    calculateCountdown(targetIso)
  )

  useEffect(() => {
    if (!targetIso) return
    const tick = () => setCountdown(calculateCountdown(targetIso))
    const id = setInterval(tick, 60_000)
    return () => clearInterval(id)
  }, [targetIso])

  if (!targetIso) return null

  return (
    <div className="flex flex-col items-start" style={{ gap: '16px' }}>
      {!countdown.expired && (
        <p
          className="font-montserrat font-bold text-white"
          style={{ fontSize: '24px', lineHeight: '32px' }}
        >
          Comming soon
        </p>
      )}
      <div className="flex items-end" style={{ gap: '40px' }}>
        <CountdownUnit value={pad(countdown.days)} label="DAYS" />
        <CountdownUnit value={pad(countdown.hours)} label="HOURS" />
        <CountdownUnit value={pad(countdown.minutes)} label="MINUTES" />
      </div>
    </div>
  )
}
