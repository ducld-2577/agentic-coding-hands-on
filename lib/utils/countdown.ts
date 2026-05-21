export interface CountdownResult {
  days: number
  hours: number
  minutes: number
  expired: boolean
}

/**
 * Pure function: calculates remaining time to a target ISO-8601 datetime string.
 * Returns expired=true when target is in the past, already passed, or invalid.
 */
export function calculateCountdown(targetIso: string): CountdownResult {
  const ZERO: CountdownResult = { days: 0, hours: 0, minutes: 0, expired: true }

  if (!targetIso) return ZERO

  const target = new Date(targetIso)
  if (isNaN(target.getTime())) return ZERO

  const now = Date.now()
  const diff = target.getTime() - now

  if (diff <= 0) return ZERO

  const totalMinutes = Math.floor(diff / 60_000)
  const totalHours = Math.floor(totalMinutes / 60)
  const days = Math.floor(totalHours / 24)
  const hours = totalHours % 24
  const minutes = totalMinutes % 60

  return { days, hours, minutes, expired: false }
}
