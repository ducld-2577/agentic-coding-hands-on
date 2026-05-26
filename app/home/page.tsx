import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { HomeHeader } from '@/components/home/home-header'
import { HomeHeroSection } from '@/components/home/home-hero-section'
import { HomeRootFurther } from '@/components/home/home-root-further'
import { HomeAwardsSection } from '@/components/home/home-awards-section'
import { HomeKudosSection } from '@/components/home/home-kudos-section'
import { HomeWidgetButton } from '@/components/home/home-widget-button'
import { HomeFooter } from '@/components/home/home-footer'

export default async function HomePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <main className="relative min-h-screen w-full bg-[#00101A]">
      {/* Header — z-30 so it floats above all content sections */}
      <HomeHeader user={user} />

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
