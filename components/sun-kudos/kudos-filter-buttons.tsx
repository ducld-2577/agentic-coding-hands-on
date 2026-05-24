'use client'

import { useState } from 'react'
import { Hash, Building2 } from 'lucide-react'
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
          className="flex items-center gap-2 font-montserrat font-bold cursor-pointer select-none"
          style={{
            width: '136px',
            height: '56px',
            borderRadius: '9999px',
            border: hashtagActive ? '1.5px solid #F5C842' : '1px solid rgba(255,255,255,0.2)',
            background: hashtagActive ? 'rgba(245,200,66,0.1)' : 'rgba(255,255,255,0.06)',
            color: hashtagActive ? '#F5C842' : 'rgba(255,255,255,0.85)',
            fontSize: '14px',
            justifyContent: 'center',
            transition: 'border 0.15s, background 0.15s',
          }}
        >
          <Hash size={16} aria-hidden="true" />
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
                marginLeft: '2px',
              }}
            >
              {filters.hashtag_ids.length}
            </span>
          )}
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
          className="flex items-center gap-2 font-montserrat font-bold cursor-pointer select-none"
          style={{
            width: '158px',
            height: '56px',
            borderRadius: '9999px',
            border: phongbanActive ? '1.5px solid #F5C842' : '1px solid rgba(255,255,255,0.2)',
            background: phongbanActive ? 'rgba(245,200,66,0.1)' : 'rgba(255,255,255,0.06)',
            color: phongbanActive ? '#F5C842' : 'rgba(255,255,255,0.85)',
            fontSize: '14px',
            justifyContent: 'center',
            transition: 'border 0.15s, background 0.15s',
          }}
        >
          <Building2 size={16} aria-hidden="true" />
          <span>Phòng ban</span>
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
