import { describe, it, expect } from 'vitest'
import { loginTranslations, type Locale } from '@/lib/i18n/login-translations'

const REQUIRED_KEYS: (keyof typeof loginTranslations.EN)[] = [
  'tagline',
  'description1',
  'description2',
  'loginButton',
]

const LOCALES: Locale[] = ['VN', 'EN']

describe('loginTranslations', () => {
  it('has all required locales', () => {
    expect(Object.keys(loginTranslations)).toEqual(expect.arrayContaining(LOCALES))
  })

  LOCALES.forEach((locale) => {
    describe(`locale: ${locale}`, () => {
      it('has all required keys', () => {
        REQUIRED_KEYS.forEach((key) => {
          expect(loginTranslations[locale]).toHaveProperty(key)
        })
      })

      it('has no empty values', () => {
        REQUIRED_KEYS.forEach((key) => {
          expect(loginTranslations[locale][key].trim()).not.toBe('')
        })
      })
    })
  })

  it('tagline is the same across locales (brand constant)', () => {
    expect(loginTranslations.VN.tagline).toBe(loginTranslations.EN.tagline)
  })

  it('VN and EN login buttons are different strings', () => {
    expect(loginTranslations.VN.loginButton).not.toBe(loginTranslations.EN.loginButton)
  })
})
