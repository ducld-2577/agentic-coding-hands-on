'use client'

import { PenLine } from 'lucide-react'
import { useLocale } from '@/lib/i18n/use-locale'
import { kudosTranslations } from '@/lib/i18n/kudos-translations'

interface KudosSubmitInputProps {
  onOpen: () => void
}

export function KudosSubmitInput({ onOpen }: KudosSubmitInputProps) {
  const locale = useLocale()
  const t = kudosTranslations[locale]

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={t.submitAriaLabel}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onOpen()
      }}
      className="flex items-center gap-3 cursor-pointer select-none w-full"
      style={{
        height: '72px',
        borderRadius: '9999px',
        background: 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.12)',
        paddingLeft: '28px',
        paddingRight: '28px',
      }}
    >
      <PenLine
        size={20}
        aria-hidden="true"
        style={{ color: 'rgba(255,255,255,0.5)', flexShrink: 0 }}
      />
      <span
        className="font-montserrat"
        style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', lineHeight: '24px' }}
      >
        {t.submitPlaceholder}
      </span>
    </div>
  )
}
