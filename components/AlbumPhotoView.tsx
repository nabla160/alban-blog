'use client'

import { useState } from 'react'
import Lightbox from './Lightbox'
import type { Photo } from '@/types/gallery'

interface Props {
  photos: Photo[]
}

export default function AlbumPhotoView({ photos }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  if (photos.length === 0) {
    return (
      <div className="border border-[#262626] rounded-xl p-8 text-center">
        <p className="text-[#52525b] text-sm">Aucune photo dans cet album.</p>
      </div>
    )
  }

  return (
    <>
      <div className="columns-2 sm:columns-3 gap-3 space-y-3">
        {photos.map((photo, i) => (
          <button
            key={photo.id}
            onClick={() => setLightboxIndex(i)}
            className="break-inside-avoid block w-full rounded-lg overflow-hidden bg-[#141414] cursor-pointer group"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.thumb_url ?? photo.url}
              alt={photo.caption ?? `Photo ${i + 1}`}
              width={photo.thumb_width ?? undefined}
              height={photo.thumb_height ?? undefined}
              loading="lazy"
              decoding="async"
              className="w-full h-auto block group-hover:opacity-90 transition-opacity duration-200"
            />
          </button>
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          photos={photos}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex((i) => Math.max(0, (i ?? 0) - 1))}
          onNext={() => setLightboxIndex((i) => Math.min(photos.length - 1, (i ?? 0) + 1))}
        />
      )}
    </>
  )
}
