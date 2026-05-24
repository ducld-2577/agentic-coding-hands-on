'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Search, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

interface ProfileResult {
  id: string
  full_name: string
  avatar_url: string | null
  department_id: number | null
}

interface KudosReceiverSearchProps {
  onSelect: (profile: { id: string; full_name: string; avatar_url: string | null }) => void
  currentUserId: string
}

export function KudosReceiverSearch({ onSelect, currentUserId }: KudosReceiverSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<ProfileResult[]>([])
  const [selected, setSelected] = useState<{ id: string; full_name: string; avatar_url: string | null } | null>(null)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([])
      setOpen(false)
      return
    }
    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, department_id')
        .ilike('full_name', `%${q}%`)
        .limit(10)
      if (!error && data) {
        setResults(data.filter((p) => p.id !== currentUserId))
        setOpen(true)
      }
    } finally {
      setLoading(false)
    }
  }, [currentUserId])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => search(query), 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query, search])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleSelect(profile: ProfileResult) {
    const sel = { id: profile.id, full_name: profile.full_name, avatar_url: profile.avatar_url }
    setSelected(sel)
    onSelect(sel)
    setQuery('')
    setOpen(false)
  }

  function handleDeselect() {
    setSelected(null)
    onSelect({ id: '', full_name: '', avatar_url: null })
  }

  return (
    <div ref={containerRef} className="relative w-full">
      {selected ? (
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl w-fit"
          style={{ background: 'rgba(245,200,66,0.15)', border: '1px solid rgba(245,200,66,0.4)' }}
        >
          {selected.avatar_url ? (
            <Image
              src={selected.avatar_url}
              alt={selected.full_name}
              width={24}
              height={24}
              className="rounded-full object-cover"
            />
          ) : (
            <div
              className="rounded-full flex items-center justify-center text-xs font-bold"
              style={{ width: 24, height: 24, background: '#F5C842', color: '#0D1F2D' }}
            >
              {selected.full_name.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="text-sm font-medium text-white">{selected.full_name}</span>
          <button
            type="button"
            onClick={handleDeselect}
            aria-label="Bỏ chọn người nhận"
            className="ml-1"
            style={{ color: 'rgba(255,255,255,0.6)' }}
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div
          className="flex items-center gap-2 px-4 rounded-xl"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            height: '44px',
          }}
        >
          <Search size={16} aria-hidden="true" style={{ color: 'rgba(255,255,255,0.4)', flexShrink: 0 }} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm kiếm người nhận..."
            autoFocus
            className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-white/40"
          />
          {loading && (
            <div
              className="rounded-full border-2 border-t-transparent animate-spin"
              style={{ width: 14, height: 14, borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'transparent' }}
            />
          )}
        </div>
      )}

      {open && results.length > 0 && (
        <div
          className="absolute left-0 right-0 top-full mt-1 rounded-xl overflow-hidden z-10"
          style={{ background: '#0D1F2D', border: '1px solid rgba(255,255,255,0.12)', maxHeight: '240px', overflowY: 'auto' }}
        >
          {results.map((profile) => (
            <button
              key={profile.id}
              type="button"
              onClick={() => handleSelect(profile)}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-left transition-colors hover:bg-white/5"
            >
              {profile.avatar_url ? (
                <Image
                  src={profile.avatar_url}
                  alt={profile.full_name}
                  width={32}
                  height={32}
                  className="rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div
                  className="rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ width: 32, height: 32, background: '#F5C842', color: '#0D1F2D' }}
                >
                  {profile.full_name.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="text-sm text-white">{profile.full_name}</span>
            </button>
          ))}
        </div>
      )}

      {open && !loading && results.length === 0 && query.trim() && (
        <div
          className="absolute left-0 right-0 top-full mt-1 rounded-xl px-4 py-3 text-sm"
          style={{
            background: '#0D1F2D',
            border: '1px solid rgba(255,255,255,0.12)',
            color: 'rgba(255,255,255,0.5)',
          }}
        >
          Không tìm thấy kết quả
        </div>
      )}
    </div>
  )
}
