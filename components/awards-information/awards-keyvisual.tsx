'use client'

import Image from 'next/image'

/**
 * Hero banner for the Awards Information page.
 * Full-width keyvisual background with Root Further Logo overlay.
 * Pattern mirrors home-hero-section.tsx but without countdown/CTAs.
 */
export function AwardsKeyvisual() {
  return (
    <section
      aria-label="Awards keyvisual"
      className="relative w-full"
      style={{ height: '547px' }}
    >
      {/* Background layers */}
      <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        {/* Keyvisual background image */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/awards-information/keyvisual.png), url(/login/keyvisual-bg.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            backgroundRepeat: 'no-repeat',
          }}
        />
        {/* Bottom fade to page background */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(0deg, #00101A 0%, rgba(0,16,26,0.4) 60%, rgba(0,16,26,0.1) 100%)',
          }}
        />
      </div>

      {/* Root Further Logo overlay */}
      <div
        className={[
          'relative z-10 flex items-end',
          'w-full h-full',
          'px-4 sm:px-8 md:px-[72px] lg:px-[144px]',
          'pb-[40px]',
        ].join(' ')}
      >
        <div className="relative" style={{ width: 338, height: 150 }}>
          <Image
            src="/awards-information/Root_Further_Logo.png"
            alt="Root Further — Sun* Annual Awards"
            fill
            sizes="338px"
            className="object-contain object-left"
            priority
            unoptimized
            onError={() => {/* Silently use fallback bg */}}
          />
        </div>
      </div>
    </section>
  )
}
