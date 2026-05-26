'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

interface HomeAccountMenuProps {
  user: User
}

function clearPkceVerifierCookie() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!supabaseUrl || typeof document === 'undefined') return

  try {
    const hostPrefix = new URL(supabaseUrl).hostname.split('.')[0]
    const verifierKey = `sb-${hostPrefix}-auth-token-code-verifier`
    document.cookie = `${verifierKey}=; Max-Age=0; path=/; SameSite=Lax`
  } catch {
    // Ignore parse failures during logout cleanup.
  }
}

function UserCircleIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" fill="white" />
      <path
        d="M4 20c0-4 3.582-7 8-7s8 3 8 7"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function HomeAccountMenu({ user }: HomeAccountMenuProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const isAdmin = user.app_metadata?.role === 'admin'

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

  async function handleSignOut() {
    try {
      const supabase = createClient()
      // Use local scope to end only this browser session and avoid
      // network-dependent global revocation races during immediate re-login.
      await supabase.auth.signOut({ scope: 'local' })
    } catch {
      // Session is cleared client-side regardless — always redirect
    }

    clearPkceVerifierCookie()
    window.location.href = '/login'
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className={[
          'flex items-center justify-center',
          'w-10 h-10 rounded-full',
          'bg-white/10 hover:bg-white/20 transition-colors duration-150',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white',
        ].join(' ')}
      >
        <UserCircleIcon />
      </button>

      {open && (
        <ul
          role="menu"
          aria-label="Account options"
          className={[
            'absolute right-0 top-full mt-2 z-50',
            'bg-[#0B0F12] border border-[#2E3940] rounded',
            'min-w-[180px]',
            'shadow-lg',
            'overflow-hidden',
          ].join(' ')}
        >
          <li role="none">
            <Link
              href="/profile"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center px-4 py-3 text-sm text-white font-montserrat hover:bg-white/10 transition-colors duration-150"
            >
              Profile
            </Link>
          </li>

          <li role="none">
            <button
              type="button"
              role="menuitem"
              onClick={handleSignOut}
              className="flex items-center w-full px-4 py-3 text-sm text-red-400 font-montserrat hover:bg-white/10 transition-colors duration-150 text-left"
            >
              Sign out
            </button>
          </li>

          {isAdmin && (
            <li role="none">
              <Link
                href="/admin"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex items-center px-4 py-3 text-sm text-white font-montserrat hover:bg-white/10 transition-colors duration-150"
              >
                Admin Dashboard
              </Link>
            </li>
          )}
        </ul>
      )}
    </div>
  )
}
