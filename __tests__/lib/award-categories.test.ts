import { describe, it, expect } from 'vitest'
import { AWARD_CATEGORIES, AWARD_DETAILS } from '@/lib/data/award-categories'

describe('AWARD_CATEGORIES static data', () => {
  it('has exactly 6 categories', () => {
    expect(AWARD_CATEGORIES).toHaveLength(6)
  })

  it('all slugs are unique', () => {
    const slugs = AWARD_CATEGORIES.map((a) => a.slug)
    const unique = new Set(slugs)
    expect(unique.size).toBe(slugs.length)
  })

  it('all slugs are kebab-case (lowercase, hyphens only, no spaces)', () => {
    for (const award of AWARD_CATEGORIES) {
      expect(award.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
    }
  })

  it('no category has an empty title or description', () => {
    for (const award of AWARD_CATEGORIES) {
      expect(award.title.trim()).not.toBe('')
      expect(award.description.trim()).not.toBe('')
    }
  })

  it('all textLogoSrc paths start with /awards/', () => {
    for (const award of AWARD_CATEGORIES) {
      expect(award.textLogoSrc).toMatch(/^\/awards\//)
    }
  })
})

describe('AWARD_DETAILS static data', () => {
  it('has exactly 6 entries', () => {
    expect(AWARD_DETAILS).toHaveLength(6)
  })

  it('slugs match AWARD_CATEGORIES exactly (home page anchor links depend on this)', () => {
    const catSlugs = AWARD_CATEGORIES.map((a) => a.slug)
    const detailSlugs = AWARD_DETAILS.map((a) => a.slug)
    expect(detailSlugs).toEqual(catSlugs)
  })

  it('data accuracy — count, unit, value match spec', () => {
    const bySlug = Object.fromEntries(AWARD_DETAILS.map((a) => [a.slug, a]))

    expect(bySlug['top-talent']).toMatchObject({ count: '10', unit: 'Cá nhân', value: '7.000.000 VNĐ' })
    expect(bySlug['top-project']).toMatchObject({ count: '02', unit: 'Tập thể', value: '15.000.000 VNĐ' })
    expect(bySlug['top-project-leader']).toMatchObject({ count: '03', unit: 'Cá nhân', value: '7.000.000 VNĐ' })
    expect(bySlug['best-manager']).toMatchObject({ count: '01', unit: 'Cá nhân', value: '10.000.000 VNĐ' })
    expect(bySlug['signature-creator']).toMatchObject({ count: '01', value: '5.000.000 VNĐ', valueAlt: '8.000.000 VNĐ' })
    expect(bySlug['mvp']).toMatchObject({ count: '01', value: '15.000.000 VNĐ' })
  })

  it('only signature-creator has valueAlt and valueAltSuffix', () => {
    for (const award of AWARD_DETAILS) {
      if (award.slug === 'signature-creator') {
        expect(award.valueAlt).toBeDefined()
        expect(award.valueAltSuffix).toBeDefined()
      } else {
        expect(award.valueAlt).toBeUndefined()
        expect(award.valueAltSuffix).toBeUndefined()
      }
    }
  })

  it('all descriptionLong fields are non-empty strings', () => {
    for (const award of AWARD_DETAILS) {
      expect(award.descriptionLong.trim()).not.toBe('')
    }
  })
})
