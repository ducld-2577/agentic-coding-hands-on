'use client'

import { useEffect } from 'react'
import { Check } from 'lucide-react'

interface KudosToastProps {
  message: string
  duration?: number
  onDismiss: () => void
}

export function KudosToast({ message, duration = 3000, onDismiss }: KudosToastProps) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, duration)
    return () => clearTimeout(timer)
  }, [duration, onDismiss])

  return (
    <>
      <style>{`
        @keyframes kudosSlideIn {
          from { transform: translateX(120%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        .kudos-toast-animate {
          animation: kudosSlideIn 0.3s ease-out forwards;
        }
      `}</style>
      <div
        className="kudos-toast-animate fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-full"
        role="status"
        aria-live="polite"
        style={{
          background: 'rgba(15,30,45,0.95)',
          border: '1px solid rgba(255,255,255,0.15)',
        }}
      >
        <Check size={16} aria-hidden="true" style={{ color: '#F5C842', flexShrink: 0 }} />
        <span className="text-sm font-medium text-white">{message}</span>
      </div>
    </>
  )
}
