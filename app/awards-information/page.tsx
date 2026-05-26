import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { HomeHeader } from '@/components/home/home-header'
import { HomeFooter } from '@/components/home/home-footer'
import { AwardsKeyvisual } from '@/components/awards-information/awards-keyvisual'
import { AwardsTitleSection } from '@/components/awards-information/awards-title-section'
import { AwardsSystemSection } from '@/components/awards-information/awards-system-section'
import { AwardsKudosBanner } from '@/components/awards-information/awards-kudos-banner'

export default async function AwardsInformationPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <main className="relative min-h-screen w-full bg-[#00101A]">
      <HomeHeader user={user} />
      <AwardsKeyvisual />
      <AwardsTitleSection />
      <AwardsSystemSection />
      <AwardsKudosBanner />
      <HomeFooter />
    </main>
  )
}
