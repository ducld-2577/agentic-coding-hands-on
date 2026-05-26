import Image from 'next/image'
import type { ReactNode } from 'react'

interface LoginHeroSectionProps {
  tagline: string
  description1: string
  description2: string
  loginButtonSlot: ReactNode
}

export function LoginHeroSection({
  tagline,
  description1,
  description2,
  loginButtonSlot,
}: LoginHeroSectionProps) {
  return (
    <section
      aria-label="Hero"
      className={[
        'relative z-10 flex flex-col justify-center',
        'w-full',
        'px-4 sm:px-8 md:px-[72px] lg:px-[144px]',
        'pt-[80px] pb-[80px] md:pt-[96px] md:pb-[96px]',
        'min-h-screen md:min-h-[845px]',
      ].join(' ')}
    >
      <div className="flex flex-col gap-10 md:gap-[80px] w-full max-w-[1152px]">
        {/* Key Visual — "ROOT FURTHER" logo */}
        <div className="flex flex-col gap-6 w-full">
          {/* mm:2939:9548 */}
          <div className="relative w-full max-w-[451px] h-[120px] sm:h-[160px] md:h-[200px]">
            <Image
              src="/login/Root_Further_Logo.png"
              alt={tagline}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 451px, 451px"
              className="object-contain object-left"
              priority
            />
          </div>
        </div>

        {/* Content: descriptions + login button */}
        <div className="flex flex-col gap-6 pl-0 sm:pl-4 w-full max-w-[496px]">
          <p
            className={[
              'font-montserrat font-bold',
              'text-base sm:text-lg md:text-[20px]',
              'leading-7 sm:leading-8 md:leading-[40px]',
              'tracking-[0.5px] text-white',
            ].join(' ')}
          >
            {description1}
            <br />
            {description2}
          </p>

          {/* Login button slot — wired by Track B */}
          <div className="flex items-start">
            {loginButtonSlot}
          </div>
        </div>
      </div>
    </section>
  )
}
