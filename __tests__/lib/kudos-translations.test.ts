import { describe, it, expect } from 'vitest'
import { kudosTranslations } from '@/lib/i18n/kudos-translations'

const LOCALES = ['VN', 'EN'] as const
const REQUIRED_KEYS = [
  'kvTagline',
  'submitAriaLabel',
  'submitPlaceholder',
  'searchPlaceholder',
  'filterHashtag',
  'filterDepartment',
  'statsKudosReceived',
  'statsKudosSent',
  'statsHeartsReceived',
  'statsBoxesOpened',
  'statsBoxesUnopened',
  'openSecretBox',
  'secretBoxDialogLabel',
  'closeAriaLabel',
  'noSecretBoxes',
  'secretBoxPrefix',
  'openedBadge',
  'openButton',
  'openingButton',
  'noPrize',
  'errorMessage',
] as const

describe('kudosTranslations', () => {
  it('has exactly VN and EN locales', () => {
    expect(Object.keys(kudosTranslations)).toHaveLength(2)
    expect(Object.keys(kudosTranslations)).toEqual(expect.arrayContaining([...LOCALES]))
  })

  LOCALES.forEach((locale) => {
    describe(`locale: ${locale}`, () => {
      it('has all required keys', () => {
        REQUIRED_KEYS.forEach((key) => {
          expect(kudosTranslations[locale]).toHaveProperty(key)
        })
      })

      it('has no empty values', () => {
        REQUIRED_KEYS.forEach((key) => {
          expect(kudosTranslations[locale][key].trim()).not.toBe('')
        })
      })
    })
  })

  it('secretBoxPrefix is the same across locales', () => {
    expect(kudosTranslations.VN.secretBoxPrefix).toBe(kudosTranslations.EN.secretBoxPrefix)
  })

  it('filterHashtag is the same across locales', () => {
    expect(kudosTranslations.VN.filterHashtag).toBe(kudosTranslations.EN.filterHashtag)
  })

  it('openSecretBox contains gift emoji in both locales', () => {
    expect(kudosTranslations.VN.openSecretBox).toContain('🎁')
    expect(kudosTranslations.EN.openSecretBox).toContain('🎁')
  })

  it('openButton and openingButton are different (one shows loading state)', () => {
    for (const locale of LOCALES) {
      expect(kudosTranslations[locale].openButton).not.toBe(kudosTranslations[locale].openingButton)
    }
  })

  it('VN and EN kvTagline are different strings', () => {
    expect(kudosTranslations.VN.kvTagline).not.toBe(kudosTranslations.EN.kvTagline)
  })
})
