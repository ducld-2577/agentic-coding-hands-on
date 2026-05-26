'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'

interface KudosImageLightboxProps {
  src: string
  onClose: () => void
}

export function KudosImageLightbox({ src, onClose }: KudosImageLightboxProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-white/70 transition-colors"
      >
        <X size={28} />
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        className="object-contain"
        style={{ maxWidth: '90vw', maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  )
}
