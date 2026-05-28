'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLocale } from '@/lib/i18n/use-locale'
import { homeTranslations } from '@/lib/i18n/home-translations'
import { homeContentTranslations } from '@/lib/i18n/home-content-translations'

/**
 * Section D1 — Sun* Kudos promotional banner.
 * Background: /public/kudos/kudos-bg.png
 * Left: label + title + description + CTA button
 * Right: kudos-logo.png
 *
 * Extracted from Figma node 335:12023 (D1_Sunkudos).
 */
export function AwardsKudosBanner() {
  const locale = useLocale()
  const t = homeTranslations[locale]
  const tc = homeContentTranslations[locale]

  return (
    <section
      aria-label="Sun* Kudos"
      className={[
        'relative w-full overflow-hidden',
        'px-4 sm:px-8 md:px-[72px] lg:px-[144px]',
        'py-0',
      ].join(' ')}
    >
      <div
        className="relative w-full overflow-hidden"
        style={{
          borderRadius: '16px',
          height: '500px',
          background: '#0F0F0F',
        }}
      >
        {/* Background image */}
        <div className="absolute inset-0" aria-hidden="true">
          <Image
            src="/kudos/MM_MEDIA_Kudos Background.png"
            alt=""
            fill
            className="object-cover"
            unoptimized
          />
        </div>

        {/* Content layout */}
        <div className="relative z-10 flex h-full items-center justify-between px-[65px]">
          {/* Left — text content */}
          <div
            className="flex flex-col gap-8 justify-center"
            style={{ maxWidth: '470px' }}
          >
            {/* Top text block */}
            <div className="flex flex-col gap-4">
              {/* Label */}
              <p
                className="font-montserrat font-bold text-white"
                style={{ fontSize: '24px', lineHeight: '32px' }}
              >
                {t.kudos.movementLabel}
              </p>

              {/* Title */}
              <h2
                className="font-montserrat font-bold text-[#FFEA9E]"
                style={{
                  fontSize: 'clamp(2rem, 4vw, 57px)',
                  lineHeight: '64px',
                  letterSpacing: '-0.25px',
                }}
              >
                Sun* Kudos
              </h2>

              {/* Description */}
              <p
                className="font-montserrat font-bold text-white"
                style={{
                  fontSize: '16px',
                  lineHeight: '24px',
                  letterSpacing: '0.5px',
                  textAlign: 'justify',
                }}
              >
                {t.kudos.newFeatureLabel}
                {'\n'}
                {tc.kudosDescription}
              </p>
            </div>

            {/* CTA button */}
            <div>
              <Link
                href="/sun-kudos"
                className={[
                  'inline-flex items-center gap-2',
                  'px-4 py-4 rounded',
                  'font-montserrat font-bold text-[#00101A]',
                  'bg-[#FFEA9E] hover:bg-yellow-300',
                  'transition-colors duration-200',
                ].join(' ')}
                style={{ fontSize: '16px', lineHeight: '24px', letterSpacing: '0.15px' }}
              >
                {t.details}
              </Link>
            </div>
          </div>

          {/* Right — Kudos logo */}
          <div
            className="flex-shrink-0 hidden md:block"
            aria-hidden="true"
            style={{ width: 272, height: 219 }}
          >
            <Image
              src="/kudos/kudos-logo.png"
              alt="Sun* Kudos"
              width={272}
              height={219}
              className="object-contain"
              unoptimized
            />
          </div>
        </div>
      </div>
    </section>
  )
}
