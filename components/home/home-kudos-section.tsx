import Image from 'next/image'
import Link from 'next/link'

export function HomeKudosSection() {
  return (
    <section
      aria-label="Sun* Kudos"
      className="w-full px-4 sm:px-8 md:px-[72px] lg:px-[144px] py-16 md:py-[96px] bg-[#00101A]"
    >
      {/* Card: background image + content */}
      <div className="relative max-w-[1152px] mx-auto rounded-2xl overflow-hidden min-h-[500px]">
        {/* Background — dark card with golden curves */}
        <Image
          src="/kudos/kudos-bg.png"
          alt=""
          fill
          sizes="(max-width: 1440px) 100vw, 1152px"
          className="object-cover"
          aria-hidden="true"
          priority={false}
        />

        {/* Overlay: ensure left area stays dark for text readability */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, rgba(15,15,15,0.85) 0%, rgba(15,15,15,0.5) 55%, rgba(15,15,15,0.1) 100%)',
          }}
          aria-hidden="true"
        />

        {/* Content row */}
        <div
          className={[
            'relative z-10',
            'flex flex-col md:flex-row',
            'items-start md:items-center justify-between',
            'min-h-[500px]',
            'px-6 sm:px-10 md:px-[64px]',
            'py-10 md:py-[46px]',
            'gap-10 md:gap-8',
          ].join(' ')}
        >
          {/* Left: text content */}
          <div className="flex flex-col gap-8 max-w-[457px]">
            {/* Label + title + description */}
            <div className="flex flex-col gap-4">
              {/* D2: "Phong trào ghi nhận" label */}
              <p
                className="font-montserrat font-bold text-white"
                style={{ fontSize: '24px', lineHeight: '32px' }}
              >
                Phong trào ghi nhận
              </p>

              {/* "Sun* Kudos" title */}
              <h2
                className="font-montserrat font-bold"
                style={{
                  fontSize: 'clamp(36px, 4vw, 57px)',
                  lineHeight: '1.12',
                  letterSpacing: '-0.25px',
                  color: '#FFEA9E',
                }}
              >
                Sun* Kudos
              </h2>

              {/* Description — matches Figma node content exactly */}
              <div
                className="font-montserrat font-bold text-white"
                style={{ fontSize: '16px', lineHeight: '24px', letterSpacing: '0.5px' }}
              >
                <p className="font-bold">ĐIỂM MỚI CỦA SAA 2025</p>
                <p className="text-justify mt-1">
                  Hoạt động ghi nhận và cảm ơn đồng nghiệp - lần đầu tiên được diễn ra dành cho
                  tất cả Sunner. Hoạt động sẽ được triển khai vào tháng 11/2025, khuyến khích
                  người Sun* chia sẻ những lời ghi nhận, cảm ơn đồng nghiệp trên hệ thống do BTC
                  công bố. Đây sẽ là chất liệu để Hội đồng Heads tham khảo trong quá trình lựa
                  chọn người đạt giải.
                </p>
              </div>
            </div>

            {/* Chi tiết button */}
            <div>
              <Link
                href="/sun-kudos"
                className={[
                  'inline-flex items-center gap-2',
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
                Chi tiết
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Right: Kudos logo */}
          <div className="shrink-0 self-center md:self-auto md:flex md:items-center md:justify-end md:pr-4">
            <Image
              src="/kudos/kudos-logo.png"
              alt="Sun* Kudos logo"
              width={364}
              height={72}
              className="object-contain w-auto"
              style={{ maxWidth: '364px', height: 'auto' }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
