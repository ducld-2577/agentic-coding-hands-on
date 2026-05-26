'use client'

import { useState } from 'react'
import Image from 'next/image'
import { KudosImageLightbox } from './kudos-image-lightbox'

interface KudosImageGalleryProps {
  urls: string[]
}

export function KudosImageGallery({ urls }: KudosImageGalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const visible = urls.slice(0, 5)

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {visible.map((url, i) => (
          <button
            key={url}
            type="button"
            onClick={() => setOpenIndex(i)}
            className="p-0 border-0 bg-transparent cursor-pointer"
            aria-label={`View image ${i + 1}`}
          >
            <Image
              src={url}
              alt=""
              width={80}
              height={80}
              className="rounded-lg object-cover"
              style={{ width: 80, height: 80 }}
            />
          </button>
        ))}
      </div>
      {openIndex !== null && (
        <KudosImageLightbox
          src={urls[openIndex]}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </>
  )
}
