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
        'flex items-center',
        'w-full h-[72px]',
        'px-4 sm:px-8 md:px-[72px] lg:px-[144px]',
        'bg-[rgba(11,15,18,0.92)] backdrop-blur-sm',
        'border-b border-white/5',
      ].join(' ')}
    >
      {/* Logo */}
      <Link
        href="/home"
        className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded shrink-0"
        aria-label="SAA 2025 — Go to home"
      >
        <Image
          src="/login/Logo.png"
          alt="SAA 2025"
          width={47}
          height={44}
          priority
        />
      </Link>

      {/* Nav links — right after logo with gap */}
      <div className="ml-6">
        <HomeNavLinks />
      </div>

      {/* Controls — pushed to the right: Bell → Language → Account */}
      <div className="ml-auto flex items-center gap-2">
        {user !== null && (
          <HomeNotificationBell />
        )}

        <LanguageSelector defaultLocale="VN" />

        {user !== null && (
          <HomeAccountMenu user={user} />
        )}
      </div>
    </header>
  )
}
