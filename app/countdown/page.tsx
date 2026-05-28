import type { Metadata } from 'next'
import { CountdownPrelaunch } from '@/components/countdown/countdown-prelaunch'

export const metadata: Metadata = { title: 'Countdown' }

export default function CountdownPage() {
  return <CountdownPrelaunch />
}
