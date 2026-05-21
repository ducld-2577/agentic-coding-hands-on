import { describe, it, expect } from 'vitest'
import { AWARD_CATEGORIES } from '@/lib/data/award-categories'

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

  it('all imageSrc paths start with /awards/', () => {
    for (const award of AWARD_CATEGORIES) {
      expect(award.imageSrc).toMatch(/^\/awards\//)
    }
  })
})
