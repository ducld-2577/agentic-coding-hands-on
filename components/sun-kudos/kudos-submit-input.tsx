'use client'

import { PenLine } from 'lucide-react'

interface KudosSubmitInputProps {
  onOpen: () => void
}

export function KudosSubmitInput({ onOpen }: KudosSubmitInputProps) {
  return (
    <div className="flex justify-center w-full">
      <div
        role="button"
        tabIndex={0}
        aria-label="Mở form gửi lời cảm ơn"
        onClick={onOpen}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') onOpen()
        }}
        className="flex items-center gap-3 cursor-pointer select-none"
        style={{
          width: '738px',
          maxWidth: '100%',
          height: '72px',
          borderRadius: '9999px',
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.12)',
          paddingLeft: '28px',
          paddingRight: '28px',
        }}
      >
        <PenLine
          size={20}
          aria-hidden="true"
          style={{ color: 'rgba(255,255,255,0.5)', flexShrink: 0 }}
        />
        <span
          className="font-montserrat"
          style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', lineHeight: '24px' }}
        >
          Hôm nay, bạn muốn gửi lời cảm ơn và ghi nhận đến ai?
        </span>
      </div>
    </div>
  )
}
