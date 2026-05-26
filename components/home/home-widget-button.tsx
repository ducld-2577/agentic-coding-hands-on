'use client'

import { useEffect, useRef, useState } from 'react'

export function HomeWidgetButton() {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close on click outside
  useEffect(() => {
    function handleMouseDown(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end"
    >
      {/* Dropdown panel — shown when isOpen */}
      {isOpen && (
        <div
          className={[
            'absolute bottom-[72px] right-0',
            'w-[220px] rounded-xl',
            'bg-[#0d2035] border border-white/10',
            'shadow-xl shadow-black/40',
            'p-4',
            'flex flex-col gap-3',
          ].join(' ')}
          role="dialog"
          aria-label="Widget menu"
        >
          <div className="flex items-center justify-between">
            <p className="font-montserrat text-sm text-white/80 font-medium">
              Tính năng sắp ra mắt
            </p>
            <button
              onClick={() => setIsOpen(false)}
              className={[
                'flex items-center justify-center',
                'w-6 h-6 rounded-full',
                'text-white/60 hover:text-white hover:bg-white/10',
                'transition-colors duration-150',
              ].join(' ')}
              aria-label="Đóng menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <p className="font-montserrat text-xs text-white/40 leading-5">
            Chúng tôi đang phát triển tính năng này. Vui lòng quay lại sau.
          </p>
        </div>
      )}

      {/* Pill button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        style={{ width: '105px', height: '64px' }}
        className={[
          'rounded-full',
          'bg-[#F5C518]',
          'flex items-center justify-center gap-1',
          'shadow-lg shadow-black/30',
          'transition-transform duration-150 active:scale-95',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5C518] focus-visible:ring-offset-2 focus-visible:ring-offset-[#00101A]',
        ].join(' ')}
        aria-label="Mở widget"
        aria-expanded={isOpen}
      >
        {/* Pencil icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#00101A"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>

        {/* Separator */}
        <span
          className="font-montserrat-alternates font-bold text-[#00101A] text-base leading-none select-none"
          aria-hidden="true"
        >
          /
        </span>

        {/* SAA circle icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 28 28"
          aria-hidden="true"
        >
          <circle cx="14" cy="14" r="13" fill="#00101A" stroke="#00101A" strokeWidth="1" />
          <text
            x="14"
            y="18"
            textAnchor="middle"
            fill="#F5C518"
            fontSize="9"
            fontWeight="bold"
            fontFamily="Montserrat, sans-serif"
            letterSpacing="0.5"
          >
            SAA
          </text>
        </svg>
      </button>
    </div>
  )
}
