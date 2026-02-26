'use client'

import { useEffect, useCallback } from 'react'
import Image from 'next/image'
import type { Photo, ExifData } from '@/types/gallery'

interface Props {
  photos: Photo[]
  index: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

function formatShutter(seconds: number): string {
  if (seconds >= 1) return `${seconds}s`
  return `1/${Math.round(1 / seconds)}s`
}

function parseExif(raw: string | null): ExifData | null {
  if (!raw) return null
  try { return JSON.parse(raw) } catch { return null }
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

export default function Lightbox({ photos, index, onClose, onPrev, onNext }: Props) {
  const photo = photos[index]
  const exif = parseExif(photo.exif_data ?? null)

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    },
    [onClose, onPrev, onNext]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [handleKey])

  let touchStartX = 0
  function handleTouchStart(e: React.TouchEvent) { touchStartX = e.touches[0].clientX }
  function handleTouchEnd(e: React.TouchEvent) {
    const delta = touchStartX - e.changedTouches[0].clientX
    if (Math.abs(delta) > 50) delta > 0 ? onNext() : onPrev()
  }

  const mapsUrl = exif?.gps_lat != null && exif?.gps_lon != null
    ? `https://maps.google.com/?q=${exif.gps_lat},${exif.gps_lon}`
    : null

  const hasMetadata = exif && (exif.taken_at || exif.make || exif.aperture || exif.shutter || exif.iso)

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center"
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Bouton fermer */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-[#71717a] hover:text-white transition-colors p-2 z-10"
        aria-label="Fermer"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
        </svg>
      </button>

      {/* Compteur */}
      <div className="absolute top-4 left-4 text-[#52525b] text-xs font-mono z-10">
        {index + 1} / {photos.length}
      </div>

      {/* Flèche gauche */}
      {index > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev() }}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#71717a] hover:text-[#f59e0b] transition-colors p-3 z-10"
          aria-label="Photo précédente"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      )}

      {/* Image + métadonnées */}
      <div
        className="flex flex-col items-center px-12"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={photo.url}
          alt={photo.caption ?? ''}
          width={1400}
          height={1000}
          className="max-w-[88vw] max-h-[72vh] object-contain rounded-lg"
          priority
        />

        {/* Bande d'infos sous la photo */}
        {(photo.caption || photo.location || hasMetadata) && (
          <div className="mt-4 max-w-[88vw] w-full space-y-2 border-t border-[#1a1a1a] pt-3">
            {/* Caption */}
            {photo.caption && (
              <p className="text-center text-[#a1a1aa] text-sm">{photo.caption}</p>
            )}

            {/* Date + lieu */}
            {(exif?.taken_at || photo.location) && (
              <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
                {exif?.taken_at && (
                  <span className="text-[#71717a] text-xs flex items-center gap-1.5">
                    <span>📅</span> {formatDate(exif.taken_at)}
                  </span>
                )}
                {photo.location && (
                  mapsUrl ? (
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#71717a] text-xs flex items-center gap-1.5 hover:text-[#f59e0b] transition-colors"
                    >
                      <span>📍</span> {photo.location}
                    </a>
                  ) : (
                    <span className="text-[#71717a] text-xs flex items-center gap-1.5">
                      <span>📍</span> {photo.location}
                    </span>
                  )
                )}
              </div>
            )}

            {/* Matériel */}
            {exif && (exif.make || exif.model || exif.lens) && (
              <p className="text-center text-[#52525b] text-xs">
                📷{' '}
                {[exif.make, exif.model].filter(Boolean).join(' ')}
                {exif.lens && ` · ${exif.lens}`}
              </p>
            )}

            {/* Réglages */}
            {exif && (exif.aperture || exif.shutter || exif.iso || exif.focal_length) && (
              <p className="text-center text-[#52525b] text-xs font-mono">
                {[
                  exif.shutter != null && formatShutter(exif.shutter),
                  exif.aperture != null && `f/${exif.aperture}`,
                  exif.iso != null && `ISO ${exif.iso}`,
                  exif.focal_length != null && `${exif.focal_length}mm`,
                ].filter(Boolean).join('  ·  ')}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Flèche droite */}
      {index < photos.length - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext() }}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#71717a] hover:text-[#f59e0b] transition-colors p-3 z-10"
          aria-label="Photo suivante"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      )}
    </div>
  )
}
