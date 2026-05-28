import Image from 'next/image'
import { HomeCountdown } from '@/components/home/home-countdown'
import { HomeEventInfo } from '@/components/home/home-event-info'
import { HomeCtaButtons } from '@/components/home/home-cta-buttons'

export function HomeHeroSection() {
  return (
    <section
      aria-label="Hero"
      className={[
        'relative z-10',
        'w-full min-h-screen',
        'flex flex-col',
      ].join(' ')}
    >
      {/* Background layers — overflow-hidden here, NOT on <main> */}
      <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        {/* Keyvisual background */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/home/mm_keyvisual.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            backgroundRepeat: 'no-repeat',
          }}
        />
        {/* Dark gradient overlay — matches design Cover: 12deg, dark at bottom, transparent at top */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(12deg, #00101A 23.7%, rgba(0, 18, 29, 0.46) 38.34%, rgba(0, 19, 32, 0.00) 48.92%)',
          }}
        />
      </div>

      {/* Content stack */}
      <div
        className={[
          'relative z-10 flex flex-col justify-end',
          'flex-1',
          'px-4 sm:px-8 md:px-[72px] lg:px-[144px]',
          'pt-[120px] pb-[80px] md:pt-[160px] md:pb-[120px]',
          'gap-10 md:gap-14',
        ].join(' ')}
      >
        {/* ROOT FURTHER title image */}
        <div className="relative w-full max-w-[560px] h-[120px] sm:h-[160px] md:h-[200px]">
          <Image
            src="/login/Root_Further_Logo.png"
            alt="ROOT FURTHER"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 560px, 560px"
            className="object-contain object-left"
            priority
          />
        </div>

        {/* B1 — Countdown */}
        <HomeCountdown />

        {/* B2 — Event info */}
        <HomeEventInfo />

        {/* B3 — CTA buttons */}
        <HomeCtaButtons />
      </div>
    </section>
  )
}
