'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { loginTranslations, type Locale } from '@/lib/i18n/login-translations'
import Link from 'next/link'
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
        <div className="flex flex-col items-start gap-3">
          <GoogleLoginButton label={t.loginButton} isLoading={isLoading} onClick={handleLogin} />
          <Link
            href="/countdown"
            className={[
              'flex items-center justify-center',
              'h-[60px] px-6 rounded-lg',
              'border border-[#FFEA9E]',
              'font-montserrat font-bold text-[18px] leading-[28px]',
              'text-[#FFEA9E]',
              'hover:bg-[rgba(255,234,158,0.1)]',
              'transition-colors duration-200 ease-in-out',
              'whitespace-nowrap min-w-[200px]',
            ].join(' ')}
          >
            {t.countdownLink}
          </Link>
        </div>
      }
    />
  )
}
