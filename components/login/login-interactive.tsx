'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { loginTranslations, type Locale } from '@/lib/i18n/login-translations'
import { LoginHeroSection } from './login-hero-section'
import { GoogleLoginButton } from './google-login-button'

function getLocaleFromCookie(): Locale {
  if (typeof document === 'undefined') return 'VN'
  const match = document.cookie.match(/(?:^|;\s*)locale=([^;]*)/)
  const val = match?.[1]
  return val === 'VN' || val === 'EN' ? val : 'VN'
}

// Client Component: reactive to locale changes + handles Supabase Google OAuth
export function LoginInteractive() {
  const [locale, setLocale] = useState<Locale>('VN')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setLocale(getLocaleFromCookie())

    function handleLocaleChange(e: Event) {
      const detail = (e as CustomEvent<Locale>).detail
      setLocale(detail)
    }

    window.addEventListener('locale-change', handleLocaleChange)
    return () => window.removeEventListener('locale-change', handleLocaleChange)
  }, [])

  async function handleLogin() {
    if (isLoading) return
    setIsLoading(true)

    let subscription: { unsubscribe: () => void } | null = null

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/auth/callback/close`,
          skipBrowserRedirect: true,
        },
      })
      if (error || !data.url) throw error ?? new Error('No OAuth URL returned')

      const popup = window.open(data.url, 'google-auth', 'width=500,height=600,left=200,top=100')
      if (!popup) throw new Error('Popup was blocked. Please allow popups for this site.')

      const result = supabase.auth.onAuthStateChange((event) => {
        if (event === 'SIGNED_IN') {
          result.data.subscription.unsubscribe()
          popup.close()
          setIsLoading(false)
          router.push('/home')
        }
      })
      subscription = result.data.subscription
    } catch {
      subscription?.unsubscribe()
      setIsLoading(false)
    }
  }

  const t = loginTranslations[locale]

  return (
    <LoginHeroSection
      tagline={t.tagline}
      description1={t.description1}
      description2={t.description2}
      loginButtonSlot={
        <GoogleLoginButton label={t.loginButton} isLoading={isLoading} onClick={handleLogin} />
      }
    />
  )
}
