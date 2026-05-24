'use client'

import { useEffect, useRef } from 'react'
import type { KudosHashtag } from '@/lib/kudos/types'

interface KudosHashtagDropdownProps {
  hashtags: KudosHashtag[]
  selected: number[]
  onChange: (ids: number[]) => void
  onClose: () => void
}

export function KudosHashtagDropdown({
  hashtags,
  selected,
  onChange,
  onClose,
}: KudosHashtagDropdownProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  function toggle(id: number) {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id))
    } else if (selected.length < 5) {
      onChange([...selected, id])
    }
  }

  return (
    <div
      ref={ref}
      role="listbox"
      aria-multiselectable="true"
      aria-label="Chọn hashtag"
      className="absolute z-50 rounded-xl overflow-hidden"
      style={{
        backgroundColor: '#0D1F2D',
        border: '1px solid rgba(255,255,255,0.12)',
        minWidth: '220px',
        top: '100%',
        left: 0,
        marginTop: '8px',
      }}
    >
      <div
        className="flex items-center px-4 py-3 font-montserrat font-bold"
        style={{
          color: 'rgba(255,255,255,0.5)',
          fontSize: '12px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        + Hashtag · Tối đa 5
      </div>

      <ul className="py-1">
        {hashtags.map((tag) => {
          const isSelected = selected.includes(tag.id)
          const isDisabled = !isSelected && selected.length >= 5

          return (
            <li
              key={tag.id}
              role="option"
              aria-selected={isSelected}
              onClick={() => !isDisabled && toggle(tag.id)}
              className="flex items-center justify-between px-4 py-2 cursor-pointer font-montserrat"
              style={{
                color: isSelected ? '#F5C842' : 'rgba(255,255,255,0.85)',
                fontSize: '14px',
                lineHeight: '20px',
                opacity: isDisabled ? 0.4 : 1,
                pointerEvents: isDisabled ? 'none' : 'auto',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => {
                if (!isDisabled) {
                  ;(e.currentTarget as HTMLLIElement).style.background =
                    'rgba(255,255,255,0.06)'
                }
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLLIElement).style.background = 'transparent'
              }}
            >
              <span>#{tag.name}</span>
              {isSelected && (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 8L6.5 11.5L13 5"
                    stroke="#F5C842"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
