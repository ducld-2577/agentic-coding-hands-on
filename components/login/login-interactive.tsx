'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { loginTranslations, type Locale } from '@/lib/i18n/login-translations'
import { LoginHeroSection } from './login-hero-section'
import { GoogleLoginButton } from './google-login-button'

// Client Component: reactive to locale changes + handles Supabase Google OAuth
interface LoginInteractiveProps {
  initialLocale: Locale
}

export function LoginInteractive({ initialLocale }: LoginInteractiveProps) {
  const [locale, setLocale] = useState<Locale>(initialLocale)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
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

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // Use full-page redirect flow to avoid popup/COOP issues.
          redirectTo: `${window.location.origin}/auth/callback?next=/home`,
        },
      })
      if (error) throw error
    } catch {
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
