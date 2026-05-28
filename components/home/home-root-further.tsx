'use client'

import Image from 'next/image'
import { useLocale } from '@/lib/i18n/use-locale'
import { homeContentTranslations } from '@/lib/i18n/home-content-translations'

const baseTextClass = [
  'font-montserrat font-medium',
  'text-sm sm:text-base',
  'leading-7 sm:leading-8',
  'text-white/80',
].join(' ')

export function HomeRootFurther() {
  const locale = useLocale()
  const t = homeContentTranslations[locale].rootFurther

  return (
    <section
      aria-label="Root Further"
      className={[
        'w-full flex flex-col items-center gap-8',
        'px-4 sm:px-8 md:px-[72px] lg:px-[104px]',
        'py-[80px] md:py-[120px]',
      ].join(' ')}
    >
      {/* ROOT FURTHER logo — centered, same image as hero but smaller */}
      <div className="relative w-full max-w-[400px] h-[100px]">
        <Image
          src="/login/Root_Further_Logo.png"
          alt="ROOT FURTHER"
          fill
          sizes="(max-width: 640px) 80vw, 400px"
          className="object-contain"
        />
      </div>

      {/* Description text block */}
      <div className="flex flex-col gap-6 max-w-[720px] w-full">
        {/* Paragraphs 1–3 */}
        <div className="flex flex-col gap-4">
          <p className={baseTextClass}>{t.para1}</p>
          <p className={baseTextClass}>{t.para2}</p>
          <p className={baseTextClass}>{t.para3}</p>
        </div>

        {/* Quote block */}
        <blockquote className="flex flex-col items-center gap-1 py-2">
          <p className="font-montserrat font-bold text-base sm:text-lg text-white italic text-center">
            {t.quote}
          </p>
          <p className="font-montserrat text-sm text-white/60 italic text-center">
            {t.quoteAttribution}
          </p>
        </blockquote>

        {/* Paragraphs 4–5 */}
        <div className="flex flex-col gap-4">
          <p className={baseTextClass}>{t.para4}</p>
          <p className={baseTextClass}>{t.para5}</p>
        </div>
      </div>
    </section>
  )
}
