'use client'

import { AWARD_CATEGORIES } from '@/lib/data/award-categories'
import { HomeAwardCard } from '@/components/home/home-award-card'
import { useLocale } from '@/lib/i18n/use-locale'
import { homeTranslations } from '@/lib/i18n/home-translations'

export function HomeAwardsSection() {
  const locale = useLocale()
  const t = homeTranslations[locale]

  return (
    <section className="w-full py-16 px-4 sm:px-8 md:px-[72px] lg:px-[144px]">
      {/* Section header */}
      <div className="mb-10 flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-yellow-400 font-montserrat">
          {t.awards.sectionLabel}
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-white font-montserrat leading-tight">
          {t.awards.title}
        </h2>
        <p className="text-sm md:text-base text-white/60 max-w-xl leading-relaxed">
          {t.awards.description}
        </p>
      </div>

      {/* Award cards grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
        {AWARD_CATEGORIES.map((award) => (
          <HomeAwardCard key={award.slug} award={award} detailsLabel={t.details} />
        ))}
      </div>
    </section>
  )
}
