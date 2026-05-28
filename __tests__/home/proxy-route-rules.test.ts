import { describe, it, expect } from 'vitest'
import { PUBLIC_ROUTES, PROTECTED_ROUTES, config } from '@/proxy'

describe('PROTECTED_ROUTES', () => {
  it.each(['/home', '/admin', '/profile', '/sun-kudos', '/awards-information'])(
    '%s is protected',
    (route) => {
      expect(PROTECTED_ROUTES).toContain(route)
    }
  )

  it('contains exactly 5 routes', () => {
    expect(PROTECTED_ROUTES).toHaveLength(5)
  })

  it('/countdown is NOT protected (intentionally public prelaunch page)', () => {
    expect(PROTECTED_ROUTES).not.toContain('/countdown')
  })

  it('sub-paths of protected routes are also matched via startsWith', () => {
    // proxy uses path.startsWith(r), so /profile/123 is protected
    expect(PROTECTED_ROUTES.some((r) => '/profile/123'.startsWith(r))).toBe(true)
    expect(PROTECTED_ROUTES.some((r) => '/awards-information/details'.startsWith(r))).toBe(true)
  })
})

describe('PUBLIC_ROUTES', () => {
  it.each(['/login', '/auth/callback', '/auth/callback/close'])(
    '%s is public',
    (route) => {
      expect(PUBLIC_ROUTES).toContain(route)
    }
  )

  it('contains exactly 3 routes', () => {
    expect(PUBLIC_ROUTES).toHaveLength(3)
  })
})

describe('middleware matcher config', () => {
  it('exports a config object with a matcher array', () => {
    expect(config).toBeDefined()
    expect(Array.isArray(config.matcher)).toBe(true)
    expect(config.matcher.length).toBeGreaterThan(0)
  })

  it('matcher excludes static assets (_next/static, _next/image, favicon, images)', () => {
    const pattern = config.matcher[0]
    // The pattern is a negative-lookahead regex string — static paths should not match
    expect(pattern).toContain('_next/static')
    expect(pattern).toContain('_next/image')
    expect(pattern).toContain('favicon.ico')
  })
})
