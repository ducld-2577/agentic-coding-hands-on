'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLocale } from '@/lib/i18n/use-locale'
import { homeTranslations } from '@/lib/i18n/home-translations'

export function HomeFooter() {
  const pathname = usePathname()
  const locale = useLocale()
  const t = homeTranslations[locale]

  const NAV_ITEMS = [
    { label: 'About SAA 2025', href: '/home' },
    { label: 'Awards Information', href: '/awards-information' },
    { label: 'Sun* Kudos', href: '/sun-kudos' },
    { label: t.footer.generalStandards, href: '/tieu-chuan-chung' },
  ] as const

  return (
    <footer
      className={[
        'w-full',
        'bg-[#00101A]',
        'border-t border-[#2E3940]',
        'px-8 md:px-[72px]',
        'py-8',
      ].join(' ')}
    >
      <div
        className={[
          'flex flex-col gap-6',
          'md:flex-row md:items-center md:justify-between',
          'max-w-[1152px] mx-auto',
        ].join(' ')}
      >
        {/* Logo */}
        <Link
          href="/home"
          className="flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C518] rounded"
          aria-label={t.footer.logoAriaLabel}
        >
          <Image
            src="/login/Logo.png"
            alt="SAA 2025"
            width={69}
            height={64}
            className="object-contain"
          />
        </Link>

        {/* Nav links */}
        <nav aria-label="Footer navigation">
          <ul
            className={[
              'flex flex-col gap-3',
              'sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2',
            ].join(' ')}
          >
            {NAV_ITEMS.map(({ label, href }) => {
              const isActive = pathname === href
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={isActive ? 'page' : undefined}
                    className={[
                      'font-montserrat font-semibold text-sm',
                      'transition-colors duration-150',
                      isActive
                        ? 'text-yellow-400 underline underline-offset-4'
                        : 'text-white/70 hover:text-yellow-400',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C518] rounded',
                    ].join(' ')}
                  >
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Copyright */}
        <p
          className={[
            'font-montserrat-alternates font-bold text-sm md:text-base leading-6',
            'text-white/60 text-left md:text-right whitespace-nowrap',
          ].join(' ')}
        >
          {t.footer.copyright}
        </p>
      </div>
    </footer>
  )
}
