import Image from 'next/image'
import { LanguageSelector } from '@/components/login/language-selector'

export function LoginHeader() {
  return (
    <header
      className={[
        'absolute top-0 left-0 right-0 z-30',
        'flex items-center justify-between',
        'w-full h-[64px] md:h-[80px]',
        'px-4 sm:px-8 md:px-[72px] lg:px-[144px]',
        'bg-[rgba(11,15,18,0.8)]',
      ].join(' ')}
    >
      {/* Logo — non-interactive */}
      {/* mm:I662:14391;178:1033;178:1030 */}
      <div className="flex items-center w-[52px] h-[48px] flex-shrink-0">
        <Image
          src="/login/Logo.png"
          alt="SAA Logo"
          width={52}
          height={48}
          className="object-cover w-full h-full"
          priority
        />
      </div>

      {/* Language selector */}
      <LanguageSelector defaultLocale="VN" />
    </header>
  )
}
