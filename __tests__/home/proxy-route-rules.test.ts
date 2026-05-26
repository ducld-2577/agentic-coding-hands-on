import { describe, it, expect } from 'vitest'
import { PUBLIC_ROUTES, PROTECTED_ROUTES } from '@/proxy'

describe('proxy route rules', () => {
  it('/home is in PROTECTED_ROUTES', () => {
    expect(PROTECTED_ROUTES).toContain('/home')
  })

  it('/login is in PUBLIC_ROUTES', () => {
    expect(PUBLIC_ROUTES).toContain('/login')
  })
})
