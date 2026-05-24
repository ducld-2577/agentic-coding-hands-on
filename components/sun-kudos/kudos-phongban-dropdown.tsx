'use client'

import { useEffect, useRef } from 'react'
import type { Department } from '@/lib/kudos/types'

interface KudosPhongbanDropdownProps {
  departments: Department[]
  selected: number | null
  onChange: (id: number | null) => void
  onClose: () => void
}

export function KudosPhongbanDropdown({
  departments,
  selected,
  onChange,
  onClose,
}: KudosPhongbanDropdownProps) {
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

  function handleSelect(id: number) {
    onChange(selected === id ? null : id)
  }

  return (
    <div
      ref={ref}
      role="listbox"
      aria-label="Chọn phòng ban"
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
        Phòng ban
      </div>

      <ul className="py-1">
        {departments.map((dept) => {
          const isSelected = selected === dept.id

          return (
            <li
              key={dept.id}
              role="option"
              aria-selected={isSelected}
              onClick={() => handleSelect(dept.id)}
              className="flex items-center cursor-pointer font-montserrat"
              style={{
                color: isSelected ? '#F5C842' : 'rgba(255,255,255,0.85)',
                fontSize: '14px',
                lineHeight: '20px',
                borderLeft: isSelected ? '3px solid #F5C842' : '3px solid transparent',
                paddingLeft: isSelected ? '13px' : '13px',
                paddingRight: '16px',
                paddingTop: '8px',
                paddingBottom: '8px',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLLIElement).style.background = 'rgba(255,255,255,0.06)'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLLIElement).style.background = 'transparent'
              }}
            >
              {dept.name}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
