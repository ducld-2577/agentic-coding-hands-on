import Image from 'next/image'

export function KudosKvBanner() {
  return (
    <section
      aria-label="Kudos key visual banner"
      className="w-full px-4 sm:px-8 md:px-[72px] lg:px-[144px]"
      style={{ height: '160px', backgroundColor: '#00101A' }}
    >
      <div className="flex h-full items-center justify-between max-w-[1440px] mx-auto">
        <div className="flex flex-col gap-1">
          <p
            className="font-montserrat font-bold"
            style={{ color: '#F5C842', fontSize: '14px', lineHeight: '20px' }}
          >
            Hệ thống ghi nhận và cảm ơn
          </p>
          <div className="flex items-center gap-3">
            <Image
              src="/kudos/kudos-logo.png"
              alt="Sun* Kudos logo"
              width={220}
              height={44}
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
