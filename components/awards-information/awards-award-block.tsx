'use client'

import Image from 'next/image'
import type { AwardDetail } from '@/lib/data/award-categories'

interface AwardsAwardBlockProps {
  award: AwardDetail
  /** When true: content left, image right (alternating layout per design) */
  imageRight?: boolean
}

/**
 * Section D — Single award card.
 * Layout: image left (336×336px) + content right (icon+title, description,
 * count row with diamond icon, value row with license icon).
 * Signature 2025 special case: shows two value rows separated by "Hoặc".
 * Each block has id={award.slug} for scroll anchoring.
 *
 * Extracted from Figma nodes 313:8467–313:8510 (D.1–D.6 instances).
 */
export function AwardsAwardBlock({ award, imageRight = false }: AwardsAwardBlockProps) {
  const isSignature = award.slug === 'signature-creator'

  return (
    <article
      id={award.slug}
      className={[
        'w-full flex flex-col gap-10 scroll-mt-24',
        imageRight ? 'md:flex-row-reverse' : 'md:flex-row',
      ].join(' ')}
      aria-label={award.title}
    >
      {/* Left — Award image 336×336px */}
      <div className="flex-shrink-0 flex items-start justify-center md:justify-start">
        <div
          className="relative rounded-[24px] overflow-hidden"
          style={{
            width: 336,
            height: 336,
            boxShadow: '0 4px 4px 0 rgba(0,0,0,0.25), 0 0 6px 0 #FAE287',
            border: '0.955px solid #FFEA9E',
          }}
        >
          <Image
            src={award.detailImageSrc}
            alt={award.title}
            fill
            sizes="336px"
            className="object-contain"
            unoptimized
            onError={(e) => {
              // Fallback: hide broken image, show ring bg
              const target = e.currentTarget as HTMLImageElement
              target.style.display = 'none'
            }}
          />
        </div>
      </div>

      {/* Right — Content */}
      <div className="flex-1 flex flex-col gap-8">
        {/* Title row — Target icon + award name */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <span className="flex-shrink-0 w-6 h-6 relative" aria-hidden="true">
              <Image
                src="/awards-information/Target.svg"
                alt=""
                fill
                className="object-contain"
                unoptimized
              />
            </span>
            <h2
              className="font-montserrat font-bold text-[#FFEA9E]"
              style={{ fontSize: '24px', lineHeight: '32px' }}
            >
              {award.title}
            </h2>
          </div>

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
            {award.descriptionLong}
          </p>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-[#2E3940]" aria-hidden="true" />

        {/* Count row — Diamond icon + "Số lượng giải thưởng:" + count + unit */}
        <div className="flex items-center gap-4">
          <span className="flex-shrink-0 w-6 h-6 relative" aria-hidden="true">
            <Image
              src="/awards-information/Diamond.svg"
              alt=""
              fill
              className="object-contain"
              unoptimized
            />
          </span>
          <div className="flex items-center gap-4 flex-wrap">
            <span
              className="font-montserrat font-bold text-[#FFEA9E]"
              style={{ fontSize: '24px', lineHeight: '32px' }}
            >
              Số lượng giải thưởng:
            </span>
            <span
              className="font-montserrat font-bold text-white"
              style={{ fontSize: '36px', lineHeight: '44px' }}
            >
              {award.count}
            </span>
            {award.unit && (
              <span
                className="font-montserrat font-bold text-white"
                style={{ fontSize: '14px', lineHeight: '20px', letterSpacing: '0.1px' }}
              >
                {award.unit}
              </span>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-[#2E3940]" aria-hidden="true" />

        {/* Value section */}
        {isSignature && award.valueAlt ? (
          /* Signature special case: two value rows + "Hoặc" separator */
          <div className="flex flex-col gap-4">
            {/* Value row 1 — cá nhân */}
            <ValueRow
              value={award.value}
              suffix={award.valueSuffix}
            />

            {/* "Hoặc" separator */}
            <div className="flex items-center gap-2">
              <span
                className="font-montserrat font-bold text-[#2E3940]"
                style={{ fontSize: '14px', lineHeight: '20px', letterSpacing: '0.1px' }}
              >
                Hoặc
              </span>
              <div className="flex-1 h-px bg-[#2E3940]" aria-hidden="true" />
            </div>

            {/* Value row 2 — tập thể */}
            <ValueRow
              value={award.valueAlt}
              suffix={award.valueAltSuffix ?? ''}
            />
          </div>
        ) : (
          /* Standard single value row */
          <ValueRow
            value={award.value}
            suffix={award.valueSuffix}
          />
        )}
      </div>
    </article>
  )
}

/* ------------------------------------------------------------------ */
/* Internal helper — value row with License icon                       */
/* ------------------------------------------------------------------ */

interface ValueRowProps {
  value: string
  suffix: string
}

function ValueRow({ value, suffix }: ValueRowProps) {
  return (
    <div className="flex flex-col gap-2">
      {/* Label row */}
      <div className="flex items-center gap-4">
        <span className="flex-shrink-0 w-6 h-6 relative" aria-hidden="true">
          <Image
            src="/awards-information/License.svg"
            alt=""
            fill
            className="object-contain"
            unoptimized
          />
        </span>
        <span
          className="font-montserrat font-bold text-[#FFEA9E]"
          style={{ fontSize: '24px', lineHeight: '32px' }}
        >
          Giá trị giải thưởng:
        </span>
      </div>

      {/* Value amount */}
      <div className="pl-10">
        <span
          className="font-montserrat font-bold text-white"
          style={{ fontSize: '36px', lineHeight: '44px' }}
        >
          {value}
        </span>
      </div>

      {/* Suffix */}
      {suffix && (
        <div className="pl-10">
          <span
            className="font-montserrat font-bold text-white"
            style={{ fontSize: '14px', lineHeight: '20px', letterSpacing: '0.1px' }}
          >
            {suffix}
          </span>
        </div>
      )}
    </div>
  )
}
