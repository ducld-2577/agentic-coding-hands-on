import { AWARD_CATEGORIES } from '@/lib/data/award-categories'
import { HomeAwardCard } from '@/components/home/home-award-card'

export function HomeAwardsSection() {
  return (
    <section className="w-full py-16 px-4 sm:px-8 md:px-[72px] lg:px-[144px]">
      {/* Section header */}
      <div className="mb-10 flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-yellow-400 font-montserrat">
          Sun* annual awards 2025
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-white font-montserrat leading-tight">
          Hệ thống giải thưởng
        </h2>
        <p className="text-sm md:text-base text-white/60 max-w-xl leading-relaxed">
          Các hạng mục sẽ được trao giải theo TOP những người xuất sắc nhất.
        </p>
      </div>

      {/* Award cards grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
        {AWARD_CATEGORIES.map((award) => (
          <HomeAwardCard key={award.slug} award={award} />
        ))}
      </div>
    </section>
  )
}
