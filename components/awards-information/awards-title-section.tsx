/**
 * Section A — Title block for the Awards Information page.
 * Small faded subtitle + large gold heading.
 * Extracted from Figma node 313:8453 (A_Title hệ thống giải thưởng).
 */
export function AwardsTitleSection() {
  return (
    <section
      aria-label="Title"
      className={[
        'w-full flex flex-col gap-4',
        'px-4 sm:px-8 md:px-[72px] lg:px-[144px]',
        'pt-24',
      ].join(' ')}
    >
      {/* Small subtitle — "Sun* Annual Awards 2025" */}
      {/* Figma: fontSize 24px, fontWeight 700, color white, textAlign center */}
      <p
        className="w-full text-center font-montserrat font-bold text-white/60 uppercase tracking-widest"
        style={{ fontSize: '24px', lineHeight: '32px' }}
      >
        Sun* Annual Awards 2025
      </p>

      {/* Divider line */}
      <div className="w-full h-px bg-[#2E3940]" aria-hidden="true" />

      {/* Main gold heading */}
      {/* Figma: fontSize 57px, fontWeight 700, lineHeight 64px, color #FFEA9E, textAlign left */}
      <div className="flex justify-center">
        <h1
          className="font-montserrat font-bold text-[#FFEA9E] text-center"
          style={{
            fontSize: 'clamp(2rem, 4vw, 57px)',
            lineHeight: '1.12',
            letterSpacing: '-0.25px',
          }}
        >
          Hệ thống giải thưởng SAA 2025
        </h1>
      </div>
    </section>
  )
}
