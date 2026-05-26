import Link from 'next/link'

export function HomeCtaButtons() {
  return (
    <div className="flex flex-wrap gap-3 sm:gap-4">
      {/* B3.1 — ABOUT AWARDS: yellow fill, hover → outline */}
      <Link
        href="/awards-information"
        className={[
          'inline-flex items-center justify-center',
          'px-6 py-3 rounded',
          'font-montserrat font-bold text-sm sm:text-base',
          'tracking-[0.1em] uppercase whitespace-nowrap',
          'bg-[#F5C518] text-[#00101A]',
          'border-2 border-[#F5C518]',
          'transition-colors duration-200',
          'hover:bg-transparent hover:text-[#F5C518]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C518]',
        ].join(' ')}
      >
        About Awards
      </Link>

      {/* B3.2 — ABOUT KUDOS: outline, hover → yellow fill */}
      <Link
        href="/sun-kudos"
        className={[
          'inline-flex items-center justify-center',
          'px-6 py-3 rounded',
          'font-montserrat font-bold text-sm sm:text-base',
          'tracking-[0.1em] uppercase whitespace-nowrap',
          'bg-transparent text-white',
          'border-2 border-white',
          'transition-colors duration-200',
          'hover:bg-[#F5C518] hover:text-[#00101A] hover:border-[#F5C518]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white',
        ].join(' ')}
      >
        About Kudos
      </Link>
    </div>
  )
}
