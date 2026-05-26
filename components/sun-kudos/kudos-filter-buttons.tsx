'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { KudosHashtagDropdown } from './kudos-hashtag-dropdown'
import { KudosPhongbanDropdown } from './kudos-phongban-dropdown'
import type { KudosHashtag, Department, FilterState } from '@/lib/kudos/types'

interface KudosFilterButtonsProps {
  hashtags: KudosHashtag[]
  departments: Department[]
  filters: FilterState
  onFiltersChange: (f: FilterState) => void
}

type OpenPanel = 'hashtag' | 'phongban' | null

export function KudosFilterButtons({
  hashtags,
  departments,
  filters,
  onFiltersChange,
}: KudosFilterButtonsProps) {
  const [open, setOpen] = useState<OpenPanel>(null)

  const hashtagActive = filters.hashtag_ids.length > 0
  const phongbanActive = filters.department_id !== null

  function togglePanel(panel: OpenPanel) {
    setOpen((prev) => (prev === panel ? null : panel))
  }

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <button
          type="button"
          aria-expanded={open === 'hashtag'}
          aria-haspopup="listbox"
          onClick={() => togglePanel('hashtag')}
          className="flex items-center justify-center gap-1.5 font-montserrat font-bold cursor-pointer select-none"
          style={{
            height: '40px',
            paddingLeft: '16px',
            paddingRight: '12px',
            borderRadius: '8px',
            border: hashtagActive ? '1.5px solid #F5C842' : '1px solid rgba(255,255,255,0.25)',
            background: hashtagActive ? 'rgba(245,200,66,0.1)' : 'rgba(255,255,255,0.06)',
            color: hashtagActive ? '#F5C842' : 'rgba(255,255,255,0.85)',
            fontSize: '14px',
            transition: 'border 0.15s, background 0.15s',
            whiteSpace: 'nowrap',
          }}
        >
          <span>Hashtag</span>
          {hashtagActive && (
            <span
              className="flex items-center justify-center rounded-full font-bold"
              style={{
                width: '18px',
                height: '18px',
                background: '#F5C842',
                color: '#00101A',
                fontSize: '11px',
              }}
            >
              {filters.hashtag_ids.length}
            </span>
          )}
          <ChevronDown size={14} aria-hidden="true" />
        </button>

        {open === 'hashtag' && (
          <KudosHashtagDropdown
            hashtags={hashtags}
            selected={filters.hashtag_ids}
            onChange={(ids) => onFiltersChange({ ...filters, hashtag_ids: ids })}
            onClose={() => setOpen(null)}
          />
        )}
      </div>

      <div className="relative">
        <button
          type="button"
          aria-expanded={open === 'phongban'}
          aria-haspopup="listbox"
          onClick={() => togglePanel('phongban')}
          className="flex items-center justify-center gap-1.5 font-montserrat font-bold cursor-pointer select-none"
          style={{
            height: '40px',
            paddingLeft: '16px',
            paddingRight: '12px',
            borderRadius: '8px',
            border: phongbanActive ? '1.5px solid #F5C842' : '1px solid rgba(255,255,255,0.25)',
            background: phongbanActive ? 'rgba(245,200,66,0.1)' : 'rgba(255,255,255,0.06)',
            color: phongbanActive ? '#F5C842' : 'rgba(255,255,255,0.85)',
            fontSize: '14px',
            transition: 'border 0.15s, background 0.15s',
            whiteSpace: 'nowrap',
          }}
        >
          <span>Phòng ban</span>
          <ChevronDown size={14} aria-hidden="true" />
        </button>

        {open === 'phongban' && (
          <KudosPhongbanDropdown
            departments={departments}
            selected={filters.department_id}
            onChange={(id) => onFiltersChange({ ...filters, department_id: id })}
            onClose={() => setOpen(null)}
          />
        )}
      </div>
    </div>
  )
}
