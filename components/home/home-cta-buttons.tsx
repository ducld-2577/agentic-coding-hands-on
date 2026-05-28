'use client'

import Link from 'next/link'
import { useLocale } from '@/lib/i18n/use-locale'
import { homeTranslations } from '@/lib/i18n/home-translations'

function ArrowUpRightIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M7 17L17 7M17 7H7M17 7V17"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function HomeCtaButtons() {
  const locale = useLocale()
  const t = homeTranslations[locale].cta

  return (
    <div className="flex flex-wrap gap-3 sm:gap-4">
      {/* B3.1 — ABOUT AWARDS: cream-yellow fill, hover → outline */}
      <Link
        href="/awards-information"
        className={[
          'inline-flex items-center gap-2 justify-center',
          'px-6 py-3 rounded',
          'font-montserrat font-bold text-sm sm:text-base',
          'tracking-[0.1em] uppercase whitespace-nowrap',
          'bg-[#FFEA9E] text-[#00101A]',
          'border-2 border-[#FFEA9E]',
          'transition-colors duration-200',
          'hover:bg-transparent hover:text-[#FFEA9E]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFEA9E]',
        ].join(' ')}
      >
        {t.aboutAwards}
        <ArrowUpRightIcon />
      </Link>

      {/* B3.2 — ABOUT KUDOS: cream-yellow outline, hover → filled */}
      <Link
        href="/sun-kudos"
        className={[
          'inline-flex items-center gap-2 justify-center',
          'px-6 py-3 rounded',
          'font-montserrat font-bold text-sm sm:text-base',
          'tracking-[0.1em] uppercase whitespace-nowrap',
          'bg-transparent text-[#FFEA9E]',
          'border-2 border-[#FFEA9E]',
          'transition-colors duration-200',
          'hover:bg-[#FFEA9E] hover:text-[#00101A]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFEA9E]',
        ].join(' ')}
      >
        {t.aboutKudos}
        <ArrowUpRightIcon />
      </Link>
    </div>
  )
}
