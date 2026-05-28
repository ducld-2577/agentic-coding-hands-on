'use client'

import { useState, useRef, useEffect } from 'react'
import type { Locale } from '@/lib/i18n/login-translations'

const LOCALE_COOKIE = 'locale'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1 year

const LOCALE_OPTIONS: { value: Locale; label: string; flag: string; flagSrc?: string }[] = [
  { value: 'VN', label: 'VN', flag: '🇻🇳', flagSrc: '/login/VN.svg' },
  { value: 'EN', label: 'EN', flag: '🇬🇧' },
]

function ChevronDownIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
    >
      <path d="M7 10L12 15L17 10H7Z" fill="white" />
    </svg>
  )
}

function getInitialLocale(): Locale {
  if (typeof document === 'undefined') return 'VN'
  const match = document.cookie.match(/(?:^|;\s*)locale=([^;]*)/)
  const val = match?.[1]
  if (val === 'VN' || val === 'EN') return val
  return 'VN'
}

interface LanguageSelectorProps {
  defaultLocale?: Locale
}

export function LanguageSelector({ defaultLocale = 'VN' }: LanguageSelectorProps) {
  const [locale, setLocale] = useState<Locale>(defaultLocale)
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setLocale(getInitialLocale())
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function selectLocale(value: Locale) {
    setLocale(value)
    document.cookie = `${LOCALE_COOKIE}=${value}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`
    window.dispatchEvent(new CustomEvent('locale-change', { detail: value }))
    setOpen(false)
  }

  const current = LOCALE_OPTIONS.find((o) => o.value === locale) ?? LOCALE_OPTIONS[0]

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={[
          'flex items-center justify-between gap-0.5',
          'w-[108px] h-[56px] px-4 rounded',
          'font-montserrat font-bold text-base leading-6 text-white',
          'hover:bg-white/10 transition-colors duration-150',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white',
        ].join(' ')}
      >
        <span className="flex items-center gap-1">
          {/* mm:I662:14391;186:1696;186:1821;186:1709 */}
          {/* mm:I662:14391;186:1696;186:1821;186:1441 */}
          {current.flagSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={current.flagSrc} width={24} height={24} alt="" aria-hidden="true" className="flex-shrink-0" />
          ) : (
            <span className="text-xl leading-none flex-shrink-0" aria-hidden="true">{current.flag}</span>
          )}
          <span className="text-white font-bold font-montserrat text-base leading-6 tracking-[0.15px]">
            {current.label}
          </span>
        </span>
        <ChevronDownIcon open={open} />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Select language"
          className={[
            'absolute right-0 top-full mt-1 z-50',
            'bg-[#0B0F12] border border-[#2E3940] rounded',
            'min-w-[108px] overflow-hidden',
            'shadow-lg',
          ].join(' ')}
        >
          {LOCALE_OPTIONS.map((option) => (
            <li
              key={option.value}
              role="option"
              aria-selected={locale === option.value}
              onClick={() => selectLocale(option.value)}
              className={[
                'flex items-center gap-2 px-4 py-3',
                'font-montserrat font-bold text-base text-white',
                'cursor-pointer transition-colors duration-150',
                locale === option.value
                  ? 'bg-white/20'
                  : 'hover:bg-white/10',
              ].join(' ')}
            >
              {option.flagSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={option.flagSrc} width={24} height={24} alt="" aria-hidden="true" className="flex-shrink-0" />
              ) : (
                <span className="text-lg leading-none">{option.flag}</span>
              )}
              <span>{option.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
