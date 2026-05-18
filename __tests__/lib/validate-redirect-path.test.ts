import { describe, it, expect } from 'vitest'
import { validateRedirectPath } from '@/lib/utils/validate-redirect-path'

describe('validateRedirectPath — open redirect prevention', () => {
  describe('allows valid relative paths', () => {
    it.each(['/home', '/auth/callback', '/auth/callback/close', '/some/deep/path'])(
      'allows "%s"',
      (path) => {
        expect(validateRedirectPath(path)).toBe(path)
      }
    )
  })

  describe('blocks open redirect via protocol-relative URL', () => {
    it.each(['//evil.com', '//attacker.com/phishing', '//x.y.z'])(
      'blocks "%s"',
      (path) => {
        expect(validateRedirectPath(path)).toBe('/home')
      }
    )
  })

  describe('blocks absolute URLs', () => {
    it.each(['https://evil.com', 'http://attacker.com', 'ftp://host'])(
      'blocks "%s"',
      (path) => {
        expect(validateRedirectPath(path)).toBe('/home')
      }
    )
  })

  describe('uses fallback for null/empty', () => {
    it('returns default fallback for null', () => {
      expect(validateRedirectPath(null)).toBe('/home')
    })

    it('returns default fallback for empty string', () => {
      expect(validateRedirectPath('')).toBe('/home')
    })

    it('respects custom fallback', () => {
      expect(validateRedirectPath(null, '/login')).toBe('/login')
      expect(validateRedirectPath('//evil.com', '/login')).toBe('/login')
    })
  })
})
