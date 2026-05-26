import Image from 'next/image'
import { KudosBadge } from '@/components/sun-kudos/kudos-badge'
import type { Profile } from '@/lib/kudos/types'

interface ProfileHeroSectionProps {
  profile: Profile | null
}

function AvatarFallback({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .slice(-2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
  return (
    <div
      className="flex items-center justify-center rounded-full font-montserrat font-bold text-2xl text-white select-none"
      style={{ width: 88, height: 88, background: 'rgba(255,255,255,0.15)', border: '2px solid white' }}
    >
      {initials}
    </div>
  )
}

const BADGE_PLACEHOLDER_COUNT = 6

export function ProfileHeroSection({ profile }: ProfileHeroSectionProps) {
  const name = profile?.full_name ?? 'Unknown'

  return (
    <section aria-label="Profile hero" className="relative w-full" style={{ minHeight: 380 }}>
      {/* Keyvisual background */}
      <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/awards-information/keyvisual.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            backgroundRepeat: 'no-repeat',
          }}
        />
        {/* Dark gradient overlay so text is readable */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(0,16,26,0.35) 0%, rgba(0,16,26,0.70) 100%)' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center pt-16 pb-6 px-4">
        {/* Avatar */}
        {profile?.avatar_url ? (
          <Image
            src={profile.avatar_url}
            alt={name}
            width={88}
            height={88}
            className="rounded-full object-cover"
            style={{ border: '2px solid white', width: 88, height: 88 }}
          />
        ) : (
          <AvatarFallback name={name} />
        )}

        {/* Name */}
        <h1
          className="mt-3 font-montserrat font-bold text-white text-center leading-tight"
          style={{ fontSize: 22 }}
        >
          {name}
        </h1>

        {/* Badge title */}
        {profile?.badge_title && (
          <div className="mt-2">
            <KudosBadge badge={profile.badge_title} />
          </div>
        )}

        {/* Badge placeholder collection */}
        <div className="mt-5 flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            {Array.from({ length: BADGE_PLACEHOLDER_COUNT }).map((_, i) => (
              <div
                key={i}
                className="rounded-full"
                style={{ width: 40, height: 40, background: 'rgba(255,255,255,0.15)' }}
                aria-hidden="true"
              />
            ))}
          </div>
          <span className="font-montserrat text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Bộ sưu tập icon của tôi
          </span>
        </div>
      </div>
    </section>
  )
}
