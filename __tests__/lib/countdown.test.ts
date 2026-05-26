import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { calculateCountdown } from '@/lib/utils/countdown'

describe('calculateCountdown', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns correct days/hours/minutes for a future datetime', () => {
    // now = 2026-01-01 00:00:00 UTC → target = +1d 1h 30m
    vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'))
    const target = '2026-01-02T01:30:00.000Z'
    const result = calculateCountdown(target)
    expect(result).toEqual({ days: 1, hours: 1, minutes: 30, expired: false })
  })

  it('returns expired=true for a past datetime', () => {
    vi.setSystemTime(new Date('2026-01-02T00:00:00.000Z'))
    const result = calculateCountdown('2026-01-01T00:00:00.000Z')
    expect(result.expired).toBe(true)
    expect(result.days).toBe(0)
    expect(result.hours).toBe(0)
    expect(result.minutes).toBe(0)
  })

  it('returns expired=true for an invalid ISO string', () => {
    vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'))
    const result = calculateCountdown('not-a-valid-date')
    expect(result.expired).toBe(true)
  })

  it('returns expired=true for an empty string', () => {
    const result = calculateCountdown('')
    expect(result.expired).toBe(true)
  })

  it('returns all zeros and expired=false when less than 1 minute remains', () => {
    // 30 seconds before target → totalMinutes=0, expired=false
    vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'))
    const result = calculateCountdown('2026-01-01T00:00:30.000Z')
    expect(result).toEqual({ days: 0, hours: 0, minutes: 0, expired: false })
  })

  it('returns minutes=1 at exactly 1 minute remaining', () => {
    vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'))
    const result = calculateCountdown('2026-01-01T00:01:00.000Z')
    expect(result).toEqual({ days: 0, hours: 0, minutes: 1, expired: false })
  })

  it('correctly decomposes multi-day durations', () => {
    // 3d 2h 45m = 4485 minutes from now
    vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'))
    const result = calculateCountdown('2026-01-04T02:45:00.000Z')
    expect(result).toEqual({ days: 3, hours: 2, minutes: 45, expired: false })
  })

  it('handles timezone-offset ISO strings without crashing', () => {
    vi.setSystemTime(new Date('2026-01-01T00:00:00.000Z'))
    // +07:00 offset — should still be a valid future datetime
    const result = calculateCountdown('2026-01-02T07:30:00+07:00')
    expect(result.expired).toBe(false)
    expect(result.days).toBeGreaterThanOrEqual(0)
  })
})
