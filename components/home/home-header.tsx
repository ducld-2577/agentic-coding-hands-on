import Image from 'next/image'
import Link from 'next/link'
import type { User } from '@supabase/supabase-js'
import { LanguageSelector } from '@/components/login/language-selector'
import { HomeNavLinks } from '@/components/home/home-nav-links'
import { HomeAccountMenu } from '@/components/home/home-account-menu'
import { HomeNotificationBell } from '@/components/home/home-notification-bell'

interface HomeHeaderProps {
  user: User | null
}

export function HomeHeader({ user }: HomeHeaderProps) {
  return (
    <header
      className={[
        'fixed top-0 left-0 right-0 z-30',
        'grid grid-cols-[1fr_auto_1fr] items-center',
        'w-full h-[72px]',
        'px-4 sm:px-8 md:px-[72px] lg:px-[144px]',
        'bg-[rgba(11,15,18,0.92)] backdrop-blur-sm',
        'border-b border-white/5',
      ].join(' ')}
    >
      {/* Logo — left column */}
      <Link
        href="/home"
        className="justify-self-start focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded"
        aria-label="SAA 2025 — Go to home"
      >
        <Image
          src="/login/Logo.png"
          alt="SAA 2025"
          width={47}
          height={44}
          className="object-contain"
          priority
        />
      </Link>

      {/* Nav links — center column (always truly centered) */}
      <HomeNavLinks />

      {/* Controls — right column */}
      <div className="justify-self-end flex items-center gap-2">
        <LanguageSelector defaultLocale="VN" />

        {user !== null && (
          <>
            <HomeNotificationBell />
            <HomeAccountMenu user={user} />
          </>
        )}
      </div>
    </header>
  )
}
