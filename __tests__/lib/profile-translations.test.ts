import { describe, it, expect } from 'vitest'
import { profileTranslations } from '@/lib/i18n/profile-translations'

const LOCALES = ['VN', 'EN'] as const
const REQUIRED_KEYS = [
  'iconCollection',
  'kudosReceived',
  'kudosSent',
  'heartsReceived',
  'secretBoxesOpened',
  'secretBoxesUnopened',
  'openSecretBox',
] as const

describe('profileTranslations', () => {
  it('has exactly VN and EN locales', () => {
    expect(Object.keys(profileTranslations)).toHaveLength(2)
    expect(Object.keys(profileTranslations)).toEqual(expect.arrayContaining([...LOCALES]))
  })

  LOCALES.forEach((locale) => {
    describe(`locale: ${locale}`, () => {
      it('has all required keys', () => {
        REQUIRED_KEYS.forEach((key) => {
          expect(profileTranslations[locale]).toHaveProperty(key)
        })
      })

      it('has no empty values', () => {
        REQUIRED_KEYS.forEach((key) => {
          expect(profileTranslations[locale][key].trim()).not.toBe('')
        })
      })
    })
  })

  it('VN and EN iconCollection labels are different strings', () => {
    expect(profileTranslations.VN.iconCollection).not.toBe(profileTranslations.EN.iconCollection)
  })

  it('openSecretBox contains gift emoji in both locales', () => {
    expect(profileTranslations.VN.openSecretBox).toContain('🎁')
    expect(profileTranslations.EN.openSecretBox).toContain('🎁')
  })
})
