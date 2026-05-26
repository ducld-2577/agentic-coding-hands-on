'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Loader2 } from 'lucide-react'
import { submitKudos } from '@/lib/kudos/actions'
import { KudosReceiverSearch } from './kudos-receiver-search'
import { createClient } from '@/lib/supabase/client'
import type { KudosCategory, KudosHashtag } from '@/lib/kudos/types'
import Image from 'next/image'

interface KudosSubmitDialogProps {
  open: boolean
  onClose: () => void
  categories: KudosCategory[]
  hashtags: KudosHashtag[]
  currentUserId: string
  onSuccess: () => void
  preselectedReceiver?: { id: string; full_name: string; avatar_url: string | null }
}

interface SelectedProfile {
  id: string
  full_name: string
  avatar_url: string | null
}

interface ImagePreview {
  file: File
  preview: string
  uploading: boolean
  url: string | null
}

export function KudosSubmitDialog({ open, onClose, categories, hashtags, currentUserId, onSuccess, preselectedReceiver }: KudosSubmitDialogProps) {
  const [receiver, setReceiver] = useState<SelectedProfile | null>(preselectedReceiver ?? null)
  const [categoryId, setCategoryId] = useState<number | ''>('')
  const [content, setContent] = useState('')
  const [selectedHashtagIds, setSelectedHashtagIds] = useState<number[]>([])
  const [images, setImages] = useState<ImagePreview[]>([])
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [anonymousNickname, setAnonymousNickname] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const firstFocusRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open && preselectedReceiver) setReceiver(preselectedReceiver)
  }, [open, preselectedReceiver])

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    if (open) firstFocusRef.current?.focus()
  }, [open])

  function resetForm() {
    setReceiver(null); setCategoryId(''); setContent('')
    setSelectedHashtagIds([]); setImages([])
    setIsAnonymous(false); setAnonymousNickname('')
    setError(null)
  }

  function handleClose() { resetForm(); onClose() }

  function toggleHashtag(id: number) {
    setSelectedHashtagIds(prev =>
      prev.includes(id) ? prev.filter(h => h !== id) : prev.length < 5 ? [...prev, id] : prev
    )
  }

  async function handleImageAdd(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    const allowed = files.slice(0, 5 - images.length).filter(f => f.size <= 5 * 1024 * 1024)
    if (!allowed.length) return
    const previews: ImagePreview[] = allowed.map(f => ({ file: f, preview: URL.createObjectURL(f), uploading: true, url: null }))
    setImages(prev => [...prev, ...previews])
    const supabase = createClient()
    for (const preview of previews) {
      const path = `kudos/${Date.now()}-${preview.file.name}`
      const { data, error: upErr } = await supabase.storage.from('kudos-images').upload(path, preview.file)
      const url = upErr || !data ? null : supabase.storage.from('kudos-images').getPublicUrl(data.path).data.publicUrl
      setImages(prev => prev.map(p => p.preview === preview.preview ? { ...p, uploading: false, url } : p))
    }
    e.target.value = ''
  }

  function removeImage(preview: string) {
    setImages(prev => { URL.revokeObjectURL(preview); return prev.filter(p => p.preview !== preview) })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!receiver?.id || !categoryId || !content.trim()) return
    setSubmitting(true); setError(null)
    try {
      const imageUrls = images.map(i => i.url).filter(Boolean) as string[]
      const result = await submitKudos({
        receiver_id:        receiver.id,
        content:            content.trim(),
        category_id:        Number(categoryId),
        hashtag_ids:        selectedHashtagIds,
        image_urls:         imageUrls,
        is_anonymous:       isAnonymous,
        anonymous_nickname: isAnonymous ? anonymousNickname : undefined,
      })
      if (result.error) { setError(result.error); return }
      resetForm(); onSuccess(); onClose()
    } catch {
      setError('Đã xảy ra lỗi. Vui lòng thử lại.')
    } finally {
      setSubmitting(false)
    }
  }

  const canSubmit = !!receiver?.id && !!categoryId && content.trim().length > 0 && !submitting

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.7)' }}
      onClick={handleClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Gửi lời cảm ơn"
        className="relative rounded-2xl p-8 w-full overflow-y-auto"
        style={{ background: '#0D1F2D', maxWidth: 600, maxHeight: '90vh', border: '1px solid rgba(255,255,255,0.12)' }}
        onClick={e => e.stopPropagation()}
      >
        <div ref={firstFocusRef} tabIndex={-1} className="sr-only">Dialog start</div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">Gửi lời cảm ơn và ghi nhận tới đồng đội</h2>
          <button type="button" onClick={handleClose} aria-label="Đóng" style={{ color: 'rgba(255,255,255,0.5)' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.7)' }}>Người nhận *</label>
            <KudosReceiverSearch
              currentUserId={currentUserId}
              onSelect={p => setReceiver(p.id ? p : null)}
              initialReceiver={preselectedReceiver}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.7)' }}>Danh mục *</label>
            <select
              value={categoryId}
              onChange={e => setCategoryId(e.target.value ? Number(e.target.value) : '')}
              className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: categoryId ? 'white' : 'rgba(255,255,255,0.4)' }}
            >
              <option value="" disabled style={{ background: '#0D1F2D' }}>Chọn danh mục</option>
              {categories.map(c => <option key={c.id} value={c.id} style={{ background: '#0D1F2D' }}>{c.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.7)' }}>Nội dung *</label>
            <div className="relative">
              <textarea
                value={content}
                onChange={e => setContent(e.target.value.slice(0, 1000))}
                placeholder="Hôm nay, bạn muốn gửi lời cảm ơn và ghi nhận đến ai?"
                className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none resize-none"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', minHeight: '128px' }}
              />
              <span className="absolute bottom-2 right-3 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{content.length}/1000</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.7)' }}>Hashtag (tối đa 5)</label>
            <div className="flex flex-wrap gap-2">
              {hashtags.map(h => {
                const active = selectedHashtagIds.includes(h.id)
                return (
                  <button
                    key={h.id} type="button" onClick={() => toggleHashtag(h.id)}
                    className="px-3 py-1 rounded-full text-sm font-medium transition-colors"
                    style={{ background: active ? '#F5C842' : 'rgba(255,255,255,0.08)', color: active ? '#0D1F2D' : 'rgba(255,255,255,0.7)', border: '1px solid ' + (active ? '#F5C842' : 'rgba(255,255,255,0.12)') }}
                  >
                    #{h.name}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'rgba(255,255,255,0.7)' }}>Hình ảnh (tối đa 5, mỗi file ≤ 5MB)</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {images.map(img => (
                <div key={img.preview} className="relative rounded-lg overflow-hidden" style={{ width: 80, height: 80 }}>
                  <Image src={img.preview} alt="preview" fill className="object-cover" />
                  {img.uploading && (
                    <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)' }}>
                      <Loader2 size={18} className="animate-spin text-white" />
                    </div>
                  )}
                  <button
                    type="button" onClick={() => removeImage(img.preview)}
                    className="absolute top-1 right-1 rounded-full flex items-center justify-center"
                    style={{ width: 20, height: 20, background: 'rgba(0,0,0,0.7)' }}
                    aria-label="Xoá ảnh"
                  >
                    <X size={12} className="text-white" />
                  </button>
                </div>
              ))}
              {images.length < 5 && (
                <label
                  className="flex items-center justify-center rounded-lg cursor-pointer text-2xl"
                  style={{ width: 80, height: 80, background: 'rgba(255,255,255,0.06)', border: '1px dashed rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.4)' }}
                >
                  +
                  <input type="file" accept="image/*" multiple className="sr-only" onChange={handleImageAdd} />
                </label>
              )}
            </div>
          </div>

          {/* Anonymous option */}
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={e => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 accent-[#F5C842] cursor-pointer"
              />
              <span className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
                Gửi lời cảm ơn và ghi nhận ẩn danh
              </span>
            </label>

            {isAnonymous && (
              <input
                type="text"
                value={anonymousNickname}
                onChange={e => setAnonymousNickname(e.target.value.slice(0, 50))}
                placeholder="Nickname ẩn danh..."
                className="rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                }}
              />
            )}
          </div>

          {error && <p className="text-sm" style={{ color: '#E84A4A' }}>{error}</p>}

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full rounded-full py-3 font-bold text-sm flex items-center justify-center gap-2 transition-opacity"
            style={{ background: '#F5C842', color: '#0D1F2D', opacity: canSubmit ? 1 : 0.4 }}
          >
            {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
            Gửi lời cảm ơn
          </button>
        </form>
      </div>
    </div>
  )
}
