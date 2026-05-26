'use client'

import { useRef, useEffect, useState } from 'react'

function BellIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 2a7 7 0 0 0-7 7v4l-2 3h18l-2-3V9a7 7 0 0 0-7-7Z"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 19a2 2 0 0 0 4 0"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function HomeNotificationBell() {
  const [open, setOpen] = useState(false)
  // Placeholder: always false — no real notification data yet
  const hasUnread = false
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
        aria-haspopup="dialog"
        aria-expanded={open}
        className={[
          'relative flex items-center justify-center',
          'w-10 h-10 rounded-full',
          'bg-white/10 hover:bg-white/20 transition-colors duration-150',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white',
        ].join(' ')}
      >
        <BellIcon />
        {hasUnread && (
          <span
            aria-label="Unread notifications"
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500"
          />
        )}
      </button>

      {open && (
        <div
          className={[
            'absolute right-0 top-full mt-2 z-50',
            'bg-[#0B0F12] border border-[#2E3940] rounded',
            'w-[280px] px-4 py-6',
            'shadow-lg',
            'text-center text-sm text-white/50 font-montserrat',
          ].join(' ')}
          role="region"
          aria-label="Notifications panel"
        >
          Thông báo — Sắp ra mắt
        </div>
      )}
    </div>
  )
}
