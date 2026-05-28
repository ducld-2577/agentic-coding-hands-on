'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { X, Gift } from 'lucide-react'
import { openSecretBox } from '@/lib/kudos/actions'
import type { SecretBox } from '@/lib/kudos/types'
import { useLocale } from '@/lib/i18n/use-locale'
import { kudosTranslations } from '@/lib/i18n/kudos-translations'

interface BoxState {
  id: string
  is_opened: boolean
  prize_description: string | null
  opening: boolean
  revealed: boolean
}

interface KudosSecretBoxDialogProps {
  open: boolean
  onClose: () => void
  secretBoxes: SecretBox[]
}

export function KudosSecretBoxDialog({ open, onClose, secretBoxes }: KudosSecretBoxDialogProps) {
  // Compute box display state directly from props
  const displayBoxes = secretBoxes.map(b => ({
    id: b.id,
    is_opened: b.is_opened,
    prize_description: b.prize_description,
    opening: false,
    revealed: false,
  }))

  const [boxes, setBoxes] = useState<BoxState[]>(displayBoxes)
  const [shakingId, setShakingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const firstFocusRef = useRef<HTMLButtonElement>(null)
  const shakeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const locale = useLocale()
  const t = kudosTranslations[locale]

  useEffect(() => () => { if (shakeTimerRef.current) clearTimeout(shakeTimerRef.current) }, [])

  // Memoize the clear error callback
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Focus and clear error when dialog opens
  useEffect(() => {
    if (open) {
      setTimeout(() => firstFocusRef.current?.focus(), 50)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      clearError()
    }
  }, [open, clearError])

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  async function handleOpen(boxId: string) {
    setShakingId(boxId)
    setBoxes(prev => prev.map(b => b.id === boxId ? { ...b, opening: true } : b))
    const timer = setTimeout(() => setShakingId(null), 600)
    shakeTimerRef.current = timer

    try {
      const result = await openSecretBox(boxId)
      if (result.error) {
        setError(result.error)
        setBoxes(prev => prev.map(b => b.id === boxId ? { ...b, opening: false } : b))
        return
      }
      setBoxes(prev =>
        prev.map(b =>
          b.id === boxId
            ? { ...b, is_opened: true, opening: false, revealed: true, prize_description: result.prize_description ?? null }
            : b
        )
      )
    } catch {
      setError(t.errorMessage)
      setBoxes(prev => prev.map(b => b.id === boxId ? { ...b, opening: false } : b))
    }
  }

  const unopened = boxes.filter(b => !b.is_opened)
  const opened = boxes.filter(b => b.is_opened)
  const orderedBoxes = [...unopened, ...opened]

  if (!open) return null

  return (
    <>
      <style>{`
        @keyframes secretBoxShake {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          20%       { transform: translateX(-6px) rotate(-3deg); }
          40%       { transform: translateX(6px) rotate(3deg); }
          60%       { transform: translateX(-4px) rotate(-2deg); }
          80%       { transform: translateX(4px) rotate(2deg); }
        }
        .secret-box-shake { animation: secretBoxShake 0.6s ease-in-out; }

        @keyframes prizeFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .prize-fade-in { animation: prizeFadeIn 0.4s ease-out forwards; }
      `}</style>

      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ background: 'rgba(0,0,0,0.7)' }}
        onClick={onClose}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t.secretBoxDialogLabel}
          className="relative rounded-2xl p-8 w-full overflow-y-auto"
          style={{ background: '#0D1F2D', maxWidth: 480, maxHeight: '90vh', border: '1px solid rgba(255,255,255,0.12)' }}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white">{t.secretBoxDialogLabel}</h2>
            <button
              ref={firstFocusRef}
              type="button"
              onClick={onClose}
              aria-label={t.closeAriaLabel}
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              <X size={20} />
            </button>
          </div>

          {error && (
            <p className="mb-4 text-sm" style={{ color: '#E84A4A' }}>{error}</p>
          )}

          {boxes.length === 0 ? (
            <p className="text-sm text-center py-8" style={{ color: 'rgba(255,255,255,0.5)' }}>
                {t.noSecretBoxes}
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {orderedBoxes.map((box, idx) => {
                const isShaking = shakingId === box.id
                return (
                  <div
                    key={box.id}
                    className={`flex flex-col gap-2 rounded-xl p-4 ${isShaking ? 'secret-box-shake' : ''}`}
                    style={{
                      background: box.is_opened ? 'rgba(255,255,255,0.04)' : 'rgba(245,200,66,0.08)',
                      border: `1px solid ${box.is_opened ? 'rgba(255,255,255,0.08)' : 'rgba(245,200,66,0.25)'}`,
                      opacity: box.is_opened && !box.revealed ? 0.6 : 1,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Gift
                          size={20}
                          aria-hidden="true"
                          style={{ color: box.is_opened ? 'rgba(255,255,255,0.4)' : '#F5C842', flexShrink: 0 }}
                        />
                        <span
                          className="text-sm font-medium"
                          style={{ color: box.is_opened ? 'rgba(255,255,255,0.5)' : 'white' }}
                        >
                          {t.secretBoxPrefix}{idx + 1}
                        </span>
                      </div>

                      {box.is_opened ? (
                        <span
                          className="text-xs px-2 py-1 rounded-full"
                          style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}
                        >
                          {t.openedBadge}
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleOpen(box.id)}
                          disabled={box.opening}
                          className="px-4 py-1.5 rounded-full text-sm font-bold transition-opacity"
                          style={{
                            background: '#F5C842',
                            color: '#0D1F2D',
                            opacity: box.opening ? 0.6 : 1,
                          }}
                        >
                          {box.opening ? t.openingButton : t.openButton}
                        </button>
                      )}
                    </div>

                    {box.is_opened && box.prize_description && (
                      <p
                        className={`text-sm pl-8 ${box.revealed ? 'prize-fade-in' : ''}`}
                        style={{ color: 'rgba(255,255,255,0.7)' }}
                      >
                        {box.prize_description}
                      </p>
                    )}

                    {box.is_opened && !box.prize_description && (
                      <p
                        className="text-sm pl-8"
                        style={{ color: 'rgba(255,255,255,0.4)' }}
                      >
                        {t.noPrize}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
