'use client'

import { useState, useEffect } from 'react'
import type { Locale } from './login-translations'

function readLocaleCookie(): Locale {
  if (typeof document === 'undefined') return 'VN'
  const match = document.cookie.match(/(?:^|;\s*)locale=([^;]*)/)
  const val = match?.[1]
  return val === 'EN' ? 'EN' : 'VN'
}

export function useLocale(): Locale {
  const [locale, setLocale] = useState<Locale>('VN')

  useEffect(() => {
    setLocale(readLocaleCookie())

    function onLocaleChange(e: Event) {
      setLocale((e as CustomEvent<Locale>).detail)
    }

    window.addEventListener('locale-change', onLocaleChange)
    return () => window.removeEventListener('locale-change', onLocaleChange)
  }, [])

  return locale
}
