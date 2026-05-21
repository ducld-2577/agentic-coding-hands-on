import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { HomeHeader } from '@/components/home/home-header'
import { HomeHeroSection } from '@/components/home/home-hero-section'
import { HomeRootFurther } from '@/components/home/home-root-further'
import { HomeAwardsSection } from '@/components/home/home-awards-section'
import { HomeKudosSection } from '@/components/home/home-kudos-section'
import { HomeWidgetButton } from '@/components/home/home-widget-button'
import { HomeFooter } from '@/components/home/home-footer'

function hasSessionCookie(cookieNames: string[]): boolean {
  return cookieNames.some(
    (name) => name.includes('-auth-token') && !name.includes('-auth-token-code-verifier')
  )
}

export default async function HomePage() {
  const supabase = await createClient()
  const cookieStore = await cookies()
  const cookieNames = cookieStore.getAll().map((cookie) => cookie.name)
  const hasAuthCookie = hasSessionCookie(cookieNames)

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session?.user && !hasAuthCookie) {
    redirect('/login')
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  const resolvedUser = userError ? (session?.user ?? null) : user

  return (
    <main className="relative min-h-screen w-full bg-[#00101A]">
      {/* Header — z-30 so it floats above all content sections */}
      <HomeHeader user={resolvedUser} />

      {/* Hero: keyvisual + countdown + event info + CTAs */}
      <HomeHeroSection />

      {/* Root Further: logo + description text */}
      <HomeRootFurther />

      {/* Awards section */}
      <HomeAwardsSection />

      {/* Kudos section */}
      <HomeKudosSection />

      {/* Floating widget button */}
      <HomeWidgetButton />

      {/* Footer */}
      <HomeFooter />
    </main>
  )
}
