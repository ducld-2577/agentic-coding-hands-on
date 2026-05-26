'use client'

interface KudosHashtagTagProps {
  name: string
  onHashtagClick: () => void
}

export function KudosHashtagTag({ name, onHashtagClick }: KudosHashtagTagProps) {
  return (
    <button
      type="button"
      onClick={onHashtagClick}
      className="cursor-pointer bg-transparent border-none p-0 font-medium hover:underline underline-offset-2"
      style={{ color: '#E84A4A', fontSize: '13px', lineHeight: '20px' }}
    >
      #{name}
    </button>
  )
}
