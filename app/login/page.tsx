import type { Metadata } from 'next'
import { LoginHeader } from '@/components/login/login-header'

export const metadata: Metadata = { title: 'Login' }
import { LoginInteractive } from '@/components/login/login-interactive'
import { LoginFooter } from '@/components/login/login-footer'
import { cookies } from 'next/headers'
import type { Locale } from '@/lib/i18n/login-translations'

async function getInitialLocale(): Promise<Locale> {
  const cookieStore = await cookies()
  const locale = cookieStore.get('locale')?.value
  return locale === 'VN' || locale === 'EN' ? locale : 'VN'
}

export default async function LoginPage() {
  const initialLocale = await getInitialLocale()

  return (
    <main className="relative min-h-screen w-full bg-[#00101A]">
      {/* Background layers in their own overflow-hidden container so they don't clip dropdowns */}
      <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        {/* C: Background key visual */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/login/image%201.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        {/* Horizontal gradient overlay — darkens left side for text readability */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(90deg, #00101A 0%, #00101A 25.41%, rgba(0, 16, 26, 0.00) 100%)',
          }}
        />
        {/* Cover gradient overlay — darkens bottom */}
        <div
          className="absolute w-full"
          style={{
            top: '138px',
            height: '1093px',
            background: 'linear-gradient(0deg, #00101A 22.48%, rgba(0, 19, 32, 0.00) 51.74%)',
          }}
        />
      </div>

      {/* A: Header — logo + language selector */}
      <LoginHeader />

      {/* B: Hero + auth button — locale-reactive Client Component */}
      <LoginInteractive initialLocale={initialLocale} />

      {/* D: Footer — fixed bottom */}
      <LoginFooter />
    </main>
  )
}
