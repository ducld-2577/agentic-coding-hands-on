import { describe, it, expect } from 'vitest'
import { countdownTranslations } from '@/lib/i18n/countdown-translations'

const LOCALES = ['VN', 'EN'] as const
const REQUIRED_KEYS = ['eventTitle', 'days', 'hours', 'minutes'] as const

describe('countdownTranslations', () => {
  it('has exactly VN and EN locales', () => {
    expect(Object.keys(countdownTranslations)).toEqual(expect.arrayContaining([...LOCALES]))
    expect(Object.keys(countdownTranslations)).toHaveLength(2)
  })

  LOCALES.forEach((locale) => {
    describe(`locale: ${locale}`, () => {
      it('has all required keys', () => {
        REQUIRED_KEYS.forEach((key) => {
          expect(countdownTranslations[locale]).toHaveProperty(key)
        })
      })

      it('has no empty values', () => {
        REQUIRED_KEYS.forEach((key) => {
          expect(countdownTranslations[locale][key].trim()).not.toBe('')
        })
      })
    })
  })

  it('time unit labels are uppercase in both locales', () => {
    const unitKeys = ['days', 'hours', 'minutes'] as const
    for (const locale of LOCALES) {
      for (const key of unitKeys) {
        const val = countdownTranslations[locale][key]
        expect(val).toBe(val.toUpperCase())
      }
    }
  })

  it('VN and EN eventTitle are different strings', () => {
    expect(countdownTranslations.VN.eventTitle).not.toBe(countdownTranslations.EN.eventTitle)
  })
})
