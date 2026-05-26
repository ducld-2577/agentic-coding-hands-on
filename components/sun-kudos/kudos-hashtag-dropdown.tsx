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

      <div className="flex flex-wrap gap-2 p-4">
        {hashtags.map((tag) => {
          const isSelected = selected.includes(tag.id)
          const isDisabled = !isSelected && selected.length >= 5

          return (
            <button
              key={tag.id}
              type="button"
              role="option"
              aria-selected={isSelected}
              onClick={() => !isDisabled && toggle(tag.id)}
              className="font-montserrat font-medium cursor-pointer select-none"
              style={{
                height: '32px',
                padding: '0 12px',
                borderRadius: '20px',
                border: isSelected ? '1px solid #F5C842' : '1px solid rgba(255,255,255,0.2)',
                background: isSelected ? 'rgba(245,200,66,0.15)' : 'rgba(255,255,255,0.06)',
                color: isSelected ? '#F5C842' : 'rgba(255,255,255,0.75)',
                fontSize: '13px',
                opacity: isDisabled ? 0.35 : 1,
                pointerEvents: isDisabled ? 'none' : 'auto',
                transition: 'border 0.15s, background 0.15s, color 0.15s',
                whiteSpace: 'nowrap',
              }}
            >
              #{tag.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}
