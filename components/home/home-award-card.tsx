import Image from 'next/image'
import Link from 'next/link'
import type { AwardCategory } from '@/lib/data/award-categories'

interface HomeAwardCardProps {
  award: AwardCategory
  detailsLabel: string
}

export function HomeAwardCard({ award, detailsLabel }: HomeAwardCardProps) {
  const href = `/awards-information#${award.slug}`

  return (
    <Link
      href={href}
      className={[
        'group flex flex-col gap-4',
        'bg-[#0d1b26] border border-[#1e3a4a] rounded-xl p-4',
        'hover:-translate-y-1 hover:border-yellow-400/80',
        'transition-transform duration-200',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-400',
      ].join(' ')}
    >
      {/* Thumbnail: shared ring background + award text logo overlay */}
      <div
        className={[
          'relative aspect-square w-full rounded-lg overflow-hidden',
          'border border-yellow-500/30 group-hover:border-yellow-400/60',
          'shadow-[0_0_12px_rgba(234,179,8,0.10)] group-hover:shadow-[0_0_20px_rgba(234,179,8,0.25)]',
          'transition-all duration-200',
          'bg-[#060e14]',
        ].join(' ')}
      >
        {/* Circular ring glow background */}
        <Image
          src="/awards/award-ring-bg.png"
          alt=""
          fill
          sizes="(max-width: 1024px) 50vw, 33vw"
          className="object-contain p-3"
          aria-hidden="true"
        />
        {/* Award name text logo */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-3/5 h-1/4">
            <Image
              src={award.textLogoSrc}
              alt={award.title}
              fill
              sizes="(max-width: 1024px) 25vw, 16vw"
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-white font-bold text-base leading-snug font-montserrat">
        {award.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-white/70 line-clamp-2 leading-relaxed">
        {award.description}
      </p>

      {/* Details link */}
      <span className="flex items-center gap-1 text-sm text-yellow-400 font-semibold font-montserrat mt-auto">
        {detailsLabel}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M5 12h14M13 6l6 6-6 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </Link>
  )
}
